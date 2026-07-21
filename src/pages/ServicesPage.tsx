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
import { usePageHero } from "@/hooks/usePageHero";
import { useServices } from "@/hooks/useServices";
import servicesHeroBg from "@/assets/services-hero-bg-2.jpg.asset.json";


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
  const hero = usePageHero("services");
  const { data: allServices, isLoading } = useServices();

  // Show all active services
  const services = (allServices || []).slice(0, 4);

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
      <section className="relative overflow-hidden -mt-20 pt-28 pb-12 lg:pt-32 lg:pb-16 rounded-b-[2.5rem]">
        {/* Dark base */}
        <div className="absolute inset-0 bg-black" />
        {/* Uploaded background image — only top half */}
        <img
          src={servicesHeroBg.url}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-x-0 top-0 w-full h-full object-cover object-top scale-125"
          style={{ filter: "blur(16px)" }}
        />







        {/* Left decorative image slot — add your image here */}
        <div className="absolute -left-10 top-24 lg:left-4 lg:top-32 w-32 h-32 lg:w-56 lg:h-56 pointer-events-none z-[5]">
          {/* <img src="/your-left-image.png" alt="" className="w-full h-full object-contain" /> */}
        </div>

        {/* Right decorative image slot — add your image here */}
        <div className="absolute -right-10 -top-4 lg:right-6 lg:top-10 w-36 h-36 lg:w-64 lg:h-64 pointer-events-none z-[5]">
          {/* <img src="/your-right-image.png" alt="" className="w-full h-full object-contain" /> */}
        </div>


        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.05] text-white mb-6"
            >
              <span className="font-normal" style={{ fontFamily: "'Mea Culpa', cursive" }}>{hero("hero.title", t("services.title"))}</span>{" "}
              {hero("hero.title2", t("services.title2"))}
              <br />
              {hero("hero.title3", t("services.title3"))}{" "}
              <span className="font-normal gradient-text" style={{ fontFamily: "'Mea Culpa', cursive" }}>{hero("hero.title4", "Matter")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base lg:text-lg text-white/60 max-w-2xl mx-auto"
            >
              {hero("hero.description", t("services.description"))}
            </motion.p>
          </div>
        </div>
      </section>


      {/* Services */}
      <section className="py-20 lg:py-28 relative bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">
                {t("language") === "bn" ? "আমরা যা করি" : "What We Do"}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.1] mb-4">
                {t("language") === "bn" ? "আমাদের সার্ভিস" : "Our Services"}
              </h2>
              <p className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto">
                {t("language") === "bn"
                  ? "ব্র্যান্ড থেকে ডিজিটাল প্রোডাক্ট — সব সমাধান এক ছাদের নিচে।"
                  : "From brand identity to digital products — everything under one roof."}
              </p>
            </motion.div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !services || services.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No services found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {services.map((service, index) => {
                  const IconComponent = getIcon(service.icon);
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="group relative bg-card rounded-2xl border border-border/60 p-8 lg:p-10 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                          <IconComponent size={24} className="text-primary" />
                        </div>
                        <h3 className="text-2xl font-display font-semibold tracking-tight">{service.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                      {service.features && service.features.length > 0 && (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                          {service.features.slice(0, 6).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                              <CheckCircle size={14} className="text-primary shrink-0" strokeWidth={2.5} />
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
          </div>
        </div>
      </section>


      {/* Process — Astryx horizontal rail */}
      <section className="py-24 lg:py-32 relative bg-muted/20 border-y border-border/60">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-background mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight leading-[1.05] mb-5">
                {t("services.process.title")}
              </h2>
              <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                {t("services.process.desc")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/60 rounded-2xl overflow-hidden border border-border/60">
              {processSteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-background hover:bg-muted/40 transition-colors p-8 lg:p-10 group relative"
                >
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[11px] font-mono font-semibold text-primary tracking-widest">{item.step}</span>
                    <div className="w-9 h-9 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center group-hover:border-primary/30 transition-all">
                      <item.icon size={15} className="text-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg lg:text-xl font-display font-semibold tracking-tight mb-2">{t(item.titleKey)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t(item.descKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us — Astryx list-grid */}
      <section className="py-24 lg:py-32 relative bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16"
            >
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-muted/40 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                    {t("language") === "bn" ? "কেন আমরা" : "Why Us"}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight leading-[1.05]">
                  {t("language") === "bn" ? (
                    <>আপনার জন্য <span className="text-muted-foreground">আমরাই সেরা।</span></>
                  ) : (
                    <>The details that <span className="text-muted-foreground">set us apart.</span></>
                  )}
                </h2>
              </div>
              <p className="text-muted-foreground text-base lg:text-lg max-w-md leading-relaxed">
                {t("language") === "bn"
                  ? "মান, গতি এবং যত্ন — প্রতিটি প্রজেক্টে আমাদের প্রতিশ্রুতি।"
                  : "Quality, speed, and care — the commitments we honor on every engagement."}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 rounded-2xl overflow-hidden border border-border/60">
              {[
                { icon: Award, title: t("language") === "bn" ? "প্রিমিয়াম কোয়ালিটি" : "Premium Quality", desc: t("language") === "bn" ? "প্রতিটি ডিজাইন ও কোড হাতে বানানো, ইন্ডাস্ট্রি স্ট্যান্ডার্ড মেনে তৈরি।" : "Every design and line of code is crafted to match global industry standards." },
                { icon: Zap, title: t("language") === "bn" ? "দ্রুত ডেলিভারি" : "Fast Delivery", desc: t("language") === "bn" ? "সময়ের আগেই সঠিক কাজ — আপনার ডেডলাইন আমাদের কাছে সবচেয়ে গুরুত্বপূর্ণ।" : "On-time, every time. Your deadline is our top priority from day one." },
                { icon: Shield, title: t("language") === "bn" ? "১০০% নিরাপত্তা" : "100% Secure", desc: t("language") === "bn" ? "আপনার ডেটা ও প্রজেক্ট সম্পূর্ণ সুরক্ষিত, এন্টারপ্রাইজ-গ্রেড সিকিউরিটি সহ।" : "Data and projects are fully protected with enterprise-grade security." },
                { icon: Heart, title: t("language") === "bn" ? "২৪/৭ সাপোর্ট" : "24/7 Support", desc: t("language") === "bn" ? "যেকোনো সময় আমাদের টিম আপনার পাশে — কল, চ্যাট বা ইমেইলে।" : "Our team stands by you anytime — over call, chat, or email." },
                { icon: Users, title: t("language") === "bn" ? "অভিজ্ঞ টিম" : "Expert Team", desc: t("language") === "bn" ? "ডিজাইনার, ডেভেলপার ও মার্কেটার — সবাই তাদের ফিল্ডের সেরা।" : "Designers, developers, and marketers — each an expert in their craft." },
                { icon: Star, title: t("language") === "bn" ? "সন্তুষ্ট ক্লায়েন্ট" : "Happy Clients", desc: t("language") === "bn" ? "শত শত ক্লায়েন্টের বিশ্বাস — কারণ আমরা কথা রাখি।" : "Trusted by hundreds of clients — because we keep our promises." },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-background hover:bg-muted/40 transition-colors p-8 lg:p-10 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center mb-6 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                    <item.icon size={16} className="text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-display font-semibold tracking-tight mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>



    </LayoutComponent>
  );
};

export default ServicesPage;
