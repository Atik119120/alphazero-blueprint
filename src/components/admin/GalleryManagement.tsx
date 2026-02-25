import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, Copy, Trash2, Video, Link, Plus, Loader2, Check } from 'lucide-react';

interface GalleryVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration_seconds: number;
  file_size_bytes: number;
  created_at: string;
}

export default function GalleryManagement() {
  const queryClient = useQueryClient();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: videos, isLoading } = useQuery({
    queryKey: ['gallery-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_videos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as GalleryVideo[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery_videos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-videos'] });
      toast.success('ভিডিও ডিলিট হয়েছে');
    },
    onError: () => toast.error('ডিলিট করতে সমস্যা হয়েছে'),
  });

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      toast.error('টাইটেল ও ফাইল দিন');
      return;
    }

    // Validate
    const maxSize = 1024 * 1024 * 1024; // 1GB
    if (selectedFile.size > maxSize) {
      toast.error('ফাইল সাইজ ১ জিবির বেশি হতে পারবে না');
      return;
    }

    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('শুধু MP4, WebM, MOV ফরম্যাট অনুমতি আছে');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('সেশন পাওয়া যায়নি');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('gallery', 'true');

      // Use XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      const result = await new Promise<any>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(pct);
          }
        });

        xhr.addEventListener('load', () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(data);
            } else {
              reject(new Error(data.error || 'আপলোড ব্যর্থ'));
            }
          } catch {
            reject(new Error('রেসপন্স পার্স করতে সমস্যা'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('নেটওয়ার্ক সমস্যা')));
        xhr.addEventListener('abort', () => reject(new Error('আপলোড বাতিল হয়েছে')));

        xhr.open('POST', `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-video`);
        xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
        xhr.send(formData);
      });

      toast.success('ভিডিও আপলোড সম্পন্ন!');
      queryClient.invalidateQueries({ queryKey: ['gallery-videos'] });
      resetDialog();
    } catch (error: any) {
      toast.error(error.message || 'আপলোড ব্যর্থ হয়েছে');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetDialog = () => {
    setShowUploadDialog(false);
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('লিংক কপি হয়েছে');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  if (isLoading) {
    return <div className="text-center py-8">লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">ভিডিও গ্যালারি</h2>
          <p className="text-sm text-muted-foreground">ভিডিও আপলোড করুন এবং লিংক কপি করে কোর্সে ব্যবহার করুন</p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          ভিডিও আপলোড
        </Button>
      </div>

      {/* Video Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos?.map((video) => (
          <Card key={video.id}>
            <CardContent className="p-4 space-y-3">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Video className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-semibold truncate">{video.title}</h3>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  {video.duration_seconds > 0 && <span>{formatDuration(video.duration_seconds)}</span>}
                  {video.file_size_bytes > 0 && <span>• {formatSize(video.file_size_bytes)}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => copyLink(video.video_url, video.id)}
                >
                  {copiedId === video.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedId === video.id ? 'কপি হয়েছে' : 'লিংক কপি'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm('ডিলিট করতে চান?')) deleteMutation.mutate(video.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!videos || videos.length === 0) && (
        <div className="text-center py-12 text-muted-foreground">
          <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>কোনো ভিডিও নেই। উপরের বাটনে ক্লিক করে আপলোড করুন।</p>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={(open) => !uploading && (open ? setShowUploadDialog(true) : resetDialog())}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ভিডিও আপলোড</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>টাইটেল *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ভিডিওর নাম"
                disabled={uploading}
              />
            </div>
            <div className="space-y-2">
              <Label>বিবরণ</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ঐচ্ছিক"
                disabled={uploading}
              />
            </div>
            <div className="space-y-2">
              <Label>ভিডিও ফাইল *</Label>
              <p className="text-xs text-muted-foreground">MP4, WebM, MOV — সর্বোচ্চ ১ জিবি</p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedFile(file);
                }}
              />
              {selectedFile && (
                <p className="text-xs text-emerald-600">
                  ✓ {selectedFile.name} ({formatSize(selectedFile.size)})
                </p>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">আপলোড হচ্ছে...</span>
                  <span className="font-mono font-semibold">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-3" />
                {uploadProgress === 100 && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Cloudinary-তে প্রসেস হচ্ছে...
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetDialog} disabled={uploading}>বাতিল</Button>
            <Button onClick={handleUpload} disabled={uploading || !selectedFile || !title.trim()}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  আপলোড হচ্ছে...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  আপলোড করুন
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
