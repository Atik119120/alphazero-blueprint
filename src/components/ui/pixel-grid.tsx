"use client";

import { useEffect, useRef } from "react";

interface PixelGridProps {
  bgColor?: string;
  pixelColor?: string;
  pixelSize?: number;
  pixelSpacing?: number;
  pixelDeathFade?: number;
  pixelBornFade?: number;
  pixelMaxLife?: number;
  pixelMinLife?: number;
  pixelMaxOffLife?: number;
  pixelMinOffLife?: number;
  className?: string;
  glow?: boolean;
}

interface Pixel {
  xPos: number;
  yPos: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  offLife: number;
  isLit: boolean;
  dying: boolean;
  deathFade: number;
  bornFade: number;
  randomizeSelf: () => void;
}

export function PixelGrid({
  bgColor = "transparent",
  pixelColor = "#22d3ee",
  pixelSize = 3,
  pixelSpacing = 3,
  pixelDeathFade = 10,
  pixelBornFade = 50,
  pixelMaxLife = 500,
  pixelMinLife = 250,
  pixelMaxOffLife = 500,
  pixelMinOffLife = 200,
  glow = false,
  className = "",
}: PixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c2d = canvas.getContext("2d", { alpha: true });
    if (!c2d) return;

    const parent = canvas.parentElement;

    const size = () => {
      const w = parent?.clientWidth ?? window.innerWidth;
      const h = parent?.clientHeight ?? window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const randomAlpha = () => {
      const r = Math.random() * 100;
      if (r > 90) return 1;
      if (r > 80) return 0.5;
      return 0.1;
    };

    const makePixel = (x: number, y: number): Pixel => {
      const alpha = randomAlpha();
      return {
        xPos: x * (pixelSize + pixelSpacing),
        yPos: y * (pixelSize + pixelSpacing),
        alpha: 0,
        maxAlpha: alpha,
        life: Math.floor(Math.random() * (pixelMaxLife - pixelMinLife + 1)) + pixelMinLife,
        offLife: Math.floor(Math.random() * (pixelMaxOffLife - pixelMinOffLife + 1)) + pixelMinOffLife,
        isLit: alpha !== 0.1,
        dying: false,
        deathFade: pixelDeathFade,
        bornFade: pixelBornFade,
        randomizeSelf() {
          const na = randomAlpha();
          this.alpha = 0;
          this.maxAlpha = na;
          this.life = Math.floor(Math.random() * (pixelMaxLife - pixelMinLife + 1)) + pixelMinLife;
          this.offLife = Math.floor(Math.random() * (pixelMaxOffLife - pixelMinOffLife + 1)) + pixelMinOffLife;
          this.isLit = na !== 0.1;
          this.dying = false;
          this.deathFade = pixelDeathFade;
          this.bornFade = pixelBornFade;
        },
      };
    };

    const init = () => {
      size();
      const cols = Math.ceil(canvas.width / (pixelSize + pixelSpacing));
      const rows = Math.ceil(canvas.height / (pixelSize + pixelSpacing));
      pixelsRef.current = [];
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) pixelsRef.current.push(makePixel(x, y));
    };

    init();

    const onResize = () => init();
    window.addEventListener("resize", onResize);

    const draw = (p: Pixel) => {
      p.alpha = Math.min(Math.max(p.alpha, 0.1), p.maxAlpha);
      c2d.fillStyle = `${pixelColor}${Math.floor(p.alpha * 255).toString(16).padStart(2, "0")}`;
      c2d.fillRect(p.xPos, p.yPos, pixelSize, pixelSize);
      if (p.isLit) {
        if (p.bornFade <= 0) {
          if (p.life <= 0) {
            p.dying = true;
            if (p.deathFade <= 0) p.randomizeSelf();
            else {
              p.alpha = (p.deathFade / pixelDeathFade) * p.maxAlpha;
              p.deathFade--;
            }
          } else p.life--;
        } else {
          p.alpha = p.maxAlpha - p.bornFade / pixelBornFade;
          p.bornFade--;
        }
      } else {
        if (p.offLife <= 0) p.isLit = true;
        p.offLife--;
      }
    };

    const loop = () => {
      if (bgColor === "transparent") c2d.clearRect(0, 0, canvas.width, canvas.height);
      else {
        c2d.fillStyle = bgColor;
        c2d.fillRect(0, 0, canvas.width, canvas.height);
      }
      if (glow) {
        c2d.shadowBlur = 8;
        c2d.shadowColor = pixelColor;
      } else c2d.shadowBlur = 0;
      for (const p of pixelsRef.current) draw(p);
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [bgColor, pixelColor, pixelSize, pixelSpacing, pixelDeathFade, pixelBornFade, pixelMaxLife, pixelMinLife, pixelMaxOffLife, pixelMinOffLife, glow]);

  return <canvas ref={canvasRef} className={`block w-full h-full ${className}`} />;
}
