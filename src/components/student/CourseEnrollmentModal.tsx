import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  GraduationCap,
  Loader2,
  Wallet
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
    processing: 'Processing...',
    success: 'Enrollment successful!',
    error: 'Failed to enroll.',
    alreadyRequested: 'Already enrolled in this course.',
    free: 'Free',
    courseFee: 'Course Fee',
    enrollFree: 'Enroll Now (Free)',
    freeNote: 'This is a free course. Click to enroll instantly.',
    payNow: 'Pay Now',
    redirecting: 'Redirecting...',
  },
  bn: {
    processing: 'প্রসেসিং...',
    success: 'এনরোলমেন্ট সফল হয়েছে!',
    error: 'এনরোল করতে ব্যর্থ।',
    alreadyRequested: 'ইতিমধ্যে এনরোল করা হয়েছে।',
    free: 'ফ্রি',
    courseFee: 'কোর্স ফি',
    enrollFree: 'এখনই এনরোল করুন (ফ্রি)',
    freeNote: 'এটি একটি ফ্রি কোর্স। এখনই এনরোল করুন।',
    payNow: 'এখনই পেমেন্ট করুন',
    redirecting: 'রিডাইরেক্ট হচ্ছে...',
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
  const [isRedirecting, setIsRedirecting] = useState(false);

  const t = translations[language];

  const handleUddoktaPayCheckout = async () => {
    if (!course) return;
    setIsRedirecting(true);
    try {
      const baseUrl = window.location.origin;
      
      const { data, error } = await supabase.functions.invoke('uddoktapay-checkout', {
        body: {
          full_name: userName,
          email: userEmail,
          amount: course.price,
          metadata: {
            course_id: course.id,
            user_id: userId,
            student_name: userName,
            student_email: userEmail,
            course_name: course.title,
          },
          redirect_url: `${baseUrl}/payment/callback?type=course`,
          success_url: `${baseUrl}/payment/callback?type=course`,
          fail_url: `${baseUrl}/payment/cancel`,
          cancel_url: `${baseUrl}/payment/cancel`,
        },
      });

      if (error || !data?.success || !data?.payment_url) {
        toast.error(language === 'bn' ? 'পেমেন্ট গেটওয়ে এরর' : 'Payment gateway error');
        setIsRedirecting(false);
        return;
      }

      // Redirect to UddoktaPay payment page
      window.location.href = data.payment_url;
    } catch (err) {
      console.error('UddoktaPay checkout error:', err);
      toast.error(language === 'bn' ? 'পেমেন্ট শুরু করতে ব্যর্থ' : 'Failed to start payment');
      setIsRedirecting(false);
    }
  };

  const handleFreeEnroll = async () => {
    if (!course) return;
    setIsSubmitting(true);

    try {
      // Check if already enrolled
      const { data: existingCourse } = await supabase
        .from('student_courses')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', course.id)
        .maybeSingle();

      if (existingCourse) {
        toast.error(t.alreadyRequested);
        setIsSubmitting(false);
        return;
      }

      // Directly assign course for free enrollment
      const { error } = await supabase.from('student_courses').insert({
        user_id: userId,
        course_id: course.id,
        is_active: true,
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

      // Send notification
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
      } catch {}

      toast.success(t.success);
      onSuccess();
      onClose();
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
          {isFree ? (
            /* Free course - direct enroll */
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 rounded-2xl p-5 border border-sky-200 dark:border-sky-800/50">
                <div className="flex items-center gap-4">
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
                onClick={handleFreeEnroll}
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
          ) : (
            /* Paid course - direct UddoktaPay checkout */
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-primary/10 border border-primary/30 text-center">
                <Wallet className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  {language === 'bn' ? 'অনলাইন পেমেন্ট' : 'Online Payment'}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {language === 'bn' 
                    ? 'UddoktaPay এর মাধ্যমে পেমেন্ট করুন'
                    : 'Pay via UddoktaPay'}
                </p>
                <p className="text-2xl font-bold text-primary">৳{coursePrice.toLocaleString()}</p>
              </div>
              
              <Button 
                onClick={handleUddoktaPayCheckout}
                disabled={isRedirecting}
                className="w-full h-14 text-base font-bold rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 transition-all duration-300"
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t.redirecting}
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5 mr-2" />
                    {t.payNow}
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
