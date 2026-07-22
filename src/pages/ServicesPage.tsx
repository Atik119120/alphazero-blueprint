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
  Star,
  Plus,
  Minus
} from "lucide-react";
import { useState } from "react";
import LayoutComponent from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageHero } from "@/hooks/usePageHero";
import { useServices } from "@/hooks/useServices";
import servicesHeroBg from "@/assets/services-hero-bg-5.jpg.asset.json";
import brandIdentityImage from "@/assets/brand-identity-showcase.jpg.asset.json";
import productUIImage from "@/assets/product-ui-showcase.jpg.asset.json";
import webDevImage from "@/assets/web-dev-showcase.jpg.asset.json";
import seoMarketingImage from "@/assets/seo-marketing-showcase.png.asset.json";


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

                  const titleLower = (service.title || "").toLowerCase();
                  const isBrandIdentity =
                    titleLower.includes("brand") ||
                    titleLower.includes("identity") ||
                    titleLower.includes("illustration") ||
                    titleLower.includes("ব্র্যান্ড") ||
                    titleLower.includes("ইলাস্ট্রেশন");
                  const isProductUI =
                    titleLower.includes("product") ||
                    titleLower.includes("ui") ||
                    titleLower.includes("ux") ||
                    titleLower.includes("প্রোডাক্ট") ||
                    titleLower.includes("ইউআই");
                  const isWebDev =
                    titleLower.includes("web") ||
                    titleLower.includes("development") ||
                    titleLower.includes("ওয়েব");
                  const isSEO =
                    titleLower.includes("seo") ||
                    titleLower.includes("marketing") ||
                    titleLower.includes("content") ||
                    titleLower.includes("মার্কেটিং");
                  const customImage = isBrandIdentity
                    ? brandIdentityImage.url
                    : isWebDev
                    ? webDevImage.url
                    : isProductUI
                    ? productUIImage.url
                    : isSEO
                    ? seoMarketingImage.url
                    : null;

                  const VisualSide = (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.7 }}
                      className="relative rounded-[32px] overflow-hidden aspect-[4/5] lg:aspect-[5/6] flex items-center justify-center"
                      style={{ background: customImage ? "#0a0a0a" : palette.bg }}
                    >
                      {customImage ? (
                        <img
                          src={customImage}
                          alt={service.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <>
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
                        </>
                      )}
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
      <section className="py-28 lg:py-40 relative bg-white">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/10 bg-black/[0.03] mb-8">
                <Zap size={16} className="text-black/70" />
                <span className="text-sm font-bold tracking-[0.25em] uppercase text-black/70">Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold leading-[1.05] text-black">{t("services.process.title")}</h2>
              <p className="text-black/50 text-base lg:text-lg max-w-3xl mx-auto mt-6">{t("services.process.desc")}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-black/[0.08] border border-black/[0.08] rounded-2xl overflow-hidden">
              {processSteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="group relative p-8 lg:p-10 min-h-[260px] hover:bg-black/[0.02] transition-colors"
                >
                  <item.icon size={28} strokeWidth={1.5} className="text-black/80 group-hover:text-primary transition-colors mb-8" />
                  <h3 className="text-xl lg:text-2xl font-display font-medium mb-3 text-black">{t(item.titleKey)}</h3>
                  <p className="text-black/50 text-sm leading-relaxed">{t(item.descKey)}</p>
                </motion.div>
              ))}
            </div>

            {/* Why Us grid — merged */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-32 mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/10 bg-black/[0.03] mb-6">
                <Award size={16} className="text-black/70" />
                <span className="text-sm font-bold tracking-[0.25em] uppercase text-black/70">
                  {t("language") === "bn" ? "কেন আমরা" : "Why Us"}
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.1] text-black">
                {t("language") === "bn" ? (
                  <>আপনার জন্য আমরাই <span className="gradient-text">সেরা</span></>
                ) : (
                  <>Why We Are <span className="gradient-text">Best For You</span></>
                )}
              </h3>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/[0.08] border border-black/[0.08] rounded-2xl overflow-hidden [&>*:nth-child(n+4)]:md:border-t [&>*:nth-child(n+4)]:md:border-black/[0.08]">
              {[
                { icon: Award, title: t("language") === "bn" ? "প্রিমিয়াম কোয়ালিটি" : "Premium Quality", desc: t("language") === "bn" ? "প্রতিটি ডিজাইন ও কোড হাতে বানানো, ইন্ডাস্ট্রি স্ট্যান্ডার্ড মেনে তৈরি।" : "Every design and line of code is crafted to match global industry standards." },
                { icon: Zap, title: t("language") === "bn" ? "দ্রুত ডেলিভারি" : "Fast Delivery", desc: t("language") === "bn" ? "সময়ের আগেই সঠিক কাজ — আপনার ডেডলাইন আমাদের কাছে সবচেয়ে গুরুত্বপূর্ণ।" : "On-time, every time. Your deadline is our top priority from day one." },
                { icon: Shield, title: t("language") === "bn" ? "১০০% নিরাপত্তা" : "100% Secure", desc: t("language") === "bn" ? "আপনার ডেটা ও প্রজেক্ট সম্পূর্ণ সুরক্ষিত, এন্টারপ্রাইজ-গ্রেড সিকিউরিটি সহ।" : "Your data and projects are fully protected with enterprise-grade security." },
                { icon: Heart, title: t("language") === "bn" ? "২৪/৭ সাপোর্ট" : "24/7 Support", desc: t("language") === "bn" ? "যেকোনো সময় আমাদের টিম আপনার পাশে — কল, চ্যাট বা ইমেইলে।" : "Our team stands by you anytime — over call, chat, or email." },
                { icon: Users, title: t("language") === "bn" ? "অভিজ্ঞ টিম" : "Expert Team", desc: t("language") === "bn" ? "ডিজাইনার, ডেভেলপার ও মার্কেটার — সবাই তাদের ফিল্ডের সেরা।" : "Designers, developers, and marketers — each an expert in their craft." },
                { icon: Star, title: t("language") === "bn" ? "সন্তুষ্ট ক্লায়েন্ট" : "Happy Clients", desc: t("language") === "bn" ? "শত শত ক্লায়েন্টের বিশ্বাস — কারণ আমরা কথা রাখি।" : "Trusted by hundreds of clients — because we keep our promises." },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.5 }}
                  className="group relative p-8 lg:p-10 min-h-[240px] hover:bg-black/[0.02] transition-colors"
                >
                  <item.icon size={28} strokeWidth={1.5} className="text-black/80 group-hover:text-primary transition-colors mb-8" />
                  <h4 className="text-xl lg:text-2xl font-display font-medium mb-3 text-black">{item.title}</h4>
                  <p className="text-black/50 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
    </LayoutComponent>
  );
};

const FAQS = [
  { q: "How Much Does A Design Project Cost?", a: "Project pricing depends on scope, complexity, and timeline. We share a clear quote after a short discovery call — no hidden costs, no surprises." },
  { q: "How Long Does A Project Take?", a: "Most projects are completed within a few days to a couple of weeks, depending on the requirements and revisions." },
  { q: "What Design Services Do You Offer?", a: "Brand identity, graphic design, web design & development, UI/UX, video & motion, and SEO / content marketing — all under one roof." },
  { q: "Do You Offer Revisions?", a: "Yes — every package includes multiple rounds of revisions so we can refine the work until it feels exactly right." },
  { q: "How Do We Get Started?", a: "Click Get Started, share a few details about your project, and we'll reach out within 24 hours to plan the next step." },
];

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(1);
  return (
    <section className="px-4 md:px-8 pb-20 md:pb-28">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[28px] md:rounded-[36px] p-8 md:p-14 lg:p-16 overflow-hidden" style={{ background: "linear-gradient(180deg,#ECFEFF 0%,#CFFAFE 100%)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start mb-10 md:mb-14">
            <div className="relative">
              <h2 className="font-display font-bold text-[#083344] text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                Frequently<br />Asked Question
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              <p className="text-[#155E75] text-base md:text-[17px] leading-relaxed max-w-md">
                Have questions about our design services? Here are some common queries to help you understand how we work and what you can expect.
              </p>
              <Link to="/contact" className="inline-flex w-fit items-center justify-center px-7 py-3 rounded-full text-white font-semibold shadow-[0_10px_30px_-8px_rgba(8,145,178,0.55)] transition-transform hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg,#06B6D4 0%,#0891B2 100%)" }}>
                Get Started
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="bg-white rounded-2xl border border-white shadow-[0_10px_30px_-20px_rgba(8,145,178,0.15)] overflow-hidden">
                  <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between gap-6 px-6 md:px-8 py-5 md:py-6 text-left">
                    <span className="font-display font-semibold text-[#083344] text-base md:text-lg">{item.q}</span>
                    <span className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-[#0891B2] text-white" : "border border-[#A5F3FC] text-[#0891B2]"}`}>
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 md:px-8 pb-6 text-[#164E63] leading-relaxed">{item.a}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
