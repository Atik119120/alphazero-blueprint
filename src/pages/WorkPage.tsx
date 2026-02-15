import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, ZoomIn, Play, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useWorks, type Work } from "@/hooks/useWorks";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─── Horizontal Auto-Scroll Strip ─── */
const ScrollStrip = ({
  items,
  onItemClick,
  speed = 30,
}: {
  items: Work[];
  onItemClick: (w: Work) => void;
  speed?: number;
}) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items for seamless loop
  const doubled = [...items, ...items];

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    let raf: number;
    let pos = 0;
    const half = el.scrollWidth / 2;

    const tick = () => {
      if (!isPaused) {
        pos += 0.5;
        if (pos >= half) pos = 0;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPaused, items]);

  return (
    <div
      ref={stripRef}
      className="flex gap-5 overflow-x-hidden py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {doubled.map((w, i) => (
        <div
          key={`${w.id}-${i}`}
          className="flex-shrink-0 w-[280px] md:w-[340px] group cursor-pointer"
          onClick={() => onItemClick(w)}
        >
          <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-500 hover:shadow-[0_8px_40px_hsl(var(--primary)/0.15)]">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={w.image_url || "/placeholder.svg"}
                alt={w.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-white/90 font-display text-lg font-semibold">{w.title}</p>
                <p className="text-white/60 text-sm mt-1">Designed by Alpha Zero</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Horizontal Gallery Row ─── */
const HorizontalGallery = ({
  items,
  onItemClick,
  isVideo = false,
}: {
  items: Work[];
  onItemClick: (w: Work) => void;
  isVideo?: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll, items]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/gallery">
      {/* Nav arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary"
        >
          <ChevronRight size={18} />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="flex-shrink-0 w-[260px] md:w-[320px] snap-start group cursor-pointer"
            onClick={() => onItemClick(project)}
          >
            <div className="rounded-2xl overflow-hidden border border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:shadow-[0_8px_40px_hsl(var(--primary)/0.12)] h-full">
              {/* Image - preserve original ratio */}
              <div className={`${isVideo ? "aspect-video" : "aspect-[4/5]"} overflow-hidden relative`}>
                <img
                  src={project.image_url || "/placeholder.svg"}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform duration-500">
                    {isVideo ? (
                      <Play size={20} className="text-primary-foreground ml-0.5" fill="currentColor" />
                    ) : (
                      <ZoomIn size={20} className="text-primary-foreground" />
                    )}
                  </div>
                </div>
              </div>
              {/* Info */}
              <div className="p-4 space-y-2">
                <h4 className="font-display font-semibold text-base group-hover:text-primary transition-colors duration-300 line-clamp-1">
                  {project.title}
                </h4>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center">
                    <Sparkles size={10} className="text-primary-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Designed by <span className="text-foreground/80 font-medium">Alpha Zero</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ─── Section Header ─── */
const SectionHeader = ({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="mb-10"
  >
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xs font-mono text-primary/70 tracking-widest">{number}</span>
      <div className="h-px w-12 bg-primary/30" />
    </div>
    <h2 className="text-3xl lg:text-4xl font-display font-bold mb-2">{title}</h2>
    <p className="text-muted-foreground text-lg max-w-xl">{subtitle}</p>
  </motion.div>
);

/* ─── Main Page ─── */
const WorkPage = () => {
  const { data: works, isLoading } = useWorks();
  const { t } = useLanguage();
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const GRAPHICS_KEYS = [
    "graphics_logo",
    "graphics_social",
    "graphics_vector",
    "graphics_branding",
    "graphics_general",
  ] as const;
  const VIDEO_KEYS = ["video_short", "video_reels", "video_funny", "video_square", "video_general"] as const;

  const categorized = useMemo(() => {
    const buckets: Record<string, Work[]> = {};
    for (const key of [...GRAPHICS_KEYS, ...VIDEO_KEYS, "other"]) buckets[key] = [];

    for (const w of works || []) {
      const c = w.category;
      if (c.startsWith("graphics_")) (buckets[c] ||= []).push(w);
      else if (c === "graphics" || c === "design") buckets.graphics_general.push(w);
      else if (c.startsWith("video_")) (buckets[c] ||= []).push(w);
      else if (c === "video") buckets.video_general.push(w);
      // web items are intentionally excluded from display per request
    }
    return buckets;
  }, [works]);

  // Flatten for featured hero strip
  const featuredItems = useMemo(() => {
    const all = Object.values(categorized).flat();
    const featured = all.filter((w) => w.is_featured);
    return featured.length > 0 ? featured : all.slice(0, 8);
  }, [categorized]);

  const hasGraphics = GRAPHICS_KEYS.some((k) => categorized[k]?.length);
  const hasVideo = VIDEO_KEYS.some((k) => categorized[k]?.length);
  const hasAny = hasGraphics || hasVideo;

  const logoItems = useMemo(() => categorized.graphics_logo || [], [categorized]);
  const socialItems = useMemo(() => {
    return [
      ...(categorized.graphics_social || []),
      ...(categorized.graphics_vector || []),
      ...(categorized.graphics_branding || []),
      ...(categorized.graphics_general || []),
    ];
  }, [categorized]);
  const videoItems = useMemo(() => {
    return VIDEO_KEYS.flatMap((k) => categorized[k] || []);
  }, [categorized]);

  const handleItemClick = (w: Work) => {
    if (w.image_url) setLightboxImage({ url: w.image_url, title: w.title });
  };

  const catLabel = (key: string) => t(`work.category.${key}`);

  return (
    <Layout>
      {/* ═══ HERO ═══ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden"
      >
        {/* Cinematic gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,hsl(var(--primary)/0.08),transparent_70%)]" />

        <div className="container mx-auto px-6 relative z-10 pt-16 pb-8">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8">
                <Sparkles size={14} />
                Creative Portfolio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[0.95] mb-8"
            >
              Crafting Modern
              <br />
              <span className="gradient-text">Digital Identity.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              We design brands, shape visuals, and edit stories that stand out in the digital world.
            </motion.p>
          </div>
        </div>

        {/* Featured auto-scroll strip */}
        {featuredItems.length > 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative w-full overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            <ScrollStrip items={featuredItems} onItemClick={handleItemClick} />
          </motion.div>
        )}
      </motion.section>

      {isLoading ? (
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : !hasAny ? (
        <div className="container mx-auto px-6 py-32 text-center text-muted-foreground text-lg">
          {t("work.noWorks")}
        </div>
      ) : (
        <div className="space-y-0">
          {/* ═══ LOGO DESIGN ═══ */}
          {logoItems.length > 0 && (
            <section className="py-20 lg:py-28">
              <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                  <SectionHeader number="01" title="Logo Design" subtitle="Minimal, timeless, and brand-defining marks." />
                  <HorizontalGallery items={logoItems} onItemClick={handleItemClick} />
                </div>
              </div>
            </section>
          )}

          {/* ═══ SOCIAL MEDIA DESIGN ═══ */}
          {socialItems.length > 0 && (
            <section className="py-20 lg:py-28 bg-secondary/20">
              <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                  <SectionHeader
                    number="02"
                    title="Social Media Design"
                    subtitle="Scroll-stopping visuals for every platform."
                  />
                  <HorizontalGallery items={socialItems} onItemClick={handleItemClick} />
                </div>
              </div>
            </section>
          )}

          {/* ═══ VIDEO EDITING ═══ */}
          {videoItems.length > 0 && (
            <section className="py-20 lg:py-28">
              <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                  <SectionHeader
                    number="03"
                    title="Video Editing"
                    subtitle="Cinematic cuts, motion graphics, and storytelling."
                  />
                  <HorizontalGallery items={videoItems} onItemClick={handleItemClick} isVideo />
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* ═══ CTA ═══ */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_60%,hsl(var(--primary)/0.06),transparent_70%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6 tracking-tight">
              {t("work.likeWhatYouSee")}
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              {t("work.letsCreate")}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-display font-semibold text-lg transition-all duration-500 hover:shadow-[0_8px_40px_hsl(var(--primary)/0.3)] hover:scale-[1.02]"
            >
              {t("work.startProject")}
              <ChevronRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ LIGHTBOX ═══ */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-pointer"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
            >
              <X size={22} className="text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-white/90 text-lg font-display font-semibold">{lightboxImage.title}</p>
              <p className="text-white/50 text-sm mt-1">Designed by Alpha Zero</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default WorkPage;
