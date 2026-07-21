import { motion } from "framer-motion";
import { Globe, Zap, Target, CheckCircle, ArrowRight, Sparkles, Rocket, Heart, Camera, Palette, Code, Instagram, Facebook, Linkedin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import logoAssetJson from "@/assets/logo.png.asset.json";
const logo = logoAssetJson.url;
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageContent } from "@/hooks/usePageContent";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import servicesHeroBg from "@/assets/about-hero-blue-orb.jpg.asset.json";
import ctaBlueWaves from "@/assets/about-cta-blue-waves.png.asset.json";
import TeamBento from "@/components/TeamBento";
import { Users } from "lucide-react";


const AboutPage = () => {
  const { t } = useLanguage();
  const { getContent } = usePageContent('about');
  const { data: teamMembers } = useTeamMembers();

  const founder = teamMembers?.find(m => m.name.toLowerCase().includes('sofiullah') || m.role.toLowerCase().includes('founder'));

  const c = (key: string, translationKey: string) => {
    const dbContent = getContent(key);
    return dbContent || t(translationKey);
  };

  const values = [
    { icon: Target, title: c("values.brandFocused", "about.values.brandFocused"), desc: c("values.brandFocusedDesc", "about.values.brandFocusedDesc") },
    { icon: Zap, title: c("values.zeroToImpact", "about.values.zeroToImpact"), desc: c("values.zeroToImpactDesc", "about.values.zeroToImpactDesc") },
    { icon: Globe, title: c("values.globalReach", "about.values.globalReach"), desc: c("values.globalReachDesc", "about.values.globalReachDesc") },
  ];

  const whyChoose = [
    c("why1", "about.why1"), c("why2", "about.why2"), c("why3", "about.why3"), c("why4", "about.why4"), c("why5", "about.why5"),
  ];

  const locationAddress =
    getContent("location.address") ||
    getContent("location.description") ||
    t("about.location.address");

  const locationDescription =
    getContent("location.desc") ||
    t("about.location.desc");

  const founderExpertise = [
    { icon: Camera, label: "Photography" },
    { icon: Palette, label: "Graphic Design" },
    { icon: Code, label: "Web Development" },
  ];

  return (
    <Layout flushTop>
      <div className="overflow-x-hidden">
      {/* Hero — Services style */}
      <section className="relative overflow-hidden pt-32 pb-14 lg:pt-36 lg:pb-18 rounded-b-[2.5rem]">
        {/* Uploaded background image */}
        <img
          src={servicesHeroBg.url}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          style={{ filter: "blur(4px)", transform: "scale(1.08)" }}
        />


        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.05] text-white mb-6">
              <span>About</span>{" "}
              <span className="gradient-text">Us</span>

            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-base lg:text-lg text-white/60 max-w-2xl mx-auto">
              {c("description", "about.description")}
            </motion.p>
          </div>
        </div>
      </section>






      {/* Story */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-6">
                <Rocket size={14} className="text-primary" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{c("story.badge", "about.story.badge")}</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-display font-bold">
                {c("story.title", "about.story.title")} <span className="gradient-text">AlphaZero</span> {c("story.title2", "about.story.title2")}
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Story cards */}
              <div className="space-y-4">
                {[
                  { icon: Rocket, title: c("story.card1.title", "about.story.card1.title"), desc: c("story.card1.desc", "about.story.card1.desc") },
                  { icon: Zap, title: c("story.card2.title", "about.story.card2.title"), desc: c("story.card2.desc", "about.story.card2.desc") },
                  { icon: Heart, title: c("story.card3.title", "about.story.card3.title"), desc: c("story.card3.desc", "about.story.card3.desc") },
                ].map((card, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="group relative p-6 rounded-2xl glass-card overflow-hidden">
                    <span className="absolute top-5 right-5 text-5xl font-display font-bold text-muted-foreground/[0.04] leading-none select-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <card.icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-bold mb-2">{card.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Logo + Why Choose */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-5">
                <div className="rounded-2xl glass-card p-8 text-center">
                  {(() => {
                    const customLogo = getContent("story.logoUrl");
                    return customLogo ? (
                      <img src={customLogo} alt="AlphaZero" className="h-28 md:h-36 w-auto mx-auto object-contain mb-6" />
                    ) : (
                      <img src={logo} alt="AlphaZero Logo" className="h-28 md:h-36 w-auto mx-auto brightness-0 dark:invert mb-6" />
                    );
                  })()}

                  <p className="text-primary text-lg font-semibold tracking-wide">{c("tagline", "about.tagline")}</p>
                  <div className="flex justify-center gap-3 mt-4">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-medium text-xs">{c("badge.agency", "about.badge.agency")}</span>
                    <span className="px-3 py-1 rounded-full bg-secondary border border-border font-medium text-xs">🇧🇩 Bangladesh</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl glass-card">
                  <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />{c("whyChoose", "about.whyChoose")}
                  </h4>
                  <div className="space-y-3">
                    {whyChoose.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <div className="inline-flex items-center gap-3 mb-5 text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">
                <span>›</span><span>Team</span><span>‹</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-display font-bold tracking-tight">People behind the work</h2>
            </motion.div>
            <TeamBento />
          </div>
        </div>
      </section>

      {/* Values — Tilted cards with squiggle connectors */}
      <section className="py-24 lg:py-32 relative bg-[#e9e9ea]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 lg:mb-20">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="h-px w-10 bg-foreground/30" />
                <span className="text-sm italic font-serif text-foreground/70">Our Values, Explained</span>
                <span className="h-px w-10 bg-foreground/30" />
              </div>
              <h2 className="text-4xl lg:text-6xl font-display font-semibold tracking-tight text-foreground">
                {c("values.title", "about.values.title")}
              </h2>
            </motion.div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3 lg:gap-4 pt-8">
              {/* Squiggle 1 → 2 : bottom-right of card 1 up to top of card 2 */}
              <svg className="hidden md:block absolute z-20 pointer-events-none" style={{ left: '30%', top: '48%', width: '140px', height: '130px' }} viewBox="0 0 140 130" fill="none">
                <circle cx="15" cy="115" r="3.5" stroke="#ff5722" strokeWidth="1.5" fill="none" />
                <path d="M 15 115 C 25 70, 90 95, 95 45 S 120 15, 128 12" stroke="#ff5722" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <circle cx="128" cy="12" r="3.5" stroke="#ff5722" strokeWidth="1.5" fill="none" />
              </svg>
              {/* Squiggle 2 → 3 : top of card 2 area down to card 3 */}
              <svg className="hidden md:block absolute z-20 pointer-events-none" style={{ left: '62%', top: '48%', width: '150px', height: '140px' }} viewBox="0 0 150 140" fill="none">
                <circle cx="20" cy="15" r="3.5" stroke="#ff5722" strokeWidth="1.5" fill="none" />
                <path d="M 20 15 C 30 65, 95 55, 90 100 S 125 125, 135 125" stroke="#ff5722" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <circle cx="135" cy="125" r="3.5" stroke="#ff5722" strokeWidth="1.5" fill="none" />
              </svg>

              {values.map((value, index) => {
                const rotations = ['-rotate-[4deg]', 'rotate-[3deg]', '-rotate-[2deg]'];
                const offsets = ['md:translate-y-6', 'md:-translate-y-4', 'md:translate-y-10'];
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12 }}
                    whileHover={{ rotate: 0, y: -8 }}
                    className={`relative aspect-square bg-white rounded-2xl p-8 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.25)] flex flex-col justify-between transform ${rotations[index]} ${offsets[index]} transition-transform`}
                  >
                    <div className="text-7xl lg:text-8xl font-display font-semibold text-foreground leading-none">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl lg:text-2xl font-display font-semibold text-foreground mb-2">{value.title}</h3>
                      <p className="text-sm text-foreground/60 leading-relaxed">{value.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Ready to start */}
      <section className="py-16 lg:py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-6xl mx-auto rounded-[2rem] overflow-hidden p-8 sm:p-12 lg:p-16"
          >
            {/* Background image */}
            <img
              src={ctaBlueWaves.url}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover"
            />


            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              {/* Left: Heading + CTA */}
              <div>
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/70 mb-5">
                  Let's build something great
                </p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.05] text-white mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
                  Ready to start<br />your next project?
                </h2>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-sm font-semibold shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] hover:shadow-[0_14px_34px_-10px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all"
                >
                  <span className="bg-gradient-to-r from-[#22D3EE] to-[#2563EB] bg-clip-text text-transparent">
                    Get started
                  </span>
                </Link>
              </div>


              {/* Right: Floating booking card */}
              <div className="lg:justify-self-end w-full max-w-sm">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="relative bg-background rounded-2xl p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] border border-border/60"
                >
                  {/* Status */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-40" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-foreground" />
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground">
                      Available for project
                    </span>
                  </div>

                  {/* Avatars */}
                  <div className="flex items-center gap-3 mb-4 relative">
                    <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-background shadow bg-muted">
                      <img
                        src={founder?.image_url || '/placeholder.svg'}
                        alt="Founder"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <span className="text-muted-foreground text-lg font-light">+</span>
                    <div className="relative w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
                      You
                      {/* Bouncing question mark */}
                      <motion.div
                        aria-hidden
                        className="absolute -top-3 -right-3 pointer-events-none"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0EA5E9] text-white text-xs font-black shadow-[0_4px_12px_-2px_rgba(14,165,233,0.6)]">
                          ?
                        </span>
                      </motion.div>
                    </div>

                  </div>

                  <h3 className="text-lg font-display font-bold text-foreground mb-1">
                    Quick 15-minute call
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Pick a time that works for you.
                  </p>

                  <Link
                    to="/contact"
                    className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#7DD3FC] via-[#60A5FA] to-[#3B82F6] text-white text-sm font-semibold shadow-[0_8px_24px_-8px_rgba(96,165,250,0.6)] hover:shadow-[0_12px_28px_-8px_rgba(59,130,246,0.8)] hover:brightness-110 transition-all"
                  >
                    Book a free call
                  </Link>
                </motion.div>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      </div>
    </Layout>

  );
};

export default AboutPage;