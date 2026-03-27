import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Palette, Shield, ChevronUp, Check, Wallet, Loader2 } from "lucide-react";
import LayoutComponent from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { webPricing, graphicPricing, domainPricing, servicePolicies } from "@/data/pricing";
import type { PricingItem, MonthlyPackage } from "@/data/pricing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formatPrice = (price: number) => `৳ ${price.toLocaleString("en-IN")}`;

const handleUddoktaPayOrder = async (itemName: string, price: number, setLoading: (v: boolean) => void) => {
  setLoading(true);
  try {
    const baseUrl = window.location.origin;
    const { data, error } = await supabase.functions.invoke('uddoktapay-checkout', {
      body: {
        full_name: 'Customer',
        email: 'customer@order.com',
        amount: price,
        metadata: {
          type: 'service',
          item_name: itemName,
          price: price.toString(),
        },
        redirect_url: `${baseUrl}/payment/callback?type=service`,
        cancel_url: `${baseUrl}/pricing`,
      },
    });

    if (error || !data?.success || !data?.payment_url) {
      toast.error('পেমেন্ট গেটওয়ে এরর। WhatsApp-এ যোগাযোগ করুন।');
      setLoading(false);
      return;
    }

    window.location.href = data.payment_url;
  } catch (err) {
    console.error('Order checkout error:', err);
    toast.error('পেমেন্ট শুরু করতে ব্যর্থ।');
    setLoading(false);
  }
};

const PriceCard = ({ item, accent = "blue", index }: { item: PricingItem; accent?: "blue" | "gold"; index: number }) => {
  const [ordering, setOrdering] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="group relative p-5 lg:p-7 rounded-2xl glass-card hover:border-primary/30 transition-all duration-400 overflow-hidden"
    >
      {/* Index number */}
      <span className="absolute top-4 right-4 text-[10px] font-mono font-bold text-muted-foreground/20 tracking-wider">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="flex items-start gap-3 mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl border ${
          accent === "blue" 
            ? "bg-primary/[0.08] border-primary/10" 
            : "bg-amber-500/[0.08] border-amber-500/10"
        }`}>
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm lg:text-base font-display font-bold mb-0.5">{item.name}</h3>
          <p className="text-xs text-muted-foreground/60 leading-snug">{item.description}</p>
        </div>
      </div>

      <div className="flex items-baseline gap-2.5 mb-5 pl-0.5">
        <span className={`text-2xl lg:text-3xl font-bold ${accent === "blue" ? "text-primary" : "text-amber-400"}`}>
          {formatPrice(item.discountedPrice)}
        </span>
        <span className="text-sm text-muted-foreground/30 line-through">{formatPrice(item.originalPrice)}</span>
      </div>

      <ul className="space-y-2">
        {item.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground/70">
            <Check size={12} className={`mt-0.5 shrink-0 ${accent === "blue" ? "text-primary/60" : "text-amber-400/60"}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* Order Button */}
      <Button
        onClick={() => handleUddoktaPayOrder(item.name, item.discountedPrice, setOrdering)}
        disabled={ordering}
        size="sm"
        className={`w-full mt-5 rounded-xl font-semibold ${
          accent === "blue" 
            ? "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20" 
            : "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white border border-amber-500/20"
        } transition-all duration-300`}
        variant="ghost"
      >
        {ordering ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Wallet className="w-4 h-4 mr-1" />}
        {ordering ? 'Processing...' : 'Order Now'}
      </Button>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent ${
        accent === "blue" ? "via-primary/20" : "via-amber-400/20"
      } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />
    </motion.div>
  );
};

const MonthlyCard = ({ pkg, index }: { pkg: MonthlyPackage; index: number }) => {
  const isPopular = index === 2;
  const [ordering, setOrdering] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className={`group relative p-5 lg:p-7 rounded-2xl transition-all duration-400 overflow-hidden ${
        isPopular
          ? "glass-card border-primary/40 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.15)]"
          : "glass-card hover:border-primary/30"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-b-lg">
          Most Popular
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-3 mt-1">
        <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/[0.06]">
          {pkg.badge}
        </span>
        <span className="text-[10px] text-muted-foreground/40">{pkg.designsPerMonth} designs/mo</span>
      </div>
      
      <h3 className="text-lg lg:text-xl font-display font-bold mb-1">{pkg.name}</h3>
      <p className="text-xs text-muted-foreground/50 mb-4">{pkg.tagline}</p>
      
      <div className="flex items-baseline gap-2 mb-5">
        <span className="text-2xl lg:text-3xl font-bold text-amber-400">{formatPrice(pkg.discountedPrice)}</span>
        <span className="text-xs text-muted-foreground/30 line-through">{formatPrice(pkg.originalPrice)}</span>
        <span className="text-xs text-muted-foreground/40">/mo</span>
      </div>
      
      <ul className="space-y-2">
        {pkg.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground/70">
            <Check size={12} className="mt-0.5 shrink-0 text-amber-400/60" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* Order Button */}
      <Button
        onClick={() => handleUddoktaPayOrder(`${pkg.name} (Monthly)`, pkg.discountedPrice, setOrdering)}
        disabled={ordering}
        size="sm"
        className="w-full mt-5 rounded-xl font-semibold bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white border border-amber-500/20 transition-all duration-300"
        variant="ghost"
      >
        {ordering ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Wallet className="w-4 h-4 mr-1" />}
        {ordering ? 'Processing...' : 'Order Now'}
      </Button>

      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
    </motion.div>
  );
};

const StickyNav = ({ activeSection }: { activeSection: string }) => {
  const sections = [
    { id: "web", label: "🌐 Web Design" },
    { id: "graphic", label: "🎨 Graphic Design" },
    { id: "policy", label: "🛡️ Policy" },
  ];

  return (
    <div className="sticky top-16 z-40 py-3 bg-background/80 dark:bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-1.5 sm:gap-3">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
              className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeSection === s.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PricingPage = () => {
  const [activeSection, setActiveSection] = useState("web");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    ["web", "graphic", "policy"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  }, []);

  return (
    <LayoutComponent>
      {/* Hero */}
      <section className="pt-28 pb-12 lg:pt-40 lg:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/[0.06] backdrop-blur-sm text-xs font-bold tracking-[0.2em] uppercase text-primary mb-6">
              Transparent Pricing
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold mb-4 leading-tight"
          >
            Simple, Honest <span className="gradient-text">Pricing</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Quality design & development at prices that make sense for your business
          </motion.p>
        </div>
      </section>

      <StickyNav activeSection={activeSection} />

      {/* ═══ WEB DESIGN SECTION ═══ */}
      <section id="web" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-4">
                <Globe size={14} className="text-primary" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Web Design</span>
              </div>
              <h2 className="text-2xl lg:text-4xl font-display font-bold">Professional Websites</h2>
              <p className="text-muted-foreground max-w-lg mt-2">Built with modern technologies for speed and reliability</p>
            </motion.div>

            {/* WordPress */}
            <div className="mb-14">
              <h3 className="text-base font-display font-semibold text-primary mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-primary/30" />
                WordPress Websites
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {webPricing.wordpress.map((item, i) => (
                  <PriceCard key={item.id} item={item} accent="blue" index={i} />
                ))}
              </div>
            </div>

            {/* Custom Code */}
            <div className="mb-14">
              <h3 className="text-base font-display font-semibold text-primary mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-primary/30" />
                Custom Coded Websites
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {webPricing.customCode.map((item, i) => (
                  <PriceCard key={item.id} item={item} accent="blue" index={i} />
                ))}
              </div>
            </div>

            {/* Storage Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mb-14"
            >
              <div className="p-5 lg:p-6 rounded-2xl glass-card border-primary/20">
                <h4 className="font-display font-semibold text-primary mb-2 flex items-center gap-2">🚀 Custom Code</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Free storage included — Vercel hosting + Cloudflare R2 (25 GB) + Supabase (5 GB backend)
                </p>
              </div>
              <div className="p-5 lg:p-6 rounded-2xl glass-card border-amber-500/20">
                <h4 className="font-display font-semibold text-amber-400 mb-2 flex items-center gap-2">📦 WordPress</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Client bears their own hosting/storage costs. We help set up and configure.
                </p>
              </div>
            </motion.div>

            {/* Domain Policy Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-base font-display font-semibold mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-primary/30" />
                🌐 Domain Pricing
              </h3>
              <div className="rounded-2xl glass-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left py-3.5 px-5 text-xs font-bold text-muted-foreground/50 uppercase tracking-wider">Domain</th>
                      <th className="text-left py-3.5 px-5 text-xs font-bold text-muted-foreground/50 uppercase tracking-wider">Condition</th>
                      <th className="text-left py-3.5 px-5 text-xs font-bold text-muted-foreground/50 uppercase tracking-wider">Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domainPricing.map((row, i) => (
                      <tr key={i} className="border-b border-border/20 last:border-0">
                        <td className="py-3 px-5 font-medium">{row.domain}</td>
                        <td className="py-3 px-5 text-muted-foreground">{row.condition}</td>
                        <td className={`py-3 px-5 font-semibold ${row.isFree ? "text-emerald-400" : "text-muted-foreground/60"}`}>
                          {row.charge}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ GRAPHIC DESIGN SECTION ═══ */}
      <section id="graphic" className="py-16 lg:py-24 relative mesh-bg">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/[0.06] mb-4">
                <Palette size={14} className="text-amber-400" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400">Graphic Design</span>
              </div>
              <h2 className="text-2xl lg:text-4xl font-display font-bold">Creative Design Services</h2>
              <p className="text-muted-foreground max-w-lg mt-2">Make your brand stand out with professional designs</p>
            </motion.div>

            {/* One-time */}
            <div className="mb-14">
              <h3 className="text-base font-display font-semibold text-amber-400 mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-amber-400/30" />
                One-Time Services
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {graphicPricing.oneTime.map((item, i) => (
                  <PriceCard key={item.id} item={item} accent="gold" index={i} />
                ))}
              </div>
            </div>

            {/* Monthly */}
            <div>
              <h3 className="text-base font-display font-semibold text-amber-400 mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-amber-400/30" />
                Monthly Packages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {graphicPricing.monthly.map((pkg, i) => (
                  <MonthlyCard key={pkg.id} pkg={pkg} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ POLICY SECTION ═══ */}
      <section id="policy" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] mb-4">
                <Shield size={14} className="text-emerald-400" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-400">Service Policy</span>
              </div>
              <h2 className="text-2xl lg:text-4xl font-display font-bold">Our Commitment</h2>
              <p className="text-muted-foreground max-w-lg mt-2">Applies to all web design & graphic design services</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {servicePolicies.map((policy, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group p-5 lg:p-7 rounded-2xl glass-card hover:border-emerald-500/20 transition-all duration-400 relative overflow-hidden"
                >
                  <span className="absolute top-4 right-4 text-[10px] font-mono font-bold text-muted-foreground/20 tracking-wider">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-2xl mb-4 block">{policy.icon}</span>
                  <h3 className="text-sm lg:text-base font-display font-bold mb-2">{policy.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{policy.description}</p>
                  <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl lg:text-4xl font-display font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
              Contact us today and let's discuss your project
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg transition-all duration-300 glow-primary hover:scale-[1.02]"
              >
                Start Your Project <ArrowRight size={20} />
              </Link>
              <a
                href="https://wa.me/8801712345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 border-2 border-border text-foreground rounded-full font-semibold text-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
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

export default PricingPage;
