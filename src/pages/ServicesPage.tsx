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
  ArrowRight,
  Monitor,
  ShoppingCart,
  Search,
  Share2,
  PenTool,
  Globe,
  Code,
  Zap,
  CheckCircle,
  Video,
  TrendingUp,
  Target,
  BarChart3,
  Film,
  Clapperboard,
  Megaphone,
  Users,
  Laptop,
  FileSpreadsheet,
  Presentation,
  Database,
  Printer
} from "lucide-react";
import LayoutComponent from "@/components/Layout";

const allServices = [
  { 
    icon: Layout, 
    title: "UI/UX Design", 
    description: "Create intuitive, user-centered interfaces that delight users and drive conversions.",
    features: ["User Research", "Wireframing", "Prototyping", "User Testing"]
  },
  { 
    icon: Search, 
    title: "SEO Optimization", 
    description: "Boost your visibility and rank higher on search engines with data-driven strategies.",
    features: ["Keyword Research", "On-Page SEO", "Technical SEO", "Analytics"]
  },
  { 
    icon: Monitor, 
    title: "Website Design & Development", 
    description: "Build fast, responsive, and modern websites that represent your brand perfectly.",
    features: ["Custom Design", "Responsive Layout", "CMS Integration", "Performance"]
  },
  { 
    icon: ShoppingCart, 
    title: "E-commerce Website Design", 
    description: "Launch your online store with powerful, conversion-focused e-commerce solutions.",
    features: ["Product Catalog", "Payment Gateway", "Inventory System", "Analytics"]
  },
  { 
    icon: Share2, 
    title: "Social Media Design & Management", 
    description: "Create engaging content that builds community and drives brand awareness.",
    features: ["Content Strategy", "Post Design", "Story Templates", "Brand Guidelines"]
  },
  { 
    icon: PenTool, 
    title: "Branding & Creative Design", 
    description: "Develop memorable brand identities that stand out in the market.",
    features: ["Logo Design", "Brand Identity", "Style Guide", "Marketing Materials"]
  },
  { 
    icon: Video, 
    title: "Video Editing", 
    description: "Professional video editing services for promotional, social media, and corporate content.",
    features: ["Promotional Videos", "Social Media Reels", "Motion Graphics", "Color Grading"]
  },
  { 
    icon: TrendingUp, 
    title: "Digital Marketing", 
    description: "Grow your business with strategic digital marketing campaigns that drive results.",
    features: ["Social Media Ads", "Google Ads", "Email Marketing", "Content Marketing"]
  },
  { 
    icon: Laptop, 
    title: "Computer Operation", 
    description: "Expert computer operation services including MS Office, data entry, and document management.",
    features: ["MS Office Expert", "Data Entry", "Document Formatting", "Spreadsheet Management"]
  },
];

const computerServices = [
  { icon: FileSpreadsheet, title: "Microsoft Excel", description: "Advanced spreadsheets, formulas, and data analysis." },
  { icon: FileText, title: "Microsoft Word", description: "Professional document formatting and editing." },
  { icon: Presentation, title: "Microsoft PowerPoint", description: "Engaging presentations and slide designs." },
  { icon: Database, title: "Data Entry", description: "Fast and accurate data entry services." },
  { icon: Printer, title: "Document Processing", description: "Scanning, printing, and file management." },
  { icon: Laptop, title: "Computer Training", description: "Basic to advanced computer skills training." },
];

const graphicServices = [
  { icon: Palette, title: "Logo Design", description: "Memorable logos that define your brand identity." },
  { icon: Layers, title: "Brand Identity", description: "Complete visual systems including colors and typography." },
  { icon: Smartphone, title: "Social Media Design", description: "Engaging content across all platforms." },
  { icon: Image, title: "Banner & Poster Design", description: "Eye-catching visuals for campaigns." },
  { icon: FileText, title: "Print Design", description: "Business cards, brochures, and more." },
  { icon: MessageCircle, title: "Branding Consultation", description: "Expert guidance for your brand." },
];

const videoServices = [
  { icon: Film, title: "Promotional Videos", description: "Engaging promo videos for brands and products." },
  { icon: Clapperboard, title: "Social Media Reels", description: "Short-form content for Instagram & TikTok." },
  { icon: Video, title: "Motion Graphics", description: "Animated graphics and visual effects." },
  { icon: Zap, title: "Event Highlights", description: "Professional event coverage and highlight reels." },
];

const digitalMarketingServices = [
  { icon: Target, title: "Social Media Ads", description: "Targeted ads on Facebook, Instagram & more." },
  { icon: BarChart3, title: "Google Ads", description: "PPC campaigns that drive qualified traffic." },
  { icon: Megaphone, title: "Content Marketing", description: "Strategic content that engages audiences." },
  { icon: Users, title: "Lead Generation", description: "Convert visitors into paying customers." },
];

const ServicesPage = () => {
  return (
    <LayoutComponent>
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
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
              Full-Stack <span className="gradient-text">Creative</span> Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              From design to development, we provide comprehensive solutions to build 
              and grow your digital presence.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-display font-bold mb-4">What We Offer</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Agency-level services designed to take your brand from zero to impact
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle size={14} className="text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Graphic Design Services */}
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
              <h2 className="text-3xl font-display font-bold">Graphic Design Services</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {graphicServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-start gap-4 p-6 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold mb-1">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Editing Services */}
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
              <h2 className="text-3xl font-display font-bold">Video Editing Services</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videoServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold mb-1">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Digital Marketing Services */}
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
              <h2 className="text-3xl font-display font-bold">Digital Marketing Services</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {digitalMarketingServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-start gap-4 p-6 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold mb-1">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Computer Operation Services */}
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
              <h2 className="text-3xl font-display font-bold">Computer Operation Services</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {computerServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold mb-1">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
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
                { step: "01", title: "Discover", description: "Understanding your brand, goals, and vision", icon: Search },
                { step: "02", title: "Design", description: "Creating concepts and visual solutions", icon: PenTool },
                { step: "03", title: "Develop", description: "Building with precision and care", icon: Code },
                { step: "04", title: "Deliver", description: "Final files and ongoing support", icon: Zap },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon size={24} className="text-primary" />
                  </div>
                  <div className="text-3xl font-display font-bold gradient-text mb-2">{item.step}</div>
                  <h3 className="text-xl font-display font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
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
              Ready to start your project?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Let's discuss how we can help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                Get a Free Consultation <ArrowRight size={20} />
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
    </LayoutComponent>
  );
};

export default ServicesPage;
