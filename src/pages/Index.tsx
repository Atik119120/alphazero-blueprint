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
    { value: c("stats.projects", "home.stats.projects") || "50+", label: c("stats.projects_label", "home.stats.projects") },
    { value: c("stats.clients", "home.stats.clients") || "30+", label: c("stats.clients_label", "home.stats.clients") },
    { value: c("stats.years", "home.stats.years") || "3+", label: c("stats.years_label", "home.stats.years") },
    { value: c("stats.satisfaction", "home.stats.satisfaction") || "100%", label: c("stats.satisfaction_label", "home.stats.satisfaction") },
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
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden bg-background">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]"
          animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-15%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[hsl(200,100%,50%)]/8 blur-[120px]"
          animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-[hsl(260,80%,60%)]/5 blur-[100px]"
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dot grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,hsl(var(--primary)/0.08)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[radial-gradient(circle,hsl(var(--primary)/0.05)_1px,transparent_1px)]" />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              top: `${15 + i * 14}%`,
              left: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge with icon */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-10 backdrop-blur-md"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles size={16} className="text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-primary">{c("badge", "home.badge")}</span>
            </motion.div>

            {/* Main Heading - Split with accent */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight mb-4"
            >
              <span className="text-foreground">{c("title1", "home.title1")}</span>
              <br className="hidden sm:block" />{" "}
              <span className="relative">
                <span className="gradient-text">{c("title2", "home.title2")}</span>
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </span>
            </motion.h1>

            {/* Animated tagline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex justify-center mb-10"
            >
              <ContainerTextFlip
                words={[
                  "Creative Design",
                  "Web Development",
                  "Brand Building",
                  "SEO Optimization",
                  "UI/UX Design",
                ]}
                interval={3000}
                variant="gradient"
                animationDuration={700}
              />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-14 leading-relaxed"
            >
              {c("description", "home.description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link
                to="/contact"
                className="group relative px-9 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] flex items-center gap-2 overflow-hidden"
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
                className="group px-9 py-4 bg-transparent border-2 border-border text-foreground rounded-2xl font-semibold text-lg hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex items-center gap-2"
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

      {/* Quick Stats Section */}
      <section className="py-12 lg:py-16 border-t border-border/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What We Do / Our Expertise Section */}
      <section className="py-12 lg:py-16 bg-card/40 backdrop-blur-sm border-y border-border/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block">
              {c("expertise", "home.expertise")}
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-3">
              {c("whatWeDo", "home.whatWeDo")} <span className="gradient-text">{c("do", "home.do")}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm lg:text-base">
              {c("expertiseDesc", "home.expertiseDesc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-5 lg:p-6 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <service.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {c("viewAllServices", "home.viewAllServices")} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block">
              {c("whyChoose", "home.whyChoose")}
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-3">
              {c("builtFor", "home.builtFor")} <span className="gradient-text">{c("yourSuccess", "home.yourSuccess")}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                  <item.icon size={20} className="text-primary" />
                </div>
                <h3 className="text-base font-display font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 lg:py-16 bg-card/40 backdrop-blur-sm border-y border-border/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block">
              {c("testimonials", "home.testimonials")}
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-3">
              {c("whatClientsSay", "home.whatClientsSay")} <span className="gradient-text">{c("say", "home.say")}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-5 lg:p-6 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <Quote size={24} className="text-primary/30 mb-3" />
                <p className="text-foreground mb-4 leading-relaxed text-sm">{testimonial.content}</p>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-primary fill-primary" />
                  ))}
                </div>
                <div>
                  <p className="font-display font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="py-10 border-t border-border/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-muted-foreground text-sm uppercase tracking-wider">{c("trustedBy", "home.trustedBy")}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-6 md:gap-12 max-w-4xl mx-auto"
          >
            {clientLogos.map((client, index) => (
              <motion.div
                key={client}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-lg font-display font-bold text-muted-foreground/40 hover:text-primary/70 transition-colors duration-300"
              >
                {client}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-primary/5 via-card/80 to-accent/5 backdrop-blur-sm border border-primary/20"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              {c("letsBuild", "home.letsBuild")} <span className="gradient-text">{c("brand", "home.brand")}</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              {c("readyTo", "home.readyTo")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                {c("freeConsultation", "home.freeConsultation")} <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/8801846484200"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-background border border-border text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-all duration-300"
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
