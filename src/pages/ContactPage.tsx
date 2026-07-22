import { motion } from "framer-motion";
import servicesHeroBg from "@/assets/services-hero-bg-2.jpg.asset.json";
import { useState } from "react";
import { Mail, MapPin, Send, Phone, Clock, MessageCircle, Facebook, Instagram, Twitter, Linkedin, Sparkles } from "lucide-react";

const DiscordIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFooterContent, useFooterLinks } from "@/hooks/useFooterData";
import { usePageContent } from "@/hooks/usePageContent";

const ContactPage = () => {
  const { t, language } = useLanguage();
  const { data: footerContents } = useFooterContent();
  const { data: footerLinks } = useFooterLinks();
  const { getContent: getPageContent } = usePageContent("contact");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getFooterContent = (key: string) => {
    const content = footerContents?.find((item) => item.content_key === key);
    if (!content) return null;

    return content.content_en;

  };

  const normalizePhoneForHref = (value: string) => value.replace(/[^\d+]/g, "");
  const normalizePhoneForWhatsApp = (value: string) => value.replace(/\D/g, "");

  const getPreferredContent = (pageKey: string, footerKey: string, fallback: string) => {
    return getPageContent(pageKey) || getFooterContent(footerKey) || fallback;
  };

  const phone = getPreferredContent("info.phone", "phone", "+880 1344-497808");
  const email = getPreferredContent("info.email", "email", "contact@alphazero.online").trim();
  const address = getPreferredContent("info.address", "address", t("contact.locationValue"));
  const whatsappValue = getPageContent("info.whatsapp")?.trim();
  const whatsappLink =
    (whatsappValue
      ? (whatsappValue.startsWith("http") ? whatsappValue : `https://wa.me/${normalizePhoneForWhatsApp(whatsappValue)}`)
      : footerLinks?.find((link) => link.link_type === "social" && /whatsapp/i.test(link.title))?.url?.trim()) ||
    `https://wa.me/${normalizePhoneForWhatsApp(phone)}`;

  const socialLinks = [
    { name: "Facebook", handle: "@alphazero", url: "https://www.facebook.com/share/1Zm7yMhPtk/", icon: Facebook, brand: "#1877F2" },
    { name: "WhatsApp", handle: "Chat with us", url: whatsappLink, icon: MessageCircle, brand: "#25D366" },
    { name: "Instagram", handle: "@alphazero.online", url: "https://www.instagram.com/alphazero.online", icon: Instagram, brand: "#E4405F" },
    { name: "LinkedIn", handle: "AlphaZero Agency", url: "https://www.linkedin.com/company/alphazero-agency", icon: Linkedin, brand: "#0A66C2" },
    { name: "X", handle: "@AgencyAlphazero", url: "https://x.com/AgencyAlphazero", icon: Twitter, brand: "#0F172A" },
    { name: "Discord", handle: "Join community", url: "https://discord.gg/uerwPXFf5", icon: DiscordIcon, brand: "#5865F2" },
  ];

  return (
    <Layout>
      {/* Hero — Services style */}
      <section id="site-hero" className="relative overflow-hidden -mt-20 pt-28 pb-12 lg:pt-32 lg:pb-16 rounded-b-[2.5rem]">
        <div className="absolute inset-0 bg-black" />
        <img src={servicesHeroBg.url} alt="" loading="eager" fetchPriority="high" decoding="async"
          className="absolute inset-x-0 top-0 w-full h-full object-cover object-top scale-125"
          style={{ filter: "blur(16px)" }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.05] text-white mb-6">
              <span className="font-normal" style={{ fontFamily: "'Mea Culpa', cursive" }}>{t("contact.title")}</span> <span className="font-normal gradient-text" style={{ fontFamily: "'Mea Culpa', cursive" }}>{t("contact.title2")}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-base lg:text-lg text-white/60 max-w-2xl mx-auto mb-10">
              {t("contact.description")}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3">
              <a href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold transition-all duration-300 glow-primary hover:scale-[1.02]">
                <Mail size={18} /> {t("contact.emailUs")}
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/20 text-white rounded-full font-semibold hover:border-primary/40 hover:bg-white/5 transition-all duration-300">
                <MessageCircle size={18} /> {t("contact.whatsapp")}
              </a>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-bold mb-4">{t("contact.getInTouch")}</h2>
                <p className="text-muted-foreground">{t("contact.getInTouchDesc")}</p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Phone, title: t("contact.callUs"), value: phone, href: `tel:${normalizePhoneForHref(phone)}` },
                  { icon: Mail, title: t("contact.emailUsLabel"), value: email, href: `mailto:${email}` },
                  { icon: MapPin, title: t("contact.location"), value: address },
                  { icon: Clock, title: t("contact.workingHours"), value: t("contact.workingHoursValue") },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 p-5 rounded-2xl glass-card hover:border-primary/30 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      {item.href ? (
                        <a href={item.href} className="text-muted-foreground hover:text-primary transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4 border-t border-border/40">
                <p className="text-sm text-muted-foreground mb-2">{t("contact.visitWebsite")}</p>
                <a href="https://www.alphazero.online" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  www.alphazero.online
                </a>
              </div>
            </motion.div>

            {/* Follow Us — premium redesign */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Animated gradient border wrapper */}
              <div className="relative h-full rounded-[2rem] p-[1.5px] overflow-hidden bg-[conic-gradient(from_var(--angle),theme(colors.cyan.400),theme(colors.primary),theme(colors.violet.400),theme(colors.cyan.400))] [--angle:0deg] animate-[spin_8s_linear_infinite]"
                   style={{ animation: "spin 10s linear infinite" }}>
                <div className="relative h-full rounded-[2rem] bg-white/85 backdrop-blur-2xl p-8 lg:p-10 overflow-hidden">
                  {/* Ambient glows */}
                  <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-cyan-300/25 blur-3xl pointer-events-none" />
                  <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
                       style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "18px 18px" }} />

                  <div className="relative">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-6 shadow-sm">
                      <Sparkles size={14} className="animate-pulse" /> {t("contact.followUs")}
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4 leading-[1.05] tracking-tight">
                      Follow <span className="italic font-normal bg-gradient-to-r from-primary via-cyan-500 to-violet-500 bg-clip-text text-transparent">us</span>
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-md text-[15px] leading-relaxed">
                      Stay connected with AlphaZero across our favourite platforms — updates, work, and behind-the-scenes.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {socialLinks.map((social, i) => (
                        <motion.a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                          whileHover={{ y: -4 }}
                          style={{ ["--brand" as any]: social.brand }}
                          className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-border/70 overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_-10px_var(--brand)] hover:border-[color:var(--brand)]/40"
                        >
                          {/* Shine sweep */}
                          <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                          {/* Brand hover tint */}
                          <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: `radial-gradient(120% 100% at 0% 0%, ${social.brand}12, transparent 60%)` }} />

                          <span
                            className="relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]"
                            style={{ backgroundColor: `${social.brand}15`, color: social.brand }}
                          >
                            <social.icon size={18} />
                          </span>
                          <div className="relative min-w-0 flex-1">
                            <div className="text-sm font-bold leading-tight truncate">{social.name}</div>
                            <div className="text-[11px] text-muted-foreground truncate">{social.handle}</div>
                          </div>
                          <svg className="relative w-4 h-4 shrink-0 text-muted-foreground/50 group-hover:text-[color:var(--brand)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                               viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.a>
                      ))}
                    </div>

                    {/* Bottom stat strip */}
                    <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {socialLinks.slice(0, 4).map((s) => (
                            <span key={s.name} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center"
                                  style={{ backgroundColor: `${s.brand}20`, color: s.brand }}>
                              <s.icon size={12} />
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">6 platforms</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active daily
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;