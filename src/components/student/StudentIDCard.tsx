import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Phone, Mail, GraduationCap } from 'lucide-react';
import { Profile } from '@/types/lms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface StudentIDCardProps {
  profile: Profile;
  passCode?: string;
}

export default function StudentIDCard({ profile, passCode }: StudentIDCardProps) {
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
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-10 h-10 object-contain brightness-0 invert"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <h3 className="text-lg font-bold tracking-wide">AlphaZero Academy</h3>
              <p className="text-xs opacity-80">Student Identity Card</p>
            </div>
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
            <div className="flex-1 space-y-1.5">
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-60">Name</p>
                <p className="font-semibold text-sm truncate">{profile.full_name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-60">Student ID</p>
                <p className="font-mono text-xs">{studentId}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Pass Code</p>
                  <p className="font-mono text-xs">{passCode || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Member Since</p>
                  <p className="text-xs">{profile.created_at ? formatDate(profile.created_at) : 'N/A'}</p>
                </div>
              </div>
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
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded grid grid-cols-3 gap-0.5 p-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`rounded-sm ${i % 2 === 0 ? 'bg-white' : 'bg-white/40'}`} />
                ))}
              </div>
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
