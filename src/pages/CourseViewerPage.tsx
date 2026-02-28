import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import SecureVideoPlayer from '@/components/SecureVideoPlayer';
import LessonComments from '@/components/student/LessonComments';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Play, Lock, CheckCircle, ArrowLeft, ArrowRight, ChevronLeft,
  FileText, StickyNote, File, Clock, PlayCircle, Maximize2, Minimize2,
  Download, ExternalLink, User
} from 'lucide-react';
import { CourseWithProgress, VideoWithProgress, VideoMaterial } from '@/types/lms';
import { useStudentCourses, useVideoProgress } from '@/hooks/useCourses';

export default function CourseViewerPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const { courses, refetch } = useStudentCourses();
  const isMobile = useIsMobile();

  const [course, setCourse] = useState<CourseWithProgress | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoWithProgress | null>(null);
  const [videoMaterials, setVideoMaterials] = useState<VideoMaterial[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [watchThresholdMet, setWatchThresholdMet] = useState(false);
  const [dailyClassCount, setDailyClassCount] = useState(0);
  
  const [autoCompleting, setAutoCompleting] = useState(false);

  // Find the course from student courses
  useEffect(() => {
    if (courses.length > 0 && courseId) {
      const found = courses.find(c => c.id === courseId);
      if (found) {
        setCourse(found);
        if (!selectedVideo) {
          const firstUnwatched = found.videos.find(v => !v.progress?.is_completed && !v.is_locked);
          setSelectedVideo(firstUnwatched || found.videos[0]);
        }
      }
    }
  }, [courses, courseId]);

  // Fetch daily class count
  useEffect(() => {
    if (!user) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    supabase
      .from('video_progress')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('is_completed', true)
      .gte('last_watched_at', today.toISOString())
      .then(({ count }) => setDailyClassCount(count || 0));
  }, [user]);

  // Fetch materials when video changes
  useEffect(() => {
    if (selectedVideo) {
      supabase
        .from('video_materials')
        .select('*')
        .eq('video_id', selectedVideo.id)
        .order('order_index', { ascending: true })
        .then(({ data }) => setVideoMaterials((data || []) as VideoMaterial[]));
      setShowStartScreen(true);
      setWatchThresholdMet(false);
    }
  }, [selectedVideo?.id]);

  const { updateProgress } = useVideoProgress(selectedVideo?.id || '');

  // Auto-complete when threshold is met
  const handleVideoComplete = useCallback(() => {
    setWatchThresholdMet(true);
  }, []);

  // Auto mark complete when threshold met
  useEffect(() => {
    if (watchThresholdMet && !autoCompleting && selectedVideo && !selectedVideo.progress?.is_completed) {
      setAutoCompleting(true);
      markComplete().finally(() => setAutoCompleting(false));
    }
  }, [watchThresholdMet]);

  const markComplete = async () => {
    if (!selectedVideo || !course || !user) return;
    if (dailyClassCount >= 5) {
      toast.error('আজকের জন্য ক্লাস লিমিট শেষ (সর্বোচ্চ ৫টি)');
      return;
    }
    const result = await updateProgress(100);
    if (result?.error) {
      toast.error('Progress save failed');
      return;
    }
    toast.success('✅ ক্লাস সম্পন্ন!');
    setDailyClassCount(prev => prev + 1);

    const completedCount = course.videos.filter(v => v.progress?.is_completed || v.id === selectedVideo.id).length;
    if (completedCount === course.total_videos) {
      const { data: existingCert } = await supabase
        .from('certificates')
        .select('certificate_id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .maybeSingle();
      if (!existingCert) {
        const certId = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        await supabase.from('certificates').insert({
          certificate_id: certId, user_id: user.id, course_id: course.id,
          student_name: profile?.full_name || '', course_name: course.title,
        });
        await supabase.from('course_completions').insert({
          user_id: user.id, course_id: course.id, certificate_id: certId,
        });
        toast.success('🎉 কোর্স সম্পন্ন! সার্টিফিকেট তৈরি হয়েছে');
      }
    }
    refetch();
    const currentIdx = course.videos.findIndex(v => v.id === selectedVideo.id);
    if (currentIdx < course.videos.length - 1) {
      setTimeout(() => setSelectedVideo(course.videos[currentIdx + 1]), 1500);
    }
  };

  const goToVideo = (video: VideoWithProgress) => {
    if (video.is_locked) {
      toast.error('আগের ক্লাসটি সম্পন্ন করুন');
      return;
    }
    setSelectedVideo(video);
    
  };

  const currentIndex = course?.videos.findIndex(v => v.id === selectedVideo?.id) ?? -1;
  const nextVideo = course?.videos[currentIndex + 1];
  const prevVideo = currentIndex > 0 ? course?.videos[currentIndex - 1] : null;

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
      case 'doc': return <File className="w-4 h-4 text-blue-500" />;
      case 'note': return <StickyNote className="w-4 h-4 text-amber-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (!user) { navigate('/student/login'); return null; }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  // Lesson list component (shared between sidebar and mobile sheet)
  const LessonList = () => (
    <div className="divide-y divide-white/5">
      {course.videos.map((video, index) => {
        const isActive = video.id === selectedVideo?.id;
        const isComplete = video.progress?.is_completed;
        const isLocked = video.is_locked;
        return (
          <button
            key={video.id}
            onClick={() => goToVideo(video)}
            disabled={isLocked}
            className={`w-full flex items-center gap-3 p-3 text-left transition-all ${
              isActive ? 'bg-primary/10 border-l-2 border-primary'
              : isComplete ? 'hover:bg-emerald-500/5'
              : isLocked ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-white/5'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              isActive ? 'bg-primary text-primary-foreground'
              : isComplete ? 'bg-emerald-500/20 text-emerald-400'
              : isLocked ? 'bg-white/10 text-white/30'
              : 'bg-white/10 text-white/60'
            }`}>
              {isLocked ? <Lock className="w-3.5 h-3.5" />
              : isComplete ? <CheckCircle className="w-3.5 h-3.5" />
              : isActive ? <Play className="w-3.5 h-3.5 fill-current" />
              : <PlayCircle className="w-3.5 h-3.5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium truncate ${isActive ? 'text-primary' : isComplete ? 'text-emerald-400' : ''}`}>
                {video.title}
              </p>
              {video.duration_seconds > 0 && (
                <p className="text-[10px] text-white/30 flex items-center gap-1 mt-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {Math.floor(video.duration_seconds / 60)} min
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={`min-h-screen bg-slate-950 text-white flex flex-col ${language === 'bn' ? 'font-bengali' : ''}`}>
      {/* Top Bar */}
      {/* Top Bar - always visible */}
      <header className={`h-12 md:h-14 border-b border-white/10 flex items-center px-3 md:px-4 gap-2 md:gap-3 shrink-0 bg-slate-900/80 backdrop-blur-sm z-30`}>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 shrink-0 w-8 h-8 md:w-9 md:h-9" onClick={() => navigate('/student')}>
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-semibold truncate">{course.title}</p>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <Badge variant="outline" className="text-[9px] md:text-[10px] border-white/20 text-white/60 px-1.5 md:px-2">
            {course.completed_videos}/{course.total_videos} done
          </Badge>
          <Progress value={course.progress_percent} className="w-12 md:w-20 h-1.5" />
          <span className="text-[10px] md:text-xs font-bold text-emerald-400">{Math.round(course.progress_percent)}%</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Video Player */}
          <div className="relative w-full bg-black">
            {showStartScreen && !selectedVideo?.progress?.is_completed ? (
              <div className="aspect-video flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 relative">
                {course.thumbnail_url && (
                  <img src={course.thumbnail_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" />
                )}
                <div className="relative z-10 text-center space-y-3 md:space-y-4 px-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto ring-4 ring-primary/10">
                    <Play className="w-6 h-6 md:w-8 md:h-8 text-primary fill-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-white/50 mb-1">Class {currentIndex + 1}</p>
                    <h2 className="text-sm md:text-xl font-bold line-clamp-2">{selectedVideo?.title}</h2>
                  </div>
                  <Button
                    size={isMobile ? "default" : "lg"}
                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 md:px-8"
                    onClick={() => setShowStartScreen(false)}
                  >
                    <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    Start Class
                  </Button>
                </div>
              </div>
            ) : (
              selectedVideo && user && (
                <SecureVideoPlayer
                  videoUrl={selectedVideo.video_url}
                  videoType={selectedVideo.video_type}
                  videoId={selectedVideo.id}
                  userId={user.id}
                  onComplete={handleVideoComplete}
                  initialPosition={0}
                  maxWatchedSeconds={0}
                  autoPlay
                  onThresholdMet={() => setWatchThresholdMet(true)}
                />
              )
            )}

            {/* Focus Mode Toggle - hidden on mobile */}
            {!isMobile && (
              <Button
                variant="ghost" size="icon"
                className="absolute top-3 right-3 z-20 text-white/50 hover:text-white hover:bg-white/10"
                onClick={() => { setFocusMode(!focusMode); if (!focusMode) setSidebarOpen(false); else setSidebarOpen(true); }}
              >
                {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            )}
          </div>

          {/* Below Video Content */}
          <div className={`p-3 md:p-6 space-y-3 md:space-y-4 bg-slate-950 ${focusMode && !isMobile ? 'hidden' : ''}`}>
            {/* Video Title + Status */}
            <div className="flex items-start justify-between gap-2 md:gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-xs text-white/40 mb-0.5">Class {currentIndex + 1} of {course.total_videos}</p>
                <h2 className="text-sm md:text-lg font-bold line-clamp-2">{selectedVideo?.title}</h2>
              </div>
              {/* Completed badge (auto-complete replaces button) */}
              {selectedVideo?.progress?.is_completed && (
                <Badge className="bg-emerald-600 text-white gap-1 shrink-0">
                  <CheckCircle className="w-3 h-3" /> সম্পন্ন
                </Badge>
              )}
              {autoCompleting && (
                <Badge className="bg-primary/20 text-primary gap-1 shrink-0 animate-pulse">
                  <CheckCircle className="w-3 h-3" /> সেভ হচ্ছে...
                </Badge>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="ghost" size="sm"
                className="gap-1.5 text-white/60 hover:text-white hover:bg-white/10 text-xs"
                disabled={!prevVideo}
                onClick={() => prevVideo && goToVideo(prevVideo)}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </Button>
              {nextVideo && (
                <Button
                  variant="ghost" size="sm"
                  className="gap-1.5 text-white/60 hover:text-white hover:bg-white/10 text-xs max-w-[60%] truncate"
                  disabled={nextVideo.is_locked}
                  onClick={() => goToVideo(nextVideo)}
                >
                  <span className="truncate">Next: {nextVideo.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Button>
              )}
            </div>

            {/* Mobile: Lesson List (YouTube style - below video) */}
            {isMobile && (
              <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-900/50">
                <div className="p-3 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold">কোর্স সিলেবাস</h3>
                    <p className="text-[10px] text-white/40">{course.total_videos}টি ক্লাস</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400">{Math.round(course.progress_percent)}%</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  <LessonList />
                </div>
              </div>
            )}

            {/* Materials Accordion */}
            {videoMaterials.length > 0 && (
              <Accordion type="single" collapsible className="border border-white/10 rounded-xl overflow-hidden">
                <AccordionItem value="materials" className="border-0">
                  <AccordionTrigger className="px-3 md:px-4 py-3 text-xs md:text-sm font-semibold hover:no-underline hover:bg-white/5 text-white">
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Materials ({videoMaterials.length})
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 md:px-4 pb-3 md:pb-4 space-y-2">
                    {videoMaterials.map((mat) => (
                      <div key={mat.id} className="flex items-center gap-3 p-2.5 md:p-3 bg-white/5 rounded-lg border border-white/10">
                        {getMaterialIcon(mat.material_type)}
                        <span className="text-xs md:text-sm flex-1 truncate">{mat.title}</span>
                        {mat.material_type === 'note' && mat.note_content ? (
                          <span className="text-xs text-white/50">Note</span>
                        ) : mat.material_url ? (
                          <div className="flex gap-2">
                            <a href={mat.material_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <a href={mat.material_url} download className="text-white/50 hover:text-white">
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Comments / Q&A */}
            {selectedVideo && course && (
              <LessonComments
                videoId={selectedVideo.id}
                courseId={course.id}
                userId={user.id}
                userName={profile?.full_name || 'Student'}
                userAvatar={profile?.avatar_url || ''}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar - Desktop Only */}
        {!isMobile && !focusMode && (
          <aside className={`bg-slate-900 border-l border-white/10 transition-all duration-300 shrink-0 ${sidebarOpen ? 'w-72 md:w-80' : 'w-0 overflow-hidden'}`}>
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-sm font-bold">কোর্স সিলেবাস</h3>
                  <p className="text-[10px] text-white/40">{course.total_videos}টি ক্লাস</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400">{Math.round(course.progress_percent)}%</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-white/40 hover:text-white">
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <LessonList />
              </ScrollArea>
            </div>
          </aside>
        )}

        {/* Sidebar Toggle (desktop, when collapsed) */}
        {!isMobile && !sidebarOpen && !focusMode && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-slate-800 border border-white/10 rounded-l-lg p-2 text-white/60 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
