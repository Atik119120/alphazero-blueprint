import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Facebook, Instagram, Linkedin, Github } from "lucide-react";

const teamMembers = [
  {
    name: "Alex Rahman",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    socials: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Sarah Khan",
    role: "Lead Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    socials: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "David Chen",
    role: "Web Developer",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    socials: { github: "#", linkedin: "#" },
  },
  {
    name: "Priya Sharma",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    socials: { instagram: "#", linkedin: "#" },
  },
];

const Team = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="team" className="py-24 lg:py-32 bg-secondary/30 relative">
      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-glow-secondary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6">
        <div ref={ref} className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Our Team
            </span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Meet the <span className="gradient-text">Creators</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A passionate team of designers and developers dedicated to bringing 
              your vision to life.
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative mb-5 rounded-2xl overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <div className="flex gap-3">
                      {member.socials.facebook && (
                        <a href={member.socials.facebook} className="p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Facebook size={18} />
                        </a>
                      )}
                      {member.socials.instagram && (
                        <a href={member.socials.instagram} className="p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Instagram size={18} />
                        </a>
                      )}
                      {member.socials.linkedin && (
                        <a href={member.socials.linkedin} className="p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Linkedin size={18} />
                        </a>
                      )}
                      {member.socials.github && (
                        <a href={member.socials.github} className="p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Github size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-display font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
