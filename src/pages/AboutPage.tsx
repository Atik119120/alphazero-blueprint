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

      {/* Values */}
      <section className="py-24 lg:py-32 relative mesh-bg">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-6">
                <Target size={14} className="text-primary" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Core Values</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-display font-bold">{c("values.title", "about.values.title")}</h2>
              <p className="text-muted-foreground max-w-lg mx-auto mt-4">{c("values.subtitle", "about.values.subtitle")}</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {values.map((value, index) => (
                <motion.div key={value.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group relative p-7 rounded-2xl glass-card overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute -bottom-4 -right-2 text-[7rem] font-display font-bold text-muted-foreground/[0.04] leading-none select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-primary/[0.08] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <value.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
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
            style={{ background: "linear-gradient(135deg, #fbbf6e 0%, #f59e42 55%, #ef8b2a 100%)" }}
          >
            {/* Decorative circles */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-70" viewBox="0 0 1000 400" preserveAspectRatio="none" fill="none">
              <circle cx="500" cy="-40" r="240" stroke="#ea7a15" strokeWidth="2" />
              <circle cx="120" cy="440" r="220" stroke="#ea7a15" strokeWidth="2" />
              <circle cx="880" cy="440" r="220" stroke="#ea7a15" strokeWidth="2" />
            </svg>

            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              {/* Left: Heading + CTA */}
              <div>
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-900/70 mb-5">
                  Let's build something great
                </p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.05] text-neutral-900 mb-8">
                  Ready to start<br />your next project?
                </h2>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-all hover:scale-[1.02]"
                >
                  Get started
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Right: Floating booking card */}
              <div className="lg:justify-self-end w-full max-w-sm">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="relative bg-white rounded-2xl p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)]"
                >
                  {/* Status */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 opacity-40" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neutral-900" />
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-900">
                      Available for project
                    </span>
                  </div>

                  {/* Avatars */}
                  <div className="flex items-center gap-3 mb-4 relative">
                    <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white shadow bg-neutral-200">
                      <img
                        src={founder?.image_url || '/placeholder.svg'}
                        alt="Founder"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <span className="text-neutral-500 text-lg font-light">+</span>
                    <div className="w-11 h-11 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                      You
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-900"><path d="M4 2l16 10-7 2-2 7L4 2z" /></svg>
                      <span className="px-2 py-1 rounded-md bg-neutral-900 text-white text-[10px] font-bold tracking-widest">
                        {(founder?.name || 'Founder').split(' ')[0].toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-display font-bold text-neutral-900 mb-1">
                    Quick 15-minute call
                  </h3>
                  <p className="text-sm text-neutral-500 mb-5">
                    Pick a time that works for you.
                  </p>

                  <Link
                    to="/contact"
                    className="block w-full text-center py-3 rounded-xl bg-[#ef6820] text-white text-sm font-semibold hover:bg-[#dc5a17] transition-all"
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