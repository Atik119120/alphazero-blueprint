import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, memo } from "react";

// Inline critical logo for faster LCP - no import delay
const Preloader = memo(({ onComplete }: { onComplete: () => void }) => {
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
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
        >
          {/* Logo with clean animation - using preloaded image */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10"
          >
            <img
              src="/logo.png"
              alt="AlphaZero"
              className="h-20 md:h-24 w-auto"
              loading="eager"
              fetchPriority="high"
            />
          </motion.div>

          {/* Tagline - faster animation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="mt-4 text-base md:text-lg text-white font-display tracking-wide font-medium"
          >
            From <span className="text-primary">zero</span> to impact
          </motion.p>

          {/* Progress bar - minimal */}
          <div className="mt-4 w-32 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
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
