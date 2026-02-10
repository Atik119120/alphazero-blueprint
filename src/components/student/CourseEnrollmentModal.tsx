import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  GraduationCap,
  Info,
  CreditCard,
  Loader2
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
    processing: 'Processing...',
    success: 'Enrollment request submitted! We will contact you soon.',
    error: 'Failed to submit enrollment.',
    alreadyRequested: 'Already requested this course.',
    free: 'Free',
    courseFee: 'Course Fee',
    enrollFree: 'Enroll Now (Free)',
    freeNote: 'This is a free course. Click to enroll instantly.',
    paymentMethod: 'Payment Method',
    selectMethod: 'Select payment method',
    sendMoney: 'Send money to this number',
    transactionId: 'Transaction ID',
    transactionPlaceholder: 'e.g., 8N7X9K2M5P',
    transactionHint: 'Enter the transaction ID after sending money',
    submitEnrollment: 'Submit Enrollment',
    paymentInstructions: 'Payment Instructions:',
  },
  bn: {
    processing: 'প্রসেসিং...',
    success: 'ভর্তি আবেদন জমা হয়েছে! শীঘ্রই যোগাযোগ করা হবে।',
    error: 'আবেদন জমা দিতে ব্যর্থ।',
    alreadyRequested: 'ইতিমধ্যে রিকুয়েস্ট করা হয়েছে।',
    free: 'ফ্রি',
    courseFee: 'কোর্স ফি',
    enrollFree: 'এখনই এনরোল করুন (ফ্রি)',
    freeNote: 'এটি একটি ফ্রি কোর্স। এখনই এনরোল করুন।',
    paymentMethod: 'পেমেন্ট মাধ্যম',
    selectMethod: 'পেমেন্ট মাধ্যম সিলেক্ট করুন',
    sendMoney: 'এই নাম্বারে টাকা পাঠান',
    transactionId: 'ট্রানজেকশন আইডি',
    transactionPlaceholder: 'যেমন: 8N7X9K2M5P',
    transactionHint: 'টাকা পাঠানোর পর যে ট্রানজেকশন আইডি পাবেন সেটি দিন',
    submitEnrollment: 'এনরোলমেন্ট জমা দিন',
    paymentInstructions: 'পেমেন্ট নির্দেশনা:',
  }
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [bkashNumber, setBkashNumber] = useState('01776965533');
  const [nagadNumber, setNagadNumber] = useState('01776965533');

  const t = translations[language];

  // Fetch payment numbers from site_settings
  useEffect(() => {
    const fetchNumbers = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['bkash_number', 'nagad_number']);
      
      if (data) {
        data.forEach(s => {
          if (s.setting_key === 'bkash_number' && s.setting_value) setBkashNumber(s.setting_value);
          if (s.setting_key === 'nagad_number' && s.setting_value) setNagadNumber(s.setting_value);
        });
      }
    };
    if (isOpen) fetchNumbers();
  }, [isOpen]);

  const handleSubmit = async () => {
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

      const isFree = !course.price || course.price === 0;

      // Create enrollment request
      const { error } = await supabase.from('enrollment_requests').insert({
        user_id: userId,
        course_id: course.id,
        student_name: userName,
        student_email: userEmail,
        payment_method: isFree ? 'free' : paymentMethod,
        transaction_id: isFree ? 'FREE' : transactionId,
        message: isFree 
          ? 'Free Course Enrollment' 
          : `${paymentMethod} - TxnID: ${transactionId} - Amount: ৳${course.price || 0}`,
        status: 'pending',
      });

      if (error) {
        if (error.code === '23505') {
          toast.error(t.alreadyRequested);
        } else {
          toast.error(t.error);
        }
        setIsSubmitting(false);
        return;
      }

      // Send Telegram notification
      try {
        await supabase.functions.invoke('student-enrollment-notify', {
          body: {
            studentName: userName,
            studentEmail: userEmail,
            courseName: course.title,
            coursePrice: course.price || 0,
            paymentMethod: isFree ? 'free' : paymentMethod,
            transactionId: isFree ? 'FREE' : transactionId,
          }
        });
      } catch (notifyError) {
        console.error('Failed to send notification:', notifyError);
      }

      toast.success(t.success);
      onSuccess();
      onClose();
      setPaymentMethod('');
      setTransactionId('');
    } catch (err) {
      console.error('Enrollment error:', err);
      toast.error(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!course) return null;

  const coursePrice = course.price || 0;
  const isFree = coursePrice === 0;
  const canSubmit = isFree || (paymentMethod && transactionId);

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
          {!isFree ? (
            <div className="space-y-4">
              {/* Payment Method Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  {t.paymentMethod}
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t.selectMethod} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bkash">
                      <div className="flex items-center gap-2">
                        <img src={bkashLogo} alt="bKash" className="w-5 h-5 object-contain" />
                        বিকাশ (bKash)
                      </div>
                    </SelectItem>
                    <SelectItem value="nagad">
                      <div className="flex items-center gap-2">
                        <img src={nagadLogo} alt="Nagad" className="w-5 h-5 object-contain" />
                        নগদ (Nagad)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Instructions */}
              {paymentMethod && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                    {t.paymentInstructions}
                  </p>
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={paymentMethod === 'bkash' ? bkashLogo : nagadLogo} 
                      alt={paymentMethod} 
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {paymentMethod === 'bkash' ? bkashNumber : nagadNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.sendMoney}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-primary">
                    {language === 'bn' ? `পাঠাতে হবে: ৳${coursePrice.toLocaleString()}` : `Amount: ৳${coursePrice.toLocaleString()}`}
                  </p>
                </div>
              )}

              {/* Transaction ID */}
              {paymentMethod && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    {t.transactionId}
                  </Label>
                  <Input
                    placeholder={t.transactionPlaceholder}
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">{t.transactionHint}</p>
                </div>
              )}

              {/* Info Note */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800/50">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'bn' 
                    ? 'পেমেন্ট ভেরিফিকেশনের পর আপনার কোর্স অ্যাক্সেস অ্যাক্টিভেট করা হবে।'
                    : 'Course access will be activated after payment verification.'}
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !canSubmit}
                className="w-full h-14 text-base font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30 transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t.processing}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    {t.submitEnrollment}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 rounded-2xl p-5 border border-sky-200 dark:border-sky-800/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{t.free}</h3>
                    <p className="text-sm text-muted-foreground">{t.freeNote}</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-14 text-base font-bold rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 shadow-lg shadow-sky-500/30 transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t.processing}
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-5 h-5 mr-2" />
                    {t.enrollFree}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
