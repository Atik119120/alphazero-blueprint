import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
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
  Phone,
  UserPlus,
  Search,
  TrendingUp,
  Shield,
  Camera,
  Edit,
  DollarSign,
  Banknote,
  Moon,
  Sun,
  Languages,
  BarChart3,
  PieChart,
  Briefcase,
  UsersRound,
  Wrench,
  Settings,
  FileText,
  Link2
} from 'lucide-react';
import { PassCodeWithCourses } from '@/types/lms';
import CourseManagement from '@/components/admin/CourseManagement';
import { WorksManagement } from '@/components/admin/WorksManagement';
import { TeamManagement } from '@/components/admin/TeamManagement';
import { ServicesManagement } from '@/components/admin/ServicesManagement';
import SiteSettingsManagement from '@/components/admin/SiteSettingsManagement';
import PageContentManagement from '@/components/admin/PageContentManagement';
import FooterManagement from '@/components/admin/FooterManagement';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// Chart colors
const CHART_COLORS = ['#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444', '#ec4899'];

export default function AdminDashboard() {
  const { user, profile, signOut, isAdmin, isLoading: authLoading } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
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

  // Add admin state
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);

  // Edit profile state
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Search state
  const [studentSearch, setStudentSearch] = useState('');

  // Admin list state
  const [admins, setAdmins] = useState<Array<{
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
    created_at: string | null;
  }>>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  // Enrollment requests state
  const [enrollmentRequests, setEnrollmentRequests] = useState<Array<{
    id: string;
    user_id: string;
    course_id: string;
    student_name: string;
    student_email: string;
    status: string;
    message: string | null;
    phone_number: string | null;
    payment_method: string | null;
    transaction_id: string | null;
    created_at: string;
    course?: { title: string };
  }>>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Fetch all admins
  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      // Get all user_ids with admin role
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (rolesError) {
        console.error('Error fetching admin roles:', rolesError);
        return;
      }

      if (!adminRoles || adminRoles.length === 0) {
        setAdmins([]);
        return;
      }

      const adminUserIds = adminRoles.map(r => r.user_id);

      // Get profiles for these users
      const { data: adminProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, email, avatar_url, created_at')
        .in('user_id', adminUserIds);

      if (profilesError) {
        console.error('Error fetching admin profiles:', profilesError);
        return;
      }

      setAdmins(adminProfiles || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoadingAdmins(false);
    }
  };

  // Fetch enrollment requests
  const fetchEnrollmentRequests = async () => {
    setLoadingRequests(true);
    try {
      const { data, error } = await supabase
        .from('enrollment_requests')
        .select(`
          *,
          course:courses(title)
        `)
        .order('created_at', { ascending: false });

      if (!error) {
        setEnrollmentRequests((data || []) as any);
      }
    } catch (error) {
      console.error('Error fetching enrollment requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Approve enrollment request
  const approveEnrollment = async (request: typeof enrollmentRequests[0]) => {
    try {
      toast.loading(language === 'bn' ? 'অনুমোদন করা হচ্ছে...' : 'Approving...', { id: 'approve' });
      
      // Call approve-enrollment edge function
      const { data, error } = await supabase.functions.invoke('approve-enrollment', {
        body: { enrollment_id: request.id }
      });

      if (error) {
        console.error('Approve error:', error);
        toast.error(language === 'bn' ? 'অনুমোদন করতে সমস্যা হয়েছে' : 'Error approving enrollment', { id: 'approve' });
        return;
      }

      if (data?.error) {
        toast.error(data.error, { id: 'approve' });
        return;
      }

      toast.success(language === 'bn' ? 'অনুমোদিত! Student account তৈরি হয়েছে।' : 'Approved! Student account created.', { id: 'approve' });
      fetchEnrollmentRequests();
      refetchPassCodes();
    } catch (error) {
      console.error('Error approving enrollment:', error);
      toast.error(language === 'bn' ? 'সমস্যা হয়েছে' : 'Error approving enrollment', { id: 'approve' });
    }
  };

  // Reject enrollment request
  const rejectEnrollment = async (requestId: string) => {
    const { error } = await supabase
      .from('enrollment_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) {
      toast.error('Error rejecting request');
    } else {
      toast.success(language === 'bn' ? 'প্রত্যাখ্যান করা হয়েছে' : 'Request rejected');
      fetchEnrollmentRequests();
    }
  };

  // Fetch admins and enrollment requests on mount
  useEffect(() => {
    if (user && isAdmin) {
      fetchAdmins();
      fetchEnrollmentRequests();
    }
  }, [user, isAdmin]);

  // Filter students by search
  const filteredStudents = passCodes.filter(pc => {
    if (!pc.student) return false;
    if (!studentSearch.trim()) return true;
    const searchLower = studentSearch.toLowerCase();
    return (
      pc.student.full_name.toLowerCase().includes(searchLower) ||
      pc.student.email.toLowerCase().includes(searchLower) ||
      pc.code.toLowerCase().includes(searchLower)
    );
  });

  const formatDateTime = (value: string | null | undefined) => {
    if (!value) return '';
    const locale = language === 'bn' ? 'bn-BD' : 'en-US';
    return new Date(value).toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isRecent = (value: string | null | undefined) => {
    if (!value) return false;
    const created = new Date(value).getTime();
    if (Number.isNaN(created)) return false;
    return Date.now() - created < 24 * 60 * 60 * 1000;
  };

  const unassignedStudents = filteredStudents.filter(pc => pc.courses.length === 0);
  const assignedStudents = filteredStudents.filter(pc => pc.courses.length > 0);

  // Calculate course enrollment stats with sales
  const courseEnrollmentStats = courses.map(course => {
    const enrollmentCount = passCodes.filter(pc => 
      pc.courses.some(c => c.id === course.id) && pc.student
    ).length;
    const coursePrice = (course as any).price || 0;
    const totalSales = enrollmentCount * coursePrice;
    return {
      ...course,
      enrollmentCount,
      price: coursePrice,
      totalSales
    };
  }).sort((a, b) => b.enrollmentCount - a.enrollmentCount);

  // Calculate total revenue
  const totalRevenue = courseEnrollmentStats.reduce((sum, course) => sum + course.totalSales, 0);

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

  // Add admin handler
  const handleAddAdmin = async () => {
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      toast.error('সব তথ্য দিন');
      return;
    }

    if (newAdminPassword.length < 6) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    setAddingAdmin(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: {
          full_name: newAdminName.trim(),
          email: newAdminEmail.trim(),
          password: newAdminPassword,
        },
      });

      if (error) {
        toast.error(error.message || 'Admin তৈরি করতে সমস্যা হয়েছে');
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      toast.success('নতুন Admin সফলভাবে যোগ হয়েছে!');
      setShowAddAdminDialog(false);
      setNewAdminName('');
      setNewAdminEmail('');
      // Refresh admin list
      fetchAdmins();
      setNewAdminPassword('');
    } catch (error) {
      console.error('Add admin error:', error);
      toast.error('কিছু ভুল হয়েছে');
    } finally {
      setAddingAdmin(false);
    }
  };

  // Update profile handler
  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      toast.error('নাম দিন');
      return;
    }

    setUpdatingProfile(true);

    try {
      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: editName.trim() })
        .eq('user_id', user?.id);

      if (profileError) {
        toast.error(profileError.message);
        return;
      }

      // Update email if changed
      if (editEmail.trim() !== profile?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: editEmail.trim(),
        });

        if (emailError) {
          toast.error(emailError.message);
          return;
        }
        toast.info('ইমেইল আপডেট করতে নতুন ইমেইলে confirm করুন');
      }

      toast.success('প্রোফাইল আপডেট হয়েছে!');
      setShowEditProfileDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('কিছু ভুল হয়েছে');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Avatar upload handler
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('শুধু ইমেজ ফাইল আপলোড করুন');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('ফাইল সাইজ ২MB এর কম হতে হবে');
      return;
    }

    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        toast.error(uploadError.message);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user?.id);

      if (profileError) {
        toast.error(profileError.message);
        return;
      }

      toast.success('প্রোফাইল ছবি আপলোড হয়েছে!');
      window.location.reload();
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('কিছু ভুল হয়েছে');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Prepare chart data for enrollment
  const enrollmentChartData = courseEnrollmentStats.slice(0, 6).map(course => ({
    name: course.title.length > 12 ? course.title.slice(0, 12) + '...' : course.title,
    students: course.enrollmentCount,
    sales: course.totalSales
  }));

  // Pie chart data for course distribution
  const pieChartData = courseEnrollmentStats.filter(c => c.enrollmentCount > 0).map((course, index) => ({
    name: course.title,
    value: course.enrollmentCount,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 ${language === 'bn' ? 'font-bengali' : ''}`}>
      {/* Header */}
      <header className="border-b border-border bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-primary to-cyan-600 p-2.5 rounded-2xl">
              <img 
                src="/logo.png" 
                alt="Alpha Academy" 
                className="w-8 h-8 object-contain brightness-0 invert"
              />
            </div>
            <div>
              <h1 className={`font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent ${language === 'bn' ? 'font-[SabinaShorolipi]' : ''}`}>
                {language === 'bn' ? 'আলফা একাডেমি' : 'Alpha Academy'}
              </h1>
              <p className={`text-sm text-muted-foreground flex items-center gap-1.5 ${language === 'bn' ? 'font-[MahinRafid]' : ''}`}>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                {profile?.full_name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="gap-2 hover:bg-primary/10 hover:border-primary transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'bn' ? 'EN' : 'বাং'}</span>
            </Button>
            
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="gap-2 hover:bg-primary/10 hover:border-primary transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowProfileDialog(true)} 
              className="gap-2 hover:bg-primary/10 hover:border-primary transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'bn' ? 'প্রোফাইল' : 'Profile'}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout} 
              className="gap-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'bn' ? 'লগ আউট' : 'Logout'}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-primary/5 to-cyan-500/5 border border-primary/20 rounded-2xl p-4 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-primary to-cyan-600 rounded-xl">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{courses.length}</p>
                <p className={`text-xs text-muted-foreground ${language === 'bn' ? 'font-[MahinRafid]' : ''}`}>
                  {language === 'bn' ? 'মোট কোর্স' : 'Total Courses'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/5 to-green-500/5 border border-emerald-500/20 rounded-2xl p-4 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                <Key className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{passCodes.filter(p => p.is_active).length}</p>
                <p className={`text-xs text-muted-foreground ${language === 'bn' ? 'font-[MahinRafid]' : ''}`}>
                  {language === 'bn' ? 'সক্রিয় Pass Code' : 'Active Pass Codes'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/20 rounded-2xl p-4 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{passCodes.filter(p => p.student).length}</p>
                <p className={`text-xs text-muted-foreground ${language === 'bn' ? 'font-[MahinRafid]' : ''}`}>
                  {language === 'bn' ? 'মোট ছাত্র' : 'Total Students'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-violet-500/5 to-purple-500/5 border border-violet-500/20 rounded-2xl p-4 hover:border-violet-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{courses.filter(c => c.is_published).length}</p>
                <p className={`text-xs text-muted-foreground ${language === 'bn' ? 'font-[MahinRafid]' : ''}`}>
                  {language === 'bn' ? 'প্রকাশিত' : 'Published'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4 hover:border-amber-500/40 transition-colors col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                <Banknote className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {language === 'bn' ? `৳${totalRevenue.toLocaleString('bn-BD')}` : `৳${totalRevenue.toLocaleString()}`}
                </p>
                <p className={`text-xs text-muted-foreground ${language === 'bn' ? 'font-[MahinRafid]' : ''}`}>
                  {language === 'bn' ? 'মোট বিক্রি' : 'Total Sales'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Redesigned Tab Navigation */}
          <div className="bg-white dark:bg-slate-800/50 border border-border rounded-2xl p-4 shadow-sm">
            {/* Category Labels and Tab Groups */}
            <div className="space-y-4">
              {/* LMS Section */}
              <div>
                <p className={`text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1 ${language === 'bn' ? 'font-[MahinRafid]' : ''}`}>
                  {language === 'bn' ? '📚 এলএমএস' : '📚 LMS'}
                </p>
                <TabsList className="flex flex-wrap gap-2 bg-transparent h-auto p-0">
                  <TabsTrigger 
                    value="courses" 
                    className="gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-secondary/50 hover:bg-secondary data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:border-primary/20 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{language === 'bn' ? 'কোর্স' : 'Courses'}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="students" 
                    className="gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-secondary/50 hover:bg-secondary data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:border-primary/20 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
                  >
                    <Users className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ছাত্র' : 'Students'}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="passcodes" 
                    className="gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-secondary/50 hover:bg-secondary data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:border-primary/20 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
                  >
                    <Key className="w-4 h-4" />
                    <span>Pass Code</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="requests" 
                    className="gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-secondary/50 hover:bg-secondary data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:border-primary/20 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all relative"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{language === 'bn' ? 'রিকোয়েস্ট' : 'Requests'}</span>
                    {enrollmentRequests.filter(r => r.status === 'pending').length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                        {enrollmentRequests.filter(r => r.status === 'pending').length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics" 
                    className="gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-secondary/50 hover:bg-secondary data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:border-primary/20 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>{language === 'bn' ? 'এনালাইটিক্স' : 'Analytics'}</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="border-t border-border/50" />

              {/* Website CMS Section */}
              <div>
                <p className={`text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1 ${language === 'bn' ? 'font-[MahinRafid]' : ''}`}>
                  {language === 'bn' ? '🌐 ওয়েবসাইট' : '🌐 Website CMS'}
                </p>
                <TabsList className="flex flex-wrap gap-2 bg-transparent h-auto p-0">
                  <TabsTrigger 
                    value="content" 
                    className="gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-secondary/50 hover:bg-secondary data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:border-violet-500/20 data-[state=active]:shadow-lg data-[state=active]:shadow-violet-500/20 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{language === 'bn' ? 'পেজ কনটেন্ট' : 'Page Content'}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="works" 
                    className="gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-secondary/50 hover:bg-secondary data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:border-violet-500/20 data-[state=active]:shadow-lg data-[state=active]:shadow-violet-500/20 transition-all"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ওয়ার্কস' : 'Works'}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="team" 
                    className="gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-secondary/50 hover:bg-secondary data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:border-violet-500/20 data-[state=active]:shadow-lg data-[state=active]:shadow-violet-500/20 transition-all"
                  >
                    <UsersRound className="w-4 h-4" />
                    <span>{language === 'bn' ? 'টিম' : 'Team'}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="services" 
                    className="gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-secondary/50 hover:bg-secondary data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:border-violet-500/20 data-[state=active]:shadow-lg data-[state=active]:shadow-violet-500/20 transition-all"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>{language === 'bn' ? 'সার্ভিস' : 'Services'}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="footer" 
                    className="gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-secondary/50 hover:bg-secondary data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:border-violet-500/20 data-[state=active]:shadow-lg data-[state=active]:shadow-violet-500/20 transition-all"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ফুটার' : 'Footer'}</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="border-t border-border/50" />

              {/* Settings Section */}
              <div>
                <p className={`text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1 ${language === 'bn' ? 'font-[MahinRafid]' : ''}`}>
                  {language === 'bn' ? '⚙️ সেটিংস' : '⚙️ Settings'}
                </p>
                <TabsList className="flex flex-wrap gap-2 bg-transparent h-auto p-0">
                  <TabsTrigger 
                    value="settings" 
                    className="gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-secondary/50 hover:bg-secondary data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:border-amber-500/20 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/20 transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{language === 'bn' ? 'সাইট সেটিংস' : 'Site Settings'}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile" 
                    className="gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-secondary/50 hover:bg-secondary data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:border-amber-500/20 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/20 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span>{language === 'bn' ? 'প্রোফাইল ও এডমিন' : 'Profile & Admins'}</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <CourseManagement 
              courses={courses}
              coursesLoading={coursesLoading}
              refetchCourses={refetchCourses}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                {language === 'bn' ? 'এনালাইটিক্স ড্যাশবোর্ড' : 'Analytics Dashboard'}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Enrollment Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className={`text-lg flex items-center gap-2 ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                    <BarChart3 className="w-5 h-5 text-primary" />
                    {language === 'bn' ? 'কোর্স অনুযায়ী ছাত্র' : 'Students by Course'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'bn' ? 'প্রতিটি কোর্সে কতজন ছাত্র এনরোল করেছে' : 'Number of students enrolled in each course'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {enrollmentChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={enrollmentChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 10 }} 
                          className="text-muted-foreground"
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      {language === 'bn' ? 'কোনো ডাটা নেই' : 'No data available'}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Course Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className={`text-lg flex items-center gap-2 ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                    <PieChart className="w-5 h-5 text-primary" />
                    {language === 'bn' ? 'ছাত্র বন্টন' : 'Student Distribution'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'bn' ? 'কোন কোর্সে কত শতাংশ ছাত্র' : 'Percentage of students per course'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pieChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number, name: string) => [
                            `${value} ${language === 'bn' ? 'জন ছাত্র' : 'students'}`,
                            name
                          ]}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      {language === 'bn' ? 'কোনো ডাটা নেই' : 'No data available'}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sales Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className={`text-lg flex items-center gap-2 ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                    <Banknote className="w-5 h-5 text-amber-500" />
                    {language === 'bn' ? 'কোর্স অনুযায়ী বিক্রি' : 'Sales by Course'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'bn' ? 'প্রতিটি কোর্স থেকে কত টাকা আয় হয়েছে' : 'Revenue generated from each course'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {enrollmentChartData.some(d => d.sales > 0) ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={enrollmentChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 10 }} 
                          className="text-muted-foreground"
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [`৳${value.toLocaleString()}`, language === 'bn' ? 'বিক্রি' : 'Sales']}
                        />
                        <Bar dataKey="sales" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground flex-col gap-2">
                      <Banknote className="w-12 h-12 opacity-50" />
                      <p>{language === 'bn' ? 'এখনো কোনো বিক্রি নেই' : 'No sales yet'}</p>
                      <p className="text-xs">{language === 'bn' ? 'কোর্সে দাম সেট করুন এবং ছাত্র এনরোল করুন' : 'Set course prices and enroll students'}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className={`text-lg flex items-center gap-2 ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    {language === 'bn' ? 'দ্রুত পরিসংখ্যান' : 'Quick Stats'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-primary">{passCodes.filter(p => p.student).length}</p>
                      <p className={`text-sm text-muted-foreground ${language === 'bn' ? 'font-[MahinRafid]' : ''}`}>
                        {language === 'bn' ? 'মোট ছাত্র' : 'Total Students'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-emerald-600">{courses.filter(c => c.is_published).length}</p>
                      <p className={`text-sm text-muted-foreground ${language === 'bn' ? 'font-[MahinRafid]' : ''}`}>
                        {language === 'bn' ? 'প্রকাশিত কোর্স' : 'Published Courses'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-amber-600">৳{totalRevenue.toLocaleString()}</p>
                      <p className={`text-sm text-muted-foreground ${language === 'bn' ? 'font-[MahinRafid]' : ''}`}>
                        {language === 'bn' ? 'মোট আয়' : 'Total Revenue'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-violet-600">
                        {courses.length > 0 ? Math.round((passCodes.filter(p => p.student).length / Math.max(courses.length, 1)) * 10) / 10 : 0}
                      </p>
                      <p className={`text-sm text-muted-foreground ${language === 'bn' ? 'font-[MahinRafid]' : ''}`}>
                        {language === 'bn' ? 'গড় ছাত্র/কোর্স' : 'Avg Students/Course'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Top Courses */}
                  <div className="pt-4 border-t">
                    <h4 className={`text-sm font-medium mb-3 ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                      {language === 'bn' ? 'জনপ্রিয় কোর্স' : 'Top Courses'}
                    </h4>
                    <div className="space-y-2">
                      {courseEnrollmentStats.slice(0, 3).map((course, index) => (
                        <div key={course.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-amber-500 text-white' : 
                              index === 1 ? 'bg-slate-400 text-white' : 
                              'bg-amber-700 text-white'
                            }`}>
                              {index + 1}
                            </span>
                            <span className="text-sm truncate max-w-[150px]">{course.title}</span>
                          </div>
                          <Badge variant="secondary">{course.enrollmentCount} {language === 'bn' ? 'জন' : ''}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                {language === 'bn' ? 'এনরোলমেন্ট রিকোয়েস্ট' : 'Enrollment Requests'}
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchEnrollmentRequests}
                disabled={loadingRequests}
                className="gap-2"
              >
                {loadingRequests ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
                {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
              </Button>
            </div>

            {loadingRequests ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
              </div>
            ) : enrollmentRequests.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{language === 'bn' ? 'কোনো রিকোয়েস্ট নেই' : 'No enrollment requests'}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {enrollmentRequests.map((request) => (
                  <Card key={request.id} className={`overflow-hidden ${request.status === 'pending' ? 'border-amber-500/50' : request.status === 'approved' ? 'border-green-500/50' : 'border-red-500/50'}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            request.status === 'pending' ? 'bg-amber-500/20' : 
                            request.status === 'approved' ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}>
                            <span className={`font-bold ${
                              request.status === 'pending' ? 'text-amber-600' : 
                              request.status === 'approved' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {request.student_name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base truncate">{request.student_name}</CardTitle>
                            <CardDescription className="truncate">{request.student_email}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={request.status === 'pending' ? 'secondary' : request.status === 'approved' ? 'default' : 'destructive'}>
                          {request.status === 'pending' ? (language === 'bn' ? 'পেন্ডিং' : 'Pending') : 
                           request.status === 'approved' ? (language === 'bn' ? 'অনুমোদিত' : 'Approved') : 
                           (language === 'bn' ? 'প্রত্যাখ্যাত' : 'Rejected')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      {/* Course Info */}
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="truncate">{request.course?.title || 'Unknown Course'}</span>
                      </div>

                      {/* Phone Number */}
                      {request.phone_number && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{language === 'bn' ? 'ফোন:' : 'Phone:'}</span>
                          <span>{request.phone_number}</span>
                        </div>
                      )}

                      {/* Payment Method */}
                      {request.payment_method && (
                        <div className="flex items-center gap-2 text-sm">
                          <Banknote className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{language === 'bn' ? 'পেমেন্ট:' : 'Payment:'}</span>
                          <Badge variant="outline" className="text-xs">
                            {request.payment_method === 'bkash' ? 'বিকাশ' : 'নগদ'}
                          </Badge>
                        </div>
                      )}

                      {/* Transaction ID */}
                      {request.transaction_id && (
                        <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-lg">
                          <span className="font-medium text-primary">{language === 'bn' ? 'TxID:' : 'TxID:'}</span>
                          <code className="text-xs font-mono flex-1">{request.transaction_id}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              navigator.clipboard.writeText(request.transaction_id || '');
                              toast.success(language === 'bn' ? 'কপি হয়েছে' : 'Copied!');
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}

                      {/* Payment Type Message */}
                      {request.message && (
                        <p className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
                          {request.message}
                        </p>
                      )}

                      {/* Date */}
                      <p className="text-xs text-muted-foreground">
                        {language === 'bn' ? 'তারিখ:' : 'Date:'} {formatDateTime(request.created_at)}
                      </p>

                      {/* Action Buttons */}
                      {request.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1 gap-1"
                            onClick={() => approveEnrollment(request)}
                          >
                            <Check className="w-3 h-3" />
                            {language === 'bn' ? 'অনুমোদন' : 'Approve'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="flex-1 gap-1"
                            onClick={() => rejectEnrollment(request.id)}
                          >
                            <X className="w-3 h-3" />
                            {language === 'bn' ? 'প্রত্যাখ্যান' : 'Reject'}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pass Codes Tab */}
          <TabsContent value="passcodes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                {language === 'bn' ? 'সব Pass Code' : 'All Pass Codes'}
              </h2>
              <Dialog open={showPassCodeDialog} onOpenChange={setShowPassCodeDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    {language === 'bn' ? 'নতুন Pass Code' : 'New Pass Code'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{language === 'bn' ? 'নতুন Pass Code তৈরি' : 'Create New Pass Code'}</DialogTitle>
                    <DialogDescription>
                      {language === 'bn' ? 'কোর্স সিলেক্ট করুন যা এই Pass Code এ থাকবে' : 'Select courses to include in this Pass Code'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>{language === 'bn' ? 'কোর্স সিলেক্ট করুন' : 'Select Courses'}</Label>
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
                      {language === 'bn' ? 'বাতিল' : 'Cancel'}
                    </Button>
                    <Button onClick={handleCreatePassCode}>
                      {language === 'bn' ? 'তৈরি করুন' : 'Create'}
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
                  <p className="text-muted-foreground">{language === 'bn' ? 'কোনো Pass Code নেই' : 'No Pass Codes'}</p>
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
                              {passCode.is_active ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive')}
                            </Badge>
                          </div>
                          
                          {passCode.student && (
                            <p className="text-sm text-muted-foreground">
                              {language === 'bn' ? 'ছাত্র' : 'Student'}: {passCode.student.full_name} ({passCode.student.email})
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
                              {language === 'bn' ? 'কোর্স যোগ' : 'Add Course'}
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className={`text-xl font-semibold ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                {language === 'bn' ? 'ছাত্র তালিকা' : 'Student List'}
              </h2>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'bn' ? 'নাম, ইমেইল বা Pass Code...' : 'Name, email or Pass Code...'}
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Button onClick={() => setShowAddStudentDialog(true)} className="gap-2 whitespace-nowrap">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">{language === 'bn' ? 'নতুন ছাত্র' : 'New Student'}</span>
                </Button>
              </div>
            </div>

            {/* Course Enrollment & Sales Stats */}
            <Card className="bg-gradient-to-r from-primary/5 to-cyan-500/5 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-base flex items-center gap-2 ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                    <TrendingUp className="w-5 h-5 text-primary" />
                    {language === 'bn' ? 'কোর্স এনরোলমেন্ট ও বিক্রি' : 'Course Enrollment & Sales'}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm">
                    <Banknote className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-amber-600">
                      {language === 'bn' ? `মোট: ৳${totalRevenue.toLocaleString('bn-BD')}` : `Total: ৳${totalRevenue.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {courseEnrollmentStats.slice(0, 10).map((course) => (
                    <div 
                      key={course.id} 
                      className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-2xl font-bold text-primary">{course.enrollmentCount}</p>
                        {course.price > 0 && (
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                            ৳{course.price}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate" title={course.title}>
                        {course.title}
                      </p>
                      {course.totalSales > 0 && (
                        <p className="text-xs font-medium text-amber-600 mt-1">
                          {language === 'bn' ? `বিক্রি: ৳${course.totalSales.toLocaleString('bn-BD')}` : `Sales: ৳${course.totalSales.toLocaleString()}`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {courseEnrollmentStats.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {language === 'bn' ? 'কোনো কোর্স নেই' : 'No courses'}
                  </p>
                )}
              </CardContent>
            </Card>
            
            {filteredStudents.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {studentSearch
                      ? (language === 'bn' ? 'কোনো ছাত্র পাওয়া যায়নি' : 'No students found')
                      : (language === 'bn' ? 'কোনো ছাত্র নেই' : 'No students')}
                  </p>
                  {!studentSearch && (
                    <Button onClick={() => setShowAddStudentDialog(true)} className="mt-4 gap-2">
                      <UserPlus className="w-4 h-4" />
                      {language === 'bn' ? 'প্রথম ছাত্র যোগ করুন' : 'Add First Student'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {studentSearch && (
                  <p className="text-sm text-muted-foreground">
                    {language === 'bn'
                      ? `${filteredStudents.length} জন ছাত্র পাওয়া গেছে`
                      : `${filteredStudents.length} students found`}
                  </p>
                )}

                {/* New / Unassigned */}
                {!studentSearch && unassignedStudents.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-semibold ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                        {language === 'bn' ? 'নতুন / কোর্স দেওয়া হয়নি' : 'New / Unassigned'}
                      </h3>
                      <Badge variant="outline">{unassignedStudents.length}</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {unassignedStudents.map((passCode) => (
                        <Card
                          key={passCode.id}
                          className="overflow-hidden ring-1 ring-primary/15 bg-primary/5 hover:border-primary/50 transition-colors"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {passCode.student?.full_name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-base truncate">{passCode.student?.full_name}</CardTitle>
                                  {isRecent(passCode.created_at) && (
                                    <Badge variant="secondary" className="text-xs">
                                      {language === 'bn' ? 'নতুন' : 'New'}
                                    </Badge>
                                  )}
                                </div>
                                <CardDescription className="truncate">{passCode.student?.email}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 space-y-3">
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 text-center">
                                {passCode.code}
                              </code>
                              <Button variant="ghost" size="sm" onClick={() => copyPassCode(passCode.code)}>
                                {copiedCode === passCode.code ? (
                                  <Check className="w-3 h-3 text-primary" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                {passCode.courses.length} {language === 'bn' ? 'কোর্স' : 'courses'}
                              </span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {language === 'bn' ? 'কোর্স নেই' : 'No course'}
                                </Badge>
                                <Badge variant={passCode.is_active ? 'default' : 'secondary'}>
                                  {passCode.is_active
                                    ? language === 'bn'
                                      ? 'সক্রিয়'
                                      : 'Active'
                                    : language === 'bn'
                                      ? 'নিষ্ক্রিয়'
                                      : 'Inactive'}
                                </Badge>
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground">
                              {language === 'bn' ? 'তৈরি:' : 'Created:'} {formatDateTime(passCode.created_at)}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assigned */}
                <div className="space-y-3">
                  {!studentSearch && (
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-semibold ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                        {language === 'bn' ? 'কোর্স দেওয়া আছে' : 'Assigned'}
                      </h3>
                      <Badge variant="outline">{assignedStudents.length}</Badge>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {(studentSearch ? filteredStudents : assignedStudents).map((passCode) => (
                      <Card key={passCode.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {passCode.student?.full_name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-base truncate">{passCode.student?.full_name}</CardTitle>
                                {isRecent(passCode.created_at) && (
                                  <Badge variant="secondary" className="text-xs">
                                    {language === 'bn' ? 'নতুন' : 'New'}
                                  </Badge>
                                )}
                              </div>
                              <CardDescription className="truncate">{passCode.student?.email}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 text-center">
                              {passCode.code}
                            </code>
                            <Button variant="ghost" size="sm" onClick={() => copyPassCode(passCode.code)}>
                              {copiedCode === passCode.code ? (
                                <Check className="w-3 h-3 text-primary" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {passCode.courses.length} {language === 'bn' ? 'কোর্স' : 'courses'}
                            </span>
                            <Badge variant={passCode.is_active ? 'default' : 'secondary'}>
                              {passCode.is_active
                                ? language === 'bn'
                                  ? 'সক্রিয়'
                                  : 'Active'
                                : language === 'bn'
                                  ? 'নিষ্ক্রিয়'
                                  : 'Inactive'}
                            </Badge>
                          </div>
                          {passCode.courses.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {passCode.courses.slice(0, 3).map((course) => (
                                <Badge key={course.id} variant="outline" className="text-xs">
                                  {course.title.length > 15 ? course.title.slice(0, 15) + '...' : course.title}
                                </Badge>
                              ))}
                              {passCode.courses.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{passCode.courses.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {language === 'bn' ? 'তৈরি:' : 'Created:'} {formatDateTime(passCode.created_at)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Works Tab */}
          <TabsContent value="works" className="space-y-6">
            <WorksManagement />
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <TeamManagement />
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <ServicesManagement />
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <PageContentManagement />
          </TabsContent>

          {/* Footer Tab */}
          <TabsContent value="footer" className="space-y-6">
            <FooterManagement />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <SiteSettingsManagement />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                {language === 'bn' ? 'Admin প্রোফাইল' : 'Admin Profile'}
              </h2>
              <Button onClick={() => setShowAddAdminDialog(true)} className="gap-2">
                <Shield className="w-4 h-4" />
                {language === 'bn' ? 'নতুন Admin যোগ' : 'Add New Admin'}
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Profile Info Card */}
              <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className={`text-lg flex items-center gap-2 ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                    <User className="w-5 h-5" />
                    {language === 'bn' ? 'প্রোফাইল তথ্য' : 'Profile Info'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative group">
                      {(profile as any)?.avatar_url ? (
                        <img 
                          src={(profile as any).avatar_url} 
                          alt={profile?.full_name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                          <span className="text-3xl font-bold text-white">
                            {profile?.full_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden"
                          onChange={handleAvatarUpload}
                          disabled={uploadingAvatar}
                        />
                        {uploadingAvatar ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                        ) : (
                          <Camera className="w-6 h-6 text-white" />
                        )}
                      </label>
                    </div>
                    <div className="mt-4">
                      <p className="font-semibold text-lg">{profile?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{profile?.email}</p>
                      <Badge className="mt-2 bg-gradient-to-r from-primary to-cyan-600">Admin</Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      setEditName(profile?.full_name || '');
                      setEditEmail(profile?.email || '');
                      setShowEditProfileDialog(true);
                    }} 
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    {language === 'bn' ? 'প্রোফাইল এডিট করুন' : 'Edit Profile'}
                  </Button>
                </CardContent>
              </Card>

              {/* Password Change Card */}
              <Card>
                <CardHeader>
                  <CardTitle className={`text-lg flex items-center gap-2 ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                    <Lock className="w-5 h-5" />
                    {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'bn' ? 'অ্যাকাউন্ট সুরক্ষিত রাখতে পাসওয়ার্ড পরিবর্তন করুন' : 'Change password to keep your account secure'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setShowPasswordDialog(true)} 
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    {language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}
                  </Button>
                </CardContent>
              </Card>

              {/* Add Admin Card */}
              <Card className="border-dashed border-2">
                <CardHeader>
                  <CardTitle className={`text-lg flex items-center gap-2 ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                    <Shield className="w-5 h-5" />
                    {language === 'bn' ? 'নতুন Admin' : 'New Admin'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'bn' ? 'আরেকজন Admin যোগ করুন যারা সব ম্যানেজ করতে পারবে' : 'Add another admin who can manage everything'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setShowAddAdminDialog(true)} 
                    className="w-full gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {language === 'bn' ? 'Admin যোগ করুন' : 'Add Admin'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Admin List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`text-lg flex items-center gap-2 ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
                      <Shield className="w-5 h-5" />
                      {language === 'bn' ? `সকল Admin (${admins.length})` : `All Admins (${admins.length})`}
                    </CardTitle>
                    <CardDescription>
                      {language === 'bn' ? 'যারা এই প্ল্যাটফর্ম ম্যানেজ করতে পারে' : 'Those who can manage this platform'}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchAdmins}
                    disabled={loadingAdmins}
                    className="gap-2"
                  >
                    {loadingAdmins ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                    ) : (
                      <TrendingUp className="w-4 h-4" />
                    )}
                    {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingAdmins ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                  </div>
                ) : admins.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{language === 'bn' ? 'কোনো Admin পাওয়া যায়নি' : 'No admins found'}</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {admins.map((admin) => (
                      <div 
                        key={admin.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border ${
                          admin.user_id === user?.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-muted/50'
                        } transition-colors`}
                      >
                        {admin.avatar_url ? (
                          <img 
                            src={admin.avatar_url} 
                            alt={admin.full_name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-white">
                              {admin.full_name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate flex items-center gap-2">
                            {admin.full_name}
                            {admin.user_id === user?.id && (
                              <Badge variant="secondary" className="text-xs">
                                {language === 'bn' ? 'আপনি' : 'You'}
                              </Badge>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{admin.email}</p>
                          {admin.created_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {language === 'bn' ? 'যোগদান' : 'Joined'}: {new Date(admin.created_at).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Assign Course Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'কোর্স যোগ করুন' : 'Add Course'}</DialogTitle>
            <DialogDescription>
              {language === 'bn' 
                ? <><code className="font-mono bg-muted px-2 py-1 rounded">{assigningPassCode?.code}</code> এ কোর্স অ্যাসাইন করতে নিচে থেকে সিলেক্ট করুন</>
                : <>Select a course to assign to <code className="font-mono bg-muted px-2 py-1 rounded">{assigningPassCode?.code}</code></>
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {availableCoursesForAssign.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'bn' ? 'সব কোর্স ইতিমধ্যে অ্যাসাইন করা হয়েছে' : 'All courses are already assigned'}
                </p>
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
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleAssignCourse} disabled={!selectedCourseToAssign}>
              {language === 'bn' ? 'যোগ করুন' : 'Add'}
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
              {language === 'bn' ? 'নতুন ছাত্র যোগ করুন' : 'Add New Student'}
            </DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'ছাত্রের তথ্য দিন এবং পাসকোড অ্যাসাইন করুন' : 'Enter student details and assign a passcode'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="student-name">{language === 'bn' ? 'পুরো নাম' : 'Full Name'}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="student-name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder={language === 'bn' ? 'ছাত্রের নাম' : 'Student name'}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-email">{language === 'bn' ? 'ইমেইল' : 'Email'}</Label>
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
              <Label htmlFor="student-password">{language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="student-password"
                  type="password"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  placeholder={language === 'bn' ? 'কমপক্ষে ৬ অক্ষর' : 'At least 6 characters'}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-passcode">{language === 'bn' ? 'Pass Code (ঐচ্ছিক)' : 'Pass Code (Optional)'}</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="student-passcode"
                  value={newStudentPassCode}
                  onChange={(e) => setNewStudentPassCode(e.target.value.toUpperCase())}
                  placeholder={language === 'bn' ? 'বিদ্যমান Pass Code' : 'Existing Pass Code'}
                  className="pl-10 font-mono"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'bn' ? 'বিদ্যমান Pass Code দিলে ছাত্র সেটার সাথে লিংক হবে' : 'If provided, student will be linked to this Pass Code'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStudentDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleAddStudent} disabled={addingStudent}>
              {addingStudent ? (language === 'bn' ? 'যোগ হচ্ছে...' : 'Adding...') : (language === 'bn' ? 'ছাত্র যোগ করুন' : 'Add Student')}
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
              {language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}
            </DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'নতুন পাসওয়ার্ড দিন' : 'Enter your new password'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">{language === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={language === 'bn' ? 'কমপক্ষে ৬ অক্ষর' : 'At least 6 characters'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={language === 'bn' ? 'আবার পাসওয়ার্ড দিন' : 'Re-enter password'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? (language === 'bn' ? 'পরিবর্তন হচ্ছে...' : 'Changing...') : (language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'Admin প্রোফাইল' : 'Admin Profile'}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-4">
              {(profile as any)?.avatar_url ? (
                <img 
                  src={(profile as any).avatar_url} 
                  alt={profile?.full_name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {profile?.full_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-xl">{profile?.full_name}</p>
                <p className="text-muted-foreground">{profile?.email}</p>
                <Badge className="mt-2">Admin</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  setShowProfileDialog(false);
                  setEditName(profile?.full_name || '');
                  setEditEmail(profile?.email || '');
                  setShowEditProfileDialog(true);
                }} 
                variant="outline"
                className="flex-1 gap-2"
              >
                <Edit className="w-4 h-4" />
                {language === 'bn' ? 'এডিট' : 'Edit'}
              </Button>
              <Button 
                onClick={() => {
                  setShowProfileDialog(false);
                  setShowPasswordDialog(true);
                }} 
                variant="outline"
                className="flex-1 gap-2"
              >
                <Lock className="w-4 h-4" />
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowProfileDialog(false)}>
              {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfileDialog} onOpenChange={setShowEditProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              {language === 'bn' ? 'প্রোফাইল এডিট' : 'Edit Profile'}
            </DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'আপনার নাম এবং ইমেইল পরিবর্তন করুন' : 'Change your name and email'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{language === 'bn' ? 'নাম' : 'Name'}</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder={language === 'bn' ? 'আপনার নাম' : 'Your name'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">{language === 'bn' ? 'ইমেইল' : 'Email'}</Label>
              <Input
                id="edit-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder={language === 'bn' ? 'আপনার ইমেইল' : 'Your email'}
              />
              <p className="text-xs text-muted-foreground">
                {language === 'bn' ? 'ইমেইল পরিবর্তন করলে নতুন ইমেইলে confirm করতে হবে' : 'Email change requires confirmation on new email'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditProfileDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleUpdateProfile} disabled={updatingProfile}>
              {updatingProfile ? (language === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...') : (language === 'bn' ? 'আপডেট করুন' : 'Update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Admin Dialog */}
      <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {language === 'bn' ? 'নতুন Admin যোগ করুন' : 'Add New Admin'}
            </DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'নতুন Admin এর তথ্য দিন' : 'Enter new admin details'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">{language === 'bn' ? 'নাম' : 'Name'}</Label>
              <Input
                id="admin-name"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder={language === 'bn' ? 'Admin এর নাম' : 'Admin name'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">{language === 'bn' ? 'ইমেইল' : 'Email'}</Label>
              <Input
                id="admin-email"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">{language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</Label>
              <Input
                id="admin-password"
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder={language === 'bn' ? 'কমপক্ষে ৬ অক্ষর' : 'At least 6 characters'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAdminDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleAddAdmin} disabled={addingAdmin}>
              {addingAdmin ? (language === 'bn' ? 'যোগ হচ্ছে...' : 'Adding...') : (language === 'bn' ? 'Admin যোগ করুন' : 'Add Admin')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}