import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Play, Sparkles, ExternalLink, Phone, MessageCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { useWorks, type Work } from "@/hooks/useWorks";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─── Category config ─── */
const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "web", label: "Web Design" },
  { key: "graphics", label: "Graphic Design" },
  { key: "video", label: "Video Editing" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

/* ─── Pinterest Masonry Grid ─── */
const MasonryGrid = ({
  items,
  onItemClick,
}: {
  items: Work[];
  onItemClick: (w: Work) => void;
}) => {
  // Distribute items into columns for masonry effect
  const cols = 3; // desktop columns
  const columns: Work[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => columns[i % cols].push(item));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-4 md:gap-5">
          {col.map((project, idx) => {
            const isVideo = project.category === "video" || project.category.startsWith("video_");
            const globalIdx = colIdx + idx * cols;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: globalIdx * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer"
                onClick={() => onItemClick(project)}
              >
                <div className="relative rounded-xl overflow-hidden bg-card border border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_12px_48px_hsl(var(--primary)/0.12)]">
                  {/* Image — natural aspect ratio for Pinterest feel */}
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.04]"
                      style={{ minHeight: "160px" }}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <div className="w-11 h-11 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                        {isVideo ? (
                          <Play size={18} className="text-primary-foreground ml-0.5" fill="currentColor" />
                        ) : (
                          <ZoomIn size={18} className="text-primary-foreground" />
                        )}
                      </div>
                    </div>
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium uppercase tracking-wider">
                        {getCategoryLabel(project.category)}
                      </span>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3.5">
                    <h4 className="font-display font-semibold text-sm leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-1">
                      {project.title}
                    </h4>
                    {project.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                          <Sparkles size={8} className="text-primary-foreground" />
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          <span className="text-foreground/70 font-medium">Alpha Zero</span>
                        </span>
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
  );
};

/* ─── Helpers ─── */
function getCategoryLabel(cat: string): string {
  if (cat === "web" || cat.startsWith("web_")) return "Web";
  if (cat === "video" || cat.startsWith("video_")) return "Video";
  if (cat === "design" || cat === "graphics" || cat.startsWith("graphics_")) return "Design";
  return cat;
}

function matchesFilter(w: Work, filter: CategoryKey): boolean {
  if (filter === "all") return true;
  const c = w.category;
  if (filter === "web") return c === "web" || c.startsWith("web_");
  if (filter === "graphics") return c === "design" || c === "graphics" || c.startsWith("graphics_");
  if (filter === "video") return c === "video" || c.startsWith("video_");
  return false;
}

/* ─── Main Page ─── */
const WorkPage = () => {
  const { data: works, isLoading } = useWorks();
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<CategoryKey>("all");
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  const filtered = useMemo(() => {
    if (!works) return [];
    return works.filter((w) => matchesFilter(w, activeFilter));
  }, [works, activeFilter]);

  const counts = useMemo(() => {
    if (!works) return {} as Record<CategoryKey, number>;
    return {
      all: works.length,
      web: works.filter((w) => matchesFilter(w, "web")).length,
      graphics: works.filter((w) => matchesFilter(w, "graphics")).length,
      video: works.filter((w) => matchesFilter(w, "video")).length,
    };
  }, [works]);

  const handleItemClick = (w: Work) => {
    if (w.image_url) setLightboxImage({ url: w.image_url, title: w.title });
  };

  return (
    <Layout>
      {/* ═══ HERO ═══ */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,hsl(var(--primary)/0.07),transparent_70%)]" />
        {/* Dot pattern */}
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
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1] mb-6"
            >
              Our Creative
              <br />
              <span className="gradient-text">Works & Projects</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              {t("work.description") || "Discover our finest web designs, graphic creations, and video productions — all crafted with precision and passion."}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══ FILTERS + GALLERY ═══ */}
      <section className="pb-24 lg:pb-32">
        <div className="container mx-auto px-6">
          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === cat.key
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
                }`}
              >
                {cat.label}
                {counts[cat.key] > 0 && (
                  <span className={`ml-1.5 text-xs ${activeFilter === cat.key ? "text-primary-foreground/70" : "text-muted-foreground/60"}`}>
                    {counts[cat.key]}
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Gallery */}
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-muted-foreground text-lg">{t("work.noWorks") || "No works found in this category."}</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <MasonryGrid items={filtered} onItemClick={handleItemClick} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA — Agency Contact ═══ */}
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
