import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Github } from "lucide-react";
import Layout from "@/components/Layout";

const teamMembers = [
  {
    name: "Alex Rahman",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    bio: "Visionary leader with 8+ years of experience in creative direction and brand strategy.",
    socials: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Sarah Khan",
    role: "Lead Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    bio: "Award-winning designer specializing in brand identity and visual communication.",
    socials: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "David Chen",
    role: "Web Developer",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    bio: "Full-stack developer passionate about creating fast, scalable web applications.",
    socials: { github: "#", linkedin: "#" },
  },
  {
    name: "Priya Sharma",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    bio: "User experience specialist focused on creating intuitive and delightful interfaces.",
    socials: { instagram: "#", linkedin: "#" },
  },
];

const TeamPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-glow-secondary/5 rounded-full blur-[120px]" />
        
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative mb-5 rounded-2xl overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <div className="flex gap-3">
                        {member.socials.facebook && (
                          <a href={member.socials.facebook} className="p-2.5 rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                            <Facebook size={18} />
                          </a>
                        )}
                        {member.socials.instagram && (
                          <a href={member.socials.instagram} className="p-2.5 rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                            <Instagram size={18} />
                          </a>
                        )}
                        {member.socials.linkedin && (
                          <a href={member.socials.linkedin} className="p-2.5 rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                            <Linkedin size={18} />
                          </a>
                        )}
                        {member.socials.github && (
                          <a href={member.socials.github} className="p-2.5 rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                            <Github size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-display font-semibold">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
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
            <a
              href="mailto:careers@alphazero.agency"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg hover:bg-primary/90 transition-all duration-300 box-glow"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default TeamPage;
