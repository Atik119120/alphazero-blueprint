import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Users, ExternalLink, Video, Calendar, Clock, Film } from 'lucide-react';
import { toast } from 'sonner';
import { useTeacherLiveClasses, useLiveClassAttendance, LiveClass, parseYoutubeId } from '@/hooks/useLiveClasses';
import LiveStatusBadge from '@/components/live/LiveStatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { TeacherCourse } from '@/types/teacher';

interface Props {
  courses: TeacherCourse[];
  language: 'en' | 'bn';
}

const emptyForm = {
  course_id: '',
  title: '',
  description: '',
  scheduled_date: '',
  start_time: '',
  end_time: '',
  youtube_url: '',
  google_meet_url: '',
  is_published: true,
};

type FormState = typeof emptyForm;

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TeacherLiveClassesTab({ courses, language }: Props) {
  const { classes, isLoading, create, update, remove } = useTeacherLiveClasses();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LiveClass | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [attendanceOf, setAttendanceOf] = useState<LiveClass | null>(null);

  const isBn = language === 'bn';
  const t = (bn: string, en: string) => (isBn ? bn : en);

  const publishedCourses = useMemo(() => courses.filter(c => c.is_approved !== false), [courses]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (lc: LiveClass) => {
    setEditing(lc);
    setForm({
      course_id: lc.course_id,
      title: lc.title,
      description: lc.description || '',
      scheduled_date: lc.scheduled_date,
      start_time: toLocalInput(lc.start_time),
      end_time: toLocalInput(lc.end_time),
      youtube_url: lc.youtube_url,
      google_meet_url: lc.google_meet_url || '',
      is_published: lc.is_published,
    });
    setOpen(true);
  };

  const submit = async () => {
    if (!form.course_id || !form.title || !form.start_time || !form.end_time || !form.youtube_url) {
      toast.error(t('সব প্রয়োজনীয় ফিল্ড পূরণ করুন', 'Please fill all required fields'));
      return;
    }
    setSaving(true);
    const payload = {
      course_id: form.course_id,
      title: form.title,
      description: form.description || null,
      scheduled_date: form.scheduled_date || form.start_time.split('T')[0],
      start_time: new Date(form.start_time).toISOString(),
      end_time: new Date(form.end_time).toISOString(),
      youtube_url: form.youtube_url,
      google_meet_url: form.google_meet_url || null,
      is_published: form.is_published,
    };
    const res = editing ? await update(editing.id, payload) : await create(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success(t('সফল হয়েছে', 'Saved'));
    setOpen(false);
  };

  const doDelete = async (lc: LiveClass) => {
    if (!confirm(t('মুছে ফেলতে চান?', 'Delete this live class?'))) return;
    const res = await remove(lc.id);
    if (res.error) toast.error(res.error); else toast.success(t('মুছে ফেলা হয়েছে', 'Deleted'));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('লাইভ ক্লাস ম্যানেজমেন্ট', 'Live Class Management')}</h2>
          <p className="text-sm text-muted-foreground">{t('YouTube Live + Google Meet ডিসকাশন', 'YouTube Live + Google Meet discussion')}</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> {t('নতুন লাইভ ক্লাস', 'New Live Class')}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">{t('লোড হচ্ছে...', 'Loading...')}</p>
      ) : classes.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">
          {t('এখনো কোনো লাইভ ক্লাস নেই', 'No live classes yet')}
        </CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {classes.map(lc => (
            <Card key={lc.id}>
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold truncate">{lc.title}</h3>
                    <LiveStatusBadge lc={lc} language={language} />
                    {!lc.is_published && <Badge variant="secondary">{t('ড্রাফট', 'Draft')}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {lc.course?.title || 'Course'} · <Calendar className="inline w-3 h-3" /> {new Date(lc.start_time).toLocaleString()} → {new Date(lc.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => setAttendanceOf(lc)} className="gap-1">
                    <Users className="w-3.5 h-3.5" /> {t('উপস্থিতি', 'Attendance')}
                  </Button>
                  <a href={lc.youtube_url} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="gap-1"><ExternalLink className="w-3.5 h-3.5" /> YouTube</Button>
                  </a>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(lc)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => doDelete(lc)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? t('লাইভ ক্লাস এডিট', 'Edit Live Class') : t('নতুন লাইভ ক্লাস', 'New Live Class')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{t('কোর্স', 'Course')} *</Label>
              <Select value={form.course_id} onValueChange={v => setForm({ ...form, course_id: v })}>
                <SelectTrigger><SelectValue placeholder={t('কোর্স নির্বাচন', 'Select course')} /></SelectTrigger>
                <SelectContent>
                  {publishedCourses.map(c => (
                    <SelectItem key={c.id} value={c.id}>{isBn ? c.title : (c.title_en || c.title)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('শিরোনাম', 'Title')} *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} maxLength={200} />
            </div>
            <div>
              <Label>{t('বিবরণ', 'Description')}</Label>
              <Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} maxLength={1000} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t('শুরু', 'Start')} *</Label>
                <Input type="datetime-local" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value, scheduled_date: e.target.value.split('T')[0] })} />
              </div>
              <div>
                <Label>{t('শেষ', 'End')} *</Label>
                <Input type="datetime-local" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>YouTube Live URL *</Label>
              <Input placeholder="https://youtube.com/watch?v=..." value={form.youtube_url} onChange={e => setForm({ ...form, youtube_url: e.target.value })} />
            </div>
            <div>
              <Label>Google Meet URL</Label>
              <Input placeholder="https://meet.google.com/..." value={form.google_meet_url} onChange={e => setForm({ ...form, google_meet_url: e.target.value })} />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('প্রকাশ করুন', 'Publish')}</Label>
              <Switch checked={form.is_published} onCheckedChange={v => setForm({ ...form, is_published: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>{t('বাতিল', 'Cancel')}</Button>
            <Button onClick={submit} disabled={saving}>{saving ? t('সেভ হচ্ছে...', 'Saving...') : t('সেভ', 'Save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attendance dialog */}
      <AttendanceDialog lc={attendanceOf} onClose={() => setAttendanceOf(null)} language={language} />
    </div>
  );
}

function AttendanceDialog({ lc, onClose, language }: { lc: LiveClass | null; onClose: () => void; language: 'bn' | 'en' }) {
  const { records, isLoading } = useLiveClassAttendance(lc?.id || null);
  const isBn = language === 'bn';
  return (
    <Dialog open={!!lc} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isBn ? 'উপস্থিতি' : 'Attendance'} — {lc?.title}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">{isBn ? 'লোড হচ্ছে...' : 'Loading...'}</p>
        ) : records.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4 text-center">{isBn ? 'কেউ যোগ দেয়নি' : 'No one joined yet'}</p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{records.length} {isBn ? 'জন যোগ দিয়েছে' : 'joined'}</p>
            {records.map(r => (
              <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/40">
                <div>
                  <p className="text-sm font-medium">{r.student?.full_name || 'Student'}</p>
                  <p className="text-xs text-muted-foreground">{r.student?.email}</p>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(r.join_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
