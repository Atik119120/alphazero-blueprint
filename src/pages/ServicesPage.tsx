import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Palette, 
  Layers, 
  Smartphone, 
  Image, 
  FileText,
  Layout,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import LayoutComponent from "@/components/Layout";

const graphicServices = [
  { icon: Palette, title: "Logo Design", description: "Memorable logos that define your brand identity and leave a lasting impression." },
  { icon: Layers, title: "Brand Identity", description: "Complete visual systems including colors, typography, and brand guidelines." },
  { icon: Smartphone, title: "Social Media Design", description: "Engaging content that captures attention and drives engagement across platforms." },
  { icon: Image, title: "Banner & Poster Design", description: "Eye-catching visuals for print and digital campaigns that stand out." },
  { icon: FileText, title: "Print Design", description: "Business cards, brochures, and marketing materials that make an impact." },
  { icon: Layout, title: "UI Design (Basic)", description: "Clean and intuitive interface designs for your digital products." },
  { icon: MessageCircle, title: "Branding Consultation", description: "Expert guidance to develop and refine your brand strategy." },
];

const ServicesPage = () => {
  return (
    <LayoutComponent>
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-glow-secondary/10 rounded-full blur-[120px]"
          animate={{ 
            x: [0, -30, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
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
              Professional graphic design and branding services to help your brand 
              stand out with clean, modern, and impactful visuals.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Graphic Design Services */}
      <section className="py-20 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="container mx-auto px-6 relative z-10">
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

      {/* Process Section */}
      <section className="py-20 relative overflow-hidden">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]"
          animate={{ 
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
                Our Process
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A simple, effective approach to deliver impactful results
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Discover", description: "Understanding your brand, goals, and vision" },
                { step: "02", title: "Design", description: "Creating concepts and visual solutions" },
                { step: "03", title: "Refine", description: "Iterating based on your feedback" },
                { step: "04", title: "Deliver", description: "Final files and brand assets" },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="text-4xl font-display font-bold gradient-text mb-4">{item.step}</div>
                  <h3 className="text-xl font-display font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/30 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
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
              Get a Free Consultation <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </LayoutComponent>
  );
};

export default ServicesPage;
