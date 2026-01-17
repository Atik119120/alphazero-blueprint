import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Github, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

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
    role: "Founder, Microsoft Office Expert",
    image: "https://github.com/Atik119120/alphazero-blueprint/blob/main/527331453_2607182776321491_4396943466664849166_n.jpg?raw=true",
    bio: "Microsoft Office specialist with expertise in Excel, Word, PowerPoint and data management solutions.",
    socials: { facebook: "https://www.facebook.com/wlonlinecenter", instagram: "https://www.linkedin.com/in/md-kamrul-hasan-102228218/" },
  },
  {
    name: "Md.Shafiul Haque",
    role: "Web Designer, Video Editor",
    image: "https://github.com/Atik119120/alphazero-blueprint/blob/main/FB_IMG_1749736012792.jpg?raw=true",
    bio: "User experience specialist focused on creating intuitive and delightful interfaces.",
    socials: { instagram: "https://www.instagram.com/myself_shaurav?igsh=eWV3MjhuM29oeXpw", facebook: "https://www.facebook.com/itzme.shaurav" },
  },
];

const TeamPage = () => {
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
              Our Team
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-display font-bold mb-6"
            >
              Meet the <span className="gradient-text">Creators</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              A passionate team of designers and developers dedicated to bringing 
              your vision to life.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative mb-6 rounded-2xl overflow-hidden border border-border group-hover:border-primary/30 transition-colors duration-300">
                    <motion.img
                      src={member.image}
                      alt={member.name}
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                      <motion.div 
                        className="flex gap-3"
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                      >
                        {member.socials.facebook && (
                          <a 
                            href={member.socials.facebook} 
                            className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          >
                            <Facebook size={18} />
                          </a>
                        )}
                        {member.socials.instagram && (
                          <a 
                            href={member.socials.instagram} 
                            className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          >
                            <Instagram size={18} />
                          </a>
                        )}
                        {member.socials.linkedin && (
                          <a 
                            href={member.socials.linkedin} 
                            className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          >
                            <Linkedin size={18} />
                          </a>
                        )}
                        {'github' in member.socials && (member.socials as {github?: string}).github && (
                          <a 
                            href={(member.socials as {github?: string}).github} 
                            className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          >
                            <Github size={18} />
                          </a>
                        )}
                      </motion.div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-display font-semibold mb-2">{member.name}</h3>
                    <div className="flex flex-wrap justify-center gap-1.5 mb-3 min-h-[60px] items-start">
                      {member.role.split(', ').map((role, idx) => (
                        <span 
                          key={idx} 
                          className="inline-block px-3 py-1.5 text-xs font-semibold rounded-md bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/25 shadow-sm"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
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
              Want to join our team?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We're always looking for talented individuals to join our creative family.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:agency.alphazero@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                Get in Touch <ArrowRight size={20} />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary border border-border text-foreground rounded-xl font-medium text-lg hover:bg-secondary/80 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default TeamPage;
