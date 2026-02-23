import { useState, useEffect, useRef } from 'react';
import { lovable } from '@/integrations/lovable/index';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { GraduationCap, ArrowLeft, Mail, Lock, User, Sun, Moon, Globe, ShieldCheck, Loader2, RefreshCw, Phone, Users } from 'lucide-react';
import { z } from 'zod';
import { useTeamMembers } from '@/hooks/useTeamMembers';

export default function StudentLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  
  // Teacher Signup States
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [teacherSignupMode, setTeacherSignupMode] = useState<'select' | 'otp'>('select');
  
  // OTP States
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isTeacherOtp, setIsTeacherOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Team members for teacher signup
  const { data: teamMembers, isLoading: teamMembersLoading } = useTeamMembers();
  
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
    phone: z.string().min(11, 'সঠিক মোবাইল নম্বর দিন').max(14, 'সঠিক মোবাইল নম্বর দিন'),
  });

  const teacherSignupSchema = z.object({
    fullName: z.string().min(2, t('login.nameMin')),
    email: z.string().email(t('login.invalidEmail')),
    password: z.string().min(6, t('login.passwordMin')),
    phone: z.string().min(11, 'সঠিক মোবাইল নম্বর দিন').max(14, 'সঠিক মোবাইল নম্বর দিন'),
    teamMemberId: z.string().min(1, 'Team member সিলেক্ট করুন'),
  });

  // OTP timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Redirect if already logged in - wait for both user AND role to be loaded
  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) return;
    
    // Only redirect if we have both user AND role confirmed
    if (user && role) {
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'teacher') {
        navigate('/teacher', { replace: true });
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

  const sendOtp = async (forTeacher = false) => {
    if (forTeacher) {
      const validation = teacherSignupSchema.safeParse({ 
        fullName: teacherName, 
        email: teacherEmail, 
        password: teacherPassword,
        phone: teacherPhone,
        teamMemberId: selectedTeamMember
      });
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
      }
    } else {
      const validation = signupSchema.safeParse({ 
        fullName: signupName, 
        email: signupEmail, 
        password: signupPassword,
        phone: signupPhone
      });
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
      }
    }

    const emailToUse = forTeacher ? teacherEmail : signupEmail;
    const nameToUse = forTeacher ? teacherName : signupName;

    setSendingOtp(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email: emailToUse, name: nameToUse }
      });

      if (error) throw error;

      if (data?.otp) {
        setGeneratedOtp(data.otp);
        setShowOtpVerification(true);
        setIsTeacherOtp(forTeacher);
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

    setIsLoading(true);

    if (isTeacherOtp) {
      // Teacher signup flow
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: teacherEmail,
          password: teacherPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: teacherName,
            },
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create profile with is_teacher = true and linked_team_member_id
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: authData.user.id,
              full_name: teacherName,
              email: teacherEmail,
              phone_number: teacherPhone,
              is_teacher: true,
              teacher_approved: false,
              linked_team_member_id: selectedTeamMember,
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          // Assign student role initially (will be upgraded to teacher after approval)
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authData.user.id,
              role: 'student',
            });

          if (roleError) {
            console.error('Role assignment error:', roleError);
          }

          setShowOtpVerification(false);
          setIsTeacherOtp(false);
          toast.success('🎓 Teacher আবেদন সফল! Admin approval এর পর আপনি Teacher হিসেবে login করতে পারবেন।');
        }
      } catch (error: any) {
        if (error.message.includes('User already registered')) {
          toast.error(t('login.userExists'));
        } else {
          toast.error(error.message);
        }
      }
    } else {
      // Regular student signup
      const { error } = await signUp(signupEmail, signupPassword, signupName, signupPhone);

      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error(t('login.userExists'));
        } else {
          toast.error(error.message);
        }
        setIsLoading(false);
        return;
      }

      setShowOtpVerification(false);
      toast.success('🎉 ' + t('login.accountCreated'));
    }

    setIsLoading(false);
  };

  const resendOtp = async () => {
    if (otpTimer > 90) { // Can resend after 30 seconds (120 - 30 = 90)
      toast.error('৩০ সেকেন্ড পর আবার চেষ্টা করুন');
      return;
    }
    await sendOtp(isTeacherOtp);
  };

  const handleStudentOtp = () => sendOtp(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast.error(error.message || 'Google লগইনে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      toast.error(err.message || 'Google লগইনে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };
  const handleTeacherOtp = () => sendOtp(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // No loading screen - login page loads directly

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Colorful artistic background */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-rose-400/15 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[80px]" />
        <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-violet-400/10 rounded-full blur-[90px]" />
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
              /* Login/Signup/Teacher Tabs */
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

                    <div className="flex justify-end">
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-primary hover:underline"
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </Link>
                    </div>

                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? t('login.loggingIn') : t('login.login')}
                    </Button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">অথবা</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 gap-2"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google দিয়ে লগইন
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
                      <Label htmlFor="signup-phone" className="text-sm">মোবাইল নম্বর</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="01XXXXXXXXX"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
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
                      onClick={handleStudentOtp}
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

                {/* Teacher info removed - teachers use /teacher/login */}
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
