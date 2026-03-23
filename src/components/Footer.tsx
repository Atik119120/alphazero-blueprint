import { ArrowUp, ArrowUpRight, Facebook, Instagram, MessageCircle, Clock, Twitter, Youtube, Github, Globe, Mail, Phone, Linkedin, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-full.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFooterLinks, useFooterContent } from "@/hooks/useFooterData";

const DiscordIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

type IconComponent = LucideIcon | typeof DiscordIcon;

const ICON_MAP: Record<string, IconComponent> = {
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
  Youtube,
  Github,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Discord: DiscordIcon,
};

const Footer = () => {
  const { t, language } = useLanguage();
  const { data: footerLinks } = useFooterLinks();
  const { data: footerContents } = useFooterContent();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get content by key with language support
  const getContent = (key: string) => {
    const content = footerContents?.find(c => c.content_key === key);
    if (!content) return null;
    return language === 'bn' ? (content.content_bn || content.content_en) : content.content_en;
  };

  // Get social links from database
  const socialLinks = footerLinks?.filter(link => link.link_type === 'social') || [];

  // Fallback static links if database is empty
  const defaultSocialLinks = [
    { name: "Facebook", url: "https://www.facebook.com/share/1Zm7yMhPtk/", icon: "Facebook" },
    { name: "Instagram", url: "https://www.instagram.com/alphazero.online", icon: "Instagram" },
    { name: "X (Twitter)", url: "https://x.com/AgencyAlphazero", icon: "Twitter" },
    { name: "LinkedIn", url: "https://www.linkedin.com/company/alphazeroagency/", icon: "Linkedin" },
    { name: "WhatsApp", url: "https://wa.me/8801846484200", icon: "MessageCircle" },
    { name: "Discord", url: "https://discord.gg/uerwPXFf5", icon: "Discord" },
    { name: "Email", url: "mailto:agency.alphazero@gmail.com", icon: "Mail" },
  ];

  const displaySocialLinks = socialLinks.length > 0 ? socialLinks : defaultSocialLinks;

  const quickLinks = [
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.services"), href: "/services" },
    { name: t("nav.work"), href: "/work" },
    { name: t("nav.team"), href: "/team" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  // Get contact info from database or use defaults
  const phone = getContent('phone') || '+880 1410-190019';
  const email = getContent('email') || 'agency.alphazero@gmail.com';
  const address = getContent('address') || t("about.location.address");
  const description = getContent('description') || t("footer.description");

  return (
    <footer className="relative">
      {/* Main Footer Content */}
      <div className="border-t border-border">
        {/* CTA Section */}
        <div className="container mx-auto px-5 sm:px-6 py-6 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-12 items-end">
              <div>
                <span className="text-[10px] sm:text-sm text-primary font-medium tracking-wider uppercase mb-2 sm:mb-4 block">
                  {t("footer.ready")}
                </span>
                <h2 className="text-xl sm:text-4xl lg:text-6xl font-display font-bold leading-tight">
                  {t("footer.letsCreate")}
                  <br />
                  <span className="gradient-text">{t("footer.together")}</span>
                </h2>
              </div>
              <div className="flex lg:justify-end">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 sm:gap-4 text-sm sm:text-lg font-medium"
                >
                  <span className="px-5 sm:px-8 py-2.5 sm:py-4 bg-primary text-primary-foreground rounded-full transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20">
                    {t("nav.startProject")}
                  </span>
                  <span className="w-9 sm:w-14 h-9 sm:h-14 rounded-full bg-foreground text-background flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid - Compact on mobile */}
        <div className="border-t border-border">
          <div className="container mx-auto px-5 sm:px-6 py-6 sm:py-16">
            <div className="max-w-6xl mx-auto">
              {/* Brand - Full width on mobile */}
              <div className="mb-6 sm:mb-0 sm:hidden">
                <Link to="/" className="inline-block mb-3">
                  <img 
                    src={logo} 
                    alt="AlphaZero Logo" 
                    className="h-7 w-auto brightness-0 dark:invert"
                  />
                </Link>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Grid: 2-col on mobile, 4-col on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-6 sm:gap-12">
                {/* Brand - Desktop only */}
                <div className="hidden sm:block lg:col-span-1">
                  <Link to="/" className="inline-block mb-6">
                    <img 
                      src={logo} 
                      alt="AlphaZero Logo" 
                      className="h-8 w-auto brightness-0 dark:invert"
                    />
                  </Link>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-[10px] sm:text-xs font-medium tracking-wider uppercase text-muted-foreground mb-3 sm:mb-6">
                    {t("footer.navigation")}
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-3">
                    {quickLinks.map((item) => (
                      <li key={item.href}>
                        <Link 
                          to={item.href}
                          className="group flex items-center gap-2 text-sm sm:text-base text-foreground hover:text-primary transition-colors"
                        >
                          <span className="w-3 sm:w-4 h-px bg-border group-hover:bg-primary group-hover:w-5 sm:group-hover:w-6 transition-all" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Social */}
                <div>
                  <h4 className="text-[10px] sm:text-xs font-medium tracking-wider uppercase text-muted-foreground mb-3 sm:mb-6">
                    {t("footer.social")}
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-3">
                    {displaySocialLinks.map((social) => {
                      const IconComponent = ICON_MAP[social.icon] || Globe;
                      return (
                        <li key={social.name}>
                          {'comingSoon' in social && social.comingSoon ? (
                            <div className="group flex items-center gap-2 sm:gap-3 text-sm text-muted-foreground cursor-not-allowed">
                              <IconComponent size={15} />
                              <span>{social.name}</span>
                            </div>
                          ) : (
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-foreground hover:text-primary transition-colors"
                            >
                              <IconComponent size={15} className="group-hover:scale-110 transition-transform sm:[&]:w-[18px] sm:[&]:h-[18px]" />
                              {social.name}
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="text-[10px] sm:text-xs font-medium tracking-wider uppercase text-muted-foreground mb-3 sm:mb-6">
                    {t("footer.contact")}
                  </h4>
                  <div className="space-y-1.5 sm:space-y-3 text-xs sm:text-sm">
                    <a 
                       href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                      className="block text-foreground hover:text-primary transition-colors"
                    >
                      {phone}
                    </a>
                    <a 
                      href={`mailto:${email}`}
                      className="block text-foreground hover:text-primary transition-colors break-all"
                    >
                      {email}
                    </a>
                    <p className="text-muted-foreground">
                      {address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border">
          <div className="container mx-auto px-5 sm:px-6 py-3 sm:py-6 pb-16 sm:pb-6">
            <div className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-sm text-muted-foreground">
                <span>© {new Date().getFullYear()} AlphaZero</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{t("footer.rights")}</span>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <a 
                  href="https://www.alphazero.online" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  alphazero.online
                </a>
                <button
                  onClick={scrollToTop}
                  className="group w-8 sm:w-10 h-8 sm:h-10 rounded-full border border-border bg-secondary flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform sm:[&]:w-[14px] sm:[&]:h-[14px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;