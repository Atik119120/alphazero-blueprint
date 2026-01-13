import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

const categories = ["All", "Branding", "Social Media", "Web Design", "Logo"];

const projects = [
  {
    id: 1,
    title: "Tech Startup Branding",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    description: "Complete brand identity for a tech startup",
  },
  {
    id: 2,
    title: "E-commerce Platform",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    description: "Modern e-commerce website design",
  },
  {
    id: 3,
    title: "Restaurant Social Campaign",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
    description: "Social media content for restaurant chain",
  },
  {
    id: 4,
    title: "Minimal Logo Collection",
    category: "Logo",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop",
    description: "Minimalist logo designs for various clients",
  },
  {
    id: 5,
    title: "Fitness App UI",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
    description: "Mobile app UI/UX design for fitness brand",
  },
  {
    id: 6,
    title: "Fashion Brand Identity",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    description: "Premium fashion brand visual identity",
  },
];

const Work = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="work" className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-6">
        <div ref={ref} className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Our Work
            </span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Selected <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A showcase of our best work across branding, design, and web development.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-primary text-xs font-medium uppercase tracking-wider mb-2">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-display font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                  <button className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                    View Project <ExternalLink size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
