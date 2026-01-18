import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Sun,
  Moon,
  ArrowUpRight
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
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
                transition={{ duration: 0.3 }}
              />
              <motion.div className="relative z-10 flex flex-col items-center justify-center gap-1.5">
                <motion.span 
                  className="w-6 h-0.5 bg-foreground rounded-full origin-center"
                  animate={{ 
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 4 : 0,
                    width: isMobileMenuOpen ? 24 : 24
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span 
                  className="w-6 h-0.5 bg-foreground rounded-full"
                  animate={{ 
                    opacity: isMobileMenuOpen ? 0 : 1,
                    scaleX: isMobileMenuOpen ? 0 : 1
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span 
                  className="w-6 h-0.5 bg-foreground rounded-full origin-center"
                  animate={{ 
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? -4 : 0,
                    width: isMobileMenuOpen ? 24 : 16
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full Screen Immersive Experience */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 lg:hidden overflow-hidden"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
            
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/2 -right-1/2 w-full h-full"
              >
                <div className="w-full h-full border border-primary/5 rounded-full" />
              </motion.div>
              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1.2, 1, 1.2]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-1/2 -left-1/2 w-full h-full"
              >
                <div className="w-full h-full border border-primary/5 rounded-full" />
              </motion.div>
            </div>

            {/* Floating Orbs */}
            <motion.div
              animate={{ 
                y: [0, -30, 0],
                x: [0, 20, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ 
                y: [0, 20, 0],
                x: [0, -15, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-40 left-5 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
            />

            {/* Content Container */}
            <div className="relative h-full flex flex-col px-8 pt-24 pb-10">
              
              {/* Header with Logo */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between mb-12"
              >
                <img 
                  src={logo} 
                  alt="AlphaZero Logo" 
                  className="h-10 w-auto brightness-0 dark:invert"
                />
                <div className="flex items-center gap-2">
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Menu</span>
                </div>
              </motion.div>

              {/* Navigation Links - Staggered Big Text */}
              <div className="flex-1 flex flex-col justify-center -mt-10">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -100, rotateX: -90 }}
                    animate={{ opacity: 1, x: 0, rotateX: 0 }}
                    transition={{ 
                      delay: 0.2 + index * 0.08,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="overflow-hidden"
                  >
                    <Link
                      to={link.href}
                      onClick={handleNavClick}
                      className="group flex items-center gap-4 py-3"
                    >
                      {/* Animated Line */}
                      <motion.div 
                        className={`h-[2px] rounded-full transition-all duration-500 ${
                          location.pathname === link.href 
                            ? "w-8 bg-primary" 
                            : "w-0 group-hover:w-6 bg-muted-foreground"
                        }`}
                      />
                      
                      {/* Number */}
                      <span className={`text-xs font-mono transition-colors duration-300 ${
                        location.pathname === link.href 
                          ? "text-primary" 
                          : "text-muted-foreground group-hover:text-primary"
                      }`}>
                        {link.num}
                      </span>
                      
                      {/* Link Text */}
                      <span className={`text-3xl sm:text-4xl font-display font-bold tracking-tight transition-all duration-300 ${
                        location.pathname === link.href 
                          ? "text-primary translate-x-2" 
                          : "text-foreground group-hover:text-primary group-hover:translate-x-2"
                      }`}>
                        {link.name}
                      </span>
                      
                      {/* Active Dot */}
                      {location.pathname === link.href && (
                        <motion.div
                          layoutId="activeDot"
                          className="w-2 h-2 bg-primary rounded-full ml-auto"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Section - Controls & CTA */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                {/* Divider with text */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-[0.3em]">Settings</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  {/* Language Toggle - Pill Style */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                    className="relative h-12 px-6 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm overflow-hidden group"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ 
                          backgroundColor: language === "en" ? "hsl(var(--primary))" : "transparent",
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-border/50"
                      >
                        <span className={`text-xs font-bold ${language === "en" ? "text-primary-foreground" : "text-muted-foreground"}`}>EN</span>
                      </motion.div>
                      <motion.div
                        animate={{ 
                          backgroundColor: language === "bn" ? "hsl(var(--primary))" : "transparent",
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-border/50"
                      >
                        <span className={`text-xs font-bold ${language === "bn" ? "text-primary-foreground" : "text-muted-foreground"}`}>বা</span>
                      </motion.div>
                    </div>
                  </motion.button>

                  {/* Theme Toggle - Creative */}
                  {mounted && (
                    <motion.button
                      whileTap={{ scale: 0.9, rotate: 180 }}
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="relative w-12 h-12 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm flex items-center justify-center overflow-hidden"
                    >
                      <motion.div
                        initial={false}
                        animate={{ 
                          rotate: theme === "dark" ? 0 : 180,
                          scale: theme === "dark" ? 1 : 0.8
                        }}
                        transition={{ duration: 0.5, type: "spring" }}
                      >
                        {theme === "dark" ? (
                          <Sun size={20} className="text-primary" />
                        ) : (
                          <Moon size={20} className="text-primary" />
                        )}
                      </motion.div>
                    </motion.button>
                  )}
                </div>

                {/* CTA Button - Full Width Gradient */}
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact"
                    onClick={handleNavClick}
                    className="relative w-full py-5 flex items-center justify-center gap-3 rounded-2xl overflow-hidden group"
                  >
                    {/* Animated Gradient Background */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary"
                      animate={{ 
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                      }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      style={{ backgroundSize: "200% 200%" }}
                    />
                    
                    <span className="relative z-10 text-primary-foreground font-bold text-lg tracking-wide">
                      {t("nav.startProject")}
                    </span>
                    <motion.div
                      animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="relative z-10"
                    >
                      <ArrowUpRight size={22} className="text-primary-foreground" />
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;