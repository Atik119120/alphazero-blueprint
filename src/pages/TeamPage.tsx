import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Github, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const teamMembers = [
  {
    name: "Sofiullah Ahammad",
    role: "Founder, Graphics Designer, Vibe Coding Expert, Freelance Photographer",
    image: "https://github.com/Atik119120/Sofiullah-Ahammad/blob/main/537405745_1227380375810727_5014246075421698846_n.jpg?raw=true",
    bio: "Creative founder with 3+ years of experience in graphics design, vibe coding, and freelance photography.",
    socials: { facebook: "https://www.facebook.com/AtikAhmedPeradox", instagram: "https://www.instagram.com/atik_ahmed_69/", linkedin: "https://www.linkedin.com/in/sofiullah-ahammad/" },
  },
  {
    name: "Adib Sarkar",
    role: "Founder, Lead Designer, Entrepreneur",
    image: "https://github.com/Atik119120/alphazero-blueprint/blob/main/20260114_092617.jpg?raw=true",
    bio: "Award-winning designer specializing in brand identity and visual communication.",
    socials: { facebook: "https://www.facebook.com/share/17kdvEbE5h/", instagram: "https://www.instagram.com/_og_gy?igsh=ZTkydWRrdnk0ZDIw", linkedin: "https://www.linkedin.com/in/mdadibsarkar" },
  },
  {
    name: "Md.Kamrul Hasan",
    role: "Founder, Microsoft Office Expert, Graphics Designer",
    image: "https://github.com/Atik119120/alphazero-blueprint/blob/main/527331453_2607182776321491_4396943466664849166_n.jpg?raw=true",
    bio: "Microsoft Office specialist with expertise in Excel, Word, PowerPoint and data management solutions.",
    socials: { facebook: "https://www.facebook.com/wlonlinecenter", instagram: "https://www.linkedin.com/in/md-kamrul-hasan-102228218/" },
  },
  {
    name: "Md.Shafiul Haque",
    role: "Web Designer, Video Editor, Content Creator, Cinematographer",
    image: "https://github.com/Atik119120/alphazero-blueprint/blob/main/FB_IMG_1749736012792.jpg?raw=true",
    bio: "User experience specialist focused on creating intuitive and delightful interfaces.",
    socials: { instagram: "https://www.instagram.com/myself_shaurav?igsh=eWV3MjhuM29oeXpw", facebook: "https://www.facebook.com/itzme.shaurav" },
  },
  {
    name: "Prantik Saha",
    role: "Graphics Designer, Microsoft Office Expert, IT Support Specialist",
    image: "https://github.com/Atik119120/sfdvgvsdfzgvz/blob/main/bac0fdd4-96e3-44d6-b020-416e0fee72b3.jpg?raw=true",
    bio: "Skilled graphics designer and IT support specialist with expertise in Microsoft Office solutions.",
    socials: { instagram: "https://www.instagram.com/spoide_kid_/?utm_source=qr&igsh=cWZhd21sN292OXdk#", facebook: "https://www.facebook.com/share/175txVkBJq/", linkedin: "https://www.linkedin.com/in/prantik-saha-9225a2350/" },
  },
];

const TeamPage = () => {
  const { t } = useLanguage();

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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group h-full"
                >
                  {/* Card Container - Horizontal Layout */}
                  <div className="relative h-full flex gap-4 bg-gradient-to-r from-secondary/50 to-background rounded-2xl p-4 border border-border group-hover:border-primary/40 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/10">
                    {/* Member Number Badge */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-lg z-10">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    
                    {/* Image Container */}
                    <div className="relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden">
                      <motion.img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                      <p className="text-muted-foreground text-xs leading-relaxed mb-2">{member.bio}</p>
                      
                      {/* Social Icons */}
                      <div className="flex gap-2">
                        {member.socials.facebook && (
                          <a 
                            href={member.socials.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          >
                            <Facebook size={14} />
                          </a>
                        )}
                        {member.socials.instagram && (
                          <a 
                            href={member.socials.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          >
                            <Instagram size={14} />
                          </a>
                        )}
                        {member.socials.linkedin && (
                          <a 
                            href={member.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          >
                            <Linkedin size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
