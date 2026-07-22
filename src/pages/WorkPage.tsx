import { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import servicesHeroBg from "@/assets/services-hero-bg-2.jpg.asset.json";
import { X, Play, ArrowUpRight } from "lucide-react";
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
      {/* Hero — Services style */}
      <section id="site-hero" className="relative overflow-hidden -mt-20 pt-28 pb-12 lg:pt-32 lg:pb-16 rounded-b-[2.5rem]">
        <div className="absolute inset-0 bg-black" />
        <img src={servicesHeroBg.url} alt="" loading="eager" decoding="async"
          className="absolute inset-x-0 top-0 w-full h-full object-cover object-top scale-110 opacity-85" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.05] text-white mb-6">
              {(() => {
                const raw = hero("hero.title", "Our Creative |Works & Projects|");
                const parts = raw.split("|");
                if (parts.length >= 3) {
                  return <><span className="font-normal" style={{ fontFamily: "'Mea Culpa', cursive" }}>{parts[0]}</span><span className="font-normal gradient-text" style={{ fontFamily: "'Mea Culpa', cursive" }}>{parts[1]}</span>{parts.slice(2).join("|")}</>;
                }
                return raw;
              })()}
            </h1>
            <p
              className="text-base lg:text-lg text-white/60 max-w-2xl mx-auto mb-8">
              {hero("hero.description", "Discover our finest graphic designs, web projects, and video productions — all crafted with precision and passion.")}
            </p>
          </div>
        </div>
      </section>


      {/* Filter pill bar */}
      <section className="relative pt-12 lg:pt-16 z-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl bg-white rounded-full shadow-[0_20px_60px_-20px_rgba(76,29,149,0.18)] border border-[#EEF0FF] p-2 flex items-center gap-1 relative overflow-hidden">
            {/* subtle grid backdrop */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(109,40,217,0.06) 1px, transparent 1px)",
                backgroundSize: `${100 / FILTERS.length}% 100%`,
              }}
            />
            {/* sliding active pill */}
            <motion.div
              aria-hidden
              className="absolute top-2 bottom-2 rounded-full shadow-[0_10px_30px_-8px_rgba(109,40,217,0.55)] z-0"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" }}
              initial={false}
              animate={{
                left: `calc(${(FILTERS.findIndex((f) => f.key === filter) / FILTERS.length) * 100}% + 8px)`,
                width: `calc(${100 / FILTERS.length}% - 8px)`,
              }}
              transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.7 }}
            />
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`relative z-10 flex-1 min-w-fit whitespace-nowrap px-5 lg:px-7 py-3 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center gap-2 ${
                    active ? "text-white" : "text-[#4B4869] hover:text-[#6D28D9]"
                  }`}
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    animate={{
                      backgroundColor: active ? "#C7F358" : "rgba(109,40,217,0.5)",
                      scale: active ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
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
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
            >
              {filtered.map((project) => {

                  const vid = isVideo(project);
                  const thumb = vid
                    ? getYouTubeThumbnail(project.project_url) || getYouTubeThumbnail(project.image_url) || project.image_url
                    : project.image_url;

                  return (
                    <article
                      key={project.id}
                      className="group cursor-pointer"
                      onClick={() => handleCardClick(project)}
                    >
                      <div className="rounded-[28px] bg-white border border-[#EEF0FF] shadow-[0_10px_40px_-20px_rgba(76,29,149,0.12)] overflow-hidden">
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden mx-3 mt-3 rounded-2xl" style={{ background: "linear-gradient(180deg, #F4F5FC 0%, #E9EBF7 100%)" }}>
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={project.title}
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#B5B3C9] text-sm">No preview</div>
                          )}
                          {vid && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-14 h-14 rounded-full bg-white/95 shadow-xl flex items-center justify-center">
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
                          <span className="flex-shrink-0 w-11 h-11 rounded-full border border-[#E3E5F5] flex items-center justify-center text-[#6D28D9] group-hover:bg-[#6D28D9] group-hover:text-white group-hover:border-[#6D28D9] transition-colors duration-300">
                            <ArrowUpRight size={18} />
                          </span>
                        </div>
                      </div>
                    </article>
                  );

                })}
            </div>

          )}
        </div>
      </section>

      {/* CTA — Let's Build Your Next Design Project */}
      <section className="px-4 md:px-8 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative overflow-hidden rounded-[28px] md:rounded-[36px] p-8 md:p-14 lg:p-16"
            style={{
              background:
                "linear-gradient(135deg, #2b0a75 0%, #3b1499 45%, #5b2ee0 100%)",
            }}
          >
            {/* soft decorative swoosh */}
            <svg
              aria-hidden
              className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none"
              viewBox="0 0 1400 500"
              preserveAspectRatio="none"
            >
              <path
                d="M900,-50 C700,180 1200,260 950,520"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>

            <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-12 items-center">
              {/* Left content */}
              <div>
                <h2 className="font-display font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                  Let's Build Your Next<br />Design Project
                </h2>

                <div className="mt-8 flex items-start gap-3 max-w-md">
                  <span className="mt-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/95">
                    <span className="w-2 h-2 rounded-full bg-[#5b2ee0]" />
                  </span>
                  <p className="text-white/80 text-base md:text-[17px] leading-relaxed">
                    We create modern and user-friendly designs that help your business grow and stand out.
                  </p>
                </div>

                <div className="mt-10">
                  <p className="text-white font-semibold mb-4">Social Share :</p>
                  <div className="flex items-center gap-3">
                    {[
                      { label: "Facebook", href: "https://facebook.com", d: "M13 22v-8h3l1-4h-4V7.5c0-1.2.3-2 2-2h2V2.1C16.6 2 15.5 2 14.4 2 11.8 2 10 3.7 10 6.8V10H7v4h3v8h3z" },
                      { label: "Instagram", href: "https://instagram.com", d: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.5 1s.8.9 1 1.5c.2.5.3 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-1 1.5s-.9.8-1.5 1c-.5.2-1.1.3-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.5-1s-.8-.9-1-1.5c-.2-.5-.3-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 1-1.5s.9-.8 1.5-1c.5-.2 1.1-.3 2.3-.4C8.4 2.2 8.8 2.2 12 2.2M12 7a5 5 0 100 10 5 5 0 000-10m0 8.2A3.2 3.2 0 1112 8.8a3.2 3.2 0 010 6.4M17.5 6a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" },
                      { label: "Twitter", href: "https://twitter.com", d: "M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 00-7 3.7A11.6 11.6 0 013 4.7a4.1 4.1 0 001.3 5.5c-.7 0-1.3-.2-1.9-.5 0 2 1.4 3.7 3.3 4.1-.6.2-1.2.2-1.8.1.5 1.6 2 2.8 3.8 2.8A8.2 8.2 0 012 18.4 11.6 11.6 0 008.3 20c7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.5-1.3 2.1-2z" },
                      { label: "LinkedIn", href: "https://linkedin.com", d: "M6.9 8.6H3.6V20h3.3V8.6zM5.3 3.1a1.9 1.9 0 100 3.8 1.9 1.9 0 000-3.8zM20.4 20h-3.3v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H9.9V8.6H13v1.6h.1c.4-.8 1.5-1.8 3.1-1.8 3.3 0 4 2.2 4 5V20z" },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={s.label}
                        className="w-10 h-10 rounded-full border border-white/50 text-white flex items-center justify-center hover:bg-white hover:text-[#5b2ee0] transition-colors"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d={s.d} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right image */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[5/4] shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
                    alt="Our design team collaborating"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Image lightbox */}
      {lightboxImage && (
          <div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8 cursor-pointer"
            onClick={() => setLightboxImage(null)}>
            <button onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              <X size={22} className="text-white" />
            </button>
            <div className="flex flex-col items-center max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
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
          </div>
        )}

      {/* Video modal */}
      {activeVideo && (() => {
          const embed = getVideoEmbed(findVideoUrl(activeVideo));
          if (!embed) return null;
          return (
            <div
              className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8"
              onClick={() => setActiveVideo(null)}>
              <button onClick={() => setActiveVideo(null)}
                className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <X size={22} className="text-white" />
              </button>
              <div
                className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                  <iframe src={embed} className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen title={activeVideo.title} />
                </div>
                <p className="text-white/80 text-center mt-4 font-display font-semibold">{activeVideo.title}</p>
              </div>
            </div>
          );
        })()}
    </Layout>
  );
};

export default WorkPage;
