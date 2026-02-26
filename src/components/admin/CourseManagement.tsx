import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit, 
  Video as VideoIcon,
  ArrowLeft,
  FileText,
  StickyNote,
  FileIcon,
  Link as LinkIcon,
  ChevronRight,
  GripVertical,
  DollarSign
} from 'lucide-react';
import { Course, Video, VideoMaterial } from '@/types/lms';
import ImageUploader from './ImageUploader';

interface CourseManagementProps {
  courses: Course[];
  coursesLoading: boolean;
  refetchCourses: () => void;
}

export default function CourseManagement({ courses, coursesLoading, refetchCourses }: CourseManagementProps) {
  // View state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  // Course form state
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseTitleEn, setCourseTitleEn] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseDescriptionEn, setCourseDescriptionEn] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [coursePublished, setCoursePublished] = useState(true);
  const [trainerName, setTrainerName] = useState('');
  const [trainerImage, setTrainerImage] = useState('');
  const [trainerDesignation, setTrainerDesignation] = useState('');

  // Video form state
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('youtube');
  const [videoDuration, setVideoDuration] = useState('');
  const [courseVideos, setCourseVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [videoTopicId, setVideoTopicId] = useState<string>('');

  // Topic state
  const [courseTopics, setCourseTopics] = useState<Array<{ id: string; title: string; order_index: number }>>([]);
  const [showTopicDialog, setShowTopicDialog] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');

  // Cloudinary upload progress
  const [cloudinaryUploading, setCloudinaryUploading] = useState(false);
  const [cloudinaryProgress, setCloudinaryProgress] = useState(0);

  // Material form state
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState<'pdf' | 'doc' | 'note'>('pdf');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialNote, setMaterialNote] = useState('');
  const [videoMaterials, setVideoMaterials] = useState<VideoMaterial[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  // Load videos and topics when course is selected
  useEffect(() => {
    if (selectedCourse) {
      loadCourseVideos(selectedCourse.id);
      loadCourseTopics(selectedCourse.id);
    }
  }, [selectedCourse]);

  // Load materials when video is selected
  useEffect(() => {
    if (selectedVideo) {
      loadVideoMaterials(selectedVideo.id);
    }
  }, [selectedVideo]);

  const loadCourseVideos = async (courseId: string) => {
    setLoadingVideos(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });
    
    if (!error) {
      setCourseVideos((data || []) as Video[]);
    }
    setLoadingVideos(false);
  };

  const loadCourseTopics = async (courseId: string) => {
    const { data, error } = await supabase
      .from('course_topics')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });
    if (!error) {
      setCourseTopics(data || []);
    }
  };

  const addTopic = async () => {
    if (!selectedCourse || !newTopicTitle.trim()) {
      toast.error('টপিক নাম দিন');
      return;
    }
    const nextOrder = courseTopics.length + 1;
    const { error } = await supabase.from('course_topics').insert({
      course_id: selectedCourse.id,
      title: newTopicTitle.trim(),
      order_index: nextOrder,
    });
    if (error) {
      toast.error('টপিক যোগ করতে সমস্যা');
      return;
    }
    toast.success('টপিক যোগ হয়েছে');
    setNewTopicTitle('');
    setShowTopicDialog(false);
    loadCourseTopics(selectedCourse.id);
  };

  const deleteTopic = async (topicId: string) => {
    if (!confirm('এই টপিক মুছতে চান? ক্লাসগুলো আনঅ্যাসাইন হবে।')) return;
    const { error } = await supabase.from('course_topics').delete().eq('id', topicId);
    if (error) {
      toast.error('মুছতে সমস্যা হয়েছে');
      return;
    }
    toast.success('টপিক মুছে ফেলা হয়েছে');
    if (selectedCourse) loadCourseTopics(selectedCourse.id);
  };

  const loadVideoMaterials = async (videoId: string) => {
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

  // Course CRUD
  const openCourseDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseTitle(course.title);
      setCourseTitleEn(course.title_en || '');
      setCourseDescription(course.description || '');
      setCourseDescriptionEn(course.description_en || '');
      setCourseThumbnail(course.thumbnail_url || '');
      setCoursePrice(course.price ? String(course.price) : '');
      setCoursePublished(course.is_published);
      setTrainerName(course.trainer_name || '');
      setTrainerImage(course.trainer_image || '');
      setTrainerDesignation(course.trainer_designation || '');
    } else {
      setEditingCourse(null);
      setCourseTitle('');
      setCourseTitleEn('');
      setCourseDescription('');
      setCourseDescriptionEn('');
      setCourseThumbnail('');
      setCoursePrice('');
      setCoursePublished(true);
      setTrainerName('');
      setTrainerImage('');
      setTrainerDesignation('');
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
          title_en: courseTitleEn || null,
          description: courseDescription || null,
          description_en: courseDescriptionEn || null,
          thumbnail_url: courseThumbnail || null,
          price: coursePrice ? parseFloat(coursePrice) : 0,
          is_published: coursePublished,
          trainer_name: trainerName || null,
          trainer_image: trainerImage || null,
          trainer_designation: trainerDesignation || null,
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
          title_en: courseTitleEn || null,
          description: courseDescription || null,
          description_en: courseDescriptionEn || null,
          thumbnail_url: courseThumbnail || null,
          price: coursePrice ? parseFloat(coursePrice) : 0,
          is_published: coursePublished,
          trainer_name: trainerName || null,
          trainer_image: trainerImage || null,
          trainer_designation: trainerDesignation || null,
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
  const openVideoDialog = (video?: Video) => {
    if (video) {
      setEditingVideo(video);
      setVideoTitle(video.title);
      setVideoUrl(video.video_url);
      setVideoType(video.video_type);
      setVideoDuration(video.duration_seconds ? String(Math.round(video.duration_seconds / 60)) : '');
      setVideoTopicId((video as any).topic_id || '');
    } else {
      setEditingVideo(null);
      setVideoTitle('');
      setVideoUrl('');
      setVideoType('youtube');
      setVideoDuration('');
      setVideoTopicId('');
    }
    setShowVideoDialog(true);
  };

  const saveVideo = async () => {
    if (!selectedCourse || !videoTitle.trim()) {
      toast.error('টাইটেল দিন');
      return;
    }

    // Handle Cloudinary direct upload
    if (videoType === 'cloudinary' && !editingVideo) {
      const file = (window as any).__pendingVideoFile as File | undefined;
      if (!file) {
        toast.error('ভিডিও ফাইল সিলেক্ট করুন');
        return;
      }

      setCloudinaryUploading(true);
      setCloudinaryProgress(0);

      try {
        const { data: { session } } = await supabase.auth.getSession();

        // Step 1: Get signed credentials
        const signRes = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sign-upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ folder: `courses/${selectedCourse.id}` }),
        });
        if (!signRes.ok) throw new Error('সাইন করতে সমস্যা');
        const { cloudName, apiKey, timestamp, signature, folder } = await signRes.json();

        // Step 2: Upload directly to Cloudinary
        const cloudForm = new FormData();
        cloudForm.append('file', file);
        cloudForm.append('api_key', apiKey);
        cloudForm.append('timestamp', String(timestamp));
        cloudForm.append('signature', signature);
        cloudForm.append('folder', folder);
        cloudForm.append('resource_type', 'video');

        const xhr = new XMLHttpRequest();
        const cloudinaryData = await new Promise<any>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) setCloudinaryProgress(Math.round((e.loaded / e.total) * 100));
          });
          xhr.addEventListener('load', () => {
            try {
              const data = JSON.parse(xhr.responseText);
              if (xhr.status >= 200 && xhr.status < 300) resolve(data);
              else reject(new Error(data?.error?.message || 'Cloudinary আপলোড ব্যর্থ'));
            } catch { reject(new Error('রেসপন্স পার্স সমস্যা')); }
          });
          xhr.addEventListener('error', () => reject(new Error('নেটওয়ার্ক সমস্যা')));
          xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
          xhr.send(cloudForm);
        });

        // Step 3: Save metadata to DB
        const durationSeconds = videoDuration ? parseInt(videoDuration) * 60 : Math.round(cloudinaryData.duration || 0);
        const nextOrder = courseVideos.length + 1;

        await supabase.from('videos').insert({
          course_id: selectedCourse.id,
          title: videoTitle,
          video_url: cloudinaryData.secure_url,
          video_type: 'cloudinary',
          duration_seconds: durationSeconds,
          order_index: nextOrder,
          cloudinary_public_id: cloudinaryData.public_id,
          cloudinary_url: cloudinaryData.secure_url,
          thumbnail_url: cloudinaryData.secure_url?.replace(/\.[^.]+$/, '.jpg'),
          topic_id: videoTopicId || null,
        });

        toast.success('ভিডিও আপলোড সম্পন্ন!');
        (window as any).__pendingVideoFile = undefined;
        setShowVideoDialog(false);
        loadCourseVideos(selectedCourse.id);
      } catch (error: any) {
        toast.error(error.message || 'আপলোড ব্যর্থ হয়েছে');
      } finally {
        setCloudinaryUploading(false);
        setCloudinaryProgress(0);
      }
      return;
    }

    if (!videoUrl.trim() && videoType !== 'cloudinary') {
      toast.error('URL দিন');
      return;
    }

    // Normalize cloudinary_url to cloudinary for DB storage
    const dbVideoType = videoType === 'cloudinary_url' ? 'cloudinary' : videoType;

    const durationSeconds = videoDuration ? parseInt(videoDuration) * 60 : 0;

    if (editingVideo) {
      const { error } = await supabase
        .from('videos')
        .update({
          title: videoTitle,
          video_url: videoUrl,
          video_type: dbVideoType,
          duration_seconds: durationSeconds,
          topic_id: videoTopicId || null,
        })
        .eq('id', editingVideo.id);

      if (error) {
        toast.error('আপডেট করতে সমস্যা হয়েছে');
        return;
      }
      toast.success('ভিডিও আপডেট হয়েছে');
    } else {
      const nextOrder = courseVideos.length + 1;
      const { error } = await supabase
        .from('videos')
        .insert({
          course_id: selectedCourse.id,
          title: videoTitle,
          video_url: videoUrl,
          video_type: dbVideoType,
          duration_seconds: durationSeconds,
          order_index: nextOrder,
          topic_id: videoTopicId || null,
        });

      if (error) {
        toast.error('ভিডিও যোগ করতে সমস্যা হয়েছে');
        return;
      }
      toast.success('ভিডিও যোগ হয়েছে');
    }

    setShowVideoDialog(false);
    loadCourseVideos(selectedCourse.id);
  };

  const deleteVideo = async (videoId: string) => {
    if (!confirm('এই ভিডিও মুছতে চান?')) return;

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

  // Material CRUD
  const openMaterialDialog = () => {
    setMaterialTitle('');
    setMaterialType('pdf');
    setMaterialUrl('');
    setMaterialNote('');
    setShowMaterialDialog(true);
  };

  const saveMaterial = async () => {
    if (!selectedVideo || !materialTitle.trim()) {
      toast.error('টাইটেল দিন');
      return;
    }

    if (materialType !== 'note' && !materialUrl.trim()) {
      toast.error('URL দিন');
      return;
    }

    if (materialType === 'note' && !materialNote.trim()) {
      toast.error('নোট লিখুন');
      return;
    }

    const nextOrder = videoMaterials.length + 1;
    const { error } = await supabase
      .from('video_materials')
      .insert({
        video_id: selectedVideo.id,
        title: materialTitle,
        material_type: materialType,
        material_url: materialType !== 'note' ? materialUrl : null,
        note_content: materialType === 'note' ? materialNote : null,
        order_index: nextOrder,
      });

    if (error) {
      toast.error('যোগ করতে সমস্যা হয়েছে');
      return;
    }

    toast.success('ম্যাটেরিয়াল যোগ হয়েছে');
    setShowMaterialDialog(false);
    loadVideoMaterials(selectedVideo.id);
  };

  const deleteMaterial = async (materialId: string) => {
    if (!confirm('এই ম্যাটেরিয়াল মুছতে চান?')) return;

    const { error } = await supabase
      .from('video_materials')
      .delete()
      .eq('id', materialId);

    if (error) {
      toast.error('মুছতে সমস্যা হয়েছে');
      return;
    }
    
    setVideoMaterials(prev => prev.filter(m => m.id !== materialId));
    toast.success('ম্যাটেরিয়াল মুছে ফেলা হয়েছে');
  };

  // Render video materials view
  if (selectedVideo) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedVideo(null)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ফিরে যান
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{selectedVideo.title}</h2>
            <p className="text-sm text-muted-foreground">{selectedCourse?.title}</p>
          </div>
          <Button onClick={openMaterialDialog} className="gap-2">
            <Plus className="w-4 h-4" />
            ম্যাটেরিয়াল যোগ
          </Button>
        </div>

        {/* Video Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <VideoIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">ভিডিও লিংক</p>
                <a 
                  href={selectedVideo.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {selectedVideo.video_url}
                </a>
              </div>
              <Badge variant="outline">{selectedVideo.video_type}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Materials List */}
        <div className="space-y-4">
          <h3 className="font-medium">ম্যাটেরিয়াল ({videoMaterials.length})</h3>
          
          {loadingMaterials ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : videoMaterials.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">কোনো ম্যাটেরিয়াল নেই</p>
                <Button onClick={openMaterialDialog} className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  প্রথম ম্যাটেরিয়াল যোগ করুন
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {videoMaterials.map((material) => (
                <Card key={material.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        {material.material_type === 'pdf' && <FileText className="w-5 h-5 text-red-500" />}
                        {material.material_type === 'doc' && <FileIcon className="w-5 h-5 text-blue-500" />}
                        {material.material_type === 'note' && <StickyNote className="w-5 h-5 text-yellow-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{material.title}</p>
                        {material.material_url && (
                          <a 
                            href={material.material_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline truncate block"
                          >
                            {material.material_url}
                          </a>
                        )}
                        {material.note_content && (
                          <p className="text-xs text-muted-foreground truncate">
                            {material.note_content}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {material.material_type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMaterial(material.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Material Dialog */}
        <Dialog open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>নতুন ম্যাটেরিয়াল যোগ করুন</DialogTitle>
              <DialogDescription>
                PDF, ডকুমেন্ট বা নোট যোগ করুন
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>টাইটেল</Label>
                <Input
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  placeholder="ম্যাটেরিয়ালের নাম"
                />
              </div>
              <div className="space-y-2">
                <Label>টাইপ</Label>
                <Select value={materialType} onValueChange={(v) => setMaterialType(v as 'pdf' | 'doc' | 'note')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">Document</SelectItem>
                    <SelectItem value="note">Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {materialType !== 'note' ? (
                <div className="space-y-2">
                  <Label>URL</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={materialUrl}
                      onChange={(e) => setMaterialUrl(e.target.value)}
                      placeholder="https://..."
                      className="pl-10"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>নোট</Label>
                  <Textarea
                    value={materialNote}
                    onChange={(e) => setMaterialNote(e.target.value)}
                    placeholder="নোট লিখুন..."
                    rows={5}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMaterialDialog(false)}>
                বাতিল
              </Button>
              <Button onClick={saveMaterial}>
                যোগ করুন
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Render course videos view
  if (selectedCourse) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedCourse(null)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ফিরে যান
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{selectedCourse.title}</h2>
            <p className="text-sm text-muted-foreground">{courseVideos.length} টি ক্লাস</p>
          </div>
          <Button variant="outline" onClick={() => openCourseDialog(selectedCourse)} className="gap-2">
            <Edit className="w-4 h-4" />
            এডিট
          </Button>
          <Button variant="outline" onClick={() => setShowTopicDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            টপিক
          </Button>
          <Button onClick={() => openVideoDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            ক্লাস যোগ
          </Button>
        </div>

        {/* Topic Management */}
        {courseTopics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {courseTopics.map(topic => (
              <Badge key={topic.id} variant="secondary" className="gap-1.5 py-1 px-3">
                {topic.title}
                <button onClick={() => deleteTopic(topic.id)} className="ml-1 hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Topic Dialog */}
        <Dialog open={showTopicDialog} onOpenChange={setShowTopicDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>নতুন টপিক যোগ করুন</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>টপিক নাম</Label>
                <Input
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="যেমন: HTML Basics"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTopicDialog(false)}>বাতিল</Button>
              <Button onClick={addTopic}>যোগ করুন</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Course Description */}
        {selectedCourse.description && (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Video List */}
        <div className="space-y-4">
          <h3 className="font-medium">ক্লাস তালিকা</h3>
          
          {loadingVideos ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : courseVideos.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <VideoIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">কোনো ক্লাস নেই</p>
                <Button onClick={() => openVideoDialog()} className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  প্রথম ক্লাস যোগ করুন
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {/* Group by topic if topics exist */}
              {courseTopics.length > 0 && (() => {
                const topicMap = new Map(courseTopics.map(t => [t.id, t.title]));
                const grouped: Record<string, typeof courseVideos> = { '': [] };
                courseTopics.forEach(t => { grouped[t.id] = []; });
                courseVideos.forEach(v => {
                  const tid = (v as any).topic_id || '';
                  if (!grouped[tid]) grouped[tid] = [];
                  grouped[tid].push(v);
                });
                const sections = [
                  ...courseTopics.map(t => ({ id: t.id, label: t.title, videos: grouped[t.id] || [] })),
                  ...(grouped[''].length > 0 ? [{ id: '', label: 'অন্যান্য', videos: grouped[''] }] : [])
                ];
                return sections.map(section => (
                  section.videos.length > 0 && (
                    <div key={section.id || 'other'} className="space-y-2">
                      <Badge variant="outline" className="text-xs">{section.label} ({section.videos.length})</Badge>
                      {section.videos.map((video, idx) => (
                        <Card key={video.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedVideo(video)}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <GripVertical className="w-4 h-4 text-muted-foreground" />
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-semibold text-primary">{idx + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium">{video.title}</p>
                                <p className="text-xs text-muted-foreground truncate">{video.video_url}</p>
                              </div>
                              <Badge variant="outline">{video.video_type}</Badge>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openVideoDialog(video); }}><Edit className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteVideo(video.id); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )
                ));
              })()}
              {courseTopics.length === 0 && courseVideos.map((video, index) => (
                <Card 
                  key={video.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedVideo(video)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{video.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {video.video_url}
                        </p>
                      </div>
                      <Badge variant="outline">{video.video_type}</Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openVideoDialog(video);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteVideo(video.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Video Dialog */}
        <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingVideo ? 'ক্লাস এডিট' : 'নতুন ক্লাস যোগ করুন'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>ক্লাস টাইটেল</Label>
                <Input
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="ক্লাস ১ - পরিচিতি"
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
                    <SelectItem value="cloudinary">Cloudinary (Direct Upload)</SelectItem>
                    <SelectItem value="cloudinary_url">Cloudinary URL (লিংক পেস্ট)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {videoType === 'cloudinary' ? (
                <div className="space-y-2">
                  <Label>ভিডিও ফাইল আপলোড করুন</Label>
                  <p className="text-xs text-muted-foreground">MP4, WebM, MOV — সর্বোচ্চ ১ জিবি</p>
                  <Input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    disabled={cloudinaryUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        (window as any).__pendingVideoFile = file;
                        setVideoUrl(file.name);
                      }
                    }}
                  />
                  {videoUrl && videoType === 'cloudinary' && (
                    <p className="text-xs text-emerald-600">ফাইল সিলেক্ট করা হয়েছে: {videoUrl}</p>
                  )}
                  {cloudinaryUploading && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">আপলোড হচ্ছে...</span>
                        <span className="font-mono font-semibold">{cloudinaryProgress}%</span>
                      </div>
                      <Progress value={cloudinaryProgress} className="h-3" />
                      {cloudinaryProgress === 100 && (
                        <p className="text-xs text-muted-foreground">Cloudinary-তে প্রসেস হচ্ছে...</p>
                      )}
                    </div>
                  )}
                </div>
              ) : videoType === 'cloudinary_url' ? (
                <div className="space-y-2">
                  <Label>Cloudinary ভিডিও URL</Label>
                  <Input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                  />
                  <p className="text-xs text-muted-foreground">Gallery থেকে লিংক কপি করে এখানে পেস্ট করুন</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>ভিডিও URL</Label>
                  <Input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>সময়কাল (মিনিট)</Label>
                <Input
                  type="number"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  placeholder="15"
                />
              </div>
              {courseTopics.length > 0 && (
                <div className="space-y-2">
                  <Label>টপিক (ঐচ্ছিক)</Label>
                  <Select value={videoTopicId} onValueChange={setVideoTopicId}>
                    <SelectTrigger>
                      <SelectValue placeholder="টপিক সিলেক্ট করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">কোনো টপিক নেই</SelectItem>
                      {courseTopics.map(topic => (
                        <SelectItem key={topic.id} value={topic.id}>{topic.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowVideoDialog(false)} disabled={cloudinaryUploading}>
                বাতিল
              </Button>
              <Button onClick={saveVideo} disabled={cloudinaryUploading}>
                {cloudinaryUploading ? 'আপলোড হচ্ছে...' : editingVideo ? 'আপডেট' : 'যোগ করুন'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Course Dialog */}
        <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>কোর্স এডিট</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>কোর্সের নাম</Label>
                <Input
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="কোর্সের নাম লিখুন"
                />
              </div>
              <div className="space-y-2">
                <Label>বিবরণ</Label>
                <Textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="কোর্সের বিস্তারিত বিবরণ লিখুন..."
                  rows={4}
                />
              </div>
              <ImageUploader
                value={courseThumbnail}
                onChange={setCourseThumbnail}
                folder="course-thumbnails"
                label="থাম্বনেইল"
                aspectRatio="video"
                maxSizeMB={5}
              />
              <div className="space-y-2">
                <Label>মূল্য (টাকা)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    placeholder="0"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">ফ্রি কোর্সের জন্য ০ রাখুন</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCourseDialog(false)}>
                বাতিল
              </Button>
              <Button onClick={saveCourse}>
                আপডেট
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Render courses list
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">সব কোর্স</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Quick Course Selector Dropdown */}
          {courses.length > 0 && (
            <Select onValueChange={(courseId) => {
              const course = courses.find(c => c.id === courseId);
              if (course) setSelectedCourse(course);
            }}>
              <SelectTrigger className="w-full sm:w-[250px] bg-card">
                <SelectValue placeholder="কোর্স সিলেক্ট করুন" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">{course.title}</span>
                      {course.is_published ? (
                        <Badge variant="default" className="ml-auto text-[10px] px-1.5">পাবলিশড</Badge>
                      ) : (
                        <Badge variant="secondary" className="ml-auto text-[10px] px-1.5">ড্রাফট</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={() => openCourseDialog()} className="gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            নতুন কোর্স
          </Button>
        </div>
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
            <Card 
              key={course.id} 
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedCourse(course)}
            >
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
                {course.price > 0 && (
                  <Badge 
                    className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600"
                  >
                    ৳{course.price.toLocaleString('bn-BD')}
                  </Badge>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                  {course.price > 0 ? (
                    <span className="text-sm font-semibold text-amber-600">৳{course.price.toLocaleString('bn-BD')}</span>
                  ) : (
                    <Badge variant="secondary" className="text-xs">ফ্রি</Badge>
                  )}
                </div>
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
                    onCheckedChange={(checked) => {
                      // Prevent card click
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCoursePublish(course);
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCourse(course);
                    }}
                  >
                    <VideoIcon className="w-3 h-3" />
                    ক্লাস
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCourseDialog(course);
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCourse(course.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Course Dialog */}
      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'কোর্স এডিট' : 'নতুন কোর্স'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {/* Bengali Title */}
            <div className="space-y-2">
              <Label>কোর্সের নাম (বাংলা) *</Label>
              <Input
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="বাংলায় কোর্সের নাম লিখুন"
              />
            </div>
            
            {/* English Title */}
            <div className="space-y-2">
              <Label>Course Title (English)</Label>
              <Input
                value={courseTitleEn}
                onChange={(e) => setCourseTitleEn(e.target.value)}
                placeholder="Enter course title in English"
              />
            </div>
            
            {/* Bengali Description */}
            <div className="space-y-2">
              <Label>বিবরণ (বাংলা)</Label>
              <Textarea
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="বাংলায় কোর্সের বিবরণ লিখুন..."
                rows={3}
              />
            </div>
            
            {/* English Description */}
            <div className="space-y-2">
              <Label>Description (English)</Label>
              <Textarea
                value={courseDescriptionEn}
                onChange={(e) => setCourseDescriptionEn(e.target.value)}
                placeholder="Enter course description in English..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>থাম্বনেইল URL</Label>
              <Input
                value={courseThumbnail}
                onChange={(e) => setCourseThumbnail(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>মূল্য (টাকা)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(e.target.value)}
                  placeholder="0"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">ফ্রি কোর্সের জন্য ০ রাখুন</p>
            </div>
            
            {/* Trainer Section */}
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-4">ট্রেইনার তথ্য</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>ট্রেইনার নাম</Label>
                  <Input
                    value={trainerName}
                    onChange={(e) => setTrainerName(e.target.value)}
                    placeholder="ট্রেইনারের নাম লিখুন"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>ট্রেইনার পদবি</Label>
                  <Input
                    value={trainerDesignation}
                    onChange={(e) => setTrainerDesignation(e.target.value)}
                    placeholder="যেমন: Graphic Designer, Web Developer"
                  />
                </div>
                
                <ImageUploader
                  value={trainerImage}
                  onChange={setTrainerImage}
                  folder="trainers"
                  label="ট্রেইনার ছবি"
                  aspectRatio="square"
                  maxSizeMB={2}
                />
              </div>
            </div>
            
            {/* Publish Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border">
              <div>
                <Label className="text-base font-medium">পাবলিশ করুন</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {coursePublished ? 'কোর্সটি ওয়েবসাইটে দেখাবে' : 'কোর্সটি ড্রাফট হিসেবে থাকবে'}
                </p>
              </div>
              <Switch
                checked={coursePublished}
                onCheckedChange={setCoursePublished}
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
    </div>
  );
}