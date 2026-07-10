import { useMemo } from "react";
import { useWorks, type Work } from "@/hooks/useWorks";

function isGraphics(w: Work) {
  const c = w.category;
  return c === "design" || c === "graphics" || c.startsWith("graphics_");
}

// Fallback aspect ratios for varied widths — keeps a thin, consistent row height
const ratios = ["aspect-[4/3]", "aspect-[1/1]", "aspect-[16/10]", "aspect-[3/4]", "aspect-[5/4]", "aspect-[3/2]"];

const Card = ({ item, idx }: { item: Work; idx: number }) => {
  const ratio = ratios[idx % ratios.length];
  return (
    <div className={`group relative shrink-0 h-full ${ratio} rounded-2xl overflow-hidden mx-2 border border-border/50 shadow-md bg-white`}>
      <img
        src={item.image_url || "/placeholder.svg"}
        alt={item.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
      />
      {item.category && (
        <div className="absolute top-3 left-3">
          <span className="text-[9px] uppercase tracking-[0.25em] text-white font-semibold px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
            {item.category.replace(/_/g, ' ')}
          </span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <h3 className="font-display text-sm md:text-base font-semibold text-white tracking-tight line-clamp-1">
          {item.title}
        </h3>
      </div>
    </div>
  );
};

export default function ProjectMarquee() {
  const { data: works } = useWorks();
  const items = useMemo(() => (works || []).filter(isGraphics), [works]);

  if (items.length === 0) return null;

  // Split into two rows
  const mid = Math.ceil(items.length / 2);
  const row1 = items.slice(0, mid);
  const row2 = items.slice(mid).concat(items.slice(0, Math.max(0, mid - (items.length - mid))));

  // Ensure enough items for smooth loop
  const dup1 = [...row1, ...row1, ...row1];
  const dup2 = [...row2, ...row2, ...row2];

  return (
    <section className="relative pt-4 pb-10 overflow-hidden bg-background">
      {/* Row 1 — thin, scrolls left */}
      <div className="relative h-[180px] md:h-[220px]">
        <div className="flex marquee-left w-max h-full items-center">
          {dup1.map((p, i) => <Card key={`r1-${p.id}-${i}`} item={p} idx={i} />)}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>

      {/* Row 2 — thin, scrolls right */}
      <div className="relative h-[180px] md:h-[220px] mt-4">
        <div className="flex marquee-right w-max h-full items-center">
          {dup2.map((p, i) => <Card key={`r2-${p.id}-${i}`} item={p} idx={i + 3} />)}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
