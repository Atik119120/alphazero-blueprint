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
  Loader2,
  Ticket,
  CheckCircle,
  X,
  Wallet
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
    couponCode: 'Coupon Code',
    couponPlaceholder: 'Enter coupon code',
    applyCoupon: 'Apply',
    couponApplied: 'Coupon applied!',
    invalidCoupon: 'Invalid or expired coupon',
    discount: 'Discount',
    totalAfterDiscount: 'Total',
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
    couponCode: 'কুপন কোড',
    couponPlaceholder: 'কুপন কোড লিখুন',
    applyCoupon: 'অ্যাপ্লাই',
    couponApplied: 'কুপন প্রয়োগ হয়েছে!',
    invalidCoupon: 'ভুল বা মেয়াদ শেষ কুপন',
    discount: 'ছাড়',
    totalAfterDiscount: 'মোট',
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
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount_type: string;
    discount_value: number;
    id: string;
  } | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const t = translations[language];

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
    if (isOpen) {
      fetchNumbers();
      // Reset coupon when modal opens
      setCouponCode('');
      setAppliedCoupon(null);
    }
  }, [isOpen]);

  const applyCoupon = async () => {
    if (!couponCode.trim() || !course) return;
    
    setCheckingCoupon(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        toast.error(t.invalidCoupon);
        setCheckingCoupon(false);
        return;
      }

      // Check if expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast.error(t.invalidCoupon);
        setCheckingCoupon(false);
        return;
      }

      // Check max uses
      if (data.max_uses && data.used_count >= data.max_uses) {
        toast.error(t.invalidCoupon);
        setCheckingCoupon(false);
        return;
      }

      // Check course-specific coupon
      if (data.course_id && data.course_id !== course.id) {
        toast.error(t.invalidCoupon);
        setCheckingCoupon(false);
        return;
      }

      setAppliedCoupon({
        code: data.code,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        id: data.id,
      });
      toast.success(t.couponApplied);
    } catch {
      toast.error(t.invalidCoupon);
    }
    setCheckingCoupon(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const getDiscountedPrice = () => {
    const originalPrice = course?.price || 0;
    if (!appliedCoupon) return originalPrice;
    
    if (appliedCoupon.discount_type === 'percentage') {
      return Math.max(0, originalPrice - (originalPrice * appliedCoupon.discount_value / 100));
    }
    return Math.max(0, originalPrice - appliedCoupon.discount_value);
  };

  const getDiscountAmount = () => {
    const originalPrice = course?.price || 0;
    return originalPrice - getDiscountedPrice();
  };

  const handleUddoktaPayCheckout = async () => {
    if (!course) return;
    setIsRedirecting(true);
    try {
      const finalAmount = getDiscountedPrice();
      const baseUrl = window.location.origin;
      
      const { data, error } = await supabase.functions.invoke('uddoktapay-checkout', {
        body: {
          full_name: userName,
          email: userEmail,
          amount: finalAmount,
          metadata: {
            course_id: course.id,
            user_id: userId,
            student_name: userName,
            student_email: userEmail,
            course_name: course.title,
            coupon_code: appliedCoupon?.code || '',
          },
          redirect_url: `${baseUrl}/payment/callback?type=course`,
          cancel_url: `${baseUrl}/courses`,
        },
      });

      if (error || !data?.success || !data?.payment_url) {
        toast.error(language === 'bn' ? 'পেমেন্ট গেটওয়ে এরর' : 'Payment gateway error');
        setIsRedirecting(false);
        return;
      }

      // Increment coupon usage before redirect
      if (appliedCoupon) {
        const { data: couponData } = await supabase
          .from('coupons')
          .select('used_count')
          .eq('id', appliedCoupon.id)
          .single();
        if (couponData) {
          await supabase
            .from('coupons')
            .update({ used_count: (couponData.used_count || 0) + 1 })
            .eq('id', appliedCoupon.id);
        }
      }

      // Redirect to UddoktaPay payment page
      window.location.href = data.payment_url;
    } catch (err) {
      console.error('UddoktaPay checkout error:', err);
      toast.error(language === 'bn' ? 'পেমেন্ট শুরু করতে ব্যর্থ' : 'Failed to start payment');
      setIsRedirecting(false);
    }
  };

  const handleSubmit = async () => {
    if (!course) return;

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

      const isFree = !course.price || course.price === 0;
      const finalPrice = getDiscountedPrice();
      const effectivelyFree = isFree || finalPrice === 0;

      const { error } = await supabase.from('enrollment_requests').insert({
        user_id: userId,
        course_id: course.id,
        student_name: userName,
        student_email: userEmail,
        payment_method: effectivelyFree ? 'free' : paymentMethod,
        transaction_id: effectivelyFree ? (appliedCoupon ? `COUPON:${appliedCoupon.code}` : 'FREE') : transactionId,
        message: effectivelyFree 
          ? (appliedCoupon ? `Coupon ${appliedCoupon.code} applied - 100% discount` : 'Free Course Enrollment')
          : `${paymentMethod} - TxnID: ${transactionId} - Amount: ৳${finalPrice}${appliedCoupon ? ` (Coupon: ${appliedCoupon.code}, Discount: ৳${getDiscountAmount()})` : ''}`,
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

      // Increment coupon usage
      if (appliedCoupon) {
        const { data: couponData } = await supabase
          .from('coupons')
          .select('used_count')
          .eq('id', appliedCoupon.id)
          .single();
        
        if (couponData) {
          await supabase
            .from('coupons')
            .update({ used_count: (couponData.used_count || 0) + 1 })
            .eq('id', appliedCoupon.id);
        }
      }

      // Send Telegram notification
      try {
        await supabase.functions.invoke('student-enrollment-notify', {
          body: {
            studentName: userName,
            studentEmail: userEmail,
            courseName: course.title,
            coursePrice: finalPrice,
            paymentMethod: effectivelyFree ? 'free' : paymentMethod,
            transactionId: effectivelyFree ? (appliedCoupon ? `COUPON:${appliedCoupon.code}` : 'FREE') : transactionId,
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
      setCouponCode('');
      setAppliedCoupon(null);
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
  const finalPrice = getDiscountedPrice();
  const effectivelyFree = isFree || finalPrice === 0;
  const canSubmit = effectivelyFree || (paymentMethod && transactionId);

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
                {appliedCoupon && !isFree ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/40 line-through">৳{coursePrice.toLocaleString()}</span>
                    <Badge className="bg-emerald-500 text-white border-0 text-base px-3 py-0.5 font-bold">
                      {finalPrice === 0 ? t.free : `৳${finalPrice.toLocaleString()}`}
                    </Badge>
                  </div>
                ) : (
                  <Badge className="bg-emerald-500 text-white border-0 text-base px-3 py-0.5 font-bold">
                    {isFree ? t.free : `৳${coursePrice.toLocaleString()}`}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5 bg-white dark:bg-slate-900">
          {/* Coupon Section - only show for paid courses */}
          {!isFree && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Ticket className="w-4 h-4 text-primary" />
                {t.couponCode}
              </Label>
              {appliedCoupon ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {appliedCoupon.code}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appliedCoupon.discount_type === 'percentage' 
                        ? `${appliedCoupon.discount_value}% ${t.discount}`
                        : `৳${appliedCoupon.discount_value} ${t.discount}`
                      }
                      {' · '}{t.totalAfterDiscount}: ৳{finalPrice.toLocaleString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={removeCoupon}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder={t.couponPlaceholder}
                    className="h-11 font-mono"
                  />
                  <Button 
                    variant="outline" 
                    className="shrink-0 h-11"
                    onClick={applyCoupon}
                    disabled={checkingCoupon || !couponCode.trim()}
                  >
                    {checkingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : t.applyCoupon}
                  </Button>
                </div>
              )}
            </div>
          )}

          {!effectivelyFree ? (
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
                    <SelectItem value="uddoktapay">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-primary" />
                        অনলাইন পেমেন্ট (UddoktaPay)
                      </div>
                    </SelectItem>
                    <SelectItem value="bkash">
                      <div className="flex items-center gap-2">
                        <img src={bkashLogo} alt="bKash" className="w-5 h-5 object-contain" />
                        বিকাশ (bKash) - ম্যানুয়াল
                      </div>
                    </SelectItem>
                    <SelectItem value="nagad">
                      <div className="flex items-center gap-2">
                        <img src={nagadLogo} alt="Nagad" className="w-5 h-5 object-contain" />
                        নগদ (Nagad) - ম্যানুয়াল
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* UddoktaPay Online Payment */}
              {paymentMethod === 'uddoktapay' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
                    <Wallet className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      {language === 'bn' ? 'অনলাইন পেমেন্ট' : 'Online Payment'}
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      {language === 'bn' 
                        ? 'বিকাশ, নগদ, রকেট ও অন্যান্য মাধ্যমে পেমেন্ট করুন'
                        : 'Pay via bKash, Nagad, Rocket & more'}
                    </p>
                    <p className="text-lg font-bold text-primary">৳{finalPrice.toLocaleString()}</p>
                  </div>
                  <Button 
                    onClick={handleUddoktaPayCheckout}
                    disabled={isRedirecting}
                    className="w-full h-14 text-base font-bold rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 transition-all duration-300"
                  >
                    {isRedirecting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {language === 'bn' ? 'রিডাইরেক্ট হচ্ছে...' : 'Redirecting...'}
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5 mr-2" />
                        {language === 'bn' ? 'এখনই পেমেন্ট করুন' : 'Pay Now'}
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Manual Payment Instructions (bKash/Nagad) */}
              {paymentMethod && paymentMethod !== 'uddoktapay' && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">
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
                    {language === 'bn' ? `পাঠাতে হবে: ৳${finalPrice.toLocaleString()}` : `Amount: ৳${finalPrice.toLocaleString()}`}
                  </p>
                </div>
              )}

              {/* Transaction ID - only for manual methods */}
              {paymentMethod && paymentMethod !== 'uddoktapay' && (
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

              {/* Submit Button - only for manual methods */}
              {paymentMethod !== 'uddoktapay' && (
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
              {appliedCoupon && !isFree && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800/50 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h3 className="font-bold text-lg text-foreground">১০০% ডিসকাউন্ট!</h3>
                  <p className="text-sm text-muted-foreground">কুপন কোড দিয়ে ফ্রিতে এনরোল করুন</p>
                </div>
              )}
              
              {isFree && !appliedCoupon && (
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
              )}

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
