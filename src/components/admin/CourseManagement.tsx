import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit, 
  Video as VideoIcon,
  ArrowLeft,
  FileText,
  Download,
  PlayCircle,
  ChevronRight,
  GraduationCap,
  Clock,
  FolderOpen
} from 'lucide-react';
import { Course, Video, VideoMaterial } from '@/types/lms';

interface CourseManagementProps {
  courses: Course[];
  coursesLoading: boolean;
  refetchCourses: () => void;
}

export default function CourseManagement({ courses, coursesLoading, refetchCourses }: CourseManagementProps) {
  // View state: 'list' -> 'course-detail'
  const [view, setView] = useState<'list' | 'course-detail'>('list');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Course dialog
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState('');
  const [savingCourse, setSavingCourse] = useState(false);

  // Classes (Videos)
  const [classes, setClasses] = useState<Video[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  
  // Class dialog
  const [showClassDialog, setShowClassDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<Video | null>(null);
  const [classTitle, setClassTitle] = useState('');
  const [classVideoUrl, setClassVideoUrl] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [classPdfUrl, setClassPdfUrl] = useState('');
  const [classPdfTitle, setClassPdfTitle] = useState('');
  const [savingClass, setSavingClass] = useState(false);

  // Load classes when course is selected
  useEffect(() => {
    if (selectedCourse) {
      loadClasses(selectedCourse.id);
    }
  }, [selectedCourse]);

  const loadClasses = async (courseId: string) => {
    setLoadingClasses(true);
    try {
      // Fetch videos with their materials
      const { data: videos, error } = await supabase
        .from('videos')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setClasses((videos || []) as Video[]);
    } catch (error) {
      console.error('Error loading classes:', error);
      toast.error('ক্লাস লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoadingClasses(false);
    }
  };

  // Course functions
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

    setSavingCourse(true);
    try {
      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update({
            title: courseTitle,
            description: courseDescription || null,
            thumbnail_url: courseThumbnail || null,
          })
          .eq('id', editingCourse.id);

        if (error) throw error;
        toast.success('কোর্স আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('courses')
          .insert({
            title: courseTitle,
            description: courseDescription || null,
            thumbnail_url: courseThumbnail || null,
          });

        if (error) throw error;
        toast.success('কোর্স তৈরি হয়েছে');
      }

      setShowCourseDialog(false);
      refetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('সমস্যা হয়েছে');
    } finally {
      setSavingCourse(false);
    }
  };

  const deleteCourse = async (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('এই কোর্স মুছতে চান? সব ক্লাস এবং ম্যাটেরিয়ালও মুছে যাবে।')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      toast.success('কোর্স মুছে ফেলা হয়েছে');
      refetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('মুছতে সমস্যা হয়েছে');
    }
  };

  const togglePublish = async (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !course.is_published })
        .eq('id', course.id);

      if (error) throw error;
      toast.success(course.is_published ? 'কোর্স আনপাবলিশ হয়েছে' : 'কোর্স পাবলিশ হয়েছে');
      refetchCourses();
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('সমস্যা হয়েছে');
    }
  };

  // Class functions
  const openClassDialog = (classData?: Video) => {
    if (classData) {
      setEditingClass(classData);
      setClassTitle(classData.title);
      setClassVideoUrl(classData.video_url);
      setClassDescription('');
      setClassPdfUrl('');
      setClassPdfTitle('');
    } else {
      setEditingClass(null);
      const nextClassNum = classes.length + 1;
      setClassTitle(`Class ${String(nextClassNum).padStart(2, '0')}`);
      setClassVideoUrl('');
      setClassDescription('');
      setClassPdfUrl('');
      setClassPdfTitle('');
    }
    setShowClassDialog(true);
  };

  const saveClass = async () => {
    if (!selectedCourse || !classTitle.trim() || !classVideoUrl.trim()) {
      toast.error('ক্লাসের নাম এবং ভিডিও লিংক দিন');
      return;
    }

    setSavingClass(true);
    try {
      if (editingClass) {
        // Update existing class
        const { error } = await supabase
          .from('videos')
          .update({
            title: classTitle,
            video_url: classVideoUrl,
          })
          .eq('id', editingClass.id);

        if (error) throw error;
        toast.success('ক্লাস আপডেট হয়েছে');
      } else {
        // Create new class
        const nextOrder = classes.length + 1;
        const { data: newVideo, error: videoError } = await supabase
          .from('videos')
          .insert({
            course_id: selectedCourse.id,
            title: classTitle,
            video_url: classVideoUrl,
            video_type: 'youtube',
            order_index: nextOrder,
          })
          .select()
          .single();

        if (videoError) throw videoError;

        // Add description as a note if provided
        if (classDescription.trim()) {
          await supabase.from('video_materials').insert({
            video_id: newVideo.id,
            title: 'ক্লাস বর্ণনা',
            material_type: 'note',
            note_content: classDescription,
            order_index: 1,
          });
        }

        // Add PDF if provided
        if (classPdfUrl.trim()) {
          await supabase.from('video_materials').insert({
            video_id: newVideo.id,
            title: classPdfTitle || 'PDF নোটস',
            material_type: 'pdf',
            material_url: classPdfUrl,
            order_index: 2,
          });
        }

        toast.success('ক্লাস যোগ হয়েছে');
      }

      setShowClassDialog(false);
      loadClasses(selectedCourse.id);
    } catch (error) {
      console.error('Error saving class:', error);
      toast.error('সমস্যা হয়েছে');
    } finally {
      setSavingClass(false);
    }
  };

  const deleteClass = async (classId: string) => {
    if (!confirm('এই ক্লাস মুছতে চান?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', classId);

      if (error) throw error;
      toast.success('ক্লাস মুছে ফেলা হয়েছে');
      if (selectedCourse) {
        loadClasses(selectedCourse.id);
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('মুছতে সমস্যা হয়েছে');
    }
  };

  const enterCourse = (course: Course) => {
    setSelectedCourse(course);
    setView('course-detail');
  };

  const goBack = () => {
    setView('list');
    setSelectedCourse(null);
    setClasses([]);
  };

  // Render Course List View
  if (view === 'list') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              কোর্স ম্যানেজমেন্ট
            </h2>
            <p className="text-muted-foreground mt-1">
              সব কোর্স দেখুন এবং পরিচালনা করুন
            </p>
          </div>
          <Button onClick={() => openCourseDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            নতুন কোর্স
          </Button>
        </div>

        {/* Courses Grid */}
        {coursesLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : courses.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">কোনো কোর্স নেই</h3>
              <p className="text-muted-foreground mb-4">
                আপনার প্রথম কোর্স তৈরি করুন
              </p>
              <Button onClick={() => openCourseDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                নতুন কোর্স তৈরি করুন
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                onClick={() => enterCourse(course)}
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg overflow-hidden">
                  {course.thumbnail_url ? (
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="w-16 h-16 text-primary/40" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <Badge 
                    className="absolute top-3 right-3"
                    variant={course.is_published ? "default" : "secondary"}
                  >
                    {course.is_published ? 'পাবলিশড' : 'ড্রাফট'}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  {course.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {course.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCourseDialog(course);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => deleteCourse(course.id, e)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {course.is_published ? 'পাবলিশড' : 'ড্রাফট'}
                      </span>
                      <Switch
                        checked={course.is_published}
                        onCheckedChange={() => {}}
                        onClick={(e) => togglePublish(course, e)}
                      />
                    </div>
                  </div>

                  {/* Enter Button */}
                  <Button 
                    className="w-full mt-3 gap-2" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      enterCourse(course);
                    }}
                  >
                    ক্লাস ম্যানেজ করুন
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Course Dialog */}
        <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? 'কোর্স এডিট করুন' : 'নতুন কোর্স তৈরি করুন'}
              </DialogTitle>
              <DialogDescription>
                কোর্সের তথ্য পূরণ করুন
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>কোর্সের নাম *</Label>
                <Input
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="উদাহরণ: ওয়েব ডেভেলপমেন্ট মাস্টারক্লাস"
                />
              </div>
              <div className="space-y-2">
                <Label>বর্ণনা</Label>
                <Textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="কোর্সে কি শেখানো হবে তার বিস্তারিত লিখুন..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>থাম্বনেইল URL</Label>
                <Input
                  value={courseThumbnail}
                  onChange={(e) => setCourseThumbnail(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCourseDialog(false)}>
                বাতিল
              </Button>
              <Button onClick={saveCourse} disabled={savingCourse}>
                {savingCourse ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Render Course Detail View (Classes)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={goBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{selectedCourse?.title}</h2>
          {selectedCourse?.description && (
            <p className="text-muted-foreground mt-1 line-clamp-1">
              {selectedCourse.description}
            </p>
          )}
        </div>
        <Badge variant={selectedCourse?.is_published ? "default" : "secondary"}>
          {selectedCourse?.is_published ? 'পাবলিশড' : 'ড্রাফট'}
        </Badge>
      </div>

      <Separator />

      {/* Classes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-primary" />
            ক্লাস সমূহ ({classes.length})
          </h3>
        </div>

        {loadingClasses ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Class List */}
            {classes.map((classItem, index) => (
              <Card key={classItem.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Class Number */}
                    <div className="w-20 bg-primary/10 flex items-center justify-center border-r">
                      <span className="text-2xl font-bold text-primary">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Class Details */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{classItem.title}</h4>
                          <a 
                            href={classItem.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                          >
                            <VideoIcon className="w-3 h-3" />
                            ভিডিও দেখুন
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openClassDialog(classItem)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteClass(classItem.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      {/* Materials Preview - Will be loaded separately */}
                      <ClassMaterials videoId={classItem.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add New Class Card */}
            <Card 
              className="border-dashed border-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
              onClick={() => openClassDialog()}
            >
              <CardContent className="py-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Plus className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-semibold text-lg">
                    Class {String(classes.length + 1).padStart(2, '0')} যোগ করুন
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    নতুন ক্লাস যোগ করতে ক্লিক করুন
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Class Dialog */}
      <Dialog open={showClassDialog} onOpenChange={setShowClassDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingClass ? 'ক্লাস এডিট করুন' : 'নতুন ক্লাস যোগ করুন'}
            </DialogTitle>
            <DialogDescription>
              ক্লাসের তথ্য পূরণ করুন
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>ক্লাসের নাম *</Label>
              <Input
                value={classTitle}
                onChange={(e) => setClassTitle(e.target.value)}
                placeholder="উদাহরণ: Class 01 - Introduction"
              />
            </div>

            <div className="space-y-2">
              <Label>ভিডিও লিংক *</Label>
              <Input
                value={classVideoUrl}
                onChange={(e) => setClassVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            {!editingClass && (
              <>
                <Separator />

                <div className="space-y-2">
                  <Label>ক্লাস বর্ণনা (ঐচ্ছিক)</Label>
                  <Textarea
                    value={classDescription}
                    onChange={(e) => setClassDescription(e.target.value)}
                    placeholder="এই ক্লাসে কি শেখানো হবে..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    ছাত্ররা এই বর্ণনা দেখতে পাবে
                  </p>
                </div>

                <Separator />

                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-500" />
                    <Label className="text-base">PDF নোটস (ঐচ্ছিক)</Label>
                  </div>
                  <div className="space-y-3">
                    <Input
                      value={classPdfTitle}
                      onChange={(e) => setClassPdfTitle(e.target.value)}
                      placeholder="PDF এর নাম (উদাহরণ: Lecture Notes)"
                    />
                    <Input
                      value={classPdfUrl}
                      onChange={(e) => setClassPdfUrl(e.target.value)}
                      placeholder="PDF লিংক (https://drive.google.com/...)"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClassDialog(false)}>
              বাতিল
            </Button>
            <Button onClick={saveClass} disabled={savingClass}>
              {savingClass ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-component to show materials for each class
function ClassMaterials({ videoId }: { videoId: string }) {
  const [materials, setMaterials] = useState<VideoMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, [videoId]);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('video_materials')
        .select('*')
        .eq('video_id', videoId)
        .order('order_index', { ascending: true });

      if (!error) {
        setMaterials((data || []) as VideoMaterial[]);
      }
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMaterial = async () => {
    if (!materialTitle.trim() || !materialUrl.trim()) {
      toast.error('টাইটেল এবং URL দিন');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('video_materials').insert({
        video_id: videoId,
        title: materialTitle,
        material_type: 'pdf',
        material_url: materialUrl,
        order_index: materials.length + 1,
      });

      if (error) throw error;
      toast.success('ম্যাটেরিয়াল যোগ হয়েছে');
      setShowAddDialog(false);
      setMaterialTitle('');
      setMaterialUrl('');
      loadMaterials();
    } catch (error) {
      toast.error('সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const deleteMaterial = async (materialId: string) => {
    if (!confirm('মুছতে চান?')) return;

    try {
      await supabase.from('video_materials').delete().eq('id', materialId);
      setMaterials(prev => prev.filter(m => m.id !== materialId));
      toast.success('মুছে ফেলা হয়েছে');
    } catch (error) {
      toast.error('সমস্যা হয়েছে');
    }
  };

  if (loading) {
    return <div className="mt-3 text-sm text-muted-foreground">লোড হচ্ছে...</div>;
  }

  return (
    <div className="mt-3">
      {/* Materials */}
      {materials.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {materials.map((material) => (
            <div 
              key={material.id} 
              className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5 group"
            >
              <FileText className="w-4 h-4 text-red-500" />
              <a 
                href={material.material_url || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                {material.title}
              </a>
              {material.material_type === 'note' ? (
                <span className="text-xs text-muted-foreground">(নোট)</span>
              ) : (
                <Download className="w-3 h-3 text-muted-foreground" />
              )}
              <button
                onClick={() => deleteMaterial(material.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Material Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs h-7"
        onClick={() => setShowAddDialog(true)}
      >
        <Plus className="w-3 h-3 mr-1" />
        PDF/ডকুমেন্ট যোগ করুন
      </Button>

      {/* Add Material Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>ম্যাটেরিয়াল যোগ করুন</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>টাইটেল</Label>
              <Input
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                placeholder="উদাহরণ: Lecture Notes"
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={materialUrl}
                onChange={(e) => setMaterialUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              বাতিল
            </Button>
            <Button onClick={addMaterial} disabled={saving}>
              {saving ? 'সেভ হচ্ছে...' : 'যোগ করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
