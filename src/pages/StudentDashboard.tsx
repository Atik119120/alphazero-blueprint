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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  BookOpen, Play, Lock, CheckCircle, LogOut, Award, ArrowLeft, 
  FileText, Clock, PlayCircle, User, Sun, Moon, Globe,
  StickyNote, File, Send, GraduationCap
} from 'lucide-react';
import { CourseWithProgress, VideoWithProgress, VideoMaterial, Course } from '@/types/lms';
import { useTheme } from 'next-themes';

export default function StudentDashboard() {
  const { user, profile, signOut, isLoading: authLoading } = useAuth();
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
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  
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
    }
    setUpdatingProfile(false);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="AlphaZero Academy" 
              className="w-10 h-10 object-contain dark:invert"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <h1 className="font-semibold text-lg">
                {t('student.academyName')} <span className="text-muted-foreground text-sm">({t('student.dashboard')})</span>
              </h1>
              <p className="text-sm text-muted-foreground">{t('student.welcome')}, {profile?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
            {/* Language Toggle */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="gap-1"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'বাং' : 'EN'}
            </Button>

            <Button variant="outline" size="sm" onClick={() => navigate('/my-certificates')} className="gap-2 hidden sm:flex">
              <Award className="w-4 h-4" />
              {t('student.certificates')}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
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
            <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="gap-2 -ml-2">
              <ArrowLeft className="w-4 h-4" />
              {t('student.backToCourses')}
            </Button>

            {/* Course Header */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-border/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                  {selectedCourse.description && (
                    <p className="text-muted-foreground">{selectedCourse.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-4 h-4" />
                      {selectedCourse.total_videos} {t('student.classes')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {getTotalDuration(selectedCourse.videos)}
                    </span>
                  </div>
                </div>
                {selectedCourse.is_completed && (
                  <Badge className="gap-1 h-8 px-4 bg-primary">
                    <Award className="w-4 h-4" />
                    {t('student.completed')}
                  </Badge>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{t('student.progress')}</span>
                  <span className="font-medium">{selectedCourse.completed_videos}/{selectedCourse.total_videos} {t('student.classesCompleted')}</span>
                </div>
                <Progress value={selectedCourse.progress_percent} className="h-3" />
              </div>
            </div>

            {/* Video List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{t('student.courseContent')}</h3>
              {selectedCourse.videos.map((video, index) => (
                <Card 
                  key={video.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    video.is_locked 
                      ? 'opacity-60 cursor-not-allowed' 
                      : video.progress?.is_completed 
                        ? 'border-primary/30 bg-primary/5' 
                        : 'hover:border-primary'
                  }`}
                  onClick={() => playVideo(video)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      video.progress?.is_completed 
                        ? 'bg-primary text-primary-foreground' 
                        : video.is_locked 
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-primary/10 text-primary'
                    }`}>
                      {video.is_locked ? (
                        <Lock className="w-5 h-5" />
                      ) : video.progress?.is_completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">{t('student.class')} {index + 1}</span>
                        {video.progress?.is_completed && (
                          <Badge variant="outline" className="text-xs">{t('student.completedBadge')}</Badge>
                        )}
                      </div>
                      <p className="font-medium truncate">{video.title}</p>
                      {video.progress && !video.progress.is_completed && video.progress.progress_percent > 0 && (
                        <Progress value={video.progress.progress_percent} className="h-1 mt-2 w-32" />
                      )}
                    </div>
                    <div className="shrink-0 text-muted-foreground">
                      {video.duration_seconds ? (
                        <span className="text-sm">{Math.floor(video.duration_seconds / 60)} {t('student.minutes')}</span>
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
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
              <TabsTrigger value="courses" className="gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">{t('student.myCourses')}</span>
              </TabsTrigger>
              <TabsTrigger value="explore" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">{t('student.exploreCourses')}</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t('student.profile')}</span>
              </TabsTrigger>
            </TabsList>

            {/* My Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              {courses.length === 0 ? (
                <Card className="border-dashed max-w-md mx-auto">
                  <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{t('student.noCourses')}</h3>
                    <p className="text-muted-foreground mb-6">{t('student.noCoursesDesc')}</p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={() => setActiveTab('explore')}>
                        {t('student.exploreCourses')}
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/contact')}>
                        {t('student.contactUs')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-primary/10 to-transparent">
                      <CardContent className="p-4 text-center">
                        <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold">{courses.length}</p>
                        <p className="text-sm text-muted-foreground">{t('student.totalCourses')}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500/10 to-transparent">
                      <CardContent className="p-4 text-center">
                        <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{courses.filter(c => c.is_completed).length}</p>
                        <p className="text-sm text-muted-foreground">{t('student.completed')}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent">
                      <CardContent className="p-4 text-center">
                        <PlayCircle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">
                          {courses.reduce((acc, c) => acc + c.total_videos, 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">{t('student.totalClasses')}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-500/10 to-transparent">
                      <CardContent className="p-4 text-center">
                        <Award className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{courses.filter(c => c.is_completed).length}</p>
                        <p className="text-sm text-muted-foreground">{t('student.certificatesEarned')}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <h2 className="text-xl font-bold">{t('student.myCourses')}</h2>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                      <Card 
                        key={course.id} 
                        className="cursor-pointer hover:border-primary transition-all hover:shadow-lg overflow-hidden group"
                        onClick={() => openCourse(course)}
                      >
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          {course.thumbnail_url ? (
                            <img 
                              src={course.thumbnail_url} 
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                              <BookOpen className="w-12 h-12 text-primary/50" />
                            </div>
                          )}
                          {course.is_completed && (
                            <div className="absolute top-3 right-3">
                              <Badge className="gap-1 bg-primary">
                                <Award className="w-3 h-3" />
                                {t('student.completed')}
                              </Badge>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                            <Button size="sm" variant="secondary" className="gap-2">
                              <Play className="w-4 h-4" />
                              {t('student.start')}
                            </Button>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <PlayCircle className="w-3 h-3" />
                            {course.completed_videos}/{course.total_videos} {t('student.classesCompleted')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Progress value={course.progress_percent} className="h-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            {/* Explore Courses Tab */}
            <TabsContent value="explore" className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">{t('enroll.title')}</h2>
                <p className="text-muted-foreground">{t('enroll.desc')}</p>
              </div>
              
              {loadingCourses ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : allCourses.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('enroll.noCourses')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {allCourses.map((course) => {
                    const enrolled = isEnrolled(course.id);
                    const status = getEnrollmentStatus(course.id);
                    
                    return (
                      <Card key={course.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          {course.thumbnail_url ? (
                            <img 
                              src={course.thumbnail_url} 
                              alt={course.title}
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                              <BookOpen className="w-12 h-12 text-primary/50" />
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
                            <Badge variant="outline" className="w-full justify-center py-2">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {t('enroll.alreadyEnrolled')}
                            </Badge>
                          ) : status === 'pending' ? (
                            <Badge variant="secondary" className="w-full justify-center py-2">
                              <Clock className="w-4 h-4 mr-2" />
                              {t('enroll.pending')}
                            </Badge>
                          ) : (
                            <Button 
                              className="w-full gap-2" 
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
              <div>
                <h2 className="text-xl font-bold">{t('profile.title')}</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('profile.title')}</CardTitle>
                    <CardDescription>{t('profile.nameNote')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t('profile.fullName')}</Label>
                      <Input 
                        value={profileName} 
                        onChange={(e) => setProfileName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('profile.email')}</Label>
                      <Input value={profile?.email || ''} disabled />
                    </div>
                    <Button 
                      onClick={updateProfile} 
                      disabled={updatingProfile}
                      className="w-full"
                    >
                      {t('profile.updateProfile')}
                    </Button>
                  </CardContent>
                </Card>

                {/* Change Password */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('profile.changePassword')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t('profile.newPassword')}</Label>
                      <Input 
                        type="password"
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('profile.confirmPassword')}</Label>
                      <Input 
                        type="password"
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={changePassword}
                      disabled={!newPassword || !confirmPassword}
                      className="w-full"
                    >
                      {t('profile.changePassword')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Video Player Dialog */}
      <Dialog open={showVideoPlayer} onOpenChange={setShowVideoPlayer}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
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
                  <div className="p-4 border-t">
                    <h3 className="font-semibold mb-2">{selectedVideo.title}</h3>
                    <Button onClick={markVideoComplete} className="w-full gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {t('student.markComplete')}
                    </Button>
                  </div>
                </>
              )}
            </div>
            
            {/* Materials Section */}
            <div className="border-l">
              <div className="p-4 border-b">
                <h4 className="font-semibold">{t('student.materials')}</h4>
              </div>
              <ScrollArea className="h-[300px] md:h-[400px]">
                {loadingMaterials ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                  </div>
                ) : videoMaterials.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('student.noMaterials')}
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {videoMaterials.map((material) => (
                      <Card key={material.id} className="p-3">
                        <div className="flex items-center gap-3">
                          {getMaterialIcon(material.material_type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{material.title}</p>
                          </div>
                          {material.material_url && (
                            <Button size="sm" variant="ghost" asChild>
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