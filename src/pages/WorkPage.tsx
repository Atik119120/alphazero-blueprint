import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ZoomIn, Play, Sparkles, ExternalLink, Phone, MessageCircle,
  ChevronLeft, ChevronRight, Maximize2, Globe, ArrowUpRight,
} from "lucide-react";
import Layout from "@/components/Layout";
import { useWorks, type Work } from "@/hooks/useWorks";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─── Category helpers ─── */
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

/** Try to extract a YouTube/Facebook embed from ANY url string */
function getVideoEmbed(url: string | null | undefined): string | null {
  if (!url) return null;
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&autoplay=1`;
  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560`;
  }
  return null;
}

/** Extract YouTube thumbnail */
function getYouTubeThumbnail(url: string | null | undefined): string | null {
  if (!url) return null;
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  return null;
}

/** Find the best video URL from a work item (check both fields) */
function findVideoUrl(w: Work): string | null {
  return getVideoEmbed(w.project_url) ? w.project_url
    : getVideoEmbed(w.image_url) ? w.image_url
    : null;
}

/* ═══════════════════════════════════════════════════════════
   AUTO-SCROLLING STRIP (Top showcase)
   ═══════════════════════════════════════════════════════════ */
const ScrollStrip = ({ items }: { items: Work[] }) => {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    let raf: number;
    let pos = 0;
    const speed = 0.5;
    const tick = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items]);

  if (items.length === 0) return null;

  // duplicate for infinite loop
  const doubled = [...items, ...items];

  return (
    <div className="py-10 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div
        ref={stripRef}
        className="flex gap-4 overflow-hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {doubled.map((project, idx) => {
          const thumb = project.image_url && !getVideoEmbed(project.image_url)
            ? project.image_url
            : getYouTubeThumbnail(project.image_url) || getYouTubeThumbnail(project.project_url) || null;

          return (
            <div
              key={`${project.id}-${idx}`}
              className="flex-shrink-0 w-[200px] h-[130px] rounded-xl overflow-hidden bg-card border border-border/30 relative group"
            >
              {thumb ? (
                <img src={thumb} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  {isWeb(project) ? <Globe size={28} className="text-primary/40" /> : <Sparkles size={28} className="text-primary/40" />}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-white text-[11px] font-medium line-clamp-1">{project.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   SECTION 1 — Graphic Design (Dark Grid, Internal Scroll)
   ═══════════════════════════════════════════════════════════ */
const GraphicsSection = ({ items, onZoom }: { items: Work[]; onZoom: (w: Work) => void }) => {
  if (items.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium tracking-wide mb-3">
            <Sparkles size={12} /> Graphic Design
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold tracking-tight">
            Our <span className="gradient-text">Creative Designs</span>
          </h2>
        </motion.div>

        {/* Fixed-height scrollable grid area */}
        <div
          className="h-[70vh] lg:h-[75vh] overflow-y-auto pr-1"
          style={{ scrollbarWidth: "thin", scrollbarColor: "hsl(var(--primary) / 0.3) transparent" }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {items.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: idx * 0.03, duration: 0.4 }}
                className="group cursor-pointer"
                onClick={() => onZoom(project)}
              >
                <div className="relative rounded-xl overflow-hidden bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_15%)] hover:border-primary/50 transition-all duration-500 hover:shadow-[0_8px_32px_hsl(var(--primary)/0.15)] hover:-translate-y-1">
                  <div className="relative overflow-hidden aspect-[4/5]">
                    <img
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-400">
                      <div className="w-11 h-11 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500">
                        <ZoomIn size={18} className="text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                  {/* Minimal footer — no description */}
                  <div className="px-3 py-2.5 bg-[hsl(0_0%_6%)]">
                    <h4 className="font-display font-semibold text-xs sm:text-sm text-[hsl(0_0%_92%)] leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {project.title}
                    </h4>
                    <span className="text-[10px] text-[hsl(0_0%_50%)] font-medium mt-0.5 block">By Alphazero Team</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   SECTION 2 — Web Design (Website-style cards with live links)
   ═══════════════════════════════════════════════════════════ */
const WebSection = ({ items }: { items: Work[] }) => {
  if (items.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium tracking-wide mb-3">
            <Globe size={12} /> Web Design
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold tracking-tight">
            Web <span className="gradient-text">Projects</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {items.map((project, idx) => {
            const siteUrl = project.project_url || project.image_url;
            const domain = siteUrl ? (() => { try { return new URL(siteUrl).hostname; } catch { return siteUrl; } })() : null;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.06, duration: 0.5 }}
                className="group"
              >
                <a
                  href={siteUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative rounded-2xl overflow-hidden bg-card border border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_12px_48px_hsl(var(--primary)/0.12)]"
                >
                  {/* Browser-style header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border/30">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                    </div>
                    <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-background/60 border border-border/30 text-[11px] text-muted-foreground truncate flex items-center gap-1.5">
                      <Globe size={10} className="text-muted-foreground/60 flex-shrink-0" />
                      {domain || "website"}
                    </div>
                    <ArrowUpRight size={14} className="text-muted-foreground/60 group-hover:text-primary transition-colors" />
                  </div>

                  {/* Preview area */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/30 to-primary/10">
                    {project.image_url && !project.image_url.startsWith("http") ? null : project.image_url ? (
                      <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Globe size={32} className="text-primary/40" />
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">{project.title}</span>
                      </div>
                    )}
                    {/* Visit overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <div className="px-5 py-2.5 rounded-full bg-primary/90 backdrop-blur-sm flex items-center gap-2">
                        <ExternalLink size={16} className="text-primary-foreground" />
                        <span className="text-primary-foreground text-sm font-semibold">Visit Site</span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h4 className="font-display font-semibold text-base leading-snug group-hover:text-primary transition-colors">
                      {project.title}
                    </h4>
                    {project.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{project.description}</p>}
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                        <Sparkles size={8} className="text-primary-foreground" />
                      </div>
                      <span className="text-[10px] text-foreground/70 font-medium">Alpha Zero</span>
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   SECTION 3 — Video Editing (YouTube/Facebook Embed)
   ═══════════════════════════════════════════════════════════ */
const VideoSection = ({ items }: { items: Work[] }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium tracking-wide mb-3">
            <Play size={12} /> Video Editing
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold tracking-tight">
            Video <span className="gradient-text">Productions</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {items.map((project, idx) => {
            const videoUrl = findVideoUrl(project);
            const embedUrl = getVideoEmbed(videoUrl);
            const thumbnail = getYouTubeThumbnail(videoUrl) || project.image_url || "/placeholder.svg";

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.06, duration: 0.5 }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden bg-card border border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_12px_48px_hsl(var(--primary)/0.12)]">
                  {/* Thumbnail with play button */}
                  <div
                    className="relative overflow-hidden cursor-pointer aspect-video"
                    onClick={() => {
                      if (embedUrl) setActiveVideo(project.id);
                      else if (videoUrl) window.open(videoUrl, "_blank");
                    }}
                  >
                    <img
                      src={thumbnail.startsWith("http") && !getVideoEmbed(thumbnail) ? thumbnail : getYouTubeThumbnail(thumbnail) || "/placeholder.svg"}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 flex items-center justify-center transition-all duration-400">
                      <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500 shadow-lg">
                        <Play size={24} className="text-primary-foreground ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3.5">
                    <h4 className="font-display font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">{project.title}</h4>
                    {project.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{project.description}</p>}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                          <Sparkles size={8} className="text-primary-foreground" />
                        </div>
                        <span className="text-[10px] text-foreground/70 font-medium">Alpha Zero</span>
                      </div>
                      {embedUrl && (
                        <button onClick={() => setActiveVideo(project.id)} className="text-xs text-primary hover:underline flex items-center gap-1">
                          <Maximize2 size={10} /> Watch
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
          const embed = vid ? getVideoEmbed(findVideoUrl(vid)) : null;
          if (!embed) return null;
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
              onClick={() => setActiveVideo(null)}
            >
              <button onClick={() => setActiveVideo(null)}
                className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <X size={22} className="text-white" />
              </button>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                  <iframe src={embed} className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen title={vid?.title || "Video"} />
                </div>
                <p className="text-white/80 text-center mt-4 font-display font-semibold">{vid?.title}</p>
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
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; description?: string | null } | null>(null);

  const graphicsWorks = useMemo(() => works?.filter(isGraphics) || [], [works]);
  const webWorks = useMemo(() => works?.filter(isWeb) || [], [works]);
  const videoWorks = useMemo(() => works?.filter(isVideo) || [], [works]);

  const handleZoom = (w: Work) => {
    if (w.image_url && !getVideoEmbed(w.image_url)) {
      setLightboxImage({ url: w.image_url, title: w.title, description: w.description });
    }
  };

  return (
    <Layout>
      {/* ═══ HERO ═══ */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-background" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium tracking-wide mb-6">
                <Sparkles size={12} /> Creative Portfolio
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1] mb-6">
              Our Creative<br /><span className="gradient-text">Works & Projects</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("work.description") || "Discover our finest graphic designs, web projects, and video productions — all crafted with precision and passion."}
            </motion.p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Auto-scrolling showcase strip */}
          <ScrollStrip items={works || []} />

          {/* 1. Graphic Design */}
          <GraphicsSection items={graphicsWorks} onZoom={handleZoom} />

          {/* 2. Web Design */}
          <WebSection items={webWorks} />

          {/* 3. Video Editing */}
          <VideoSection items={videoWorks} />
        </>
      )}

      {/* ═══ CTA ═══ */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4 tracking-tight">{t("work.likeWhatYouSee") || "Like What You See?"}</h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">{t("work.letsCreate") || "Let's create something extraordinary together. Reach out to us now!"}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+8801410190019" className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-display font-semibold text-lg transition-all duration-500 hover:shadow-[0_8px_40px_hsl(var(--primary)/0.3)] hover:scale-[1.02]">
                <Phone size={20} /> Call Us
              </a>
              <a href="https://wa.me/8801846484200" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-2xl font-display font-semibold text-lg transition-all duration-500 hover:shadow-[0_8px_40px_rgba(37,211,102,0.3)] hover:scale-[1.02]">
                <MessageCircle size={20} /> WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ IMAGE LIGHTBOX with Description ═══ */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-pointer"
            onClick={() => setLightboxImage(null)}>
            <button onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              <X size={22} className="text-white" />
            </button>
            <div className="flex flex-col items-center max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <motion.img initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                src={lightboxImage.url} alt={lightboxImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl cursor-default" />
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-6 text-center max-w-lg">
                <p className="text-white/90 text-lg font-display font-semibold">{lightboxImage.title}</p>
                {lightboxImage.description && (
                  <p className="text-white/60 text-sm mt-2 leading-relaxed">{lightboxImage.description}</p>
                )}
                <p className="text-white/40 text-xs mt-3">Designed by Alpha Zero</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default WorkPage;
