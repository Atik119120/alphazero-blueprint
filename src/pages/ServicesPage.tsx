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
import servicesHeroBg from "@/assets/services-hero-bg-5.jpg.asset.json";


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
      <section id="site-hero" className="relative overflow-hidden -mt-20 pt-28 pb-12 lg:pt-32 lg:pb-16 rounded-b-[2.5rem]">
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
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {hero("hero.title", t("services.title"))}{" "}
              {hero("hero.title2", t("services.title2"))}
              <br />
              {hero("hero.title3", t("services.title3"))}{" "}
              <span className="gradient-text">{hero("hero.title4", "Matter")}</span>
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


      {/* Dynamic Services — Musemind-style alternating editorial rows */}
      <section className="py-20 lg:py-28 relative bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : !services || services.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No services found.</div>
            ) : (
              <div className="space-y-28 lg:space-y-36">
                {services.map((service, index) => {
                  const IconComponent = getIcon(service.icon);
                  const isEven = index % 2 === 0;
                  const palettes = [
                    { bg: "#EFE9FF", accent: "#7C3AED" }, // purple
                    { bg: "#FDE4EC", accent: "#EC4899" }, // pink
                    { bg: "#DFF5E1", accent: "#10B981" }, // green
                    { bg: "#FEF3C7", accent: "#F59E0B" }, // amber
                  ];
                  const palette = palettes[index % palettes.length];

                  const TextSide = (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.6 }}
                      className="flex flex-col justify-center"
                    >
                      <h3 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-[1.05] tracking-tight mb-6">
                        {service.title}
                      </h3>
                      <p className="text-foreground/60 text-base lg:text-lg leading-relaxed mb-10 max-w-[52ch]">
                        {service.description}
                      </p>

                      {service.features && service.features.length > 0 && (
                        <ul className="divide-y divide-foreground/10 border-t border-foreground/10">
                          {service.features.slice(0, 8).map((feature, idx) => (
                            <li
                              key={idx}
                              className="group flex items-center justify-between py-5 cursor-pointer"
                            >
                              <div className="flex items-center gap-6">
                                <span className="text-sm font-mono text-foreground/40 tabular-nums">
                                  {String(idx + 1).padStart(2, "0")}
                                </span>
                                <span className="text-lg lg:text-xl font-semibold text-foreground group-hover:translate-x-1 transition-transform">
                                  {feature}
                                </span>
                              </div>
                              <ArrowRight
                                size={20}
                                className="text-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all"
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  );

                  const VisualSide = (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.7 }}
                      className="relative rounded-[32px] overflow-hidden aspect-[4/5] lg:aspect-[5/6] flex items-center justify-center"
                      style={{ background: palette.bg }}
                    >
                      {/* soft blurred orbs */}
                      <div
                        className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-40"
                        style={{ background: palette.accent }}
                      />
                      <div
                        className="absolute -bottom-20 -right-16 w-72 h-72 rounded-full blur-3xl opacity-30"
                        style={{ background: palette.accent }}
                      />

                      {/* Center icon medallion */}
                      <div className="relative z-10 flex flex-col items-center gap-6">
                        <div
                          className="w-28 h-28 lg:w-36 lg:h-36 rounded-3xl bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)] flex items-center justify-center"
                        >
                          <IconComponent size={56} style={{ color: palette.accent }} />
                        </div>
                        <span
                          className="text-xs font-bold tracking-[0.3em] uppercase"
                          style={{ color: palette.accent }}
                        >
                          {String(index + 1).padStart(2, "0")} · Service
                        </span>
                      </div>

                      {/* floating chips */}
                      {service.features?.slice(0, 2).map((f, i) => (
                        <div
                          key={i}
                          className={`absolute z-10 bg-white rounded-full px-4 py-2 shadow-lg text-xs font-semibold text-foreground/80 ${
                            i === 0 ? "top-10 right-8" : "bottom-10 left-8"
                          }`}
                        >
                          {f}
                        </div>
                      ))}
                    </motion.div>
                  );

                  return (
                    <div
                      key={service.id}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-stretch"
                    >
                      {isEven ? (
                        <>
                          {VisualSide}
                          {TextSide}
                        </>
                      ) : (
                        <>
                          {TextSide}
                          {VisualSide}
                        </>
                      )}
                    </div>
                  );
                })}
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
