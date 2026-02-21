import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  MessageCircle,
  CheckCircle,
  Loader2,
  ExternalLink,
  BookOpen,
  Users,
  Briefcase,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";
import LayoutComponent from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageContent } from "@/hooks/usePageContent";
import { useServices } from "@/hooks/useServices";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useWorks } from "@/hooks/useWorks";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import * as LucideIcons from "lucide-react";

// Icon mapping for dynamic services
const iconMap: Record<string, any> = {
  Code: LucideIcons.Code, Palette: LucideIcons.Palette, Video: LucideIcons.Video,
  Search: LucideIcons.Search, Globe: LucideIcons.Globe, Smartphone: LucideIcons.Smartphone,
  Monitor: LucideIcons.Monitor, PenTool: LucideIcons.PenTool, Camera: LucideIcons.Camera,
  Megaphone: LucideIcons.Megaphone, BarChart: LucideIcons.BarChart, Shield: LucideIcons.Shield,
  Zap: LucideIcons.Zap, Sparkles: LucideIcons.Sparkles, Target: LucideIcons.Target,
  Layers: LucideIcons.Layers, Box: LucideIcons.Box, Settings: LucideIcons.Settings,
  Layout: LucideIcons.Layout, Share2: LucideIcons.Share2, ShoppingCart: LucideIcons.ShoppingCart,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1 }
  })
};

const Index = () => {
  const { t } = useLanguage();
  const { getContent } = usePageContent('home');
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers();
  const { data: works, isLoading: worksLoading } = useWorks();
  const { courses, isLoading: coursesLoading } = usePublicCourses();

  const c = (key: string, translationKey: string) => {
    const dbContent = getContent(key);
    return dbContent || t(translationKey);
  };

  // Filter items for homepage display
  const homepageServices = services?.filter((s: any) => s.show_on_homepage)?.slice(0, 6) || [];
  const homepageWorks = works?.filter((w: any) => w.show_on_homepage || w.is_featured)?.slice(0, 6) || [];
  const homepageTeam = teamMembers?.filter((m: any) => m.show_on_homepage)?.slice(0, 4) || [];
  const homepageCourses = courses?.filter((c: any) => c.show_on_homepage)?.slice(0, 4) || [];

  // Fallback: if no items have show_on_homepage, show first N items
  const displayServices = homepageServices.length > 0 ? homepageServices : services?.slice(0, 6) || [];
  const displayWorks = homepageWorks.length > 0 ? homepageWorks : works?.filter(w => w.is_featured)?.slice(0, 6) || works?.slice(0, 6) || [];
  const displayTeam = homepageTeam.length > 0 ? homepageTeam : teamMembers?.slice(0, 4) || [];
  const displayCourses = homepageCourses.length > 0 ? homepageCourses : courses?.slice(0, 4) || [];

  const stats = [
    { value: c("stats.projects", "home.stats.projects") || "50+", label: c("stats.projects_label", "home.stats.projects"), icon: Briefcase },
    { value: c("stats.clients", "home.stats.clients") || "30+", label: c("stats.clients_label", "home.stats.clients"), icon: Users },
    { value: c("stats.years", "home.stats.years") || "3+", label: c("stats.years_label", "home.stats.years"), icon: Award },
    { value: c("stats.satisfaction", "home.stats.satisfaction") || "100%", label: c("stats.satisfaction_label", "home.stats.satisfaction"), icon: CheckCircle },
  ];

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Sparkles;
    return iconMap[iconName] || Sparkles;
  };

  return (
    <LayoutComponent>
      {/* ═══════════════════════════════════════════════ */}
      {/* 1. HERO SECTION — Strong Brand Statement */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
        {/* Background accents */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 border border-primary/20 mb-10 backdrop-blur-sm"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-sm font-medium text-foreground">{c("badge", "home.badge")}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight mb-6"
            >
              {c("title1", "home.title1")}{" "}
              <span className="gradient-text">{c("title2", "home.title2")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl lg:text-3xl font-display font-medium text-primary/90 mb-6"
            >
              {c("tagline", "home.tagline")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              {c("description", "home.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/work"
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2"
              >
                {c("cta2", "home.cta2")}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-card/80 backdrop-blur-sm border border-border text-foreground rounded-xl font-medium text-lg hover:border-primary/30 hover:bg-card transition-all duration-300"
              >
                {c("cta1", "home.cta1")}
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-primary rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* 2. ABOUT PREVIEW — Who We Are + Stats */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - Text */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
                  {c("aboutLabel", "home.aboutLabel") || "Who We Are"}
                </span>
                <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6 leading-tight">
                  {c("aboutTitle", "home.aboutTitle") || "We Build Brands That"}{" "}
                  <span className="gradient-text">{c("aboutTitleHighlight", "home.aboutTitleHighlight") || "Stand Out"}</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {c("aboutDesc", "home.aboutDesc") || "AlphaZero is a creative digital agency based in Bangladesh. We help brands grow through stunning design, development, and strategic marketing."}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {c("aboutMission", "home.aboutMission") || "Our mission is to bring ideas to life with pixel-perfect execution and a deep understanding of what makes brands truly memorable."}
                </p>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
                >
                  {c("learnMore", "home.learnMore") || "Learn more about us"} <ArrowRight size={18} />
                </Link>
              </motion.div>

              {/* Right - Stats Grid */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    custom={index}
                    variants={fadeUp}
                    className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 hover:border-primary/20 transition-all duration-500 text-center"
                  >
                    <stat.icon size={24} className="text-primary mx-auto mb-3" />
                    <div className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* 3. SERVICES PREVIEW — What We Do */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-card/40 backdrop-blur-sm border-y border-border/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-14"
            >
              <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block">
                {c("expertise", "home.expertise") || "What We Do"}
              </span>
              <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
                {c("whatWeDo", "home.whatWeDo") || "Our"} <span className="gradient-text">{c("do", "home.do") || "Services"}</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {c("expertiseDesc", "home.expertiseDesc") || "We offer a full suite of creative and digital services to help your brand thrive."}
              </p>
            </motion.div>

            {servicesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {displayServices.map((service, index) => {
                  const IconComponent = getIcon(service.icon);
                  return (
                    <motion.div
                      key={service.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={index}
                      variants={fadeUp}
                      className="group p-6 lg:p-8 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                        <IconComponent size={24} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-display font-semibold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mt-10"
            >
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/30 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {c("viewAllServices", "home.viewAllServices") || "View All Services"} <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* 4. SELECTED WORK — Our Portfolio */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-14"
            >
              <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block">
                {c("workLabel", "home.workLabel") || "Our Portfolio"}
              </span>
              <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
                {c("workTitle", "home.workTitle") || "Selected"} <span className="gradient-text">{c("workTitleHighlight", "home.workTitleHighlight") || "Projects"}</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {c("workDesc", "home.workDesc") || "A showcase of our finest work across design, development, and multimedia."}
              </p>
            </motion.div>

            {worksLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : displayWorks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No projects to display.</div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {displayWorks.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={index}
                    variants={fadeUp}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border/50 hover:border-primary/30 transition-all duration-500 cursor-pointer"
                  >
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-card">
                        <Briefcase className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                      <h3 className="text-foreground font-display font-semibold text-lg mb-1">{project.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{project.description}</p>
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:gap-2 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} /> View Project
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mt-10"
            >
              <Link
                to="/work"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/30 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {c("viewAllWork", "home.viewAllWork") || "View All Projects"} <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* 5. TEAM PREVIEW — Our People */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-card/40 backdrop-blur-sm border-y border-border/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-14"
            >
              <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block">
                {c("teamLabel", "home.teamLabel") || "Our Team"}
              </span>
              <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
                {c("teamTitle", "home.teamTitle") || "Meet the"} <span className="gradient-text">{c("teamTitleHighlight", "home.teamTitleHighlight") || "Creative Minds"}</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {c("teamDesc", "home.teamDesc") || "The talented people behind every project we deliver."}
              </p>
            </motion.div>

            {teamLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {displayTeam.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={index}
                    variants={fadeUp}
                    className="group text-center"
                  >
                    <div className="relative mb-4 rounded-2xl overflow-hidden aspect-square bg-muted border border-border/50 group-hover:border-primary/30 transition-all duration-500">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-card">
                          <Users className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                      {/* Subtle gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-primary text-sm font-medium">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mt-10"
            >
              <Link
                to="/team"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/30 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {c("viewFullTeam", "home.viewFullTeam") || "Meet Full Team"} <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* 6. COURSES PREVIEW */}
      {/* ═══════════════════════════════════════════════ */}
      {displayCourses.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center mb-14"
              >
                <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block">
                  {c("coursesLabel", "home.coursesLabel") || "Learn With Us"}
                </span>
                <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
                  {c("coursesTitle", "home.coursesTitle") || "Our"} <span className="gradient-text">{c("coursesTitleHighlight", "home.coursesTitleHighlight") || "Courses"}</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  {c("coursesDesc", "home.coursesDesc") || "Learn design, development, and digital skills from industry professionals."}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {displayCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={index}
                    variants={fadeUp}
                    className="group rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                  >
                    <div className="aspect-video bg-muted overflow-hidden">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-semibold mb-2 line-clamp-2">{course.title}</h3>
                      {course.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{course.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        {course.price && course.price > 0 ? (
                          <span className="text-primary font-bold">৳{course.price}</span>
                        ) : (
                          <span className="text-primary font-medium text-sm">Free</span>
                        )}
                        <Link
                          to="/courses"
                          className="text-sm text-primary font-medium hover:underline"
                        >
                          Details →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center mt-10"
              >
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/30 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  {c("viewAllCourses", "home.viewAllCourses") || "View All Courses"} <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* 7. CONTACT CTA — Let's Work Together */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-4xl mx-auto relative"
          >
            {/* Glow effects */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative text-center p-10 lg:p-16 rounded-3xl bg-card/80 backdrop-blur-sm border border-primary/20 overflow-hidden">
              {/* Subtle corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-br-3xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-3xl" />
              
              <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4 relative">
                {c("letsBuild", "home.letsBuild") || "Ready to Build Your"}{" "}
                <span className="gradient-text">{c("brand", "home.brand") || "Brand"}</span>?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto relative">
                {c("readyTo", "home.readyTo") || "Let's discuss your project and create something extraordinary together. Get in touch with us today."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                >
                  {c("freeConsultation", "home.freeConsultation") || "Start a Project"} <ArrowRight size={18} />
                </Link>
                <a
                  href="https://wa.me/8801344497808"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-card border border-border text-foreground rounded-xl font-medium text-lg hover:border-primary/30 transition-all duration-300"
                >
                  <MessageCircle size={18} />
                  {c("whatsappUs", "home.whatsappUs") || "WhatsApp Us"}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </LayoutComponent>
  );
};

export default Index;
