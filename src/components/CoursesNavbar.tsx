import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Search, User, ArrowUpRight, BookOpen, LayoutGrid, Award, HelpCircle, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import learnLogo from "@/assets/learn-with-alphazero-logo.png";
import SearchModal from "./SearchModal";

const CoursesNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const isBn = language === "bn";

  const isLearnSubdomain = typeof window !== "undefined" && window.location.hostname.startsWith("learn.");
  const mainSiteHref = isLearnSubdomain ? "https://alphazero.online" : "/";
  const allCoursesHref = isLearnSubdomain ? "/" : "/courses";

  const navLinks = [
    { name: isBn ? "সকল কোর্স" : "All Courses", href: allCoursesHref, icon: LayoutGrid },
    { name: isBn ? "সার্টিফিকেট" : "Certificate", href: "/certificate", icon: Award },
    { name: isBn ? "সাহায্য" : "Help", href: "/contact", icon: HelpCircle },
    { name: isBn ? "মূল সাইট" : "Main Site", href: mainSiteHref, icon: Home },
  ];


  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === allCoursesHref ? (location.pathname === "/" || location.pathname === "/courses") : location.pathname === href;


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
            <Link to={allCoursesHref} className="flex items-center gap-2 group shrink-0">
              <img
                src={learnLogo}
                alt="Learn with AlphaZero"
                className="h-8 sm:h-9 w-auto dark:brightness-0 dark:invert transition-all"
                loading="eager"
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1 bg-primary/[0.06] rounded-full px-1.5 py-1 border border-primary/15">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const isExternal = link.href.startsWith("http");
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
                return isExternal ? (
                  <a key={link.href} href={link.href} className={commonClass}>{inner}</a>
                ) : (
                  <Link key={link.href} to={link.href} className={commonClass}>{inner}</Link>
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
                    const active = isActive(link.href);
                    const isExternal = link.href.startsWith("http");
                    const cls = `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm ${
                      active ? "bg-primary text-primary-foreground font-semibold" : "text-foreground/80 hover:bg-primary/10"
                    }`;
                    const inner = (<><link.icon size={16} className={active ? "" : "text-primary/70"} />{link.name}</>);
                    return isExternal ? (
                      <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={cls}>{inner}</a>
                    ) : (
                      <Link key={link.href} to={link.href} onClick={() => setIsMobileMenuOpen(false)} className={cls}>{inner}</Link>
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

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default CoursesNavbar;
