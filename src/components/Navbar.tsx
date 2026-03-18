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
  Phone,
  MoreHorizontal,
  ChevronDown,
  Tag
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import logoFull from "@/assets/logo-full.png";
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
                ? "bg-background/80 dark:bg-card/80 backdrop-blur-2xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.1)] border border-border/50 dark:border-border/20"
                : "bg-transparent backdrop-blur-none border border-transparent"
            }`}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center group relative shrink-0">
              <div className="absolute -inset-2 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src={logoFull} 
                alt="AlphaZero Logo" 
                className="h-7 sm:h-8 w-auto relative z-10 brightness-0 dark:invert transition-all duration-300"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </Link>

            {/* Desktop Navigation - Pill style */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center bg-secondary/80 dark:bg-secondary/50 rounded-full px-1.5 py-1 border border-border/50 dark:border-border/30">
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
                  className="w-9 h-9 rounded-full bg-secondary/80 dark:bg-secondary/50 border border-border/50 dark:border-border/30 flex items-center justify-center hover:bg-secondary dark:hover:bg-secondary/70 transition-all duration-200 group"
                  title={language === "bn" ? "সার্চ করুন" : "Search"}
                >
                  <Search size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </button>

                {/* Login */}
                <Link
                  to="/student/login"
                  className="w-9 h-9 rounded-full bg-secondary/80 dark:bg-secondary/50 border border-border/50 dark:border-border/30 flex items-center justify-center hover:bg-secondary dark:hover:bg-secondary/70 transition-all duration-200 group"
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
                    className="w-9 h-9 rounded-full bg-secondary/80 dark:bg-secondary/50 border border-border/50 dark:border-border/30 flex items-center justify-center overflow-hidden group hover:bg-secondary dark:hover:bg-secondary/70 transition-all duration-200"
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

            {/* Mobile: login + theme on top bar */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <Link
                to="/student/login"
                className="w-9 h-9 rounded-full bg-secondary/80 dark:bg-secondary/50 border border-border/50 dark:border-border/30 flex items-center justify-center"
              >
                <User size={15} className="text-muted-foreground" />
              </Link>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-9 h-9 rounded-full bg-secondary/80 dark:bg-secondary/50 border border-border/50 dark:border-border/30 flex items-center justify-center"
                >
                  {theme === "dark" ? <Sun size={15} className="text-primary" /> : <Moon size={15} className="text-primary" />}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </nav>

      {/* ═══ Mobile Bottom Navigation Bar ═══ */}
      {(() => {
        const hiddenRoutes = ['/admin', '/student', '/teacher'];
        const shouldHideBottomBar = hiddenRoutes.some(route => location.pathname.startsWith(route));
        if (shouldHideBottomBar) return null;

        const bottomNavItems = [
          { name: language === "bn" ? "হোম" : "Home", href: "/", icon: Home },
          { name: language === "bn" ? "সম্পর্কে" : "About", href: "/about", icon: Info },
          { name: language === "bn" ? "সেবা" : "Services", href: "/services", icon: Briefcase },
          { name: language === "bn" ? "কাজ" : "Work", href: "/work", icon: FolderOpen },
          { name: language === "bn" ? "টিম" : "Team", href: "/team", icon: Users },
          { name: language === "bn" ? "কোর্স" : "Courses", href: "/courses", icon: GraduationCap },
          { name: language === "bn" ? "যোগাযোগ" : "Contact", href: "/contact", icon: Mail },
        ];

        return (
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            {/* Gradient fade effect at top */}
            <div className="h-6 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
            
            <div className="bg-background/70 dark:bg-card/70 backdrop-blur-3xl border-t border-border/30 dark:border-border/20">
              <div className="grid grid-cols-7 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] px-1">
                {bottomNavItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="relative flex flex-col items-center gap-0.5 py-1"
                    >
                      {/* Active glow */}
                      {isActive && (
                        <motion.div
                          layoutId="bottom-nav-active"
                          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary/20 dark:bg-primary/25 rounded-full blur-md"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      
                      <div className="relative z-10 flex flex-col items-center">
                        {/* Active top bar indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="bottom-nav-bar"
                            className="absolute -top-2.5 w-6 h-[2.5px] rounded-full bg-primary"
                            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                          />
                        )}
                        
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
                        
                        <span className={`text-[8.5px] leading-tight mt-0.5 transition-all duration-200 ${
                          isActive ? "font-bold text-primary" : "font-medium text-muted-foreground/60"
                        }`}>
                          {item.name}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;