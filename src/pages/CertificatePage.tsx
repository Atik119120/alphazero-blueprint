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

    const issuedDate = new Date(certificate.issued_at);
    const formattedDate = issuedDate.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    // Create registration number with date components
    const year = issuedDate.getFullYear();
    const month = String(issuedDate.getMonth() + 1).padStart(2, '0');
    const day = String(issuedDate.getDate()).padStart(2, '0');
    const registrationNumber = `AZA-${year}${month}${day}-${certificate.certificate_id.replace('CERT-', '')}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${certificate.certificate_id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', 'Noto Sans Bengali', sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .certificate {
            width: 1000px;
            background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);
            border-radius: 20px;
            padding: 50px 60px;
            position: relative;
            box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.4);
          }
          
          .certificate::before {
            content: '';
            position: absolute;
            inset: 12px;
            border: 4px solid transparent;
            border-image: linear-gradient(135deg, #00d4ff, #7c3aed, #f97316, #00d4ff) 1;
            border-radius: 12px;
            pointer-events: none;
          }
          
          .certificate::after {
            content: '';
            position: absolute;
            inset: 20px;
            border: 1px solid rgba(124, 58, 237, 0.2);
            border-radius: 8px;
            pointer-events: none;
          }
          
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 200px;
            font-weight: 900;
            color: rgba(124, 58, 237, 0.03);
            pointer-events: none;
            white-space: nowrap;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .logo {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid transparent;
            background: linear-gradient(white, white) padding-box,
                        linear-gradient(135deg, #7c3aed, #00d4ff) border-box;
            box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
          }
          
          .academy-info {
            text-align: left;
          }
          
          .academy-name {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 1px;
          }
          
          .academy-tagline {
            font-size: 14px;
            color: #64748b;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-top: 2px;
          }
          
          .divider {
            width: 200px;
            height: 3px;
            background: linear-gradient(90deg, transparent, #7c3aed, #00d4ff, transparent);
            margin: 25px auto;
            border-radius: 2px;
          }
          
          .title {
            font-family: 'Playfair Display', serif;
            font-size: 52px;
            font-weight: 700;
            background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 5px;
            letter-spacing: 3px;
          }
          
          .subtitle {
            font-size: 16px;
            color: #7c3aed;
            letter-spacing: 6px;
            text-transform: uppercase;
            font-weight: 600;
          }
          
          .content {
            text-align: center;
            margin: 40px 0;
          }
          
          .presented-to {
            font-size: 14px;
            color: #94a3b8;
            margin-bottom: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          
          .student-name {
            font-family: 'Playfair Display', serif;
            font-size: 48px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 25px;
            position: relative;
            display: inline-block;
          }
          
          .student-name::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 180px;
            height: 4px;
            background: linear-gradient(90deg, #7c3aed, #00d4ff);
            border-radius: 2px;
          }
          
          .description {
            font-size: 17px;
            color: #475569;
            line-height: 2;
            max-width: 650px;
            margin: 0 auto;
          }
          
          .course-name {
            font-weight: 700;
            font-size: 20px;
            color: #7c3aed;
            display: block;
            margin: 10px 0;
            padding: 8px 20px;
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(0, 212, 255, 0.1));
            border-radius: 8px;
            display: inline-block;
          }
          
          .footer {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 30px;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px dashed rgba(124, 58, 237, 0.2);
          }
          
          .info-block {
            text-align: center;
            padding: 15px;
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(0, 212, 255, 0.05));
            border-radius: 12px;
          }
          
          .info-label {
            font-size: 11px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          
          .info-value {
            font-size: 14px;
            color: #1e293b;
            font-weight: 600;
          }
          
          .registration-number {
            font-family: monospace;
            font-size: 12px;
            background: linear-gradient(135deg, #7c3aed, #0ea5e9);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            text-align: center;
            margin-top: 25px;
            display: inline-block;
            letter-spacing: 1px;
          }
          
          .registration-section {
            text-align: center;
            margin-top: 30px;
          }
          
          .reg-label {
            font-size: 11px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          
          .seal {
            position: absolute;
            bottom: 80px;
            right: 60px;
            width: 100px;
            height: 100px;
            border: 3px solid #7c3aed;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(0, 212, 255, 0.1));
          }
          
          .seal-text {
            font-size: 10px;
            color: #7c3aed;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 1px;
          }
          
          .seal-check {
            font-size: 28px;
            color: #7c3aed;
          }
          
          .decorative {
            position: absolute;
            width: 200px;
            height: 200px;
            opacity: 0.08;
          }
          
          .decorative-tl {
            top: 0;
            left: 0;
            background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
          }
          
          .decorative-br {
            bottom: 0;
            right: 0;
            background: radial-gradient(circle, #00d4ff 0%, transparent 70%);
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
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
          <div class="watermark">AZ</div>
          
          <div class="header">
            <div class="logo-section">
              <img src="${window.location.origin}/logo.png" alt="AlphaZero Academy" class="logo" onerror="this.style.display='none'" />
              <div class="academy-info">
                <h2 class="academy-name">AlphaZero Academy</h2>
                <p class="academy-tagline">Excellence in Learning</p>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <h1 class="title">CERTIFICATE</h1>
            <p class="subtitle">of Completion</p>
          </div>
          
          <div class="content">
            <p class="presented-to">This is to certify that</p>
            <h2 class="student-name">${certificate.student_name}</h2>
            <p class="description">
              has successfully completed the course
              <span class="course-name">${certificate.course_name}</span>
              demonstrating exceptional dedication and commitment to learning excellence.
            </p>
          </div>
          
          <div class="footer">
            <div class="info-block">
              <p class="info-label">Issue Date</p>
              <p class="info-value">${formattedDate}</p>
              <p style="font-size: 11px; color: #94a3b8; margin-top: 4px;">${year}-${month}-${day}</p>
            </div>
            <div class="info-block">
              <p class="info-label">Certificate ID</p>
              <p class="info-value" style="font-family: monospace; font-size: 12px;">${certificate.certificate_id}</p>
            </div>
            <div class="info-block">
              <p class="info-label">Verification</p>
              <p class="info-value" style="color: #10b981;">✓ Verified & Authentic</p>
            </div>
          </div>
          
          <div class="registration-section">
            <p class="reg-label">Registration Number</p>
            <div class="registration-number">${registrationNumber}</div>
          </div>
          
          <div class="seal">
            <span class="seal-check">✓</span>
            <span class="seal-text">Verified</span>
          </div>
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
