import { useEffect, useMemo, useRef, useState } from "react";
import { useWorks, type Work } from "@/hooks/useWorks";

import badam from "@/assets/marquee/badam.jpg.asset.json";
import coconut from "@/assets/marquee/coconuct.jpg.asset.json";
import noodles from "@/assets/marquee/creativity-to-create.png.asset.json";
import ghee from "@/assets/marquee/GHEE.jpg.asset.json";
import khejur from "@/assets/marquee/khejur.jpg.asset.json";
import moringa from "@/assets/marquee/moringa-poster.jpg.asset.json";
import sorisa from "@/assets/marquee/sorisa.jpg.asset.json";
import chatgptCircle from "@/assets/marquee/ChatGPT_Image_Jul_10_2026_11_09_35_PM-2.png.asset.json";
import digitalMarketing from "@/assets/marquee/download_8.jpg.asset.json";
import pizza1 from "@/assets/marquee/pp01.jpg.asset.json";
import pizza2 from "@/assets/marquee/pp02.jpg.asset.json";
import rome from "@/assets/marquee/My_new_design_Rome____.jpg.asset.json";
import posterTrend from "@/assets/marquee/POSTER_DESIGN_INSPIRETION_trend_2026.jpg.asset.json";

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
  { id: "ex-chatgpt", image_url: chatgptCircle.url, title: "Creative Designs" },
  { id: "ex-digital", image_url: digitalMarketing.url, title: "Digital Marketing" },
  { id: "ex-pizza1", image_url: pizza1.url, title: "Pizza Hut - Last Slice" },
  { id: "ex-pizza2", image_url: pizza2.url, title: "Pizza Hut - Hot Fresh" },
  { id: "ex-rome", image_url: rome.url, title: "Rome" },
  { id: "ex-poster-trend", image_url: posterTrend.url, title: "Poster Design Trend 2026" },
];

const HERO_CTA_GAP_PX = 120;

const Card = ({ item }: { item: Item }) => {
  return (
    <div className="group relative shrink-0 h-full aspect-square rounded-2xl overflow-hidden mx-2 shadow-md bg-white">
      <img
        src={item.image_url || "/placeholder.svg"}
        alt={item.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
      />
    </div>
  );
};


export default function ProjectMarquee() {
  const { data: works } = useWorks();
  const sectionRef = useRef<HTMLElement>(null);
  const [topOffset, setTopOffset] = useState(0);
  const items = useMemo<Item[]>(() => {
    const g = (works || []).filter(isGraphics).map((w) => ({
      id: String(w.id),
      image_url: w.image_url || "/placeholder.svg",
      title: w.title,
    }));
    const merged = [...g, ...extras];
    // hash-based deterministic shuffle so new & old items are spread out
    const hash = (s: string) => {
      let h = 2166136261;
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return (h >>> 0) / 4294967295;
    };
    const seeded = merged
      .map((it) => ({ it, k: hash(it.id) }))
      .sort((a, b) => a.k - b.k)
      .map((x) => x.it);
    return seeded.length ? seeded : extras;
  }, [works]);

  if (items.length === 0) return null;

  // alternate items into two rows so each row shows different images
  const row1: Item[] = [];
  const row2: Item[] = [];
  items.forEach((it, i) => (i % 2 === 0 ? row1 : row2).push(it));

  const dup1 = [...row1, ...row1, ...row1];
  const dup2 = [...row2, ...row2, ...row2];

  useEffect(() => {
    let frame = 0;
    const schedulePosition = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const marquee = sectionRef.current;
        const cta = document.querySelector<HTMLElement>("[data-hero-cta]");

        if (!marquee || !cta) return;

        const desiredTop = cta.getBoundingClientRect().bottom + HERO_CTA_GAP_PX;
        const currentTop = marquee.getBoundingClientRect().top;
        const nextOffset = Math.round(topOffset + desiredTop - currentTop);

        setTopOffset((current) => (Math.abs(nextOffset - current) > 1 ? nextOffset : current));
      });
    };

    schedulePosition();
    const timers = [150, 500, 1000].map((delay) => window.setTimeout(schedulePosition, delay));
    window.addEventListener("resize", schedulePosition);
    window.addEventListener("orientationchange", schedulePosition);

    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("resize", schedulePosition);
      window.removeEventListener("orientationchange", schedulePosition);
    };
  }, [items.length, topOffset]);

  return (
    <section ref={sectionRef} style={{ marginTop: topOffset }} className="relative pt-0 pb-16 md:pb-24 overflow-hidden bg-transparent z-20">
      <div className="relative h-[130px] sm:h-[150px] md:h-[180px]">


        <div className="flex marquee-left w-max h-full items-center">
          {dup1.map((p, i) => <Card key={`r1-${p.id}-${i}`} item={p} />)}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>

      <div className="relative h-[130px] sm:h-[150px] md:h-[180px] mt-4">
        <div className="flex marquee-right w-max h-full items-center">
          {dup2.map((p, i) => <Card key={`r2-${p.id}-${i}`} item={p} />)}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
