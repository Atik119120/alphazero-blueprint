import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Video as VideoIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TeacherCourse } from '@/types/teacher';

interface Props {
  course: TeacherCourse | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onChanged?: () => void;
  language: 'en' | 'bn';
}

interface VideoRow {
  id: string;
  title: string;
  video_url: string;
  video_type: string;
  duration_seconds: number | null;
  order_index: number;
}

const t = {
  en: {
    title: 'Manage Videos', add: 'Add Video', videoTitle: 'Video Title', url: 'Video URL',
    type: 'Type', duration: 'Duration (minutes)', save: 'Save', cancel: 'Cancel',
    empty: 'No videos yet. Add the first one.', deleted: 'Video deleted',
    saved: 'Video saved', error: 'Error saving video', del: 'Delete this video?',
  },
  bn: {
    title: 'ভিডিও ম্যানেজ করুন', add: 'ভিডিও যোগ করুন', videoTitle: 'ভিডিও টাইটেল', url: 'ভিডিও URL',
    type: 'টাইপ', duration: 'সময় (মিনিট)', save: 'সেভ করুন', cancel: 'বাতিল',
    empty: 'এখনো কোনো ভিডিও নেই। প্রথম ভিডিও যোগ করুন।', deleted: 'ভিডিও ডিলিট হয়েছে',
    saved: 'ভিডিও সেভ হয়েছে', error: 'ভিডিও সেভ করতে সমস্যা হয়েছে', del: 'এই ভিডিও ডিলিট করবেন?',
  },
};

export default function TeacherVideoManager({ course, open, onOpenChange, onChanged, language }: Props) {
  const { toast } = useToast();
  const tr = t[language];
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', type: 'youtube', duration: '' });

  const load = async () => {
    if (!course) return;
    setLoading(true);
    const { data } = await supabase
      .from('videos')
      .select('id,title,video_url,video_type,duration_seconds,order_index')
      .eq('course_id', course.id)
      .order('order_index', { ascending: true });
    setVideos((data as VideoRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (open && course) { load(); setShowForm(false); setForm({ title: '', url: '', type: 'youtube', duration: '' }); }
  }, [open, course?.id]);

  const save = async () => {
    if (!course || !form.title.trim() || !form.url.trim()) return;
    setSaving(true);
    const durationSeconds = form.duration ? parseInt(form.duration) * 60 : 0;
    const { error } = await supabase.from('videos').insert({
      course_id: course.id,
      title: form.title,
      video_url: form.url,
      video_type: form.type,
      duration_seconds: durationSeconds,
      order_index: videos.length + 1,
    });
    setSaving(false);
    if (error) { toast({ title: tr.error, description: error.message, variant: 'destructive' }); return; }
    toast({ title: tr.saved });
    setShowForm(false);
    setForm({ title: '', url: '', type: 'youtube', duration: '' });
    await load();
    onChanged?.();
  };

  const remove = async (id: string) => {
    if (!confirm(tr.del)) return;
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) { toast({ title: tr.error, description: error.message, variant: 'destructive' }); return; }
    toast({ title: tr.deleted });
    await load();
    onChanged?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tr.title} — {course?.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{videos.length} videos</p>
            {!showForm && (
              <Button size="sm" onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="w-4 h-4" /> {tr.add}
              </Button>
            )}
          </div>

          {showForm && (
            <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
              <div className="space-y-2">
                <Label>{tr.videoTitle}</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{tr.type}</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="cloudinary">Cloudinary URL</SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{tr.duration}</Label>
                  <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{tr.url}</Label>
                <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">{tr.cancel}</Button>
                <Button onClick={save} disabled={saving || !form.title || !form.url} className="flex-1">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : tr.save}
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <VideoIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>{tr.empty}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {videos.map((v, i) => (
                <div key={v.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-sm font-medium">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{v.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{v.video_url}</p>
                  </div>
                  <Badge variant="outline">{v.video_type}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => remove(v.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
