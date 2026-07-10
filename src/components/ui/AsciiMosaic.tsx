import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface AsciiMosaicProps {
  src?: string;
  srcLight?: string;
  srcDark?: string;
  className?: string;
  cellSize?: number;
  brightness?: number; // -100..100
  contrast?: number; // 0..200
  vignette?: number; // 0..100
  bloom?: number; // 0..100
  animSpeed?: number; // 0..100
  animIntensity?: number; // 0..100
  animStyle?: "wave" | "pulse" | "shimmer" | "ripple" | "flicker";
  bgOpacity?: number; // 0..100
}

export default function AsciiMosaic({
  src,
  srcLight,
  srcDark,
  className,
  cellSize = 16,
  brightness = 12,
  contrast = 115,
  vignette = 38,
  bloom = 25,
  animSpeed = 100,
  animIntensity = 60,
  animStyle = "wave",
  bgOpacity = 90,
}: AsciiMosaicProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const activeSrc = (resolvedTheme === "light" ? srcLight : srcDark) || src || srcDark || srcLight || "";

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !activeSrc) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = activeSrc;

    let raf = 0;
    let mounted = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // offscreen sampling canvas
    const sample = document.createElement("canvas");
    const sctx = sample.getContext("2d", { willReadFrequently: true })!;

    const start = performance.now();

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(r.width * dpr));
      canvas.height = Math.max(1, Math.floor(r.height * dpr));
      canvas.style.width = r.width + "px";
      canvas.style.height = r.height + "px";
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const draw = () => {
      if (!mounted) return;
      const ctx = canvas.getContext("2d")!;
      const W = canvas.width;
      const H = canvas.height;
      if (!img.complete || !img.naturalWidth) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const t = (performance.now() - start) / 1000;
      const speed = animSpeed / 100;
      const intensity = animIntensity / 100;

      // fit image cover
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(W / iw, H / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (W - dw) / 2;
      const dy = (H - dh) / 2;

      // Background — white in light mode, black in dark mode
      const isLight = resolvedTheme === "light";
      ctx.fillStyle = isLight ? "#ffffff" : "#000000";
      ctx.fillRect(0, 0, W, H);

      // Sample downscaled image at cell grid resolution
      const cs = cellSize * dpr;
      const cols = Math.ceil(W / cs);
      const rows = Math.ceil(H / cs);
      sample.width = cols;
      sample.height = rows;
      sctx.filter = `brightness(${1 + brightness / 100}) contrast(${contrast}%)`;
      sctx.clearRect(0, 0, cols, rows);
      // draw cover-fit into sample
      const sScale = Math.max(cols / iw, rows / ih);
      const sw = iw * sScale;
      const sh = ih * sScale;
      const sx = (cols - sw) / 2;
      const sy = (rows - sh) / 2;
      sctx.drawImage(img, sx, sy, sw, sh);
      const data = sctx.getImageData(0, 0, cols, rows).data;

      // Mosaic tiles
      ctx.save();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

          // Animation modulation
          let mod = 1;
          if (animStyle === "wave") {
            mod = 1 + Math.sin((x * 0.35 + y * 0.25) - t * 2 * speed) * 0.15 * intensity;
          } else if (animStyle === "pulse") {
            mod = 1 + Math.sin(t * 3 * speed) * 0.2 * intensity;
          } else if (animStyle === "shimmer") {
            mod = 1 + (Math.sin(x * 1.3 + t * 4 * speed) * Math.cos(y * 1.1 - t * 3 * speed)) * 0.2 * intensity;
          } else if (animStyle === "ripple") {
            const cx = cols / 2, cy = rows / 2;
            const d = Math.hypot(x - cx, y - cy);
            mod = 1 + Math.sin(d * 0.5 - t * 3 * speed) * 0.2 * intensity;
          } else if (animStyle === "flicker") {
            mod = 1 + (Math.random() - 0.5) * 0.3 * intensity;
          }

          // Bigger tiles, smaller gap
          const gap = Math.max(1, cs * 0.08);
          const size = Math.max(1, (cs - gap) * mod);
          const px = x * cs + (cs - size) / 2;
          const py = y * cs + (cs - size) / 2;
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(px, py, size, size);
        }
      }
      ctx.restore();

      // Bloom: subtle glow only
      if (bloom > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = (bloom / 100) * 0.12;
        ctx.filter = `blur(${1.5 * dpr}px) brightness(1.15)`;
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();
      }

      // Vignette
      if (vignette > 0) {
        const grad = ctx.createRadialGradient(
          W / 2, H / 2, Math.min(W, H) * 0.35,
          W / 2, H / 2, Math.max(W, H) * 0.75
        );
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, `rgba(0,0,0,${(vignette / 100) * 0.95})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      raf = requestAnimationFrame(draw);
    };

    const onLoad = () => {
      resize();
      raf = requestAnimationFrame(draw);
    };
    if (img.complete && img.naturalWidth) onLoad();
    else img.addEventListener("load", onLoad);

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      img.removeEventListener("load", onLoad);
    };
  }, [activeSrc, cellSize, brightness, contrast, vignette, bloom, animSpeed, animIntensity, animStyle, bgOpacity]);

  return (
    <div ref={wrapRef} className={className} style={{ position: "relative", width: "100%", aspectRatio: "3 / 2" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%", background: "#000" }} />
    </div>
  );
}
