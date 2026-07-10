const row1 = [
  { name: "THE GRIDLINE", tag: "Furniture", accent: "from-amber-500/20 to-orange-500/10", size: "lg" },
  { name: "Steve Krug", tag: "Editorial", accent: "from-rose-500/20 to-red-500/10", size: "sm" },
  { name: "Foter", tag: "Mobile App", accent: "from-sky-500/20 to-blue-500/10", size: "md" },
  { name: "OH! MY Coffee", tag: "Café Brand", accent: "from-amber-500/20 to-yellow-500/10", size: "xl" },
  { name: "NÓRAE", tag: "Skincare", accent: "from-rose-500/20 to-pink-500/10", size: "sm" },
  { name: "Triply", tag: "Travel SaaS", accent: "from-cyan-500/20 to-teal-500/10", size: "md" },
];

const row2 = [
  { name: "Affine Risk", tag: "FinTech", accent: "from-emerald-500/20 to-green-500/10", size: "md" },
  { name: "যান্ত্রিক", tag: "Auto App", accent: "from-neutral-500/20 to-zinc-500/10", size: "xl" },
  { name: "THE GREAT GOLF CLUB", tag: "Sports", accent: "from-emerald-500/20 to-lime-500/10", size: "sm" },
  { name: "Alpine Empower", tag: "Banking", accent: "from-indigo-500/20 to-violet-500/10", size: "lg" },
  { name: "VENEX", tag: "Energy", accent: "from-sky-500/20 to-blue-500/10", size: "sm" },
  { name: "ZINNGO", tag: "Retail", accent: "from-orange-500/20 to-amber-500/10", size: "md" },
];

const sizeMap: Record<string, string> = {
  sm: "w-[200px] md:w-[240px] aspect-[4/3]",
  md: "w-[280px] md:w-[340px] aspect-[4/3]",
  lg: "w-[360px] md:w-[440px] aspect-[16/10]",
  xl: "w-[440px] md:w-[560px] aspect-[16/9]",
};

const Card = ({ name, tag, accent, size }: { name: string; tag: string; accent: string; size: string }) => (
  <div className={`group relative shrink-0 ${sizeMap[size]} rounded-3xl overflow-hidden mx-3 border border-border/60 shadow-lg bg-white dark:bg-white`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.04),transparent_60%)]" />
    <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
      <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 font-medium px-2 py-1 rounded-full bg-neutral-100 border border-neutral-200">
        {tag}
      </span>
    </div>
    <div className="absolute bottom-5 left-5 right-5">
      <h3 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
        {name}
      </h3>
    </div>
  </div>
);


export default function ProjectMarquee() {
  return (
    <section className="relative pt-4 pb-10 overflow-hidden bg-background">
      {/* Row 1 — scrolls left */}
      <div className="relative">
        <div className="flex marquee-left w-max items-center">
          {[...row1, ...row1].map((p, i) => <Card key={`r1-${i}`} {...p} />)}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative mt-6">
        <div className="flex marquee-right w-max items-center">
          {[...row2, ...row2].map((p, i) => <Card key={`r2-${i}`} {...p} />)}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
