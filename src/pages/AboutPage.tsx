import { motion } from "framer-motion";
import {
  Globe,
  Zap,
  Target,
  ArrowRight,
  Rocket,
  Heart,
  Camera,
  Palette,
  Code,
  Instagram,
  Facebook,
  Linkedin,
  MapPin,
} from "lucide-react";
import Layout from "@/components/Layout";
import logoAssetJson from "@/assets/alphazero-logo.png.asset.json";
const logo = logoAssetJson.url;
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageContent } from "@/hooks/usePageContent";
import { useTeamMembers } from "@/hooks/useTeamMembers";

const AboutPage = () => {
  const { t } = useLanguage();
  const { getContent } = usePageContent("about");
  const { data: teamMembers } = useTeamMembers();

  const founder = teamMembers?.find(
    (m) =>
      m.name.toLowerCase().includes("sofiullah") ||
      m.role.toLowerCase().includes("founder")
  );

  const c = (key: string, translationKey: string) => {
    const dbContent = getContent(key);
    return dbContent || t(translationKey);
  };

  const values = [
    {
      icon: Target,
      title: c("values.brandFocused", "about.values.brandFocused"),
      desc: c("values.brandFocusedDesc", "about.values.brandFocusedDesc"),
    },
    {
      icon: Zap,
      title: c("values.zeroToImpact", "about.values.zeroToImpact"),
      desc: c("values.zeroToImpactDesc", "about.values.zeroToImpactDesc"),
    },
    {
      icon: Globe,
      title: c("values.globalReach", "about.values.globalReach"),
      desc: c("values.globalReachDesc", "about.values.globalReachDesc"),
    },
  ];

  const whyChoose = [
    c("why1", "about.why1"),
    c("why2", "about.why2"),
    c("why3", "about.why3"),
    c("why4", "about.why4"),
    c("why5", "about.why5"),
  ];

  const founderExpertise = [
    { icon: Camera, label: "Photography" },
    { icon: Palette, label: "Graphic Design" },
    { icon: Code, label: "Web Development" },
  ];

  const stats = [
    { value: "3+", label: "Years" },
    { value: "50+", label: "Projects" },
    { value: "30+", label: "Clients" },
    { value: "100%", label: "Satisfaction" },
  ];

  return (
    <Layout flushTop>
      <div className="overflow-x-hidden bg-background text-foreground">
        {/* ══════════ HERO — Astryx minimal ══════════ */}
        <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-28 border-b border-border">
          {/* Subtle dotted background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(hsl(var(--border)) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 100%)",
            }}
          />

          <div className="container mx-auto px-6 relative">
            <div className="max-w-3xl">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="astryx-eyebrow mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                About us
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-semibold tracking-[-0.03em] leading-[1.02] text-foreground mb-6"
              >
                {c("title", "about.title")}{" "}
                <span className="text-muted-foreground">AlphaZero</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-base lg:text-lg text-muted-foreground max-w-2xl leading-relaxed"
              >
                {c("description", "about.description")}
              </motion.p>

              {/* Stat strip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px astryx-surface overflow-hidden bg-border"
              >
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-card p-5 lg:p-6 flex flex-col gap-1"
                  >
                    <div className="text-2xl lg:text-3xl font-display font-semibold tracking-[-0.02em] text-foreground">
                      {s.value}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════ FOUNDER ══════════ */}
        <section
          className="py-20 lg:py-28 relative"
          itemScope
          itemType="https://schema.org/Person"
        >
          <meta itemProp="name" content="Sofiullah Ahammad" />
          <meta itemProp="alternateName" content="Atik Ahmed" />
          <meta
            itemProp="jobTitle"
            content="Photographer, Founder & Graphic Designer"
          />
          <link itemProp="url" href="https://alphazero.online/about" />

          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-12 lg:mb-16 max-w-2xl">
              <span className="astryx-eyebrow mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {getContent("founder.badge") || "Meet the founder"}
              </span>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-display font-semibold tracking-[-0.03em] leading-[1.05] text-foreground">
                {getContent("founder.title") || "The visionary behind"}{" "}
                <span className="text-muted-foreground">AlphaZero</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Portrait */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5"
              >
                <div className="astryx-surface overflow-hidden">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={founder?.image_url || "/placeholder.svg"}
                      alt={`${founder?.name || "Founder"} — Founder of AlphaZero`}
                      itemProp="image"
                      loading="eager"
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5 border-t border-border flex items-center justify-between">
                    <div>
                      <h3
                        className="font-display font-semibold text-base tracking-[-0.01em]"
                        itemProp="name"
                      >
                        {founder?.name || "Sofiullah Ahammad"}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {getContent("founder.role") ||
                          "Photographer, Founder & Graphic Designer"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {founder?.facebook_url && (
                        <a
                          href={founder.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          itemProp="sameAs"
                          className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:border-foreground/40 transition-colors astryx-focus"
                          aria-label="Facebook"
                        >
                          <Facebook size={13} className="text-muted-foreground" />
                        </a>
                      )}
                      {founder?.instagram_url && (
                        <a
                          href={founder.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          itemProp="sameAs"
                          className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:border-foreground/40 transition-colors astryx-focus"
                          aria-label="Instagram"
                        >
                          <Instagram size={13} className="text-muted-foreground" />
                        </a>
                      )}
                      {founder?.linkedin_url && (
                        <a
                          href={founder.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          itemProp="sameAs"
                          className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:border-foreground/40 transition-colors astryx-focus"
                          aria-label="LinkedIn"
                        >
                          <Linkedin size={13} className="text-muted-foreground" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Bio + expertise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="lg:col-span-7 flex flex-col gap-8"
              >
                <div>
                  <p
                    className="text-base lg:text-lg text-foreground/85 leading-relaxed"
                    itemProp="description"
                  >
                    {founder?.bio ||
                      "Sofiullah Ahammad, professionally known as Atik Ahmed, is a Bangladeshi visual creator based in Rajshahi, Bangladesh. He works across photography, graphic design, and web development, blending technology with visual storytelling."}
                  </p>
                </div>

                {/* Expertise */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
                    Expertise
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {founderExpertise.map((item) => (
                      <div
                        key={item.label}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card text-sm text-foreground"
                      >
                        <item.icon size={14} className="text-primary" />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location + CTA */}
                <div className="astryx-surface p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center">
                      <MapPin size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        Rajshahi, Bangladesh
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Working with clients worldwide
                      </div>
                    </div>
                  </div>
                  <a
                    href="/team"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors astryx-focus"
                  >
                    View full team
                    <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════ STORY ══════════ */}
        <section className="py-20 lg:py-28 border-t border-border relative bg-secondary/40">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-14 max-w-2xl">
              <span className="astryx-eyebrow mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {c("story.badge", "about.story.badge")}
              </span>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-display font-semibold tracking-[-0.03em] leading-[1.05] text-foreground">
                {c("story.title", "about.story.title")}{" "}
                <span className="text-muted-foreground">AlphaZero</span>{" "}
                {c("story.title2", "about.story.title2")}
              </h2>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
              {/* Story cards */}
              <div className="lg:col-span-7 grid gap-4">
                {[
                  {
                    icon: Rocket,
                    title: c("story.card1.title", "about.story.card1.title"),
                    desc: c("story.card1.desc", "about.story.card1.desc"),
                  },
                  {
                    icon: Zap,
                    title: c("story.card2.title", "about.story.card2.title"),
                    desc: c("story.card2.desc", "about.story.card2.desc"),
                  },
                  {
                    icon: Heart,
                    title: c("story.card3.title", "about.story.card3.title"),
                    desc: c("story.card3.desc", "about.story.card3.desc"),
                  },
                ].map((card, index) => (
                  <motion.article
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="astryx-surface p-6 lg:p-7 flex gap-5 group hover:shadow-[var(--shadow-card)] transition-shadow"
                  >
                    <div className="shrink-0 w-11 h-11 rounded-lg border border-border bg-secondary flex items-center justify-center group-hover:border-primary/30 transition-colors">
                      <card.icon size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-[11px] font-mono text-muted-foreground/70">
                          0{index + 1}
                        </span>
                        <h3 className="text-lg font-display font-semibold tracking-[-0.01em] text-foreground">
                          {card.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Right column — Logo + Why choose */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                className="lg:col-span-5 flex flex-col gap-4"
              >
                <div className="astryx-surface p-8 text-center">
                  <img
                    src={logo}
                    alt="AlphaZero"
                    className="h-24 md:h-28 w-auto mx-auto object-contain mb-5"
                  />

                  <p className="text-sm font-medium tracking-wide text-foreground">
                    {c("tagline", "about.tagline")}
                  </p>
                  <div className="flex justify-center gap-2 mt-4">
                    <span className="px-2.5 py-1 rounded-md bg-foreground text-background text-[11px] font-medium">
                      {c("badge.agency", "about.badge.agency")}
                    </span>
                    <span className="px-2.5 py-1 rounded-md border border-border bg-card text-[11px] font-medium text-muted-foreground">
                      🇧🇩 Bangladesh
                    </span>
                  </div>
                </div>

                <div className="astryx-surface p-6">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-4">
                    {c("whyChoose", "about.whyChoose")}
                  </div>
                  <ul className="space-y-3">
                    {whyChoose.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <span className="mt-2 w-1 h-1 rounded-full bg-primary shrink-0" />
                        <span className="text-foreground/85 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════ VALUES ══════════ */}
        <section className="py-20 lg:py-28 border-t border-border relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-14 max-w-2xl">
              <span className="astryx-eyebrow mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Core values
              </span>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-display font-semibold tracking-[-0.03em] leading-[1.05] text-foreground">
                {c("values.title", "about.values.title")}
              </h2>
              <p className="text-muted-foreground mt-4 text-base lg:text-lg max-w-xl leading-relaxed">
                {c("values.subtitle", "about.values.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-px astryx-surface overflow-hidden bg-border">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="bg-card p-7 lg:p-8 group hover:bg-secondary/60 transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg border border-border bg-secondary flex items-center justify-center mb-5 group-hover:border-primary/30 transition-colors">
                    <value.icon size={18} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-semibold tracking-[-0.01em] mb-2 text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;
