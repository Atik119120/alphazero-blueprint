import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AdminScope = "agency" | "learn";

interface AdminSiteScopeCtx {
  scope: AdminScope;
  setScope: (s: AdminScope) => void;
}

const Ctx = createContext<AdminSiteScopeCtx>({ scope: "agency", setScope: () => {} });

const STORAGE_KEY = "admin.siteScope";

export const AdminSiteScopeProvider = ({ children }: { children: ReactNode }) => {
  const [scope, setScopeState] = useState<AdminScope>("agency");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as AdminScope | null) : null;
    if (saved === "agency" || saved === "learn") setScopeState(saved);
  }, []);

  const setScope = (s: AdminScope) => {
    setScopeState(s);
    try { localStorage.setItem(STORAGE_KEY, s); } catch {}
  };

  return <Ctx.Provider value={{ scope, setScope }}>{children}</Ctx.Provider>;
};

export const useAdminScope = () => useContext(Ctx);
