import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Mail, KeyRound, CheckCircle } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('সঠিক ইমেইল দিন');

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      toast.error('কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      console.error('Reset password error:', error);
      return;
    }

    setEmailSent(true);
    toast.success('পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে!');
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link 
            to="/student/login" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            লগইনে ফিরুন
          </Link>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-2xl">ইমেইল পাঠানো হয়েছে!</CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  আপনার ইমেইলে পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইনবক্স চেক করুন।
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                ইমেইল না পেলে স্প্যাম ফোল্ডার চেক করুন।
              </p>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setEmailSent(false)}
              >
                আবার পাঠান
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/student/login" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          লগইনে ফিরুন
        </Link>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">পাসওয়ার্ড ভুলে গেছেন?</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                আপনার ইমেইল দিন, আমরা পাসওয়ার্ড রিসেট লিংক পাঠাবো
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিংক পাঠান'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
