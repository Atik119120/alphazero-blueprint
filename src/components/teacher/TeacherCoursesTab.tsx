import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Plus, Edit, Eye, Users, DollarSign, 
  Video, PlayCircle, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TeacherCourse } from '@/types/teacher';

interface TeacherCoursesTabProps {
  courses: TeacherCourse[];
  isLoading: boolean;
  refetch: () => void;
  language: 'en' | 'bn';
}

const translations = {
  en: {
    title: 'My Courses',
    subtitle: 'Manage your courses and content',
    addCourse: 'Add New Course',
    editCourse: 'Edit Course',
    courseTitle: 'Course Title (Bengali)',
    courseTitleEn: 'Course Title (English)',
    description: 'Description (Bengali)',
    descriptionEn: 'Description (English)',
    price: 'Price (BDT)',
    courseType: 'Course Type',
    recorded: 'Recorded Course',
    live: 'Live Class',
    free: 'Free Course',
    save: 'Save Course',
    cancel: 'Cancel',
    students: 'students',
    revenue: 'revenue',
    videos: 'videos',
    pending: 'Pending Approval',
    published: 'Published',
    noCourses: 'No courses yet',
    noCoursesDesc: 'Create your first course to get started',
    loading: 'Loading...',
  },
  bn: {
    title: 'আমার কোর্স',
    subtitle: 'আপনার কোর্স এবং কন্টেন্ট ম্যানেজ করুন',
    addCourse: 'নতুন কোর্স যোগ করুন',
    editCourse: 'কোর্স এডিট করুন',
    courseTitle: 'কোর্সের নাম (বাংলা)',
    courseTitleEn: 'কোর্সের নাম (ইংরেজি)',
    description: 'বিবরণ (বাংলা)',
    descriptionEn: 'বিবরণ (ইংরেজি)',
    price: 'মূল্য (টাকা)',
    courseType: 'কোর্সের ধরণ',
    recorded: 'রেকর্ডেড কোর্স',
    live: 'লাইভ ক্লাস',
    free: 'ফ্রি কোর্স',
    save: 'কোর্স সেভ করুন',
    cancel: 'বাতিল',
    students: 'শিক্ষার্থী',
    revenue: 'আয়',
    videos: 'ভিডিও',
    pending: 'অনুমোদনের অপেক্ষায়',
    published: 'প্রকাশিত',
    noCourses: 'এখনো কোনো কোর্স নেই',
    noCoursesDesc: 'শুরু করতে আপনার প্রথম কোর্স তৈরি করুন',
    loading: 'লোড হচ্ছে...',
  },
};

export default function TeacherCoursesTab({ courses, isLoading, refetch, language }: TeacherCoursesTabProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const t = translations[language];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<TeacherCourse | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    price: 0,
    course_type: 'recorded' as 'recorded' | 'live' | 'free',
  });
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setFormData({
      title: '',
      title_en: '',
      description: '',
      description_en: '',
      price: 0,
      course_type: 'recorded',
    });
    setEditingCourse(null);
  };

  const openEditDialog = (course: TeacherCourse) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      title_en: course.title_en || '',
      description: course.description || '',
      description_en: course.description_en || '',
      price: course.price,
      course_type: course.course_type,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);

      const courseData = {
        title: formData.title,
        title_en: formData.title_en || null,
        description: formData.description || null,
        description_en: formData.description_en || null,
        price: formData.course_type === 'free' ? 0 : formData.price,
        course_type: formData.course_type,
        teacher_id: profile.id,
        is_published: false,
        is_approved: false,
      };

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update({
            title: formData.title,
            title_en: formData.title_en || null,
            description: formData.description || null,
            description_en: formData.description_en || null,
            price: formData.course_type === 'free' ? 0 : formData.price,
            course_type: formData.course_type,
          })
          .eq('id', editingCourse.id);

        if (error) throw error;
        toast({ title: language === 'bn' ? 'কোর্স আপডেট হয়েছে' : 'Course updated' });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert(courseData);

        if (error) throw error;
        toast({ title: language === 'bn' ? 'কোর্স তৈরি হয়েছে' : 'Course created' });
      }

      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({ 
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: language === 'bn' ? 'কোর্স সেভ করতে সমস্যা হয়েছে' : 'Failed to save course',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t.addCourse}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCourse ? t.editCourse : t.addCourse}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t.courseTitle}</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="কোর্সের নাম লিখুন"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.courseTitleEn}</Label>
                <Input
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="Course title in English"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.description}</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="কোর্সের বিবরণ"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.descriptionEn}</Label>
                <Textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Course description in English"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.courseType}</Label>
                <Select
                  value={formData.course_type}
                  onValueChange={(value: 'recorded' | 'live' | 'free') => 
                    setFormData({ ...formData, course_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recorded">{t.recorded}</SelectItem>
                    <SelectItem value="live">{t.live}</SelectItem>
                    <SelectItem value="free">{t.free}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.course_type !== 'free' && (
                <div className="space-y-2">
                  <Label>{t.price}</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  {t.cancel}
                </Button>
                <Button onClick={handleSave} disabled={isSaving || !formData.title} className="flex-1">
                  {isSaving ? '...' : t.save}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t.noCourses}</h3>
          <p className="text-muted-foreground">{t.noCoursesDesc}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                {course.thumbnail_url ? (
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="w-12 h-12 text-primary/50" />
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold line-clamp-2">
                    {language === 'bn' ? course.title : course.title_en || course.title}
                  </h3>
                  <Badge variant={course.is_approved ? 'default' : 'secondary'} className="shrink-0">
                    {course.is_approved ? t.published : t.pending}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolled_students || 0} {t.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    <span>{course.videos?.length || 0} {t.videos}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-green-600">
                      ৳{course.total_revenue?.toLocaleString() || 0}
                    </span>
                  </div>
                  <Badge variant="outline">
                    {course.course_type === 'free' ? t.free : 
                     course.course_type === 'live' ? t.live : t.recorded}
                  </Badge>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2"
                  onClick={() => openEditDialog(course)}
                >
                  <Edit className="w-4 h-4" />
                  {t.editCourse}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
