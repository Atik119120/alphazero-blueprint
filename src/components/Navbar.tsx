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
  MoreHorizontal
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

            {/* Mobile: only search + theme on top bar */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-9 h-9 rounded-full bg-foreground/[0.06] dark:bg-white/[0.08] border border-foreground/[0.06] dark:border-white/[0.06] flex items-center justify-center"
              >
                <Search size={15} className="text-muted-foreground" />
              </button>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-9 h-9 rounded-full bg-foreground/[0.06] dark:bg-white/[0.08] border border-foreground/[0.06] dark:border-white/[0.06] flex items-center justify-center"
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
        // Hide bottom bar on dashboard routes
        const hiddenRoutes = ['/admin', '/student', '/teacher'];
        const shouldHideBottomBar = hiddenRoutes.some(route => location.pathname.startsWith(route));
        if (shouldHideBottomBar) return null;

        const bottomNavItems = [
          { name: language === "bn" ? "হোম" : "Home", href: "/", icon: Home },
          { name: language === "bn" ? "সেবা" : "Services", href: "/services", icon: Briefcase },
          { name: language === "bn" ? "কাজ" : "Work", href: "/work", icon: FolderOpen },
          { name: language === "bn" ? "কোর্স" : "Courses", href: "/courses", icon: GraduationCap },
          { name: language === "bn" ? "আরও" : "More", href: "#more", icon: MoreHorizontal },
        ];

        return (
          <>
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
              <div className="bg-card/95 backdrop-blur-lg border-t border-border">
                <div className="flex items-center justify-around px-1 py-1.5 safe-bottom">
                  {bottomNavItems.map((item) => {
                    const IconComp = item.icon;
                    const isMore = item.href === "#more";
                    const isActive = !isMore && location.pathname === item.href;

                    if (isMore) {
                      return (
                        <button
                          key="more"
                          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-[56px] ${
                            isMobileMenuOpen ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          <IconComp size={20} strokeWidth={1.8} />
                          <span className="text-[10px] font-medium">{item.name}</span>
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-[56px] ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        <IconComp size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                        <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* "More" Sheet */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                  />
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}
                    className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
                  >
                    <div className="bg-card rounded-t-2xl border-t border-border shadow-lg">
                      {/* Drag handle */}
                      <div className="flex justify-center pt-3 pb-2">
                        <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
                      </div>

                      {/* More links grid */}
                      <div className="grid grid-cols-4 gap-1 px-4 pb-3">
                        {[
                          { name: language === "bn" ? "সম্পর্কে" : "About", href: "/about", icon: Info },
                          { name: language === "bn" ? "টিম" : "Team", href: "/team", icon: Users },
                          { name: language === "bn" ? "যোগদান" : "Join Team", href: "/join-team", icon: ArrowUpRight },
                          { name: language === "bn" ? "যোগাযোগ" : "Contact", href: "/contact", icon: Mail },
                          { name: language === "bn" ? "লগইন" : "Sign In", href: "/student/login", icon: User },
                        ].map((item) => {
                          const IconComp = item.icon;
                          const isActive = location.pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-colors ${
                                isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                              }`}
                            >
                              <IconComp size={20} strokeWidth={1.8} className={isActive ? "text-primary" : "text-muted-foreground"} />
                              <span className="text-[11px] font-medium">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Bottom row */}
                      <div className="flex items-center gap-2 px-4 pb-4 pt-1 border-t border-border/50">
                        <button
                          onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                          className="h-9 px-4 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1.5"
                        >
                          <span className={language === "en" ? "text-primary" : "text-muted-foreground"}>EN</span>
                          <span className="text-muted-foreground/30">|</span>
                          <span className={language === "bn" ? "text-primary" : "text-muted-foreground"}>বাং</span>
                        </button>
                        <a
                          href="https://wa.me/8801779277603"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-9 px-3 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors flex items-center gap-1.5 text-foreground"
                        >
                          <Phone size={13} className="text-muted-foreground" />
                          WhatsApp
                        </a>
                        <Link
                          to="/contact"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="ml-auto h-9 px-4 bg-primary text-primary-foreground rounded-lg font-semibold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
                        >
                          {t("nav.startProject")}
                          <ArrowUpRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        );
      })()}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;