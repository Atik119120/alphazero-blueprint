import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  Users, BookOpen, DollarSign, Check, X, Clock, 
  User, Briefcase, Wallet, TrendingUp, Search,
  Eye, CheckCircle, XCircle, Ban, UserCheck, Plus
} from 'lucide-react';

interface Teacher {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  is_teacher: boolean;
  teacher_approved: boolean;
  skills: string[] | null;
  bio: string | null;
  phone_number: string | null;
  created_at: string | null;
}

interface PendingCourse {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  price: number;
  course_type: string;
  is_approved: boolean;
  is_published: boolean;
  created_at: string | null;
  teacher?: Teacher;
}

interface PaidWork {
  id: string;
  title: string;
  description: string | null;
  category: string;
  total_amount: number;
  status: string;
  deadline: string | null;
  assigned_to: string | null;
  assignee?: Teacher;
}

interface WithdrawalRequest {
  id: string;
  teacher_id: string;
  amount: number;
  payment_method: string;
  payment_details: Record<string, any> | null;
  status: string;
  admin_notes: string | null;
  created_at: string | null;
  teacher?: Teacher;
}

interface RevenueRecord {
  id: string;
  teacher_id: string;
  course_id: string | null;
  revenue_type: string;
  total_amount: number;
  teacher_share: number;
  agency_share: number;
  status: string;
  created_at: string | null;
  teacher?: Teacher;
  course?: { title: string };
}

interface TeacherManagementProps {
  language: 'en' | 'bn';
}

const translations = {
  en: {
    title: 'Teacher Management',
    teachers: 'Teachers',
    courses: 'Course Approvals',
    paidWorks: 'Paid Works',
    revenue: 'Revenue',
    withdrawals: 'Withdrawals',
    search: 'Search...',
    approve: 'Approve',
    reject: 'Reject',
    block: 'Block',
    activate: 'Activate',
    pending: 'Pending',
    approved: 'Approved',
    active: 'Active',
    blocked: 'Blocked',
    noTeachers: 'No teachers found',
    noCourses: 'No pending courses',
    noWorks: 'No paid works',
    noWithdrawals: 'No withdrawal requests',
    noRevenue: 'No revenue records',
    loading: 'Loading...',
    total: 'Total',
    agencyShare: 'Agency Share',
    teacherShare: 'Teacher Share',
    createWork: 'Create Paid Work',
    workTitle: 'Title',
    workCategory: 'Category',
    workAmount: 'Amount (BDT)',
    workDeadline: 'Deadline',
    assignTo: 'Assign To',
    cancel: 'Cancel',
    create: 'Create',
    processWithdrawal: 'Process',
    paid: 'Paid',
    rejected: 'Rejected',
    design: 'Design',
    development: 'Development',
    video: 'Video',
    other: 'Other',
    totalRevenue: 'Total Revenue',
    totalTeachers: 'Total Teachers',
    pendingApprovals: 'Pending Approvals',
    pendingWithdrawals: 'Pending Withdrawals',
  },
  bn: {
    title: 'টিচার ম্যানেজমেন্ট',
    teachers: 'টিচার',
    courses: 'কোর্স অনুমোদন',
    paidWorks: 'পেইড ওয়ার্ক',
    revenue: 'রেভিনিউ',
    withdrawals: 'উত্তোলন',
    search: 'খুঁজুন...',
    approve: 'অনুমোদন',
    reject: 'প্রত্যাখ্যান',
    block: 'ব্লক',
    activate: 'সক্রিয়',
    pending: 'পেন্ডিং',
    approved: 'অনুমোদিত',
    active: 'সক্রিয়',
    blocked: 'ব্লকড',
    noTeachers: 'কোনো টিচার পাওয়া যায়নি',
    noCourses: 'কোনো পেন্ডিং কোর্স নেই',
    noWorks: 'কোনো পেইড ওয়ার্ক নেই',
    noWithdrawals: 'কোনো উত্তোলন রিকোয়েস্ট নেই',
    noRevenue: 'কোনো রেভিনিউ রেকর্ড নেই',
    loading: 'লোড হচ্ছে...',
    total: 'মোট',
    agencyShare: 'এজেন্সি অংশ',
    teacherShare: 'টিচার অংশ',
    createWork: 'পেইড ওয়ার্ক তৈরি',
    workTitle: 'শিরোনাম',
    workCategory: 'ক্যাটাগরি',
    workAmount: 'পরিমাণ (টাকা)',
    workDeadline: 'ডেডলাইন',
    assignTo: 'অ্যাসাইন করুন',
    cancel: 'বাতিল',
    create: 'তৈরি করুন',
    processWithdrawal: 'প্রসেস',
    paid: 'পরিশোধিত',
    rejected: 'প্রত্যাখ্যাত',
    design: 'ডিজাইন',
    development: 'ডেভেলপমেন্ট',
    video: 'ভিডিও',
    other: 'অন্যান্য',
    totalRevenue: 'মোট রেভিনিউ',
    totalTeachers: 'মোট টিচার',
    pendingApprovals: 'পেন্ডিং অনুমোদন',
    pendingWithdrawals: 'পেন্ডিং উত্তোলন',
  },
};

export default function TeacherManagement({ language }: TeacherManagementProps) {
  const t = translations[language];
  
  const [activeTab, setActiveTab] = useState('teachers');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pendingCourses, setPendingCourses] = useState<PendingCourse[]>([]);
  const [paidWorks, setPaidWorks] = useState<PaidWork[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [revenueRecords, setRevenueRecords] = useState<RevenueRecord[]>([]);
  
  // Dialog states
  const [showCreateWorkDialog, setShowCreateWorkDialog] = useState(false);
  const [workForm, setWorkForm] = useState({
    title: '',
    description: '',
    category: 'design',
    total_amount: 0,
    deadline: '',
    assigned_to: '',
  });
  
  // Fetch all data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch teachers (profiles with is_teacher = true)
      const { data: teacherProfiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_teacher', true)
        .order('created_at', { ascending: false });
      
      setTeachers((teacherProfiles || []) as Teacher[]);
      
      // Fetch pending courses (where is_approved = false and has teacher_id)
      const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .not('teacher_id', 'is', null)
        .eq('is_approved', false)
        .order('created_at', { ascending: false });
      
      // Get teacher info for each course
      const coursesWithTeachers = await Promise.all(
        (courses || []).map(async (course) => {
          const { data: teacher } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', course.teacher_id)
            .single();
          return { ...course, teacher: teacher as Teacher } as PendingCourse;
        })
      );
      setPendingCourses(coursesWithTeachers);
      
      // Fetch paid works
      const { data: works } = await supabase
        .from('paid_works')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Get assignee info for each work
      const worksWithAssignees = await Promise.all(
        (works || []).map(async (work) => {
          if (!work.assigned_to) return { ...work } as PaidWork;
          const { data: assignee } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', work.assigned_to)
            .single();
          return { ...work, assignee: assignee as Teacher } as PaidWork;
        })
      );
      setPaidWorks(worksWithAssignees);
      
      // Fetch withdrawal requests
      const { data: withdrawalData } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Get teacher info for withdrawals
      const withdrawalsWithTeachers = await Promise.all(
        (withdrawalData || []).map(async (w) => {
          const { data: teacher } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', w.teacher_id)
            .single();
          return { ...w, teacher: teacher as Teacher } as WithdrawalRequest;
        })
      );
      setWithdrawals(withdrawalsWithTeachers);
      
      // Fetch revenue records
      const { data: revenue } = await supabase
        .from('revenue_records')
        .select('*, course:courses(title)')
        .order('created_at', { ascending: false })
        .limit(50);
      
      // Get teacher info for revenue
      const revenueWithTeachers = await Promise.all(
        (revenue || []).map(async (r) => {
          const { data: teacher } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', r.teacher_id)
            .single();
          return { ...r, teacher: teacher as Teacher } as RevenueRecord;
        })
      );
      setRevenueRecords(revenueWithTeachers);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Teacher actions
  const approveTeacher = async (teacherId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ teacher_approved: true })
        .eq('id', teacherId);
      
      if (error) throw error;
      
      // Add teacher role
      const teacher = teachers.find(t => t.id === teacherId);
      if (teacher) {
        await supabase.from('user_roles').insert({
          user_id: teacher.user_id,
          role: 'teacher'
        });
      }
      
      toast.success(language === 'bn' ? 'টিচার অনুমোদিত' : 'Teacher approved');
      fetchData();
    } catch (error) {
      console.error('Error approving teacher:', error);
      toast.error(language === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred');
    }
  };
  
  const blockTeacher = async (teacherId: string, block: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ teacher_approved: !block })
        .eq('id', teacherId);
      
      if (error) throw error;
      toast.success(block 
        ? (language === 'bn' ? 'টিচার ব্লক করা হয়েছে' : 'Teacher blocked')
        : (language === 'bn' ? 'টিচার সক্রিয় করা হয়েছে' : 'Teacher activated')
      );
      fetchData();
    } catch (error) {
      console.error('Error updating teacher:', error);
      toast.error(language === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred');
    }
  };
  
  // Course actions
  const approveCourse = async (courseId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ 
          is_approved: approve,
          is_published: approve 
        })
        .eq('id', courseId);
      
      if (error) throw error;
      toast.success(approve 
        ? (language === 'bn' ? 'কোর্স অনুমোদিত' : 'Course approved')
        : (language === 'bn' ? 'কোর্স প্রত্যাখ্যাত' : 'Course rejected')
      );
      fetchData();
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(language === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred');
    }
  };
  
  // Paid work actions
  const createPaidWork = async () => {
    if (!workForm.title || !workForm.total_amount) {
      toast.error(language === 'bn' ? 'সব তথ্য দিন' : 'Fill all required fields');
      return;
    }
    
    try {
      const { error } = await supabase.from('paid_works').insert({
        title: workForm.title,
        description: workForm.description || null,
        category: workForm.category,
        total_amount: workForm.total_amount,
        deadline: workForm.deadline || null,
        assigned_to: workForm.assigned_to || null,
        status: 'assigned',
      });
      
      if (error) throw error;
      
      // Create revenue record if assigned
      if (workForm.assigned_to) {
        const teacherShare = Math.round(workForm.total_amount * 0.8);
        const agencyShare = workForm.total_amount - teacherShare;
        
        await supabase.from('revenue_records').insert({
          teacher_id: workForm.assigned_to,
          revenue_type: 'paid_work',
          total_amount: workForm.total_amount,
          teacher_share: teacherShare,
          agency_share: agencyShare,
          teacher_percentage: 80,
          agency_percentage: 20,
          status: 'pending',
        });
      }
      
      toast.success(language === 'bn' ? 'পেইড ওয়ার্ক তৈরি হয়েছে' : 'Paid work created');
      setShowCreateWorkDialog(false);
      setWorkForm({ title: '', description: '', category: 'design', total_amount: 0, deadline: '', assigned_to: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating work:', error);
      toast.error(language === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred');
    }
  };
  
  // Withdrawal actions
  const processWithdrawal = async (withdrawalId: string, status: 'paid' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ 
          status,
          processed_at: new Date().toISOString()
        })
        .eq('id', withdrawalId);
      
      if (error) throw error;
      toast.success(status === 'paid' 
        ? (language === 'bn' ? 'পেমেন্ট সম্পন্ন' : 'Payment completed')
        : (language === 'bn' ? 'প্রত্যাখ্যাত' : 'Rejected')
      );
      fetchData();
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast.error(language === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred');
    }
  };
  
  // Approve revenue
  const approveRevenue = async (revenueId: string) => {
    try {
      const { error } = await supabase
        .from('revenue_records')
        .update({ status: 'approved' })
        .eq('id', revenueId);
      
      if (error) throw error;
      toast.success(language === 'bn' ? 'রেভিনিউ অনুমোদিত' : 'Revenue approved');
      fetchData();
    } catch (error) {
      console.error('Error approving revenue:', error);
      toast.error(language === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred');
    }
  };
  
  // Filter teachers by search
  const filteredTeachers = teachers.filter(t => 
    t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Stats
  const totalAgencyRevenue = revenueRecords
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.agency_share, 0);
  const pendingApprovals = pendingCourses.length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-semibold ${language === 'bn' ? 'font-[Aloka]' : ''}`}>
          {t.title}
        </h2>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.totalTeachers}</p>
                <p className="text-2xl font-bold">{teachers.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.totalRevenue}</p>
                <p className="text-2xl font-bold text-green-600">৳{totalAgencyRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.pendingApprovals}</p>
                <p className="text-2xl font-bold text-amber-600">{pendingApprovals}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.pendingWithdrawals}</p>
                <p className="text-2xl font-bold text-purple-600">{pendingWithdrawals}</p>
              </div>
              <Wallet className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="teachers" className="gap-1">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">{t.teachers}</span>
          </TabsTrigger>
          <TabsTrigger value="courses" className="gap-1">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">{t.courses}</span>
            {pendingApprovals > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">{pendingApprovals}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="paidWorks" className="gap-1">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">{t.paidWorks}</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-1">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">{t.revenue}</span>
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="gap-1">
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">{t.withdrawals}</span>
            {pendingWithdrawals > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">{pendingWithdrawals}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search}
                className="pl-9"
              />
            </div>
          </div>
          
          {filteredTeachers.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t.noTeachers}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTeachers.map((teacher) => (
                <Card key={teacher.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={teacher.avatar_url || ''} />
                        <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{teacher.full_name}</h3>
                          <Badge variant={teacher.teacher_approved ? 'default' : 'secondary'}>
                            {teacher.teacher_approved ? t.active : t.pending}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{teacher.email}</p>
                        {teacher.skills && teacher.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {teacher.skills.slice(0, 3).map((skill, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {!teacher.teacher_approved ? (
                        <Button size="sm" className="flex-1 gap-1" onClick={() => approveTeacher(teacher.id)}>
                          <UserCheck className="w-3 h-3" />
                          {t.approve}
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="flex-1 gap-1"
                          onClick={() => blockTeacher(teacher.id, true)}
                        >
                          <Ban className="w-3 h-3" />
                          {t.block}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          {pendingCourses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t.noCourses}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{course.title}</CardTitle>
                        {course.title_en && (
                          <CardDescription>{course.title_en}</CardDescription>
                        )}
                      </div>
                      <Badge variant="secondary">{t.pending}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {course.teacher && (
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={course.teacher.avatar_url || ''} />
                          <AvatarFallback><User className="w-3 h-3" /></AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{course.teacher.full_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>৳{course.price}</span>
                      <Badge variant="outline">{course.course_type}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 gap-1" onClick={() => approveCourse(course.id, true)}>
                        <Check className="w-3 h-3" />
                        {t.approve}
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1 gap-1" onClick={() => approveCourse(course.id, false)}>
                        <X className="w-3 h-3" />
                        {t.reject}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Paid Works Tab */}
        <TabsContent value="paidWorks" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => setShowCreateWorkDialog(true)}>
              <Plus className="w-4 h-4" />
              {t.createWork}
            </Button>
          </div>
          
          {paidWorks.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t.noWorks}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {paidWorks.map((work) => (
                <Card key={work.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{work.title}</h3>
                        <Badge variant="outline" className="mt-1">{work.category}</Badge>
                      </div>
                      <Badge variant={work.status === 'completed' ? 'default' : 'secondary'}>
                        {work.status}
                      </Badge>
                    </div>
                    {work.assignee && (
                      <div className="flex items-center gap-2 text-sm">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={work.assignee.avatar_url || ''} />
                          <AvatarFallback><User className="w-3 h-3" /></AvatarFallback>
                        </Avatar>
                        <span>{work.assignee.full_name}</span>
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                      <span className="font-medium text-green-600">৳{work.total_amount.toLocaleString()}</span>
                      {work.deadline && (
                        <span className="text-muted-foreground">
                          {new Date(work.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          {revenueRecords.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t.noRevenue}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {revenueRecords.map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={record.teacher?.avatar_url || ''} />
                          <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{record.teacher?.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {record.revenue_type} • {record.course?.title || 'Paid Work'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">৳{record.total_amount.toLocaleString()}</p>
                        <div className="flex gap-2 text-xs">
                          <span className="text-green-600">{t.agencyShare}: ৳{record.agency_share}</span>
                          <span className="text-blue-600">{t.teacherShare}: ৳{record.teacher_share}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={record.status === 'approved' ? 'default' : 'secondary'}>
                          {record.status}
                        </Badge>
                        {record.status === 'pending' && (
                          <Button size="sm" onClick={() => approveRevenue(record.id)}>
                            {t.approve}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Withdrawals Tab */}
        <TabsContent value="withdrawals" className="space-y-4">
          {withdrawals.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t.noWithdrawals}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((withdrawal) => (
                <Card key={withdrawal.id} className={withdrawal.status === 'pending' ? 'border-amber-500/50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={withdrawal.teacher?.avatar_url || ''} />
                          <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{withdrawal.teacher?.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {withdrawal.payment_method.toUpperCase()} • {(withdrawal.payment_details as any)?.account_number}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">৳{withdrawal.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {withdrawal.created_at && new Date(withdrawal.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {withdrawal.status === 'pending' ? (
                          <>
                            <Button size="sm" className="gap-1" onClick={() => processWithdrawal(withdrawal.id, 'paid')}>
                              <CheckCircle className="w-3 h-3" />
                              {t.paid}
                            </Button>
                            <Button size="sm" variant="destructive" className="gap-1" onClick={() => processWithdrawal(withdrawal.id, 'rejected')}>
                              <XCircle className="w-3 h-3" />
                              {t.rejected}
                            </Button>
                          </>
                        ) : (
                          <Badge variant={withdrawal.status === 'paid' ? 'default' : 'destructive'}>
                            {withdrawal.status === 'paid' ? t.paid : t.rejected}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create Paid Work Dialog */}
      <Dialog open={showCreateWorkDialog} onOpenChange={setShowCreateWorkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.createWork}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t.workTitle}</Label>
              <Input
                value={workForm.title}
                onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={workForm.description}
                onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.workCategory}</Label>
                <Select
                  value={workForm.category}
                  onValueChange={(v) => setWorkForm({ ...workForm, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">{t.design}</SelectItem>
                    <SelectItem value="development">{t.development}</SelectItem>
                    <SelectItem value="video">{t.video}</SelectItem>
                    <SelectItem value="other">{t.other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.workAmount}</Label>
                <Input
                  type="number"
                  value={workForm.total_amount}
                  onChange={(e) => setWorkForm({ ...workForm, total_amount: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.workDeadline}</Label>
                <Input
                  type="date"
                  value={workForm.deadline}
                  onChange={(e) => setWorkForm({ ...workForm, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.assignTo}</Label>
                <Select
                  value={workForm.assigned_to}
                  onValueChange={(v) => setWorkForm({ ...workForm, assigned_to: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.filter(t => t.teacher_approved).map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateWorkDialog(false)}>
              {t.cancel}
            </Button>
            <Button onClick={createPaidWork}>
              {t.create}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
