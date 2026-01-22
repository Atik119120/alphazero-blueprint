import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LayoutComponent from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const content = {
    en: {
      title: "Page Not Found",
      subtitle: "Oops! The page you're looking for doesn't exist.",
      description: "It might have been moved, deleted, or perhaps the URL was mistyped.",
      homeBtn: "Go to Homepage",
      backBtn: "Go Back",
      searchTip: "Try searching for what you need",
      errorCode: "Error 404"
    },
    bn: {
      title: "পৃষ্ঠা খুঁজে পাওয়া যায়নি",
      subtitle: "ওহ! আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি বিদ্যমান নেই।",
      description: "এটি সরানো হয়েছে, মুছে ফেলা হয়েছে, অথবা সম্ভবত URL ভুল টাইপ করা হয়েছে।",
      homeBtn: "হোমপেজে যান",
      backBtn: "পেছনে যান",
      searchTip: "আপনার প্রয়োজনীয় তথ্য খুঁজুন",
      errorCode: "ত্রুটি ৪০৪"
    }
  };

  const t = content[language] || content.en;

  return (
    <LayoutComponent>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative mb-8"
          >
            <div className="text-[150px] sm:text-[200px] font-display font-bold leading-none gradient-text select-none">
              404
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </motion.div>
          </motion.div>

          {/* Error Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-6"
          >
            <span className="text-sm font-medium text-destructive">{t.errorCode}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-display font-bold mb-4"
          >
            {t.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mb-2"
          >
            {t.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground mb-8"
          >
            {t.description}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="gap-2 min-w-[180px]"
            >
              <Link to="/">
                <Home size={18} />
                {t.homeBtn}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="gap-2 min-w-[180px]"
            >
              <ArrowLeft size={18} />
              {t.backBtn}
            </Button>
          </motion.div>

          {/* Search Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Search size={16} />
              <span>{t.searchTip}</span>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

export default NotFound;