import { motion } from "framer-motion";
import { Globe, Zap, Target, CheckCircle, Palette, Eye, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const values = [
  {
    icon: Target,
    title: "Brand-Focused",
    description: "Every design decision serves your brand's unique identity and goals.",
  },
  {
    icon: Zap,
    title: "Zero to Impact",
    description: "We start from scratch and build powerful, impactful visual identities.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Based in Bangladesh, delivering design solutions worldwide.",
  },
];

const whyChoose = [
  "Clean and modern design approach",
  "Brand-focused visual strategy",
  "Detail-oriented workflow",
  "Client-first communication",
  "From zero to full identity support",
];

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-glow-secondary/10 rounded-full blur-[120px]"
          animate={{ 
            x: [0, 30, 0]
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
              About Us
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-display font-bold mb-6"
            >
              We are <span className="gradient-text">AlphaZero</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              A creative agency focused on graphic design, branding, and visual identity. 
              We help brands start from scratch and grow with clean, modern, and impactful design solutions.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
                Our Story
              </h2>
              <p className="text-muted-foreground mb-6">
                AlphaZero is a creative agency focused on graphic design, branding, and visual identity. 
                We believe every great brand starts from zero — and with the right vision and execution, 
                it can make a lasting impact.
              </p>
              <p className="text-muted-foreground mb-6">
                Currently, AlphaZero delivers professional design services while evolving toward IT and 
                AI-driven digital services. Our goal is to turn ideas into strong visual experiences 
                that actually work.
              </p>
              <div className="space-y-3">
                {whyChoose.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-glow-secondary/20 p-8 flex items-center justify-center border border-primary/10">
                <div className="text-center">
                  <motion.div 
                    className="text-8xl font-display font-bold gradient-text mb-4"
                    animate={{ 
                      textShadow: [
                        "0 0 20px hsl(185 100% 50% / 0.3)",
                        "0 0 40px hsl(185 100% 50% / 0.5)",
                        "0 0 20px hsl(185 100% 50% / 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    α0
                  </motion.div>
                  <p className="text-primary text-lg font-medium">From Zero to Impact</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 relative overflow-hidden">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
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
                Our Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <value.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Globe size={48} className="text-primary mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Based in Bangladesh
            </h2>
            <p className="text-xl text-muted-foreground mb-2">
              Bornali, Rajshahi, Bangladesh – 6000
            </p>
            <p className="text-muted-foreground mb-8">
              Working with clients worldwide, delivering impactful design solutions remotely.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg hover:bg-primary/90 transition-all duration-300 box-glow"
            >
              Let's Connect
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
