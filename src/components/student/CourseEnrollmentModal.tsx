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
  CheckCircle, 
  ArrowRight,
  Loader2,
  Copy,
  GraduationCap,
  Info,
  Sparkles
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
    title: 'Enroll in Course',
    coursePrice: 'Course Price',
    paymentMethod: 'Select Payment Method',
    bkash: 'bKash',
    nagad: 'Nagad',
    sendMoneyTo: 'Send Money to this number',
    copyNumber: 'Copy',
    copied: 'Copied!',
    transactionId: 'Transaction ID',
    transactionPlaceholder: 'e.g. 8N7X2K4M9P',
    howToPay: 'How to pay?',
    steps: {
      step1: 'Open bKash/Nagad app',
      step2: 'Tap "Send Money"',
      step3: 'Enter the number',
      step4: 'Send ৳',
      step5: 'Copy Transaction ID',
      step6: 'Paste it below',
    },
    confirmEnrollment: 'Confirm Enrollment',
    processing: 'Processing...',
    success: 'Request sent! Admin will approve shortly.',
    error: 'Failed to send request. Please try again.',
    alreadyRequested: 'You have already requested this course.',
    note: 'Your course access will be activated after admin approval.',
    free: 'Free',
    amount: 'Amount',
  },
  bn: {
    title: 'কোর্সে এনরোল করুন',
    coursePrice: 'কোর্সের মূল্য',
    paymentMethod: 'পেমেন্ট পদ্ধতি বাছুন',
    bkash: 'বিকাশ',
    nagad: 'নগদ',
    sendMoneyTo: 'এই নম্বরে সেন্ড মানি করুন',
    copyNumber: 'কপি',
    copied: 'কপি হয়েছে!',
    transactionId: 'ট্রানজেকশন আইডি',
    transactionPlaceholder: 'যেমন: 8N7X2K4M9P',
    howToPay: 'কিভাবে পেমেন্ট করবেন?',
    steps: {
      step1: 'বিকাশ/নগদ অ্যাপ খুলুন',
      step2: '"সেন্ড মানি" ট্যাপ করুন',
      step3: 'নম্বরটি দিন',
      step4: '৳ পাঠান',
      step5: 'ট্রানজেকশন আইডি কপি করুন',
      step6: 'নিচে পেস্ট করুন',
    },
    confirmEnrollment: 'এনরোলমেন্ট নিশ্চিত করুন',
    processing: 'প্রসেসিং...',
    success: 'রিকুয়েস্ট পাঠানো হয়েছে! অ্যাডমিন শীঘ্রই অনুমোদন করবেন।',
    error: 'রিকুয়েস্ট পাঠাতে ব্যর্থ। আবার চেষ্টা করুন।',
    alreadyRequested: 'আপনি ইতিমধ্যে এই কোর্সের জন্য রিকুয়েস্ট করেছেন।',
    note: 'অ্যাডমিন অনুমোদনের পর কোর্স অ্যাক্সেস সক্রিয় হবে।',
    free: 'ফ্রি',
    amount: 'পরিমাণ',
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
      <DialogContent className="max-w-[420px] p-0 overflow-hidden gap-0 border-0 shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary via-cyan-600 to-primary p-6 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                {language === 'bn' ? 'এনরোলমেন্ট' : 'Enrollment'}
              </Badge>
            </div>
            
            <DialogTitle className="text-xl font-bold text-white leading-tight line-clamp-2 mb-3">
              {course.title}
            </DialogTitle>
            
            {/* Price Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-xs opacity-80">{t.amount}:</span>
              <span className="text-xl font-bold">
                {isFree ? t.free : `৳${coursePrice.toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4 bg-background">
          {!isFree && (
            <>
              {/* Payment Method Selection */}
              <div className="space-y-2.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.paymentMethod}
                </Label>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(v) => setPaymentMethod(v as 'bkash' | 'nagad')}
                  className="grid grid-cols-2 gap-2"
                >
                  <label 
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'bkash' 
                        ? 'border-[#E2136E] bg-[#E2136E]/5 shadow-lg shadow-[#E2136E]/10' 
                        : 'border-border/50 hover:border-[#E2136E]/30 hover:bg-muted/30'
                    }`}
                  >
                    <RadioGroupItem value="bkash" className="sr-only" />
                    {paymentMethod === 'bkash' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-4 h-4 text-[#E2136E]" />
                      </div>
                    )}
                    <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-md border border-[#E2136E]/10">
                      <img src={bkashLogo} alt="bKash" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-semibold text-sm">{t.bkash}</span>
                  </label>
                  
                  <label 
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'nagad' 
                        ? 'border-[#F6921E] bg-[#F6921E]/5 shadow-lg shadow-[#F6921E]/10' 
                        : 'border-border/50 hover:border-[#F6921E]/30 hover:bg-muted/30'
                    }`}
                  >
                    <RadioGroupItem value="nagad" className="sr-only" />
                    {paymentMethod === 'nagad' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-4 h-4 text-[#F6921E]" />
                      </div>
                    )}
                    <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-md border border-[#F6921E]/10">
                      <img src={nagadLogo} alt="Nagad" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-semibold text-sm">{t.nagad}</span>
                  </label>
                </RadioGroup>
              </div>

              {/* Payment Number Card */}
              <div className={`rounded-2xl p-4 border-2 ${
                paymentMethod === 'bkash' 
                  ? 'bg-gradient-to-br from-[#E2136E]/5 to-[#E2136E]/10 border-[#E2136E]/20' 
                  : 'bg-gradient-to-br from-[#F6921E]/5 to-[#F6921E]/10 border-[#F6921E]/20'
              }`}>
                <p className="text-xs font-medium text-muted-foreground mb-2">{t.sendMoneyTo}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 shadow-sm border">
                    <span className="font-mono text-xl font-bold tracking-widest">{PAYMENT_NUMBER}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant={copied ? "default" : "outline"}
                    onClick={copyNumber}
                    className={`shrink-0 h-12 px-4 rounded-xl transition-all ${
                      copied ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''
                    }`}
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1.5" />
                        {t.copyNumber}
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Quick Steps */}
                <div className="mt-3 pt-3 border-t border-current/10">
                  <p className="text-[10px] font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {t.howToPay}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.values(t.steps).map((step, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center gap-1 text-[10px] bg-white/80 dark:bg-slate-800 px-2 py-1 rounded-full"
                      >
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                          paymentMethod === 'bkash' ? 'bg-[#E2136E]' : 'bg-[#F6921E]'
                        }`}>
                          {index + 1}
                        </span>
                        {step}{index === 3 ? coursePrice : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transaction ID Input */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.transactionId}
                </Label>
                <Input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  placeholder={t.transactionPlaceholder}
                  className="h-14 text-lg font-mono font-bold tracking-wider text-center rounded-xl border-2 focus:border-primary"
                />
              </div>
            </>
          )}

          {/* Note */}
          <div className="flex items-start gap-2.5 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-700 dark:text-emerald-300">{t.note}</p>
          </div>

          {/* Submit Button */}
          <Button 
            className={`w-full h-14 text-sm font-bold gap-2 rounded-xl shadow-lg transition-all ${
              paymentMethod === 'bkash' && !isFree
                ? 'bg-gradient-to-r from-[#E2136E] to-[#C2185B] hover:from-[#C2185B] hover:to-[#E2136E] shadow-[#E2136E]/25'
                : paymentMethod === 'nagad' && !isFree
                  ? 'bg-gradient-to-r from-[#F6921E] to-[#E65100] hover:from-[#E65100] hover:to-[#F6921E] shadow-[#F6921E]/25'
                  : ''
            }`}
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
