import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  GraduationCap,
  Info,
  CreditCard,
  Loader2
} from 'lucide-react';
import { Course } from '@/types/lms';

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
    payNow: 'Pay with UddoktaPay',
    processing: 'Processing...',
    success: 'Request sent! Redirecting to payment...',
    error: 'Failed to initiate payment.',
    alreadyRequested: 'Already requested this course.',
    noteOnline: 'After successful payment, course access will be activated automatically.',
    free: 'Free',
    courseFee: 'Course Fee',
    redirecting: 'Redirecting to payment...',
    securePayment: 'Secure online payment via UddoktaPay',
    paymentInfo: 'You will be redirected to UddoktaPay to complete your payment securely.',
    enrollFree: 'Enroll Now (Free)',
    freeNote: 'This is a free course. Click to enroll instantly.',
  },
  bn: {
    payNow: 'উদ্যোক্তা পে দিয়ে পেমেন্ট করুন',
    processing: 'প্রসেসিং...',
    success: 'রিকুয়েস্ট পাঠানো হয়েছে! পেমেন্টে যাচ্ছে...',
    error: 'পেমেন্ট শুরু করতে ব্যর্থ।',
    alreadyRequested: 'ইতিমধ্যে রিকুয়েস্ট করা হয়েছে।',
    noteOnline: 'সফল পেমেন্টের পর স্বয়ংক্রিয়ভাবে কোর্স অ্যাক্সেস পাবেন।',
    free: 'ফ্রি',
    courseFee: 'কোর্স ফি',
    redirecting: 'পেমেন্ট পেজে যাচ্ছে...',
    securePayment: 'উদ্যোক্তা পে দিয়ে নিরাপদ অনলাইন পেমেন্ট',
    paymentInfo: 'নিরাপদে পেমেন্ট সম্পন্ন করতে আপনাকে উদ্যোক্তা পে তে রিডাইরেক্ট করা হবে।',
    enrollFree: 'এখনই এনরোল করুন (ফ্রি)',
    freeNote: 'এটি একটি ফ্রি কোর্স। এখনই এনরোল করুন।',
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

  const t = translations[language];

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

  const handleFreeEnrollment = async () => {
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

      // Create enrollment request for free course
      const { error } = await supabase.from('enrollment_requests').insert({
        user_id: userId,
        course_id: course.id,
        student_name: userName,
        student_email: userEmail,
        payment_method: 'free',
        transaction_id: 'FREE',
        message: `Free Course Enrollment`,
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
            coursePrice: 0,
            paymentMethod: 'free',
            transactionId: 'FREE',
          }
        });
      } catch (notifyError) {
        console.error('Failed to send notification:', notifyError);
      }

      toast.success(t.success);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Free enrollment error:', err);
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
            <>
              {/* UddoktaPay Payment Section */}
              <div className="space-y-4">
                {/* Payment Icon & Info */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <CreditCard className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{t.securePayment}</h3>
                      <p className="text-sm text-muted-foreground">{t.paymentInfo}</p>
                    </div>
                  </div>
                  
                  {/* Info Note */}
                  <div className="flex items-start gap-2 p-3 bg-white/60 dark:bg-slate-900/60 rounded-xl">
                    <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t.noteOnline}
                    </p>
                  </div>
                </div>

                {/* Pay Button */}
                <Button 
                  onClick={handleUddoktaPayCheckout}
                  disabled={isSubmitting}
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
                      {t.payNow}
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Free Course Section */}
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

                {/* Enroll Button */}
                <Button 
                  onClick={handleFreeEnrollment}
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
