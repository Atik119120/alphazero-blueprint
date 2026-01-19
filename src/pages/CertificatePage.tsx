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
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
          
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
            font-family: 'Montserrat', sans-serif;
            background: #0a0a0a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .certificate-wrapper {
            width: 1100px;
            height: 780px;
            background: linear-gradient(135deg, #fefefe 0%, #f8f6f0 100%);
            position: relative;
            box-shadow: 0 25px 80px rgba(0,0,0,0.4);
          }
          
          /* Golden ornate border */
          .border-outer {
            position: absolute;
            inset: 8px;
            border: 3px solid #c9a227;
          }
          
          .border-inner {
            position: absolute;
            inset: 18px;
            border: 1px solid #c9a227;
          }
          
          /* Corner decorations */
          .corner {
            position: absolute;
            width: 80px;
            height: 80px;
            border: 3px solid #c9a227;
          }
          
          .corner-tl { top: 30px; left: 30px; border-right: none; border-bottom: none; }
          .corner-tr { top: 30px; right: 30px; border-left: none; border-bottom: none; }
          .corner-bl { bottom: 30px; left: 30px; border-right: none; border-top: none; }
          .corner-br { bottom: 30px; right: 30px; border-left: none; border-top: none; }
          
          .content {
            position: absolute;
            inset: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 30px 60px;
          }
          
          /* Logo Section */
          .logo-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 15px;
          }
          
          .logo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #c9a227;
            box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
            background: white;
          }
          
          .academy-name {
            font-family: 'Cinzel', serif;
            font-size: 28px;
            font-weight: 700;
            color: #1a1a2e;
            letter-spacing: 4px;
            margin-top: 12px;
            text-transform: uppercase;
          }
          
          .academy-tagline {
            font-family: 'Montserrat', sans-serif;
            font-size: 11px;
            color: #c9a227;
            letter-spacing: 6px;
            text-transform: uppercase;
            margin-top: 4px;
            font-weight: 500;
          }
          
          /* Decorative line */
          .decorative-line {
            display: flex;
            align-items: center;
            gap: 15px;
            margin: 20px 0;
          }
          
          .line {
            width: 120px;
            height: 1px;
            background: linear-gradient(90deg, transparent, #c9a227, transparent);
          }
          
          .diamond {
            width: 10px;
            height: 10px;
            background: #c9a227;
            transform: rotate(45deg);
          }
          
          /* Certificate Title */
          .title {
            font-family: 'Cinzel', serif;
            font-size: 56px;
            font-weight: 600;
            color: #1a1a2e;
            letter-spacing: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          
          .subtitle {
            font-family: 'Cormorant Garamond', serif;
            font-size: 20px;
            color: #666;
            font-style: italic;
            letter-spacing: 4px;
          }
          
          /* Main Content */
          .presented-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 16px;
            color: #555;
            margin-top: 25px;
            letter-spacing: 3px;
            text-transform: uppercase;
          }
          
          .student-name {
            font-family: 'Cormorant Garamond', serif;
            font-size: 52px;
            font-weight: 600;
            color: #1a1a2e;
            margin: 10px 0 20px;
            font-style: italic;
          }
          
          .description {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            color: #555;
            text-align: center;
            line-height: 1.8;
            max-width: 650px;
          }
          
          .course-highlight {
            font-family: 'Cinzel', serif;
            font-size: 22px;
            font-weight: 600;
            color: #c9a227;
            margin: 15px 0;
            padding: 12px 40px;
            border: 2px solid #c9a227;
            letter-spacing: 2px;
          }
          
          /* Footer Section */
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
            margin-top: auto;
            padding-top: 25px;
          }
          
          .footer-block {
            text-align: center;
            min-width: 180px;
          }
          
          .footer-label {
            font-size: 10px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          
          .footer-value {
            font-family: 'Montserrat', sans-serif;
            font-size: 13px;
            color: #333;
            font-weight: 500;
          }
          
          .signature-line {
            width: 180px;
            border-bottom: 1px solid #333;
            margin-bottom: 8px;
          }
          
          /* Registration Number */
          .registration {
            font-family: 'Montserrat', sans-serif;
            font-size: 11px;
            color: #c9a227;
            letter-spacing: 2px;
            padding: 8px 25px;
            border: 1px solid #c9a227;
            margin-top: 5px;
          }
          
          /* Seal */
          .seal {
            position: absolute;
            bottom: 60px;
            right: 80px;
            width: 90px;
            height: 90px;
            border: 3px solid #c9a227;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(201, 162, 39, 0.1), rgba(255, 215, 0, 0.05));
          }
          
          .seal-icon {
            font-size: 24px;
            color: #c9a227;
          }
          
          .seal-text {
            font-family: 'Montserrat', sans-serif;
            font-size: 8px;
            color: #c9a227;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 3px;
            font-weight: 600;
          }
          
          /* Watermark */
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Cinzel', serif;
            font-size: 300px;
            font-weight: 700;
            color: rgba(201, 162, 39, 0.03);
            pointer-events: none;
            z-index: 0;
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .certificate-wrapper {
              box-shadow: none;
              width: 100%;
              height: 100vh;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate-wrapper">
          <div class="border-outer"></div>
          <div class="border-inner"></div>
          <div class="corner corner-tl"></div>
          <div class="corner corner-tr"></div>
          <div class="corner corner-bl"></div>
          <div class="corner corner-br"></div>
          <div class="watermark">AZ</div>
          
          <div class="content">
            <!-- Logo Section -->
            <div class="logo-section">
              <img src="${window.location.origin}/logo.png" alt="AlphaZero Academy" class="logo" onerror="this.style.display='none'" />
              <h2 class="academy-name">AlphaZero Academy</h2>
              <p class="academy-tagline">Excellence in Learning</p>
            </div>
            
            <div class="decorative-line">
              <div class="line"></div>
              <div class="diamond"></div>
              <div class="line"></div>
            </div>
            
            <!-- Certificate Title -->
            <h1 class="title">Certificate</h1>
            <p class="subtitle">of Achievement</p>
            
            <!-- Main Content -->
            <p class="presented-text">This is to certify that</p>
            <h2 class="student-name">${certificate.student_name}</h2>
            
            <p class="description">
              has successfully completed the training program and demonstrated 
              exceptional dedication and commitment to learning excellence in
            </p>
            
            <div class="course-highlight">${certificate.course_name}</div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="footer-block">
                <p class="footer-label">Date of Issue</p>
                <p class="footer-value">${formattedDate}</p>
              </div>
              
              <div class="footer-block">
                <div class="signature-line"></div>
                <p class="footer-label">Authorized Signature</p>
                <p class="footer-value" style="font-weight: 600;">AlphaZero Academy</p>
              </div>
              
              <div class="footer-block">
                <p class="footer-label">Certificate ID</p>
                <p class="footer-value" style="font-family: monospace;">${certificate.certificate_id}</p>
                <div class="registration">${registrationNumber}</div>
              </div>
            </div>
            
            <!-- Verification Seal -->
            <div class="seal">
              <span class="seal-icon">✓</span>
              <span class="seal-text">Verified</span>
              <span class="seal-text">Authentic</span>
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
