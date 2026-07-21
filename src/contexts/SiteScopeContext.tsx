import { createContext, useContext, useEffect, useMemo, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";

export type SiteScope = "agency" | "learn";

const LEARN_ROUTES = ["/courses", "/instructors", "/learn-about", "/learn-contact"];

const SiteScopeContext = createContext<SiteScope>("agency");

export const SiteScopeProvider = ({ children, override }: { children: ReactNode; override?: SiteScope }) => {
  const location = useLocation();
  const { setTheme } = useTheme();
  const scope = useMemo<SiteScope>(() => {
    if (override) return override;
    const isLearnSubdomain = typeof window !== "undefined" && window.location.hostname.startsWith("learn.");
    if (isLearnSubdomain) return "learn";
    if (LEARN_ROUTES.some((r) => location.pathname.startsWith(r))) return "learn";
    return "agency";
  }, [location.pathname, override]);

  // Force light theme on both learn and agency sites
  useEffect(() => {
    if (typeof document === "undefined") return;
    const target = "light";
    const root = document.documentElement;

    const apply = () => {
      if (target === "light") {
        root.classList.remove("dark");
        root.classList.add("light");
      } else {
        root.classList.remove("light");
        root.classList.add("dark");
      }
      root.style.colorScheme = target;
    };

    setTheme(target);
    apply();

    // Guard against any late re-application by other providers
    const observer = new MutationObserver(() => {
      const hasDark = root.classList.contains("dark");
      const hasLight = root.classList.contains("light");
      if (hasDark || !hasLight) apply();
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class", "style"] });
    return () => observer.disconnect();
  }, [scope, setTheme]);

  return <SiteScopeContext.Provider value={scope}>{children}</SiteScopeContext.Provider>;
};

export const useSiteScope = (): SiteScope => useContext(SiteScopeContext);
