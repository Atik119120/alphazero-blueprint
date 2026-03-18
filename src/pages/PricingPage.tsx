import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Palette, Shield, ChevronUp } from "lucide-react";
import LayoutComponent from "@/components/Layout";
import { webPricing, graphicPricing, domainPricing, servicePolicies } from "@/data/pricing";
import type { PricingItem, MonthlyPackage } from "@/data/pricing";

const formatPrice = (price: number) => `৳ ${price.toLocaleString("en-IN")}`;

const PriceCard = ({ item, accent = "blue" }: { item: PricingItem; accent?: "blue" | "gold" }) => {
  const accentColor = accent === "blue" ? "text-sky-400" : "text-amber-400";
  const borderGlow = accent === "blue" ? "hover:border-sky-500/40 hover:shadow-[0_0_30px_-8px_rgba(111,163,255,0.15)]" : "hover:border-amber-500/40 hover:shadow-[0_0_30px_-8px_rgba(212,168,67,0.15)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={`relative p-5 lg:p-6 rounded-[14px] border border-[#252528] bg-[#131316] transition-all duration-300 ${borderGlow}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{item.icon}</span>
      </div>
      <h3 className="text-base lg:text-lg font-display font-bold text-[#f0ece4] mb-1">{item.name}</h3>
      <p className="text-xs text-[#f0ece4]/50 mb-4">{item.description}</p>
      <div className="flex items-baseline gap-2 mb-4">
        <span className={`text-2xl lg:text-3xl font-bold ${accentColor}`}>{formatPrice(item.discountedPrice)}</span>
        <span className="text-sm text-[#f0ece4]/30 line-through">{formatPrice(item.originalPrice)}</span>
      </div>
      <ul className="space-y-2">
        {item.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-[#f0ece4]/60">
            <span className="mt-0.5 w-1 h-1 rounded-full bg-current shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const MonthlyCard = ({ pkg, index }: { pkg: MonthlyPackage; index: number }) => {
  const isPopular = index === 2;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className={`relative p-5 lg:p-6 rounded-[14px] border transition-all duration-300 ${
        isPopular
          ? "border-amber-500/50 bg-gradient-to-b from-amber-500/[0.08] to-[#131316] shadow-[0_0_40px_-12px_rgba(212,168,67,0.2)]"
          : "border-[#252528] bg-[#131316] hover:border-amber-500/30 hover:shadow-[0_0_30px_-8px_rgba(212,168,67,0.1)]"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider rounded-full">
          Most Popular
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/[0.08]">
          {pkg.badge}
        </span>
      </div>
      <h3 className="text-xl font-display font-bold text-[#f0ece4]">{pkg.name}</h3>
      <p className="text-xs text-[#f0ece4]/40 mb-3">{pkg.tagline}</p>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl lg:text-3xl font-bold text-amber-400">{formatPrice(pkg.discountedPrice)}</span>
        <span className="text-sm text-[#f0ece4]/30 line-through">{formatPrice(pkg.originalPrice)}</span>
      </div>
      <p className="text-xs text-amber-400/60 mb-4">{pkg.designsPerMonth} designs/month</p>
      <ul className="space-y-2">
        {pkg.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-[#f0ece4]/60">
            <span className="mt-0.5 w-1 h-1 rounded-full bg-amber-400/60 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const StickyNav = ({ activeSection }: { activeSection: string }) => {
  const sections = [
    { id: "web", label: "🌐 Web Design", icon: Globe },
    { id: "graphic", label: "🎨 Graphic Design", icon: Palette },
    { id: "policy", label: "🛡️ Policy", icon: Shield },
  ];

  return (
    <div className="sticky top-16 z-40 py-3 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-[#252528]/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeSection === s.id
                  ? "bg-primary text-primary-foreground"
                  : "text-[#f0ece4]/50 hover:text-[#f0ece4] hover:bg-[#252528]/50"
              }`}
            >
              {s.label}
            </a>
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

  // Handle hash scroll on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

  return (
    <LayoutComponent>
      <div className="bg-[#0a0a0c] min-h-screen text-[#f0ece4]">
        {/* Hero */}
        <section className="pt-28 pb-12 lg:pt-40 lg:pb-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-sky-500/[0.04] rounded-full blur-[120px]" />
            <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-500/[0.04] rounded-full blur-[120px]" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] text-xs font-bold tracking-[0.2em] uppercase text-primary mb-6">
                Transparent Pricing
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold mb-4 leading-tight"
            >
              Simple, Honest <span className="bg-gradient-to-r from-sky-400 to-amber-400 bg-clip-text text-transparent">Pricing</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-[#f0ece4]/50 max-w-xl mx-auto"
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
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="text-sky-400" size={24} />
                  <h2 className="text-2xl lg:text-4xl font-display font-bold">Web Design</h2>
                </div>
                <p className="text-[#f0ece4]/40 max-w-lg">Professional websites built with modern technologies</p>
              </motion.div>

              {/* WordPress */}
              <div className="mb-14">
                <h3 className="text-lg font-display font-semibold text-sky-400 mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-sky-400/30" /> WordPress Websites
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {webPricing.wordpress.map((item) => (
                    <PriceCard key={item.id} item={item} accent="blue" />
                  ))}
                </div>
              </div>

              {/* Custom Code */}
              <div className="mb-14">
                <h3 className="text-lg font-display font-semibold text-sky-400 mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-sky-400/30" /> Custom Coded Websites
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {webPricing.customCode.map((item) => (
                    <PriceCard key={item.id} item={item} accent="blue" />
                  ))}
                </div>
              </div>

              {/* Storage Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14"
              >
                <div className="p-5 rounded-[14px] border border-sky-500/20 bg-sky-500/[0.04]">
                  <h4 className="font-display font-semibold text-sky-400 mb-2">🚀 Custom Code</h4>
                  <p className="text-xs text-[#f0ece4]/50">
                    Free storage included — Vercel hosting + Cloudflare R2 (25 GB) + Supabase (5 GB backend)
                  </p>
                </div>
                <div className="p-5 rounded-[14px] border border-amber-500/20 bg-amber-500/[0.04]">
                  <h4 className="font-display font-semibold text-amber-400 mb-2">📦 WordPress</h4>
                  <p className="text-xs text-[#f0ece4]/50">
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
                <h3 className="text-lg font-display font-semibold text-[#f0ece4]/80 mb-4">🌐 Domain Pricing</h3>
                <div className="rounded-[14px] border border-[#252528] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#252528] bg-[#131316]">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#f0ece4]/50 uppercase tracking-wider">Domain</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#f0ece4]/50 uppercase tracking-wider">Condition</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#f0ece4]/50 uppercase tracking-wider">Charge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domainPricing.map((row, i) => (
                        <tr key={i} className="border-b border-[#252528]/50 last:border-0">
                          <td className="py-3 px-4 font-medium text-[#f0ece4]/80">{row.domain}</td>
                          <td className="py-3 px-4 text-[#f0ece4]/50">{row.condition}</td>
                          <td className={`py-3 px-4 font-semibold ${row.isFree ? "text-emerald-400" : "text-[#f0ece4]/60"}`}>
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
        <section id="graphic" className="py-16 lg:py-24 border-t border-[#252528]/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                  <Palette className="text-amber-400" size={24} />
                  <h2 className="text-2xl lg:text-4xl font-display font-bold">Graphic Design</h2>
                </div>
                <p className="text-[#f0ece4]/40 max-w-lg">Creative designs that make your brand stand out</p>
              </motion.div>

              {/* One-time services */}
              <div className="mb-14">
                <h3 className="text-lg font-display font-semibold text-amber-400 mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-amber-400/30" /> One-Time Services
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {graphicPricing.oneTime.map((item) => (
                    <PriceCard key={item.id} item={item} accent="gold" />
                  ))}
                </div>
              </div>

              {/* Monthly Packages */}
              <div>
                <h3 className="text-lg font-display font-semibold text-amber-400 mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-amber-400/30" /> Monthly Packages
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {graphicPricing.monthly.map((pkg, i) => (
                    <MonthlyCard key={pkg.id} pkg={pkg} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ POLICY SECTION ═══ */}
        <section id="policy" className="py-16 lg:py-24 border-t border-[#252528]/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="text-emerald-400" size={24} />
                  <h2 className="text-2xl lg:text-4xl font-display font-bold">Service Policy</h2>
                </div>
                <p className="text-[#f0ece4]/40 max-w-lg">Applies to all web design & graphic design services</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {servicePolicies.map((policy, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="p-5 lg:p-6 rounded-[14px] border border-[#252528] bg-[#131316] hover:border-emerald-500/30 transition-all duration-300"
                  >
                    <span className="text-2xl mb-3 block">{policy.icon}</span>
                    <h3 className="text-base font-display font-bold text-[#f0ece4] mb-2">{policy.title}</h3>
                    <p className="text-xs text-[#f0ece4]/50 leading-relaxed">{policy.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 border-t border-[#252528]/50">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl lg:text-4xl font-display font-bold mb-4">Ready to get started?</h2>
              <p className="text-[#f0ece4]/40 mb-8 max-w-md mx-auto">
                Contact us today and let's discuss your project requirements
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold transition-all duration-300 hover:scale-[1.02]"
                >
                  Start Your Project <ArrowRight size={18} />
                </Link>
                <a
                  href="https://wa.me/8801712345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#252528] text-[#f0ece4] rounded-full font-semibold hover:border-primary/30 transition-all duration-300"
                >
                  WhatsApp Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 z-40 w-10 h-10 rounded-full bg-[#131316] border border-[#252528] flex items-center justify-center text-[#f0ece4]/50 hover:text-primary hover:border-primary/30 transition-all"
        >
          <ChevronUp size={18} />
        </button>
      </div>
    </LayoutComponent>
  );
};

export default PricingPage;
