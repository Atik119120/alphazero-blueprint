import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Trash2, Edit, Users, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface TeacherNoticesTabProps {
  courses: any[];
  language: 'en' | 'bn';
}

interface Notice {
  id: string;
  title: string;
  content: string;
  course_id: string | null;
  is_global: boolean;
  created_at: string;
  course?: { title: string };
}

const translations = {
  en: {
    title: 'Notices',
    createNotice: 'Create Notice',
    editNotice: 'Edit Notice',
    noticeTitle: 'Title',
    noticeContent: 'Content',
    selectCourse: 'Select Course',
    allStudents: 'All My Students',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    noNotices: 'No notices yet',
    createFirst: 'Create your first notice to communicate with students',
    globalNotice: 'Global',
    courseNotice: 'Course',
    created: 'Notice created successfully',
    updated: 'Notice updated successfully',
    deleted: 'Notice deleted successfully',
    titlePlaceholder: 'Enter notice title',
    contentPlaceholder: 'Write your notice content here...',
  },
  bn: {
    title: 'নোটিশ',
    createNotice: 'নোটিশ তৈরি করুন',
    editNotice: 'নোটিশ এডিট করুন',
    noticeTitle: 'শিরোনাম',
    noticeContent: 'বিষয়বস্তু',
    selectCourse: 'কোর্স নির্বাচন করুন',
    allStudents: 'আমার সব স্টুডেন্ট',
    save: 'সেভ করুন',
    cancel: 'বাতিল',
    delete: 'ডিলিট',
    noNotices: 'কোনো নোটিশ নেই',
    createFirst: 'স্টুডেন্টদের সাথে যোগাযোগ করতে প্রথম নোটিশ তৈরি করুন',
    globalNotice: 'সার্বজনীন',
    courseNotice: 'কোর্স',
    created: 'নোটিশ সফলভাবে তৈরি হয়েছে',
    updated: 'নোটিশ সফলভাবে আপডেট হয়েছে',
    deleted: 'নোটিশ সফলভাবে ডিলিট হয়েছে',
    titlePlaceholder: 'নোটিশের শিরোনাম লিখুন',
    contentPlaceholder: 'এখানে নোটিশের বিষয়বস্তু লিখুন...',
  },
};

export default function TeacherNoticesTab({ courses, language }: TeacherNoticesTabProps) {
  const { profile } = useAuth();
  const t = translations[language];
  
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    courseId: 'all',
  });

  const fetchNotices = async () => {
    if (!profile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*, course:courses(title)')
        .eq('teacher_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setNotices(data || []);
    } catch (err) {
      console.error('Error fetching notices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [profile?.id]);

  const resetForm = () => {
    setFormData({ title: '', content: '', courseId: 'all' });
    setEditingNotice(null);
    setIsDialogOpen(false);
  };

  const handleSave = async () => {
    if (!profile?.id || !formData.title.trim() || !formData.content.trim()) {
      return;
    }

    try {
      const noticeData = {
        teacher_id: profile.id,
        title: formData.title.trim(),
        content: formData.content.trim(),
        course_id: formData.courseId === 'all' ? null : formData.courseId,
        is_global: formData.courseId === 'all',
      };

      if (editingNotice) {
        const { error } = await supabase
          .from('notices')
          .update(noticeData)
          .eq('id', editingNotice.id);
        
        if (error) throw error;
        toast.success(t.updated);
      } else {
        const { error } = await supabase
          .from('notices')
          .insert(noticeData);
        
        if (error) throw error;
        toast.success(t.created);
      }

      resetForm();
      fetchNotices();
    } catch (err) {
      console.error('Error saving notice:', err);
      toast.error('Failed to save notice');
    }
  };

  const handleDelete = async (noticeId: string) => {
    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', noticeId);
      
      if (error) throw error;
      toast.success(t.deleted);
      fetchNotices();
    } catch (err) {
      console.error('Error deleting notice:', err);
      toast.error('Failed to delete notice');
    }
  };

  const openEditDialog = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      courseId: notice.course_id || 'all',
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          {t.title}
        </h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              {t.createNotice}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingNotice ? t.editNotice : t.createNotice}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t.noticeTitle}</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={t.titlePlaceholder}
                />
              </div>
              
              <div className="space-y-2">
                <Label>{t.selectCourse}</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {t.allStudents}
                      </div>
                    </SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          {course.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>{t.noticeContent}</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder={t.contentPlaceholder}
                  rows={5}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>
                  {t.cancel}
                </Button>
                <Button onClick={handleSave}>
                  {t.save}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {notices.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t.noNotices}</h3>
            <p className="text-muted-foreground text-center">{t.createFirst}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {notices.map((notice) => (
            <Card key={notice.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg">{notice.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={notice.is_global ? 'default' : 'secondary'}>
                      {notice.is_global ? t.globalNotice : t.courseNotice}
                    </Badge>
                    {notice.course && (
                      <Badge variant="outline">{notice.course.title}</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(notice.created_at), 'PPp')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(notice)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(notice.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{notice.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
