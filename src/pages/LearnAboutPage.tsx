import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Target,
  Award,
  Users,
  Rocket,
  Heart,
  Globe,
  BookOpen,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import CoursesNavbar from "@/components/CoursesNavbar";
import CoursesFooter from "@/components/CoursesFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import learnLogo from "@/assets/learn-with-alphazero-logo.png";

const LearnAboutPage = () => {
  const { language } = useLanguage();
  const isBn = language === "bn";

  const t = isBn
    ? {
        badge: "আমাদের সম্পর্কে",
        title1: "শেখার নতুন",
        title2: "যুগ শুরু হোক",
        intro:
          "Learn with AlphaZero একটি ১০০% অনলাইন-ভিত্তিক প্র্যাক্টিক্যাল ও AI-পাওয়ার্ড লার্নিং প্ল্যাটফর্ম, যা বাংলাদেশের শিক্ষার্থীদের ঘরে বসে ডিজিটাল ক্যারিয়ার গড়ে তুলতে সাহায্য করে।",
        missionLabel: "আমাদের মিশন",
        missionTitle: "সবার জন্য মানসম্মত ডিজিটাল শিক্ষা",
        missionDesc:
          "আমরা বিশ্বাস করি — সঠিক শিক্ষা পেলে যেকোনো মানুষ ডিজিটাল দুনিয়ায় নিজেকে প্রতিষ্ঠিত করতে পারে। তাই আমরা সাশ্রয়ী মূল্যে ইন্ডাস্ট্রি-স্ট্যান্ডার্ড কোর্স তৈরি করি, যাতে গ্রাম হোক বা শহর — সবাই সমান সুযোগ পায়।",
        storyLabel: "আমাদের গল্প",
        storyTitle: "শূন্য থেকে শুরু",
        storyDesc:
          "AlphaZero এজেন্সির অভিজ্ঞতা থেকে জন্ম নিয়েছে Learn with AlphaZero। বছরের পর বছর ক্লায়েন্ট প্রজেক্টে কাজ করার সময় আমরা দেখেছি — বাংলাদেশে দক্ষ ডিজাইনার, ডেভেলপার আর মার্কেটারদের ঘাটতি কতটা প্রকট। সেই ঘাটতি পূরণ করতেই আমরা তৈরি করেছি এই একাডেমি — যেখানে প্রতিটি কোর্স আসল ইন্ডাস্ট্রি অভিজ্ঞতা থেকে তৈরি।",
        valuesLabel: "আমাদের মূল্যবোধ",
        valuesTitle: "যা আমাদের আলাদা করে",
        v1t: "প্র্যাক্টিক্যাল লার্নিং",
        v1d: "শুধু থিওরি না — রিয়েল প্রজেক্ট, রিয়েল টুলস, রিয়েল রেজাল্ট।",
        v2t: "AI-পাওয়ার্ড",
        v2d: "সর্বশেষ AI টুলস ব্যবহার করে দ্রুত ও স্মার্ট শেখানোর পদ্ধতি।",
        v3t: "সাশ্রয়ী মূল্য",
        v3d: "বাংলাদেশের বাজারের জন্য মানানসই মূল্যে প্রিমিয়াম কনটেন্ট।",
        v4t: "সার্টিফিকেট",
        v4d: "প্রতিটি কোর্স শেষে ভেরিফায়েবল ডিজিটাল সার্টিফিকেট।",
        v5t: "আজীবন অ্যাক্সেস",
        v5d: "একবার এনরোল করলে সারাজীবন কোর্সে অ্যাক্সেস পাবেন।",
        v6t: "কমিউনিটি সাপোর্ট",
        v6d: "প্রাইভেট কমিউনিটিতে সরাসরি ইনস্ট্রাক্টর ও পিয়ার সাপোর্ট।",
        statsLabel: "সংখ্যায় আমরা",
        s1: "সক্রিয় শিক্ষার্থী",
        s2: "প্রিমিয়াম কোর্স",
        s3: "এক্সপার্ট ইনস্ট্রাক্টর",
        s4: "সন্তুষ্টির হার",
        ctaTitle: "আজই শুরু করুন আপনার",
        ctaTitle2: "ডিজিটাল ক্যারিয়ার",
        ctaDesc: "আপনার পছন্দের কোর্স বেছে নিন এবং একজন এক্সপার্ট হওয়ার পথে প্রথম পদক্ষেপ নিন।",
        ctaBtn: "কোর্স দেখুন",
        ctaBtn2: "স্টুডেন্ট লগইন",
      }
    : {
        badge: "About Us",
        title1: "A New Era of",
        title2: "Learning Begins",
        intro:
          "Learn with AlphaZero is a 100% online, practical & AI-powered learning platform helping students across Bangladesh build digital careers right from home.",
        missionLabel: "Our Mission",
        missionTitle: "Quality digital education for everyone",
        missionDesc:
          "We believe the right education can empower anyone to thrive in the digital world. That's why we build industry-standard courses at affordable prices — so students from every corner, village or city, get an equal opportunity.",
        storyLabel: "Our Story",
        storyTitle: "Started from zero",
        storyDesc:
          "Learn with AlphaZero was born out of the AlphaZero agency. Years of client work exposed how deep the skill gap is for designers, developers, and marketers in Bangladesh. This academy is our answer — every course is built from real industry experience, not textbook theory.",
        valuesLabel: "Our Values",
        valuesTitle: "What sets us apart",
        v1t: "Practical Learning",
        v1d: "No dry theory — real projects, real tools, real results.",
        v2t: "AI-Powered",
        v2d: "Latest AI tools baked into a faster, smarter learning workflow.",
        v3t: "Affordable Pricing",
        v3d: "Premium content priced for the Bangladesh market.",
        v4t: "Certificates",
        v4d: "Verifiable digital certificates on course completion.",
        v5t: "Lifetime Access",
        v5d: "Enroll once, access the course forever — at your own pace.",
        v6t: "Community Support",
        v6d: "Private community with direct instructor and peer support.",
        statsLabel: "By the numbers",
        s1: "Active Students",
        s2: "Premium Courses",
        s3: "Expert Instructors",
        s4: "Satisfaction Rate",
        ctaTitle: "Start your",
        ctaTitle2: "digital career today",
        ctaDesc:
          "Pick the course that fits you and take your first step toward becoming an expert.",
        ctaBtn: "Browse Courses",
        ctaBtn2: "Student Login",
      };

  const values = [
    { icon: Target, title: t.v1t, desc: t.v1d },
    { icon: Zap, title: t.v2t, desc: t.v2d },
    { icon: Heart, title: t.v3t, desc: t.v3d },
    { icon: Award, title: t.v4t, desc: t.v4d },
    { icon: ShieldCheck, title: t.v5t, desc: t.v5d },
    { icon: Users, title: t.v6t, desc: t.v6d },
  ];

  const stats = [
    { icon: GraduationCap, value: "1,200+", label: t.s1 },
    { icon: BookOpen, value: "25+", label: t.s2 },
    { icon: Users, value: "15+", label: t.s3 },
    { icon: Sparkles, value: "98%", label: t.s4 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <CoursesNavbar />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              src={learnLogo}
              alt="Learn with AlphaZero"
              className="h-14 sm:h-16 w-auto mx-auto mb-8 dark:brightness-0 dark:invert"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/[0.06] backdrop-blur-sm mb-6"
            >
              <Sparkles size={12} className="text-primary" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">
                {t.badge}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-display font-bold leading-tight mb-6"
            >
              {t.title1} <span className="gradient-text">{t.title2}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              {t.intro}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 lg:p-10"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary mb-3 block">
                {t.missionLabel}
              </span>
              <h2 className="text-2xl lg:text-3xl font-display font-bold mb-4 leading-tight">
                {t.missionTitle}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t.missionDesc}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 lg:p-10"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary mb-3 block">
                {t.storyLabel}
              </span>
              <h2 className="text-2xl lg:text-3xl font-display font-bold mb-4 leading-tight">
                {t.storyTitle}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t.storyDesc}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 border-t border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary mb-3 block">
              {t.valuesLabel}
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold leading-tight">
              {t.valuesTitle}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-6 hover:border-primary/40 transition-all hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary mb-3 block">
              {t.statsLabel}
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-1">
                  {s.value}
                </div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-40" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center glass-card rounded-3xl p-10 lg:p-16"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4 leading-tight">
              {t.ctaTitle} <span className="gradient-text">{t.ctaTitle2}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">{t.ctaDesc}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="group px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <BookOpen size={16} />
                {t.ctaBtn}
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </Link>
              <Link
                to="/student/login"
                className="px-6 py-3 border border-primary/30 bg-primary/[0.05] rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-primary/10 transition-colors"
              >
                <Users size={16} />
                {t.ctaBtn2}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <CoursesFooter />
    </div>
  );
};

export default LearnAboutPage;
