import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStudentCourses, useVideoProgress } from '@/hooks/useCourses';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  BookOpen, Play, Lock, CheckCircle, LogOut, Award, ArrowLeft, 
  FileText, Clock, PlayCircle, User, Sun, Moon, Globe,
  StickyNote, File, Send, GraduationCap, Sparkles, TrendingUp,
  Calendar, CreditCard, Star
} from 'lucide-react';
import { CourseWithProgress, VideoWithProgress, VideoMaterial, Course } from '@/types/lms';
import { useTheme } from 'next-themes';
import StudentIDCard from '@/components/student/StudentIDCard';
import ProfilePhotoUpload from '@/components/student/ProfilePhotoUpload';

export default function StudentDashboard() {
  const { user, profile, signOut, isLoading: authLoading, refreshProfile } = useAuth();
  const { courses, isLoading, refetch } = useStudentCourses();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  const [selectedCourse, setSelectedCourse] = useState<CourseWithProgress | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoWithProgress | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoMaterials, setVideoMaterials] = useState<VideoMaterial[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
  
  // Profile states
  const [profileName, setProfileName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [passCode, setPassCode] = useState<string>('');
  
  // Explore courses states
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/student/login');
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setProfileName(profile.full_name);
      fetchPassCode();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedVideo) {
      fetchVideoMaterials(selectedVideo.id);
    }
  }, [selectedVideo]);

  useEffect(() => {
    if (activeTab === 'explore' && user) {
      fetchAllCourses();
      fetchEnrollmentRequests();
    }
  }, [activeTab, user]);

  const fetchPassCode = async () => {
    if (!user) return;
    const { data } = await supabase.rpc('get_user_pass_code', { _user_id: user.id });
    if (data) setPassCode(data);
  };

  const fetchVideoMaterials = async (videoId: string) => {
    setLoadingMaterials(true);
    const { data, error } = await supabase
      .from('video_materials')
      .select('*')
      .eq('video_id', videoId)
      .order('order_index', { ascending: true });
    
    if (!error) {
      setVideoMaterials((data || []) as VideoMaterial[]);
    }
    setLoadingMaterials(false);
  };

  const fetchAllCourses = async () => {
    setLoadingCourses(true);
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('title', { ascending: true });
    
    if (!error) {
      setAllCourses((data || []) as Course[]);
    }
    setLoadingCourses(false);
  };

  const fetchEnrollmentRequests = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('enrollment_requests')
      .select('*')
      .eq('user_id', user.id);
    setEnrollmentRequests(data || []);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const openCourse = (course: CourseWithProgress) => {
    setSelectedCourse(course);
  };

  const playVideo = (video: VideoWithProgress) => {
    if (video.is_locked) {
      toast.error(t('student.completeVideoFirst'));
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
      toast.error(t('student.progressSaveError'));
      return;
    }

    toast.success(t('student.videoComplete'));
    setShowVideoPlayer(false);
    setSelectedVideo(null);
    setVideoMaterials([]);

    const completedCount = selectedCourse.videos.filter(v => v.progress?.is_completed || v.id === selectedVideo.id).length;
    if (completedCount === selectedCourse.total_videos) {
      const { data: existingCert } = await supabase
        .from('certificates')
        .select('certificate_id')
        .eq('user_id', user!.id)
        .eq('course_id', selectedCourse.id)
        .maybeSingle();

      if (existingCert) {
        toast.success('🎉 ' + t('student.certificateExists'));
      } else {
        const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
        const certId = `CERT-${randomPart}`;
        
        const { error: certError } = await supabase.from('certificates').insert({
          certificate_id: certId,
          user_id: user!.id,
          course_id: selectedCourse.id,
          student_name: profile?.full_name || '',
          course_name: selectedCourse.title,
        });
        
        if (!certError) {
          await supabase.from('course_completions').insert({
            user_id: user!.id,
            course_id: selectedCourse.id,
            certificate_id: certId,
          });
          toast.success('🎉 ' + t('student.courseComplete'));
        }
      }
    }

    refetch();
  };

  const updateProfile = async () => {
    if (!user || !profile) return;
    setUpdatingProfile(true);

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: profileName })
      .eq('id', profile.id);

    if (error) {
      toast.error('Error updating profile');
    } else {
      toast.success(t('profile.updateSuccess'));
      await refreshProfile();
    }
    setUpdatingProfile(false);
  };

  const handlePhotoUpdated = async (newUrl: string) => {
    await refreshProfile();
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(t('profile.passwordMismatch'));
      return;
    }
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('profile.passwordSuccess'));
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const requestEnrollment = async (course: Course) => {
    if (!user || !profile) return;
    
    const { error } = await supabase.from('enrollment_requests').insert({
      user_id: user.id,
      course_id: course.id,
      student_name: profile.full_name,
      student_email: profile.email,
      status: 'pending',
    });

    if (error) {
      if (error.code === '23505') {
        toast.error('Request already exists');
      } else {
        toast.error('Error sending request');
      }
    } else {
      toast.success(t('enroll.requestSent'));
      fetchEnrollmentRequests();
    }
  };

  const isEnrolled = (courseId: string) => {
    return courses.some(c => c.id === courseId);
  };

  const getEnrollmentStatus = (courseId: string) => {
    const request = enrollmentRequests.find(r => r.course_id === courseId);
    return request?.status;
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
      case 'doc': return <File className="w-4 h-4 text-blue-500" />;
      case 'note': return <StickyNote className="w-4 h-4 text-yellow-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTotalDuration = (videos: VideoWithProgress[]) => {
    const totalSeconds = videos.reduce((acc, v) => acc + (v.duration_seconds || 0), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours} ${t('student.hours')} ${minutes} ${t('student.minutes')}`;
    return `${minutes} ${t('student.minutes')}`;
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
      {/* Animated Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="AlphaZero Academy" 
                className="w-10 h-10 object-contain dark:invert"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                {t('student.academyName')}
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                {t('student.welcome')}, {profile?.full_name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="gap-1 rounded-full"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'বাং' : 'EN'}
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/my-certificates')} 
              className="gap-2 hidden sm:flex rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 hover:border-yellow-500/40"
            >
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent font-medium">
                {t('student.certificates')}
              </span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 rounded-full">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t('student.logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {selectedCourse ? (
          /* Course Detail View */
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="gap-2 -ml-2 rounded-full">
              <ArrowLeft className="w-4 h-4" />
              {t('student.backToCourses')}
            </Button>

            {/* Course Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-purple-500/10 to-pink-500/20 p-6 rounded-3xl border border-primary/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                  {selectedCourse.description && (
                    <p className="text-muted-foreground">{selectedCourse.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 bg-card/50 px-3 py-1 rounded-full">
                      <PlayCircle className="w-4 h-4 text-primary" />
                      {selectedCourse.total_videos} {t('student.classes')}
                    </span>
                    <span className="flex items-center gap-1 bg-card/50 px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4 text-purple-500" />
                      {getTotalDuration(selectedCourse.videos)}
                    </span>
                  </div>
                </div>
                {selectedCourse.is_completed && (
                  <Badge className="gap-1 h-10 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg shadow-green-500/25">
                    <Award className="w-5 h-5" />
                    {t('student.completed')}
                  </Badge>
                )}
              </div>
              <div className="relative mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{t('student.progress')}</span>
                  <span className="font-bold text-primary">{selectedCourse.completed_videos}/{selectedCourse.total_videos} {t('student.classesCompleted')}</span>
                </div>
                <Progress value={selectedCourse.progress_percent} className="h-3 bg-card/50" />
              </div>
            </div>

            {/* Video List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {t('student.courseContent')}
              </h3>
              {selectedCourse.videos.map((video, index) => (
                <Card 
                  key={video.id} 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    video.is_locked 
                      ? 'opacity-60 cursor-not-allowed bg-muted/20' 
                      : video.progress?.is_completed 
                        ? 'border-green-500/30 bg-gradient-to-r from-green-500/5 to-emerald-500/5 hover:border-green-500/50' 
                        : 'hover:border-primary hover:shadow-primary/10'
                  }`}
                  onClick={() => playVideo(video)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                      video.progress?.is_completed 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' 
                        : video.is_locked 
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary'
                    }`}>
                      {video.is_locked ? (
                        <Lock className="w-5 h-5" />
                      ) : video.progress?.is_completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t('student.class')} {index + 1}</span>
                        {video.progress?.is_completed && (
                          <Badge variant="outline" className="text-xs border-green-500/30 text-green-600">{t('student.completedBadge')}</Badge>
                        )}
                      </div>
                      <p className="font-medium truncate mt-1">{video.title}</p>
                      {video.progress && !video.progress.is_completed && video.progress.progress_percent > 0 && (
                        <Progress value={video.progress.progress_percent} className="h-1 mt-2 w-32" />
                      )}
                    </div>
                    <div className="shrink-0 text-muted-foreground">
                      {video.duration_seconds ? (
                        <span className="text-sm bg-muted px-3 py-1 rounded-full">{Math.floor(video.duration_seconds / 60)} {t('student.minutes')}</span>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Main Dashboard View */
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex bg-card/50 backdrop-blur-sm p-1 rounded-full">
              <TabsTrigger value="courses" className="gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">{t('student.myCourses')}</span>
              </TabsTrigger>
              <TabsTrigger value="explore" className="gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">{t('student.exploreCourses')}</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t('student.profile')}</span>
              </TabsTrigger>
            </TabsList>

            {/* My Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              {courses.length === 0 ? (
                <Card className="border-dashed max-w-md mx-auto bg-gradient-to-br from-card to-muted/20">
                  <CardContent className="py-16 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">{t('student.noCourses')}</h3>
                    <p className="text-muted-foreground mb-6">{t('student.noCoursesDesc')}</p>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={() => setActiveTab('explore')} className="rounded-full gap-2 bg-gradient-to-r from-primary to-purple-600">
                        <GraduationCap className="w-4 h-4" />
                        {t('student.exploreCourses')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Colorful Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent border-blue-500/20 hover:border-blue-500/40 transition-colors overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardContent className="p-4 text-center relative">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                          <BookOpen className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{courses.length}</p>
                        <p className="text-sm text-muted-foreground">{t('student.totalCourses')}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent border-green-500/20 hover:border-green-500/40 transition-colors overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardContent className="p-4 text-center relative">
                        <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{courses.filter(c => c.is_completed).length}</p>
                        <p className="text-sm text-muted-foreground">{t('student.completed')}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent border-orange-500/20 hover:border-orange-500/40 transition-colors overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardContent className="p-4 text-center relative">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                          <PlayCircle className="w-6 h-6 text-orange-500" />
                        </div>
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                          {courses.reduce((acc, c) => acc + c.total_videos, 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">{t('student.totalClasses')}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent border-purple-500/20 hover:border-purple-500/40 transition-colors overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardContent className="p-4 text-center relative">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                          <Award className="w-6 h-6 text-purple-500" />
                        </div>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{courses.filter(c => c.is_completed).length}</p>
                        <p className="text-sm text-muted-foreground">{t('student.certificatesEarned')}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      {t('student.myCourses')}
                    </h2>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                      <Card 
                        key={course.id} 
                        className="cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 overflow-hidden group bg-card/50 backdrop-blur-sm"
                        onClick={() => openCourse(course)}
                      >
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          {course.thumbnail_url ? (
                            <img 
                              src={course.thumbnail_url} 
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20">
                              <BookOpen className="w-12 h-12 text-primary/50" />
                            </div>
                          )}
                          {course.is_completed && (
                            <div className="absolute top-3 right-3">
                              <Badge className="gap-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                                <Award className="w-3 h-3" />
                                {t('student.completed')}
                              </Badge>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                            <Button size="sm" className="gap-2 bg-white text-black hover:bg-white/90 shadow-xl">
                              <Play className="w-4 h-4" />
                              {t('student.start')}
                            </Button>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-primary font-medium">
                              <PlayCircle className="w-3 h-3" />
                              {course.completed_videos}/{course.total_videos}
                            </span>
                            {t('student.classesCompleted')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <Progress value={course.progress_percent} className="h-2" />
                            <span className="absolute right-0 -top-5 text-xs font-bold text-primary">{Math.round(course.progress_percent)}%</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            {/* Explore Courses Tab */}
            <TabsContent value="explore" className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 via-purple-500/5 to-pink-500/10 p-6 rounded-3xl border border-primary/20">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  {t('enroll.title')}
                </h2>
                <p className="text-muted-foreground mt-1">{t('enroll.desc')}</p>
              </div>
              
              {loadingCourses ? (
                <div className="flex justify-center py-12">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                </div>
              ) : allCourses.length === 0 ? (
                <Card className="border-dashed bg-gradient-to-br from-card to-muted/20">
                  <CardContent className="py-12 text-center">
                    <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('enroll.noCourses')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {allCourses.map((course) => {
                    const enrolled = isEnrolled(course.id);
                    const status = getEnrollmentStatus(course.id);
                    
                    return (
                      <Card key={course.id} className="overflow-hidden bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          {course.thumbnail_url ? (
                            <img 
                              src={course.thumbnail_url} 
                              alt={course.title}
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20">
                              <BookOpen className="w-12 h-12 text-primary/50" />
                            </div>
                          )}
                          {(course as any).price_bdt && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 gap-1">
                                <CreditCard className="w-3 h-3" />
                                ৳{(course as any).price_bdt}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                          {course.description && (
                            <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          {enrolled ? (
                            <Badge variant="outline" className="w-full justify-center py-2 border-green-500/30 text-green-600 bg-green-500/10">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {t('enroll.alreadyEnrolled')}
                            </Badge>
                          ) : status === 'pending' ? (
                            <Badge variant="secondary" className="w-full justify-center py-2 bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                              <Clock className="w-4 h-4 mr-2" />
                              {t('enroll.pending')}
                            </Badge>
                          ) : (
                            <Button 
                              className="w-full gap-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 rounded-full" 
                              onClick={() => requestEnrollment(course)}
                            >
                              <Send className="w-4 h-4" />
                              {t('enroll.requestEnroll')}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 via-purple-500/5 to-pink-500/10 p-6 rounded-3xl border border-primary/20">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  {t('profile.title')}
                </h2>
                <p className="text-muted-foreground mt-1">Manage your profile and download your ID card</p>
              </div>
              
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column - Profile Info & Photo */}
                <div className="space-y-6">
                  {/* Profile Photo & Info Card */}
                  <Card className="bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
                    <CardContent className="-mt-14 relative">
                      {profile && (
                        <ProfilePhotoUpload 
                          profile={profile} 
                          onPhotoUpdated={handlePhotoUpdated} 
                        />
                      )}
                      <div className="text-center mt-4 space-y-1">
                        <h3 className="text-xl font-bold">{profile?.full_name}</h3>
                        <p className="text-muted-foreground text-sm">{profile?.email}</p>
                        {passCode && (
                          <Badge variant="outline" className="mt-2 font-mono">
                            Pass Code: {passCode}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Edit Profile */}
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {t('profile.title')}
                      </CardTitle>
                      <CardDescription>{t('profile.nameNote')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t('profile.fullName')}</Label>
                        <Input 
                          value={profileName} 
                          onChange={(e) => setProfileName(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('profile.email')}</Label>
                        <Input value={profile?.email || ''} disabled className="rounded-xl" />
                      </div>
                      <Button 
                        onClick={updateProfile} 
                        disabled={updatingProfile}
                        className="w-full rounded-full bg-gradient-to-r from-primary to-purple-600"
                      >
                        {t('profile.updateProfile')}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - ID Card & Password */}
                <div className="space-y-6">
                  {/* Student ID Card */}
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        Student ID Card
                      </CardTitle>
                      <CardDescription>Download your official student ID card</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {profile && <StudentIDCard profile={profile} passCode={passCode} />}
                    </CardContent>
                  </Card>

                  {/* Change Password */}
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        {t('profile.changePassword')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t('profile.newPassword')}</Label>
                        <Input 
                          type="password"
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('profile.confirmPassword')}</Label>
                        <Input 
                          type="password"
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                      <Button 
                        onClick={changePassword}
                        disabled={!newPassword || !confirmPassword}
                        className="w-full rounded-full"
                        variant="outline"
                      >
                        {t('profile.changePassword')}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card className="bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 border-primary/20">
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Your Progress
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-card/50 rounded-2xl">
                          <p className="text-2xl font-bold text-primary">{courses.length}</p>
                          <p className="text-xs text-muted-foreground">Enrolled</p>
                        </div>
                        <div className="text-center p-3 bg-card/50 rounded-2xl">
                          <p className="text-2xl font-bold text-green-500">{courses.filter(c => c.is_completed).length}</p>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                        <div className="text-center p-3 bg-card/50 rounded-2xl">
                          <p className="text-2xl font-bold text-orange-500">{courses.reduce((acc, c) => acc + c.completed_videos, 0)}</p>
                          <p className="text-xs text-muted-foreground">Videos Watched</p>
                        </div>
                        <div className="text-center p-3 bg-card/50 rounded-2xl">
                          <p className="text-2xl font-bold text-purple-500">{courses.filter(c => c.is_completed).length}</p>
                          <p className="text-xs text-muted-foreground">Certificates</p>
                        </div>
                      </div>
                      {profile?.created_at && (
                        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          Member since {new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Video Player Dialog */}
      <Dialog open={showVideoPlayer} onOpenChange={setShowVideoPlayer}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden rounded-2xl">
          <div className="grid md:grid-cols-3">
            {/* Video Section */}
            <div className="md:col-span-2">
              {selectedVideo && (
                <>
                  <div className="aspect-video bg-black">
                    <iframe
                      src={getEmbedUrl(selectedVideo)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4 border-t bg-gradient-to-r from-primary/5 to-purple-500/5">
                    <h3 className="font-semibold mb-3">{selectedVideo.title}</h3>
                    <Button onClick={markVideoComplete} className="w-full gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90">
                      <CheckCircle className="w-4 h-4" />
                      {t('student.markComplete')}
                    </Button>
                  </div>
                </>
              )}
            </div>
            
            {/* Materials Section */}
            <div className="border-l bg-card/50">
              <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-purple-500/10">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  {t('student.materials')}
                </h4>
              </div>
              <ScrollArea className="h-[300px] md:h-[400px]">
                {loadingMaterials ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  </div>
                ) : videoMaterials.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    {t('student.noMaterials')}
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {videoMaterials.map((material) => (
                      <Card key={material.id} className="p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {getMaterialIcon(material.material_type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{material.title}</p>
                          </div>
                          {material.material_url && (
                            <Button size="sm" variant="ghost" asChild className="rounded-full">
                              <a href={material.material_url} target="_blank" rel="noopener noreferrer">
                                <FileText className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                        {material.note_content && (
                          <p className="text-xs text-muted-foreground mt-2">{material.note_content}</p>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
