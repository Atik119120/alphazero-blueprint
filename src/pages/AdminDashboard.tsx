import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import { usePassCodes } from '@/hooks/usePassCodes';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  BookOpen, 
  Key, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  Video as VideoIcon,
  LogOut,
  Copy,
  Check,
  X,
  GripVertical,
  User,
  Lock,
  Mail,
  UserPlus
} from 'lucide-react';
import { Course, Video, PassCodeWithCourses } from '@/types/lms';

export default function AdminDashboard() {
  const { user, profile, signOut, isAdmin, isLoading: authLoading } = useAuth();
  const { courses, isLoading: coursesLoading, refetch: refetchCourses } = useCourses();
  const { 
    passCodes, 
    isLoading: passCodesLoading, 
    refetch: refetchPassCodes,
    createPassCode,
    assignCourseToPassCode,
    removeCourseFromPassCode,
    togglePassCodeStatus,
    deletePassCode
  } = usePassCodes();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');

  // Course form state
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState('');

  // Video form state
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [selectedCourseForVideo, setSelectedCourseForVideo] = useState<Course | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('youtube');
  const [videoDuration, setVideoDuration] = useState('');
  const [courseVideos, setCourseVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  // Pass code form state
  const [showPassCodeDialog, setShowPassCodeDialog] = useState(false);
  const [selectedCoursesForPassCode, setSelectedCoursesForPassCode] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Assign course dialog
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [assigningPassCode, setAssigningPassCode] = useState<PassCodeWithCourses | null>(null);
  const [selectedCourseToAssign, setSelectedCourseToAssign] = useState('');

  // Add student form state
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newStudentPassCode, setNewStudentPassCode] = useState('');
  const [addingStudent, setAddingStudent] = useState(false);

  // Admin profile state
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Course CRUD
  const openCourseDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseTitle(course.title);
      setCourseDescription(course.description || '');
      setCourseThumbnail(course.thumbnail_url || '');
    } else {
      setEditingCourse(null);
      setCourseTitle('');
      setCourseDescription('');
      setCourseThumbnail('');
    }
    setShowCourseDialog(true);
  };

  const saveCourse = async () => {
    if (!courseTitle.trim()) {
      toast.error('কোর্সের নাম দিন');
      return;
    }

    if (editingCourse) {
      const { error } = await supabase
        .from('courses')
        .update({
          title: courseTitle,
          description: courseDescription || null,
          thumbnail_url: courseThumbnail || null,
        })
        .eq('id', editingCourse.id);

      if (error) {
        toast.error('আপডেট করতে সমস্যা হয়েছে');
        return;
      }
      toast.success('কোর্স আপডেট হয়েছে');
    } else {
      const { error } = await supabase
        .from('courses')
        .insert({
          title: courseTitle,
          description: courseDescription || null,
          thumbnail_url: courseThumbnail || null,
        });

      if (error) {
        toast.error('কোর্স তৈরি করতে সমস্যা হয়েছে');
        return;
      }
      toast.success('কোর্স তৈরি হয়েছে');
    }

    setShowCourseDialog(false);
    refetchCourses();
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm('এই কোর্স মুছতে চান?')) return;

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      toast.error('মুছতে সমস্যা হয়েছে');
      return;
    }
    toast.success('কোর্স মুছে ফেলা হয়েছে');
    refetchCourses();
  };

  const toggleCoursePublish = async (course: Course) => {
    const { error } = await supabase
      .from('courses')
      .update({ is_published: !course.is_published })
      .eq('id', course.id);

    if (error) {
      toast.error('আপডেট করতে সমস্যা হয়েছে');
      return;
    }
    toast.success(course.is_published ? 'কোর্স আনপাবলিশ হয়েছে' : 'কোর্স পাবলিশ হয়েছে');
    refetchCourses();
  };

  // Video CRUD
  const openVideoDialog = async (course: Course) => {
    setSelectedCourseForVideo(course);
    setVideoTitle('');
    setVideoUrl('');
    setVideoType('youtube');
    setVideoDuration('');
    setShowVideoDialog(true);
    
    // Load existing videos
    setLoadingVideos(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('course_id', course.id)
      .order('order_index', { ascending: true });
    
    if (!error) {
      setCourseVideos((data || []) as Video[]);
    }
    setLoadingVideos(false);
  };

  const addVideo = async () => {
    if (!selectedCourseForVideo || !videoTitle.trim() || !videoUrl.trim()) {
      toast.error('সব তথ্য দিন');
      return;
    }

    const nextOrder = courseVideos.length + 1;
    const durationSeconds = videoDuration ? parseInt(videoDuration) * 60 : 0;

    const { error } = await supabase
      .from('videos')
      .insert({
        course_id: selectedCourseForVideo.id,
        title: videoTitle,
        video_url: videoUrl,
        video_type: videoType,
        duration_seconds: durationSeconds,
        order_index: nextOrder,
      });

    if (error) {
      toast.error('ভিডিও যোগ করতে সমস্যা হয়েছে');
      return;
    }

    toast.success('ভিডিও যোগ হয়েছে');
    setVideoTitle('');
    setVideoUrl('');
    setVideoDuration('');

    // Reload videos
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('course_id', selectedCourseForVideo.id)
      .order('order_index', { ascending: true });
    
    if (data) {
      setCourseVideos(data as Video[]);
    }
  };

  const deleteVideo = async (videoId: string) => {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (error) {
      toast.error('মুছতে সমস্যা হয়েছে');
      return;
    }
    
    setCourseVideos(prev => prev.filter(v => v.id !== videoId));
    toast.success('ভিডিও মুছে ফেলা হয়েছে');
  };

  // Pass code
  const handleCreatePassCode = async () => {
    const result = await createPassCode(selectedCoursesForPassCode);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Pass Code তৈরি হয়েছে');
    setShowPassCodeDialog(false);
    setSelectedCoursesForPassCode([]);
  };

  const copyPassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('কপি হয়েছে');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTogglePassCode = async (passCode: PassCodeWithCourses) => {
    const result = await togglePassCodeStatus(passCode.id, !passCode.is_active);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(passCode.is_active ? 'Pass Code নিষ্ক্রিয় হয়েছে' : 'Pass Code সক্রিয় হয়েছে');
  };

  const handleDeletePassCode = async (passCodeId: string) => {
    if (!confirm('এই Pass Code মুছতে চান?')) return;
    
    const result = await deletePassCode(passCodeId);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Pass Code মুছে ফেলা হয়েছে');
  };

  const openAssignDialog = (passCode: PassCodeWithCourses) => {
    setAssigningPassCode(passCode);
    setSelectedCourseToAssign('');
    setShowAssignDialog(true);
  };

  const handleAssignCourse = async () => {
    if (!assigningPassCode || !selectedCourseToAssign) return;

    const result = await assignCourseToPassCode(assigningPassCode.id, selectedCourseToAssign);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('কোর্স যোগ হয়েছে');
    setShowAssignDialog(false);
  };

  const handleRemoveCourse = async (passCodeId: string, courseId: string) => {
    const result = await removeCourseFromPassCode(passCodeId, courseId);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('কোর্স সরানো হয়েছে');
  };

  const availableCoursesForAssign = assigningPassCode 
    ? courses.filter(c => !assigningPassCode.courses.some(ac => ac.id === c.id))
    : [];

  // Add student handler
  const handleAddStudent = async () => {
    if (!newStudentName.trim() || !newStudentEmail.trim() || !newStudentPassword.trim()) {
      toast.error('সব তথ্য দিন');
      return;
    }

    if (newStudentPassword.length < 6) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    setAddingStudent(true);

    try {
      // Create user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newStudentEmail,
        password: newStudentPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: newStudentName,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          toast.error('এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে');
        } else {
          toast.error(authError.message);
        }
        setAddingStudent(false);
        return;
      }

      if (authData.user) {
        // Create profile
        await supabase.from('profiles').insert({
          user_id: authData.user.id,
          full_name: newStudentName,
          email: newStudentEmail,
        });

        // Assign student role
        await supabase.from('user_roles').insert({
          user_id: authData.user.id,
          role: 'student',
        });

        // If passcode provided, link it
        if (newStudentPassCode.trim()) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', authData.user.id)
            .single();

          if (profileData) {
            const { data: passCodeData } = await supabase
              .from('pass_codes')
              .select('id')
              .eq('code', newStudentPassCode.toUpperCase().trim())
              .eq('is_active', true)
              .maybeSingle();

            if (passCodeData) {
              await supabase
                .from('pass_codes')
                .update({ student_id: profileData.id })
                .eq('id', passCodeData.id);
            }
          }
        }

        toast.success('ছাত্র সফলভাবে যোগ হয়েছে!');
        setShowAddStudentDialog(false);
        setNewStudentName('');
        setNewStudentEmail('');
        setNewStudentPassword('');
        setNewStudentPassCode('');
        refetchPassCodes();
      }
    } catch (error) {
      toast.error('কিছু ভুল হয়েছে');
    } finally {
      setAddingStudent(false);
    }
  };

  // Change password handler
  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error('সব তথ্য দিন');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('পাসওয়ার্ড মিলছে না');
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
        setChangingPassword(false);
        return;
      }

      toast.success('পাসওয়ার্ড পরিবর্তন হয়েছে!');
      setShowPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('কিছু ভুল হয়েছে');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">{profile?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowProfileDialog(true)} className="gap-2">
              <User className="w-4 h-4" />
              প্রোফাইল
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              লগ আউট
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="courses" className="gap-2">
              <BookOpen className="w-4 h-4" />
              কোর্স
            </TabsTrigger>
            <TabsTrigger value="passcodes" className="gap-2">
              <Key className="w-4 h-4" />
              Pass Code
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2">
              <Users className="w-4 h-4" />
              ছাত্র
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              প্রোফাইল
            </TabsTrigger>
          </TabsList>
          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">সব কোর্স</h2>
              <Button onClick={() => openCourseDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                নতুন কোর্স
              </Button>
            </div>

            {coursesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : courses.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">কোনো কোর্স নেই</p>
                  <Button onClick={() => openCourseDialog()} className="mt-4 gap-2">
                    <Plus className="w-4 h-4" />
                    প্রথম কোর্স তৈরি করুন
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      {course.thumbnail_url ? (
                        <img 
                          src={course.thumbnail_url} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <Badge 
                        className="absolute top-2 right-2"
                        variant={course.is_published ? 'default' : 'secondary'}
                      >
                        {course.is_published ? 'পাবলিশড' : 'ড্রাফট'}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      {course.description && (
                        <CardDescription className="line-clamp-2">
                          {course.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">পাবলিশ</span>
                        <Switch
                          checked={course.is_published}
                          onCheckedChange={() => toggleCoursePublish(course)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-1"
                          onClick={() => openVideoDialog(course)}
                        >
                          <VideoIcon className="w-3 h-3" />
                          ভিডিও
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openCourseDialog(course)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteCourse(course.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pass Codes Tab */}
          <TabsContent value="passcodes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">সব Pass Code</h2>
              <Dialog open={showPassCodeDialog} onOpenChange={setShowPassCodeDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    নতুন Pass Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>নতুন Pass Code তৈরি</DialogTitle>
                    <DialogDescription>
                      কোর্স সিলেক্ট করুন যা এই Pass Code এ থাকবে
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>কোর্স সিলেক্ট করুন</Label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {courses.filter(c => c.is_published).map((course) => (
                          <label 
                            key={course.id} 
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCoursesForPassCode.includes(course.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCoursesForPassCode(prev => [...prev, course.id]);
                                } else {
                                  setSelectedCoursesForPassCode(prev => prev.filter(id => id !== course.id));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{course.title}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowPassCodeDialog(false)}>
                      বাতিল
                    </Button>
                    <Button onClick={handleCreatePassCode}>
                      তৈরি করুন
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {passCodesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : passCodes.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">কোনো Pass Code নেই</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {passCodes.map((passCode) => (
                  <Card key={passCode.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <code className="text-lg font-mono bg-muted px-3 py-1 rounded-lg">
                              {passCode.code}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyPassCode(passCode.code)}
                            >
                              {copiedCode === passCode.code ? (
                                <Check className="w-4 h-4 text-primary" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            <Badge variant={passCode.is_active ? 'default' : 'secondary'}>
                              {passCode.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                            </Badge>
                          </div>
                          
                          {passCode.student && (
                            <p className="text-sm text-muted-foreground">
                              ছাত্র: {passCode.student.full_name} ({passCode.student.email})
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            {passCode.courses.map((course) => (
                              <Badge 
                                key={course.id} 
                                variant="outline"
                                className="gap-1"
                              >
                                {course.title}
                                <button
                                  onClick={() => handleRemoveCourse(passCode.id, course.id)}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 text-xs gap-1"
                              onClick={() => openAssignDialog(passCode)}
                            >
                              <Plus className="w-3 h-3" />
                              কোর্স যোগ
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            checked={passCode.is_active}
                            onCheckedChange={() => handleTogglePassCode(passCode)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePassCode(passCode.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">ছাত্র তালিকা</h2>
              <Button onClick={() => setShowAddStudentDialog(true)} className="gap-2">
                <UserPlus className="w-4 h-4" />
                নতুন ছাত্র যোগ
              </Button>
            </div>
            
            {passCodes.filter(pc => pc.student).length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">কোনো ছাত্র নেই</p>
                  <Button onClick={() => setShowAddStudentDialog(true)} className="mt-4 gap-2">
                    <UserPlus className="w-4 h-4" />
                    প্রথম ছাত্র যোগ করুন
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {passCodes.filter(pc => pc.student).map((passCode) => (
                  <Card key={passCode.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{passCode.student?.full_name}</CardTitle>
                          <CardDescription className="truncate">{passCode.student?.email}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 text-center">
                          {passCode.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyPassCode(passCode.code)}
                        >
                          {copiedCode === passCode.code ? (
                            <Check className="w-3 h-3 text-primary" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{passCode.courses.length} কোর্স</span>
                        <Badge variant={passCode.is_active ? 'default' : 'secondary'}>
                          {passCode.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-xl font-semibold">Admin প্রোফাইল</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    প্রোফাইল তথ্য
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{profile?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{profile?.email}</p>
                      <Badge className="mt-2">Admin</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    পাসওয়ার্ড পরিবর্তন
                  </CardTitle>
                  <CardDescription>
                    আপনার অ্যাকাউন্ট সুরক্ষিত রাখতে পাসওয়ার্ড পরিবর্তন করুন
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setShowPasswordDialog(true)} 
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    পাসওয়ার্ড পরিবর্তন করুন
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Course Dialog */}
      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'কোর্স এডিট' : 'নতুন কোর্স'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="course-title">কোর্সের নাম</Label>
              <Input
                id="course-title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="কোর্সের নাম লিখুন"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-desc">বিবরণ</Label>
              <Textarea
                id="course-desc"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="কোর্সের বিবরণ"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-thumb">থাম্বনেইল URL</Label>
              <Input
                id="course-thumb"
                value={courseThumbnail}
                onChange={(e) => setCourseThumbnail(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCourseDialog(false)}>
              বাতিল
            </Button>
            <Button onClick={saveCourse}>
              {editingCourse ? 'আপডেট' : 'তৈরি করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCourseForVideo?.title} - ভিডিও ম্যানেজ
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Add Video Form */}
            <div className="grid gap-4 p-4 border rounded-lg">
              <h4 className="font-medium">নতুন ভিডিও যোগ করুন</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>ভিডিও টাইটেল</Label>
                  <Input
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="ভিডিও ১"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ভিডিও টাইপ</Label>
                  <Select value={videoType} onValueChange={setVideoType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>ভিডিও URL</Label>
                  <Input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>সময়কাল (মিনিট)</Label>
                  <Input
                    type="number"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>
              <Button onClick={addVideo} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                ভিডিও যোগ করুন
              </Button>
            </div>

            {/* Video List */}
            <div className="space-y-2">
              <h4 className="font-medium">ভিডিও তালিকা</h4>
              {loadingVideos ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                </div>
              ) : courseVideos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  কোনো ভিডিও নেই
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {courseVideos.map((video, index) => (
                    <div 
                      key={video.id}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{video.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {video.video_url}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {video.video_type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteVideo(video.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowVideoDialog(false)}>
              সম্পন্ন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Course Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>কোর্স যোগ করুন</DialogTitle>
            <DialogDescription>
              {assigningPassCode?.code} এ নতুন কোর্স যোগ করুন
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedCourseToAssign} onValueChange={setSelectedCourseToAssign}>
              <SelectTrigger>
                <SelectValue placeholder="কোর্স সিলেক্ট করুন" />
              </SelectTrigger>
              <SelectContent>
                {availableCoursesForAssign.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              বাতিল
            </Button>
            <Button onClick={handleAssignCourse} disabled={!selectedCourseToAssign}>
              যোগ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={showAddStudentDialog} onOpenChange={setShowAddStudentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              নতুন ছাত্র যোগ করুন
            </DialogTitle>
            <DialogDescription>
              ছাত্রের তথ্য দিন এবং পাসকোড অ্যাসাইন করুন
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="student-name">পুরো নাম</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="student-name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="ছাত্রের নাম"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-email">ইমেইল</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="student-email"
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="student@email.com"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-password">পাসওয়ার্ড</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="student-password"
                  type="password"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-passcode">Pass Code (ঐচ্ছিক)</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="student-passcode"
                  value={newStudentPassCode}
                  onChange={(e) => setNewStudentPassCode(e.target.value.toUpperCase())}
                  placeholder="বিদ্যমান Pass Code"
                  className="pl-10 font-mono"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                বিদ্যমান Pass Code দিলে ছাত্র সেটার সাথে লিংক হবে
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStudentDialog(false)}>
              বাতিল
            </Button>
            <Button onClick={handleAddStudent} disabled={addingStudent}>
              {addingStudent ? 'যোগ হচ্ছে...' : 'ছাত্র যোগ করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              পাসওয়ার্ড পরিবর্তন
            </DialogTitle>
            <DialogDescription>
              নতুন পাসওয়ার্ড দিন
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">নতুন পাসওয়ার্ড</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">পাসওয়ার্ড নিশ্চিত করুন</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="আবার পাসওয়ার্ড দিন"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              বাতিল
            </Button>
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin প্রোফাইল</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-xl">{profile?.full_name}</p>
                <p className="text-muted-foreground">{profile?.email}</p>
                <Badge className="mt-2">Admin</Badge>
              </div>
            </div>
            <Button 
              onClick={() => {
                setShowProfileDialog(false);
                setShowPasswordDialog(true);
              }} 
              variant="outline"
              className="w-full gap-2"
            >
              <Lock className="w-4 h-4" />
              পাসওয়ার্ড পরিবর্তন করুন
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowProfileDialog(false)}>
              বন্ধ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
