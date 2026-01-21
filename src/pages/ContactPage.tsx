import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, MapPin, Send, Phone, Clock, MessageCircle, Facebook, Instagram, Twitter } from "lucide-react";

const DiscordIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const socialLinks = [
    { name: "Facebook", url: "https://www.facebook.com/share/1Zm7yMhPtk/", icon: Facebook, comingSoon: false },
    { name: "WhatsApp", url: "https://wa.me/8801846484200", icon: MessageCircle, comingSoon: false },
    { name: "Instagram", url: "https://www.instagram.com/alphazero.online", icon: Instagram, comingSoon: false },
    { name: "X", url: "https://x.com/AgencyAlphazero", icon: Twitter, comingSoon: false },
    { name: "Discord", url: "https://discord.gg/uerwPXFf5", icon: DiscordIcon, comingSoon: false },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block"
            >
              {t("contact.subtitle")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-display font-bold mb-6"
            >
              {t("contact.title")} <span className="gradient-text">{t("contact.title2")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              {t("contact.description")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Quick Contact Buttons */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="mailto:agency.alphazero@gmail.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
            >
              <Mail size={22} />
              {t("contact.emailUs")}
            </a>
            <a
              href="https://wa.me/8801846484200"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-xl font-medium text-lg transition-all duration-300 hover:bg-[#25D366]/90 hover:shadow-lg hover:shadow-[#25D366]/20"
            >
              <MessageCircle size={22} />
              {t("contact.whatsapp")}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 relative">

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-display font-semibold mb-4">{t("contact.getInTouch")}</h2>
                <p className="text-muted-foreground">
                  {t("contact.getInTouchDesc")}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t("contact.callUs")}</h3>
                    <a href="tel:+8801410190019" className="text-muted-foreground hover:text-primary transition-colors">
                      +880 1410-190019
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t("contact.emailUsLabel")}</h3>
                    <a href="mailto:agency.alphazero@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                      agency.alphazero@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t("contact.location")}</h3>
                    <p className="text-muted-foreground">{t("contact.locationValue")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t("contact.workingHours")}</h3>
                    <p className="text-muted-foreground">{t("contact.workingHoursValue")}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <p className="font-semibold mb-4">{t("contact.followUs")}</p>
                <div className="flex gap-3 flex-wrap">
                  {socialLinks.map((social) => (
                    social.comingSoon ? (
                      <div
                        key={social.name}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary/50 border border-border text-muted-foreground cursor-not-allowed text-sm font-medium"
                      >
                        <social.icon size={16} />
                        {social.name}
                        <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          <Clock size={10} />
                          Soon
                        </span>
                      </div>
                    ) : (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-sm font-medium"
                      >
                        <social.icon size={16} />
                        {social.name}
                      </a>
                    )
                  ))}
                </div>
              </div>

              {/* Website */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">{t("contact.visitWebsite")}</p>
                <a 
                  href="https://www.alphazero.online" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  www.alphazero.online
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-6 p-8 rounded-2xl bg-card border border-border"
            >
              
              <div className="text-center mb-6 relative z-10">
                <h3 className="text-xl font-display font-semibold mb-2">{t("contact.formTitle")}</h3>
                <p className="text-sm text-muted-foreground">{t("contact.formSubtitle")}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 relative z-10">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    {t("contact.yourName")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    placeholder={t("contact.namePlaceholder")}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t("contact.yourEmail")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    placeholder={t("contact.emailPlaceholder")}
                  />
                </div>
              </div>

              <div className="relative z-10">
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  {t("contact.subject")}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  placeholder={t("contact.subjectPlaceholder")}
                />
              </div>

              <div className="relative z-10">
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t("contact.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                  placeholder={t("contact.messagePlaceholder")}
                />
              </div>

              <button
                type="submit"
                className="relative z-10 w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                {t("contact.submitButton")}
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;