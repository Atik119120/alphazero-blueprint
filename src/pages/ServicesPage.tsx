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


      {/* Services — Colorful bento grid */}
      <section className="py-24 lg:py-32 relative bg-background overflow-hidden">
        {/* soft color blobs */}
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#6366f1]/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-40 -right-32 w-[420px] h-[420px] rounded-full bg-[#ec4899]/15 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16"
            >
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6366f1]/30 bg-gradient-to-r from-[#6366f1]/10 to-[#ec4899]/10 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#ec4899]" />
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">Capabilities</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight leading-[1.05]">
                  Built for teams that{" "}
                  <span className="bg-gradient-to-r from-[#6366f1] via-[#ec4899] to-[#f59e0b] bg-clip-text text-transparent">ship.</span>
                </h2>
              </div>
              <p className="text-muted-foreground text-base lg:text-lg max-w-md leading-relaxed">
                A focused suite of services engineered for speed, clarity, and enterprise-grade polish.
              </p>
            </motion.div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !services || services.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No services found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">
                {services.map((service, index) => {
                  const IconComponent = getIcon(service.icon);
                  const palettes = [
                    { from: "#6366f1", to: "#8b5cf6", bg: "from-[#6366f1]/8 to-[#8b5cf6]/5", border: "border-[#6366f1]/25", chip: "bg-[#6366f1]/12", icon: "text-[#6366f1]" },
                    { from: "#ec4899", to: "#f43f5e", bg: "from-[#ec4899]/8 to-[#f43f5e]/5", border: "border-[#ec4899]/25", chip: "bg-[#ec4899]/12", icon: "text-[#ec4899]" },
                    { from: "#f59e0b", to: "#f97316", bg: "from-[#f59e0b]/8 to-[#f97316]/5", border: "border-[#f59e0b]/30", chip: "bg-[#f59e0b]/12", icon: "text-[#f59e0b]" },
                    { from: "#10b981", to: "#14b8a6", bg: "from-[#10b981]/8 to-[#14b8a6]/5", border: "border-[#10b981]/25", chip: "bg-[#10b981]/12", icon: "text-[#10b981]" },
                  ];
                  const p = palettes[index % 4];
                  const spanClasses = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06 }}
                      whileHover={{ y: -4 }}
                      className={`group relative rounded-3xl border ${p.border} bg-gradient-to-br ${p.bg} backdrop-blur-sm p-8 lg:p-10 overflow-hidden transition-all ${spanClasses[index % 4]}`}
                    >
                      {/* corner glow */}
                      <div
                        className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"
                        style={{ background: `radial-gradient(circle, ${p.from}, transparent 70%)` }}
                      />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-8">
                          <div
                            className={`w-12 h-12 rounded-2xl ${p.chip} flex items-center justify-center border ${p.border} group-hover:scale-110 transition-transform`}
                          >
                            <IconComponent size={20} className={p.icon} />
                          </div>
                          <span
                            className="text-[10px] font-mono font-semibold tracking-widest bg-clip-text text-transparent"
                            style={{ backgroundImage: `linear-gradient(90deg, ${p.from}, ${p.to})` }}
                          >
                            {String(index + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className="text-xl lg:text-2xl font-display font-semibold tracking-tight mb-3">{service.title}</h3>
                        <p className="text-muted-foreground text-sm lg:text-[15px] leading-relaxed mb-6 max-w-lg">{service.description}</p>
                        {service.features && service.features.length > 0 && (
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-6 border-t border-border/40">
                            {service.features.slice(0, 6).map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-[13px] text-foreground/80">
                                <CheckCircle size={12} className={`${p.icon} shrink-0`} strokeWidth={2.5} />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Process — Colorful rail */}
      <section className="py-24 lg:py-32 relative overflow-hidden bg-gradient-to-br from-[#6366f1]/5 via-background to-[#ec4899]/5 border-y border-border/60">
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, #6366f120 0, transparent 40%), radial-gradient(circle at 80% 70%, #ec489920 0, transparent 40%)"
        }} />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#f59e0b]">Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight leading-[1.05] mb-5">
                {t("services.process.title")}
              </h2>
              <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                {t("services.process.desc")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {processSteps.map((item, index) => {
                const palettes = [
                  { from: "#6366f1", to: "#8b5cf6" },
                  { from: "#ec4899", to: "#f43f5e" },
                  { from: "#f59e0b", to: "#f97316" },
                  { from: "#10b981", to: "#14b8a6" },
                ];
                const p = palettes[index % 4];
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="relative rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm p-8 lg:p-10 overflow-hidden group transition-all hover:border-transparent hover:shadow-xl"
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                      style={{ background: `linear-gradient(90deg, ${p.from}, ${p.to})` }}
                    />
                    <div
                      className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity"
                      style={{ background: `radial-gradient(circle, ${p.from}, transparent 70%)` }}
                    />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-8">
                        <span
                          className="text-2xl font-display font-bold bg-clip-text text-transparent"
                          style={{ backgroundImage: `linear-gradient(90deg, ${p.from}, ${p.to})` }}
                        >
                          {item.step}
                        </span>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ background: `linear-gradient(135deg, ${p.from}20, ${p.to}20)`, border: `1px solid ${p.from}40` }}
                        >
                          <item.icon size={16} style={{ color: p.from }} />
                        </div>
                      </div>
                      <h3 className="text-lg lg:text-xl font-display font-semibold tracking-tight mb-2">{t(item.titleKey)}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{t(item.descKey)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us — Colorful grid */}
      <section className="py-24 lg:py-32 relative bg-background overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#8b5cf6]/8 via-[#ec4899]/8 to-[#f59e0b]/8 blur-[140px] pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16"
            >
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#10b981]/30 bg-[#10b981]/10 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#10b981]">
                    {t("language") === "bn" ? "কেন আমরা" : "Why Us"}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight leading-[1.05]">
                  {t("language") === "bn" ? (
                    <>আপনার জন্য{" "}
                      <span className="bg-gradient-to-r from-[#10b981] via-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">আমরাই সেরা।</span>
                    </>
                  ) : (
                    <>The details that{" "}
                      <span className="bg-gradient-to-r from-[#10b981] via-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">set us apart.</span>
                    </>
                  )}
                </h2>
              </div>
              <p className="text-muted-foreground text-base lg:text-lg max-w-md leading-relaxed">
                {t("language") === "bn"
                  ? "মান, গতি এবং যত্ন — প্রতিটি প্রজেক্টে আমাদের প্রতিশ্রুতি।"
                  : "Quality, speed, and care — the commitments we honor on every engagement."}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Award, color: "#6366f1", title: t("language") === "bn" ? "প্রিমিয়াম কোয়ালিটি" : "Premium Quality", desc: t("language") === "bn" ? "প্রতিটি ডিজাইন ও কোড হাতে বানানো, ইন্ডাস্ট্রি স্ট্যান্ডার্ড মেনে তৈরি।" : "Every design and line of code is crafted to match global industry standards." },
                { icon: Zap, color: "#f59e0b", title: t("language") === "bn" ? "দ্রুত ডেলিভারি" : "Fast Delivery", desc: t("language") === "bn" ? "সময়ের আগেই সঠিক কাজ — আপনার ডেডলাইন আমাদের কাছে সবচেয়ে গুরুত্বপূর্ণ।" : "On-time, every time. Your deadline is our top priority from day one." },
                { icon: Shield, color: "#10b981", title: t("language") === "bn" ? "১০০% নিরাপত্তা" : "100% Secure", desc: t("language") === "bn" ? "আপনার ডেটা ও প্রজেক্ট সম্পূর্ণ সুরক্ষিত, এন্টারপ্রাইজ-গ্রেড সিকিউরিটি সহ।" : "Data and projects are fully protected with enterprise-grade security." },
                { icon: Heart, color: "#ec4899", title: t("language") === "bn" ? "২৪/৭ সাপোর্ট" : "24/7 Support", desc: t("language") === "bn" ? "যেকোনো সময় আমাদের টিম আপনার পাশে — কল, চ্যাট বা ইমেইলে।" : "Our team stands by you anytime — over call, chat, or email." },
                { icon: Users, color: "#8b5cf6", title: t("language") === "bn" ? "অভিজ্ঞ টিম" : "Expert Team", desc: t("language") === "bn" ? "ডিজাইনার, ডেভেলপার ও মার্কেটার — সবাই তাদের ফিল্ডের সেরা।" : "Designers, developers, and marketers — each an expert in their craft." },
                { icon: Star, color: "#14b8a6", title: t("language") === "bn" ? "সন্তুষ্ট ক্লায়েন্ট" : "Happy Clients", desc: t("language") === "bn" ? "শত শত ক্লায়েন্টের বিশ্বাস — কারণ আমরা কথা রাখি।" : "Trusted by hundreds of clients — because we keep our promises." },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="relative rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm p-8 lg:p-10 group overflow-hidden transition-all hover:shadow-xl"
                  style={{ ["--c" as any]: item.color }}
                >
                  <div
                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-70 transition-opacity"
                    style={{ background: `radial-gradient(circle, ${item.color}, transparent 70%)` }}
                  />
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                      style={{ background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`, border: `1px solid ${item.color}40` }}
                    >
                      <item.icon size={18} style={{ color: item.color }} />
                    </div>
                    <h3 className="text-lg lg:text-xl font-display font-semibold tracking-tight mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
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
