import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Inbox, 
  Mail, 
  Send, 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle,
  RefreshCw,
  User,
  Calendar,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';

interface EmailInboxProps {
  language: 'en' | 'bn';
}

interface EmailThread {
  id: string;
  subject: string;
  external_email: string;
  external_name: string | null;
  status: 'open' | 'pending' | 'closed';
  last_message_at: string;
  created_at: string;
}

interface EmailMessage {
  id: string;
  thread_id: string;
  direction: 'inbound' | 'outbound';
  from_email: string;
  to_email: string;
  subject: string;
  body_text: string | null;
  body_html: string | null;
  sender_identity: string | null;
  is_read: boolean;
  created_at: string;
}

const translations = {
  en: {
    inbox: 'Email Inbox',
    noThreads: 'No conversations yet',
    noThreadsDesc: 'When users reply to your emails, conversations will appear here.',
    search: 'Search conversations...',
    all: 'All',
    open: 'Open',
    pending: 'Pending',
    closed: 'Closed',
    refresh: 'Refresh',
    back: 'Back to Inbox',
    reply: 'Reply',
    sending: 'Sending...',
    sent: 'Sent!',
    replyPlaceholder: 'Type your reply...',
    senderIdentity: 'Send as',
    markAs: 'Mark as',
    from: 'From',
    to: 'To',
    you: 'You',
    webhookUrl: 'Webhook URL',
    webhookInfo: 'Add this URL in Resend webhooks for email.received event:',
    copy: 'Copy',
    copied: 'Copied!',
    unread: 'unread',
  },
  bn: {
    inbox: 'ইমেইল ইনবক্স',
    noThreads: 'এখনো কোনো কথোপকথন নেই',
    noThreadsDesc: 'ইউজাররা আপনার ইমেইলে রিপ্লাই করলে এখানে দেখাবে।',
    search: 'কথোপকথন খুঁজুন...',
    all: 'সব',
    open: 'খোলা',
    pending: 'অপেক্ষমান',
    closed: 'বন্ধ',
    refresh: 'রিফ্রেশ',
    back: 'ইনবক্সে ফিরুন',
    reply: 'রিপ্লাই',
    sending: 'পাঠানো হচ্ছে...',
    sent: 'পাঠানো হয়েছে!',
    replyPlaceholder: 'আপনার রিপ্লাই লিখুন...',
    senderIdentity: 'হিসেবে পাঠান',
    markAs: 'চিহ্নিত করুন',
    from: 'থেকে',
    to: 'প্রতি',
    you: 'আপনি',
    webhookUrl: 'Webhook URL',
    webhookInfo: 'Resend webhooks-এ email.received event এর জন্য এই URL দিন:',
    copy: 'কপি',
    copied: 'কপি হয়েছে!',
    unread: 'অপঠিত',
  }
};

export default function EmailInbox({ language }: EmailInboxProps) {
  const t = translations[language];
  const queryClient = useQueryClient();
  
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [senderIdentity, setSenderIdentity] = useState('support');
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const webhookUrl = `https://ayqbpqgahtycrncbknvj.supabase.co/functions/v1/email-inbound-webhook`;

  // Fetch threads
  const { data: threads = [], isLoading: threadsLoading, refetch: refetchThreads } = useQuery({
    queryKey: ['email-threads', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('email_threads')
        .select('*')
        .order('last_message_at', { ascending: false });
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as EmailThread[];
    }
  });

  // Fetch messages for selected thread
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['email-messages', selectedThread?.id],
    queryFn: async () => {
      if (!selectedThread) return [];
      
      const { data, error } = await supabase
        .from('email_messages')
        .select('*')
        .eq('thread_id', selectedThread.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;

      // Mark messages as read
      await supabase
        .from('email_messages')
        .update({ is_read: true })
        .eq('thread_id', selectedThread.id)
        .eq('is_read', false);
      
      return data as EmailMessage[];
    },
    enabled: !!selectedThread
  });

  // Get unread counts
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-emails'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('email_messages')
        .select('*', { count: 'exact', head: true })
        .eq('direction', 'inbound')
        .eq('is_read', false);
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Update thread status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ threadId, status }: { threadId: string; status: string }) => {
      const { error } = await supabase
        .from('email_threads')
        .update({ status })
        .eq('id', threadId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-threads'] });
      if (selectedThread) {
        setSelectedThread(prev => prev ? { ...prev, status: statusFilter as any } : null);
      }
      toast.success('Status updated');
    }
  });

  // Send reply
  const handleSendReply = async () => {
    if (!selectedThread || !replyText.trim()) return;

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-custom-email', {
        body: {
          to: selectedThread.external_email,
          subject: `Re: ${selectedThread.subject}`,
          message: replyText.trim(),
          senderIdentity: senderIdentity,
          threadId: selectedThread.id,
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(t.sent);
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: ['email-messages', selectedThread.id] });
      queryClient.invalidateQueries({ queryKey: ['email-threads'] });
    } catch (err: any) {
      console.error('Reply error:', err);
      toast.error(err.message || 'Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success(t.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30"><CheckCircle2 className="w-3 h-3 mr-1" />{t.open}</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30"><Clock className="w-3 h-3 mr-1" />{t.pending}</Badge>;
      case 'closed':
        return <Badge className="bg-zinc-500/20 text-zinc-600 border-zinc-500/30"><XCircle className="w-3 h-3 mr-1" />{t.closed}</Badge>;
      default:
        return null;
    }
  };

  const filteredThreads = threads.filter(thread =>
    thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.external_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (thread.external_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Thread detail view
  if (selectedThread) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setSelectedThread(null)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Button>
          
          <div className="flex items-center gap-2">
            <Select
              value={selectedThread.status}
              onValueChange={(value) => updateStatusMutation.mutate({ threadId: selectedThread.id, status: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">{t.open}</SelectItem>
                <SelectItem value="pending">{t.pending}</SelectItem>
                <SelectItem value="closed">{t.closed}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Thread Info */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{selectedThread.subject}</CardTitle>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{selectedThread.external_name || selectedThread.external_email}</span>
                  <span className="text-zinc-400">•</span>
                  <span>{selectedThread.external_email}</span>
                </div>
              </div>
              {getStatusBadge(selectedThread.status)}
            </div>
          </CardHeader>
        </Card>

        {/* Messages */}
        <Card className="flex-1">
          <ScrollArea className="h-[400px] p-4">
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-xl ${
                      message.direction === 'inbound'
                        ? 'bg-muted/50 mr-8'
                        : 'bg-sky-500/10 ml-8 border border-sky-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {message.direction === 'inbound' 
                            ? (selectedThread.external_name || message.from_email) 
                            : t.you}
                        </span>
                        {message.direction === 'outbound' && message.sender_identity && (
                          <Badge variant="outline" className="text-xs">
                            {message.sender_identity}@alphazero.online
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {message.body_text || 'No text content'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <Separator />
          
          {/* Reply Section */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t.senderIdentity}:</span>
              <Select value={senderIdentity} onValueChange={setSenderIdentity}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noreply">noreply@alphazero.online</SelectItem>
                  <SelectItem value="support">support@alphazero.online</SelectItem>
                  <SelectItem value="info">info@alphazero.online</SelectItem>
                  <SelectItem value="admin">admin@alphazero.online</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={t.replyPlaceholder}
              rows={4}
              className="resize-none"
            />
            
            <Button
              onClick={handleSendReply}
              disabled={isSending || !replyText.trim()}
              className="w-full bg-gradient-to-r from-sky-500 to-cyan-600"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.sending}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t.reply}
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Inbox list view
  return (
    <div className="space-y-4">
      {/* Webhook URL Info */}
      <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50">
        <CardContent className="p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">{t.webhookInfo}</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-white dark:bg-zinc-900 p-2 rounded border truncate">
              {webhookUrl}
            </code>
            <Button size="sm" variant="outline" onClick={copyWebhookUrl}>
              {copied ? t.copied : t.copy}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-lg">
            <Inbox className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{t.inbox}</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadCount} {t.unread}
              </p>
            )}
          </div>
        </div>
        
        <Button variant="outline" size="sm" onClick={() => refetchThreads()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          {t.refresh}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="open">{t.open}</SelectItem>
            <SelectItem value="pending">{t.pending}</SelectItem>
            <SelectItem value="closed">{t.closed}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Thread List */}
      <Card>
        <ScrollArea className="h-[500px]">
          {threadsLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">{t.noThreads}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.noThreadsDesc}</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className="w-full p-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">
                          {thread.external_name || thread.external_email}
                        </span>
                        {getStatusBadge(thread.status)}
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">
                        {thread.subject}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {thread.external_email}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(thread.last_message_at), 'MMM d')}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}
