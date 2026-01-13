import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
  Building,
  ArrowRight
} from "lucide-react";
import LayoutComponent from "@/components/Layout";

const graphicServices = [
  { icon: Palette, title: "Logo Design", description: "Memorable logos that define your brand identity and leave a lasting impression." },
  { icon: Layers, title: "Brand Identity", description: "Complete visual systems including colors, typography, and guidelines for cohesive branding." },
  { icon: Smartphone, title: "Social Media Design", description: "Engaging content that captures attention and drives engagement across platforms." },
  { icon: Image, title: "Poster & Banner", description: "Eye-catching visuals for print and digital campaigns that stand out." },
  { icon: Megaphone, title: "Marketing Creatives", description: "Conversion-focused advertising materials that drive results." },
];

const webServices = [
  { icon: Globe, title: "Website Design", description: "Beautiful, user-centered website experiences that represent your brand." },
  { icon: Layout, title: "UI/UX Design", description: "Intuitive interfaces that users love, based on research and best practices." },
  { icon: Code, title: "Web Development", description: "Fast, responsive, and scalable websites built with modern technologies." },
  { icon: FileText, title: "Landing Pages", description: "High-converting pages designed to capture leads and drive action." },
  { icon: Building, title: "Business Websites", description: "Professional sites for growing companies that need to make an impact." },
];

const ServicesPage = () => {
  return (
    <LayoutComponent>
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block"
            >
              Our Services
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-display font-bold mb-6"
            >
              What we <span className="gradient-text">offer</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              From stunning visuals to powerful web solutions, we provide everything 
              your brand needs to stand out in the digital world.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Graphic Design Services */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-12"
            >
              <span className="w-12 h-px bg-primary" />
              <h2 className="text-3xl font-display font-bold">Graphic Design</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {graphicServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <service.icon size={28} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Web Services */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-12"
            >
              <span className="w-12 h-px bg-primary" />
              <h2 className="text-3xl font-display font-bold">Web Solutions</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {webServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <service.icon size={28} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
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
              Ready to start your project?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Let's discuss how we can help bring your vision to life.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg hover:bg-primary/90 transition-all duration-300 box-glow"
            >
              Get Started <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </LayoutComponent>
  );
};

export default ServicesPage;
