import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { GraduationCap, ArrowLeft, Mail, Lock, User, Sun, Moon, Globe, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
import { z } from 'zod';

export default function StudentLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  
  // OTP States
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const { user, role, isLoading: authLoading, signIn, signUp } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const loginSchema = z.object({
    email: z.string().email(t('login.invalidEmail')),
    password: z.string().min(6, t('login.passwordMin')),
  });

  const signupSchema = z.object({
    fullName: z.string().min(2, t('login.nameMin')),
    email: z.string().email(t('login.invalidEmail')),
    password: z.string().min(6, t('login.passwordMin')),
  });

  // OTP timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && role) {
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'student') {
        navigate('/student', { replace: true });
      }
    }
  }, [user, role, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error(t('login.invalidCredentials'));
      } else {
        toast.error(error.message);
      }
      return;
    }

    toast.success(t('login.loginSuccess'));
  };

  const sendOtp = async () => {
    const validation = signupSchema.safeParse({ 
      fullName: signupName, 
      email: signupEmail, 
      password: signupPassword 
    });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setSendingOtp(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email: signupEmail, name: signupName }
      });

      if (error) throw error;

      if (data?.otp) {
        setGeneratedOtp(data.otp);
        setShowOtpVerification(true);
        setOtpTimer(120); // 2 minutes
        setOtp(['', '', '', '', '', '']);
        toast.success('✉️ ভেরিফিকেশন কোড আপনার ইমেইলে পাঠানো হয়েছে');
        
        // Focus first OTP input
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        throw new Error('Failed to generate OTP');
      }
    } catch (error: any) {
      console.error('OTP send error:', error);
      toast.error(error.message || 'OTP পাঠাতে সমস্যা হয়েছে');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Focus the next empty input or last input
    const nextEmptyIndex = newOtp.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    otpInputRefs.current[focusIndex]?.focus();
  };

  const verifyOtpAndSignup = async () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 6) {
      toast.error('সম্পূর্ণ ৬ সংখ্যার কোড দিন');
      return;
    }

    if (enteredOtp !== generatedOtp) {
      toast.error('ভুল কোড! আবার চেষ্টা করুন');
      setOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
      return;
    }

    if (otpTimer === 0) {
      toast.error('কোডের মেয়াদ শেষ। নতুন কোড নিন');
      return;
    }

    // OTP verified, proceed with signup
    setIsLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupName);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('User already registered')) {
        toast.error(t('login.userExists'));
      } else {
        toast.error(error.message);
      }
      return;
    }

    setShowOtpVerification(false);
    toast.success('🎉 ' + t('login.accountCreated'));
  };

  const resendOtp = async () => {
    if (otpTimer > 90) { // Can resend after 30 seconds (120 - 30 = 90)
      toast.error('৩০ সেকেন্ড পর আবার চেষ্টা করুন');
      return;
    }
    await sendOtp();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Top Bar with Navigation and Controls */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">{t('login.backHome')}</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="gap-1 h-9"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'বাং' : 'EN'}
            </Button>
          </div>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-4">
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              {showOtpVerification ? (
                <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              ) : (
                <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              )}
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl gradient-text">
                {showOtpVerification ? 'ইমেইল ভেরিফিকেশন' : t('login.studentPortal')}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2 text-sm">
                {showOtpVerification 
                  ? `${signupEmail} এ পাঠানো ৬ সংখ্যার কোড দিন`
                  : t('login.startJourney')}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            {showOtpVerification ? (
              /* OTP Verification UI */
              <div className="space-y-6">
                {/* OTP Input */}
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-11 h-14 text-center text-xl font-bold rounded-xl border-2 focus:border-primary transition-colors"
                    />
                  ))}
                </div>

                {/* Timer */}
                <div className="text-center">
                  {otpTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      কোডের মেয়াদ: <span className="font-mono font-bold text-primary">{formatTime(otpTimer)}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-destructive font-medium">কোডের মেয়াদ শেষ</p>
                  )}
                </div>

                {/* Verify Button */}
                <Button 
                  onClick={verifyOtpAndSignup} 
                  className="w-full h-11 gap-2"
                  disabled={isLoading || otp.join('').length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      যাচাই হচ্ছে...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      ভেরিফাই করুন
                    </>
                  )}
                </Button>

                {/* Resend & Back */}
                <div className="flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowOtpVerification(false)}
                    className="gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    ফিরে যান
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={resendOtp}
                    disabled={sendingOtp || otpTimer > 90}
                    className="gap-1"
                  >
                    {sendingOtp ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    পুনরায় কোড পাঠান
                  </Button>
                </div>
              </div>
            ) : (
              /* Login/Signup Tabs */
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="text-sm">{t('login.login')}</TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm">{t('login.signup')}</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm">{t('login.email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm">{t('login.password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? t('login.loggingIn') : t('login.login')}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-sm">{t('login.fullName')}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder={t('login.namePlaceholder')}
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm">{t('login.email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm">{t('login.password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="button" 
                      className="w-full h-11 gap-2" 
                      disabled={sendingOtp}
                      onClick={sendOtp}
                    >
                      {sendingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          কোড পাঠানো হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          ইমেইল ভেরিফাই করুন
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>

          {!showOtpVerification && (
            <CardFooter className="text-center text-xs sm:text-sm text-muted-foreground px-4 sm:px-6">
              <p className="w-full">
                {t('login.autoPassCode')}
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
