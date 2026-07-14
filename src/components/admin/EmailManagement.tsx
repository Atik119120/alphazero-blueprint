import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Send, Loader2, CheckCircle2, User, FileText } from 'lucide-react';

interface EmailManagementProps {
  language: 'en' | 'bn';
}

const translations = {
  en: {
    title: 'Send Email',
    description: 'Send professional emails from your domain',
    recipientEmail: 'Recipient Email',
    recipientPlaceholder: 'student@example.com',
    subject: 'Subject',
    subjectPlaceholder: 'Enter email subject',
    message: 'Message',
    messagePlaceholder: 'Write your message here...',
    senderName: 'Sender Name (optional)',
    senderNamePlaceholder: 'AlphaZero Academy',
    sendEmail: 'Send Email',
    sending: 'Sending...',
    success: 'Email sent successfully!',
    error: 'Failed to send email',
    emailRequired: 'Please enter recipient email',
    subjectRequired: 'Please enter subject',
    messageRequired: 'Please enter message',
    fromDomain: 'Emails will be sent from: noreply@alphazero.online',
    recentEmails: 'Email will be sent professionally with your domain branding',
  },
  bn: {
    title: 'Send Email',
    description: 'Send professional emails from your domain',
    recipientEmail: "Recipient's Email",
    recipientPlaceholder: 'student@example.com',
    subject: 'Subject',
    subjectPlaceholder: 'Enter email subject',
    message: 'Message',
    messagePlaceholder: 'Write your message here...',
    senderName: 'Sender Name (Optional)',
    senderNamePlaceholder: 'AlphaZero Academy',
    sendEmail: 'Send Email',
    sending: 'Sending...',
    success: 'Email sent successfully!',
    error: 'Failed to send email',
    emailRequired: 'Enter recipient's email',
    subjectRequired: 'Enter subject',
    messageRequired: 'Write message',
    fromDomain: 'Email will be sent from: noreply@alphazero.online',
    recentEmails: 'Professional emails will be sent with your domain branding',
  }
};

export default function EmailManagement({ language }: EmailManagementProps) {
  const t = translations[language];
  
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async () => {
    // Validation
    if (!recipientEmail.trim()) {
      toast.error(t.emailRequired);
      return;
    }
    if (!subject.trim()) {
      toast.error(t.subjectRequired);
      return;
    }
    if (!message.trim()) {
      toast.error(t.messageRequired);
      return;
    }

    setIsSending(true);
    setEmailSent(false);

    try {
      const { data, error } = await supabase.functions.invoke('send-custom-email', {
        body: {
          to: recipientEmail.trim(),
          subject: subject.trim(),
          message: message.trim(),
          senderName: senderName.trim() || 'AlphaZero Academy',
        }
      });

      if (error) {
        console.error('Email send error:', error);
        toast.error(t.error);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      toast.success(t.success);
      setEmailSent(true);
      
      // Clear form after success
      setRecipientEmail('');
      setSubject('');
      setMessage('');
      
      // Reset success state after a few seconds
      setTimeout(() => setEmailSent(false), 3000);
    } catch (err) {
      console.error('Email error:', err);
      toast.error(t.error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-lg shadow-sky-500/30">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          {/* Info Banner */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50">
            <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
            <p className="text-sm text-sky-700 dark:text-sky-300">
              {t.fromDomain}
            </p>
          </div>

          {/* Recipient Email */}
          <div className="space-y-2">
            <Label htmlFor="recipient-email" className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              {t.recipientEmail}
            </Label>
            <Input
              id="recipient-email"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder={t.recipientPlaceholder}
              className="h-12"
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              {t.subject}
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t.subjectPlaceholder}
              className="h-12"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              {t.message}
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.messagePlaceholder}
              rows={8}
              className="resize-none"
            />
          </div>

          {/* Optional Sender Name */}
          <div className="space-y-2">
            <Label htmlFor="sender-name" className="text-muted-foreground text-sm">
              {t.senderName}
            </Label>
            <Input
              id="sender-name"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder={t.senderNamePlaceholder}
              className="h-10"
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendEmail}
            disabled={isSending}
            className={`w-full h-14 text-base font-semibold rounded-xl transition-all duration-300 ${
              emailSent 
                ? 'bg-emerald-500 hover:bg-emerald-600' 
                : 'bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700'
            } shadow-lg`}
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t.sending}
              </>
            ) : emailSent ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {t.success}
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                {t.sendEmail}
              </>
            )}
          </Button>

          {/* Footer Note */}
          <p className="text-xs text-center text-muted-foreground">
            {t.recentEmails}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
