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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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
      </nav>

      {/* Mobile Menu - Right Side Drawer with Glass Effect */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md lg:hidden"
            />

            {/* Right Side Drawer - Glassmorphism */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] z-50 lg:hidden"
            >
              <div className="h-full relative overflow-hidden flex flex-col">
                {/* Glass Background - Clean, no glow */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl" />
                
                {/* Simple Border */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-border/50" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Header with Logo and Close Button */}
                  <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <Link to="/" onClick={handleNavClick} className="flex items-center gap-2">
                      <img 
                        src={logo} 
                        alt="AlphaZero Logo" 
                        className="h-8 w-auto brightness-0 dark:invert"
                      />
                    </Link>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      <X size={18} />
                    </motion.button>
                  </div>

                  {/* Search Bar */}
                  <div className="px-5 py-4">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setTimeout(() => setIsSearchOpen(true), 150);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-muted-foreground hover:bg-white/20 transition-colors"
                    >
                      <Search size={18} className="text-primary" />
                      <span className="text-sm">{language === "bn" ? "সার্চ করুন..." : "Search..."}</span>
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-1 px-5 py-2 overflow-y-auto">
                    <div className="space-y-1">
                      {navLinksWithIcons.map((link, index) => {
                        const IconComponent = link.icon;
                        return (
                          <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                          >
                            <Link
                              to={link.href}
                              onClick={handleNavClick}
                              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                                location.pathname === link.href 
                                  ? "bg-primary/20 text-primary border border-primary/30" 
                                  : "text-foreground hover:bg-white/10 border border-transparent"
                              }`}
                            >
                              <IconComponent 
                                size={20} 
                                className={location.pathname === link.href ? "text-primary" : "text-primary/70"} 
                              />
                              <span className="text-[15px] font-medium">
                                {link.name}
                              </span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />

                    {/* Login Link */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35, duration: 0.2 }}
                    >
                      <Link
                        to="/student/login"
                        onClick={handleNavClick}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-foreground hover:bg-white/10 transition-all duration-200 border border-transparent"
                      >
                        <User size={20} className="text-primary/70" />
                        <span className="text-[15px] font-medium">
                          {language === "bn" ? "লগইন" : "Sign In"}
                        </span>
                      </Link>
                    </motion.div>

                    {/* WhatsApp Support */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.2 }}
                    >
                      <a
                        href="https://wa.me/8801779277603"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleNavClick}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-foreground hover:bg-white/10 transition-all duration-200 border border-transparent"
                      >
                        <Phone size={20} className="text-primary/70" />
                        <span className="text-[15px] font-medium">
                          {language === "bn" ? "হোয়াটসঅ্যাপ সাপোর্ট" : "WhatsApp Support"}
                        </span>
                      </a>
                    </motion.div>
                  </nav>

                  {/* Bottom Controls */}
                  <div className="p-5 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      {/* Language Toggle */}
                      <button
                        onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                        className="flex-1 h-11 px-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/20 transition-colors"
                      >
                        <span className={`transition-colors ${language === "en" ? "text-primary" : "text-muted-foreground"}`}>EN</span>
                        <span className="text-white/30">/</span>
                        <span className={`transition-colors ${language === "bn" ? "text-primary" : "text-muted-foreground"}`}>বাং</span>
                      </button>
                      
                      {/* Theme Toggle */}
                      {mounted && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                          className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          {theme === "dark" ? <Sun size={18} className="text-primary" /> : <Moon size={18} className="text-primary" />}
                        </motion.button>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      to="/contact"
                      onClick={handleNavClick}
                      className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                      {t("nav.startProject")}
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
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