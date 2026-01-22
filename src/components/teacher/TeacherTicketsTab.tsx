import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SupportTicket, TicketMessage } from '@/types/teacher';

interface TeacherTicketsTabProps {
  tickets: SupportTicket[];
  isLoading: boolean;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => Promise<{ error: any }>;
  sendMessage: (ticketId: string, message: string) => Promise<{ error: any }>;
  refetch: () => void;
  language: 'en' | 'bn';
}

const translations = {
  en: {
    title: 'Support Tickets',
    subtitle: 'Manage student support requests',
    noTickets: 'No support tickets',
    noTicketsDesc: 'When students submit tickets for your courses, they will appear here',
    loading: 'Loading...',
    open: 'Open',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    priority: 'Priority',
    low: 'Low',
    normal: 'Normal',
    high: 'High',
    urgent: 'Urgent',
    viewConversation: 'View Conversation',
    reply: 'Reply',
    send: 'Send',
    typeMessage: 'Type your reply...',
    student: 'Student',
    course: 'Course',
  },
  bn: {
    title: 'সাপোর্ট টিকেট',
    subtitle: 'শিক্ষার্থীদের সাপোর্ট রিকোয়েস্ট ম্যানেজ করুন',
    noTickets: 'কোনো সাপোর্ট টিকেট নেই',
    noTicketsDesc: 'শিক্ষার্থীরা আপনার কোর্সের জন্য টিকেট জমা দিলে এখানে দেখা যাবে',
    loading: 'লোড হচ্ছে...',
    open: 'ওপেন',
    inProgress: 'চলমান',
    resolved: 'সমাধান হয়েছে',
    closed: 'বন্ধ',
    priority: 'অগ্রাধিকার',
    low: 'কম',
    normal: 'সাধারণ',
    high: 'উচ্চ',
    urgent: 'জরুরি',
    viewConversation: 'কথোপকথন দেখুন',
    reply: 'উত্তর দিন',
    send: 'পাঠান',
    typeMessage: 'আপনার উত্তর লিখুন...',
    student: 'শিক্ষার্থী',
    course: 'কোর্স',
  },
};

export default function TeacherTicketsTab({ 
  tickets, isLoading, updateTicketStatus, sendMessage, refetch, language 
}: TeacherTicketsTabProps) {
  const { toast } = useToast();
  const t = translations[language];

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-yellow-500',
      in_progress: 'bg-blue-500',
      resolved: 'bg-green-500',
      closed: 'bg-gray-500',
    };
    const labels: Record<string, string> = {
      open: t.open,
      in_progress: t.inProgress,
      resolved: t.resolved,
      closed: t.closed,
    };
    return <Badge className={colors[status]}>{labels[status] || status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-gray-500',
      normal: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500',
    };
    const labels: Record<string, string> = {
      low: t.low,
      normal: t.normal,
      high: t.high,
      urgent: t.urgent,
    };
    return <span className={`text-sm font-medium ${colors[priority]}`}>{labels[priority] || priority}</span>;
  };

  const openTicketDialog = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsLoadingMessages(true);
    
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*, sender:profiles!ticket_messages_sender_id_fkey(*)')
        .eq('ticket_id', ticket.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data as TicketMessage[] || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;

    try {
      setIsSending(true);
      const { error } = await sendMessage(selectedTicket.id, newMessage.trim());
      
      if (error) throw error;

      // Refresh messages
      await openTicketDialog(selectedTicket);
      setNewMessage('');
      
      toast({ title: language === 'bn' ? 'বার্তা পাঠানো হয়েছে' : 'Message sent' });
    } catch (error) {
      console.error('Error:', error);
      toast({ title: language === 'bn' ? 'ত্রুটি' : 'Error', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (ticketId: string, status: SupportTicket['status']) => {
    const { error } = await updateTicketStatus(ticketId, status);
    if (!error) {
      refetch();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status });
      }
    }
  };

  // Stats
  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">{openCount}</p>
            <p className="text-sm text-muted-foreground">{t.open}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{inProgressCount}</p>
            <p className="text-sm text-muted-foreground">{t.inProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{resolvedCount}</p>
            <p className="text-sm text-muted-foreground">{t.resolved}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t.noTickets}</h3>
          <p className="text-muted-foreground">{t.noTicketsDesc}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar>
                      <AvatarImage src={ticket.student?.avatar_url || ''} />
                      <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">{ticket.ticket_number}</span>
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                      <h3 className="font-medium mt-1">{ticket.subject}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                        <span>{t.student}: {ticket.student?.full_name}</span>
                        {ticket.course && (
                          <span>{t.course}: {language === 'bn' ? ticket.course.title : ticket.course.title_en || ticket.course.title}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={ticket.status}
                      onValueChange={(value: SupportTicket['status']) => handleStatusChange(ticket.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">{t.open}</SelectItem>
                        <SelectItem value="in_progress">{t.inProgress}</SelectItem>
                        <SelectItem value="resolved">{t.resolved}</SelectItem>
                        <SelectItem value="closed">{t.closed}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => openTicketDialog(ticket)}>
                      {t.reply}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Conversation Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{selectedTicket?.ticket_number}</span>
              {selectedTicket && getStatusBadge(selectedTicket.status)}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{selectedTicket?.subject}</p>
          </DialogHeader>

          <ScrollArea className="flex-1 p-4 border rounded-lg bg-accent/30">
            {isLoadingMessages ? (
              <p className="text-center text-muted-foreground py-4">{t.loading}</p>
            ) : messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No messages yet</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isStudent = msg.sender_id === selectedTicket?.student_id;
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isStudent ? '' : 'flex-row-reverse'}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={(msg.sender as any)?.avatar_url || ''} />
                        <AvatarFallback><User className="w-3 h-3" /></AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 max-w-[80%] ${isStudent ? '' : 'text-right'}`}>
                        <div className={`inline-block p-3 rounded-lg ${isStudent ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          <div className="flex gap-2 pt-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t.typeMessage}
              className="resize-none"
              rows={2}
            />
            <Button onClick={handleSendMessage} disabled={isSending || !newMessage.trim()} size="icon" className="h-auto">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
