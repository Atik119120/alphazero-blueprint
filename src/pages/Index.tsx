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
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
        {/* Animated colorful gradient orbs - MORE VIVID */}
        <motion.div
          className="absolute top-[-15%] left-[-5%] w-[600px] h-[600px] rounded-full bg-primary/[0.12] dark:bg-primary/[0.08] blur-[130px]"
          animate={{ x: [0, 80, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[hsl(260,80%,60%)]/[0.10] dark:bg-[hsl(260,80%,60%)]/[0.05] blur-[130px]"
          animate={{ x: [0, -60, 0], y: [0, -40, 0], scale: [1.1, 0.85, 1.1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[30%] right-[15%] w-[350px] h-[350px] rounded-full bg-[hsl(340,80%,60%)]/[0.07] dark:bg-[hsl(340,80%,60%)]/[0.03] blur-[110px]"
          animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[60%] left-[15%] w-[300px] h-[300px] rounded-full bg-[hsl(45,100%,55%)]/[0.06] dark:bg-[hsl(45,100%,55%)]/[0.02] blur-[100px]"
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dot grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,hsl(var(--primary)/0.07)_1px,transparent_1px)] bg-[size:36px_36px] dark:bg-[radial-gradient(circle,hsl(var(--primary)/0.04)_1px,transparent_1px)]" />

        {/* Floating colored particles */}
        {[
          { color: "bg-primary/40", top: "12%", left: "8%", size: "w-2 h-2" },
          { color: "bg-[hsl(260,80%,60%)]/30", top: "25%", left: "85%", size: "w-1.5 h-1.5" },
          { color: "bg-[hsl(340,80%,55%)]/30", top: "45%", left: "12%", size: "w-1 h-1" },
          { color: "bg-[hsl(45,100%,55%)]/35", top: "65%", left: "78%", size: "w-2 h-2" },
          { color: "bg-primary/25", top: "75%", left: "25%", size: "w-1.5 h-1.5" },
          { color: "bg-[hsl(200,100%,50%)]/30", top: "18%", left: "60%", size: "w-1 h-1" },
          { color: "bg-[hsl(260,80%,60%)]/25", top: "55%", left: "92%", size: "w-1.5 h-1.5" },
          { color: "bg-[hsl(340,80%,55%)]/20", top: "85%", left: "55%", size: "w-1 h-1" },
        ].map((p, i) => (
          <motion.div
            key={`particle-${i}`}
            className={`absolute rounded-full ${p.color} ${p.size}`}
            style={{ top: p.top, left: p.left }}
            animate={{
              y: [0, -25 + i * 5, 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.6, 1],
            }}
            transition={{
              duration: 4 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.6,
            }}
          />
        ))}

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge with animated icon */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/15 to-[hsl(260,80%,60%)]/10 border border-primary/25 mb-10 backdrop-blur-md shadow-sm"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles size={16} className="text-primary" />
              </motion.div>
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-[hsl(260,80%,60%)] bg-clip-text text-transparent">{c("badge", "home.badge")}</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight mb-4"
            >
              <span className="text-foreground">{c("title1", "home.title1")}</span>
              <br className="hidden sm:block" />{" "}
              <span className="relative inline-block">
                <span className="gradient-text">{c("title2", "home.title2")}</span>
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-[hsl(260,80%,60%)] to-[hsl(340,80%,55%)] rounded-full"
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
                className="group relative px-9 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] flex items-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {c("cta1", "home.cta1")}
                  <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-[hsl(200,100%,50%)] to-[hsl(260,80%,60%)] bg-[length:300%_100%]"
                  animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
              </Link>
              <Link
                to="/work"
                className="group px-9 py-4 bg-gradient-to-r from-primary/5 to-[hsl(260,80%,60%)]/5 dark:bg-transparent border-2 border-primary/20 dark:border-border text-foreground rounded-2xl font-semibold text-lg hover:border-primary/50 hover:from-primary/10 hover:to-[hsl(260,80%,60%)]/10 transition-all duration-300 flex items-center gap-2"
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
              <div className="w-5 h-9 rounded-full border-2 border-primary/20 flex justify-center pt-1.5">
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
        {/* Colorful mesh background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.05] via-[hsl(260,80%,60%)]/[0.03] to-[hsl(340,80%,55%)]/[0.04] dark:from-primary/[0.02] dark:via-transparent dark:to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(260,80%,60%)]/20 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto"
          >
            {stats.map((stat, index) => {
              const cardColors = [
                { border: "border-primary/20 hover:border-primary/50", bg: "from-primary/[0.08] to-[hsl(200,100%,50%)]/[0.04]", shadow: "hover:shadow-primary/15" },
                { border: "border-[hsl(260,80%,60%)]/15 hover:border-[hsl(260,80%,60%)]/40", bg: "from-[hsl(260,80%,60%)]/[0.08] to-primary/[0.03]", shadow: "hover:shadow-[hsl(260,80%,60%)]/15" },
                { border: "border-[hsl(45,100%,50%)]/15 hover:border-[hsl(45,100%,50%)]/40", bg: "from-[hsl(45,100%,50%)]/[0.08] to-[hsl(340,80%,55%)]/[0.03]", shadow: "hover:shadow-[hsl(45,100%,50%)]/15" },
                { border: "border-[hsl(340,80%,55%)]/15 hover:border-[hsl(340,80%,55%)]/40", bg: "from-[hsl(340,80%,55%)]/[0.08] to-[hsl(260,80%,60%)]/[0.03]", shadow: "hover:shadow-[hsl(340,80%,55%)]/15" },
              ];
              const c2 = cardColors[index % 4];
              return (
                <motion.div 
                  key={stat.label} 
                  className={`group text-center p-7 rounded-3xl bg-background/90 dark:bg-card/60 backdrop-blur-sm border ${c2.border} shadow-sm hover:shadow-xl ${c2.shadow} transition-all duration-500 relative overflow-hidden`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                  whileHover={{ y: -6 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${c2.bg} opacity-60 dark:opacity-30`} />
                  <div className="relative z-10">
                    <div className="text-3xl lg:text-5xl font-display font-bold gradient-text mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* What We Do / Our Expertise Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        {/* Rich colorful background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(185,50%,96%)] via-[hsl(260,30%,97%)] to-[hsl(340,20%,97%)] dark:from-card/40 dark:via-background dark:to-card/40" />
        <div className="absolute top-16 left-0 w-96 h-96 rounded-full bg-primary/[0.06] blur-[100px] dark:bg-primary/[0.02]" />
        <div className="absolute bottom-16 right-0 w-80 h-80 rounded-full bg-[hsl(260,80%,60%)]/[0.06] blur-[100px] dark:bg-[hsl(260,80%,60%)]/[0.02]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[hsl(340,80%,60%)]/[0.03] blur-[120px] dark:hidden" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(260,80%,60%)]/20 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.span 
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase mb-4 px-5 py-2 bg-gradient-to-r from-primary/15 to-[hsl(260,80%,60%)]/10 border border-primary/20 rounded-full"
              whileInView={{ scale: [0.95, 1] }}
              viewport={{ once: true }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary">{c("expertise", "home.expertise")}</span>
            </motion.span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              {c("whatWeDo", "home.whatWeDo")} <span className="gradient-text">{c("do", "home.do")}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
              {c("expertiseDesc", "home.expertiseDesc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const iconColors = [
                { bg: "from-primary/20 to-[hsl(200,100%,50%)]/10", border: "border-primary/15", accent: "bg-primary" },
                { bg: "from-[hsl(260,80%,60%)]/20 to-primary/10", border: "border-[hsl(260,80%,60%)]/15", accent: "bg-[hsl(260,80%,60%)]" },
                { bg: "from-[hsl(200,100%,50%)]/20 to-[hsl(260,80%,60%)]/10", border: "border-[hsl(200,100%,50%)]/15", accent: "bg-[hsl(200,100%,50%)]" },
                { bg: "from-[hsl(340,80%,55%)]/15 to-primary/10", border: "border-[hsl(340,80%,55%)]/15", accent: "bg-[hsl(340,80%,55%)]" },
                { bg: "from-[hsl(45,100%,50%)]/15 to-[hsl(340,80%,55%)]/10", border: "border-[hsl(45,100%,50%)]/15", accent: "bg-[hsl(45,100%,50%)]" },
                { bg: "from-primary/15 to-[hsl(260,80%,60%)]/10", border: "border-primary/10", accent: "bg-primary" },
              ];
              const ic = iconColors[index % 6];
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="group p-5 lg:p-7 rounded-3xl bg-background/95 dark:bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 shadow-[0_2px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:shadow-none dark:hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden"
                >
                  {/* Colored top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${ic.accent} opacity-0 group-hover:opacity-80 transition-opacity duration-500 rounded-t-3xl`} />
                  
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ic.bg} flex items-center justify-center mb-5 ${ic.border} border transition-all duration-300`}>
                    <service.icon size={26} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-primary-foreground bg-gradient-to-r from-primary to-[hsl(200,100%,50%)] rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_25px_hsl(var(--primary)/0.3)] shadow-sm"
            >
              {c("viewAllServices", "home.viewAllServices")} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tl from-[hsl(260,40%,96%)] via-[hsl(45,20%,98%)] to-[hsl(185,40%,96%)] dark:from-transparent dark:to-transparent" />
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[hsl(45,100%,55%)]/[0.05] blur-[80px] dark:hidden" />
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-[hsl(260,80%,60%)]/[0.05] blur-[80px] dark:hidden" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.span 
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase mb-4 px-5 py-2 bg-gradient-to-r from-[hsl(260,80%,60%)]/10 to-primary/10 border border-[hsl(260,80%,60%)]/15 rounded-full"
              whileInView={{ scale: [0.95, 1] }}
              viewport={{ once: true }}
            >
              <span className="w-2 h-2 rounded-full bg-[hsl(260,80%,60%)] animate-pulse" />
              <span className="text-[hsl(260,80%,60%)] dark:text-primary">{c("whyChoose", "home.whyChoose")}</span>
            </motion.span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              {c("builtFor", "home.builtFor")} <span className="gradient-text">{c("yourSuccess", "home.yourSuccess")}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {whyChooseUs.map((item, index) => {
              const cardStyles = [
                { grad: "from-primary/[0.12] to-[hsl(200,100%,50%)]/[0.06]", iconBg: "from-primary/20 to-[hsl(200,100%,50%)]/10", borderH: "hover:border-primary/40" },
                { grad: "from-[hsl(260,80%,60%)]/[0.10] to-[hsl(340,80%,55%)]/[0.05]", iconBg: "from-[hsl(260,80%,60%)]/20 to-[hsl(340,80%,55%)]/10", borderH: "hover:border-[hsl(260,80%,60%)]/40" },
                { grad: "from-[hsl(340,80%,55%)]/[0.08] to-[hsl(45,100%,50%)]/[0.05]", iconBg: "from-[hsl(340,80%,55%)]/15 to-[hsl(45,100%,50%)]/10", borderH: "hover:border-[hsl(340,80%,55%)]/30" },
                { grad: "from-[hsl(45,100%,50%)]/[0.10] to-primary/[0.05]", iconBg: "from-[hsl(45,100%,50%)]/20 to-primary/10", borderH: "hover:border-[hsl(45,100%,50%)]/40" },
                { grad: "from-[hsl(200,100%,50%)]/[0.10] to-[hsl(260,80%,60%)]/[0.05]", iconBg: "from-[hsl(200,100%,50%)]/20 to-[hsl(260,80%,60%)]/10", borderH: "hover:border-[hsl(200,100%,50%)]/40" },
              ];
              const cs = cardStyles[index % 5];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`group p-6 lg:p-7 rounded-3xl bg-background/95 dark:bg-card/60 backdrop-blur-sm border border-border/50 ${cs.borderH} shadow-[0_2px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:shadow-none dark:hover:shadow-lg transition-all duration-500 relative overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cs.grad} opacity-60 dark:opacity-20`} />
                  <div className="relative z-10">
                    <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${cs.iconBg} flex items-center justify-center mb-4 w-12 h-12`}>
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
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(185,50%,96%)] via-[hsl(340,15%,97%)] to-[hsl(260,30%,96%)] dark:from-card/40 dark:via-background dark:to-card/40" />
        <div className="absolute top-10 right-1/4 w-80 h-80 rounded-full bg-[hsl(340,80%,60%)]/[0.04] blur-[100px] dark:hidden" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full bg-primary/[0.05] blur-[100px] dark:hidden" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(340,80%,55%)]/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.span 
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase mb-4 px-5 py-2 bg-gradient-to-r from-[hsl(340,80%,55%)]/10 to-[hsl(45,100%,50%)]/10 border border-[hsl(340,80%,55%)]/15 rounded-full"
              whileInView={{ scale: [0.95, 1] }}
              viewport={{ once: true }}
            >
              <span className="w-2 h-2 rounded-full bg-[hsl(340,80%,55%)] animate-pulse" />
              <span className="text-[hsl(340,80%,55%)] dark:text-primary">{c("testimonials", "home.testimonials")}</span>
            </motion.span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              {c("whatClientsSay", "home.whatClientsSay")} <span className="gradient-text">{c("say", "home.say")}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => {
              const accents = [
                "from-primary/15 to-[hsl(200,100%,50%)]/8",
                "from-[hsl(260,80%,60%)]/12 to-[hsl(340,80%,55%)]/8",
                "from-[hsl(340,80%,55%)]/12 to-[hsl(45,100%,50%)]/8",
              ];
              return (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                  whileHover={{ y: -6 }}
                  className="p-6 lg:p-8 rounded-3xl bg-background/95 dark:bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 shadow-[0_2px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:shadow-none dark:hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Unique corner gradient per card */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${accents[index % 3]} to-transparent rounded-bl-[80px]`} />
                  <div className={`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr ${accents[index % 3]} to-transparent rounded-tr-[60px] opacity-40`} />
                  
                  <Quote size={30} className="text-primary/20 mb-5 relative z-10" />
                  <p className="text-foreground mb-5 leading-relaxed text-sm relative z-10">{testimonial.content}</p>
                  <div className="flex items-center gap-1 mb-3 relative z-10">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={15} className="text-[hsl(45,100%,50%)] fill-[hsl(45,100%,50%)] drop-shadow-sm" />
                    ))}
                  </div>
                  <div className="relative z-10">
                    <p className="font-display font-bold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="py-14 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] font-medium">{c("trustedBy", "home.trustedBy")}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-14 max-w-4xl mx-auto"
          >
            {clientLogos.map((client, index) => (
              <motion.div
                key={client}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-lg font-display font-bold text-muted-foreground/25 hover:text-primary transition-all duration-300 cursor-default"
              >
                {client}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-[hsl(260,80%,60%)]/[0.03] to-[hsl(340,80%,55%)]/[0.04] dark:from-transparent dark:to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center p-10 lg:p-16 rounded-[2rem] relative overflow-hidden"
          >
            {/* Multi-color gradient border */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-[hsl(260,80%,60%)] to-[hsl(340,80%,55%)] rounded-[2rem] p-[2px]">
              <div className="absolute inset-[2px] bg-background/97 dark:bg-background/93 rounded-[calc(2rem-2px)]" />
            </div>
            
            {/* Decorative colorful orbs */}
            <div className="absolute top-4 left-1/4 w-48 h-48 bg-primary/[0.08] rounded-full blur-[70px]" />
            <div className="absolute bottom-4 right-1/4 w-48 h-48 bg-[hsl(260,80%,60%)]/[0.08] rounded-full blur-[70px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[hsl(340,80%,55%)]/[0.04] rounded-full blur-[80px]" />
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-display font-bold mb-5">
                {c("letsBuild", "home.letsBuild")} <span className="gradient-text">{c("brand", "home.brand")}</span>
              </h2>
              <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto leading-relaxed">
                {c("readyTo", "home.readyTo")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-8 py-4 text-primary-foreground rounded-2xl font-semibold transition-all duration-300 hover:shadow-[0_0_35px_hsl(var(--primary)/0.35)] overflow-hidden relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-[hsl(260,80%,60%)] to-[hsl(340,80%,55%)] bg-[length:300%_100%]"
                    animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    {c("freeConsultation", "home.freeConsultation")} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <a
                  href="https://wa.me/8801846484200"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary/5 to-[hsl(260,80%,60%)]/5 dark:bg-transparent border-2 border-primary/20 dark:border-border text-foreground rounded-2xl font-semibold hover:border-primary/40 transition-all duration-300"
                >
                  <MessageCircle size={18} className="text-primary" />
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
