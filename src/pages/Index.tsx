import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Palette, 
  Eye, 
  Target, 
  MessageSquare, 
  Gem,
  Layout,
  Share2,
  PenTool,
  Monitor,
  ShoppingCart,
  Search,
  Star,
  Quote,
  MessageCircle,
  Zap,
  CheckCircle2
} from "lucide-react";
import { ContainerTextFlip } from "@/components/ui/modern-animated-multi-words";
import { Link } from "react-router-dom";
import LayoutComponent from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageContent } from "@/hooks/usePageContent";
import { useRef } from "react";

const Index = () => {
  const { t } = useLanguage();
  const { getContent } = usePageContent('home');
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const c = (key: string, translationKey: string) => {
    const dbContent = getContent(key);
    return dbContent || t(translationKey);
  };

  const whyChooseUs = [
    { icon: Palette, title: c("why.clean", "home.why.clean"), description: c("why.cleanDesc", "home.why.cleanDesc") },
    { icon: Eye, title: c("why.brand", "home.why.brand"), description: c("why.brandDesc", "home.why.brandDesc") },
    { icon: Target, title: c("why.detail", "home.why.detail"), description: c("why.detailDesc", "home.why.detailDesc") },
    { icon: MessageSquare, title: c("why.client", "home.why.client"), description: c("why.clientDesc", "home.why.clientDesc") },
    { icon: Gem, title: c("why.zero", "home.why.zero"), description: c("why.zeroDesc", "home.why.zeroDesc") },
  ];

  const services = [
    { icon: Layout, title: c("service.uiux", "home.service.uiux"), description: c("service.uiuxDesc", "home.service.uiuxDesc"), accent: "from-[hsl(185,100%,50%)]" },
    { icon: Search, title: c("service.seo", "home.service.seo"), description: c("service.seoDesc", "home.service.seoDesc"), accent: "from-[hsl(200,100%,55%)]" },
    { icon: Monitor, title: c("service.web", "home.service.web"), description: c("service.webDesc", "home.service.webDesc"), accent: "from-[hsl(210,100%,60%)]" },
    { icon: ShoppingCart, title: c("service.ecommerce", "home.service.ecommerce"), description: c("service.ecommerceDesc", "home.service.ecommerceDesc"), accent: "from-[hsl(190,100%,45%)]" },
    { icon: Share2, title: c("service.social", "home.service.social"), description: c("service.socialDesc", "home.service.socialDesc"), accent: "from-[hsl(195,100%,50%)]" },
    { icon: PenTool, title: c("service.branding", "home.service.branding"), description: c("service.brandingDesc", "home.service.brandingDesc"), accent: "from-[hsl(205,100%,55%)]" },
  ];

  const stats = [
    { value: "50+", label: c("stats.projects_label", "home.stats.projects") || "Projects" },
    { value: "30+", label: c("stats.clients_label", "home.stats.clients") || "Clients" },
    { value: "3+", label: c("stats.years_label", "home.stats.years") || "Years" },
    { value: "100%", label: c("stats.satisfaction_label", "home.stats.satisfaction") || "Satisfaction" },
  ];

  const testimonials = [
    { name: c("testimonial1.name", "home.testimonial1.name"), role: c("testimonial1.role", "home.testimonial1.role"), content: c("testimonial1.content", "home.testimonial1.content"), rating: 5 },
    { name: c("testimonial2.name", "home.testimonial2.name"), role: c("testimonial2.role", "home.testimonial2.role"), content: c("testimonial2.content", "home.testimonial2.content"), rating: 5 },
    { name: c("testimonial3.name", "home.testimonial3.name"), role: c("testimonial3.role", "home.testimonial3.role"), content: c("testimonial3.content", "home.testimonial3.content"), rating: 5 },
  ];

  const clientLogos = ["TechStart", "GreenLeaf", "Bloom Co", "NextGen", "Spark Digital", "CloudNine"];

  return (
    <LayoutComponent>
      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20 pt-20">
        {/* Animated mesh background */}
        <div className="absolute inset-0 mesh-bg" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/[0.07] blur-[100px]"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-[hsl(var(--gradient-end)/0.06)] blur-[100px]"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/[0.06] backdrop-blur-sm mb-8"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{c("badge", "home.badge")}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-8xl xl:text-[6.5rem] font-display font-bold leading-[0.92] tracking-tight mb-6"
            >
              <span className="text-foreground">{c("title1", "home.title1")}</span>
              <br />
              <span className="gradient-text">{c("title2", "home.title2")}</span>
            </motion.h1>

            {/* Animated tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center mb-6"
            >
              <ContainerTextFlip
                words={["Creative Design", "Web Development", "Brand Building", "SEO Optimization", "UI/UX Design"]}
                interval={3000}
                variant="gradient"
                animationDuration={700}
              />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {c("description", "home.description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/contact"
                className="group relative px-9 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2 glow-primary hover:scale-[1.02]"
              >
                {c("cta1", "home.cta1")}
                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link
                to="/work"
                className="group px-9 py-4 border-2 border-border text-foreground rounded-full font-semibold text-lg hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex items-center gap-2"
              >
                {c("cta2", "home.cta2")}
                <Eye size={18} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div 
              className="flex flex-col items-center gap-2"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-5 h-9 rounded-full border-2 border-muted-foreground/20 flex justify-center pt-1.5">
                <motion.div
                  animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1 h-2 bg-primary rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════ STATS BANNER ══════════ */}
      <section className="relative -mt-1">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto glass-card rounded-2xl p-1"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`text-center py-8 px-4 ${index < stats.length - 1 ? 'border-r border-border/30 dark:border-border/20' : ''} ${index < 2 ? 'border-b lg:border-b-0 border-border/30 dark:border-border/20' : ''}`}
                >
                  <div className="text-3xl lg:text-4xl font-display font-bold gradient-text tracking-tight mb-1">{stat.value}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ SERVICES — BENTO GRID ══════════ */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-6">
              <Zap size={14} className="text-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{c("expertise", "home.expertise")}</span>
            </div>
            <h2 className="text-3xl lg:text-5xl xl:text-6xl font-display font-bold mb-4">
              {c("whatWeDo", "home.whatWeDo")} <span className="gradient-text">{c("do", "home.do")}</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              {c("expertiseDesc", "home.expertiseDesc")}
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const isLarge = index === 0 || index === 3;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className={`group relative p-7 lg:p-8 rounded-2xl glass-card overflow-hidden ${isLarge ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  {/* Top gradient line */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${service.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-primary/[0.08] flex items-center justify-center mb-6 group-hover:bg-primary/[0.15] transition-colors duration-300">
                    <service.icon size={24} className="text-primary" />
                  </div>

                  {/* Number */}
                  <span className="absolute top-6 right-6 text-6xl font-display font-bold text-muted-foreground/[0.06] dark:text-muted-foreground/[0.04] leading-none select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h3 className="text-lg lg:text-xl font-display font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                  
                  {/* Hover arrow */}
                  <div className="mt-6 flex items-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span>{t("common.learnMore") || "Learn more"}</span>
                    <ArrowRight size={14} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 glow-primary hover:scale-[1.02]"
            >
              {c("viewAllServices", "home.viewAllServices")} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════ WHY CHOOSE US — CARD GRID ══════════ */}
      <section className="py-24 lg:py-32 relative mesh-bg">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-6">
              <CheckCircle2 size={14} className="text-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{c("whyChoose", "home.whyChoose")}</span>
            </div>
            <h2 className="text-3xl lg:text-5xl xl:text-6xl font-display font-bold">
              {c("builtFor", "home.builtFor")} <span className="gradient-text">{c("yourSuccess", "home.yourSuccess")}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -4 }}
                className={`group relative p-7 rounded-2xl glass-card overflow-hidden ${index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                {/* Large number bg */}
                <span className="absolute -bottom-4 -right-2 text-[7rem] font-display font-bold text-muted-foreground/[0.04] leading-none select-none">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <item.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-6">
              <MessageSquare size={14} className="text-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{c("testimonials", "home.testimonials")}</span>
            </div>
            <h2 className="text-3xl lg:text-5xl xl:text-6xl font-display font-bold">
              {c("whatClientsSay", "home.whatClientsSay")} <span className="gradient-text">{c("say", "home.say")}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative p-7 rounded-2xl glass-card overflow-hidden"
              >
                {/* Accent top bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/40 via-primary/60 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <Quote size={28} className="text-primary/15 mb-5" />
                <p className="text-foreground mb-6 leading-relaxed text-sm">{testimonial.content}</p>
                
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={13} className="text-[hsl(45,100%,50%)] fill-[hsl(45,100%,50%)]" />
                  ))}
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TRUSTED BY ══════════ */}
      <section className="py-12 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto glass-card rounded-2xl py-8 px-6">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-bold shrink-0">{c("trustedBy", "home.trustedBy")}</span>
              {clientLogos.map((client, index) => (
                <motion.div
                  key={client}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="text-base font-display font-bold text-muted-foreground/20 hover:text-primary/60 transition-colors duration-300 cursor-default"
                >
                  {client}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CTA SECTION ══════════ */}
      <section className="py-24 lg:py-36 relative overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 mesh-bg" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8"
            >
              <Sparkles size={28} className="text-primary" />
            </motion.div>

            <h2 className="text-4xl lg:text-6xl xl:text-7xl font-display font-bold mb-6 leading-tight">
              {c("letsBuild", "home.letsBuild")} <span className="gradient-text">{c("brand", "home.brand")}</span>
            </h2>
            <p className="text-muted-foreground mb-12 text-lg max-w-xl mx-auto leading-relaxed">
              {c("readyTo", "home.readyTo")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg transition-all duration-300 glow-primary hover:scale-[1.02]"
              >
                {c("freeConsultation", "home.freeConsultation")} <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/8801846484200"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 border-2 border-border text-foreground rounded-full font-semibold text-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <MessageCircle size={18} />
                {c("whatsappUs", "home.whatsappUs")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </LayoutComponent>
  );
};

export default Index;