import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
  MessageCircle,
  Zap,
  CheckCircle2,
  ChevronRight,
  Triangle,
  Radio,
  Compass
} from "lucide-react";
import { ContainerTextFlip } from "@/components/ui/modern-animated-multi-words";
import { HeroSection } from "@/components/ui/hero-section-dark";
import { Sparkles as SparklesFx } from "@/components/ui/sparkles";
import { Link } from "react-router-dom";
import LayoutComponent from "@/components/Layout";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ProjectMarquee from "@/components/ProjectMarquee";
import { LogoCloud } from "@/components/ui/logo-cloud-2";
import brand1 from "@/assets/brands/b1.png.asset.json";
import brand2 from "@/assets/brands/b2.png.asset.json";
import brand3 from "@/assets/brands/b3.png.asset.json";
import brand4 from "@/assets/brands/b4.png.asset.json";
import brandingStartio from "@/assets/services/branding-startio.png.asset.json";


import { useLanguage } from "@/contexts/LanguageContext";
import { usePageContent } from "@/hooks/usePageContent";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { useTheme } from "next-themes";
import heroBgAsset from "@/assets/hero-bg.jpg.asset.json";
import heroBgLightAsset from "@/assets/hero-bg-light.png.asset.json";
const designShowcase = heroBgAsset.url;
const designShowcaseLight = heroBgLightAsset.url;

// Tilted device mockup card (browser / phone / image)
const MockupCard = ({
  color,
  Icon,
  variant,
  tilt,
  delay = 0,
  image,
}: {
  color: string;
  Icon: any;
  variant: "browser" | "phone" | "image";
  tilt: number;
  delay?: number;
  image?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full aspect-[5/7] rounded-[2rem] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]"
      style={{
        background: `radial-gradient(120% 100% at 30% 20%, ${color}ee 0%, ${color}aa 45%, ${color}55 100%)`,
      }}
    >
      {variant !== "image" && (
        <>
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 3px, transparent 3px 12px)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/25 pointer-events-none" />
        </>
      )}

      {variant === "image" && image ? (
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ rotate: tilt }}
        >
          {variant === "browser" ? (
            <div className="w-[16rem] md:w-[18rem] aspect-[16/11] rounded-xl bg-white shadow-2xl overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 h-6 bg-gray-100 border-b border-gray-200">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <div
                className="w-full h-[calc(100%-1.5rem)] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${color}22, ${color}55)` }}
              >
                <Icon size={64} strokeWidth={1.4} className="drop-shadow-xl" style={{ color }} />
              </div>
            </div>
          ) : (
            <div className="w-[7.5rem] md:w-[9rem] aspect-[9/19] rounded-[2rem] bg-neutral-900 shadow-2xl overflow-hidden ring-2 ring-black/40 relative">
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-3 rounded-full bg-black z-10" />
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: `linear-gradient(160deg, ${color}44, ${color}88)` }}
              >
                <Icon size={44} strokeWidth={1.6} className="drop-shadow-xl text-white" />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};


// Pair of tilted mockups (browser + phone) that reports itself active when centered
const ServicePair = ({
  color,
  Icon,
  onActive,
  primaryImage,
  secondaryImage,
}: {
  color: string;
  Icon: any;
  onActive: () => void;
  primaryImage?: string;
  secondaryImage?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <div ref={ref} className="min-h-[85vh] flex items-center">
      <div className="w-full grid grid-cols-2 gap-4 md:gap-6 items-start">
        <div className="-mt-4 md:-mt-8">
          <MockupCard
            color={color}
            Icon={Icon}
            variant={primaryImage ? "image" : "browser"}
            image={primaryImage}
            tilt={-3}
          />
        </div>
        <div className="mt-8 md:mt-16">
          <MockupCard
            color={color}
            Icon={Icon}
            variant={secondaryImage ? "image" : "phone"}
            image={secondaryImage}
            tilt={4}
            delay={0.15}
          />
        </div>
      </div>

    </div>
  );
};





const Index = () => {
  const { t, language } = useLanguage();
  const { getContent } = usePageContent('home');
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

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
    {
      icon: Monitor,
      label: language === "bn" ? "ওয়েবসাইট" : "Website",
      title: c("service.web", "home.service.web"),
      description: c("service.webDesc", "home.service.webDesc"),
      meta: [
        { k: language === "bn" ? "স্কোপ" : "Scope", v: language === "bn" ? "ডিজাইন ও ডেভেলপমেন্ট" : "Design & Development" },
        { k: language === "bn" ? "সময়" : "Timeline", v: language === "bn" ? "২–৪ সপ্তাহ" : "2–4 Weeks" },
      ],
      bg: "#dbeafe", text: "#0c1e3d", stripe: "#3b82f6",
    },
    {
      icon: PenTool,
      label: language === "bn" ? "গ্রাফিক" : "Graphic",
      title: language === "bn" ? "গ্রাফিক ডিজাইন" : "Graphic Design",
      description: language === "bn" ? "পোস্টার, ব্যানার, থাম্বনেইল ও ব্র্যান্ড কোলেটারাল পিক্সেল-পারফেক্ট ডিজাইন।" : "Posters, banners, thumbnails & brand collateral crafted with pixel-precise care.",
      meta: [
        { k: language === "bn" ? "ডেলিভারি" : "Delivery", v: language === "bn" ? "৪৮ ঘন্টা" : "48 Hours" },
        { k: language === "bn" ? "ফরম্যাট" : "Format", v: "Print + Digital" },
      ],
      bg: "#cffafe", text: "#083344", stripe: "#06b6d4",
    },
    {
      icon: Search,
      label: "SEO",
      title: c("service.seo", "home.service.seo"),
      description: c("service.seoDesc", "home.service.seoDesc"),
      meta: [
        { k: language === "bn" ? "রিপোর্ট" : "Reporting", v: language === "bn" ? "মাসিক" : "Monthly" },
        { k: language === "bn" ? "ফোকাস" : "Focus", v: "On-page + Off-page" },
      ],
      bg: "#e0f2fe", text: "#0c1e3d", stripe: "#0ea5e9",
    },
    {
      icon: PenTool,
      label: language === "bn" ? "ব্র্যান্ডিং" : "Branding",
      title: c("service.branding", "home.service.branding"),
      description: c("service.brandingDesc", "home.service.brandingDesc"),
      meta: [
        { k: language === "bn" ? "ডেলিভারেবল" : "Deliverable", v: language === "bn" ? "লোগো + গাইডলাইন" : "Logo + Guidelines" },
        { k: language === "bn" ? "সময়" : "Timeline", v: language === "bn" ? "১–২ সপ্তাহ" : "1–2 Weeks" },
      ],
      bg: "#ccfbf1", text: "#042f2e", stripe: "#14b8a6",
      primaryImage: brandingStartio.url,
    },
  ];
  const [activeService, setActiveService] = useState(0);

  const stats = [
    { value: "50+", label: c("stats.projects_label", "home.stats.projects") || "Projects" },
    { value: "30+", label: c("stats.clients_label", "home.stats.clients") || "Clients" },
    { value: "3+", label: c("stats.years_label", "home.stats.years") || "Years" },
    { value: "100%", label: c("stats.satisfaction_label", "home.stats.satisfaction") || "Satisfaction" },
  ];

  const testimonials = [
    { name: c("testimonial1.name", "home.testimonial1.name"), role: c("testimonial1.role", "home.testimonial1.role"), content: c("testimonial1.content", "home.testimonial1.content"), rating: 5 },
    { name: c("testimonial2.name", "home.testimonial2.name"), role: c("testimonial2.role", "home.testimonial2.role"), content: c("testimonial2.content", "home.testimonial2.content"), rating: 5 },
    { name: c("testimonial3.name", "home.testimonial3.name"), role: c("testimonial3.role", "home.testimonial3.role"), content: c("testimonial3.content", "home.testimonial3.content"), rating: 5 },
  ];

  const clientLogos = ["TechStart", "GreenLeaf", "Bloom Co", "NextGen", "Spark Digital", "CloudNine"];

  return (
    <LayoutComponent>
      {/* ══════════ HERO — Retro Grid Dark ══════════ */}
      <section ref={heroRef} className="relative overflow-hidden -mt-20 bg-background text-foreground">
        <HeroSection
          title={c("badge", "home.badge")}
          subtitle={{
            regular: `${c("title1", "home.title1")} `,
            gradient: c("title2", "home.title2"),
          }}
          description={(() => {
            const full = c("description", "home.description") || "";
            const match = full.match(/^(We craft|আমরা তৈরি করি)(.*)$/);
            if (match) {
              return (
                <>
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-mid))] to-[hsl(var(--gradient-end))]">
                    {match[1]}
                  </span>
                  {match[2]}
                </>
              );
            }
            return full;
          })()}
          ctaText={c("cta1", "home.cta1")}
          ctaHref="/contact"
          bottomImage={{ light: designShowcaseLight, dark: designShowcase }}
          gridOptions={{
            angle: 65,
            opacity: 0.35,
            cellSize: 55,
            lightLineColor: "hsl(215 25% 70%)",
            darkLineColor: "hsl(185 60% 40%)",
          }}
        />

        
      </section>

      {/* ══════════ PROJECT MARQUEE — 2 rows opposite scroll ══════════ */}
      <ProjectMarquee />














      {/* ══════════ SISTER BRANDS ══════════ */}
      <section className="relative pt-0 pb-12 lg:pt-0 lg:pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto text-center mb-10"
          >
            <h2 className="font-display font-bold leading-none tracking-tight text-3xl lg:text-5xl whitespace-nowrap">
              <span className="italic font-light text-muted-foreground">Our</span>{" "}
              <span className="text-foreground">brand</span>{" "}
              <span className="gradient-text">constellation</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <LogoCloud
              logos={[
                { src: brand1.url, alt: "AlphaZero", invert: true },
                { src: brand2.url, alt: "Sister Brand", invert: true },
                { src: brand3.url, alt: "Alpha Portfolio", href: "https://portfolio.alphazero.online/" },
                { src: brand4.url, alt: "Learn with AlphaZero", invert: true, large: true },
              ]}

            />

          </motion.div>
        </div>
      </section>


      {/* ══════════ SERVICES — BENTO GRID ══════════ */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-6">
              <Zap size={14} className="text-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{c("expertise", "home.expertise")}</span>
            </div>
            <h2 className="text-3xl lg:text-5xl xl:text-6xl font-display font-bold mb-4">
              {c("whatWeDo", "home.whatWeDo")} <span className="gradient-text">{c("do", "home.do")}</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              {c("expertiseDesc", "home.expertiseDesc")}
            </p>
          </motion.div>

          {/* Sticky text left, scrolling image pairs right */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 relative">
            {/* LEFT — sticky text swaps with active service */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 lg:h-[calc(100vh-8rem)] flex flex-col justify-center">
              {services.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={false}
                  animate={{
                    opacity: activeService === i ? 1 : 0,
                    y: activeService === i ? 0 : 24,
                    filter: activeService === i ? "blur(0px)" : "blur(8px)",
                    pointerEvents: activeService === i ? "auto" : "none",
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={activeService === i ? "relative" : "absolute inset-0"}
                >
                  <h3 className="text-3xl md:text-4xl lg:text-[2.1rem] xl:text-[2.5rem] font-display font-bold mb-5 leading-[1.1] tracking-tight text-foreground max-w-full">
                    {s.title}
                  </h3>



                  <div className="relative h-[2px] w-full max-w-md mb-6 overflow-hidden rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 blur-[2px] opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500" />
                  </div>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-md">
                    {s.description}
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 font-semibold text-sm group bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent"
                  >
                    <span className="relative">
                      {t("common.learnMore") || "See More"}
                      <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 origin-left" />
                    </span>
                    <ArrowRight size={16} className="text-cyan-300 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
                  </Link>

                </motion.div>

              ))}
            </div>

            {/* RIGHT — scrolling image pairs */}
            <div className="lg:col-span-8 flex flex-col gap-20 lg:gap-28">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <ServicePair
                    key={s.title}
                    color={s.stripe}
                    Icon={Icon}
                    onActive={() => setActiveService(i)}
                    primaryImage={(s as any).primaryImage}
                    secondaryImage={(s as any).secondaryImage}
                  />

                );
              })}
            </div>
          </div>



          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 glow-primary hover:scale-[1.02]"
            >
              {c("viewAllServices", "home.viewAllServices")} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════ WHY CHOOSE US — CARD GRID ══════════ */}
      <section className="py-24 lg:py-32 relative mesh-bg">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-6">
              <CheckCircle2 size={14} className="text-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{c("whyChoose", "home.whyChoose")}</span>
            </div>
            <h2 className="text-3xl lg:text-5xl xl:text-6xl font-display font-bold">
              {c("builtFor", "home.builtFor")} <span className="gradient-text">{c("yourSuccess", "home.yourSuccess")}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -4 }}
                className={`group relative p-7 rounded-2xl glass-card overflow-hidden ${index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                {/* Large number bg */}
                <span className="absolute -bottom-4 -right-2 text-[7rem] font-display font-bold text-muted-foreground/[0.04] leading-none select-none">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <item.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-6">
              <MessageSquare size={14} className="text-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{c("testimonials", "home.testimonials")}</span>
            </div>
            <h2 className="text-3xl lg:text-5xl xl:text-6xl font-display font-bold">
              {c("whatClientsSay", "home.whatClientsSay")} <span className="gradient-text">{c("say", "home.say")}</span>
            </h2>
          </motion.div>

          <div className="max-w-6xl mx-auto testimonials-swiper">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              loop
              pagination={{ clickable: true }}
              className="!pb-12"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.name} className="h-auto">
                  <div className="group relative p-7 rounded-2xl glass-card overflow-hidden h-full">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/40 via-primary/60 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <Quote size={28} className="text-primary/15 mb-5" />
                    <p className="text-foreground mb-6 leading-relaxed text-sm">{testimonial.content}</p>

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={13} className="text-[hsl(45,100%,50%)] fill-[hsl(45,100%,50%)]" />
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-display font-bold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* ══════════ TRUSTED BY ══════════ */}
      <section className="py-12 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto glass-card rounded-2xl py-8 px-6">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-bold shrink-0">{c("trustedBy", "home.trustedBy")}</span>
              {clientLogos.map((client, index) => (
                <motion.div
                  key={client}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="text-base font-display font-bold text-muted-foreground/20 hover:text-primary/60 transition-colors duration-300 cursor-default"
                >
                  {client}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CTA SECTION ══════════ */}
      <section className="py-24 lg:py-36 relative overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 mesh-bg" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8"
            >
              <Sparkles size={28} className="text-primary" />
            </motion.div>

            <h2 className="text-4xl lg:text-6xl xl:text-7xl font-display font-bold mb-6 leading-tight">
              {c("letsBuild", "home.letsBuild")} <span className="gradient-text">{c("brand", "home.brand")}</span>
            </h2>
            <p className="text-muted-foreground mb-12 text-lg max-w-xl mx-auto leading-relaxed">
              {c("readyTo", "home.readyTo")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg transition-all duration-300 glow-primary hover:scale-[1.02]"
              >
                {c("freeConsultation", "home.freeConsultation")} <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/8801846484200"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 border-2 border-border text-foreground rounded-full font-semibold text-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <MessageCircle size={18} />
                {c("whatsappUs", "home.whatsappUs")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </LayoutComponent>
  );
};

const TrustedByExperts = () => {
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const sparkleColor = isDark ? "#ffffff" : "#8350e8";

  return (
    <div className="relative isolate z-10 -mt-6 min-h-[700px] overflow-hidden bg-[#050505] md:-mt-12 md:min-h-[760px]">
      <SparklesFx
        density={900}
        speed={0.45}
        size={1.35}
        opacity={0.85}
        color={sparkleColor}
        className="absolute inset-0 h-full w-full"
        options={{
          particles: {
            move: { enable: true, direction: "none", speed: { min: 0.04, max: 0.45 }, straight: false },
            number: { value: 900 },
            opacity: { value: { min: 0.08, max: 0.75 }, animation: { enable: true, speed: 2.6, sync: false } },
            size: { value: { min: 0.35, max: 1.35 } },
          },
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%]"
        style={{
          background:
            "linear-gradient(180deg, #050505 0%, rgba(5,5,5,0.78) 16%, rgba(5,5,5,0.05) 46%, #050505 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-[165px] mx-auto h-[300px] max-w-[1180px]"
        style={{
          background:
            "radial-gradient(ellipse 52% 62% at 50% 46%, rgba(131,80,232,0.46) 0%, rgba(131,80,232,0.2) 38%, rgba(5,5,5,0) 74%)",
        }}
      />

      <div className="relative z-20 mx-auto max-w-5xl px-6 pt-20 text-center md:pt-24">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl font-medium leading-[1.25] text-[#cfd6ff] md:text-[28px]"
        >
          <span className="block">Trusted by experts.</span>
          <span className="block text-[#f5f3ff]">Used by the leaders.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
        className="mx-auto mt-16 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-12"
        >
          <Retool />
          <Vercel />
          <Remote />
          <Arc />
          <Raycast />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[330px] h-[315px] overflow-hidden md:top-[345px] md:h-[340px]">
        <div
          className="absolute left-1/2 top-[20px] aspect-[4/1] w-[1900px] max-w-[220vw] -translate-x-1/2 rounded-[50%] md:w-[2050px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(22,22,26,0.98) 0%, rgba(11,11,13,0.98) 58%, rgba(5,5,5,1) 100%)",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            boxShadow:
              "0 -22px 80px rgba(131,80,232,0.55), 0 -2px 18px rgba(255,255,255,0.14), inset 0 26px 70px rgba(255,255,255,0.02)",
          }}
        />
      </div>
    </div>
  );
};

const LogoMark = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex h-7 items-center justify-center text-[#f3efff] opacity-95 transition-opacity hover:opacity-100">
    {children}
  </span>
);

const Retool = () => (
  <LogoMark>
    <span className="mr-2 inline-flex flex-col gap-[3px]">
      <span className="block h-[3px] w-[16px] rounded-full bg-current" />
      <span className="block h-[3px] w-[11px] rounded-full bg-current" />
      <span className="block h-[3px] w-[16px] rounded-full bg-current" />
    </span>
    <span className="font-display text-[18px] font-bold leading-none">Retool</span>
  </LogoMark>
);

const Vercel = () => (
  <LogoMark>
    <Triangle size={20} className="mr-1.5 fill-current stroke-current" />
    <span className="font-display text-[18px] font-bold leading-none">Vercel</span>
  </LogoMark>
);

const Remote = () => (
  <LogoMark>
    <Radio size={20} className="mr-1.5 stroke-[3]" />
    <span className="font-display text-[18px] font-bold leading-none">remote</span>
  </LogoMark>
);

const Arc = () => (
  <LogoMark>
    <Compass size={22} className="mr-1.5 stroke-[1.8]" />
    <span className="font-display text-[15px] font-medium uppercase leading-none tracking-[0.22em]">Arc</span>
  </LogoMark>
);

const Raycast = () => (
  <LogoMark>
    <Zap size={20} className="mr-1.5 fill-current stroke-current" />
    <span className="font-display text-[16px] font-bold leading-none">Raycast</span>
  </LogoMark>
);

export default Index;