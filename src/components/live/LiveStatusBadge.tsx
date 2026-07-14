import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { computeStatus, LiveClass, LiveClassStatus } from '@/hooks/useLiveClasses';

const labels: Record<LiveClassStatus, { en: string; bn: string; className: string }> = {
  upcoming: { en: 'Upcoming', bn: 'আসছে', className: 'bg-blue-500/15 text-blue-600 border-blue-500/30' },
  live:     { en: 'LIVE',     bn: 'লাইভ',   className: 'bg-red-500 text-white animate-pulse' },
  ended:    { en: 'Ended',    bn: 'শেষ',    className: 'bg-muted text-muted-foreground' },
};

export default function LiveStatusBadge({ lc, language = 'bn' }: { lc: Pick<LiveClass, 'start_time' | 'end_time'>; language?: 'bn' | 'en' }) {
  const [status, setStatus] = useState<LiveClassStatus>(() => computeStatus(lc));

  useEffect(() => {
    setStatus(computeStatus(lc));
    const id = setInterval(() => setStatus(computeStatus(lc)), 30_000);
    return () => clearInterval(id);
  }, [lc.start_time, lc.end_time]);

  const cfg = labels[status];
  return <Badge variant="outline" className={cfg.className}>{language === 'bn' ? cfg.bn : cfg.en}</Badge>;
}
