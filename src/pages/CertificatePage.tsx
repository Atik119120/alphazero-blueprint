import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Award, Download, CheckCircle, ArrowLeft, Calendar, BookOpen } from 'lucide-react';
import { Certificate } from '@/types/lms';

// Public certificate data (from Edge Function - no student_name for privacy)
interface PublicCertificateData {
  certificate_id: string;
  course_name: string;
  issued_at: string;
  is_valid: boolean;
}

export default function CertificatePage() {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [publicCertData, setPublicCertData] = useState<PublicCertificateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCertificate();
  }, [certificateId, user]);

  const fetchCertificate = async () => {
    if (!certificateId) return;

    setIsLoading(true);

    // If user is logged in, try to fetch their own certificate with full details
    if (user) {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('certificate_id', certificateId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setCertificate(data as Certificate);
        setIsVerified(true);
        setIsLoading(false);
        return;
      }
    }

    // For public verification (or if user doesn't own this certificate),
    // use the secure Edge Function that only returns public data
    try {
      const { data, error } = await supabase.functions.invoke('verify-certificate', {
        body: { certificate_id: certificateId }
      });

      if (error) {
        console.error('Verification error:', error);
        toast.error('সার্টিফিকেট যাচাই করতে সমস্যা');
      } else if (data && data.is_valid) {
        setPublicCertData(data as PublicCertificateData);
        setIsVerified(true);
      }
    } catch (err) {
      console.error('Edge function error:', err);
      toast.error('সার্টিফিকেট লোড করতে সমস্যা');
    }

    setIsLoading(false);
  };

  const downloadCertificate = () => {
    // Only allow download if user owns the certificate
    if (!certificate) {
      toast.error('সার্টিফিকেট ডাউনলোড করতে লগইন করুন');
      return;
    }

    // Create printable certificate
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('পপ-আপ ব্লক করা আছে');
      return;
    }

    const formattedDate = new Date(certificate.issued_at).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${certificate.certificate_id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .certificate {
            width: 900px;
            background: #fff;
            border-radius: 20px;
            padding: 60px;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          
          .certificate::before {
            content: '';
            position: absolute;
            inset: 10px;
            border: 3px solid;
            border-image: linear-gradient(135deg, #667eea, #764ba2, #f093fb) 1;
            border-radius: 15px;
            pointer-events: none;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          
          .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
          }
          
          .logo svg {
            width: 40px;
            height: 40px;
            color: white;
          }
          
          .title {
            font-family: 'Playfair Display', serif;
            font-size: 48px;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
          }
          
          .subtitle {
            font-size: 18px;
            color: #6b7280;
            letter-spacing: 4px;
            text-transform: uppercase;
          }
          
          .content {
            text-align: center;
            margin: 50px 0;
          }
          
          .presented-to {
            font-size: 16px;
            color: #9ca3af;
            margin-bottom: 15px;
          }
          
          .student-name {
            font-family: 'Playfair Display', serif;
            font-size: 42px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 30px;
            position: relative;
            display: inline-block;
          }
          
          .student-name::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 3px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px;
          }
          
          .description {
            font-size: 18px;
            color: #4b5563;
            line-height: 1.8;
            max-width: 600px;
            margin: 0 auto;
          }
          
          .course-name {
            font-weight: 600;
            color: #667eea;
          }
          
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 60px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
          }
          
          .info-block {
            text-align: center;
          }
          
          .info-label {
            font-size: 12px;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 5px;
          }
          
          .info-value {
            font-size: 14px;
            color: #374151;
            font-weight: 500;
          }
          
          .certificate-id {
            font-family: monospace;
            font-size: 12px;
            color: #9ca3af;
            text-align: center;
            margin-top: 30px;
          }
          
          .decorative {
            position: absolute;
            width: 150px;
            height: 150px;
            opacity: 0.1;
          }
          
          .decorative-tl {
            top: 20px;
            left: 20px;
            background: linear-gradient(135deg, #667eea 0%, transparent 70%);
            border-radius: 50%;
          }
          
          .decorative-br {
            bottom: 20px;
            right: 20px;
            background: linear-gradient(315deg, #764ba2 0%, transparent 70%);
            border-radius: 50%;
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .certificate {
              box-shadow: none;
              width: 100%;
              max-width: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="decorative decorative-tl"></div>
          <div class="decorative decorative-br"></div>
          
          <div class="header">
            <div class="logo">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h1 class="title">Certificate</h1>
            <p class="subtitle">of Completion</p>
          </div>
          
          <div class="content">
            <p class="presented-to">This is to certify that</p>
            <h2 class="student-name">${certificate.student_name}</h2>
            <p class="description">
              has successfully completed the course<br/>
              <span class="course-name">"${certificate.course_name}"</span><br/>
              demonstrating dedication and commitment to learning.
            </p>
          </div>
          
          <div class="footer">
            <div class="info-block">
              <p class="info-label">Date</p>
              <p class="info-value">${formattedDate}</p>
            </div>
            <div class="info-block">
              <p class="info-label">Verified</p>
              <p class="info-value">✓ Authentic</p>
            </div>
          </div>
          
          <p class="certificate-id">Certificate ID: ${certificate.certificate_id}</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Determine what data to display
  const displayData = certificate || publicCertData;
  const canDownload = !!certificate; // Only if user owns it
  const studentName = certificate?.student_name;

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Link 
          to={user ? '/student' : '/'} 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          ফিরে যান
        </Link>

        {displayData ? (
          <div className="max-w-2xl mx-auto">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
              {/* Decorative header */}
              <div className="h-32 bg-gradient-to-r from-primary via-accent to-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>

              <CardHeader className="text-center pt-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <Badge variant="default" className="gap-1">
                    যাচাইকৃত সার্টিফিকেট
                  </Badge>
                </div>
                <CardTitle className="text-3xl gradient-text">
                  সার্টিফিকেট অফ কমপ্লিশন
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-8 pb-8">
                {/* Only show student name if user owns the certificate */}
                {studentName && (
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground">এই সার্টিফিকেট প্রদান করা হলো</p>
                    <h2 className="text-2xl font-bold">{studentName}</h2>
                  </div>
                )}

                {/* For public verification, show a privacy-respecting message */}
                {!studentName && (
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground">এই সার্টিফিকেট বৈধ এবং যাচাইকৃত</p>
                  </div>
                )}

                <div className={`grid gap-4 ${studentName ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <BookOpen className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">কোর্স</p>
                    <p className="font-medium text-sm">{displayData.course_name}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">তারিখ</p>
                    <p className="font-medium text-sm">
                      {new Date(displayData.issued_at).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                  {studentName && (
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <Award className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Certificate ID</p>
                      <p className="font-medium text-xs font-mono">{displayData.certificate_id}</p>
                    </div>
                  )}
                </div>

                {canDownload ? (
                  <Button onClick={downloadCertificate} className="w-full gap-2">
                    <Download className="w-4 h-4" />
                    সার্টিফিকেট ডাউনলোড করুন
                  </Button>
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    <p>সার্টিফিকেট ডাউনলোড করতে নিজের অ্যাকাউন্টে লগইন করুন</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-md mx-auto border-dashed">
            <CardContent className="py-12 text-center">
              <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">সার্টিফিকেট পাওয়া যায়নি</p>
              <p className="text-sm text-muted-foreground mt-2">
                Certificate ID সঠিক কিনা দেখুন
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
