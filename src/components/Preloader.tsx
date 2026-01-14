import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 2800);

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
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Central glow */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Secondary glow */}
            <motion.div 
              className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-glow-secondary/15 rounded-full blur-[120px]"
              animate={{ 
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Tertiary glow */}
            <motion.div 
              className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-primary/10 rounded-full blur-[100px]"
              animate={{ 
                x: [0, -30, 0],
                y: [0, 20, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>

          {/* Particle lines */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                style={{
                  width: '200px',
                  top: `${20 + i * 15}%`,
                  left: `${10 + i * 20}%`,
                }}
                animate={{
                  x: [0, 100, 0],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Logo with enhanced glow */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* Logo glow ring */}
            <motion.div
              className="absolute inset-0 -m-4 rounded-full border border-primary/20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.img
              src={logo}
              alt="AlphaZero"
              className="h-28 md:h-36 w-auto brightness-0 invert"
              animate={{ 
                filter: [
                  "brightness(0) invert(1) drop-shadow(0 0 30px hsl(185 100% 50% / 0.4))",
                  "brightness(0) invert(1) drop-shadow(0 0 60px hsl(185 100% 50% / 0.8))",
                  "brightness(0) invert(1) drop-shadow(0 0 30px hsl(185 100% 50% / 0.4))"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 text-xl md:text-2xl text-foreground font-display tracking-wide font-medium"
          >
            Starting every idea from <span className="text-primary">zero</span>
          </motion.p>

          {/* Progress bar container */}
          <div className="mt-10 w-64 h-1 bg-secondary/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-glow-secondary to-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-6 text-sm text-primary tracking-[0.3em] uppercase font-medium"
          >
            From zero to impact
          </motion.p>

          {/* Bottom corner decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-8 text-xs text-muted-foreground tracking-widest"
          >
            ALPHAZERO.ONLINE
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
