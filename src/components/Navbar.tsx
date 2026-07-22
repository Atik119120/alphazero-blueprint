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
import logoFullAsset from "@/assets/alphazero-logo.png.asset.json";
import learnLogoAssetJson from "@/assets/learn-with-alphazero-logo.png.asset.json";
const learnLogo = learnLogoAssetJson.url;
const logoFull = logoFullAsset.url;
const isLearnSubdomain = typeof window !== "undefined" && window.location.hostname.startsWith("learn.");
import SearchModal from "./SearchModal";

const LEARN_ROUTES = ["/courses", "/instructors", "/learn-about"];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isLearnContext = isLearnSubdomain || LEARN_ROUTES.some((r) => location.pathname.startsWith(r));
  const brandLogo = isLearnContext ? learnLogo : logoFull;
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  

  const COURSES_URL = "https://learn.alphazero.online";

  const navLinks = [
    { name: t("nav.home"), href: "/", num: "01" },
    { name: t("nav.about"), href: "/about", num: "02" },
    { name: t("nav.services"), href: "/services", num: "03" },
    { name: t("nav.work"), href: "/work", num: "04" },
    { name: t("nav.contact"), href: "/contact", num: "05" },

  ];

  const navLinksWithIcons = [
    { name: t("nav.home"), href: "/", icon: Home },
    { name: t("nav.about"), href: "/about", icon: Info },
    { name: t("nav.services"), href: "/services", icon: Briefcase },
    { name: t("nav.work"), href: "/work", icon: FolderOpen },
    
    
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
            className={`relative flex items-center justify-between rounded-2xl px-4 sm:px-5 py-2.5 transition-all duration-500 backdrop-blur-2xl backdrop-saturate-150 border border-white/15 dark:border-white/10 shadow-[0_1px_0_0_rgba(255,255,255,0.35)_inset,0_-1px_0_0_rgba(0,0,0,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.25)] ${
              isScrolled
               ? "bg-white/[0.08] dark:bg-white/[0.06]"
               : "bg-white/[0.06] dark:bg-white/[0.04]"
            }`}
            style={{ WebkitBackdropFilter: "blur(28px) saturate(160%)", backdropFilter: "blur(28px) saturate(160%)" }}
          >
            {/* Soft top glass highlight */}
            <div aria-hidden className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
            {/* Faint bottom shadow line */}
            <div aria-hidden className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/5 to-transparent" />

            {/* Logo — adaptive: white over dark hero, metallic silver/dark over light content */}
            <Link to="/" className="flex items-center group relative shrink-0">
              <div className="absolute -inset-2 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative h-7 sm:h-8 w-[140px] sm:w-[160px] z-10">
                {/* White logo — visible over dark hero (top of page) */}
                <img
                  src={brandLogo}
                  alt="AlphaZero Logo"
                  className="absolute inset-0 h-full w-auto object-contain object-left transition-opacity duration-300 ease-out"
                  style={{
                    opacity: isScrolled ? 0 : 1,
                    filter: "brightness(0) invert(1) drop-shadow(0 1px 2px rgba(0,0,0,0.35)) drop-shadow(0 0 8px rgba(255,255,255,0.15))",
                  }}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
                {/* Metallic silver/dark logo — visible over light content when scrolled */}
                <img
                  src={brandLogo}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-auto object-contain object-left transition-opacity duration-300 ease-out"
                  style={{
                    opacity: isScrolled ? 1 : 0,
                    filter: "brightness(0) saturate(0) invert(0.18) drop-shadow(0 1px 1px rgba(255,255,255,0.4))",
                  }}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </Link>



            {/* Desktop Navigation - Pill style (centered) */}
            <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1 px-1.5 py-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href;


                  const linkClasses = "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full";
                  const linkInner = (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active-pill"
                          className="absolute inset-0 rounded-full bg-cyan-500/10 border border-cyan-500/25 shadow-[0_0_14px_-2px_rgba(6,182,212,0.35)]"
                          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                        />
                      )}
                      <span className={`relative z-10 transition-colors duration-200 ${
                        isActive
                          ? "text-cyan-400 font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}>
                        {link.name}
                      </span>
                    </>
                  );
                  return link.href.startsWith("http") ? (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClasses}>{linkInner}</a>
                  ) : (
                    <Link key={link.href} to={link.href} className={linkClasses}>
                      {linkInner}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right-aligned Controls (desktop) */}
            <div className="hidden lg:flex items-center gap-1.5">






              {/* CTA Button — Liquid Glass */}
              <Link
                to="/contact"
                className="ml-1 group relative flex items-center gap-2 px-6 py-2.5 rounded-full overflow-hidden transition-all duration-300 active:scale-95"
              >
                {/* Satin gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600" />
                {/* Internal lighting overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/15 opacity-60" />
                {/* Inner highlight edge */}
                <div className="absolute inset-[1px] rounded-full border-t border-white/40 pointer-events-none" />
                {/* Outer bloom on hover */}
                <div className="absolute inset-0 rounded-full shadow-[0_6px_24px_rgba(6,182,212,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <span className="relative z-10 text-sm font-semibold text-white tracking-wide">{t("nav.startProject")}</span>
                <ArrowUpRight size={14} className="relative z-10 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

            </div>

            {/* Mobile: login + theme + menu on top bar */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <Link
                to="/student/login"
                className="w-9 h-9 rounded-full bg-secondary/80 dark:bg-secondary/50 border border-border/50 dark:border-border/30 flex items-center justify-center"
              >
                <User size={15} className="text-muted-foreground" />
              </Link>



              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary/30 transition-colors"
              >
                {isMobileMenuOpen ? <X size={16} className="text-primary" /> : <Menu size={16} className="text-primary" />}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Mobile menu drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden container mx-auto px-4 sm:px-6 mt-2"
            >
              <div className="rounded-2xl bg-background/90 dark:bg-card/90 backdrop-blur-xl border border-border/50 shadow-xl overflow-hidden">
                <div className="grid grid-cols-2 gap-1 p-2">
                  {navLinksWithIcons.map((link) => {
                    const IconComp = link.icon;
                    const isActive = location.pathname === link.href;
                    const cls = `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isActive ? "bg-primary text-primary-foreground font-semibold" : "text-foreground/80 hover:bg-primary/10"
                    }`;
                    const inner = (<><IconComp size={16} className={isActive ? "" : "text-primary/70"} />{link.name}</>);
                    return link.href.startsWith("http") ? (
                      <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" onClick={handleNavClick} className={cls}>{inner}</a>
                    ) : (
                      <Link key={link.href} to={link.href} onClick={handleNavClick} className={cls}>
                        {inner}
                      </Link>
                    );

                  })}
                </div>
                <div className="flex items-center justify-between gap-2 p-2 border-t border-border/40">


                  <Link
                    to="/contact"
                    onClick={handleNavClick}
                    className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1"
                  >
                    {t("nav.startProject")}
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          { name: language === "bn" ? "যোগাযোগ" : "Contact", href: "/contact", icon: Mail },
        ];

        return (
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            <div className="bg-background/70 dark:bg-card/70 backdrop-blur-3xl border-t border-border/30 dark:border-border/20">
              <div className="grid grid-cols-5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] px-1">

                {bottomNavItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = location.pathname === item.href;

                  const inner = (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="bottom-nav-active"
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
                        <span className={`text-[8.5px] leading-tight mt-0.5 transition-all duration-200 ${
                          isActive ? "font-bold text-primary" : "font-medium text-muted-foreground/60"
                        }`}>
                          {item.name}
                        </span>
                      </div>
                    </>
                  );
                  const cls = "relative flex flex-col items-center gap-0.5 py-1";
                  return item.href.startsWith("http") ? (
                    <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                  ) : (
                    <Link key={item.href} to={item.href} className={cls}>
                      {inner}
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