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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  BookOpen, Play, Lock, CheckCircle, LogOut, Award, ArrowLeft, 
  FileText, Download, ExternalLink, Clock, GraduationCap, PlayCircle,
  FileDown, StickyNote, File
} from 'lucide-react';
import { CourseWithProgress, VideoWithProgress, VideoMaterial } from '@/types/lms';

export default function StudentDashboard() {
  const { user, profile, signOut, isLoading: authLoading } = useAuth();
  const { courses, isLoading, refetch } = useStudentCourses();
  const navigate = useNavigate();
  
  const [selectedCourse, setSelectedCourse] = useState<CourseWithProgress | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoWithProgress | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoMaterials, setVideoMaterials] = useState<VideoMaterial[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/student/login');
      return;
    }
  }, [user, authLoading, navigate]);

  // Check if user has valid pass code
  useEffect(() => {
    if (!authLoading && user && profile && !isLoading) {
      const checkPassCode = async () => {
        const { data } = await supabase
          .from('pass_codes')
          .select('id')
          .eq('student_id', profile.id)
          .eq('is_active', true)
          .maybeSingle();
        
        if (!data) {
          navigate('/passcode');
        }
      };
      checkPassCode();
    }
  }, [user, authLoading, navigate, profile, isLoading]);

  // Fetch materials when video is selected
  useEffect(() => {
    if (selectedVideo) {
      fetchVideoMaterials(selectedVideo.id);
    }
  }, [selectedVideo]);

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
    setVideoMaterials([]);

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
    if (hours > 0) return `${hours} ঘণ্টা ${minutes} মিনিট`;
    return `${minutes} মিনিট`;
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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">স্টুডেন্ট ড্যাশবোর্ড</h1>
              <p className="text-sm text-muted-foreground">স্বাগতম, {profile?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/my-certificates')} className="gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">সার্টিফিকেট</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">লগ আউট</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {selectedCourse ? (
          /* Course Detail View */
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="gap-2 -ml-2">
              <ArrowLeft className="w-4 h-4" />
              সব কোর্সে ফিরুন
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
                      {selectedCourse.total_videos} ক্লাস
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
                    সম্পূর্ণ
                  </Badge>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>প্রগ্রেস</span>
                  <span className="font-medium">{selectedCourse.completed_videos}/{selectedCourse.total_videos} ক্লাস সম্পূর্ণ</span>
                </div>
                <Progress value={selectedCourse.progress_percent} className="h-3" />
              </div>
            </div>

            {/* Video List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">কোর্স কন্টেন্ট</h3>
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
                        <span className="text-xs font-medium text-muted-foreground">ক্লাস {index + 1}</span>
                        {video.progress?.is_completed && (
                          <Badge variant="outline" className="text-xs">সম্পূর্ণ</Badge>
                        )}
                      </div>
                      <p className="font-medium truncate">{video.title}</p>
                      {video.progress && !video.progress.is_completed && video.progress.progress_percent > 0 && (
                        <Progress value={video.progress.progress_percent} className="h-1 mt-2 w-32" />
                      )}
                    </div>
                    <div className="shrink-0 text-muted-foreground">
                      {video.duration_seconds ? (
                        <span className="text-sm">{Math.floor(video.duration_seconds / 60)} মিনিট</span>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className="max-w-md mx-auto">
            <Card className="border-dashed text-center">
              <CardContent className="py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">কোনো কোর্স নেই</h3>
                <p className="text-muted-foreground mb-6">
                  আপনার অ্যাকাউন্টে এখনো কোনো কোর্স অ্যাসাইন করা হয়নি। 
                  অ্যাডমিনের সাথে যোগাযোগ করুন।
                </p>
                <Button variant="outline" onClick={() => navigate('/contact')}>
                  যোগাযোগ করুন
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Course Grid */
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-transparent">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{courses.length}</p>
                  <p className="text-sm text-muted-foreground">মোট কোর্স</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/10 to-transparent">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{courses.filter(c => c.is_completed).length}</p>
                  <p className="text-sm text-muted-foreground">সম্পূর্ণ</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent">
                <CardContent className="p-4 text-center">
                  <PlayCircle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {courses.reduce((acc, c) => acc + c.total_videos, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">মোট ক্লাস</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/10 to-transparent">
                <CardContent className="p-4 text-center">
                  <Award className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{courses.filter(c => c.is_completed).length}</p>
                  <p className="text-sm text-muted-foreground">সার্টিফিকেট</p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-xl font-bold">আমার কোর্সসমূহ</h2>
            
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
                          সম্পূর্ণ
                        </Badge>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <Button size="sm" variant="secondary" className="gap-2">
                        <Play className="w-4 h-4" />
                        শুরু করুন
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <PlayCircle className="w-3 h-3" />
                      {course.completed_videos}/{course.total_videos} ক্লাস সম্পূর্ণ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={course.progress_percent} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">{course.progress_percent}% সম্পূর্ণ</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Video Player Dialog */}
      <Dialog open={showVideoPlayer} onOpenChange={(open) => {
        setShowVideoPlayer(open);
        if (!open) {
          setSelectedVideo(null);
          setVideoMaterials([]);
        }
      }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              {selectedVideo?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <Tabs defaultValue="video" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="video" className="gap-2">
                  <PlayCircle className="w-4 h-4" />
                  ভিডিও
                </TabsTrigger>
                <TabsTrigger value="materials" className="gap-2">
                  <FileText className="w-4 h-4" />
                  ম্যাটেরিয়ালস
                  {videoMaterials.length > 0 && (
                    <Badge variant="secondary" className="ml-1">{videoMaterials.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="video" className="mt-4 space-y-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe 
                    src={getEmbedUrl(selectedVideo)} 
                    className="w-full h-full" 
                    allowFullScreen 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
                <Button onClick={markVideoComplete} className="w-full gap-2" size="lg">
                  <CheckCircle className="w-5 h-5" />
                  ভিডিও সম্পূর্ণ করুন
                </Button>
              </TabsContent>
              
              <TabsContent value="materials" className="mt-4">
                <ScrollArea className="h-[400px]">
                  {loadingMaterials ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    </div>
                  ) : videoMaterials.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">এই ভিডিওতে কোনো ম্যাটেরিয়াল নেই</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {videoMaterials.map((material) => (
                        <Card key={material.id} className="hover:border-primary transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                {getMaterialIcon(material.material_type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium">{material.title}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {material.material_type === 'pdf' ? 'PDF ফাইল' : 
                                   material.material_type === 'doc' ? 'ডকুমেন্ট' : 'নোট'}
                                </p>
                                
                                {material.material_type === 'note' && material.note_content ? (
                                  <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
                                    {material.note_content}
                                  </div>
                                ) : material.material_url && (
                                  <div className="mt-3 flex gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="gap-2"
                                      onClick={() => window.open(material.material_url!, '_blank')}
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      খুলুন
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="gap-2"
                                      onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = material.material_url!;
                                        link.download = material.title;
                                        link.click();
                                      }}
                                    >
                                      <FileDown className="w-3 h-3" />
                                      ডাউনলোড
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
