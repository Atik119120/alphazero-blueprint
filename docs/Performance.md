# Performance

## Bundling & Splitting
- Vite 5 + React SWC plugin for fast HMR and production builds.
- Route-level components imported eagerly in `App.tsx` for zero-latency navigation on the small route set. Heavy admin subtrees can be lazy-loaded on demand.

## Critical Path
- Logo preloaded in `index.html` (`<link rel="preload" as="image">`).
- Fonts preconnected to `fonts.bunny.net`.
- GA4 script `async`.
- Preloader **disabled** on LMS routes (see `LMS_ROUTES` in `App.tsx`) to speed up authenticated views.

## Images
- Uploaded via `ImageUploader` → Supabase Storage.
- Heavy media via Cloudinary with adaptive delivery (HLS/DASH for video).
- All `<img>` set `crossOrigin` + `no-referrer` for security; layout dimensions reserved to avoid CLS.

## Caching
- **react-query** caches server state → prevents duplicate fetches.
- CDN caching on static assets.
- Cloudinary edge cache for media.

## Animations
- framer-motion for transitions (0.35 s, custom easing).
- Lenis for smooth scroll (marketing only).
- CSS `@keyframes marquee-left` for logo/trainer marquees (GPU-friendly, no JS ticker).
- GSAP + tsparticles used sparingly on hero moments only.

## Bundle Optimizations
- Tree-shakeable imports (lucide-react per-icon, date-fns per-fn).
- No barrel re-exports of heavy libs.
- Tailwind purge via `content` glob keeps CSS small.

## Runtime
- Realtime channels scoped to specific rooms (not global).
- Supabase queries paginated where lists can grow (courses, tickets, messages).

## SSR vs CSR
- Full CSR (SPA). No SSR/SSG required for current SEO scope; marketing content is largely CMS-driven and hydrated quickly.

## Timers / Cross-env
- Use `ReturnType<typeof setTimeout>` for portable timer typing (see `mem://technical/cross-environment-timers`).

## Monitoring
- GA4 real-time.
- Supabase → Edge Function logs.
- Telegram notifications for enrollments.

## Known Targets
- LCP < 2.5 s (marketing)
- TBT < 200 ms
- CLS < 0.05
- Bundle main chunk under ~350 kB gzipped (audit periodically).
