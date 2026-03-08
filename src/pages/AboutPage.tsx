import { motion } from "framer-motion";
import { Globe, Zap, Target, CheckCircle, ArrowRight, Sparkles, Rocket, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageContent } from "@/hooks/usePageContent";

const AboutPage = () => {
  const { t } = useLanguage();
  const { getContent } = usePageContent('about');

  // Helper to get content with translation fallback
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

  return (
    <Layout>
      {/* Hero Section — editorial */}
      <section className="py-24 lg:py-36 relative overflow-hidden grain-texture">
        <div className="absolute inset-0 stripe-accent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] dark:bg-primary/[0.08] mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{c("subtitle", "about.subtitle")}</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-7xl font-display font-bold mb-6 leading-tight"
            >
              {c("title", "about.title")} <span className="gradient-text">AlphaZero</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-px bg-primary/40 mt-3 shrink-0" />
              <p className="text-xl text-muted-foreground max-w-2xl">
                {c("description", "about.description")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section — editorial horizontal list */}
      <section className="py-20 lg:py-28 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14"
            >
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block">
                {c("story.badge", "about.story.badge")}
              </span>
              <h2 className="text-3xl lg:text-5xl font-display font-bold">
                {c("story.title", "about.story.title")} <span className="gradient-text">AlphaZero</span> {c("story.title2", "about.story.title2")}
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left — Story cards as numbered rows */}
              <div className="border-t border-border/50 dark:border-border/30">
                {[
                  { icon: Rocket, title: c("story.card1.title", "about.story.card1.title"), desc: c("story.card1.desc", "about.story.card1.desc") },
                  { icon: Zap, title: c("story.card2.title", "about.story.card2.title"), desc: c("story.card2.desc", "about.story.card2.desc") },
                  { icon: Heart, title: c("story.card3.title", "about.story.card3.title"), desc: c("story.card3.desc", "about.story.card3.desc") },
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex items-start gap-5 py-7 border-b border-border/50 dark:border-border/30 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.03] transition-colors duration-300 px-2"
                  >
                    <span className="text-3xl font-display font-bold text-primary/15 dark:text-primary/10 leading-none shrink-0 w-10 group-hover:text-primary/30 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <card.icon size={18} className="text-primary" />
                        <h3 className="text-lg font-display font-bold">{card.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Right — Logo Card + Why Choose */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="rounded-xl bg-card/80 dark:bg-card/50 border border-border/50 dark:border-border/30 p-8 text-center">
                  <img
                    src={logo}
                    alt="AlphaZero Logo"
                    className="h-28 md:h-36 w-auto mx-auto brightness-0 dark:invert mb-6"
                  />
                  <p className="text-primary text-lg font-semibold tracking-wide">
                    {c("tagline", "about.tagline")}
                  </p>
                  <div className="flex justify-center gap-3 mt-4">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-medium text-xs">
                      {c("badge.agency", "about.badge.agency")}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-secondary border border-border font-medium text-xs">
                      🇧🇩 Bangladesh
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-card/80 dark:bg-card/50 border border-border/50 dark:border-border/30">
                  <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    {c("whyChoose", "about.whyChoose")}
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

      {/* Values — editorial cards with numbers */}
      <section className="py-20 lg:py-28 relative grain-texture">
        <div className="absolute inset-0 bg-secondary/20 dark:bg-card/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row items-end justify-between gap-6 mb-14"
            >
              <div>
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block">Core Values</span>
                <h2 className="text-3xl lg:text-5xl font-display font-bold">
                  {c("values.title", "about.values.title")}
                </h2>
              </div>
              <p className="text-muted-foreground max-w-md text-base lg:text-right">
                {c("values.subtitle", "about.values.subtitle")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group p-6 rounded-xl bg-background dark:bg-card/50 border border-border/50 dark:border-border/30 hover:border-primary/30 transition-all duration-400 relative overflow-hidden"
                >
                  <span className="absolute top-4 right-4 text-[10px] font-mono font-bold text-muted-foreground/30 tracking-wider">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-primary/[0.08] dark:bg-primary/[0.1] flex items-center justify-center mb-5 border border-primary/10">
                    <value.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
                  <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location — clean CTA */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block">Location</span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              {c("location.title", "about.location.title")}
            </h2>
            <p className="text-xl text-muted-foreground mb-2">
              {c("location.address", "about.location.address")}
            </p>
            <p className="text-muted-foreground mb-10">
              {c("location.desc", "about.location.desc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-9 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg transition-all duration-300 hover:opacity-90"
              >
                {c("location.cta1", "about.location.cta1")} <ArrowRight size={20} />
              </Link>
              <a
                href="https://wa.me/8801410190019"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-9 py-4 border-2 border-border text-foreground rounded-full font-semibold text-lg hover:border-primary/30 transition-all duration-300"
              >
                {c("location.cta2", "about.location.cta2")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
