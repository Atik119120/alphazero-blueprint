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
    
    // Format date in English
    const formattedDate = issuedDate.toLocaleDateString('en-US', {
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
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Raleway:wght@300;400;500&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          @page {
            size: A4 landscape;
            margin: 0;
          }
          
          body {
            font-family: 'Raleway', sans-serif;
            background: #1a1a1a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .certificate {
            width: 1100px;
            height: 780px;
            background: #fff;
            position: relative;
            box-shadow: 0 30px 60px rgba(0,0,0,0.3);
          }
          
          /* Simple elegant border */
          .border {
            position: absolute;
            inset: 20px;
            border: 2px solid #2c2c2c;
          }
          
          .border-inner {
            position: absolute;
            inset: 28px;
            border: 1px solid #d4af37;
          }
          
          .content {
            position: absolute;
            inset: 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 40px 80px;
          }
          
          /* Logo - Full display, no cropping */
          .logo {
            width: 120px;
            height: auto;
            max-height: 120px;
            object-fit: contain;
          }
          
          .header {
            text-align: center;
          }
          
          .academy-name {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 600;
            color: #2c2c2c;
            letter-spacing: 8px;
            text-transform: uppercase;
            margin-top: 15px;
          }
          
          /* Minimal divider */
          .divider {
            width: 60px;
            height: 1px;
            background: #d4af37;
            margin: 25px 0;
          }
          
          /* Certificate Title */
          .title {
            font-family: 'Playfair Display', serif;
            font-size: 48px;
            font-weight: 400;
            color: #2c2c2c;
            letter-spacing: 15px;
            text-transform: uppercase;
          }
          
          .subtitle {
            font-family: 'Lora', serif;
            font-size: 14px;
            color: #666;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-top: 8px;
          }
          
          /* Main Content */
          .main-content {
            text-align: center;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 20px 0;
          }
          
          .presented-text {
            font-family: 'Lora', serif;
            font-size: 13px;
            color: #888;
            letter-spacing: 3px;
            text-transform: uppercase;
          }
          
          .student-name {
            font-family: 'Playfair Display', serif;
            font-size: 44px;
            font-weight: 500;
            color: #2c2c2c;
            margin: 15px 0;
            font-style: italic;
          }
          
          .completion-text {
            font-family: 'Raleway', sans-serif;
            font-size: 13px;
            color: #666;
            letter-spacing: 1px;
            margin-top: 10px;
          }
          
          .course-name {
            font-family: 'Playfair Display', serif;
            font-size: 26px;
            font-weight: 600;
            color: #d4af37;
            margin-top: 15px;
            letter-spacing: 2px;
          }
          
          /* Footer */
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
            padding-top: 30px;
            border-top: 1px solid #eee;
          }
          
          .footer-item {
            text-align: center;
            min-width: 200px;
          }
          
          .footer-label {
            font-size: 9px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          
          .footer-value {
            font-family: 'Raleway', sans-serif;
            font-size: 12px;
            color: #2c2c2c;
            font-weight: 500;
          }
          
          .signature-line {
            width: 150px;
            height: 1px;
            background: #2c2c2c;
            margin: 0 auto 10px;
          }
          
          .cert-id {
            font-family: monospace;
            font-size: 10px;
            color: #999;
            letter-spacing: 1px;
          }
          
          .reg-number {
            font-family: monospace;
            font-size: 9px;
            color: #d4af37;
            margin-top: 5px;
            padding: 4px 12px;
            border: 1px solid #d4af37;
            display: inline-block;
          }
          
          /* Verified badge - minimal */
          .verified {
            position: absolute;
            bottom: 40px;
            right: 50px;
            text-align: center;
          }
          
          .verified-circle {
            width: 70px;
            height: 70px;
            border: 2px solid #d4af37;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          
          .verified-icon {
            font-size: 20px;
            color: #d4af37;
          }
          
          .verified-text {
            font-size: 7px;
            color: #d4af37;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 2px;
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
              height: 100vh;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="border"></div>
          <div class="border-inner"></div>
          
          <div class="content">
            <!-- Header with Logo -->
            <div class="header">
              <img src="${window.location.origin}/logo.png" alt="AlphaZero Academy" class="logo" onerror="this.style.display='none'" />
              <h2 class="academy-name">AlphaZero Academy</h2>
            </div>
            
            <div class="divider"></div>
            
            <!-- Title -->
            <h1 class="title">Certificate</h1>
            <p class="subtitle">of Completion</p>
            
            <!-- Main Content -->
            <div class="main-content">
              <p class="presented-text">This is to certify that</p>
              <h2 class="student-name">${certificate.student_name}</h2>
              <p class="completion-text">has successfully completed the course</p>
              <h3 class="course-name">${certificate.course_name}</h3>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="footer-item">
                <p class="footer-label">Date Issued</p>
                <p class="footer-value">${formattedDate}</p>
              </div>
              
              <div class="footer-item">
                <div class="signature-line"></div>
                <p class="footer-label">Authorized Signature</p>
              </div>
              
              <div class="footer-item">
                <p class="footer-label">Certificate ID</p>
                <p class="cert-id">${certificate.certificate_id}</p>
                <div class="reg-number">${registrationNumber}</div>
              </div>
            </div>
          </div>
          
          <!-- Verified Badge -->
          <div class="verified">
            <div class="verified-circle">
              <span class="verified-icon">✓</span>
              <span class="verified-text">Verified</span>
            </div>
          </div>
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
