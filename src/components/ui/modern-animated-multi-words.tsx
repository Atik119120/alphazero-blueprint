import React, { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ContainerTextFlipProps {
  words?: string[];
  interval?: number;
  className?: string;
  textClassName?: string;
  animationDuration?: number;
  variant?: "primary" | "gradient" | "neon" | "glass";
}

export function ContainerTextFlip({
  words = ["revolutionary", "extraordinary", "phenomenal", "incredible"],
  interval = 3500,
  className,
  textClassName,
  animationDuration = 800,
  variant = "gradient",
}: ContainerTextFlipProps) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsAnimating(false);
      }, animationDuration / 2);
    }, interval);

    return () => clearInterval(intervalId);
  }, [words, interval, animationDuration]);

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return {
          container:
            "bg-primary text-primary-foreground border-2 border-primary/50",
        };
      case "neon":
        return {
          container:
            "bg-background text-primary border-2 border-primary/60",
        };
      case "glass":
        return {
          container:
            "bg-card/10 backdrop-blur-xl text-foreground border-2 border-border/20",
        };
      default:
        return {
          container:
            "bg-gradient-to-r from-primary via-[hsl(185,100%,45%)] to-[hsl(200,100%,50%)] text-white border-2 border-white/25",
        };
    }
  };

  const variantClasses = getVariantClasses();

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      {/* Animated background glow */}
      <motion.div
        className={cn(
          "absolute -inset-1 rounded-3xl blur-2xl opacity-50",
          variantClasses.glow
        )}
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Outer ring pulse */}
      <motion.div
        className="absolute -inset-[3px] rounded-3xl bg-gradient-to-r from-primary via-[hsl(185,100%,50%)] to-[hsl(200,100%,55%)] opacity-0"
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Main container */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl px-7 py-4 sm:px-10 sm:py-5",
          variantClasses.container
        )}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-full w-1/4 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-15deg]" />
        </motion.div>

        {/* Top-left decorative dot */}
        <motion.div 
          className="absolute top-2.5 left-3 w-1.5 h-1.5 rounded-full bg-white/40"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Top-right decorative dot */}
        <motion.div 
          className="absolute top-2.5 right-3 w-1.5 h-1.5 rounded-full bg-white/40"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        {/* Bottom-left decorative dot */}
        <motion.div 
          className="absolute bottom-2.5 left-3 w-1.5 h-1.5 rounded-full bg-white/40"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        {/* Bottom-right decorative dot */}
        <motion.div 
          className="absolute bottom-2.5 right-3 w-1.5 h-1.5 rounded-full bg-white/40"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />

        {/* Text content */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.span
              key={`word-${currentWordIndex}-${id}`}
              className={cn(
                "inline-flex text-2xl sm:text-3xl lg:text-5xl font-display font-bold tracking-tight drop-shadow-lg",
                textClassName
              )}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)", scale: 0.95 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)", scale: 0.95 }}
              transition={{ duration: animationDuration / 1000 }}
            >
              {words[currentWordIndex].split("").map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}-${id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.03,
                    duration: 0.2,
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ContainerTextFlip;
