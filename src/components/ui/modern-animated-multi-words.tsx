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
            "bg-primary text-primary-foreground shadow-2xl shadow-primary/30 border border-primary/50",
          glow: "before:bg-primary/20",
        };
      case "neon":
        return {
          container:
            "bg-background text-primary shadow-2xl shadow-primary/40 border border-primary/60",
          glow: "before:bg-primary/30",
        };
      case "glass":
        return {
          container:
            "bg-card/10 backdrop-blur-xl text-foreground shadow-2xl shadow-black/20 border border-border/20",
          glow: "before:bg-card/10",
        };
      default:
        return {
          container:
            "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white shadow-2xl shadow-purple-500/40 border border-white/20",
          glow: "before:bg-gradient-to-r before:from-purple-600/30 before:via-pink-600/30 before:to-orange-500/30",
        };
    }
  };

  const variantClasses = getVariantClasses();

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      {/* Animated background glow */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-2xl blur-xl opacity-60",
          variantClasses.glow
        )}
        animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main container */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl px-6 py-3 sm:px-8 sm:py-4",
          variantClasses.container
        )}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]" />
        </motion.div>

        {/* Text content */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.span
              key={`word-${currentWordIndex}-${id}`}
              className={cn(
                "inline-flex text-2xl sm:text-3xl lg:text-5xl font-display font-bold tracking-tight",
                textClassName
              )}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
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

        {/* Decorative corners */}
        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/30 rounded-tl" />
        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/30 rounded-tr" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/30 rounded-bl" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/30 rounded-br" />
      </div>
    </div>
  );
}

export default ContainerTextFlip;
