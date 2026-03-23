import { motion } from "framer-motion";
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

const ContactPage = () => {
  const { t, language } = useLanguage();
  const { data: footerContents } = useFooterContent();
  const { data: footerLinks } = useFooterLinks();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getContent = (key: string) => {
    const content = footerContents?.find((item) => item.content_key === key);
    if (!content) return null;

    return language === "bn"
      ? content.content_bn || content.content_en
      : content.content_en || content.content_bn;
  };

  const normalizePhoneForHref = (value: string) => value.replace(/[^\d+]/g, "");
  const normalizePhoneForWhatsApp = (value: string) => value.replace(/\D/g, "");

  const phone = getContent("phone") || "+880 1344-497808";
  const email = (getContent("email") || "contact@alphazero.online").trim();
  const address = getContent("address") || t("contact.locationValue");
  const whatsappLink = footerLinks?.find(
    (link) => link.link_type === "social" && /whatsapp/i.test(link.title)
  )?.url?.trim() || `https://wa.me/${normalizePhoneForWhatsApp(phone)}`;

  const socialLinks = [
    { name: "Facebook", url: "https://www.facebook.com/share/1Zm7yMhPtk/", icon: Facebook },
    { name: "WhatsApp", url: whatsappLink, icon: MessageCircle },
    { name: "Instagram", url: "https://www.instagram.com/alphazero.online", icon: Instagram },
    { name: "LinkedIn", url: "https://www.linkedin.com/company/alphazero-agency", icon: Linkedin },
    { name: "X", url: "https://x.com/AgencyAlphazero", icon: Twitter },
    { name: "Discord", url: "https://discord.gg/uerwPXFf5", icon: DiscordIcon },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-28 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/[0.06] backdrop-blur-sm mb-8">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{t("contact.subtitle")}</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              {t("contact.title")} <span className="gradient-text">{t("contact.title2")}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {t("contact.description")}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3">
              <a href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold transition-all duration-300 glow-primary hover:scale-[1.02]">
                <Mail size={18} /> {t("contact.emailUs")}
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-border text-foreground rounded-full font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
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

              {/* Social Links */}
              <div>
                <p className="font-semibold mb-4">{t("contact.followUs")}</p>
                <div className="flex gap-3 flex-wrap">
                  {socialLinks.map((social) => (
                    <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-sm font-medium">
                      <social.icon size={16} />{social.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/40">
                <p className="text-sm text-muted-foreground mb-2">{t("contact.visitWebsite")}</p>
                <a href="https://www.alphazero.online" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  www.alphazero.online
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              onSubmit={handleSubmit} className="space-y-6 p-8 rounded-2xl glass-card">
              <div className="text-center mb-6">
                <h3 className="text-xl font-display font-semibold mb-2">{t("contact.formTitle")}</h3>
                <p className="text-sm text-muted-foreground">{t("contact.formSubtitle")}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">{t("contact.yourName")}</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    placeholder={t("contact.namePlaceholder")} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">{t("contact.yourEmail")}</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    placeholder={t("contact.emailPlaceholder")} />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">{t("contact.subject")}</label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  placeholder={t("contact.subjectPlaceholder")} />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">{t("contact.message")}</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                  placeholder={t("contact.messagePlaceholder")} />
              </div>

              <button type="submit"
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 glow-primary hover:scale-[1.01] flex items-center justify-center gap-2">
                <Send size={20} />{t("contact.submitButton")}
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;