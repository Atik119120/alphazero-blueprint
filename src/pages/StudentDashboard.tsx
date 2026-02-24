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
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  BookOpen, Play, Lock, CheckCircle, LogOut, Award, ArrowLeft, 
  FileText, Clock, PlayCircle, User, Sun, Moon, Languages,
  StickyNote, File, GraduationCap, Sparkles,
  CreditCard, IdCard, TrendingUp, Home, Search, Calendar
} from 'lucide-react';
import { CourseWithProgress, VideoWithProgress, VideoMaterial, Course } from '@/types/lms';
import { useTheme } from 'next-themes';
import StudentIDCard from '@/components/student/StudentIDCard';
import ProfilePhotoUpload from '@/components/student/ProfilePhotoUpload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CourseEnrollmentModal from '@/components/student/CourseEnrollmentModal';
import SecureVideoPlayer from '@/components/SecureVideoPlayer';
import { Textarea } from '@/components/ui/textarea';

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
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<Course | null>(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  
  // Feedback states
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSentiment, setFeedbackSentiment] = useState<'positive' | 'negative'>('positive');
  const [feedbackMessage, setFeedbackMessage] = useState('');

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

  // SecureVideoPlayer handles video URLs internally

  const { updateProgress } = useVideoProgress(selectedVideo?.id || '');

  const markVideoComplete = async () => {
    if (!selectedVideo || !selectedCourse) return;

    const result = await updateProgress(100);
    if (result?.error) {
      toast.error(t('student.progressSaveError'));
      return;
    }

    toast.success(t('student.videoComplete'));
    
    // Show feedback form instead of closing immediately
    setShowFeedback(true);

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

  const submitFeedback = async () => {
    if (!selectedVideo || !user || !feedbackMessage.trim()) {
      toast.error('মতামত লিখুন');
      return;
    }
    
    const { error } = await supabase.from('video_feedback').insert({
      user_id: user.id,
      video_id: selectedVideo.id,
      sentiment: feedbackSentiment,
      message: feedbackMessage.trim(),
    });
    
    if (!error) {
      toast.success('ধন্যবাদ! আপনার মতামত গ্রহণ করা হয়েছে');
    }
    
    setShowFeedback(false);
    setFeedbackMessage('');
    setFeedbackSentiment('positive');
    setShowVideoPlayer(false);
    setSelectedVideo(null);
    setVideoMaterials([]);
  };

  const skipFeedback = () => {
    setShowFeedback(false);
    setFeedbackMessage('');
    setShowVideoPlayer(false);
    setSelectedVideo(null);
    setVideoMaterials([]);
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

  const handlePhotoUpdated = async () => {
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

  const openEnrollmentModal = (course: Course) => {
    setSelectedEnrollCourse(course);
    setShowEnrollmentModal(true);
  };

  const handleEnrollmentSuccess = () => {
    fetchEnrollmentRequests();
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
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Navigation items
  const navItems = [
    { id: 'courses', icon: BookOpen, label: language === 'bn' ? 'কোর্স' : 'Courses' },
    { id: 'explore', icon: Search, label: language === 'bn' ? 'ব্রাউজ' : 'Browse' },
    { id: 'certificates', icon: Award, label: language === 'bn' ? 'সনদ' : 'Certificates' },
    { id: 'id-card', icon: IdCard, label: language === 'bn' ? 'আইডি' : 'ID Card' },
    { id: 'profile', icon: User, label: language === 'bn' ? 'প্রোফাইল' : 'Profile' },
  ];

  // No loading screen - dashboard loads directly

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 ${language === 'bn' ? 'font-bengali' : ''}`}>
      {/* Minimal Floating Sidebar */}
      <aside className="fixed left-3 top-3 bottom-3 w-14 md:w-52 bg-white dark:bg-slate-900 rounded-2xl border border-border/50 shadow-xl shadow-black/5 z-50 flex flex-col overflow-hidden">
        {/* Logo & Brand */}
        <div className="p-3 border-b border-border/50 space-y-3">
          {/* Logo & Academy Name */}
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="AlphaZero Academy" 
              className="w-8 h-8 rounded-lg object-contain dark:invert"
            />
            <div className="hidden md:block">
              <p className="text-xs font-bold bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                AlphaZero Academy
              </p>
              <p className="text-[10px] text-muted-foreground">
                Student Dashboard
              </p>
            </div>
          </div>
          
          {/* Student Profile */}
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border-2 border-primary/20">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-cyan-600 text-white text-[10px] font-bold">
                {profile?.full_name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{profile?.full_name}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Student
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'certificates') {
                  navigate('/my-certificates');
                } else {
                  setActiveTab(item.id);
                  setSelectedCourse(null);
                }
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-primary to-cyan-600 text-white shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${activeTab === item.id ? '' : 'group-hover:scale-110 transition-transform'}`} />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-2 border-t border-border/50 space-y-1.5">
          {/* Home */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-muted-foreground"
          >
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Home</span>
          </button>
          
          {/* Language */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
          >
            <Languages className="w-4 h-4" />
            <span className="hidden md:inline">{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>
          
          {/* Theme */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/20 text-amber-600 dark:text-amber-400"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden md:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all bg-gradient-to-r from-red-500/10 to-rose-500/10 hover:from-red-500/20 hover:to-rose-500/20 border border-red-500/20 text-red-600 dark:text-red-400"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-20 md:pl-60 pr-4 py-4 min-h-screen">
        {selectedCourse ? (
          /* Course Detail View */
          <div className="max-w-4xl mx-auto space-y-4">
            <button 
              onClick={() => setSelectedCourse(null)} 
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('student.backToCourses')}
            </button>

            {/* Course Header */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border/50 p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {selectedCourse.is_completed && (
                      <Badge className="bg-emerald-500 text-white text-[10px] gap-1">
                        <CheckCircle className="w-3 h-3" /> Complete
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-xl font-bold">{selectedCourse.title}</h1>
                  {selectedCourse.description && (
                    <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5" />
                      {selectedCourse.total_videos} classes
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {getTotalDuration(selectedCourse.videos)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{Math.round(selectedCourse.progress_percent)}%</p>
                  <p className="text-xs text-muted-foreground">{selectedCourse.completed_videos}/{selectedCourse.total_videos} done</p>
                </div>
              </div>
              <Progress value={selectedCourse.progress_percent} className="h-1.5 mt-4" />
            </div>

            {/* Video List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border/50 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border/50">
                <h2 className="font-semibold text-sm">{t('student.courseContent')}</h2>
              </div>
              <div className="divide-y divide-border/50">
                {selectedCourse.videos.map((video, index) => (
                  <button 
                    key={video.id} 
                    onClick={() => playVideo(video)}
                    disabled={video.is_locked}
                    className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                      video.is_locked 
                        ? 'opacity-50 cursor-not-allowed' 
                        : video.progress?.is_completed 
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/30' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      video.progress?.is_completed 
                        ? 'bg-emerald-500 text-white' 
                        : video.is_locked 
                          ? 'bg-slate-200 dark:bg-slate-800 text-muted-foreground'
                          : 'bg-primary/10 text-primary'
                    }`}>
                      {video.is_locked ? (
                        <Lock className="w-4 h-4" />
                      ) : video.progress?.is_completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Class {index + 1}</p>
                      <p className="text-sm font-medium truncate">{video.title}</p>
                    </div>
                    {video.duration_seconds && (
                      <span className="text-xs text-muted-foreground">{Math.floor(video.duration_seconds / 60)}m</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Main Dashboard Tabs */
          <div className="max-w-5xl mx-auto space-y-5">
            {/* Tab: My Courses */}
            {activeTab === 'courses' && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Enrolled', value: courses.length, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Completed', value: courses.filter(c => c.is_completed).length, icon: CheckCircle, color: 'from-emerald-500 to-green-500' },
                    { label: 'Classes', value: courses.reduce((a, c) => a + c.total_videos, 0), icon: PlayCircle, color: 'from-orange-500 to-amber-500' },
                    { label: 'Certificates', value: courses.filter(c => c.is_completed).length, icon: Award, color: 'from-purple-500 to-pink-500' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-border/50 p-4 shadow-sm">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Courses Grid */}
                {courses.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-border p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">{t('student.noCourses')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{t('student.noCoursesDesc')}</p>
                    <Button size="sm" onClick={() => setActiveTab('explore')} className="gap-2">
                      <Search className="w-4 h-4" />
                      Browse Courses
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        onClick={() => openCourse(course)}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                      >
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                          {course.thumbnail_url ? (
                            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-10 h-10 text-muted-foreground/30" />
                            </div>
                          )}
                          {course.is_completed && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-emerald-500 text-white text-[10px]">
                                <CheckCircle className="w-3 h-3 mr-1" /> Done
                              </Badge>
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center justify-between">
                              <span className="text-[10px] text-white">{course.completed_videos}/{course.total_videos}</span>
                              <span className="text-[10px] font-bold text-white">{Math.round(course.progress_percent)}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm line-clamp-1">{course.title}</h3>
                          <Progress value={course.progress_percent} className="h-1 mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Tab: Explore */}
            {activeTab === 'explore' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border/50 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold">{t('enroll.title')}</h2>
                      <p className="text-xs text-muted-foreground">{t('enroll.desc')}</p>
                    </div>
                  </div>
                </div>

                {loadingCourses ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  </div>
                ) : allCourses.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-border p-12 text-center">
                    <GraduationCap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">{t('enroll.noCourses')}</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {allCourses.map((course) => {
                      const enrolled = isEnrolled(course.id);
                      const status = getEnrollmentStatus(course.id);
                      
                      return (
                        <div key={course.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-border/50 overflow-hidden shadow-sm">
                          <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
                            {course.thumbnail_url ? (
                              <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-10 h-10 text-muted-foreground/30" />
                              </div>
                            )}
                            {(course as any).price_bdt && (
                              <Badge className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] border-0">
                                ৳{(course as any).price_bdt}
                              </Badge>
                            )}
                          </div>
                          <div className="p-3 space-y-2">
                            <h3 className="font-medium text-sm line-clamp-1">{course.title}</h3>
                            {course.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>
                            )}
                            {enrolled ? (
                              <Badge variant="outline" className="w-full justify-center text-xs py-1.5 border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20">
                                <CheckCircle className="w-3 h-3 mr-1" /> Enrolled
                              </Badge>
                            ) : status === 'pending' ? (
                              <Badge variant="secondary" className="w-full justify-center text-xs py-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-500/30">
                                <Clock className="w-3 h-3 mr-1" /> Pending
                              </Badge>
                            ) : (
                              <Button size="sm" className="w-full text-xs h-8 gap-1" onClick={() => openEnrollmentModal(course)}>
                                <CreditCard className="w-3 h-3" />
                                {language === 'bn' ? 'এনরোল করুন' : 'Enroll Now'}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab: ID Card */}
            {activeTab === 'id-card' && profile && (
              <div className="max-w-lg mx-auto space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border/50 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                      <IdCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold">Student ID Card</h2>
                      <p className="text-xs text-muted-foreground">Download your official ID</p>
                    </div>
                  </div>
                  <StudentIDCard profile={profile} passCode={passCode} />
                </div>
              </div>
            )}

            {/* Tab: Profile */}
            {activeTab === 'profile' && profile && (
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Profile Header */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border/50 overflow-hidden shadow-sm">
                  <div className="h-20 bg-gradient-to-r from-primary via-cyan-600 to-primary" />
                  <div className="px-5 pb-5 -mt-10">
                    <ProfilePhotoUpload profile={profile} onPhotoUpdated={handlePhotoUpdated} />
                    <div className="text-center mt-3">
                      <h2 className="font-bold text-lg">{profile.full_name}</h2>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                      {passCode && (
                        <Badge variant="outline" className="mt-2 font-mono text-xs">
                          {passCode}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Edit Profile */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border/50 p-4 shadow-sm space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Edit Profile
                    </h3>
                    <div className="space-y-2">
                      <Label className="text-xs">{t('profile.fullName')}</Label>
                      <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="h-9 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">{t('profile.email')}</Label>
                      <Input value={profile.email || ''} disabled className="h-9 text-sm" />
                    </div>
                    <Button size="sm" className="w-full" onClick={updateProfile} disabled={updatingProfile}>
                      {t('profile.updateProfile')}
                    </Button>
                  </div>

                  {/* Change Password */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border/50 p-4 shadow-sm space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      {t('profile.changePassword')}
                    </h3>
                    <div className="space-y-2">
                      <Label className="text-xs">{t('profile.newPassword')}</Label>
                      <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-9 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">{t('profile.confirmPassword')}</Label>
                      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-9 text-sm" />
                    </div>
                    <Button size="sm" variant="outline" className="w-full" onClick={changePassword} disabled={!newPassword || !confirmPassword}>
                      {t('profile.changePassword')}
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border/50 p-4 shadow-sm">
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Your Progress
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Enrolled', value: courses.length },
                      { label: 'Completed', value: courses.filter(c => c.is_completed).length },
                      { label: 'Watched', value: courses.reduce((a, c) => a + c.completed_videos, 0) },
                      { label: 'Certs', value: courses.filter(c => c.is_completed).length },
                    ].map((s) => (
                      <div key={s.label} className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <p className="text-lg font-bold text-primary">{s.value}</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {profile.created_at && (
                    <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Member since {new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Video Player Dialog */}
      <Dialog open={showVideoPlayer} onOpenChange={(open) => {
        if (!open) {
          setShowVideoPlayer(false);
          setShowFeedback(false);
          setSelectedVideo(null);
          setVideoMaterials([]);
        }
      }}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden rounded-2xl">
          {showFeedback ? (
            /* Feedback Form */
            <div className="p-6 space-y-4">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h3 className="font-bold text-lg">ক্লাস সম্পন্ন হয়েছে!</h3>
                <p className="text-sm text-muted-foreground">আপনার মতামত জানান</p>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button
                  variant={feedbackSentiment === 'positive' ? 'default' : 'outline'}
                  onClick={() => setFeedbackSentiment('positive')}
                  className="gap-2"
                >
                  👍 ভালো লেগেছে
                </Button>
                <Button
                  variant={feedbackSentiment === 'negative' ? 'destructive' : 'outline'}
                  onClick={() => setFeedbackSentiment('negative')}
                  className="gap-2"
                >
                  👎 উন্নতি দরকার
                </Button>
              </div>
              
              <Textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder={feedbackSentiment === 'positive' ? 'কোন বিষয়টি আপনার ভালো লেগেছে?' : 'কোথায় উন্নতি করা উচিত বলে মনে করেন?'}
                rows={3}
              />
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={skipFeedback}>
                  স্কিপ করুন
                </Button>
                <Button className="flex-1" onClick={submitFeedback} disabled={!feedbackMessage.trim()}>
                  পাঠান
                </Button>
              </div>
            </div>
          ) : (
            /* Video Player */
            <div className="grid md:grid-cols-3">
              <div className="md:col-span-2">
                {selectedVideo && user && (
                  <>
                    <SecureVideoPlayer
                      videoUrl={selectedVideo.video_url}
                      videoType={selectedVideo.video_type}
                      videoId={selectedVideo.id}
                      userId={user.id}
                      onComplete={markVideoComplete}
                      initialPosition={selectedVideo.progress?.progress_percent ? 0 : 0}
                      maxWatchedSeconds={0}
                    />
                    <div className="p-4 border-t bg-white dark:bg-slate-900">
                      <h3 className="font-semibold text-sm mb-3">{selectedVideo.title}</h3>
                      <Button onClick={markVideoComplete} className="w-full gap-2" size="sm">
                        <CheckCircle className="w-4 h-4" />
                        {t('student.markComplete')}
                      </Button>
                    </div>
                  </>
                )}
              </div>
              <div className="border-l bg-slate-50 dark:bg-slate-900">
                <div className="p-3 border-b">
                  <h4 className="font-semibold text-sm">{t('student.materials')}</h4>
                </div>
                <ScrollArea className="h-[300px] md:h-[350px]">
                  {loadingMaterials ? (
                    <div className="flex justify-center py-8">
                      <div className="w-6 h-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    </div>
                  ) : videoMaterials.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                      {t('student.noMaterials')}
                    </div>
                  ) : (
                    <div className="p-3 space-y-2">
                      {videoMaterials.map((material) => (
                        <div key={material.id} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-border/50">
                          <div className="flex items-center gap-2">
                            {getMaterialIcon(material.material_type)}
                            <span className="text-xs font-medium flex-1 truncate">{material.title}</span>
                            {material.material_url && (
                              <a href={material.material_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                <FileText className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Course Enrollment Modal */}
      <CourseEnrollmentModal
        isOpen={showEnrollmentModal}
        onClose={() => {
          setShowEnrollmentModal(false);
          setSelectedEnrollCourse(null);
        }}
        course={selectedEnrollCourse}
        userId={user?.id || ''}
        userEmail={profile?.email || ''}
        userName={profile?.full_name || ''}
        onSuccess={handleEnrollmentSuccess}
        language={language as 'en' | 'bn'}
      />
    </div>
  );
}
