import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Key, ArrowRight, CheckCircle, LogOut } from 'lucide-react';
import { z } from 'zod';

const passCodeSchema = z.string().min(6, 'Pass Code কমপক্ষে ৬ অক্ষরের হতে হবে').max(20, 'Pass Code সর্বোচ্চ ২০ অক্ষরের হতে পারে');

export default function PassCodePage() {
  const [passCode, setPassCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasValidPassCode, setHasValidPassCode] = useState(false);
  
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/student/login');
      return;
    }

    // Check if user already has a valid pass code
    checkExistingPassCode();
  }, [user, profile]);

  const checkExistingPassCode = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('pass_codes')
      .select('*')
      .eq('student_id', profile.id)
      .eq('is_active', true)
      .maybeSingle();

    if (!error && data) {
      setHasValidPassCode(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = passCodeSchema.safeParse(passCode);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    if (!profile) {
      toast.error('প্রোফাইল লোড হয়নি');
      return;
    }

    setIsLoading(true);

    try {
      // Check if pass code exists and is active
      const { data: passCodeData, error: checkError } = await supabase
        .from('pass_codes')
        .select('*')
        .eq('code', passCode.toUpperCase().trim())
        .eq('is_active', true)
        .maybeSingle();

      if (checkError || !passCodeData) {
        toast.error('Pass Code ভুল বা নিষ্ক্রিয়');
        setIsLoading(false);
        return;
      }

      // Check if pass code is already linked to another student
      if (passCodeData.student_id && passCodeData.student_id !== profile.id) {
        toast.error('এই Pass Code ইতিমধ্যে অন্য কেউ ব্যবহার করছে');
        setIsLoading(false);
        return;
      }

      // Link pass code to this student
      const { error: updateError } = await supabase
        .from('pass_codes')
        .update({ student_id: profile.id })
        .eq('id', passCodeData.id);

      if (updateError) {
        toast.error('Pass Code লিংক করতে সমস্যা হয়েছে');
        setIsLoading(false);
        return;
      }

      toast.success('Pass Code সফলভাবে যুক্ত হয়েছে!');
      await refreshProfile();
      navigate('/student');
    } catch (error) {
      toast.error('কিছু ভুল হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/student');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Key className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl gradient-text">Pass Code</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                {hasValidPassCode 
                  ? 'আপনার Pass Code সক্রিয় আছে' 
                  : 'কোর্স অ্যাক্সেস করতে আপনার Pass Code দিন'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {hasValidPassCode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 p-4 bg-primary/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Pass Code সক্রিয়</span>
                </div>
                
                <Button onClick={handleContinue} className="w-full gap-2">
                  কোর্সে যান
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passCode">Pass Code</Label>
                  <Input
                    id="passCode"
                    type="text"
                    placeholder="আপনার Pass Code"
                    value={passCode}
                    onChange={(e) => setPassCode(e.target.value.toUpperCase())}
                    className="text-center text-lg tracking-wider font-mono"
                    maxLength={20}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Admin থেকে প্রাপ্ত Pass Code দিন
                  </p>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? 'যাচাই হচ্ছে...' : 'যাচাই করুন'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}

            <div className="pt-4 border-t border-border">
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                className="w-full gap-2 text-muted-foreground"
              >
                <LogOut className="w-4 h-4" />
                লগ আউট
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
