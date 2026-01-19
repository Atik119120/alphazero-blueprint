import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course, Video, CourseWithVideos, CourseWithProgress, VideoWithProgress, VideoProgress } from '@/types/lms';
import { useAuth } from '@/contexts/AuthContext';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('courses').select('*').order('created_at', { ascending: false });
      
      if (!isAdmin) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setCourses((data || []) as Course[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [isAdmin]);

  return { courses, isLoading, error, refetch: fetchCourses };
}

export function useCourseWithVideos(courseId: string) {
  const [course, setCourse] = useState<CourseWithVideos | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = async () => {
    setIsLoading(true);
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();

      if (courseError) throw courseError;
      if (!courseData) throw new Error('Course not found');

      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (videosError) throw videosError;

      setCourse({
        ...(courseData as Course),
        videos: (videosData || []) as Video[],
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  return { course, isLoading, error, refetch: fetchCourse };
}

export function useStudentCourses() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const fetchStudentCourses = async () => {
    if (!user || !profile) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Get pass codes linked to this profile
      const { data: passCodeData, error: passCodeError } = await supabase
        .from('pass_codes')
        .select('id')
        .eq('student_id', profile.id)
        .eq('is_active', true);

      if (passCodeError) throw passCodeError;

      if (!passCodeData || passCodeData.length === 0) {
        setCourses([]);
        setIsLoading(false);
        return;
      }

      const passCodeIds = passCodeData.map(pc => pc.id);

      // Get course IDs assigned to these pass codes
      const { data: assignedCourses, error: assignedError } = await supabase
        .from('pass_code_courses')
        .select('course_id')
        .in('pass_code_id', passCodeIds);

      if (assignedError) throw assignedError;

      if (!assignedCourses || assignedCourses.length === 0) {
        setCourses([]);
        setIsLoading(false);
        return;
      }

      const courseIds = [...new Set(assignedCourses.map(ac => ac.course_id))];

      // Fetch courses with videos
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .in('id', courseIds)
        .eq('is_published', true);

      if (coursesError) throw coursesError;

      // Fetch all videos for these courses
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .in('course_id', courseIds)
        .order('order_index', { ascending: true });

      if (videosError) throw videosError;

      // Fetch video progress
      const { data: progressData, error: progressError } = await supabase
        .from('video_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      // Fetch course completions
      const { data: completionsData, error: completionsError } = await supabase
        .from('course_completions')
        .select('*')
        .eq('user_id', user.id);

      if (completionsError) throw completionsError;

      const progressMap = new Map((progressData || []).map((p: VideoProgress) => [p.video_id, p]));
      const completionSet = new Set((completionsData || []).map((c: { course_id: string }) => c.course_id));

      // Build courses with progress
      const coursesWithProgress: CourseWithProgress[] = (coursesData || []).map((course: Course) => {
        const courseVideos = (videosData || []).filter((v: Video) => v.course_id === course.id);
        
        let lastCompletedIndex = -1;
        const videosWithProgress: VideoWithProgress[] = courseVideos.map((video: Video, index: number) => {
          const progress = progressMap.get(video.id) as VideoProgress | undefined;
          const isCompleted = progress?.is_completed || false;
          
          if (isCompleted) {
            lastCompletedIndex = index;
          }

          // Video is locked if previous video is not completed (except first video)
          const isLocked = index > 0 && lastCompletedIndex < index - 1;

          return {
            ...video,
            progress,
            is_locked: isLocked,
          };
        });

        // Recalculate locks after determining completed videos
        for (let i = 1; i < videosWithProgress.length; i++) {
          const prevVideo = videosWithProgress[i - 1];
          videosWithProgress[i].is_locked = !prevVideo.progress?.is_completed;
        }

        const completedCount = videosWithProgress.filter(v => v.progress?.is_completed).length;
        const totalVideos = videosWithProgress.length;
        const progressPercent = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

        return {
          ...course,
          videos: videosWithProgress,
          total_videos: totalVideos,
          completed_videos: completedCount,
          progress_percent: progressPercent,
          is_completed: completionSet.has(course.id),
        };
      });

      setCourses(coursesWithProgress);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentCourses();
  }, [user, profile]);

  return { courses, isLoading, error, refetch: fetchStudentCourses };
}

export function useVideoProgress(videoId: string) {
  const { user } = useAuth();

  const updateProgress = async (progressPercent: number) => {
    if (!user) return;

    const isCompleted = progressPercent >= 100;

    const { error } = await supabase
      .from('video_progress')
      .upsert({
        user_id: user.id,
        video_id: videoId,
        progress_percent: Math.min(100, Math.round(progressPercent)),
        is_completed: isCompleted,
        last_watched_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,video_id',
      });

    if (error) {
      console.error('Error updating progress:', error);
    }

    return { error, isCompleted };
  };

  return { updateProgress };
}
