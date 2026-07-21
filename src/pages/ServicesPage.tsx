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


      {/* Dynamic Services — Editorial split layout */}
      <section className="py-20 lg:py-28 relative bg-[#f2f2f3]">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : !services || services.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No services found.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                {/* Left — sticky heading + CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-5 lg:sticky lg:top-32"
                >
                  <div className="flex items-center gap-2 mb-6 text-foreground/60">
                    <span className="text-xs">›</span>
                    <span className="text-[11px] font-semibold tracking-[0.28em] uppercase">What We Do</span>
                    <span className="text-xs">‹</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.05] tracking-tight text-foreground mb-10">
                    Services built<br />to drive impact
                  </h2>
                  <div className="relative inline-block">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold shadow-[0_10px_30px_-10px_rgba(6,182,212,0.55)] hover:shadow-[0_14px_34px_-10px_rgba(37,99,235,0.6)] hover:scale-[1.03] transition-all"
                      style={{ background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)" }}
                    >
                      Discuss your ideas
                    </Link>
                    {/* Squiggle note */}
                    <svg className="absolute -right-40 top-1/2 pointer-events-none hidden sm:block" width="150" height="60" viewBox="0 0 150 60" fill="none">
                      <defs>
                        <linearGradient id="squiggleGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                      </defs>
                      <path d="M 5 5 C 20 20, 40 30, 70 35" stroke="url(#squiggleGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      <path d="M 65 30 L 70 35 L 62 38" stroke="url(#squiggleGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="72" y="44" fill="url(#squiggleGrad)" style={{ fontFamily: "'Caveat', cursive", fontSize: '22px', fontWeight: 600 }}>Let's get started</text>
                    </svg>
                  </div>
                </motion.div>

                <div className="lg:col-span-7 space-y-5">
                  {services.map((service, index) => {
                    const IconComponent = getIcon(service.icon);
                    const palettes = [
                      { from: "#22D3EE", to: "#2563EB", tint: "rgba(34,211,238,0.10)" },
                      { from: "#A78BFA", to: "#7C3AED", tint: "rgba(167,139,250,0.10)" },
                      { from: "#F472B6", to: "#EC4899", tint: "rgba(244,114,182,0.10)" },
                      { from: "#F59E0B", to: "#EF4444", tint: "rgba(245,158,11,0.10)" },
                    ];
                    const p = palettes[index % palettes.length];
                    return (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 }}
                        whileHover={{ y: -4 }}
                        className="group relative bg-white rounded-2xl p-7 lg:p-8 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.12)] hover:shadow-[0_28px_70px_-25px_rgba(0,0,0,0.22)] transition-all overflow-hidden border border-black/[0.04]"
                      >
                        {/* accent glow */}
                        <div
                          className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500"
                          style={{ background: `radial-gradient(circle, ${p.from}, transparent 70%)` }}
                        />
                        {/* left accent bar */}
                        <div
                          className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: `linear-gradient(180deg, ${p.from}, ${p.to})` }}
                        />

                        <div className="relative flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono tracking-[0.2em] text-foreground/40">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <h3 className="text-xl lg:text-2xl font-display font-bold text-foreground">{service.title}</h3>
                          </div>
                          <div
                            className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center border transition-all group-hover:scale-105"
                            style={{
                              background: p.tint,
                              borderColor: `${p.from}33`,
                            }}
                          >
                            <IconComponent
                              size={20}
                              style={{ color: p.to }}
                            />
                          </div>
                        </div>

                        <div
                          className="h-px mb-5"
                          style={{
                            background: `linear-gradient(90deg, ${p.from}55, transparent)`,
                          }}
                        />

                        <p className="relative text-foreground/60 text-sm lg:text-[15px] leading-relaxed mb-6">
                          {service.description}
                        </p>
                        {service.features && service.features.length > 0 && (
                          <div className="relative flex flex-wrap gap-2">
                            {service.features.slice(0, 4).map((feature, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.15em] uppercase transition-all"
                                style={{
                                  border: `1px solid ${p.from}30`,
                                  color: "rgba(0,0,0,0.65)",
                                  background: `linear-gradient(180deg, #fff, ${p.tint})`,
                                }}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Process Section — editorial numbered */}
      <section className="py-28 lg:py-40 relative mesh-bg">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/[0.06] mb-8">
                <Zap size={16} className="text-primary" />
                <span className="text-sm font-bold tracking-[0.25em] uppercase text-primary">Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold leading-[1.05]">{t("services.process.title")}</h2>
              <p className="text-muted-foreground text-base lg:text-lg max-w-3xl mx-auto mt-6">{t("services.process.desc")}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {processSteps.map((item, index) => (
                <motion.div key={item.step} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="p-8 lg:p-10 rounded-3xl glass-card relative overflow-hidden group min-h-[280px] lg:min-h-[340px]">
                  <span className="absolute -top-2 -right-2 text-[8rem] lg:text-[10rem] font-display font-bold text-primary/[0.06] leading-none group-hover:text-primary/[0.12] transition-colors">{item.step}</span>
                  <div className="relative z-10">
                    <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-primary/[0.1] flex items-center justify-center mb-6 group-hover:bg-primary/[0.18] group-hover:scale-110 transition-all">
                      <item.icon size={26} className="text-primary" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-display font-bold mb-3">{t(item.titleKey)}</h3>
                    <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">{t(item.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why We Are Best For You */}
      <section className="py-28 lg:py-40 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/[0.06] mb-8">
                <Award size={16} className="text-primary" />
                <span className="text-sm font-bold tracking-[0.25em] uppercase text-primary">
                  {t("language") === "bn" ? "কেন আমরা" : "Why Us"}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold leading-[1.05]">
                {t("language") === "bn" ? (
                  <>আপনার জন্য আমরাই <span className="gradient-text">সেরা</span></>
                ) : (
                  <>Why We Are <span className="gradient-text">Best For You</span></>
                )}
              </h2>
              <p className="text-muted-foreground text-base lg:text-lg max-w-3xl mx-auto mt-6">
                {t("language") === "bn"
                  ? "মান, গতি এবং যত্ন — প্রতিটি প্রজেক্টে আমাদের প্রতিশ্রুতি।"
                  : "Quality, speed, and care — our commitment in every project we deliver."}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: Award,
                  title: t("language") === "bn" ? "প্রিমিয়াম কোয়ালিটি" : "Premium Quality",
                  desc: t("language") === "bn"
                    ? "প্রতিটি ডিজাইন ও কোড হাতে বানানো, ইন্ডাস্ট্রি স্ট্যান্ডার্ড মেনে তৈরি।"
                    : "Every design and line of code is crafted to match global industry standards.",
                },
                {
                  icon: Zap,
                  title: t("language") === "bn" ? "দ্রুত ডেলিভারি" : "Fast Delivery",
                  desc: t("language") === "bn"
                    ? "সময়ের আগেই সঠিক কাজ — আপনার ডেডলাইন আমাদের কাছে সবচেয়ে গুরুত্বপূর্ণ।"
                    : "On-time, every time. Your deadline is our top priority from day one.",
                },
                {
                  icon: Shield,
                  title: t("language") === "bn" ? "১০০% নিরাপত্তা" : "100% Secure",
                  desc: t("language") === "bn"
                    ? "আপনার ডেটা ও প্রজেক্ট সম্পূর্ণ সুরক্ষিত, এন্টারপ্রাইজ-গ্রেড সিকিউরিটি সহ।"
                    : "Your data and projects are fully protected with enterprise-grade security.",
                },
                {
                  icon: Heart,
                  title: t("language") === "bn" ? "২৪/৭ সাপোর্ট" : "24/7 Support",
                  desc: t("language") === "bn"
                    ? "যেকোনো সময় আমাদের টিম আপনার পাশে — কল, চ্যাট বা ইমেইলে।"
                    : "Our team stands by you anytime — over call, chat, or email.",
                },
                {
                  icon: Users,
                  title: t("language") === "bn" ? "অভিজ্ঞ টিম" : "Expert Team",
                  desc: t("language") === "bn"
                    ? "ডিজাইনার, ডেভেলপার ও মার্কেটার — সবাই তাদের ফিল্ডের সেরা।"
                    : "Designers, developers, and marketers — each an expert in their craft.",
                },
                {
                  icon: Star,
                  title: t("language") === "bn" ? "সন্তুষ্ট ক্লায়েন্ট" : "Happy Clients",
                  desc: t("language") === "bn"
                    ? "শত শত ক্লায়েন্টের বিশ্বাস — কারণ আমরা কথা রাখি।"
                    : "Trusted by hundreds of clients — because we keep our promises.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="p-8 lg:p-10 rounded-3xl glass-card group relative overflow-hidden"
                >
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/[0.08] blur-3xl group-hover:bg-primary/[0.18] transition-all" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-primary/[0.1] flex items-center justify-center mb-6 group-hover:bg-primary/[0.18] group-hover:scale-110 transition-all">
                      <item.icon size={26} className="text-primary" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-display font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">{item.desc}</p>
                  </div>
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
