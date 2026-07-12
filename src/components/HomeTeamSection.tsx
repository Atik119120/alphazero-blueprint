import { motion } from "framer-motion";
import { ArrowRight, Users, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useLanguage } from "@/contexts/LanguageContext";

const HomeTeamSection = () => {
  const { data: teamMembers, isLoading } = useTeamMembers();
  const { t } = useLanguage();

  const members = (teamMembers || []).slice(0, 6);

  return (
    <section className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-6">
            <Users size={14} className="text-primary" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">
              {t("team.subtitle") || "Our Team"}
            </span>
          </div>
          <h2 className="text-3xl lg:text-5xl xl:text-6xl font-display font-bold">
            {t("team.title") || "Meet the"}{" "}
            <span className="gradient-text">{t("team.title2") || "Team"}</span>
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : members.length === 0 ? null : (
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {members.map((member, index) => {
              const roles = member.role.split(",");
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/30 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 bg-secondary">
                    <img
                      src={member.image_url || "/placeholder.svg"}
                      alt={member.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="w-6 h-0.5 bg-primary rounded-full mb-1.5 group-hover:w-10 transition-all duration-500" />
                      <h3 className="text-sm font-display font-bold text-white leading-tight truncate">
                        {member.name}
                      </h3>
                      <p className="text-[10px] text-white/70 truncate mt-0.5">
                        {roles[0]?.trim()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/team"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
          >
            View All Team
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeTeamSection;
