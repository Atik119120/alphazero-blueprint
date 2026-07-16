import { ArrowUp, Facebook, Instagram, MessageCircle, Mail, Phone, Youtube } from "lucide-react";
import learnLogoAssetJson from "@/assets/learn-with-alphazero-logo.png.asset.json";
const learnLogo = learnLogoAssetJson.url;
import { useLanguage } from "@/contexts/LanguageContext";

const CoursesFooter = () => {
  const { language } = useLanguage();
  const isBn = language === "bn";

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navLinks = [
    { name: isBn ? "হোম" : "Home", id: "home" },
    { name: isBn ? "আমাদের সম্পর্কে" : "About Us", id: "about" },
    { name: isBn ? "ইনস্ট্রাক্টর" : "Instructors", id: "instructors" },
    { name: isBn ? "কোর্সসমূহ" : "Courses", id: "courses" },
    { name: isBn ? "যোগাযোগ" : "Contact", id: "contact" },
  ];

  const socials = [
    { icon: Facebook, url: "https://www.facebook.com/share/1Zm7yMhPtk/", label: "Facebook" },
    { icon: Instagram, url: "https://www.instagram.com/alphazero.online", label: "Instagram" },
    { icon: Youtube, url: "https://youtube.com/@alphazero", label: "YouTube" },
    { icon: MessageCircle, url: "https://wa.me/8801776965533", label: "WhatsApp" },
    { icon: Mail, url: "mailto:learn@alphazero.online", label: "Email" },
  ];

  return (
    <footer className="relative border-t border-border/40 bg-background">
      <div className="container mx-auto px-5 sm:px-6 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto grid gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src={learnLogo}
              alt="Learn with AlphaZero"
              className="h-10 w-auto brightness-0 dark:brightness-0 dark:invert mb-4"
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isBn
                ? "১০০% অনলাইন-ভিত্তিক প্র্যাক্টিক্যাল ও AI-পাওয়ার্ড কোর্স। ঘরে বসেই ডিজিটাল ক্যারিয়ার শুরু করুন।"
                : "100% online, practical & AI-powered courses. Start your digital career right from home."}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] sm:text-xs font-medium tracking-wider uppercase text-muted-foreground mb-4">
              {isBn ? "ন্যাভিগেশন" : "Navigation"}
            </h4>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollTo(l.id)}
                    className="group flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <span className="w-3 h-px bg-border group-hover:bg-primary group-hover:w-5 transition-all" />
                    {l.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[10px] sm:text-xs font-medium tracking-wider uppercase text-muted-foreground mb-4">
              {isBn ? "সোশ্যাল" : "Social"}
            </h4>
            <ul className="space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <s.icon size={15} className="group-hover:scale-110 transition-transform" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] sm:text-xs font-medium tracking-wider uppercase text-muted-foreground mb-4">
              {isBn ? "যোগাযোগ" : "Contact"}
            </h4>
            <div className="space-y-2 text-sm">
              <a href="tel:+8801776965533" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <Phone size={14} /> +880 1776-965533
              </a>
              <a href="mailto:learn@alphazero.online" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors break-all">
                <Mail size={14} /> learn@alphazero.online
              </a>
              <a
                href="https://alphazero.online"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs text-primary hover:underline"
              >
                {isBn ? "মূল সাইট → alphazero.online" : "Main site → alphazero.online"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/40">
        <div className="container mx-auto px-5 sm:px-6 py-4 pb-16 sm:pb-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              © {new Date().getFullYear()} Learn with AlphaZero
            </span>
            <button
              onClick={scrollToTop}
              className="group w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-secondary flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CoursesFooter;
