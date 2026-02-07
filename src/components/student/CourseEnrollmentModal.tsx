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
  Info,
  CreditCard
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
    uddoktapay: 'UddoktaPay',
    uddoktapayDesc: 'Pay securely online',
    sendMoneyTo: 'Send Money to this number',
    copyNumber: 'Copy',
    copied: 'Copied!',
    transactionId: 'Enter Transaction ID',
    transactionPlaceholder: 'e.g. 8N7X2K4M9P',
    howToPay: 'Steps:',
    steps: ['Open App', 'Send Money', 'Enter Number', 'Amount: ৳', 'Get TxID', 'Paste Below'],
    confirmEnrollment: 'Confirm Enrollment',
    payNow: 'Pay Now',
    processing: 'Processing...',
    success: 'Request sent! Admin will approve shortly.',
    error: 'Failed to send request.',
    alreadyRequested: 'Already requested this course.',
    note: 'Course access will activate after admin approval.',
    noteOnline: 'After payment, access will be activated automatically.',
    free: 'Free',
    amount: 'Amount',
    courseFee: 'Course Fee',
    redirecting: 'Redirecting to payment...',
  },
  bn: {
    paymentMethod: 'পেমেন্ট পদ্ধতি বাছুন',
    bkash: 'বিকাশ',
    nagad: 'নগদ',
    uddoktapay: 'উদ্যোক্তা পে',
    uddoktapayDesc: 'অনলাইনে নিরাপদে পে করুন',
    sendMoneyTo: 'এই নম্বরে সেন্ড মানি করুন',
    copyNumber: 'কপি',
    copied: 'কপি হয়েছে!',
    transactionId: 'ট্রানজেকশন আইডি দিন',
    transactionPlaceholder: 'যেমন: 8N7X2K4M9P',
    howToPay: 'ধাপ:',
    steps: ['অ্যাপ খুলুন', 'সেন্ড মানি', 'নম্বর দিন', 'পরিমাণ: ৳', 'TxID নিন', 'নিচে দিন'],
    confirmEnrollment: 'এনরোলমেন্ট নিশ্চিত করুন',
    payNow: 'পেমেন্ট করুন',
    processing: 'প্রসেসিং...',
    success: 'রিকুয়েস্ট পাঠানো হয়েছে!',
    error: 'রিকুয়েস্ট পাঠাতে ব্যর্থ।',
    alreadyRequested: 'ইতিমধ্যে রিকুয়েস্ট করা হয়েছে।',
    note: 'অ্যাডমিন অনুমোদনের পর কোর্স অ্যাক্সেস পাবেন।',
    noteOnline: 'পেমেন্টের পর স্বয়ংক্রিয়ভাবে অ্যাক্সেস পাবেন।',
    free: 'ফ্রি',
    amount: 'পরিমাণ',
    courseFee: 'কোর্স ফি',
    redirecting: 'পেমেন্ট পেজে যাচ্ছে...',
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
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'uddoktapay'>('uddoktapay');
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

  const handleUddoktaPayCheckout = async () => {
    if (!course) return;

    setIsSubmitting(true);

    try {
      // Check for existing pending request
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

      const currentUrl = window.location.origin;
      
      // Call UddoktaPay checkout
      const { data, error } = await supabase.functions.invoke('uddoktapay-checkout', {
        body: {
          full_name: userName,
          email: userEmail,
          amount: course.price || 0,
          metadata: {
            course_id: course.id,
            course_title: course.title,
            user_id: userId,
            type: 'course_enrollment'
          },
          redirect_url: `${currentUrl}/student?payment=success&course_id=${course.id}`,
          cancel_url: `${currentUrl}/courses?payment=cancelled`,
        }
      });

      if (error) {
        console.error('UddoktaPay checkout error:', error);
        toast.error(t.error);
        setIsSubmitting(false);
        return;
      }

      if (data?.payment_url) {
        toast.success(t.redirecting);
        
        // Create pending enrollment request
        await supabase.from('enrollment_requests').insert({
          user_id: userId,
          course_id: course.id,
          student_name: userName,
          student_email: userEmail,
          payment_method: 'uddoktapay',
          transaction_id: data.invoice_id || 'pending',
          message: `UddoktaPay - Invoice: ${data.invoice_id} - Amount: ৳${course.price || 0}`,
          status: 'pending',
        });

        // Redirect to payment
        window.location.href = data.payment_url;
      } else {
        toast.error(t.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(t.error);
      setIsSubmitting(false);
    }
  };

  const handleManualPayment = async () => {
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

  const handleSubmit = () => {
    if (paymentMethod === 'uddoktapay') {
      handleUddoktaPayCheckout();
    } else {
      handleManualPayment();
    }
  };

  if (!course) return null;

  const coursePrice = course.price || 0;
  const isFree = coursePrice === 0;
  const isManualPayment = paymentMethod === 'bkash' || paymentMethod === 'nagad';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0 rounded-3xl border border-border/50 shadow-2xl max-h-[90vh] overflow-y-auto">
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
                  onValueChange={(v) => setPaymentMethod(v as 'bkash' | 'nagad' | 'uddoktapay')}
                  className="grid grid-cols-3 gap-2"
                >
                  {/* UddoktaPay */}
                  <label 
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'uddoktapay' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 ring-2 ring-emerald-500' 
                        : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <RadioGroupItem value="uddoktapay" className="sr-only" />
                    {paymentMethod === 'uddoktapay' && (
                      <div className="absolute top-1.5 right-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                      </div>
                    )}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-xs text-center">{t.uddoktapay}</span>
                  </label>
                  
                  {/* bKash */}
                  <label 
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'bkash' 
                        ? 'bg-pink-50 dark:bg-pink-950/30 ring-2 ring-pink-500' 
                        : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <RadioGroupItem value="bkash" className="sr-only" />
                    {paymentMethod === 'bkash' && (
                      <div className="absolute top-1.5 right-1.5">
                        <CheckCircle2 className="w-4 h-4 text-pink-500 fill-pink-500" />
                      </div>
                    )}
                    <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-lg">
                      <img src={bkashLogo} alt="bKash" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-semibold text-xs">{t.bkash}</span>
                  </label>
                  
                  {/* Nagad */}
                  <label 
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'nagad' 
                        ? 'bg-orange-50 dark:bg-orange-950/30 ring-2 ring-orange-500' 
                        : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <RadioGroupItem value="nagad" className="sr-only" />
                    {paymentMethod === 'nagad' && (
                      <div className="absolute top-1.5 right-1.5">
                        <CheckCircle2 className="w-4 h-4 text-orange-500 fill-orange-500" />
                      </div>
                    )}
                    <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-lg">
                      <img src={nagadLogo} alt="Nagad" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-semibold text-xs">{t.nagad}</span>
                  </label>
                </RadioGroup>
              </div>

              {/* Manual Payment Section */}
              {isManualPayment && (
                <>
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

              {/* UddoktaPay Info */}
              {paymentMethod === 'uddoktapay' && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-900 dark:text-emerald-100">{t.uddoktapay}</p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">{t.uddoktapayDesc}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Note */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/50">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {paymentMethod === 'uddoktapay' ? t.noteOnline : t.note}
            </p>
          </div>

          {/* Submit */}
          <Button 
            className="w-full h-14 text-base font-bold gap-2 rounded-xl"
            onClick={handleSubmit}
            disabled={isSubmitting || (isManualPayment && !transactionId.trim())}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {paymentMethod === 'uddoktapay' ? t.redirecting : t.processing}
              </>
            ) : (
              <>
                {paymentMethod === 'uddoktapay' ? t.payNow : t.confirmEnrollment}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
