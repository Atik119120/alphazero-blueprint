import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Home, 
  Info, 
  Briefcase, 
  FolderOpen, 
  Users, 
  Phone,
  Sun,
  Moon,
  Languages
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
    { name: t("nav.home"), href: "/", icon: Home },
    { name: t("nav.about"), href: "/about", icon: Info },
    { name: t("nav.services"), href: "/services", icon: Briefcase },
    { name: t("nav.work"), href: "/work", icon: FolderOpen },
    { name: t("nav.team"), href: "/team", icon: Users },
    { name: t("nav.contact"), href: "/contact", icon: Phone },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/90 backdrop-blur-lg border-b border-border" : "bg-background/50 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src={logo} 
                alt="AlphaZero Logo" 
                className="h-10 w-auto brightness-0 dark:invert"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.href 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <link.icon size={16} />
                  {link.name}
                </Link>
              ))}
              
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="ml-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                title={language === "en" ? "বাংলা" : "English"}
              >
                <span className="text-sm font-medium">{language === "en" ? "বাং" : "EN"}</span>
              </button>
              
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}
              
              <Link
                to="/contact"
                className="ml-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                {t("nav.startProject")}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-20 md:hidden"
          >
            <div className="flex flex-col items-center gap-4 p-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.href}
                    onClick={handleNavClick}
                    className={`flex items-center gap-3 text-xl font-display font-medium px-6 py-3 rounded-xl transition-colors ${
                      location.pathname === link.href 
                        ? "text-primary bg-primary/10" 
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <link.icon size={22} />
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile Theme & Language Toggles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4 mt-4"
              >
                <button
                  onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-foreground"
                >
                  <Languages size={18} />
                  {language === "en" ? "বাংলা" : "English"}
                </button>
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-3 rounded-xl bg-secondary text-foreground"
                  >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link
                  to="/contact"
                  onClick={handleNavClick}
                  className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium inline-block"
                >
                  {t("nav.startProject")}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
