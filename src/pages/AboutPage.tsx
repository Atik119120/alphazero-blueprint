import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Globe, Zap, Target, CheckCircle, ArrowRight, Sparkles, Rocket, Heart, Camera, Palette, Code, Instagram, Facebook, Linkedin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import logoAssetJson from "@/assets/logo.png.asset.json";
import journeyLogoJson from "@/assets/alphazero-logo-2.png.asset.json";
const logo = logoAssetJson.url;
const journeyLogo = journeyLogoJson.url;
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
      <section className="pt-24 lg:pt-32 pb-2 lg:pb-2 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Split editorial header */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 lg:mb-28">
              {/* Left: abstract blob graphic */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative flex items-center justify-center min-h-[320px] lg:min-h-[420px]"
              >
                <motion.img
                  src={journeyLogo}
                  alt="AlphaZero"
                  className="w-full max-w-md object-contain opacity-30"
                  initial={{ scale: 0.85, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 0.3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>

              {/* Right: label + heading + copy + button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="text-sm text-muted-foreground tracking-wide mb-6">
                  / {(c("story.badge", "about.story.badge") || "about").toLowerCase()} /
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.05] tracking-tight mb-8">
                  {c("story.title", "about.story.title")}{" "}
                  <span className="gradient-text">AlphaZero</span>{" "}
                  {c("story.title2", "about.story.title2")}
                </h2>
                <div className="space-y-5 text-muted-foreground text-base lg:text-lg leading-relaxed max-w-xl mb-10">
                  <p>{c("story.card1.desc", "about.story.card1.desc")}</p>
                  <p>{c("story.card2.desc", "about.story.card2.desc")}</p>
                </div>
                <a
                  href="#team"
                  className="inline-flex items-center gap-2 pl-2 pr-6 py-2 rounded-full border border-primary/40 text-sm font-medium hover:bg-primary/5 transition-colors group"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full border border-primary/40 text-primary group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight size={14} />
                  </span>
                  <span className="gradient-text font-semibold">Explore more</span>
                </a>
              </motion.div>
            </div>


          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="pt-2 lg:pt-2 pb-8 lg:pb-12 relative">
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

      {/* Process cards — floating tilted cards with dynamically-aligned red S-curve connectors */}
      <section data-process-section className="pt-8 lg:pt-12 pb-2 lg:pb-2 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #FAFAFA 0%, #F3F3F4 100%)" }}>
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-4 lg:mb-6"
            >
              <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                <span>›</span><span>VALUES</span><span>‹</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-display font-bold tracking-tight">Built on Strong Values</h2>
            </motion.div>
            <ProcessCards values={values} />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

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

const faqs = [
  { q: "What services does AlphaZero offer?", a: "We offer branding, web development, digital marketing, video production, graphic design, and a full learning academy — everything to build a strong digital presence." },
  { q: "Do you work with startups and small businesses?", a: "Absolutely. We tailor our approach for every stage — from early-stage founders to established brands scaling globally." },
  { q: "How long does a typical project take?", a: "Most branding and web projects run 2–6 weeks depending on scope. We share a clear timeline before kickoff, so you always know what's next." },
  { q: "Can I learn digital skills at AlphaZero?", a: "Yes — AlphaZero Learn offers structured courses in AI, design, programming, marketing, and freelancing, taught by industry practitioners." },
  { q: "How do I get started?", a: "Book a free discovery call. We'll understand your goals, share a plan, and only move forward when everything feels right." },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="pt-4 lg:pt-6 pb-20 lg:pb-28 relative" style={{ background: "linear-gradient(180deg, #F3F3F4 0%, #FAFAFA 100%)" }}>
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4">
            <span>›</span> FAQ <span>‹</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-display font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="mt-4 text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto">
            Everything you need to know before working with us — or learning with us.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-black/5 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 lg:px-8 lg:py-6 text-left"
                >
                  <span className="font-display text-lg lg:text-xl font-semibold">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-xl"
                    style={{ background: "linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%)" }}
                  >
                    +
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 lg:px-8 lg:pb-7 text-muted-foreground leading-relaxed">
                    {item.a}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

type ProcessValue = { icon: any; title: string; desc: string };

const ProcessCards = ({ values }: { values: ProcessValue[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [paths, setPaths] = useState<{ d: string; x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const positions = [
    "md:absolute md:left-0 md:top-[158px] md:w-[285px] lg:w-[300px]",
    "md:absolute md:left-[calc(50%-142px)] lg:left-[calc(50%-150px)] md:top-[46px] md:w-[285px] lg:w-[300px]",
    "md:absolute md:right-0 md:top-[178px] md:w-[285px] lg:w-[300px]",
  ];
  const rotations = [-4, 2, 4];
  const zIndex = [30, 30, 30];

  const compute = () => {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const next: typeof paths = [];
    for (let i = 0; i < cardRefs.current.length - 1; i++) {
      const a = cardRefs.current[i];
      const b = cardRefs.current[i + 1];
      if (!a || !b) continue;
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      // Anchor just outside the visible card edge so the connector never looks hidden or broken.
      const x1 = ar.right - cRect.left + 2;
      const y1 = ar.top + ar.height / 2 - cRect.top;
      const x2 = br.left - cRect.left - 2;
      const y2 = br.top + br.height / 2 - cRect.top;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const direction = y2 < y1 ? -1 : 1;
      const wave = Math.min(180, Math.max(130, Math.abs(dx) * 0.9));
      const d = `M ${x1} ${y1} C ${x1 + dx * 0.35} ${y1 + direction * wave}, ${x2 - dx * 0.35} ${y2 - direction * wave}, ${x2} ${y2}`;
      next.push({ d, x1, y1, x2, y2 });
    }
    setSize({ w: container.offsetWidth, h: container.offsetHeight });
    setPaths(next);
  };

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(compute);
    const timer = window.setTimeout(compute, 650);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [values.length]);

  useEffect(() => {
    const ro = new ResizeObserver(() => compute());
    if (containerRef.current) ro.observe(containerRef.current);
    cardRefs.current.forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative grid grid-cols-1 gap-8 pt-20 pb-20 md:block md:min-h-[590px]">
      {/* Dynamic connector overlay — behind cards, non-interactive */}
      <svg
        className="hidden md:block absolute inset-0 pointer-events-none"
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
        style={{ zIndex: 20 }}
        fill="none"
      >
        <defs>
          <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        {paths.map((p, i) => (
          <g key={i}>
            <circle cx={p.x1} cy={p.y1} r={6} stroke="url(#connectorGradient)" strokeWidth={2.4} fill="#FAFAFA" />
            <motion.path
              d={p.d}
              stroke="url(#connectorGradient)"
              strokeWidth={2.8}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.1 }}
            />
            <circle cx={p.x2} cy={p.y2} r={6} stroke="url(#connectorGradient)" strokeWidth={2.4} fill="#FAFAFA" />
          </g>
        ))}
      </svg>

      {values.map((value, index) => (
        <motion.div
          key={value.title}
          ref={(el) => (cardRefs.current[index] = el)}
          data-process-card
          initial={{ opacity: 0, y: 40, rotate: rotations[index] }}
          whileInView={{ opacity: 1, y: 0, rotate: rotations[index] }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15, duration: 0.6 }}
          whileHover={{ y: -12, rotate: 0, scale: 1.03, transition: { duration: 0.3 } }}
          style={{ zIndex: zIndex[index] }}
          className={`relative aspect-square w-full bg-white rounded-[28px] p-8 lg:p-10 flex flex-col justify-between ${positions[index]} shadow-[0_30px_60px_-25px_rgba(0,0,0,0.22),0_10px_30px_-15px_rgba(0,0,0,0.12)] hover:shadow-[0_40px_80px_-25px_rgba(0,0,0,0.30),0_15px_35px_-15px_rgba(0,0,0,0.15)] transition-shadow duration-300`}
        >
          <div className="text-6xl lg:text-7xl font-display font-semibold text-foreground leading-none tracking-tight">
            {index + 1}
          </div>
          <div>
            <h3 className="text-xl lg:text-2xl font-display font-semibold text-foreground mb-2 tracking-tight">
              {value.title}
            </h3>
            <p className="text-sm text-foreground/55 leading-relaxed">{value.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};


export default AboutPage;