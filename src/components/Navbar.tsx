import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Sun,
  Moon,
  ArrowUpRight,
  Search,
  User,
  Home,
  Info,
  Briefcase,
  FolderOpen,
  Users,
  GraduationCap,
  Mail,
  Phone
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";
import SearchModal from "./SearchModal";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t("nav.home"), href: "/", num: "01" },
    { name: t("nav.about"), href: "/about", num: "02" },
    { name: t("nav.services"), href: "/services", num: "03" },
    { name: t("nav.work"), href: "/work", num: "04" },
    { name: t("nav.team"), href: "/team", num: "05" },
    { name: t("nav.courses"), href: "/courses", num: "06" },
    { name: t("nav.contact"), href: "/contact", num: "07" },
  ];

  const navLinksWithIcons = [
    { name: t("nav.home"), href: "/", icon: Home },
    { name: t("nav.about"), href: "/about", icon: Info },
    { name: t("nav.services"), href: "/services", icon: Briefcase },
    { name: t("nav.work"), href: "/work", icon: FolderOpen },
    { name: t("nav.team"), href: "/team", icon: Users },
    { name: t("nav.courses"), href: "/courses", icon: GraduationCap },
    { name: t("nav.contact"), href: "/contact", icon: Mail },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "py-2" : "py-3"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          {/* Floating navbar container */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
            className={`flex items-center justify-between rounded-2xl px-4 sm:px-5 py-2.5 transition-all duration-500 ${
              isScrolled
                ? "bg-card/95 backdrop-blur-xl shadow-sm border border-border/40"
                : "bg-card/80 backdrop-blur-xl border border-border/20"
            }`}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group relative shrink-0">
              <div className="absolute -inset-2 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src={logo} 
                alt="AlphaZero Logo" 
                className="h-8 w-auto brightness-0 dark:invert relative z-10"
              />
              <div className="hidden sm:flex flex-col relative z-10">
                <span className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase leading-tight">Creative</span>
                <span className="text-[10px] text-muted-foreground tracking-[0.15em] leading-tight">Agency</span>
              </div>
            </Link>

            {/* Desktop Navigation - Pill style */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center bg-foreground/[0.04] dark:bg-white/[0.06] rounded-full px-1.5 py-1 border border-foreground/[0.06] dark:border-white/[0.06]">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active-pill"
                          className="absolute inset-0 bg-primary rounded-full"
                          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                        />
                      )}
                      <span className={`relative z-10 transition-colors duration-200 ${
                        isActive 
                          ? "text-primary-foreground font-semibold" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}>
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-1.5 ml-3">
                {/* Search */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-9 h-9 rounded-full bg-foreground/[0.06] dark:bg-white/[0.08] border border-foreground/[0.06] dark:border-white/[0.06] flex items-center justify-center hover:bg-foreground/[0.12] dark:hover:bg-white/[0.15] transition-all duration-200 group"
                  title={language === "bn" ? "সার্চ করুন" : "Search"}
                >
                  <Search size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </button>

                {/* Login */}
                <Link
                  to="/student/login"
                  className="w-9 h-9 rounded-full bg-foreground/[0.06] dark:bg-white/[0.08] border border-foreground/[0.06] dark:border-white/[0.06] flex items-center justify-center hover:bg-foreground/[0.12] dark:hover:bg-white/[0.15] transition-all duration-200 group"
                  title={language === "bn" ? "লগইন" : "Login"}
                >
                  <User size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>

                {/* Language Toggle */}
                <button
                  onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                  className="relative h-9 px-3 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden group hover:bg-primary/30 transition-all duration-200"
                  title={language === "en" ? "বাংলা" : "English"}
                >
                  <span className="text-xs font-bold text-primary">
                    {language === "en" ? "EN" : "বা"}
                  </span>
                </button>
                
                {/* Theme Toggle */}
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-9 h-9 rounded-full bg-foreground/[0.06] dark:bg-white/[0.08] border border-foreground/[0.06] dark:border-white/[0.06] flex items-center justify-center overflow-hidden group hover:bg-foreground/[0.12] dark:hover:bg-white/[0.15] transition-all duration-200"
                  >
                    <motion.div
                      animate={{ rotate: theme === "dark" ? 0 : 180 }}
                      transition={{ duration: 0.4 }}
                    >
                      {theme === "dark" ? (
                        <Sun size={16} className="text-primary" />
                      ) : (
                        <Moon size={16} className="text-primary" />
                      )}
                    </motion.div>
                  </button>
                )}
                
                {/* CTA Button */}
                <Link
                  to="/contact"
                  className="ml-1 group relative overflow-hidden px-5 py-2 bg-primary text-primary-foreground rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-1.5"
                >
                  <span className="relative z-10">{t("nav.startProject")}</span>
                  <ArrowUpRight size={14} className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-11 h-11 flex items-center justify-center group"
            >
              <div className="absolute inset-0 bg-foreground/[0.06] dark:bg-white/[0.08] rounded-xl border border-foreground/[0.06] dark:border-white/[0.06] group-hover:bg-foreground/[0.1] dark:group-hover:bg-white/[0.12] transition-all" />
              <motion.div className="relative z-10 flex flex-col items-center justify-center gap-1.5">
                <motion.span 
                  className="w-5 h-[2px] bg-foreground/80 rounded-full origin-center"
                  animate={{ 
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 4 : 0,
                  }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span 
                  className="w-5 h-[2px] bg-foreground/80 rounded-full"
                  animate={{ 
                    opacity: isMobileMenuOpen ? 0 : 1,
                    scaleX: isMobileMenuOpen ? 0 : 1
                  }}
                  transition={{ duration: 0.1 }}
                />
                <motion.span 
                  className="w-5 h-[2px] bg-foreground/80 rounded-full origin-center"
                  animate={{ 
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? -4 : 0,
                    width: isMobileMenuOpen ? 20 : 14
                  }}
                  transition={{ duration: 0.15 }}
                />
              </motion.div>
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu - Fullscreen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 lg:hidden bg-background"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 h-16">
              <Link to="/" onClick={handleNavClick}>
                <img src={logo} alt="AlphaZero" className="h-6 w-auto brightness-0 dark:invert" />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col h-[calc(100%-4rem)] px-6 pt-4 pb-6 overflow-y-auto">
              {/* Search */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setTimeout(() => setIsSearchOpen(true), 150);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border bg-muted/50 text-muted-foreground text-sm mb-6 hover:bg-muted transition-colors"
              >
                <Search size={15} />
                <span>{language === "bn" ? "সার্চ করুন..." : "Search..."}</span>
              </button>

              {/* Nav Links - Large, centered-feel */}
              <nav className="flex-1 space-y-1">
                {navLinksWithIcons.map((link, index) => {
                  const IconComponent = link.icon;
                  const isActive = location.pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + index * 0.04, duration: 0.3, ease: "easeOut" }}
                    >
                      <Link
                        to={link.href}
                        onClick={handleNavClick}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-colors duration-150 ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <IconComponent size={18} className={isActive ? "text-primary-foreground" : "text-muted-foreground"} strokeWidth={1.8} />
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Secondary */}
              <div className="mt-4 pt-4 border-t border-border/60 space-y-1">
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.25 }}>
                  <Link
                    to="/student/login"
                    onClick={handleNavClick}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-[15px] font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <User size={18} className="text-muted-foreground" strokeWidth={1.8} />
                    {language === "bn" ? "লগইন" : "Sign In"}
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.25 }}>
                  <a
                    href="https://wa.me/8801779277603"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleNavClick}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-[15px] font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Phone size={18} className="text-muted-foreground" strokeWidth={1.8} />
                    {language === "bn" ? "হোয়াটসঅ্যাপ" : "WhatsApp"}
                  </a>
                </motion.div>
              </div>

              {/* Bottom */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="mt-6 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                    className="flex-1 h-10 rounded-xl border border-border bg-muted/50 flex items-center justify-center gap-2 text-xs font-semibold hover:bg-muted transition-colors"
                  >
                    <span className={language === "en" ? "text-primary" : "text-muted-foreground"}>EN</span>
                    <span className="text-muted-foreground/30">|</span>
                    <span className={language === "bn" ? "text-primary" : "text-muted-foreground"}>বাং</span>
                  </button>
                  {mounted && (
                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="w-10 h-10 rounded-xl border border-border bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      {theme === "dark" ? <Sun size={15} className="text-foreground" /> : <Moon size={15} className="text-foreground" />}
                    </button>
                  )}
                </div>
                <Link
                  to="/contact"
                  onClick={handleNavClick}
                  className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  {t("nav.startProject")}
                  <ArrowUpRight size={14} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;