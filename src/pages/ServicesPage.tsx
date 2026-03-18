import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Palette, 
  Layers, 
  Smartphone, 
  Image, 
  FileText,
  Layout,
  MessageCircle,
  ArrowRight,
  Monitor,
  ShoppingCart,
  Search,
  Share2,
  PenTool,
  Code,
  Zap,
  CheckCircle,
  Video,
  TrendingUp,
  Target,
  BarChart3,
  Film,
  Clapperboard,
  Megaphone,
  Users,
  Laptop,
  FileSpreadsheet,
  Presentation,
  Database,
  Printer,
  Loader2,
  Sparkles,
  Globe,
  Mail,
  Phone,
  Settings,
  Shield,
  Award,
  Heart,
  Star
} from "lucide-react";
import LayoutComponent from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useServices } from "@/hooks/useServices";

// Icon mapping for dynamic services
const iconMap: Record<string, typeof Sparkles> = {
  Palette, Layers, Smartphone, Image, FileText, Layout, MessageCircle,
  Monitor, ShoppingCart, Search, Share2, PenTool, Code, Zap, Video,
  TrendingUp, Target, BarChart3, Film, Clapperboard, Megaphone, Users,
  Laptop, FileSpreadsheet, Presentation, Database, Printer, Sparkles,
  Globe, Mail, Phone, Settings, Shield, Award, Heart, Star, CheckCircle
};

const ServicesPage = () => {
  const { t } = useLanguage();
  const { data: services, isLoading } = useServices();

  const processSteps = [
    { step: "01", titleKey: "services.process.discover", descKey: "services.process.discoverDesc", icon: Search },
    { step: "02", titleKey: "services.process.design", descKey: "services.process.designDesc", icon: PenTool },
    { step: "03", titleKey: "services.process.develop", descKey: "services.process.developDesc", icon: Code },
    { step: "04", titleKey: "services.process.deliver", descKey: "services.process.deliverDesc", icon: Zap },
  ];

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Sparkles;
    return iconMap[iconName] || Sparkles;
  };

  return (
    <LayoutComponent>
      {/* Hero */}
      <section className="py-28 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/[0.06] backdrop-blur-sm mb-8">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{t("services.subtitle")}</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              {t("services.title")} <span className="gradient-text">{t("services.title2")}</span> {t("services.title3")}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("services.description")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Dynamic Services Grid — editorial */}
      <section className="py-20 lg:py-28 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-6">
                <Zap size={14} className="text-primary" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">What We Offer</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-display font-bold">{t("services.whatWeOffer")}</h2>
              <p className="text-muted-foreground max-w-lg mx-auto mt-4">{t("services.whatWeOfferDesc")}</p>
            </motion.div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : !services || services.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No services found.</div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {services.map((service, index) => {
                  const IconComponent = getIcon(service.icon);
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ y: -4 }}
                      className="group p-5 lg:p-7 rounded-2xl glass-card hover:border-primary/30 transition-all duration-400 relative overflow-hidden"
                    >
                      <span className="absolute top-4 right-4 text-[10px] font-mono font-bold text-muted-foreground/30 tracking-wider">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-primary/[0.08] dark:bg-primary/[0.1] flex items-center justify-center mb-5 border border-primary/10">
                        <IconComponent size={22} className="text-primary" />
                      </div>
                      <h3 className="text-base lg:text-lg font-display font-bold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{service.description}</p>
                      {service.features && service.features.length > 0 && (
                        <ul className="space-y-1.5 mb-4">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                      {/* See Pricing link */}
                      <Link
                        to={
                          service.title?.toLowerCase().includes("web") ||
                          service.title?.toLowerCase().includes("e-commerce") ||
                          service.title?.toLowerCase().includes("ecommerce") ||
                          service.title?.toLowerCase().includes("custom") ||
                          service.title?.toLowerCase().includes("development") ||
                          service.icon === "Monitor" ||
                          service.icon === "Code" ||
                          service.icon === "ShoppingCart" ||
                          service.icon === "Globe" ||
                          service.icon === "Laptop"
                            ? "/pricing#web"
                            : "/pricing#graphic"
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2.5 transition-all duration-200"
                      >
                        {t("language") === "bn" ? "মূল্য দেখুন" : "See Pricing"} <ArrowRight size={12} />
                      </Link>
                      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Portfolio Builder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <div className="relative p-5 md:p-6 rounded-xl border border-primary/20 bg-primary/[0.03] dark:bg-primary/[0.05]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-10 h-10 rounded-lg bg-primary/[0.1] flex items-center justify-center flex-shrink-0 border border-primary/10">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold">
                        {t("language") === "bn" ? "আপনার নিজের Portfolio তৈরি করুন!" : "Create Your Own Portfolio!"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("language") === "bn" ? "লগইন করে সহজেই পোর্টফোলিও ওয়েবসাইট বানান" : "Login and easily build your portfolio website"}
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://portfolio.alphazero.online/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold text-sm transition-all duration-300 hover:opacity-90"
                  >
                    {t("language") === "bn" ? "তৈরি করুন" : "Create Now"}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section — editorial numbered */}
      <section className="py-24 lg:py-32 relative mesh-bg">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-6">
                <Zap size={14} className="text-primary" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Process</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-display font-bold">{t("services.process.title")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">{t("services.process.desc")}</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {processSteps.map((item, index) => (
                <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl glass-card relative overflow-hidden">
                  <span className="absolute top-3 right-3 text-5xl font-display font-bold text-muted-foreground/[0.04] leading-none">{item.step}</span>
                  <div className="w-10 h-10 rounded-lg bg-primary/[0.08] flex items-center justify-center mb-4">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <h3 className="text-base font-display font-bold mb-1">{t(item.titleKey)}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{t(item.descKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section — clean */}
      <section className="py-24 lg:py-36 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">{t("services.cta.title")}</h2>
            <p className="text-muted-foreground text-lg mb-10">{t("services.cta.desc")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg transition-all duration-300 glow-primary hover:scale-[1.02]">
                {t("services.cta.btn1")} <ArrowRight size={20} />
              </Link>
              <a href="https://wa.me/8801712345678" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 border-2 border-border text-foreground rounded-full font-semibold text-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
                {t("services.cta.btn2")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </LayoutComponent>
  );
};

export default ServicesPage;
