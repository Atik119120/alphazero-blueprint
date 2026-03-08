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
                ? "bg-background/95 dark:bg-[hsl(220,20%,8%)]/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)] border border-border/30 dark:border-white/[0.06]"
                : "bg-background/80 dark:bg-[hsl(220,20%,8%)]/90 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.04)] border border-border/20 dark:border-white/[0.04]"
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

      {/* Mobile Menu - Right Side Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 380, mass: 0.7 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[300px] z-50 lg:hidden shadow-2xl"
            >
              <div className="h-full flex flex-col bg-card">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 h-16 border-b border-border/50">
                  <Link to="/" onClick={handleNavClick}>
                    <img src={logo} alt="AlphaZero" className="h-6 w-auto brightness-0 dark:invert" />
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Search */}
                <div className="px-4 pt-4 pb-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(() => setIsSearchOpen(true), 150);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-border bg-background text-muted-foreground text-sm hover:border-primary/40 transition-colors"
                  >
                    <Search size={15} className="text-muted-foreground" />
                    <span>{language === "bn" ? "সার্চ করুন..." : "Search..."}</span>
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-3 pt-2 pb-4 overflow-y-auto">
                  {navLinksWithIcons.map((link, index) => {
                    const IconComponent = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 + index * 0.035, duration: 0.2 }}
                      >
                        <Link
                          to={link.href}
                          onClick={handleNavClick}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-colors duration-150 ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground/80 hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <IconComponent size={17} className={isActive ? "text-primary-foreground" : "text-muted-foreground"} />
                          {link.name}
                        </Link>
                      </motion.div>
                    );
                  })}

                  <div className="h-px bg-border/60 my-3 mx-3" />

                  {/* Secondary links */}
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32, duration: 0.2 }}
                  >
                    <Link
                      to="/student/login"
                      onClick={handleNavClick}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <User size={17} className="text-muted-foreground" />
                      {language === "bn" ? "লগইন" : "Sign In"}
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.36, duration: 0.2 }}
                  >
                    <a
                      href="https://wa.me/8801779277603"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleNavClick}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Phone size={17} className="text-muted-foreground" />
                      {language === "bn" ? "হোয়াটসঅ্যাপ" : "WhatsApp"}
                    </a>
                  </motion.div>
                </nav>

                {/* Footer */}
                <div className="px-4 pb-5 pt-3 border-t border-border/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                      className="flex-1 h-9 rounded-lg border border-border bg-background flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-muted transition-colors"
                    >
                      <span className={language === "en" ? "text-primary" : "text-muted-foreground"}>EN</span>
                      <span className="text-border">/</span>
                      <span className={language === "bn" ? "text-primary" : "text-muted-foreground"}>বাং</span>
                    </button>
                    {mounted && (
                      <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-9 h-9 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        {theme === "dark" ? <Sun size={14} className="text-foreground" /> : <Moon size={14} className="text-foreground" />}
                      </button>
                    )}
                  </div>
                  <Link
                    to="/contact"
                    onClick={handleNavClick}
                    className="w-full h-10 bg-primary text-primary-foreground rounded-lg font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
                  >
                    {t("nav.startProject")}
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;