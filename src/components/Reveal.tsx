import { ReactNode, useRef, useEffect, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "span" | "article" | "header";
  stagger?: boolean;
  staggerDelay?: number;
}

const Reveal = ({
  children,
  delay = 0,
  duration = 0.7,
  y = 40,
  once = true,
  className,
  as = "div",
  stagger = false,
  staggerDelay = 0.08,
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px 0px -80px 0px" });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  }, []);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration, ease: [0.22, 1, 0.36, 1], delay: stagger ? 0 : delay },
    },
  };

  if (reduced) {
    const Tag = as as any;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = (motion as any)[as];

  if (stagger) {
    return (
      <MotionTag
        ref={ref as any}
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {Array.isArray(children)
          ? children.map((child, i) => (
              <motion.div key={i} variants={itemVariants}>
                {child}
              </motion.div>
            ))
          : <motion.div variants={itemVariants}>{children}</motion.div>}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      ref={ref as any}
      className={className}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
