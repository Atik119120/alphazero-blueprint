import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface Feedback {
  id: string;
  user_id: string;
  video_id: string;
  sentiment: string;
  message: string;
  created_at: string;
}

export default function FeedbackViewer() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('video_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error) setFeedbacks((data || []) as Feedback[]);
    setLoading(false);
  };

  const filtered = filter === 'all' ? feedbacks : feedbacks.filter(f => f.sentiment === filter);

  const positiveCount = feedbacks.filter(f => f.sentiment === 'positive').length;
  const negativeCount = feedbacks.filter(f => f.sentiment === 'negative').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> স্টুডেন্ট ফিডব্যাক
        </h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব ({feedbacks.length})</SelectItem>
            <SelectItem value="positive">👍 Good ({positiveCount})</SelectItem>
            <SelectItem value="negative">👎 Bad ({negativeCount})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{feedbacks.length}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-600">{positiveCount}</p><p className="text-xs text-muted-foreground">Positive</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-600">{negativeCount}</p><p className="text-xs text-muted-foreground">Negative</p></CardContent></Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            কোনো ফিডব্যাক নেই
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((fb) => (
            <Card key={fb.id}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${fb.sentiment === 'positive' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  {fb.sentiment === 'positive' ? <ThumbsUp className="w-4 h-4 text-emerald-600" /> : <ThumbsDown className="w-4 h-4 text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{fb.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(fb.created_at).toLocaleDateString('bn-BD')}
                  </p>
                </div>
                <Badge variant={fb.sentiment === 'positive' ? 'default' : 'destructive'} className="text-[10px]">
                  {fb.sentiment === 'positive' ? 'Good' : 'Bad'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
