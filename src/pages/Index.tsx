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
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-background -mt-8">

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
                className="group relative px-9 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 overflow-hidden"
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
      <section className="py-14 lg:py-20 relative overflow-hidden">
        {/* Decorative background for light mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-primary/[0.03] dark:from-transparent dark:to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="group text-center p-6 rounded-2xl bg-background/80 dark:bg-card/60 backdrop-blur-sm border border-primary/10 dark:border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-[hsl(200,100%,50%)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="text-3xl lg:text-5xl font-display font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What We Do / Our Expertise Section */}
      <section className="py-14 lg:py-20 relative overflow-hidden">
        {/* Colorful background accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(185,40%,96%)] via-background to-[hsl(200,40%,96%)] dark:from-card/40 dark:via-background dark:to-card/40" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-3 px-4 py-1.5 bg-primary/10 rounded-full">
              {c("expertise", "home.expertise")}
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              {c("whatWeDo", "home.whatWeDo")} <span className="gradient-text">{c("do", "home.do")}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
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
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group p-5 lg:p-7 rounded-2xl bg-background/90 dark:bg-card/60 backdrop-blur-sm border border-border/60 hover:border-primary/40 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden"
              >
                {/* Colored top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[hsl(200,100%,50%)] to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />
                
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-[hsl(200,100%,50%)]/10 flex items-center justify-center mb-5 group-hover:from-primary/25 group-hover:to-[hsl(200,100%,50%)]/20 transition-all duration-300 border border-primary/10">
                  <service.icon size={26} className="text-primary" />
                </div>
                <h3 className="text-lg font-display font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 text-primary bg-primary/10 hover:bg-primary/20 rounded-full font-medium transition-all duration-300"
            >
              {c("viewAllServices", "home.viewAllServices")} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-14 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tl from-[hsl(260,40%,97%)] via-background to-[hsl(185,40%,97%)] dark:from-transparent dark:to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-3 px-4 py-1.5 bg-primary/10 rounded-full">
              {c("whyChoose", "home.whyChoose")}
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              {c("builtFor", "home.builtFor")} <span className="gradient-text">{c("yourSuccess", "home.yourSuccess")}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {whyChooseUs.map((item, index) => {
              const gradients = [
                "from-primary/10 to-[hsl(200,100%,50%)]/5",
                "from-[hsl(260,80%,60%)]/8 to-primary/5",
                "from-[hsl(340,80%,55%)]/6 to-[hsl(260,80%,60%)]/5",
                "from-[hsl(45,100%,50%)]/8 to-[hsl(340,80%,55%)]/5",
                "from-[hsl(200,100%,50%)]/8 to-primary/5",
              ];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group p-6 rounded-2xl bg-background/90 dark:bg-card/60 backdrop-blur-sm border border-border/60 hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden"
                >
                  {/* Unique gradient per card */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-40 dark:opacity-20`} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <item.icon size={22} className="text-primary" />
                    </div>
                    <h3 className="text-base font-display font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-14 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(185,40%,96%)] via-background to-[hsl(260,30%,97%)] dark:from-card/40 dark:via-background dark:to-card/40" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-3 px-4 py-1.5 bg-primary/10 rounded-full">
              {c("testimonials", "home.testimonials")}
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
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
                className="p-6 lg:p-7 rounded-2xl bg-background/90 dark:bg-card/60 backdrop-blur-sm border border-border/60 hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle gradient accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-[60px]" />
                <Quote size={28} className="text-primary/25 mb-4 relative z-10" />
                <p className="text-foreground mb-5 leading-relaxed text-sm relative z-10">{testimonial.content}</p>
                <div className="flex items-center gap-1 mb-3 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-[hsl(45,100%,50%)] fill-[hsl(45,100%,50%)]" />
                  ))}
                </div>
                <div className="relative z-10">
                  <p className="font-display font-bold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="py-12 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-muted-foreground text-sm uppercase tracking-wider font-medium">{c("trustedBy", "home.trustedBy")}</p>
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
                className="text-lg font-display font-bold text-muted-foreground/30 hover:text-primary/70 transition-colors duration-300"
              >
                {client}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-[hsl(260,80%,60%)]/[0.03] dark:from-transparent dark:to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center p-10 lg:p-16 rounded-3xl relative overflow-hidden"
          >
            {/* CTA background with gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-[hsl(200,100%,50%)]/10 dark:from-primary/5 dark:to-[hsl(200,100%,50%)]/5 rounded-3xl" />
            <div className="absolute inset-[1px] bg-background/95 dark:bg-background/90 rounded-3xl" />
            
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-display font-bold mb-5">
                {c("letsBuild", "home.letsBuild")} <span className="gradient-text">{c("brand", "home.brand")}</span>
              </h2>
              <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto">
                {c("readyTo", "home.readyTo")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold transition-all duration-300"
                >
                  {c("freeConsultation", "home.freeConsultation")} <ArrowRight size={18} />
                </Link>
                <a
                  href="https://wa.me/8801846484200"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-background border-2 border-border text-foreground rounded-2xl font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                >
                  <MessageCircle size={18} />
                  {c("whatsappUs", "home.whatsappUs")}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </LayoutComponent>
  );
};

export default Index;
