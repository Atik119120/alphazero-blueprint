import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import { usePassCodes } from '@/hooks/usePassCodes';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  LogOut,
  Copy,
  Check,
  X,
  User,
  Lock,
  Mail,
  UserPlus
} from 'lucide-react';
import { PassCodeWithCourses } from '@/types/lms';
import CourseManagement from '@/components/admin/CourseManagement';

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

  // Add student handler - using Edge Function to avoid session switch
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
      // Use Edge Function to create student without affecting admin session
      const { data, error } = await supabase.functions.invoke('create-student', {
        body: {
          full_name: newStudentName.trim(),
          email: newStudentEmail.trim(),
          password: newStudentPassword,
          pass_code: newStudentPassCode.trim() || undefined,
        },
      });

      if (error) {
        toast.error(error.message || 'ছাত্র তৈরি করতে সমস্যা হয়েছে');
        setAddingStudent(false);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setAddingStudent(false);
        return;
      }

      toast.success('ছাত্র সফলভাবে যোগ হয়েছে!');
      setShowAddStudentDialog(false);
      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentPassword('');
      setNewStudentPassCode('');
      refetchPassCodes();
    } catch (error) {
      console.error('Add student error:', error);
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
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('কিছু ভুল হয়েছে');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-primary/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-primary to-primary/80 p-2.5 rounded-2xl">
                <img 
                  src="/logo.png" 
                  alt="Alpha Academy" 
                  className="w-8 h-8 object-contain brightness-0 invert"
                />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight gradient-text">Alpha Academy</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {profile?.full_name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowProfileDialog(true)} 
              className="gap-2 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">প্রোফাইল</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout} 
              className="gap-2 hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">লগ আউট</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-xs text-muted-foreground">মোট কোর্স</p>
              </div>
            </div>
          </div>
          <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-500/10 rounded-xl">
                <Key className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{passCodes.filter(p => p.is_active).length}</p>
                <p className="text-xs text-muted-foreground">সক্রিয় Pass Code</p>
              </div>
            </div>
          </div>
          <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 rounded-xl">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{passCodes.filter(p => p.student).length}</p>
                <p className="text-xs text-muted-foreground">মোট ছাত্র</p>
              </div>
            </div>
          </div>
          <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/10 rounded-xl">
                <Check className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.filter(c => c.is_published).length}</p>
                <p className="text-xs text-muted-foreground">প্রকাশিত</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-card/60 backdrop-blur-sm border border-border/50 p-1.5 rounded-2xl h-auto">
            <TabsTrigger 
              value="courses" 
              className="gap-2 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">কোর্স</span>
            </TabsTrigger>
            <TabsTrigger 
              value="passcodes" 
              className="gap-2 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">Pass Code</span>
            </TabsTrigger>
            <TabsTrigger 
              value="students" 
              className="gap-2 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">ছাত্র</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="gap-2 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">প্রোফাইল</span>
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <CourseManagement 
              courses={courses}
              coursesLoading={coursesLoading}
              refetchCourses={refetchCourses}
            />
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

      {/* Assign Course Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>কোর্স যোগ করুন</DialogTitle>
            <DialogDescription>
              <code className="font-mono bg-muted px-2 py-1 rounded">{assigningPassCode?.code}</code> এ কোর্স অ্যাসাইন করতে নিচে থেকে সিলেক্ট করুন
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {availableCoursesForAssign.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">সব কোর্স ইতিমধ্যে অ্যাসাইন করা হয়েছে</p>
              </div>
            ) : (
              <div className="grid gap-3 max-h-[400px] overflow-y-auto">
                {availableCoursesForAssign.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourseToAssign(course.id)}
                    className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCourseToAssign === course.id 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="w-16 h-12 rounded-md bg-muted overflow-hidden flex-shrink-0">
                      {course.thumbnail_url ? (
                        <img 
                          src={course.thumbnail_url} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{course.title}</p>
                      {course.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{course.description}</p>
                      )}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedCourseToAssign === course.id 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground'
                    }`}>
                      {selectedCourseToAssign === course.id && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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