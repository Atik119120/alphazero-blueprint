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
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block"
            >
              {c("subtitle", "about.subtitle")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-display font-bold mb-6"
            >
              {c("title", "about.title")} <span className="gradient-text">AlphaZero</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              {c("description", "about.description")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{c("story.badge", "about.story.badge")}</span>
              </motion.div>
              <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
                {c("story.title", "about.story.title")} <span className="gradient-text">AlphaZero</span> {c("story.title2", "about.story.title2")}
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Story Cards */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Rocket className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{c("story.card1.title", "about.story.card1.title")}</h3>
                        <p className="text-muted-foreground">
                          {c("story.card1.desc", "about.story.card1.desc")}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{c("story.card2.title", "about.story.card2.title")}</h3>
                        <p className="text-muted-foreground">
                          {c("story.card2.desc", "about.story.card2.desc")}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{c("story.card3.title", "about.story.card3.title")}</h3>
                        <p className="text-muted-foreground">
                          {c("story.card3.desc", "about.story.card3.desc")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Content - Logo & Features */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* Main Logo Card with Glow */}
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="aspect-square rounded-2xl bg-card p-8 flex items-center justify-center border border-border box-glow"
                  >
                    <div className="text-center">
                      <motion.img
                        src={logo}
                        alt="AlphaZero Logo"
                        className="h-32 md:h-40 w-auto mx-auto brightness-0 dark:invert mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", bounce: 0.4 }}
                      />
                      <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-primary text-xl font-semibold tracking-wide"
                      >
                        {c("tagline", "about.tagline")}
                      </motion.p>
                    </div>
                  </motion.div>
                  {/* Floating badges */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-primary text-primary-foreground font-medium text-xs"
                  >
                    {c("badge.agency", "about.badge.agency")}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-full bg-card border border-border font-medium text-xs"
                  >
                    🇧🇩 Bangladesh
                  </motion.div>
                </div>

                {/* Why Choose List */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 p-5 rounded-xl bg-card border border-border"
                >
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    {c("whyChoose", "about.whyChoose")}
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {whyChoose.map((item, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
                {c("values.title", "about.values.title")}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {c("values.subtitle", "about.values.subtitle")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <value.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Globe size={48} className="text-primary mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              {c("location.title", "about.location.title")}
            </h2>
            <p className="text-xl text-muted-foreground mb-2">
              {c("location.address", "about.location.address")}
            </p>
            <p className="text-muted-foreground mb-8">
              {c("location.desc", "about.location.desc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                {c("location.cta1", "about.location.cta1")} <ArrowRight size={20} />
              </Link>
              <a
                href="https://wa.me/8801410190019"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary border border-border text-foreground rounded-xl font-medium text-lg hover:bg-secondary/80 transition-all duration-300"
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
