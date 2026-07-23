import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, MessageCircle, Facebook, Instagram, Twitter, Linkedin, ArrowUpRight, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFooterContent, useFooterLinks } from "@/hooks/useFooterData";
import { usePageContent } from "@/hooks/usePageContent";

const DiscordIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const ContactPage = () => {
  const { t } = useLanguage();
  const { data: footerContents } = useFooterContent();
  const { data: footerLinks } = useFooterLinks();
  const { getContent: getPageContent } = usePageContent("contact");

  const getFooterContent = (key: string) => footerContents?.find((i) => i.content_key === key)?.content_en ?? null;
  const normalizePhoneForHref = (v: string) => v.replace(/[^\d+]/g, "");
  const normalizePhoneForWhatsApp = (v: string) => v.replace(/\D/g, "");
  const getPreferred = (pk: string, fk: string, fb: string) => getPageContent(pk) || getFooterContent(fk) || fb;

  const phone = getPreferred("info.phone", "phone", "+880 1344-497808");
  const email = getPreferred("info.email", "email", "contact@alphazero.online").trim();
  const address = getPreferred("info.address", "address", t("contact.locationValue"));
  const whatsappValue = getPageContent("info.whatsapp")?.trim();
  const whatsappLink =
    (whatsappValue
      ? whatsappValue.startsWith("http")
        ? whatsappValue
        : `https://wa.me/${normalizePhoneForWhatsApp(whatsappValue)}`
      : footerLinks?.find((l) => l.link_type === "social" && /whatsapp/i.test(l.title))?.url?.trim()) ||
    `https://wa.me/${normalizePhoneForWhatsApp(phone)}`;

  const socials = [
    { name: "Facebook", handle: "@alphazero", url: "https://www.facebook.com/share/1Zm7yMhPtk/", icon: Facebook, brand: "#1877F2" },
    { name: "WhatsApp", handle: "Chat now", url: whatsappLink, icon: MessageCircle, brand: "#25D366" },
    { name: "Instagram", handle: "@alphazero.online", url: "https://www.instagram.com/alphazero.online", icon: Instagram, brand: "#E4405F" },
    { name: "LinkedIn", handle: "AlphaZero Agency", url: "https://www.linkedin.com/company/alphazero-agency", icon: Linkedin, brand: "#0A66C2" },
    { name: "X", handle: "@AgencyAlphazero", url: "https://x.com/AgencyAlphazero", icon: Twitter, brand: "#0F172A" },
    { name: "Discord", handle: "Join community", url: "https://discord.gg/uerwPXFf5", icon: DiscordIcon, brand: "#5865F2" },
  ];

  const contactCards = [
    { icon: Phone, label: "Call us", value: phone, href: `tel:${normalizePhoneForHref(phone)}`, accent: "from-cyan-400/20 to-transparent" },
    { icon: Mail, label: "Email us", value: email, href: `mailto:${email}`, accent: "from-primary/20 to-transparent" },
    { icon: MapPin, label: "Location", value: address, accent: "from-violet-400/20 to-transparent" },
    { icon: Clock, label: "Working hours", value: "Sat – Thu · 10:00 AM – 8:00 PM", accent: "from-amber-300/20 to-transparent" },
  ];

  return (
    <Layout>
      {/* ===== Editorial Hero ===== */}
      <section id="site-hero" className="relative overflow-hidden -mt-20 pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#F6F7F9]">
        {/* Grid backdrop */}
        <div className="absolute inset-0 opacity-[0.5] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(#0000000a 1px,transparent 1px),linear-gradient(90deg,#0000000a 1px,transparent 1px)", backgroundSize: "56px 56px" }} />


        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/5 shadow-sm text-xs font-semibold tracking-wide uppercase text-primary mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Available for new projects
              </div>
              <h1 className="text-[15vw] sm:text-[11vw] lg:text-[9rem] font-display font-bold leading-[0.9] tracking-[-0.03em] text-black">
                Let's talk.
              </h1>
              <p className="mt-6 text-base lg:text-xl text-neutral-600 max-w-xl leading-relaxed">
                Tell us about your idea. Whether it's a rebrand, a launch, or a full digital product — we reply within 24 hours.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="lg:col-span-4 flex flex-col gap-3">
              <a href={`mailto:${email}`}
                className="group flex items-center justify-between gap-4 p-5 rounded-2xl bg-black text-white hover:bg-neutral-800 transition-colors">
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/50 mb-1">Prefer email</div>
                  <div className="font-semibold text-lg">{email}</div>
                </div>
                <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-black/10 hover:border-primary/40 hover:shadow-lg transition-all">
                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Chat instantly</div>
                  <div className="font-semibold text-lg text-black">WhatsApp us</div>
                </div>
                <ArrowUpRight className="w-6 h-6 text-primary group-hover:rotate-45 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Info Bento Grid ===== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left column — heading */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="lg:col-span-4">
              <div className="sticky top-28">
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">Get in touch</div>
                <h2 className="text-4xl lg:text-5xl font-display font-bold leading-[1.05] tracking-tight text-black mb-5">
                  Every great project<br />starts with a hello.
                </h2>
                <p className="text-neutral-600 leading-relaxed">
                  Pick the channel that suits you best — our team is spread across time zones so someone is always around.
                </p>
              </div>
            </motion.div>

            {/* Right — bento cards */}
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
              {contactCards.map((c, i) => {
                const Wrapper: any = c.href ? "a" : "div";
                return (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Wrapper
                      {...(c.href ? { href: c.href } : {})}
                      className="group relative block h-full p-6 rounded-3xl bg-[#F6F7F9] border border-black/5 hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative">
                        <div className="flex items-start justify-between mb-8">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center shadow-sm">
                            <c.icon className="w-5 h-5 text-primary" />
                          </div>
                          {c.href && <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-primary group-hover:rotate-45 transition-all" />}
                        </div>

                        <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">{c.label}</div>
                        <div className="text-lg font-semibold text-black leading-snug">{c.value}</div>
                      </div>
                    </Wrapper>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Follow Us + Map-style block ===== */}
      <section className="pb-24 lg:pb-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* Follow Us — premium card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="lg:col-span-7 h-full">
              <div className="relative h-full rounded-[2rem] overflow-hidden bg-white border border-black/10">
                <div className="relative h-full p-8 lg:p-10 flex flex-col">

                  <div className="relative flex items-end justify-between flex-wrap gap-4 mb-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/25 bg-primary/10 text-primary text-xs font-semibold mb-4">
                        <Sparkles size={13} /> Follow us
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-display font-bold tracking-tight text-black">
                        Around the web
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 6 platforms · active daily
                    </span>
                  </div>


                  <div className="relative grid sm:grid-cols-2 gap-3">
                    {socials.map((s, i) => (
                      <motion.a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -3 }}
                        style={{ ["--brand" as any]: s.brand }}
                        className="group relative flex items-center gap-3 p-4 rounded-2xl bg-[#F6F7F9] border border-black/5 overflow-hidden hover:border-[color:var(--brand)]/40 hover:shadow-[0_10px_30px_-10px_var(--brand)] transition-all"
                      >
                        
                        <span className="relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: `${s.brand}15`, color: s.brand }}>
                          <s.icon size={18} />
                        </span>
                        <div className="relative min-w-0 flex-1">
                          <div className="text-sm font-bold text-black leading-tight truncate">{s.name}</div>
                          <div className="text-[11px] text-neutral-500 truncate">{s.handle}</div>
                        </div>
                        <ArrowUpRight className="relative w-4 h-4 shrink-0 text-neutral-400 group-hover:text-[color:var(--brand)] group-hover:rotate-45 transition-all" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Studio card with live map */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="lg:col-span-5 h-full">

              <div className="relative h-full rounded-[2rem] overflow-hidden bg-black text-white flex flex-col min-h-[420px]">
                {/* Header */}
                <div className="relative p-8 lg:p-10 pb-6">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">Our studio</div>
                  <h3 className="text-3xl lg:text-4xl font-display font-bold leading-tight mb-3">
                    Come say hi<br />in Rajshahi.
                  </h3>

                  <p className="text-white/60 leading-relaxed text-sm max-w-sm">{address}</p>
                </div>

                {/* Live map */}
                <div className="relative flex-1 min-h-[220px] mx-6 lg:mx-8 rounded-2xl overflow-hidden border border-white/10 group">
                  <iframe
                    title="AlphaZero Studio location"
                    src="https://www.google.com/maps?q=Hi-Tech+Park+Rajshahi+Bangladesh&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full grayscale contrast-125 opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    style={{ border: 0 }}
                  />
                  
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" /> Live map
                  </div>
                </div>

                {/* Footer */}
                <div className="relative flex items-center justify-between gap-4 p-6 lg:p-8 pt-6">
                  <a href="https://www.google.com/maps/search/?api=1&query=Hi-Tech+Park+Rajshahi+Bangladesh"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200 font-semibold">
                    <MapPin size={14} /> Open in Maps
                  </a>
                  <a href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-cyan-300 transition-colors">
                    Say hello <ArrowUpRight size={16} />
                  </a>
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
