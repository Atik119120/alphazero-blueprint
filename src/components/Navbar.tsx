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

            {/* Mobile Menu Button - Creative */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-12 h-12 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-secondary rounded-xl opacity-0 hover:opacity-100 transition-opacity" />
              {isMobileMenuOpen ? (
                <X size={24} className="relative z-10" />
              ) : (
                <div className="relative z-10 flex flex-col gap-1.5">
                  <span className="w-6 h-0.5 bg-foreground rounded-full" />
                  <span className="w-4 h-0.5 bg-foreground rounded-full ml-auto" />
                  <span className="w-6 h-0.5 bg-foreground rounded-full" />
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Ultra Creative Side Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-md lg:hidden"
            />
            
            {/* Side Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-sm bg-background/95 backdrop-blur-xl lg:hidden overflow-hidden border-l border-border/50 shadow-2xl"
            >
              {/* Decorative gradient orb */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-secondary/80 border border-border flex items-center justify-center z-10"
              >
                <X size={20} />
              </motion.button>

              <div className="relative h-full flex flex-col pt-20 pb-8 px-6">
                {/* Logo in menu */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <img 
                    src={logo} 
                    alt="AlphaZero Logo" 
                    className="h-8 w-auto brightness-0 dark:invert"
                  />
                </motion.div>

                {/* Navigation Links - Card Style */}
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        onClick={handleNavClick}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                          location.pathname === link.href 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "bg-secondary/50 hover:bg-secondary text-foreground"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                          location.pathname === link.href 
                            ? "bg-primary-foreground/20 text-primary-foreground" 
                            : "bg-primary/10 text-primary"
                        }`}>
                          {link.num}
                        </div>
                        <span className="text-lg font-medium flex-1">
                          {link.name}
                        </span>
                        <ArrowUpRight 
                          size={18} 
                          className={`transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${
                            location.pathname === link.href 
                              ? "text-primary-foreground/70" 
                              : "text-muted-foreground"
                          }`}
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                {/* Bottom Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4 pt-6 border-t border-border/50"
                >
                  {/* Controls Row */}
                  <div className="flex items-center gap-3">
                    {/* Language Toggle */}
                    <button
                      onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                      className="flex-1 px-4 py-3 rounded-xl bg-secondary/80 border border-border/50 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {language === "en" ? "বা" : "EN"}
                      </span>
                      {language === "en" ? "বাংলা" : "English"}
                    </button>
                    
                    {/* Theme Toggle */}
                    {mounted && (
                      <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-12 h-12 rounded-xl bg-secondary/80 border border-border/50 flex items-center justify-center"
                      >
                        <motion.div
                          animate={{ rotate: theme === "dark" ? 0 : 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          {theme === "dark" ? <Sun size={20} className="text-primary" /> : <Moon size={20} className="text-primary" />}
                        </motion.div>
                      </button>
                    )}
                  </div>
                  
                  {/* CTA Button */}
                  <Link
                    to="/contact"
                    onClick={handleNavClick}
                    className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {t("nav.startProject")}
                    <ArrowUpRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;