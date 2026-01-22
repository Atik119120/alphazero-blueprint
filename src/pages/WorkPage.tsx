import { useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Globe, Palette, Video, Play, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useWorks, type Work } from "@/hooks/useWorks";
import { useLanguage } from "@/contexts/LanguageContext";

const WorkPage = () => {
  const { data: works, isLoading } = useWorks();
  const { t } = useLanguage();

  const WEB_KEYS = ["web_portfolio", "web_ecommerce", "web_education", "web_agency", "web_general"] as const;
  const GRAPHICS_KEYS = [
    "graphics_social",
    "graphics_logo",
    "graphics_vector",
    "graphics_branding",
    "graphics_general",
  ] as const;
  const VIDEO_KEYS = ["video_short", "video_reels", "video_funny", "video_square", "video_general"] as const;

  const categorized = useMemo(() => {
    const buckets: Record<string, Work[]> = {
      web_portfolio: [],
      web_ecommerce: [],
      web_education: [],
      web_agency: [],
      web_general: [],

      graphics_social: [],
      graphics_logo: [],
      graphics_vector: [],
      graphics_branding: [],
      graphics_general: [],

      video_short: [],
      video_reels: [],
      video_funny: [],
      video_square: [],
      video_general: [],

      other: [],
    };

    for (const w of works || []) {
      const c = w.category;

      // Web
      if (c.startsWith("web_")) {
        (buckets[c] ||= []).push(w);
        continue;
      }
      if (c === "web") {
        buckets.web_general.push(w);
        continue;
      }

      // Graphics (backward compatible: `design` and `graphics`)
      if (c.startsWith("graphics_")) {
        (buckets[c] ||= []).push(w);
        continue;
      }
      if (c === "graphics" || c === "design") {
        buckets.graphics_general.push(w);
        continue;
      }

      // Video
      if (c.startsWith("video_")) {
        (buckets[c] ||= []).push(w);
        continue;
      }
      if (c === "video") {
        buckets.video_general.push(w);
        continue;
      }

      // Fallback
      buckets.other.push(w);
    }

    return buckets;
  }, [works]);

  const hasAny = Object.values(categorized).some((arr) => (arr?.length || 0) > 0);
  const hasWeb = WEB_KEYS.some((k) => categorized[k]?.length);
  const hasGraphics = GRAPHICS_KEYS.some((k) => categorized[k]?.length);
  const hasVideo = VIDEO_KEYS.some((k) => categorized[k]?.length);

  const catLabel = (key: string) => t(`work.category.${key}`);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block"
            >
              {t("work.subtitle")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-display font-bold mb-6"
            >
              {t("work.title")} <span className="gradient-text">{t("work.title2")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              {t("work.description")}
            </motion.p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : !hasAny ? (
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto text-center text-muted-foreground">{t("work.noWorks")}</div>
        </div>
      ) : (
        <>
          {/* Web Development Section */}
          {hasWeb && (
            <section className="py-20">
              <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-8"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-display font-bold">{t("work.webDev")}</h2>
                      <p className="text-muted-foreground">{t("work.webDevDesc")}</p>
                    </div>
                  </motion.div>

                  {WEB_KEYS.map((key) => {
                    const items = categorized[key] || [];
                    if (!items.length) return null;

                    return (
                      <div key={key} className="mb-12 last:mb-0">
                        <h3 className="text-xl lg:text-2xl font-display font-semibold mb-5">{catLabel(key)}</h3>

                        {/* Web Projects Grid - Browser Mockup Style */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {items.map((project, index) => (
                            <motion.a
                              key={project.id}
                              href={project.project_url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.06 }}
                              className="group block"
                            >
                              {/* Browser Mockup */}
                              <div className="rounded-xl overflow-hidden border border-border bg-card shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                                {/* Browser Top Bar */}
                                <div className="bg-secondary/50 px-4 py-3 flex items-center gap-2 border-b border-border">
                                  <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                  </div>
                                  <div className="flex-1 mx-3">
                                    <div className="bg-background/80 rounded-md px-3 py-1.5 text-xs text-muted-foreground flex items-center gap-2 max-w-[200px]">
                                      <Globe size={12} />
                                      <span className="truncate">
                                        {project.project_url?.replace("https://", "") || project.title}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Website Preview Area */}
                                <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 via-background to-secondary/20 flex items-center justify-center relative overflow-hidden">
                                  <div className="text-center p-6">
                                    <Globe size={48} className="mx-auto mb-4 text-primary/40" />
                                    <h4 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                                      {project.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-4">{project.description || ""}</p>
                                  </div>

                                  {/* Hover Overlay */}
                                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                                      {t("work.visitWebsite")} <ExternalLink size={16} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Design Section */}
          {hasGraphics && (
            <section className="py-20 bg-secondary/30">
              <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-8"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Palette size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-display font-bold">{t("work.graphicDesign")}</h2>
                      <p className="text-muted-foreground">{t("work.graphicDesignDesc")}</p>
                    </div>
                  </motion.div>

                  {GRAPHICS_KEYS.map((key) => {
                    const items = categorized[key] || [];
                    if (!items.length) return null;

                    return (
                      <div key={key} className="mb-12 last:mb-0">
                        <h3 className="text-xl lg:text-2xl font-display font-semibold mb-5">{catLabel(key)}</h3>

                        {/* Design Projects Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {items.map((project, index) => (
                            <motion.div
                              key={project.id}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.06 }}
                              className="group"
                            >
                              <div className="rounded-xl overflow-hidden border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
                                {/* Image */}
                                <div className="aspect-[4/3] overflow-hidden">
                                  <img
                                    src={project.image_url || "/placeholder.svg"}
                                    alt={project.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                </div>
                                {/* Content */}
                                <div className="p-4">
                                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-md bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/25 mb-2">
                                    {catLabel(key)}
                                  </span>
                                  <h4 className="text-lg font-display font-semibold mb-1 group-hover:text-primary transition-colors">
                                    {project.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">{project.description || ""}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Video Editing Section */}
          {hasVideo && (
            <section className="py-20">
              <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-8"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Video size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-display font-bold">{t("work.videoEditing")}</h2>
                      <p className="text-muted-foreground">{t("work.videoEditingDesc")}</p>
                    </div>
                  </motion.div>

                  {VIDEO_KEYS.map((key) => {
                    const items = categorized[key] || [];
                    if (!items.length) return null;

                    return (
                      <div key={key} className="mb-12 last:mb-0">
                        <h3 className="text-xl lg:text-2xl font-display font-semibold mb-5">{catLabel(key)}</h3>

                        {/* Video Projects Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {items.map((project, index) => (
                            <motion.div
                              key={project.id}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.06 }}
                              className="group cursor-pointer"
                            >
                              <div className="rounded-xl overflow-hidden border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
                                {/* Thumbnail with Play Button */}
                                <div className="aspect-video overflow-hidden relative">
                                  <img
                                    src={project.image_url || "/placeholder.svg"}
                                    alt={project.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                  {/* Play Button Overlay */}
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                                      <Play
                                        size={24}
                                        className="text-primary-foreground ml-1"
                                        fill="currentColor"
                                      />
                                    </div>
                                  </div>
                                </div>
                                {/* Content */}
                                <div className="p-4">
                                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-md bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/25 mb-2">
                                    {catLabel(key)}
                                  </span>
                                  <h4 className="text-lg font-display font-semibold mb-1 group-hover:text-primary transition-colors">
                                    {project.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">{project.description || ""}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
              {t("work.likeWhatYouSee")}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t("work.letsCreate")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                {t("work.startProject")} <ArrowRight size={20} />
              </Link>
              <a
                href="https://wa.me/8801712345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary border border-border text-foreground rounded-xl font-medium text-lg hover:bg-secondary/80 transition-all duration-300"
              >
                {t("work.whatsappUs")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default WorkPage;
