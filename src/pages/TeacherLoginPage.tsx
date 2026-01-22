import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { Moon, Sun, Globe, GraduationCap, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const translations = {
  en: {
    title: 'Teacher Login',
    subtitle: 'Access your teaching dashboard',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    loggingIn: 'Logging in...',
    forgotPassword: 'Forgot password?',
    notTeacher: 'Not a teacher?',
    studentLogin: 'Student Login',
    applyTeacher: 'Apply as Teacher',
    backToHome: 'Back to Home',
    invalidCredentials: 'Invalid email or password',
    notApproved: 'Your teacher account is pending approval',
    notTeacherRole: 'This account does not have teacher access',
    success: 'Login successful!',
  },
  bn: {
    title: 'টিচার লগইন',
    subtitle: 'আপনার টিচিং ড্যাশবোর্ডে প্রবেশ করুন',
    email: 'ইমেইল',
    password: 'পাসওয়ার্ড',
    login: 'লগইন',
    loggingIn: 'লগইন হচ্ছে...',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    notTeacher: 'টিচার নন?',
    studentLogin: 'স্টুডেন্ট লগইন',
    applyTeacher: 'টিচার হিসেবে আবেদন করুন',
    backToHome: 'হোমে ফিরে যান',
    invalidCredentials: 'ভুল ইমেইল বা পাসওয়ার্ড',
    notApproved: 'আপনার টিচার অ্যাকাউন্ট অনুমোদনের অপেক্ষায় আছে',
    notTeacherRole: 'এই অ্যাকাউন্টে টিচার এক্সেস নেই',
    success: 'সফলভাবে লগইন হয়েছে!',
  },
};

export default function TeacherLoginPage() {
  const { user, role, isLoading, signIn, profile } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user && role === 'teacher') {
      if ((profile as any)?.teacher_approved) {
        navigate('/teacher');
      }
    }
  }, [user, role, isLoading, profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(t.invalidCredentials);
        setIsSubmitting(false);
        return;
      }

      // Check will happen in useEffect after auth state updates
      toast.success(t.success);
    } catch (err) {
      toast.error(t.invalidCredentials);
      setIsSubmitting(false);
    }
  };

  // Check teacher status after login
  useEffect(() => {
    if (!isLoading && user && isSubmitting) {
      if (role !== 'teacher') {
        toast.error(t.notTeacherRole);
        setIsSubmitting(false);
        return;
      }
      
      if (!(profile as any)?.teacher_approved) {
        toast.error(t.notApproved);
        setIsSubmitting(false);
        return;
      }
      
      navigate('/teacher');
    }
  }, [user, role, isLoading, profile, isSubmitting, navigate, t]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
          className="rounded-full"
        >
          <Globe className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                {t.forgotPassword}
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t.loggingIn : t.login}
            </Button>
          </form>

          <div className="mt-6 space-y-3 text-center text-sm">
            <p className="text-muted-foreground">
              {t.notTeacher}{' '}
              <Link to="/student/login" className="text-primary hover:underline">
                {t.studentLogin}
              </Link>
            </p>
            <p className="text-muted-foreground">
              <Link to="/student/login?tab=teacher" className="text-primary hover:underline">
                {t.applyTeacher}
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              {t.backToHome}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
