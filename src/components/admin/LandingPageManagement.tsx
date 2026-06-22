import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Trash2, Plus, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type CourseRow = {
  id: string;
  title: string;
  title_en: string | null;
  landing_slug: string | null;
  short_description: string | null;
  short_description_en: string | null;
  trainer_bio: string | null;
  trainer_bio_en: string | null;
  start_date: string | null;
  class_time: string | null;
  total_classes: string | null;
  duration: string | null;
  learning_outcomes: string[] | null;
  faqs: { question: string; answer: string }[] | null;
};

export default function LandingPageManagement() {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [form, setForm] = useState<CourseRow | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('courses')
        .select('id,title,title_en,landing_slug,short_description,short_description_en,trainer_bio,trainer_bio_en,start_date,class_time,total_classes,duration,learning_outcomes,faqs')
        .order('created_at', { ascending: false });
      const rows = (data ?? []) as any as CourseRow[];
      setCourses(rows);
      if (rows[0]) setSelectedId(rows[0].id);
    })();
  }, []);

  useEffect(() => {
    const c = courses.find((x) => x.id === selectedId);
    if (c) {
      setForm({
        ...c,
        learning_outcomes: Array.isArray(c.learning_outcomes) ? c.learning_outcomes : [],
        faqs: Array.isArray(c.faqs) ? c.faqs : [],
      });
    }
  }, [selectedId, courses]);

  const update = (patch: Partial<CourseRow>) => setForm((f) => (f ? { ...f, ...patch } : f));

  const save = async () => {
    if (!form) return;
    setSaving(true);
    const { error } = await supabase
      .from('courses')
      .update({
        landing_slug: form.landing_slug || null,
        short_description: form.short_description,
        short_description_en: form.short_description_en,
        trainer_bio: form.trainer_bio,
        trainer_bio_en: form.trainer_bio_en,
        start_date: form.start_date,
        class_time: form.class_time,
        total_classes: form.total_classes,
        duration: form.duration,
        learning_outcomes: form.learning_outcomes ?? [],
        faqs: form.faqs ?? [],
      } as any)
      .eq('id', form.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success(isBn ? 'সেভ হয়েছে' : 'Saved');
  };

  if (!form) {
    return <div className="text-muted-foreground">{isBn ? 'লোড হচ্ছে...' : 'Loading...'}</div>;
  }

  const outcomes = form.learning_outcomes ?? [];
  const faqs = form.faqs ?? [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isBn ? 'কোর্স ল্যান্ডিং পেজ' : 'Course Landing Page'}</CardTitle>
          <CardDescription>
            {isBn
              ? 'যেকোনো কোর্সের জন্য পাবলিক ল্যান্ডিং পেজের কন্টেন্ট এডিট করুন। URL: /<slug>'
              : 'Edit public landing page content for any course. URL: /<slug>'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[240px]">
              <Label>{isBn ? 'কোর্স' : 'Course'}</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.title_en || c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {form.landing_slug && (
              <Button variant="outline" asChild>
                <a href={`/${form.landing_slug}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" /> /{form.landing_slug}
                </a>
              </Button>
            )}
          </div>

          <div>
            <Label>{isBn ? 'URL Slug' : 'URL Slug'} *</Label>
            <Input
              value={form.landing_slug ?? ''}
              onChange={(e) => update({ landing_slug: e.target.value.trim() })}
              placeholder="vibe-coding"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {isBn ? 'উদাহরণ: vibe-coding → /vibe-coding' : 'Example: vibe-coding → /vibe-coding'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>{isBn ? 'সংক্ষিপ্ত বিবরণ (বাংলা)' : 'Short Description (Bangla)'}</Label>
              <Textarea rows={3} value={form.short_description ?? ''} onChange={(e) => update({ short_description: e.target.value })} />
            </div>
            <div>
              <Label>Short Description (English)</Label>
              <Textarea rows={3} value={form.short_description_en ?? ''} onChange={(e) => update({ short_description_en: e.target.value })} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>{isBn ? 'ট্রেইনার বায়ো (বাংলা)' : 'Trainer Bio (Bangla)'}</Label>
              <Textarea rows={4} value={form.trainer_bio ?? ''} onChange={(e) => update({ trainer_bio: e.target.value })} />
            </div>
            <div>
              <Label>Trainer Bio (English)</Label>
              <Textarea rows={4} value={form.trainer_bio_en ?? ''} onChange={(e) => update({ trainer_bio_en: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label>{isBn ? 'শুরুর তারিখ' : 'Start Date'}</Label>
              <Input value={form.start_date ?? ''} onChange={(e) => update({ start_date: e.target.value })} placeholder="1 Jan 2026" />
            </div>
            <div>
              <Label>{isBn ? 'ক্লাসের সময়' : 'Class Time'}</Label>
              <Input value={form.class_time ?? ''} onChange={(e) => update({ class_time: e.target.value })} placeholder="9 PM" />
            </div>
            <div>
              <Label>{isBn ? 'মোট ক্লাস' : 'Total Classes'}</Label>
              <Input value={form.total_classes ?? ''} onChange={(e) => update({ total_classes: e.target.value })} placeholder="24" />
            </div>
            <div>
              <Label>{isBn ? 'মেয়াদ' : 'Duration'}</Label>
              <Input value={form.duration ?? ''} onChange={(e) => update({ duration: e.target.value })} placeholder="3 months" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isBn ? 'যা শিখবেন' : "What You'll Learn"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {outcomes.map((o, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={o}
                onChange={(e) => {
                  const next = [...outcomes];
                  next[i] = e.target.value;
                  update({ learning_outcomes: next });
                }}
              />
              <Button variant="ghost" size="icon" onClick={() => update({ learning_outcomes: outcomes.filter((_, j) => j !== i) })}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => update({ learning_outcomes: [...outcomes, ''] })}>
            <Plus className="h-4 w-4 mr-1" /> {isBn ? 'যোগ করুন' : 'Add'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="space-y-2 p-3 border rounded-lg">
              <div className="flex gap-2">
                <Input
                  placeholder={isBn ? 'প্রশ্ন' : 'Question'}
                  value={f.question}
                  onChange={(e) => {
                    const next = [...faqs];
                    next[i] = { ...next[i], question: e.target.value };
                    update({ faqs: next });
                  }}
                />
                <Button variant="ghost" size="icon" onClick={() => update({ faqs: faqs.filter((_, j) => j !== i) })}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                rows={2}
                placeholder={isBn ? 'উত্তর' : 'Answer'}
                value={f.answer}
                onChange={(e) => {
                  const next = [...faqs];
                  next[i] = { ...next[i], answer: e.target.value };
                  update({ faqs: next });
                }}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => update({ faqs: [...faqs, { question: '', answer: '' }] })}>
            <Plus className="h-4 w-4 mr-1" /> {isBn ? 'FAQ যোগ করুন' : 'Add FAQ'}
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} size="lg">
          {saving ? (isBn ? 'সেভ হচ্ছে...' : 'Saving...') : (isBn ? 'সেভ করুন' : 'Save Changes')}
        </Button>
      </div>
    </div>
  );
}
