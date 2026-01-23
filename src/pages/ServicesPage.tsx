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
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block"
            >
              {t("services.subtitle")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-display font-bold mb-6"
            >
              {t("services.title")} <span className="gradient-text">{t("services.title2")}</span> {t("services.title3")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              {t("services.description")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Dynamic Services Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-display font-bold mb-4">{t("services.whatWeOffer")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("services.whatWeOfferDesc")}
              </p>
            </motion.div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : !services || services.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No services found.
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {services.map((service, index) => {
                  const IconComponent = getIcon(service.icon);
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                        <IconComponent size={32} className="text-primary" />
                      </div>
                      <h3 className="text-xl font-display font-semibold mb-3">{service.title}</h3>
                      <p className="text-muted-foreground mb-6">{service.description}</p>
                      {service.features && service.features.length > 0 && (
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle size={14} className="text-primary flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Portfolio Builder - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <div className="relative p-5 md:p-6 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 overflow-hidden">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold">
                        {t("language") === "bn" 
                          ? "আপনার নিজের Portfolio তৈরি করুন!" 
                          : "Create Your Own Portfolio!"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("language") === "bn" 
                          ? "লগইন করে সহজেই পোর্টফোলিও ওয়েবসাইট বানান" 
                          : "Login and easily build your portfolio website"}
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://portfolio.alphazero.online/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                  >
                    {t("language") === "bn" ? "তৈরি করুন" : "Create Now"}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
                {t("services.process.title")}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("services.process.desc")}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {processSteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon size={24} className="text-primary" />
                  </div>
                  <div className="text-3xl font-display font-bold gradient-text mb-2">{item.step}</div>
                  <h3 className="text-xl font-display font-semibold mb-2">{t(item.titleKey)}</h3>
                  <p className="text-muted-foreground text-sm">{t(item.descKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
              {t("services.cta.title")}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t("services.cta.desc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                {t("services.cta.btn1")} <ArrowRight size={20} />
              </Link>
              <a
                href="https://wa.me/8801712345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary border border-border text-foreground rounded-xl font-medium text-lg hover:bg-secondary/80 transition-all duration-300"
              >
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
