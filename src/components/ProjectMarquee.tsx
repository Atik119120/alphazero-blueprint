import { useLanguage } from "@/contexts/LanguageContext";

const row1 = [
  { name: "THE GRIDLINE", tag: "Furniture", gradient: "from-amber-900/80 via-amber-700/60 to-stone-800/80" },
  { name: "Steve Krug", tag: "Editorial", gradient: "from-rose-900/70 via-red-800/60 to-neutral-900/80" },
  { name: "Foter", tag: "Mobile App", gradient: "from-stone-800/80 via-amber-900/60 to-stone-900/80" },
  { name: "OH! MY Coffee", tag: "Café Brand", gradient: "from-amber-800/70 via-yellow-900/60 to-stone-900/80" },
  { name: "NÓRAE", tag: "Skincare", gradient: "from-rose-950/80 via-red-900/70 to-neutral-900/90" },
  { name: "Triply", tag: "Travel SaaS", gradient: "from-sky-800/70 via-cyan-700/60 to-blue-900/80" },
];

const row2 = [
  { name: "Affine Risk", tag: "FinTech", gradient: "from-emerald-900/80 via-green-800/60 to-neutral-900/80" },
  { name: "যান্ত্রিক", tag: "Auto App", gradient: "from-neutral-800/80 via-zinc-700/60 to-stone-900/80" },
  { name: "THE GREAT GOLF CLUB", tag: "Sports", gradient: "from-emerald-800/80 via-green-900/70 to-neutral-900/90" },
  { name: "Alpine Empower", tag: "Banking", gradient: "from-indigo-900/80 via-purple-800/60 to-violet-950/80" },
  { name: "VENEX", tag: "Energy", gradient: "from-sky-900/70 via-blue-800/60 to-slate-900/80" },
  { name: "ZINNGO", tag: "Retail", gradient: "from-orange-800/70 via-amber-900/60 to-red-950/80" },
];

const Card = ({ name, tag, gradient }: { name: string; tag: string; gradient: string }) => (
  <div className="group relative shrink-0 w-[280px] md:w-[360px] lg:w-[420px] aspect-[4/3] rounded-3xl overflow-hidden mx-3 border border-border/40 shadow-xl">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_60%)]" />
    <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='60' height='60' filter='url(%23n)'/%3E%3C/svg%3E\")"
    }} />
    <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
      <span className="text-[10px] uppercase tracking-[0.25em] text-white/70 font-medium px-2 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
        {tag}
      </span>
    </div>
    <div className="absolute bottom-5 left-5 right-5">
      <h3 className="font-display text-2xl md:text-3xl font-bold text-white drop-shadow-lg tracking-tight">
        {name}
      </h3>
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
  </div>
);

export default function ProjectMarquee() {
  const { t } = useLanguage();
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-background">
      <div className="container mx-auto px-6 mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-4">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">
            {t("home.marquee.badge") || "Our Work"}
          </span>
        </div>
        <h2 className="text-3xl lg:text-5xl font-display font-bold">
          {t("home.marquee.title") || "Crafted with"} <span className="gradient-text">{t("home.marquee.gradient") || "conviction"}</span>
        </h2>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative">
        <div className="flex marquee-left w-max">
          {[...row1, ...row1].map((p, i) => <Card key={`r1-${i}`} {...p} />)}
        </div>
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative mt-6">
        <div className="flex marquee-right w-max">
          {[...row2, ...row2].map((p, i) => <Card key={`r2-${i}`} {...p} />)}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
