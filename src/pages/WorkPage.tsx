import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ZoomIn,
  Play,
  Sparkles,
  ExternalLink,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import Layout from "@/components/Layout";
import { useWorks, type Work } from "@/hooks/useWorks";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─── Helpers ─── */
function isGraphics(w: Work) {
  const c = w.category;
  return c === "design" || c === "graphics" || c.startsWith("graphics_");
}
function isWeb(w: Work) {
  const c = w.category;
  return c === "web" || c.startsWith("web_");
}
function isVideo(w: Work) {
  const c = w.category;
  return c === "video" || c.startsWith("video_");
}

/** Extract YouTube/Facebook video ID & build embed URL */
function getVideoEmbed(url: string | null): string | null {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  // Facebook
  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560`;
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════
   SECTION 1 — Graphic Design (Horizontal Scroll Gallery + Zoom)
   ═══════════════════════════════════════════════════════════ */
const GraphicsSection = ({
  items,
  onZoom,
}: {
  items: Work[];
  onZoom: (w: Work) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (items.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium tracking-wide mb-3">
              <Sparkles size={12} />
              Graphic Design
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold tracking-tight">
              Our <span className="gradient-text">Creative Designs</span>
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={18} className="text-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Scrollable Gallery */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] snap-start group cursor-pointer"
              onClick={() => onZoom(project)}
            >
              <div className="relative rounded-2xl overflow-hidden bg-card border border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_12px_48px_hsl(var(--primary)/0.12)]">
                <div className="relative overflow-hidden">
                  <img
                    src={project.image_url || "/placeholder.svg"}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.06]"
                    style={{ minHeight: "180px" }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
                    <div className="w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                      <ZoomIn size={20} className="text-primary-foreground" />
                    </div>
                  </div>
                </div>
                <div className="p-3.5">
                  <h4 className="font-display font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">
                    {project.title}
                  </h4>
                  {project.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                      <Sparkles size={8} className="text-primary-foreground" />
                    </div>
                    <span className="text-[10px] text-foreground/70 font-medium">Alpha Zero</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   SECTION 2 — Web Design (Pinterest Masonry Grid)
   ═══════════════════════════════════════════════════════════ */
const WebSection = ({
  items,
  onZoom,
}: {
  items: Work[];
  onZoom: (w: Work) => void;
}) => {
  if (items.length === 0) return null;

  const cols = 3;
  const columns: Work[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => columns[i % cols].push(item));

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium tracking-wide mb-3">
            <Sparkles size={12} />
            Web Design
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold tracking-tight">
            Web <span className="gradient-text">Projects</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-4 md:gap-5">
              {col.map((project, idx) => {
                const globalIdx = colIdx + idx * cols;
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: globalIdx * 0.04, duration: 0.5 }}
                    className="group cursor-pointer"
                    onClick={() => onZoom(project)}
                  >
                    <div className="relative rounded-xl overflow-hidden bg-card border border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_12px_48px_hsl(var(--primary)/0.12)]">
                      <div className="relative overflow-hidden">
                        <img
                          src={project.image_url || "/placeholder.svg"}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.04]"
                          style={{ minHeight: "160px" }}
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
                          <div className="w-11 h-11 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                            <ZoomIn size={18} className="text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3.5">
                        <h4 className="font-display font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">
                          {project.title}
                        </h4>
                        {project.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {project.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                              <Sparkles size={8} className="text-primary-foreground" />
                            </div>
                            <span className="text-[10px] text-foreground/70 font-medium">Alpha Zero</span>
                          </div>
                          {project.project_url && (
                            <a
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   SECTION 3 — Video Editing (Thumbnail Cards + Expandable Embed)
   ═══════════════════════════════════════════════════════════ */
const VideoSection = ({ items }: { items: Work[] }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium tracking-wide mb-3">
            <Play size={12} />
            Video Editing
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold tracking-tight">
            Video <span className="gradient-text">Productions</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {items.map((project, idx) => {
            const embedUrl = getVideoEmbed(project.project_url);
            const isActive = activeVideo === project.id;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.06, duration: 0.5 }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden bg-card border border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_12px_48px_hsl(var(--primary)/0.12)]">
                  {/* Thumbnail or Embed */}
                  {isActive && embedUrl ? (
                    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                      <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={project.title}
                      />
                    </div>
                  ) : (
                    <div
                      className="relative overflow-hidden cursor-pointer"
                      onClick={() => {
                        if (embedUrl) setActiveVideo(project.id);
                        else if (project.project_url) window.open(project.project_url, "_blank");
                      }}
                    >
                      <img
                        src={project.image_url || "/placeholder.svg"}
                        alt={project.title}
                        loading="lazy"
                        className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
                        <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                          <Play size={24} className="text-primary-foreground ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                      {/* Always-visible play icon */}
                      <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center group-hover:opacity-0 transition-opacity">
                        <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1 flex-1">
                        {project.title}
                      </h4>
                      {isActive && (
                        <button
                          onClick={() => setActiveVideo(null)}
                          className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                          <Sparkles size={8} className="text-primary-foreground" />
                        </div>
                        <span className="text-[10px] text-foreground/70 font-medium">Alpha Zero</span>
                      </div>
                      {embedUrl && !isActive && (
                        <button
                          onClick={() => setActiveVideo(project.id)}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <Maximize2 size={10} />
                          Watch
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {activeVideo && (() => {
          const vid = items.find((v) => v.id === activeVideo);
          const embed = vid ? getVideoEmbed(vid.project_url) : null;
          if (!embed) return null;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
              onClick={() => setActiveVideo(null)}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <X size={22} className="text-white" />
              </button>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className="w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={embed}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={vid?.title || "Video"}
                  />
                </div>
                <p className="text-white/80 text-center mt-4 font-display font-semibold">
                  {vid?.title}
                </p>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
const WorkPage = () => {
  const { data: works, isLoading } = useWorks();
  const { t } = useLanguage();
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  const graphicsWorks = useMemo(() => works?.filter(isGraphics) || [], [works]);
  const webWorks = useMemo(() => works?.filter(isWeb) || [], [works]);
  const videoWorks = useMemo(() => works?.filter(isVideo) || [], [works]);

  const handleZoom = (w: Work) => {
    if (w.image_url) setLightboxImage({ url: w.image_url, title: w.title });
  };

  return (
    <Layout>
      {/* ═══ HERO ═══ */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,hsl(var(--primary)/0.07),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(var(--primary)/0.15)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium tracking-wide mb-6">
                <Sparkles size={12} />
                Creative Portfolio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1] mb-6"
            >
              Our Creative
              <br />
              <span className="gradient-text">Works & Projects</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              {t("work.description") ||
                "Discover our finest graphic designs, web projects, and video productions — all crafted with precision and passion."}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* 1. Graphic Design — Horizontal Scroll Gallery */}
          <GraphicsSection items={graphicsWorks} onZoom={handleZoom} />

          {/* 2. Web Design — Pinterest Masonry */}
          <WebSection items={webWorks} onZoom={handleZoom} />

          {/* 3. Video Editing — Embeddable Cards */}
          <VideoSection items={videoWorks} />
        </>
      )}

      {/* ═══ CTA ═══ */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,hsl(var(--primary)/0.06),transparent_70%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4 tracking-tight">
              {t("work.likeWhatYouSee") || "Like What You See?"}
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              {t("work.letsCreate") || "Let's create something extraordinary together. Reach out to us now!"}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+8801410190019"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-display font-semibold text-lg transition-all duration-500 hover:shadow-[0_8px_40px_hsl(var(--primary)/0.3)] hover:scale-[1.02]"
              >
                <Phone size={20} />
                Call Us
              </a>
              <a
                href="https://wa.me/8801846484200"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-2xl font-display font-semibold text-lg transition-all duration-500 hover:shadow-[0_8px_40px_rgba(37,211,102,0.3)] hover:scale-[1.02]"
              >
                <MessageCircle size={20} />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ IMAGE LIGHTBOX ═══ */}
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
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
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
