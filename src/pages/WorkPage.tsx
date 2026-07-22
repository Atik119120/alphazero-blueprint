import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ArrowUpRight, Briefcase } from "lucide-react";
import Layout from "@/components/Layout";
import { useWorks, type Work } from "@/hooks/useWorks";
import { usePageHero } from "@/hooks/usePageHero";

/* ─── Category helpers ─── */
const isGraphics = (w: Work) => {
  const c = w.category;
  return c === "design" || c === "graphics" || c.startsWith("graphics_");
};
const isWeb = (w: Work) => {
  const c = w.category;
  return c === "web" || c.startsWith("web_");
};
const isVideo = (w: Work) => {
  const c = w.category;
  return c === "video" || c.startsWith("video_");
};

const categoryLabel = (w: Work) => {
  if (isVideo(w)) return "Video & Motion";
  if (isWeb(w)) return "Web Design";
  return "Graphic Design";
};

function getVideoEmbed(url: string | null | undefined): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&autoplay=1`;
  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560`;
  }
  return null;
}

function getYouTubeThumbnail(url: string | null | undefined): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  return null;
}

const findVideoUrl = (w: Work): string | null =>
  getVideoEmbed(w.project_url) ? w.project_url : getVideoEmbed(w.image_url) ? w.image_url : null;

type FilterKey = "all" | "graphics" | "web" | "video";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "graphics", label: "Graphic Design" },
  { key: "web", label: "Web Design" },
  { key: "video", label: "Video & Motion" },
];

const WorkPage = () => {
  const { data: works, isLoading } = useWorks();
  const hero = usePageHero("work");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; description?: string | null } | null>(null);
  const [activeVideo, setActiveVideo] = useState<Work | null>(null);

  const filtered = useMemo(() => {
    if (!works) return [];
    if (filter === "all") return works;
    if (filter === "graphics") return works.filter(isGraphics);
    if (filter === "web") return works.filter(isWeb);
    return works.filter(isVideo);
  }, [works, filter]);

  useEffect(() => {
    const open = !!lightboxImage || !!activeVideo;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxImage, activeVideo]);

  const handleCardClick = useCallback((w: Work) => {
    if (isVideo(w)) {
      if (getVideoEmbed(findVideoUrl(w))) setActiveVideo(w);
      else if (w.project_url) window.open(w.project_url, "_blank");
      return;
    }
    if (isWeb(w) && w.project_url) {
      window.open(w.project_url, "_blank");
      return;
    }
    if (w.image_url && !getVideoEmbed(w.image_url)) {
      setLightboxImage({ url: w.image_url, title: w.title, description: w.description });
    }
  }, []);

  return (
    <Layout>
      {/* Hero — light editorial */}
      <section
        id="site-hero"
        className="relative overflow-hidden -mt-20 pt-32 pb-20 lg:pt-40 lg:pb-28"
        style={{ background: "linear-gradient(180deg, #EEF0FF 0%, #F5F6FF 60%, #FFFFFF 100%)" }}
      >
        {/* Decorative flowing curves */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1600 700" preserveAspectRatio="none" fill="none">
          <path d="M-100 420 C 300 320, 600 520, 900 380 S 1500 300, 1750 420" stroke="#DCDEF7" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M-100 500 C 400 400, 700 600, 1000 460 S 1500 380, 1750 500" stroke="#E4E6FA" strokeWidth="1.5" fill="none" opacity="0.6" />
          <circle cx="380" cy="360" r="220" stroke="#E1E3F6" strokeWidth="1.5" fill="none" opacity="0.5" />
        </svg>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full bg-white shadow-[0_4px_20px_rgba(76,29,149,0.08)] border border-[#EEF0FF]">
              <span className="w-7 h-7 rounded-full bg-white shadow-inner border border-[#EEF0FF] flex items-center justify-center">
                <Briefcase size={13} className="text-[#6D28D9]" />
              </span>
              <span className="text-[13px] font-medium text-[#6D28D9] tracking-wide">Portfolio</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="text-center font-display font-bold tracking-tight leading-[1.05] text-[#1B0F45] text-4xl sm:text-5xl lg:text-[64px]"
          >
            {hero("hero.title", "A Case Study of Creative")}<br />
            <span className="text-[#1B0F45]">{hero("hero.title_2", "Design Solutions")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-center text-[15px] lg:text-base text-[#5B5876] max-w-2xl mx-auto"
          >
            {hero("hero.description", "Discover our finest graphic designs, web projects, and video productions — crafted with precision and passion.")}
          </motion.p>
        </div>
      </section>

      {/* Filter pill bar */}
      <section className="relative -mt-10 lg:-mt-14 z-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl bg-white rounded-full shadow-[0_20px_60px_-20px_rgba(76,29,149,0.18)] border border-[#EEF0FF] p-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`relative flex-1 min-w-fit whitespace-nowrap px-5 lg:px-7 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    active
                      ? "text-white shadow-[0_10px_30px_-8px_rgba(109,40,217,0.55)]"
                      : "text-[#4B4869] hover:text-[#6D28D9]"
                  }`}
                  style={active ? { background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" } : undefined}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#C7F358]" : "bg-[#6D28D9]/50"}`} />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-14 lg:py-20" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F5F6FF 100%)" }}>
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[#6D28D9]/30 border-t-[#6D28D9] rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-[#5B5876]">No projects in this category yet.</div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((project, idx) => {
                  const vid = isVideo(project);
                  const thumb = vid
                    ? getYouTubeThumbnail(project.project_url) || getYouTubeThumbnail(project.image_url) || project.image_url
                    : project.image_url;

                  return (
                    <motion.article
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.45, delay: (idx % 9) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      className="group cursor-pointer"
                      onClick={() => handleCardClick(project)}
                    >
                      <div className="rounded-[28px] bg-white border border-[#EEF0FF] shadow-[0_10px_40px_-20px_rgba(76,29,149,0.15)] hover:shadow-[0_24px_60px_-24px_rgba(109,40,217,0.28)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden mx-3 mt-3 rounded-2xl" style={{ background: "linear-gradient(180deg, #F4F5FC 0%, #E9EBF7 100%)" }}>
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={project.title}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                              onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#B5B3C9] text-sm">No preview</div>
                          )}
                          {vid && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-white/95 shadow-xl flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500">
                                <Play size={22} className="text-[#6D28D9] ml-0.5" fill="currentColor" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Divider dashes */}
                        <div className="mx-6 mt-5 border-t border-dashed border-[#E3E5F5]" />

                        {/* Bottom label row */}
                        <div className="flex items-center justify-between gap-4 px-6 py-5">
                          <div className="min-w-0">
                            <h3 className="font-display font-semibold text-[17px] text-[#1B0F45] leading-snug truncate">
                              {project.title}
                            </h3>
                            <p className="text-[13px] text-[#7A778F] mt-1 truncate">
                              {categoryLabel(project)}
                            </p>
                          </div>
                          <span className="flex-shrink-0 w-11 h-11 rounded-full border border-[#E3E5F5] flex items-center justify-center text-[#6D28D9] group-hover:bg-[#6D28D9] group-hover:text-white group-hover:border-[#6D28D9] transition-all duration-300">
                            <ArrowUpRight size={18} />
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Image lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8 cursor-pointer"
            onClick={() => setLightboxImage(null)}>
            <button onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              <X size={22} className="text-white" />
            </button>
            <div className="flex flex-col items-center max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <motion.img initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                src={lightboxImage.url} alt={lightboxImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded-xl cursor-default" />
              <div className="mt-6 text-center max-w-lg">
                <p className="text-white/90 text-lg font-display font-semibold">{lightboxImage.title}</p>
                {lightboxImage.description && (
                  <p className="text-white/60 text-sm mt-2 leading-relaxed">{lightboxImage.description}</p>
                )}
                <p className="text-white/40 text-xs mt-3">Designed by Alpha Zero</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video modal */}
      <AnimatePresence>
        {activeVideo && (() => {
          const embed = getVideoEmbed(findVideoUrl(activeVideo));
          if (!embed) return null;
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8"
              onClick={() => setActiveVideo(null)}>
              <button onClick={() => setActiveVideo(null)}
                className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <X size={22} className="text-white" />
              </button>
              <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                  <iframe src={embed} className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen title={activeVideo.title} />
                </div>
                <p className="text-white/80 text-center mt-4 font-display font-semibold">{activeVideo.title}</p>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </Layout>
  );
};

export default WorkPage;
