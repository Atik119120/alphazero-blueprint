import { createContext, useContext, useMemo, ReactNode } from "react";
import { useLocation } from "react-router-dom";

export type SiteScope = "agency" | "learn";

const LEARN_ROUTES = ["/courses", "/instructors", "/learn-about", "/learn-contact"];

const SiteScopeContext = createContext<SiteScope>("agency");

export const SiteScopeProvider = ({ children, override }: { children: ReactNode; override?: SiteScope }) => {
  const location = useLocation();
  const scope = useMemo<SiteScope>(() => {
    if (override) return override;
    const isLearnSubdomain = typeof window !== "undefined" && window.location.hostname.startsWith("learn.");
    if (isLearnSubdomain) return "learn";
    if (LEARN_ROUTES.some((r) => location.pathname.startsWith(r))) return "learn";
    return "agency";
  }, [location.pathname, override]);
  return <SiteScopeContext.Provider value={scope}>{children}</SiteScopeContext.Provider>;
};

export const useSiteScope = (): SiteScope => useContext(SiteScopeContext);
