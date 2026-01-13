import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles, MessageSquare, Rocket, DollarSign, Brain } from "lucide-react";

const reasons = [
  {
    icon: Sparkles,
    title: "Clean & Modern Design",
    description: "We create visually stunning designs that are both beautiful and functional.",
  },
  {
    icon: Brain,
    title: "Brand-Focused Thinking",
    description: "Every decision is made with your brand's identity and goals in mind.",
  },
  {
    icon: DollarSign,
    title: "Affordable Solutions",
    description: "Premium quality without the premium price tag. Scalable to your budget.",
  },
  {
    icon: MessageSquare,
    title: "Strong Communication",
    description: "We keep you in the loop at every step of the project journey.",
  },
  {
    icon: Rocket,
    title: "Zero-to-Alpha Mindset",
    description: "From concept to completion, we build powerful solutions from scratch.",
  },
];

const WhyChooseUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div ref={ref} className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Why AlphaZero
            </span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Why <span className="gradient-text">Choose Us</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We don't just deliver projects — we build lasting digital identities 
              that help your brand grow.
            </p>
          </motion.div>

          {/* Reasons Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 gradient-border"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <reason.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3">{reason.title}</h3>
                  <p className="text-muted-foreground">{reason.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-xl text-muted-foreground mb-6">
              Ready to transform your ideas into reality?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg hover:bg-primary/90 transition-all duration-300 box-glow"
            >
              <Check size={20} />
              Let's Work Together
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
