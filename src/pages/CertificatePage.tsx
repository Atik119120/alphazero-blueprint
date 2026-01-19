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
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Great+Vibes&family=Raleway:wght@300;400;500;600&display=swap');
          
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
            background: #4a5568;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
          }
          
          .certificate {
            width: 1100px;
            height: 780px;
            background: #ffffff;
            position: relative;
            box-shadow: 0 40px 80px rgba(0,0,0,0.4);
          }
          
          /* Outer light gray frame */
          .outer-frame {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #e8e8e8 100%);
            padding: 15px;
          }
          
          /* White certificate body */
          .certificate-body {
            background: #ffffff;
            width: 100%;
            height: 100%;
            position: relative;
          }
          
          /* Gold border */
          .gold-border {
            position: absolute;
            inset: 20px;
            border: 3px solid #c9a227;
          }
          
          /* Top-left dark corner */
          .corner-top-left {
            position: absolute;
            top: 0;
            left: 0;
            width: 200px;
            height: 140px;
            background: #1a3a4a;
            clip-path: polygon(0 0, 100% 0, 70% 100%, 0 100%);
          }
          
          .corner-top-left::after {
            content: '';
            position: absolute;
            bottom: 20px;
            left: 30px;
            width: 80px;
            height: 2px;
            background: white;
            transform: rotate(-30deg);
          }
          
          /* Bottom-right dark corner */
          .corner-bottom-right {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 220px;
            height: 160px;
            background: #1a3a4a;
            clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%);
          }
          
          .corner-bottom-right::before {
            content: '';
            position: absolute;
            top: 25px;
            right: 40px;
            width: 100px;
            height: 2px;
            background: white;
            transform: rotate(-30deg);
          }
          
          /* Small accent corner top-right */
          .corner-accent-tr {
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-left: 50px solid transparent;
            border-top: 50px solid #e8e8e8;
          }
          
          /* Small accent corner bottom-left */
          .corner-accent-bl {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 0;
            border-right: 50px solid transparent;
            border-bottom: 50px solid #e8e8e8;
          }
          
          /* Content area */
          .content {
            position: absolute;
            inset: 40px;
            display: flex;
            flex-direction: column;
            padding: 40px 60px;
          }
          
          /* Header */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
          }
          
          .title-section {
            text-align: left;
          }
          
          .certificate-title {
            font-family: 'Playfair Display', serif;
            font-size: 52px;
            font-weight: 600;
            color: #1a3a4a;
            letter-spacing: 4px;
            text-transform: uppercase;
            line-height: 1;
          }
          
          .certificate-subtitle {
            font-family: 'Great Vibes', cursive;
            font-size: 32px;
            color: #c9a227;
            margin-top: 5px;
            margin-left: 10px;
          }
          
          /* Academy Badge */
          .academy-badge {
            width: 120px;
            height: 120px;
            position: relative;
          }
          
          .badge-outer {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #c9a227 0%, #f0d875 50%, #c9a227 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(201, 162, 39, 0.4);
          }
          
          .badge-inner {
            width: 95px;
            height: 95px;
            background: linear-gradient(135deg, #1a3a4a 0%, #2d5a6a 100%);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 3px solid #c9a227;
          }
          
          .badge-stars {
            color: #c9a227;
            font-size: 10px;
            letter-spacing: 2px;
          }
          
          .badge-text {
            color: #c9a227;
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            font-size: 14px;
            text-align: center;
            line-height: 1.2;
          }
          
          .badge-text-sub {
            color: #c9a227;
            font-family: 'Raleway', sans-serif;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 1px;
          }
          
          /* Main content */
          .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 20px 0;
          }
          
          .presented-text {
            font-family: 'Raleway', sans-serif;
            font-size: 14px;
            color: #666;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 15px;
          }
          
          .student-name {
            font-family: 'Great Vibes', cursive;
            font-size: 56px;
            color: #1a3a4a;
            margin-bottom: 25px;
            border-bottom: 2px solid #c9a227;
            padding-bottom: 15px;
            display: inline-block;
          }
          
          .course-description {
            font-family: 'Playfair Display', serif;
            font-size: 18px;
            color: #333;
            font-weight: 500;
            margin-bottom: 15px;
          }
          
          .course-details {
            font-family: 'Raleway', sans-serif;
            font-size: 13px;
            color: #666;
            line-height: 1.8;
            max-width: 700px;
          }
          
          /* Footer */
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-top: 30px;
            margin-top: auto;
          }
          
          .signature-box {
            text-align: center;
            min-width: 180px;
          }
          
          .signature-line {
            width: 150px;
            height: 1px;
            background: #1a3a4a;
            margin: 0 auto 8px;
          }
          
          .signature-title {
            font-family: 'Raleway', sans-serif;
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          .cert-info {
            text-align: right;
          }
          
          .cert-date {
            font-family: 'Raleway', sans-serif;
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          
          .cert-id {
            font-family: monospace;
            font-size: 10px;
            color: #1a3a4a;
            background: #f5f5f5;
            padding: 4px 10px;
            border-radius: 3px;
          }
          
          .reg-number {
            font-family: monospace;
            font-size: 9px;
            color: #c9a227;
            margin-top: 5px;
            padding: 3px 8px;
            border: 1px solid #c9a227;
            display: inline-block;
          }
          
          /* Logo watermark */
          .logo-watermark {
            position: absolute;
            bottom: 80px;
            left: 60px;
            opacity: 0.08;
            width: 200px;
            height: auto;
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
          <div class="outer-frame">
            <div class="certificate-body">
              <div class="gold-border"></div>
              <div class="corner-top-left"></div>
              <div class="corner-bottom-right"></div>
              <div class="corner-accent-tr"></div>
              <div class="corner-accent-bl"></div>
              
              <img src="${window.location.origin}/logo.png" alt="" class="logo-watermark" onerror="this.style.display='none'" />
              
              <div class="content">
                <!-- Header -->
                <div class="header">
                  <div class="title-section">
                    <h1 class="certificate-title">Certificate</h1>
                    <p class="certificate-subtitle">of Completion</p>
                  </div>
                  
                  <div class="academy-badge">
                    <div class="badge-outer">
                      <div class="badge-inner">
                        <span class="badge-stars">★ ★ ★ ★ ★</span>
                        <span class="badge-text">ALPHA</span>
                        <span class="badge-text">ZERO</span>
                        <span class="badge-stars">★ ★ ★ ★ ★</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Main Content -->
                <div class="main-content">
                  <p class="presented-text">This Certificate is Proudly Presented To</p>
                  <h2 class="student-name">${certificate.student_name}</h2>
                  <p class="course-description">For successfully completing the course: ${certificate.course_name}</p>
                  <p class="course-details">
                    This is to certify that the above named individual has demonstrated exceptional dedication 
                    and successfully completed all requirements of the course at AlphaZero Academy.
                  </p>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                  <div class="signature-box">
                    <div class="signature-line"></div>
                    <p class="signature-title">Instructor</p>
                  </div>
                  
                  <div class="signature-box">
                    <div class="signature-line"></div>
                    <p class="signature-title">Director</p>
                  </div>
                  
                  <div class="cert-info">
                    <p class="cert-date">Issued: ${formattedDate}</p>
                    <p class="cert-id">${certificate.certificate_id}</p>
                    <div class="reg-number">${registrationNumber}</div>
                  </div>
                </div>
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
