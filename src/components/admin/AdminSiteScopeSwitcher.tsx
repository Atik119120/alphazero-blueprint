import { motion } from "framer-motion";
import { Building2, GraduationCap } from "lucide-react";
import { useAdminScope } from "@/contexts/AdminSiteScopeContext";

const AdminSiteScopeSwitcher = () => {
  const { scope, setScope } = useAdminScope();

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-secondary/60 border border-border p-1">
      <button
        onClick={() => setScope("agency")}
        className={`relative px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
          scope === "agency" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {scope === "agency" && (
          <motion.div layoutId="admin-scope-pill" className="absolute inset-0 bg-primary rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
        )}
        <Building2 size={13} className="relative z-10" />
        <span className="relative z-10">Agency</span>
      </button>
      <button
        onClick={() => setScope("learn")}
        className={`relative px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
          scope === "learn" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {scope === "learn" && (
          <motion.div layoutId="admin-scope-pill" className="absolute inset-0 bg-primary rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
        )}
        <GraduationCap size={13} className="relative z-10" />
        <span className="relative z-10">Learn</span>
      </button>
    </div>
  );
};

export default AdminSiteScopeSwitcher;
