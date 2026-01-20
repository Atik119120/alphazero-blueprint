import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  BookOpen
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
    paymentMethod: 'Payment Method',
    bkash: 'bKash',
    nagad: 'Nagad',
    sendMoneyTo: 'Send Money to',
    copyNumber: 'Copy Number',
    copied: 'Copied!',
    transactionId: 'Transaction ID',
    transactionPlaceholder: 'Enter your transaction ID',
    steps: {
      step1: 'Open your bKash/Nagad app',
      step2: 'Select "Send Money"',
      step3: 'Enter the number above',
      step4: 'Enter the course amount',
      step5: 'Complete the payment',
      step6: 'Enter the Transaction ID below',
    },
    confirmEnrollment: 'Confirm Enrollment',
    processing: 'Processing...',
    success: 'Enrollment request sent! Admin will approve shortly.',
    error: 'Failed to send request. Please try again.',
    alreadyRequested: 'You have already requested this course.',
    note: 'Your enrollment will be activated after admin approval.',
    free: 'Free',
  },
  bn: {
    title: 'কোর্সে এনরোল করুন',
    coursePrice: 'কোর্সের মূল্য',
    paymentMethod: 'পেমেন্ট পদ্ধতি',
    bkash: 'বিকাশ',
    nagad: 'নগদ',
    sendMoneyTo: 'সেন্ড মানি করুন',
    copyNumber: 'নম্বর কপি করুন',
    copied: 'কপি হয়েছে!',
    transactionId: 'ট্রানজেকশন আইডি',
    transactionPlaceholder: 'আপনার ট্রানজেকশন আইডি লিখুন',
    steps: {
      step1: 'আপনার বিকাশ/নগদ অ্যাপ খুলুন',
      step2: '"সেন্ড মানি" সিলেক্ট করুন',
      step3: 'উপরের নম্বরটি দিন',
      step4: 'কোর্সের পরিমাণ দিন',
      step5: 'পেমেন্ট সম্পন্ন করুন',
      step6: 'নিচে ট্রানজেকশন আইডি দিন',
    },
    confirmEnrollment: 'এনরোলমেন্ট নিশ্চিত করুন',
    processing: 'প্রসেসিং...',
    success: 'এনরোলমেন্ট রিকুয়েস্ট পাঠানো হয়েছে! অ্যাডমিন শীঘ্রই অনুমোদন করবেন।',
    error: 'রিকুয়েস্ট পাঠাতে ব্যর্থ। আবার চেষ্টা করুন।',
    alreadyRequested: 'আপনি ইতিমধ্যে এই কোর্সের জন্য রিকুয়েস্ট করেছেন।',
    note: 'অ্যাডমিন অনুমোদনের পর আপনার এনরোলমেন্ট সক্রিয় হবে।',
    free: 'ফ্রি',
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
      // Check if request already exists
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

      // Create enrollment request
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
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header with Course Info */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-cyan-600 p-5 text-white">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-bold text-white line-clamp-2">
                {course.title}
              </DialogTitle>
              <div className="mt-2 flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-0 text-sm px-3 py-1">
                  {isFree ? t.free : `৳${coursePrice}`}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {!isFree && (
            <>
              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">{t.paymentMethod}</Label>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(v) => setPaymentMethod(v as 'bkash' | 'nagad')}
                  className="grid grid-cols-2 gap-3"
                >
                  <label 
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'bkash' 
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/20' 
                        : 'border-border hover:border-pink-300'
                    }`}
                  >
                    <RadioGroupItem value="bkash" className="sr-only" />
                    <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-sm border border-pink-100">
                      <img 
                        src={bkashLogo} 
                        alt="bKash" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.bkash}</p>
                      <p className="text-[10px] text-muted-foreground">Send Money</p>
                    </div>
                  </label>
                  
                  <label 
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'nagad' 
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' 
                        : 'border-border hover:border-orange-300'
                    }`}
                  >
                    <RadioGroupItem value="nagad" className="sr-only" />
                    <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-sm border border-orange-100">
                      <img 
                        src={nagadLogo} 
                        alt="Nagad" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.nagad}</p>
                      <p className="text-[10px] text-muted-foreground">Send Money</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {/* Payment Number */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground">{t.sendMoneyTo}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg px-4 py-3 font-mono text-lg font-bold tracking-wider">
                    {PAYMENT_NUMBER}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={copyNumber}
                    className="shrink-0 h-12"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                
                {/* Steps */}
                <div className="space-y-1.5 pt-2">
                  {Object.entries(t.steps).map(([key, step], index) => (
                    <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                        {index + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction ID Input */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t.transactionId}</Label>
                <Input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder={t.transactionPlaceholder}
                  className="h-12 text-base font-mono"
                />
              </div>
            </>
          )}

          {/* Note */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">{t.note}</p>
          </div>

          {/* Submit Button */}
          <Button 
            className="w-full h-12 text-sm font-semibold gap-2" 
            onClick={handleSubmit}
            disabled={isSubmitting || (!isFree && !transactionId.trim())}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.processing}
              </>
            ) : (
              <>
                {t.confirmEnrollment}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
