# Assets

## Locations
- `src/assets/` — bundled assets (imported through Vite)
- `public/` — served as-is (favicons, manifest, robots, sitemap)
- Supabase Storage — user uploads
- Cloudinary — video + large media delivery

## Logos & Branding
- `src/assets/logo.png` + `logo-full.png` + `alphazero-logo.png` — brand marks
- `learn-with-alphazero-logo.png` — Learn sub-brand
- All logos theme-aware via CSS filters (see `mem://branding/logos`)
- Preloaded in `App.tsx` (`preloadImg`) and `index.html` (`<link rel="preload">`)

## Favicons (public/)
- `favicon.png`, `favicon-16x16.png`, `favicon-32x32.png`
- `android-chrome-192x192.png`, `android-chrome-512x512.png`
- `apple-touch-icon*.png` (default, 120, 152, 180)
- `mstile-150x150.png`
- `learn-favicon.png` — swapped in on `learn.*` hostnames via `index.html` script

## Imagery (src/assets/)
- `hero-bg.jpg`, `hero-bg-light.png` — hero backgrounds
- `courses-hero-bg.png`, `services-hero-bg*.jpg` — page heroes
- `branding-phone-mockup.png`, `web-*-mockup.png`, `web-dev-*.png`, `seo-*.png` — service mockups
- `learn-og-image.jpg` — social preview
- `brands/`, `clients/` — logo cloud
- `instructors/` — trainer portraits
- `marquee/` — decorative marquee images
- `services/` — service cards
- `bkash-logo.png`, `nagad-logo.png` — payment brand marks

## Icons
- `lucide-react` (per-icon imports, tree-shakeable)
- Sizes: 16 / 20 / 24 px

## Fonts
- Playfair Display (headings)
- Hind Siliguri (Bangla body/UI)
- Delivered via `fonts.bunny.net` (preconnected in `index.html`)

## Videos
- Delivered via **YouTube IFrame** for course lessons (SecureVideoPlayer)
- Cloudinary for direct-uploaded video with adaptive streaming (HLS/DASH)

## SVGs
- Radix / lucide icons ship as SVG
- No hand-authored SVGs currently in `src/assets/`

## Illustrations
- Not currently used — replaced by real product photography and screen mockups.

## Asset Descriptors (`*.asset.json`)
Lovable-generated metadata for each bundled image (URL, dimensions). Do not edit manually.

## Static Files
- `public/robots.txt`, `public/sitemap.xml`, `public/site.webmanifest`
- `public/_redirects` — SPA fallback for hosting

## Upload Pipeline
- Small images → `ImageUploader` → Supabase `media-uploads` bucket
- Avatars → Supabase `avatars` bucket
- Videos → Cloudinary signed upload (`sign-upload` → direct upload → `upload-video`)
