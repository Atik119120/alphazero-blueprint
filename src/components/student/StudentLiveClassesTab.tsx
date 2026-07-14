import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Calendar, ExternalLink, PlayCircle, ArrowLeft, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useStudentLiveClasses, useRecordedClasses, computeStatus, LiveClass } from '@/hooks/useLiveClasses';
import LiveStatusBadge from '@/components/live/LiveStatusBadge';
import YouTubeLiveEmbed from '@/components/live/YouTubeLiveEmbed';

interface Props { language: 'en' | 'bn'; }

export default function StudentLiveClassesTab({ language }: Props) {
  const isBn = language === 'bn';
  const t = (bn: string, en: string) => (isBn ? bn : en);
  const { classes, isLoading, recordAttendance } = useStudentLiveClasses();
  const { records: recorded, autoPromoteEnded } = useRecordedClasses();
  const [active, setActive] = useState<LiveClass | null>(null);

  // Auto-promote ended live classes into recorded_classes list
  useEffect(() => {
    const ended = classes.filter(lc => computeStatus(lc) === 'ended' && lc.youtube_video_id);
    if (ended.length) autoPromoteEnded(ended);
  }, [classes, autoPromoteEnded]);

  const upcoming = useMemo(() => classes.filter(c => computeStatus(c) !== 'ended'), [classes]);
  const past = useMemo(() => classes.filter(c => computeStatus(c) === 'ended'), [classes]);

  const handleJoin = async (lc: LiveClass) => {
    const { error } = await recordAttendance(lc);
    if (error && !error.toLowerCase().includes('duplicate')) toast.error(error);
    setActive(lc);
  };

  if (active) {
    return <LiveClassViewer lc={active} language={language} onBack={() => setActive(null)} />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{t('লাইভ ক্লাস', 'Live Classes')}</h2>
        <p className="text-sm text-muted-foreground">{t('আপনার কোর্সের লাইভ সেশন', 'Live sessions from your enrolled courses')}</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">{t('আসছে / লাইভ', 'Upcoming / Live')} ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="recorded">{t('রেকর্ডেড ক্লাস', 'Recorded Classes')} ({recorded.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3">
          {isLoading ? (
            <p className="text-muted-foreground text-sm">{t('লোড হচ্ছে...', 'Loading...')}</p>
          ) : upcoming.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">{t('কোনো আসন্ন ক্লাস নেই', 'No upcoming live classes')}</CardContent></Card>
          ) : (
            upcoming.map(lc => <LiveCard key={lc.id} lc={lc} language={language} onJoin={() => handleJoin(lc)} />)
          )}
        </TabsContent>

        <TabsContent value="recorded" className="space-y-3">
          {recorded.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">{t('কোনো রেকর্ডিং এখনো নেই', 'No recorded classes yet')}</CardContent></Card>
          ) : (
            recorded.map(r => (
              <Card key={r.id}>
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={`https://img.youtube.com/vi/${r.youtube_video_id}/mqdefault.jpg`}
                      alt=""
                      className="w-24 h-14 rounded object-cover flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(r.recorded_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <a href={r.video_url} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="gap-1"><PlayCircle className="w-4 h-4" /> {t('দেখুন', 'Watch')}</Button>
                  </a>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LiveCard({ lc, language, onJoin }: { lc: LiveClass; language: 'bn' | 'en'; onJoin: () => void }) {
  const isBn = language === 'bn';
  const status = computeStatus(lc);
  const canJoin = status === 'live' || status === 'upcoming';
  return (
    <Card>
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold truncate">{lc.title}</h3>
            <LiveStatusBadge lc={lc} language={language} />
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Avatar className="w-5 h-5"><AvatarImage src={lc.teacher?.avatar_url || undefined} /><AvatarFallback>{lc.teacher?.full_name?.[0] || 'T'}</AvatarFallback></Avatar>
              {lc.teacher?.full_name || 'Instructor'}
            </span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(lc.start_time).toLocaleString()}</span>
            <span>· {isBn ? lc.course?.title : (lc.course?.title_en || lc.course?.title)}</span>
          </div>
          {lc.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{lc.description}</p>}
        </div>
        <Button onClick={onJoin} disabled={!canJoin} className="gap-2">
          <Video className="w-4 h-4" /> {status === 'live' ? (isBn ? 'জয়েন লাইভ' : 'Join Live') : (isBn ? 'প্রিভিউ' : 'Open')}
        </Button>
      </CardContent>
    </Card>
  );
}

function LiveClassViewer({ lc, language, onBack }: { lc: LiveClass; language: 'bn' | 'en'; onBack: () => void }) {
  const isBn = language === 'bn';
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="gap-2"><ArrowLeft className="w-4 h-4" /> {isBn ? 'ফিরে যান' : 'Back'}</Button>
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xl font-bold">{lc.title}</h2>
          <LiveStatusBadge lc={lc} language={language} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {lc.teacher?.full_name} · {new Date(lc.start_time).toLocaleString()}
        </p>
      </div>

      <YouTubeLiveEmbed url={lc.youtube_url} title={lc.title} />

      {lc.description && (
        <Card><CardContent className="p-4 text-sm text-muted-foreground whitespace-pre-wrap">{lc.description}</CardContent></Card>
      )}

      {lc.google_meet_url && (
        <a href={lc.google_meet_url} target="_blank" rel="noreferrer" className="block">
          <Button variant="outline" className="w-full gap-2">
            <MessageSquare className="w-4 h-4" />
            {isBn ? 'Google Meet ডিসকাশনে যোগ দিন' : 'Join Google Meet Discussion'}
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </a>
      )}
    </div>
  );
}
