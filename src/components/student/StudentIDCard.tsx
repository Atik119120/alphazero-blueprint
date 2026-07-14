import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Phone, Mail, GraduationCap } from 'lucide-react';
import { Profile } from '@/types/lms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import logoImg from '@/assets/learn-with-alphazero-logo.png';

interface StudentIDCardProps {
  profile: Profile;
}

export default function StudentIDCard({ profile }: StudentIDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const downloadIDCard = async () => {
    if (!cardRef.current) return;
    
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      backgroundColor: null,
      useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [86, 54] // Standard ID card size
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, 86, 54);
    pdf.save(`AlphaZero_ID_${profile.full_name.replace(/\s+/g, '_')}.pdf`);
  };

  const studentId = `AZA-${profile.created_at?.slice(0, 10).replace(/-/g, '')}-${profile.id.slice(0, 4).toUpperCase()}`;

  return (
    <div className="space-y-4">
      {/* ID Card Preview */}
      <div 
        ref={cardRef}
        className="relative w-full max-w-[430px] mx-auto aspect-[1.586] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(220, 80%, 30%) 50%, hsl(260, 70%, 25%) 100%)'
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Content */}
        <div className="relative h-full p-5 flex flex-col text-white">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-1 shrink-0 shadow-md">
              <img
                src={logoImg}
                alt="AlphaZero"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] opacity-90 font-semibold">Student Identity Card</p>
          </div>

          {/* Main Content */}
          <div className="flex gap-4 flex-1">
            {/* Photo */}
            <div className="shrink-0">
              <div className="w-20 h-24 rounded-lg bg-white/20 overflow-hidden border-2 border-white/40 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GraduationCap className="w-10 h-10 text-white/60" />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2 min-w-0">
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-60">Name</p>
                <p className="font-semibold text-sm truncate">{profile.full_name}</p>
              </div>
              <div className="flex gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Student ID</p>
                  <p className="font-mono text-xs truncate">{studentId}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Member Since</p>
                  <p className="text-xs">{profile.created_at ? formatDate(profile.created_at) : 'N/A'}</p>
                </div>
              </div>
              {profile.email && (
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Email</p>
                  <p className="text-xs truncate">{profile.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20">
            <div className="flex items-center gap-3 text-[10px] opacity-80">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                01776965533
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                info@alphazero.com
              </span>
            </div>
            <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
              <QRCodeSVG
                value={`https://alphazero00.lovable.app/verify?id=${studentId}`}
                size={40}
                level="M"
                bgColor="#ffffff"
                fgColor="#0f172a"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <Button onClick={downloadIDCard} className="w-full gap-2" variant="outline">
        <Download className="w-4 h-4" />
        Download ID Card (PDF)
      </Button>
    </div>
  );
}
