import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentCourses, useVideoProgress } from '@/hooks/useCourses';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { BookOpen, Play, Lock, CheckCircle, LogOut, Award, ArrowLeft } from 'lucide-react';
import { CourseWithProgress, VideoWithProgress } from '@/types/lms';

export default function StudentDashboard() {
  const { user, profile, signOut, isLoading: authLoading } = useAuth();
  const { courses, isLoading, refetch } = useStudentCourses();
  const navigate = useNavigate();
  
  const [selectedCourse, setSelectedCourse] = useState<CourseWithProgress | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoWithProgress | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const openCourse = (course: CourseWithProgress) => {
    setSelectedCourse(course);
  };

  const playVideo = (video: VideoWithProgress) => {
    if (video.is_locked) {
      toast.error('আগের ভিডিও সম্পূর্ণ করুন');
      return;
    }
    setSelectedVideo(video);
    setShowVideoPlayer(true);
  };

  const getEmbedUrl = (video: VideoWithProgress) => {
    const url = video.video_url;
    if (video.video_type === 'youtube') {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop()?.split('?')[0]
        : url.includes('v=') 
          ? url.split('v=')[1]?.split('&')[0]
          : url;
      return `https://www.youtube.com/embed/${videoId}?rel=0`;
    }
    if (video.video_type === 'vimeo') {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const { updateProgress } = useVideoProgress(selectedVideo?.id || '');

  const markVideoComplete = async () => {
    if (!selectedVideo || !selectedCourse) return;

    const result = await updateProgress(100);
    if (result?.error) {
      toast.error('প্রগ্রেস সেভ করতে সমস্যা');
      return;
    }

    toast.success('ভিডিও সম্পূর্ণ!');
    setShowVideoPlayer(false);
    setSelectedVideo(null);

    // Check if course is complete
    const completedCount = selectedCourse.videos.filter(v => v.progress?.is_completed || v.id === selectedVideo.id).length;
    if (completedCount === selectedCourse.total_videos) {
      // Generate certificate
      const certId = `CERT-${Date.now().toString(36).toUpperCase()}`;
      await supabase.from('certificates').insert({
        certificate_id: certId,
        user_id: user!.id,
        course_id: selectedCourse.id,
        student_name: profile?.full_name || '',
        course_name: selectedCourse.title,
      });
      await supabase.from('course_completions').insert({
        user_id: user!.id,
        course_id: selectedCourse.id,
        certificate_id: certId,
      });
      toast.success('🎉 কোর্স সম্পূর্ণ! সার্টিফিকেট তৈরি হয়েছে!');
    }

    refetch();
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">আমার কোর্স</h1>
              <p className="text-sm text-muted-foreground">{profile?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/my-certificates')} className="gap-2">
              <Award className="w-4 h-4" />
              সার্টিফিকেট
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              লগ আউট
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {selectedCourse ? (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              ফিরে যান
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                <p className="text-muted-foreground">{selectedCourse.completed_videos}/{selectedCourse.total_videos} ভিডিও সম্পূর্ণ</p>
              </div>
              {selectedCourse.is_completed && (
                <Badge className="gap-1"><Award className="w-3 h-3" />সম্পূর্ণ</Badge>
              )}
            </div>

            <Progress value={selectedCourse.progress_percent} className="h-2" />

            <div className="space-y-3">
              {selectedCourse.videos.map((video, index) => (
                <Card 
                  key={video.id} 
                  className={`cursor-pointer transition-all ${video.is_locked ? 'opacity-50' : 'hover:border-primary'}`}
                  onClick={() => playVideo(video)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${video.progress?.is_completed ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {video.is_locked ? <Lock className="w-5 h-5" /> : video.progress?.is_completed ? <CheckCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">ভিডিও {index + 1}: {video.title}</p>
                      {video.progress && !video.progress.is_completed && (
                        <Progress value={video.progress.progress_percent} className="h-1 mt-2" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : courses.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">কোনো কোর্স অ্যাসাইন করা নেই</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="cursor-pointer hover:border-primary transition-all" onClick={() => openCourse(course)}>
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {course.thumbnail_url ? <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" /> : <BookOpen className="w-12 h-12 text-muted-foreground" />}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.completed_videos}/{course.total_videos} ভিডিও</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={course.progress_percent} className="h-2" />
                  {course.is_completed && <Badge className="mt-3 gap-1"><Award className="w-3 h-3" />সম্পূর্ণ</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={showVideoPlayer} onOpenChange={setShowVideoPlayer}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="space-y-4">
              <div className="aspect-video">
                <iframe src={getEmbedUrl(selectedVideo)} className="w-full h-full rounded-lg" allowFullScreen />
              </div>
              <Button onClick={markVideoComplete} className="w-full gap-2">
                <CheckCircle className="w-4 h-4" />
                ভিডিও সম্পূর্ণ করুন
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
