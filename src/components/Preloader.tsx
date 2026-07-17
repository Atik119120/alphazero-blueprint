import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, memo } from "react";
import logoAssetJson from "@/assets/logo.png.asset.json";
import learnIconJson from "@/assets/learn-preloader-icon.png.asset.json";
import { useSiteScope } from "@/contexts/SiteScopeContext";
const logo = logoAssetJson.url;
const learnIcon = learnIconJson.url;
const Preloader = memo(({ onComplete }: { onComplete: () => void }) => {
  const scope = useSiteScope();
  const isLearn = scope === "learn";
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Faster progress animation - complete in 500ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20; // Even faster increment
      });
    }, 20); // Faster interval

    // Reduced total time to 500ms for much faster LCP
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 150);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${isLearn ? "bg-white" : "bg-black"}`}
        >
          {/* Logo */}
          <div className="relative z-10">
            <motion.img
              src={isLearn ? learnIcon : logo}
              alt="AlphaZero"
              width={96}
              height={96}
              className={`h-20 md:h-24 w-auto ${isLearn ? "" : "invert"}`}
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              initial={{ scale: 0.85, opacity: 0.6 }}
              animate={{ scale: [0.9, 1.05, 0.95, 1], opacity: 1 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className={`mt-4 text-base md:text-lg font-display tracking-wide font-medium ${isLearn ? "text-slate-800" : "text-white"}`}
          >
            From <span className={isLearn ? "bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent" : "text-primary"}>zero</span> to impact
          </motion.p>

          {/* Progress bar */}
          <div className={`mt-4 w-32 h-0.5 rounded-full overflow-hidden ${isLearn ? "bg-slate-200" : "bg-white/20"}`}>
            <motion.div
              className={`h-full rounded-full ${isLearn ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "bg-primary"}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.02, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default Preloader;
