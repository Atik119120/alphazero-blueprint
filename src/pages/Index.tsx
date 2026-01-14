import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle, Palette, Eye, Target, MessageSquare, Gem } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const whyChooseUs = [
  { icon: Palette, title: "Clean & Modern Design", description: "Fresh, contemporary aesthetics that stand out" },
  { icon: Eye, title: "Brand-Focused Strategy", description: "Every design serves your brand's unique vision" },
  { icon: Target, title: "Detail-Oriented", description: "Pixel-perfect execution on every project" },
  { icon: MessageSquare, title: "Client-First Communication", description: "Clear, responsive, and collaborative process" },
  { icon: Gem, title: "Zero to Full Identity", description: "Complete brand solutions from scratch" },
];

const Index = () => {
  return (
    <Layout>
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
        {/* Background Effects - Enhanced */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-glow-secondary/15 rounded-full blur-[120px]"
            animate={{ 
              scale: [1, 1.15, 1],
              x: [0, 30, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div 
            className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]"
            animate={{ 
              y: [0, -40, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-primary/20 mb-8 backdrop-blur-sm"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-sm text-foreground">Creative Graphic Design Agency</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight mb-6"
            >
              Starting every idea from{" "}
              <span className="gradient-text text-glow">zero</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-primary mb-8"
            >
              From zero to impact
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12"
            >
              A creative agency focused on graphic design, branding, and visual identity. 
              We help brands start from scratch and grow with clean, modern, and impactful design solutions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/contact"
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg hover:bg-primary/90 transition-all duration-300 box-glow flex items-center gap-2"
              >
                Start Your Project
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/work"
                className="px-8 py-4 bg-transparent border border-border text-foreground rounded-lg font-medium text-lg hover:bg-secondary hover:border-primary/30 transition-all duration-300"
              >
                View Our Work
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-primary rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: "50+", label: "Projects Delivered" },
              { value: "30+", label: "Happy Clients" },
              { value: "3+", label: "Years Experience" },
              { value: "100%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Why Choose AlphaZero
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Built for <span className="gradient-text">your success</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-card/80 border border-border hover:border-primary/30 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">
              Let's build your <span className="gradient-text">brand</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Ready to transform your ideas into powerful visual experiences?
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-primary-foreground rounded-xl font-medium text-lg hover:bg-primary/90 transition-all duration-300 box-glow"
            >
              Get a Free Consultation <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
