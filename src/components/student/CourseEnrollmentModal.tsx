import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  Copy,
  GraduationCap,
  Info
} from 'lucide-react';
import { Course } from '@/types/lms';
import bkashLogo from '@/assets/bkash-logo.png';
import nagadLogo from '@/assets/nagad-logo.png';

interface CourseEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  userId: string;
  userEmail: string;
  userName: string;
  onSuccess: () => void;
  language: 'en' | 'bn';
}

const translations = {
  en: {
    paymentMethod: 'Select Payment Method',
    bkash: 'bKash',
    nagad: 'Nagad',
    sendMoneyTo: 'Send Money to this number',
    copyNumber: 'Copy',
    copied: 'Copied!',
    transactionId: 'Enter Transaction ID',
    transactionPlaceholder: 'e.g. 8N7X2K4M9P',
    howToPay: 'Steps:',
    steps: ['Open App', 'Send Money', 'Enter Number', 'Amount: ৳', 'Get TxID', 'Paste Below'],
    confirmEnrollment: 'Confirm Enrollment',
    processing: 'Processing...',
    success: 'Request sent! Admin will approve shortly.',
    error: 'Failed to send request.',
    alreadyRequested: 'Already requested this course.',
    note: 'Course access will activate after admin approval.',
    free: 'Free',
    amount: 'Amount',
    courseFee: 'Course Fee',
  },
  bn: {
    paymentMethod: 'পেমেন্ট পদ্ধতি বাছুন',
    bkash: 'বিকাশ',
    nagad: 'নগদ',
    sendMoneyTo: 'এই নম্বরে সেন্ড মানি করুন',
    copyNumber: 'কপি',
    copied: 'কপি হয়েছে!',
    transactionId: 'ট্রানজেকশন আইডি দিন',
    transactionPlaceholder: 'যেমন: 8N7X2K4M9P',
    howToPay: 'ধাপ:',
    steps: ['অ্যাপ খুলুন', 'সেন্ড মানি', 'নম্বর দিন', 'পরিমাণ: ৳', 'TxID নিন', 'নিচে দিন'],
    confirmEnrollment: 'এনরোলমেন্ট নিশ্চিত করুন',
    processing: 'প্রসেসিং...',
    success: 'রিকুয়েস্ট পাঠানো হয়েছে!',
    error: 'রিকুয়েস্ট পাঠাতে ব্যর্থ।',
    alreadyRequested: 'ইতিমধ্যে রিকুয়েস্ট করা হয়েছে।',
    note: 'অ্যাডমিন অনুমোদনের পর কোর্স অ্যাক্সেস পাবেন।',
    free: 'ফ্রি',
    amount: 'পরিমাণ',
    courseFee: 'কোর্স ফি',
  }
};

const PAYMENT_NUMBER = '01776965533';

export default function CourseEnrollmentModal({
  isOpen,
  onClose,
  course,
  userId,
  userEmail,
  userName,
  onSuccess,
  language
}: CourseEnrollmentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = translations[language];

  const copyNumber = async () => {
    await navigator.clipboard.writeText(PAYMENT_NUMBER);
    setCopied(true);
    toast.success(t.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!course || !transactionId.trim()) {
      toast.error(language === 'bn' ? 'ট্রানজেকশন আইডি দিন' : 'Please enter transaction ID');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: existingRequest } = await supabase
        .from('enrollment_requests')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', course.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (existingRequest) {
        toast.error(t.alreadyRequested);
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.from('enrollment_requests').insert({
        user_id: userId,
        course_id: course.id,
        student_name: userName,
        student_email: userEmail,
        payment_method: paymentMethod,
        transaction_id: transactionId.trim(),
        message: `Payment via ${paymentMethod.toUpperCase()} - TxID: ${transactionId.trim()} - Amount: ৳${course.price || 0}`,
        status: 'pending',
      });

      if (error) {
        if (error.code === '23505') {
          toast.error(t.alreadyRequested);
        } else {
          toast.error(t.error);
        }
      } else {
        // Send Telegram notification
        try {
          await supabase.functions.invoke('student-enrollment-notify', {
            body: {
              studentName: userName,
              studentEmail: userEmail,
              courseName: course.title,
              coursePrice: course.price || 0,
              paymentMethod: paymentMethod,
              transactionId: transactionId.trim(),
            }
          });
        } catch (notifyError) {
          console.error('Failed to send notification:', notifyError);
        }

        toast.success(t.success);
        setTransactionId('');
        onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!course) return null;

  const coursePrice = course.price || 0;
  const isFree = coursePrice === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0 rounded-3xl border border-border/50 shadow-2xl">
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-bold text-white leading-tight line-clamp-2">
                {course.title}
              </DialogTitle>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-white/60">{t.courseFee}</span>
                <Badge className="bg-emerald-500 text-white border-0 text-base px-3 py-0.5 font-bold">
                  {isFree ? t.free : `৳${coursePrice.toLocaleString()}`}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5 bg-white dark:bg-slate-900">
          {!isFree && (
            <>
              {/* Payment Method */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  {t.paymentMethod}
                </Label>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(v) => setPaymentMethod(v as 'bkash' | 'nagad')}
                  className="grid grid-cols-2 gap-3"
                >
                  {/* bKash */}
                  <label 
                    className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'bkash' 
                        ? 'bg-pink-50 dark:bg-pink-950/30 ring-2 ring-pink-500' 
                        : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <RadioGroupItem value="bkash" className="sr-only" />
                    {paymentMethod === 'bkash' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-5 h-5 text-pink-500 fill-pink-500" />
                      </div>
                    )}
                    <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg">
                      <img src={bkashLogo} alt="bKash" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-semibold text-sm">{t.bkash}</span>
                  </label>
                  
                  {/* Nagad */}
                  <label 
                    className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'nagad' 
                        ? 'bg-orange-50 dark:bg-orange-950/30 ring-2 ring-orange-500' 
                        : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <RadioGroupItem value="nagad" className="sr-only" />
                    {paymentMethod === 'nagad' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-5 h-5 text-orange-500 fill-orange-500" />
                      </div>
                    )}
                    <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg">
                      <img src={nagadLogo} alt="Nagad" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-semibold text-sm">{t.nagad}</span>
                  </label>
                </RadioGroup>
              </div>

              {/* Payment Number */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-3">
                <p className="text-sm font-medium text-foreground">{t.sendMoneyTo}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border border-border">
                    <span className="font-mono text-xl font-bold tracking-widest text-foreground">
                      {PAYMENT_NUMBER}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={copyNumber}
                    className={`shrink-0 h-12 px-4 rounded-xl ${
                      copied 
                        ? 'bg-emerald-500 hover:bg-emerald-600' 
                        : 'bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600'
                    }`}
                  >
                    {copied ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1.5" />
                        {t.copyNumber}
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Quick Steps */}
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {t.howToPay}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {t.steps.map((step, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center gap-1.5 text-xs bg-white dark:bg-slate-900 border border-border px-2.5 py-1.5 rounded-lg"
                      >
                        <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                          {index + 1}
                        </span>
                        <span className="text-foreground">
                          {step}{index === 3 ? coursePrice : ''}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transaction ID */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  {t.transactionId}
                </Label>
                <Input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  placeholder={t.transactionPlaceholder}
                  className="h-14 text-lg font-mono font-bold tracking-wider text-center rounded-xl border-2 border-border bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:bg-white dark:focus:bg-slate-900"
                />
              </div>
            </>
          )}

          {/* Note */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/50">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">{t.note}</p>
          </div>

          {/* Submit */}
          <Button 
            className="w-full h-14 text-base font-bold gap-2 rounded-xl"
            onClick={handleSubmit}
            disabled={isSubmitting || (!isFree && !transactionId.trim())}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.processing}
              </>
            ) : (
              <>
                {t.confirmEnrollment}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
