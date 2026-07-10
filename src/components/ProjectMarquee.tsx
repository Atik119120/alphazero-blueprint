import { useMemo } from "react";
import { useWorks, type Work } from "@/hooks/useWorks";

import badam from "@/assets/marquee/badam.jpg.asset.json";
import coconut from "@/assets/marquee/coconuct.jpg.asset.json";
import noodles from "@/assets/marquee/creativity-to-create.png.asset.json";
import ghee from "@/assets/marquee/GHEE.jpg.asset.json";
import khejur from "@/assets/marquee/khejur.jpg.asset.json";
import moringa from "@/assets/marquee/moringa-poster.jpg.asset.json";
import sorisa from "@/assets/marquee/sorisa.jpg.asset.json";

function isGraphics(w: Work) {
  const c = w.category;
  return c === "design" || c === "graphics" || c.startsWith("graphics_");
}

type Item = { id: string; image_url: string; title: string };

const extras: Item[] = [
  { id: "ex-badam", image_url: badam.url, title: "Badam Poster" },
  { id: "ex-coconut", image_url: coconut.url, title: "Coconut Oil" },
  { id: "ex-noodles", image_url: noodles.url, title: "Mr Noodles" },
  { id: "ex-ghee", image_url: ghee.url, title: "Ghee" },
  { id: "ex-khejur", image_url: khejur.url, title: "Khejuri" },
  { id: "ex-moringa", image_url: moringa.url, title: "Moringa Powder" },
  { id: "ex-sorisa", image_url: sorisa.url, title: "Sorisha Oil" },
];

const Card = ({ item }: { item: Item }) => {
  return (
    <div className="group relative shrink-0 h-full rounded-2xl overflow-hidden mx-2 shadow-md bg-white">
      <img
        src={item.image_url || "/placeholder.svg"}
        alt={item.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="block h-full w-auto max-w-none object-contain transition-transform duration-700 group-hover:scale-105"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
      />
    </div>
  );
};

export default function ProjectMarquee() {
  const { data: works } = useWorks();
  const items = useMemo<Item[]>(() => {
    const g = (works || []).filter(isGraphics).map((w) => ({
      id: String(w.id),
      image_url: w.image_url || "/placeholder.svg",
      title: w.title,
    }));
    // Interleave extras with graphics works so posters spread across both rows
    const merged: Item[] = [];
    const maxLen = Math.max(g.length, extras.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < g.length) merged.push(g[i]);
      if (i < extras.length) merged.push(extras[i]);
    }
    return merged.length ? merged : extras;
  }, [works]);

  if (items.length === 0) return null;

  const mid = Math.ceil(items.length / 2);
  const row1 = items.slice(0, mid);
  const row2 = items.slice(mid).concat(items.slice(0, Math.max(0, mid - (items.length - mid))));

  const dup1 = [...row1, ...row1, ...row1];
  const dup2 = [...row2, ...row2, ...row2];

  return (
    <section className="relative pt-4 pb-10 overflow-hidden bg-background">
      <div className="relative h-[180px] md:h-[220px]">
        <div className="flex marquee-left w-max h-full items-center">
          {dup1.map((p, i) => <Card key={`r1-${p.id}-${i}`} item={p} />)}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>

      <div className="relative h-[180px] md:h-[220px] mt-4">
        <div className="flex marquee-right w-max h-full items-center">
          {dup2.map((p, i) => <Card key={`r2-${p.id}-${i}`} item={p} />)}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
