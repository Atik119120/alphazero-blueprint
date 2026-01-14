import { motion } from "framer-motion";
import { useState } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const categories = ["All", "Web Design", "Social Media", "Branding", "Logo"];

const projects = [
  // Web Design Projects
  {
    id: 1,
    title: "E-commerce Platform",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    description: "Modern e-commerce website design with seamless user experience.",
  },
  {
    id: 2,
    title: "SaaS Dashboard",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    description: "Clean analytics dashboard for business intelligence platform.",
  },
  {
    id: 3,
    title: "Fitness App UI",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
    description: "Mobile app UI/UX design for a fitness and wellness brand.",
  },
  {
    id: 4,
    title: "Portfolio Website",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
    description: "Minimal portfolio website for a creative professional.",
  },
  {
    id: 5,
    title: "Music Streaming App",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&h=400&fit=crop",
    description: "Sleek dark-themed music streaming app interface design.",
  },
  {
    id: 6,
    title: "Real Estate Platform",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    description: "Property listing platform with advanced search features.",
  },
  // Social Media Projects
  {
    id: 7,
    title: "Restaurant Social Campaign",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
    description: "Social media content strategy and design for restaurant chain.",
  },
  {
    id: 8,
    title: "Travel Agency Posts",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
    description: "Engaging social media content for travel and tourism company.",
  },
  {
    id: 9,
    title: "Fitness Brand Stories",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    description: "Dynamic Instagram stories and posts for fitness brand.",
  },
  {
    id: 10,
    title: "Fashion Collection Launch",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    description: "Campaign creatives for seasonal fashion collection launch.",
  },
  {
    id: 11,
    title: "Tech Startup Socials",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
    description: "Professional social media presence for B2B tech company.",
  },
  {
    id: 12,
    title: "Food Delivery Campaign",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
    description: "Mouth-watering social creatives for food delivery app.",
  },
  // Branding Projects
  {
    id: 13,
    title: "Tech Startup Branding",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    description: "Complete brand identity for a tech startup including logo, colors, and guidelines.",
  },
  {
    id: 14,
    title: "Fashion Brand Identity",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
    description: "Premium fashion brand visual identity and marketing materials.",
  },
  {
    id: 15,
    title: "Coffee Shop Branding",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop",
    description: "Warm and inviting brand identity for artisan coffee shop.",
  },
  // Logo Projects
  {
    id: 16,
    title: "Minimal Logo Collection",
    category: "Logo",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop",
    description: "Minimalist logo designs for various clients across industries.",
  },
  {
    id: 17,
    title: "Restaurant Logo Suite",
    category: "Logo",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    description: "Elegant logo variations for upscale dining establishment.",
  },
  {
    id: 18,
    title: "Tech Company Logomark",
    category: "Logo",
    image: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&h=400&fit=crop",
    description: "Modern, scalable logomark for innovative tech company.",
  },
];

const WorkPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

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
              Our Work
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-display font-bold mb-6"
            >
              Selected <span className="gradient-text">Projects</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              A showcase of our best work across web design, social media, and branding.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
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
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl bg-card border border-border"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
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

      {/* CTA Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
              Like what you see?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Let's create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                Start Your Project <ArrowRight size={20} />
              </Link>
              <a
                href="https://wa.me/8801410190019"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary border border-border text-foreground rounded-xl font-medium text-lg hover:bg-secondary/80 transition-all duration-300"
              >
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default WorkPage;
