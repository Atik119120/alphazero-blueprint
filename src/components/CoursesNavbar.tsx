import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, ArrowUpRight, LayoutGrid, Info, Users as UsersIcon, Phone, Home, Building2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import learnLogo from "@/assets/learn-with-alphazero-logo.png";
import SearchModal from "./SearchModal";

const CoursesNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const isBn = language === "bn";

  const isLearnSubdomain = typeof window !== "undefined" && window.location.hostname.startsWith("learn.");
  const coursesHomeHref = isLearnSubdomain ? "/" : "/courses";
  const agencyHref = isLearnSubdomain ? "https://alphazero.online" : "/";

  const navLinks = [
    { name: isBn ? "হোম" : "Home", to: coursesHomeHref, id: "home", icon: Home, internal: true },
    { name: isBn ? "সম্পর্কে" : "About Us", to: "/about", icon: Info, internal: true },
    { name: isBn ? "কোর্স" : "Courses", to: "/courses", id: "courses", icon: LayoutGrid, internal: true },
    { name: isBn ? "যোগাযোগ" : "Contact", to: "/contact", id: "contact", icon: Phone, internal: true },
    { name: isBn ? "আমাদের এজেন্সি" : "Our Agency", href: agencyHref, icon: Building2, external: true },
  ];


  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onCoursesPage = location.pathname === "/courses" || location.pathname.startsWith("/courses/");
    if (!onCoursesPage) {
      setActiveSection("");
      return;
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      const ids = ["home", "about", "instructors", "courses", "contact"];
      let current = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    // If not on courses/learn page, navigate there first
    const onCoursesPage = location.pathname === "/courses" || location.pathname.startsWith("/courses/");
    if (!onCoursesPage) {
      navigate(coursesHomeHref);
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
      return;
    }
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };



  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-2" : "py-3"}`}>
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
            className={`flex items-center justify-between rounded-2xl px-4 sm:px-5 py-2.5 transition-all duration-500 ${
              isScrolled
                ? "bg-background/60 dark:bg-card/50 backdrop-blur-xl shadow-[0_8px_32px_-12px_hsl(var(--primary)/0.25)] border border-primary/15"
                : "bg-background/30 dark:bg-card/20 backdrop-blur-md border border-primary/10"
            }`}
          >
            {/* Learn Logo */}
            <button
              onClick={() => handleNavClick("home")}
              className="flex items-center gap-2 group shrink-0"
            >
              <img
                src={learnLogo}
                alt="Learn with AlphaZero"
                className="h-8 sm:h-9 w-auto dark:brightness-0 dark:invert transition-all"
                loading="eager"
              />
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1 bg-primary/[0.06] rounded-full px-1.5 py-1 border border-primary/15">
              {navLinks.map((link) => {
                const active = link.internal ? location.pathname === link.to : (!link.external && activeSection === link.id);
                const commonClass = "relative px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-1.5";
                const inner = (
                  <>
                    {active && (
                      <motion.div
                        layoutId="courses-nav-pill"
                        className="absolute inset-0 bg-primary rounded-full"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                    <link.icon size={14} className={`relative z-10 ${active ? "text-primary-foreground" : "text-primary/70"}`} />
                    <span className={`relative z-10 ${active ? "text-primary-foreground font-semibold" : "text-foreground/80 hover:text-foreground"}`}>
                      {link.name}
                    </span>
                  </>
                );
                if (link.external) {
                  return (
                    <a key={link.name} href={link.href} className={commonClass}>{inner}</a>
                  );
                }
                if (link.internal) {
                  return (
                    <Link key={link.name} to={link.to!} className={commonClass}>{inner}</Link>
                  );
                }
                return (
                  <button key={link.name} onClick={() => handleNavClick(link.id!)} className={commonClass}>
                    {inner}
                  </button>
                );
              })}

            </div>


            {/* Right controls */}
            <div className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Search size={16} className="text-primary" />
              </button>
              <button
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="h-9 px-3 rounded-full bg-primary/15 border border-primary/25 flex items-center hover:bg-primary/25 transition-colors"
              >
                <span className="text-xs font-bold text-primary">{language === "en" ? "EN" : "বা"}</span>
              </button>


              <Link
                to="/student/login"
                className="ml-1 group px-5 py-2 bg-primary text-primary-foreground rounded-full font-semibold text-sm flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
              >
                <User size={14} />
                <span>{isBn ? "স্টুডেন্ট লগইন" : "Student Login"}</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <Link to="/student/login" className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <User size={15} className="text-primary" />
              </Link>


              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center"
              >
                {isMobileMenuOpen ? <X size={16} className="text-primary" /> : <Menu size={16} className="text-primary" />}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden container mx-auto px-4 sm:px-6 mt-2"
            >
              <div className="rounded-2xl bg-background/95 dark:bg-card/95 backdrop-blur-xl border border-primary/15 shadow-xl overflow-hidden">
                <div className="grid grid-cols-2 gap-1 p-2">
                  {navLinks.map((link) => {
                    const active = link.internal ? location.pathname === link.to : (!link.external && activeSection === link.id);
                    const cls = `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm ${
                      active ? "bg-primary text-primary-foreground font-semibold" : "text-foreground/80 hover:bg-primary/10"
                    }`;
                    const inner = (<><link.icon size={16} className={active ? "" : "text-primary/70"} />{link.name}</>);
                    if (link.external) {
                      return (
                        <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={cls}>{inner}</a>
                      );
                    }
                    if (link.internal) {
                      return (
                        <Link key={link.name} to={link.to!} onClick={() => setIsMobileMenuOpen(false)} className={cls}>{inner}</Link>
                      );
                    }
                    return (
                      <button key={link.name} onClick={() => handleNavClick(link.id!)} className={cls}>
                        {inner}
                      </button>
                    );
                  })}

                </div>

                <div className="flex items-center gap-2 p-2 border-t border-border/40">
                  <button
                    onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                    className="flex-1 h-9 rounded-xl bg-primary/15 border border-primary/25 text-xs font-bold text-primary"
                  >
                    {language === "en" ? "বাংলা" : "English"}
                  </button>
                  <Link
                    to="/student/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1"
                  >
                    <User size={13} />
                    {isBn ? "লগইন" : "Login"}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ Mobile Bottom Navigation Bar ═══ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="h-6 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
        <div className="bg-background/70 dark:bg-card/70 backdrop-blur-3xl border-t border-border/30 dark:border-border/20">
          <div className={`grid pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] px-1`} style={{ gridTemplateColumns: `repeat(${navLinks.length}, minmax(0, 1fr))` }}>
            {navLinks.map((link) => {
              const IconComp = link.icon;
              const isActive = link.internal ? location.pathname === link.to : false;
              const inner = (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="courses-bottom-nav-active"
                      className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary/20 dark:bg-primary/25 rounded-full blur-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      animate={isActive ? { y: -2, scale: 1.15 } : { y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <IconComp
                        size={19}
                        strokeWidth={isActive ? 2.5 : 1.5}
                        className={`transition-colors duration-200 ${isActive ? "text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]" : "text-muted-foreground/70"}`}
                      />
                    </motion.div>
                    <span className={`text-[9px] leading-tight mt-0.5 transition-all duration-200 ${
                      isActive ? "font-bold text-primary" : "font-medium text-muted-foreground/60"
                    }`}>
                      {link.name}
                    </span>
                  </div>
                </>
              );
              const cls = "relative flex flex-col items-center gap-0.5 py-1";
              if (link.external) {
                return <a key={link.name} href={link.href} className={cls}>{inner}</a>;
              }
              if (link.internal) {
                return <Link key={link.name} to={link.to!} className={cls}>{inner}</Link>;
              }
              return <button key={link.name} onClick={() => handleNavClick(link.id!)} className={cls}>{inner}</button>;
            })}
          </div>
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>

  );
};

export default CoursesNavbar;
