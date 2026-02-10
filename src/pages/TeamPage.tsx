import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Facebook, 
  Instagram, 
  ArrowRight, 
  Loader2, 
  Twitter, 
  Mail, 
  Globe, 
  MessageCircle,
  Linkedin,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Custom icons for platforms without lucide equivalents
const FiverrIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-.85c-.546 0-.84.41-.84 1.092v2.466h-1.61v-3.558h-.684c-.547 0-.84.41-.84 1.092v2.466h-1.61v-4.874h1.61v.74c.264-.574.626-.74 1.163-.74h1.972v.74c.264-.574.625-.74 1.162-.74h1.527v1.316zm-6.786 1.501h-3.359c.088.545.432.953 1.09.953.484 0 .88-.226 1.026-.608h1.584c-.322 1.174-1.37 1.99-2.61 1.99-1.584 0-2.852-1.13-2.852-2.764 0-1.633 1.268-2.763 2.852-2.763 1.584 0 2.853 1.13 2.853 2.763 0 .15-.02.28-.038.43h-.546zm-1.243-1.14c-.088-.5-.42-.862-1.004-.862s-.916.363-1.004.862h2.008zm-6.167-.991h2.153v1.213h-2.153v1.501h2.61v1.316H8.396v-5.647h3.376v1.316h-2.61v.301h2.61zm-4.93-1.617h1.61v5.647H3.882v-.37c-.322.37-.724.518-1.247.518-1.34 0-2.35-1.008-2.35-2.632 0-1.625 1.01-2.632 2.35-2.632.523 0 .925.148 1.247.518v-.37h1.61v-.679h-.61v-.679h1.61v.679zm-2.035 3.858c.546 0 .926-.393.926-1.05 0-.659-.38-1.05-.926-1.05-.548 0-.927.391-.927 1.05 0 .657.38 1.05.927 1.05z"/>
  </svg>
);

const UpworkIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.543-2.546V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.85-.706 2.044-1.114 3.382-1.169l.164-.006c1.077 0 2.063.238 2.88.678-.148-.56-.42-1.025-.82-1.393-.586-.536-1.432-.821-2.443-.821h-.103c-1.17.03-2.14.475-2.736 1.222l-1.511-1.236c.96-1.177 2.405-1.867 4.134-1.974h.138c1.605 0 2.965.488 3.93 1.407.893.852 1.386 2.041 1.428 3.441v.049c.083.018.165.036.249.056 1.188.276 2.163.857 2.898 1.724.878 1.037 1.272 2.378 1.14 3.88-.173 1.962-1.058 3.639-2.559 4.851-1.358 1.096-3.17 1.759-5.38 1.971-.262.025-.521.037-.781.037zm-1.2-8.319c-.788.036-1.408.247-1.793.609-.353.333-.53.756-.499 1.194.062 1.04 1.072 1.75 2.467 1.679 1.017-.053 1.8-.447 2.326-1.17.312-.428.523-.973.635-1.634-.66-.244-1.436-.49-2.369-.592-.257-.03-.516-.058-.767-.086z"/>
  </svg>
);

const TeamPage = () => {
  const { t } = useLanguage();
  const { data: teamMembers, isLoading } = useTeamMembers();

  // Fetch custom links for all team members
  const { data: customLinks } = useQuery({
    queryKey: ['team-custom-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_member_custom_links')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data;
    },
  });

  const getMemberCustomLinks = (memberId: string) => {
    return customLinks?.filter(l => l.team_member_id === memberId) || [];
  };
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block"
            >
              {t("team.subtitle")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-display font-bold mb-6"
            >
              {t("team.title")} <span className="gradient-text">{t("team.title2")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              {t("team.description")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !teamMembers || teamMembers.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No team members found.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group h-full"
                  >
                    {/* Card Container - Horizontal Layout */}
                    <div className="relative h-full flex gap-4 bg-gradient-to-r from-secondary/50 to-background rounded-2xl p-4 border border-border group-hover:border-primary/40 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/10">
                      {/* Active Status Dot */}
                      <div className="absolute -top-1 -left-1 z-20">
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
                        </span>
                      </div>
                      
                      {/* Image Container */}
                      <div className="relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden bg-secondary">
                        <img
                          src={member.image_url || '/placeholder.svg'}
                          alt={member.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-40" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Name */}
                        <h3 className="text-lg font-display font-bold mb-1 bg-gradient-to-r from-foreground to-primary bg-clip-text group-hover:text-transparent transition-all duration-500 truncate">
                          {member.name}
                        </h3>
                        
                        {/* Role Tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {member.role.split(', ').map((role, idx) => (
                            <span 
                              key={idx} 
                              className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary/15 text-primary border border-primary/25"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                        
                        {/* Bio */}
                        {member.bio && (
                          <p className="text-muted-foreground text-xs leading-relaxed mb-2">{member.bio}</p>
                        )}
                        
                        {/* Social Icons */}
                        <div className="flex flex-wrap gap-1.5">
                          {member.facebook_url && (
                            <a 
                              href={member.facebook_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-secondary hover:bg-blue-600 hover:text-white transition-all duration-300"
                              title="Facebook"
                            >
                              <Facebook size={14} />
                            </a>
                          )}
                          {member.instagram_url && (
                            <a 
                              href={member.instagram_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-secondary hover:bg-pink-600 hover:text-white transition-all duration-300"
                              title="Instagram"
                            >
                              <Instagram size={14} />
                            </a>
                          )}
                          {member.twitter_url && (
                            <a 
                              href={member.twitter_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-secondary hover:bg-sky-500 hover:text-white transition-all duration-300"
                              title="Twitter/X"
                            >
                              <Twitter size={14} />
                            </a>
                          )}
                          {member.threads_url && (
                            <a 
                              href={member.threads_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-secondary hover:bg-foreground hover:text-background transition-all duration-300"
                              title="Threads"
                            >
                              <ThreadsIcon />
                            </a>
                          )}
                          {member.whatsapp_url && (
                            <a 
                              href={member.whatsapp_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-secondary hover:bg-green-500 hover:text-white transition-all duration-300"
                              title="WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </a>
                          )}
                          {member.email && (
                            <a 
                              href={`mailto:${member.email}`}
                              className="p-1.5 rounded-full bg-secondary hover:bg-red-500 hover:text-white transition-all duration-300"
                              title="Email"
                            >
                              <Mail size={14} />
                            </a>
                          )}
                          {member.linkedin_url && (
                            <a 
                              href={member.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-secondary hover:bg-blue-700 hover:text-white transition-all duration-300"
                              title="LinkedIn"
                            >
                              <Linkedin size={14} />
                            </a>
                          )}
                          {member.fiverr_url && (
                            <a 
                              href={member.fiverr_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-secondary hover:bg-green-600 hover:text-white transition-all duration-300"
                              title="Fiverr"
                            >
                              <FiverrIcon />
                            </a>
                          )}
                          {member.upwork_url && (
                            <a 
                              href={member.upwork_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-secondary hover:bg-green-500 hover:text-white transition-all duration-300"
                              title="Upwork"
                            >
                              <UpworkIcon />
                            </a>
                          )}
                          {member.portfolio_url && (
                            <a 
                              href={member.portfolio_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                              title="Portfolio"
                            >
                              <Globe size={14} />
                            </a>
                           )}
                          {/* Custom Links */}
                          {getMemberCustomLinks(member.id).map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                              title={link.label}
                            >
                              {link.icon_url ? (
                                <img src={link.icon_url} alt={link.label} className="w-3.5 h-3.5 object-contain" />
                              ) : (
                                <ExternalLink size={14} />
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
              {t("team.join.title")}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t("team.join.desc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/join-team"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                {t("team.join.cta1")} <ArrowRight size={20} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary border border-border text-foreground rounded-xl font-medium text-lg hover:bg-secondary/80 transition-all duration-300"
              >
                {t("team.join.cta2")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default TeamPage;
