import { motion } from "framer-motion";
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
  MessageCircle
} from "lucide-react";
import { ContainerTextFlip } from "@/components/ui/modern-animated-multi-words";
import { Link } from "react-router-dom";
import LayoutComponent from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageContent } from "@/hooks/usePageContent";

const clientLogos = [
  "TechStart", "GreenLeaf", "Bloom Co", "NextGen", "Spark Digital", "CloudNine"
];

const Index = () => {
  const { t } = useLanguage();
  const { getContent } = usePageContent('home');

  // Helper to get content with translation fallback
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
    { icon: Layout, title: c("service.uiux", "home.service.uiux"), description: c("service.uiuxDesc", "home.service.uiuxDesc") },
    { icon: Search, title: c("service.seo", "home.service.seo"), description: c("service.seoDesc", "home.service.seoDesc") },
    { icon: Monitor, title: c("service.web", "home.service.web"), description: c("service.webDesc", "home.service.webDesc") },
    { icon: ShoppingCart, title: c("service.ecommerce", "home.service.ecommerce"), description: c("service.ecommerceDesc", "home.service.ecommerceDesc") },
    { icon: Share2, title: c("service.social", "home.service.social"), description: c("service.socialDesc", "home.service.socialDesc") },
    { icon: PenTool, title: c("service.branding", "home.service.branding"), description: c("service.brandingDesc", "home.service.brandingDesc") },
  ];

  const stats = [
    { value: "50+", label: c("stats.projects_label", "home.stats.projects") || "Projects" },
    { value: "30+", label: c("stats.clients_label", "home.stats.clients") || "Clients" },
    { value: "3+", label: c("stats.years_label", "home.stats.years") || "Years" },
    { value: "100%", label: c("stats.satisfaction_label", "home.stats.satisfaction") || "Satisfaction" },
  ];

  const testimonials = [
    {
      name: c("testimonial1.name", "home.testimonial1.name"),
      role: c("testimonial1.role", "home.testimonial1.role"),
      content: c("testimonial1.content", "home.testimonial1.content"),
      rating: 5
    },
    {
      name: c("testimonial2.name", "home.testimonial2.name"),
      role: c("testimonial2.role", "home.testimonial2.role"),
      content: c("testimonial2.content", "home.testimonial2.content"),
      rating: 5
    },
    {
      name: c("testimonial3.name", "home.testimonial3.name"),
      role: c("testimonial3.role", "home.testimonial3.role"),
      content: c("testimonial3.content", "home.testimonial3.content"),
      rating: 5
    },
  ];

  return (
    <LayoutComponent>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background -mt-8">
        <div className="absolute inset-0 stripe-accent" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_auto] gap-12 items-center">
            {/* Left — editorial content */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-8"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">{c("badge", "home.badge")}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-display font-bold leading-[0.95] tracking-tight mb-6"
              >
                <span className="text-foreground">{c("title1", "home.title1")}</span>
                <br />
                <span className="gradient-text">{c("title2", "home.title2")}</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex items-start gap-4 mb-8"
              >
                <div className="w-12 h-px bg-primary/40 mt-3 shrink-0" />
                <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                  {c("description", "home.description")}
                </p>
              </motion.div>

              {/* Animated tagline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mb-10"
              >
                <ContainerTextFlip
                  words={["Creative Design", "Web Development", "Brand Building", "SEO Optimization", "UI/UX Design"]}
                  interval={3000}
                  variant="gradient"
                  animationDuration={700}
                />
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
                <Link
                  to="/contact"
                  className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {c("cta1", "home.cta1")}
                    <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-[hsl(185,100%,45%)] to-primary bg-[length:200%_100%]"
                    animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                </Link>
                <Link
                  to="/work"
                  className="group px-8 py-4 border-2 border-border text-foreground rounded-2xl font-semibold text-lg hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex items-center gap-2"
                >
                  {c("cta2", "home.cta2")}
                  <Eye size={18} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>
            </div>

            {/* Right — large decorative stat block (desktop only) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:grid grid-cols-2 gap-3 w-[280px]"
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm text-center ${i === 0 ? 'col-span-2' : ''}`}
                >
                  <div className={`font-display font-bold gradient-text tracking-tight ${i === 0 ? 'text-5xl' : 'text-3xl'}`}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div 
              className="flex flex-col items-center gap-2"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-[10px] uppercase tracking-[3px] text-muted-foreground/50 font-medium">Scroll</span>
              <div className="w-5 h-9 rounded-full border-2 border-muted-foreground/20 flex justify-center pt-1.5">
                <motion.div
                  animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1 h-2 bg-primary rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mobile Stats (shown only on mobile since desktop has stats in hero) */}
      <section className="py-8 lg:hidden relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl border border-border/50 bg-card/60 text-center"
              >
                <div className="text-3xl font-display font-bold gradient-text tracking-tight">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do — asymmetric editorial section */}
      <section className="py-20 lg:py-28 relative overflow-hidden grain-texture">
        <div className="absolute inset-0 stripe-accent" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-end justify-between gap-6 mb-14"
          >
            <div>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block">
                {c("expertise", "home.expertise")}
              </span>
              <h2 className="text-3xl lg:text-5xl font-display font-bold">
                {c("whatWeDo", "home.whatWeDo")} <span className="gradient-text">{c("do", "home.do")}</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-md text-base lg:text-right">
              {c("expertiseDesc", "home.expertiseDesc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group p-5 lg:p-7 rounded-xl bg-card/80 dark:bg-card/50 border border-border/50 dark:border-border/30 hover:border-primary/30 transition-all duration-400 relative overflow-hidden"
              >
                {/* Numbered index */}
                <span className="absolute top-4 right-4 text-[10px] font-mono font-bold text-muted-foreground/30 tracking-wider">
                  {String(index + 1).padStart(2, '0')}
                </span>
                
                <div className="w-12 h-12 rounded-xl bg-primary/[0.08] dark:bg-primary/[0.1] flex items-center justify-center mb-5 border border-primary/10">
                  <service.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-base lg:text-lg font-display font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-3 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300"
            >
              {c("viewAllServices", "home.viewAllServices")} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us — horizontal numbered list */}
      <section className="py-20 lg:py-28 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block">
              {c("whyChoose", "home.whyChoose")}
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold">
              {c("builtFor", "home.builtFor")} <span className="gradient-text">{c("yourSuccess", "home.yourSuccess")}</span>
            </h2>
          </motion.div>

          <div className="space-y-0 max-w-6xl mx-auto border-t border-border/50 dark:border-border/30">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group flex items-start gap-6 py-7 border-b border-border/50 dark:border-border/30 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.03] transition-colors duration-300 px-2"
              >
                <span className="text-4xl lg:text-5xl font-display font-bold text-primary/15 dark:text-primary/10 leading-none shrink-0 w-16 group-hover:text-primary/30 transition-colors duration-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon size={20} className="text-primary" />
                    <h3 className="text-lg font-display font-bold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — editorial quote cards */}
      <section className="py-20 lg:py-28 relative grain-texture">
        <div className="absolute inset-0 bg-secondary/30 dark:bg-card/20" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block">
              {c("testimonials", "home.testimonials")}
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold">
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
                transition={{ delay: index * 0.08 }}
                className="p-6 lg:p-7 bg-background dark:bg-card/60 border border-border/50 dark:border-border/30 rounded-xl relative"
              >
                {/* Editorial left accent */}
                <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-primary/30 rounded-full" />
                
                <div className="pl-4">
                  <Quote size={24} className="text-primary/20 mb-4" />
                  <p className="text-foreground mb-5 leading-relaxed text-sm">{testimonial.content}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={12} className="text-[hsl(45,100%,50%)] fill-[hsl(45,100%,50%)]" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm">{testimonial.name}</p>
                      <p className="text-[11px] text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos — minimal marquee strip */}
      <section className="py-10 relative border-y border-border/40 dark:border-border/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 max-w-4xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-medium shrink-0">{c("trustedBy", "home.trustedBy")}</span>
            {clientLogos.map((client, index) => (
              <motion.div
                key={client}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="text-base font-display font-bold text-muted-foreground/25 hover:text-primary/50 transition-colors duration-300"
              >
                {client}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section — bold, clean */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              {c("letsBuild", "home.letsBuild")} <span className="gradient-text">{c("brand", "home.brand")}</span>
            </h2>
            <p className="text-muted-foreground mb-10 text-lg max-w-xl mx-auto">
              {c("readyTo", "home.readyTo")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-9 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg transition-all duration-300 hover:opacity-90"
              >
                {c("freeConsultation", "home.freeConsultation")} <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/8801846484200"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-9 py-4 border-2 border-border text-foreground rounded-full font-semibold text-lg hover:border-primary/30 transition-all duration-300"
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
