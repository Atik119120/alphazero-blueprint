import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Globe, Palette, Monitor, Video, Play } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const webProjects = [
  {
    id: 1,
    title: "Atik Ahmed Portfolio",
    description: "Personal portfolio website showcasing creative works and services.",
    link: "https://atikahmed.online/",
    tech: ["React", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "Maariful Quran Academy",
    description: "Educational platform for Quran learning and Islamic studies.",
    link: "https://maarifulquranacademy.com/",
    tech: ["Web Design", "Responsive"],
  },
  {
    id: 3,
    title: "Alokchitra",
    description: "Creative photography and media services website.",
    link: "https://alokchitra.online/",
    tech: ["Photography", "Portfolio"],
  },
  {
    id: 4,
    title: "Dark Aura",
    description: "Modern dark-themed website with stunning visual design.",
    link: "https://darkaura.online/",
    tech: ["Dark Theme", "Modern UI"],
  },
  {
    id: 5,
    title: "Alpha Zero",
    description: "Digital agency website offering creative solutions.",
    link: "https://alphazero.online/",
    tech: ["Agency", "Creative"],
  },
  {
    id: 6,
    title: "Creative Portfolio",
    description: "Interactive portfolio showcasing innovative design work.",
    link: "https://xxxooxxx.netlify.app/",
    tech: ["Portfolio", "Interactive"],
  },
];

const designProjects = [
  {
    id: 1,
    title: "Brand Identity Design",
    description: "Complete brand identity including logo, colors, and guidelines.",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Social Media Graphics",
    description: "Eye-catching social media post designs and templates.",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Logo Collection",
    description: "Minimalist and modern logo designs for various clients.",
    category: "Logo Design",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Marketing Materials",
    description: "Flyers, banners, and promotional graphics for businesses.",
    category: "Print Design",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Business Card Design",
    description: "Professional business card designs with modern aesthetics.",
    category: "Print Design",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Poster & Banner Design",
    description: "Creative posters and banners for events and promotions.",
    category: "Print Design",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop",
  },
  {
    id: 7,
    title: "Instagram Post Templates",
    description: "Customizable Instagram post templates for brands.",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop",
  },
  {
    id: 8,
    title: "YouTube Thumbnail Design",
    description: "Eye-catching thumbnails that increase click-through rates.",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=600&h=400&fit=crop",
  },
];

const videoProjects = [
  {
    id: 1,
    title: "Promotional Videos",
    description: "Engaging promotional videos for brands and businesses.",
    category: "Promo",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Social Media Reels",
    description: "Short-form video content for Instagram and Facebook.",
    category: "Reels",
    thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Motion Graphics",
    description: "Animated graphics and visual effects for videos.",
    category: "Motion",
    thumbnail: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Event Highlights",
    description: "Professional event coverage and highlight reels.",
    category: "Events",
    thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Product Showcase",
    description: "Cinematic product videos for e-commerce and marketing.",
    category: "Product",
    thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Wedding Films",
    description: "Beautiful wedding cinematography and highlight films.",
    category: "Wedding",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
  },
  {
    id: 7,
    title: "Music Video Editing",
    description: "Creative music video editing with visual effects.",
    category: "Music",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
  },
  {
    id: 8,
    title: "Corporate Videos",
    description: "Professional corporate and training video production.",
    category: "Corporate",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
];

const WorkPage = () => {
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
              A showcase of our best work across web development and graphic design.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Web Development Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Globe size={24} />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-display font-bold">Web Development</h2>
                <p className="text-muted-foreground">Websites we've built for our clients</p>
              </div>
            </motion.div>

            {/* Web Projects Grid - Browser Mockup Style */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {webProjects.map((project, index) => (
                <motion.a
                  key={project.id}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group block"
                >
                  {/* Browser Mockup */}
                  <div className="rounded-xl overflow-hidden border border-border bg-card shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                    {/* Browser Top Bar */}
                    <div className="bg-secondary/50 px-4 py-3 flex items-center gap-2 border-b border-border">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <div className="flex-1 mx-3">
                        <div className="bg-background/80 rounded-md px-3 py-1.5 text-xs text-muted-foreground flex items-center gap-2 max-w-[200px]">
                          <Globe size={12} />
                          <span className="truncate">{project.link.replace('https://', '')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Website Preview Area */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 via-background to-secondary/20 flex items-center justify-center relative overflow-hidden">
                      <div className="text-center p-6">
                        <Monitor size={48} className="mx-auto mb-4 text-primary/40" />
                        <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {project.tech.map((tech, idx) => (
                            <span 
                              key={idx}
                              className="inline-block px-3 py-1.5 text-xs font-semibold rounded-md bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/25 shadow-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                          Visit Website <ExternalLink size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Design Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Palette size={24} />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-display font-bold">Graphic Design</h2>
                <p className="text-muted-foreground">Creative designs and branding work</p>
              </div>
            </motion.div>

            {/* Design Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {designProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="rounded-xl overflow-hidden border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-md bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/25 mb-2">
                        {project.category}
                      </span>
                      <h3 className="text-lg font-display font-semibold mb-1 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Editing Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Video size={24} />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-display font-bold">Video Editing</h2>
                <p className="text-muted-foreground">Professional video production and editing</p>
              </div>
            </motion.div>

            {/* Video Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videoProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="rounded-xl overflow-hidden border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
                    {/* Thumbnail with Play Button */}
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                          <Play size={24} className="text-primary-foreground ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-md bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/25 mb-2">
                        {project.category}
                      </span>
                      <h3 className="text-lg font-display font-semibold mb-1 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
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