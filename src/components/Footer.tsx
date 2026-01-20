import { ArrowUp, ArrowUpRight, Facebook, Instagram, Linkedin, MessageCircle, Clock, Twitter } from "lucide-react";

const DiscordIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { name: "Facebook", url: "https://www.facebook.com/share/1Zm7yMhPtk/", icon: Facebook, comingSoon: false },
    { name: "WhatsApp", url: "https://wa.me/8801846484200", icon: MessageCircle, comingSoon: false },
    { name: "Instagram", url: "https://www.instagram.com/alphazero.online", icon: Instagram, comingSoon: false },
    { name: "X", url: "https://x.com/AgencyAlphazero", icon: Twitter, comingSoon: false },
    { name: "Discord", url: "https://discord.gg/uq9akRQpS", icon: DiscordIcon, comingSoon: false },
    { name: "LinkedIn", url: "#", icon: Linkedin, comingSoon: true },
  ];

  const quickLinks = [
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.services"), href: "/services" },
    { name: t("nav.work"), href: "/work" },
    { name: t("nav.team"), href: "/team" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  return (
    <footer className="relative">
      {/* Main Footer Content */}
      <div className="border-t border-border">
        {/* Large CTA Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <div>
                <span className="text-sm text-primary font-medium tracking-wider uppercase mb-4 block">
                  {t("footer.ready")}
                </span>
                <h2 className="text-4xl lg:text-6xl font-display font-bold leading-tight">
                  {t("footer.letsCreate")}
                  <br />
                  <span className="gradient-text">{t("footer.together")}</span>
                </h2>
              </div>
              <div className="flex lg:justify-end">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-4 text-lg font-medium"
                >
                  <span className="px-8 py-4 bg-primary text-primary-foreground rounded-full transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20">
                    {t("nav.startProject")}
                  </span>
                  <span className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowUpRight size={24} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="border-t border-border">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 lg:grid-cols-4 gap-12">
              {/* Brand */}
              <div className="lg:col-span-1">
                <Link to="/" className="inline-block mb-6">
                  <img 
                    src={logo} 
                    alt="AlphaZero Logo" 
                    className="h-8 w-auto brightness-0 dark:invert"
                  />
                </Link>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("footer.description")}
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-6">
                  {t("footer.navigation")}
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((item) => (
                    <li key={item.href}>
                      <Link 
                        to={item.href}
                        className="group flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                      >
                        <span className="w-4 h-px bg-border group-hover:bg-primary group-hover:w-6 transition-all" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div>
                <h4 className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-6">
                  {t("footer.social")}
                </h4>
                <ul className="space-y-3">
                  {socialLinks.map((social) => (
                    <li key={social.name}>
                      {social.comingSoon ? (
                        <div className="group flex items-center gap-3 text-muted-foreground cursor-not-allowed">
                          <social.icon size={18} />
                          <span>{social.name}</span>
                          <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            <Clock size={10} />
                            {t("common.soon")}
                          </span>
                        </div>
                      ) : (
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                        >
                          <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                          {social.name}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-6">
                  {t("footer.contact")}
                </h4>
                <div className="space-y-3 text-sm">
                  <a 
                    href="tel:+8801410190019" 
                    className="block text-foreground hover:text-primary transition-colors"
                  >
                    +880 1410-190019
                  </a>
                  <a 
                    href="mailto:agency.alphazero@gmail.com" 
                    className="block text-foreground hover:text-primary transition-colors"
                  >
                    agency.alphazero@gmail.com
                  </a>
                  <p className="text-muted-foreground">
                    {t("about.location.address")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border">
          <div className="container mx-auto px-6 py-6">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>© {new Date().getFullYear()} AlphaZero</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{t("footer.rights")}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <a 
                  href="https://www.alphazero.online" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  alphazero.online
                </a>
                <button
                  onClick={scrollToTop}
                  className="group w-10 h-10 rounded-full border border-border bg-secondary flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
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