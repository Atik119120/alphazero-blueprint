import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Palette, 
  Layers, 
  Smartphone, 
  Image, 
  Megaphone,
  Globe,
  Layout,
  Code,
  FileText,
  Building
} from "lucide-react";

const graphicServices = [
  { icon: Palette, title: "Logo Design", description: "Memorable logos that define your brand identity" },
  { icon: Layers, title: "Brand Identity", description: "Complete visual systems for cohesive branding" },
  { icon: Smartphone, title: "Social Media Design", description: "Engaging content that captures attention" },
  { icon: Image, title: "Poster & Banner", description: "Eye-catching visuals for print and digital" },
  { icon: Megaphone, title: "Marketing Creatives", description: "Conversion-focused advertising materials" },
];

const webServices = [
  { icon: Globe, title: "Website Design", description: "Beautiful, user-centered website experiences" },
  { icon: Layout, title: "UI/UX Design", description: "Intuitive interfaces that users love" },
  { icon: Code, title: "Web Development", description: "Fast, responsive, and scalable websites" },
  { icon: FileText, title: "Landing Pages", description: "High-converting pages that drive results" },
  { icon: Building, title: "Business Websites", description: "Professional sites for growing companies" },
];

const ServiceCard = ({ service, index }: { service: typeof graphicServices[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
  >
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
      <service.icon size={20} className="text-primary" />
    </div>
    <h3 className="text-lg font-display font-semibold mb-2">{service.title}</h3>
    <p className="text-sm text-muted-foreground">{service.description}</p>
  </motion.div>
);

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 lg:py-32 bg-secondary/30 relative">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
      
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
              Our Services
            </span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              What we <span className="gradient-text">offer</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From stunning visuals to powerful web solutions, we provide everything 
              your brand needs to stand out in the digital world.
            </p>
          </motion.div>

          {/* Graphic Design Services */}
          <div className="mb-16">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-display font-semibold mb-8 flex items-center gap-3"
            >
              <span className="w-8 h-px bg-primary" />
              Graphic Design
            </motion.h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {graphicServices.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} />
              ))}
            </div>
          </div>

          {/* Web Services */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-display font-semibold mb-8 flex items-center gap-3"
            >
              <span className="w-8 h-px bg-primary" />
              Web Solutions
            </motion.h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {webServices.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
