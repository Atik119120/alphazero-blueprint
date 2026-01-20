import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Sun,
  Moon,
  ArrowUpRight,
  Search,
  User
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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-background/95 backdrop-blur-xl border-b border-border/50" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with creative treatment */}
            <Link to="/" className="flex items-center gap-3 group relative">
              <div className="absolute -inset-2 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src={logo} 
                alt="AlphaZero Logo" 
                className="h-9 w-auto brightness-0 dark:invert relative z-10"
              />
              <div className="hidden sm:flex flex-col relative z-10">
                <span className="text-[10px] text-primary font-medium tracking-[0.2em] uppercase">Creative</span>
                <span className="text-[10px] text-muted-foreground tracking-[0.15em]">Agency</span>
              </div>
            </Link>

            {/* Desktop Navigation - Unconventional style */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center bg-secondary/50 backdrop-blur-sm rounded-full px-2 py-1.5 border border-border/50">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                      location.pathname === link.href 
                        ? "text-primary-foreground bg-primary" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-2 ml-4">
                {/* Search Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="relative w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80 transition-colors group"
                  title={language === "bn" ? "সার্চ করুন" : "Search"}
                >
                  <Search size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </button>

                {/* Login Button */}
                <Link
                  to="/student/login"
                  className="relative w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80 transition-colors group"
                  title={language === "bn" ? "লগইন" : "Login"}
                >
                  <User size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>

                {/* Language Toggle - Creative */}
                <button
                  onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                  className="relative w-14 h-8 rounded-full bg-secondary border border-border overflow-hidden group"
                  title={language === "en" ? "বাংলা" : "English"}
                >
                  <motion.div
                    animate={{ x: language === "en" ? 0 : 24 }}
                    className="absolute top-1 left-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <span className="text-[10px] font-bold text-primary-foreground">
                      {language === "en" ? "EN" : "বা"}
                    </span>
                  </motion.div>
                </button>
                
                {/* Theme Toggle - Creative */}
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="relative w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden group"
                  >
                    <motion.div
                      animate={{ rotate: theme === "dark" ? 0 : 180 }}
                      transition={{ duration: 0.5 }}
                    >
                      {theme === "dark" ? (
                        <Sun size={18} className="text-primary" />
                      ) : (
                        <Moon size={18} className="text-primary" />
                      )}
                    </motion.div>
                  </button>
                )}
                
                {/* CTA Button - Unconventional */}
                <Link
                  to="/contact"
                  className="ml-2 group relative overflow-hidden px-6 py-2.5 bg-foreground text-background rounded-full font-medium text-sm transition-all duration-300 hover:shadow-xl flex items-center gap-2"
                >
                  <span className="relative z-10">{t("nav.startProject")}</span>
                  <ArrowUpRight size={16} className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button - Morphing Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-14 h-14 flex items-center justify-center group"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl"
                animate={{ 
                  scale: isMobileMenuOpen ? 1.1 : 1,
                  rotate: isMobileMenuOpen ? 90 : 0 
                }}
                transition={{ duration: 0.15 }}
              />
              <motion.div className="relative z-10 flex flex-col items-center justify-center gap-1.5">
                <motion.span 
                  className="w-6 h-0.5 bg-foreground rounded-full origin-center"
                  animate={{ 
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 4 : 0,
                    width: isMobileMenuOpen ? 24 : 24
                  }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span 
                  className="w-6 h-0.5 bg-foreground rounded-full"
                  animate={{ 
                    opacity: isMobileMenuOpen ? 0 : 1,
                    scaleX: isMobileMenuOpen ? 0 : 1
                  }}
                  transition={{ duration: 0.1 }}
                />
                <motion.span 
                  className="w-6 h-0.5 bg-foreground rounded-full origin-center"
                  animate={{ 
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? -4 : 0,
                    width: isMobileMenuOpen ? 24 : 16
                  }}
                  transition={{ duration: 0.15 }}
                />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Glassmorphism Floating Card */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm lg:hidden"
            />

            {/* Floating Menu Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", damping: 30, stiffness: 500, duration: 0.15 }}
              className="fixed top-20 left-4 right-4 z-50 lg:hidden"
            >
              <div className="relative bg-background/80 backdrop-blur-2xl rounded-3xl border border-border/50 shadow-2xl shadow-primary/5 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                
                {/* Content */}
                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">Navigation</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center"
                    >
                      <X size={14} />
                    </motion.button>
                  </div>

                  {/* Navigation Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                      >
                        <Link
                          to={link.href}
                          onClick={handleNavClick}
                          className={`relative flex flex-col p-4 rounded-2xl transition-all duration-300 group overflow-hidden ${
                            location.pathname === link.href 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-secondary/50 hover:bg-secondary text-foreground"
                          }`}
                        >
                          {/* Hover Glow */}
                          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                            location.pathname === link.href ? "" : "bg-gradient-to-br from-primary/5 to-transparent"
                          }`} />
                          
                          {/* Number */}
                          <span className={`text-[10px] font-mono mb-1 relative z-10 ${
                            location.pathname === link.href 
                              ? "text-primary-foreground/60" 
                              : "text-primary/60"
                          }`}>
                            {link.num}
                          </span>
                          
                          {/* Name */}
                          <span className="text-sm font-semibold relative z-10 leading-tight">
                            {link.name}
                          </span>

                          {/* Active Indicator */}
                          {location.pathname === link.href && (
                            <motion.div
                              layoutId="activeCard"
                              className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary-foreground"
                            />
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />

                  {/* Controls Row */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.15 }}
                    className="flex items-center gap-2"
                  >
                    {/* Search Button - Mobile */}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSearchOpen(true);
                      }}
                      className="w-11 h-11 rounded-xl bg-secondary/60 border border-border/30 flex items-center justify-center"
                    >
                      <Search size={16} className="text-primary" />
                    </button>

                    {/* Login Button - Mobile */}
                    <Link
                      to="/student/login"
                      onClick={handleNavClick}
                      className="w-11 h-11 rounded-xl bg-secondary/60 border border-border/30 flex items-center justify-center"
                      title={language === "bn" ? "লগইন" : "Login"}
                    >
                      <User size={16} className="text-primary" />
                    </Link>

                    {/* Language */}
                    <button
                      onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                      className="flex-1 h-11 px-4 rounded-xl bg-secondary/60 border border-border/30 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <span className={`transition-colors ${language === "en" ? "text-primary" : "text-muted-foreground"}`}>EN</span>
                      <span className="text-border">/</span>
                      <span className={`transition-colors ${language === "bn" ? "text-primary" : "text-muted-foreground"}`}>বা</span>
                    </button>
                    
                    {/* Theme */}
                    {mounted && (
                      <motion.button
                        whileTap={{ rotate: 180 }}
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-11 h-11 rounded-xl bg-secondary/60 border border-border/30 flex items-center justify-center"
                      >
                        {theme === "dark" ? <Sun size={16} className="text-primary" /> : <Moon size={16} className="text-primary" />}
                      </motion.button>
                    )}
                    
                    {/* CTA */}
                    <Link
                      to="/contact"
                      onClick={handleNavClick}
                      className="flex-1 h-11 px-4 bg-foreground text-background rounded-xl font-medium text-sm flex items-center justify-center gap-1.5"
                    >
                      {t("nav.startProject")}
                      <ArrowUpRight size={14} />
                    </Link>
                  </motion.div>
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