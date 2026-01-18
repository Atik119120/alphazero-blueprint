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
  Globe,
  TrendingUp,
  Share2,
  PenTool,
  Monitor,
  ShoppingCart,
  Search,
  Star,
  Quote,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Mail,
  Clock,
  Twitter
} from "lucide-react";
import { Link } from "react-router-dom";
import LayoutComponent from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const clientLogos = [
  "TechStart", "GreenLeaf", "Bloom Co", "NextGen", "Spark Digital", "CloudNine"
];

const Index = () => {
  const { t } = useLanguage();

  const whyChooseUs = [
    { icon: Palette, title: t("home.why.clean"), description: t("home.why.cleanDesc") },
    { icon: Eye, title: t("home.why.brand"), description: t("home.why.brandDesc") },
    { icon: Target, title: t("home.why.detail"), description: t("home.why.detailDesc") },
    { icon: MessageSquare, title: t("home.why.client"), description: t("home.why.clientDesc") },
    { icon: Gem, title: t("home.why.zero"), description: t("home.why.zeroDesc") },
  ];

  const services = [
    { icon: Layout, title: t("home.service.uiux"), description: t("home.service.uiuxDesc") },
    { icon: Search, title: t("home.service.seo"), description: t("home.service.seoDesc") },
    { icon: Monitor, title: t("home.service.web"), description: t("home.service.webDesc") },
    { icon: ShoppingCart, title: t("home.service.ecommerce"), description: t("home.service.ecommerceDesc") },
    { icon: Share2, title: t("home.service.social"), description: t("home.service.socialDesc") },
    { icon: PenTool, title: t("home.service.branding"), description: t("home.service.brandingDesc") },
  ];

  const stats = [
    { value: "50+", label: t("home.stats.projects") },
    { value: "30+", label: t("home.stats.clients") },
    { value: "3+", label: t("home.stats.years") },
    { value: "100%", label: t("home.stats.satisfaction") },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      content: "AlphaZero transformed our brand completely. Their attention to detail and creative vision exceeded our expectations.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Founder, GreenLeaf",
      content: "Professional, responsive, and incredibly talented. They delivered our website ahead of schedule with stunning results.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director, Bloom Co",
      content: "The best design agency we've worked with. Their social media designs increased our engagement by 300%.",
      rating: 5
    },
  ];

  return (
    <LayoutComponent>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:80px_80px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-primary/20 mb-8 backdrop-blur-sm"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-sm text-foreground">{t("home.badge")}</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight mb-6"
            >
              {t("home.title1")}{" "}
              <span className="gradient-text">{t("home.title2")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-primary mb-8"
            >
              {t("home.tagline")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12"
            >
              {t("home.description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/contact"
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2"
              >
                {t("home.cta1")}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/work"
                className="px-8 py-4 bg-transparent border border-border text-foreground rounded-xl font-medium text-lg hover:bg-secondary hover:border-primary/30 transition-all duration-300"
              >
                {t("home.cta2")}
              </Link>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center justify-center gap-3 mt-10"
            >
              <a
                href="https://www.facebook.com/share/1Zm7yMhPtk/"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://wa.me/8801846484200"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all duration-300"
              >
                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="mailto:agency.alphazero@gmail.com"
                className="group w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Mail size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://www.instagram.com/alphazero.online"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#F77737] hover:border-transparent hover:text-white transition-all duration-300"
              >
                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://x.com/AgencyAlphazero"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-black hover:border-transparent hover:text-white transition-all duration-300"
              >
                <Twitter size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <div className="relative group w-12 h-12 rounded-full bg-secondary/50 border border-border flex items-center justify-center cursor-not-allowed">
                <Linkedin size={20} className="text-muted-foreground" />
                <span className="absolute -top-1 -right-1 flex items-center gap-0.5 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  <Clock size={8} />
                </span>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-primary rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center"
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
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              {t("home.expertise")}
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              {t("home.whatWeDo")} <span className="gradient-text">{t("home.do")}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("home.expertiseDesc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <service.icon size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
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
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t("home.viewAllServices")} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              {t("home.whyChoose")}
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              {t("home.builtFor")} <span className="gradient-text">{t("home.yourSuccess")}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-card/80 border border-border hover:border-primary/30 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <item.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              {t("home.testimonials")}
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              {t("home.whatClientsSay")} <span className="gradient-text">{t("home.say")}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border"
              >
                <Quote size={32} className="text-primary/20 mb-4" />
                <p className="text-foreground mb-6 leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-primary fill-primary" />
                  ))}
                </div>
                <div>
                  <p className="font-display font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-muted-foreground text-sm uppercase tracking-wider">{t("home.trustedBy")}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-16 max-w-4xl mx-auto"
          >
            {clientLogos.map((client, index) => (
              <motion.div
                key={client}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-xl font-display font-bold text-muted-foreground/50 hover:text-primary/70 transition-colors duration-300"
              >
                {client}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">
              {t("home.letsBuild")} <span className="gradient-text">{t("home.brand")}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t("home.readyTo")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                {t("home.freeConsultation")} <ArrowRight size={20} />
              </Link>
              <a
                href="https://wa.me/8801846484200"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-5 bg-secondary border border-border text-foreground rounded-xl font-medium text-lg hover:bg-secondary/80 transition-all duration-300"
              >
                <MessageCircle size={20} />
                {t("home.whatsappUs")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </LayoutComponent>
  );
};

export default Index;
