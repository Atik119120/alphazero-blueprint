import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Framer-like global scroll reveal.
 * Auto-animates top-level <section> elements and any element marked with
 * data-reveal when they enter the viewport. Runs once per element.
 */
const ScrollReveal = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const selectors = [
      "main section",
      "[data-reveal]",
    ].join(",");

    const prepare = (el: Element) => {
      const node = el as HTMLElement;
      if (node.dataset.revealReady === "1") return;
      node.dataset.revealReady = "1";
      node.style.opacity = "0";
      node.style.transform = "translateY(32px)";
      node.style.filter = "blur(6px)";
      node.style.transition =
        "opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1), filter 0.8s cubic-bezier(0.22,1,0.36,1)";
      node.style.willChange = "opacity, transform, filter";
    };

    const reveal = (el: Element) => {
      const node = el as HTMLElement;
      node.style.opacity = "1";
      node.style.transform = "translateY(0)";
      node.style.filter = "blur(0px)";
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );

    // Slight delay so route content is mounted
    const timer = window.setTimeout(() => {
      const els = document.querySelectorAll(selectors);
      els.forEach((el) => {
        // Skip navbars, footers, and fixed/absolute layouts
        const node = el as HTMLElement;
        if (node.closest("nav, header[role='banner']")) return;
        prepare(node);
        io.observe(node);
      });
    }, 80);

    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [location.pathname]);

  return null;
};

export default ScrollReveal;
