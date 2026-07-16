# Tech Stack (Full Inventory)

## Language & Runtime
- TypeScript 5
- React 18.3
- Node.js 18+ (build), Bun (recommended package manager)

## Build & Tooling
- Vite 5 with `@vitejs/plugin-react-swc`
- `lovable-tagger` (dev mode)
- ESLint
- Tailwind CSS 3 + `tailwindcss-animate` + `tailwind-merge` + `class-variance-authority` + `clsx`

## UI
- shadcn/ui (built on Radix Primitives) — full set: accordion, alert-dialog, aspect-ratio, avatar, checkbox, collapsible, context-menu, dialog, dropdown-menu, hover-card, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, slot, switch, tabs, toast, toggle(-group), tooltip
- `lucide-react` icons
- `cmdk` command palette
- `sonner` + `vaul` toast/drawer
- `recharts` charts
- `react-day-picker` calendar
- `react-resizable-panels`
- `input-otp`

## Data / State
- `@tanstack/react-query` v5
- React Context (`Auth`, `Language`, `SiteScope`, `AdminSiteScope`)
- `react-hook-form` + `@hookform/resolvers` + `zod`

## Routing
- `react-router-dom` v7

## Motion & Media
- `framer-motion`
- `gsap`
- `lenis` (smooth scroll)
- `@tsparticles/react` + `@tsparticles/slim`
- `swiper`, `@splidejs/react-splide`, `embla-carousel-react`, `embla-carousel-autoplay`

## Documents / Codes
- `html2canvas`
- `jspdf`
- `qrcode.react`
- `react-barcode`

## SEO
- `react-helmet-async`

## Backend (BaaS)
- Supabase (Lovable Cloud): Postgres, Auth, Storage, Edge Functions, Realtime
- `@supabase/supabase-js`
- `@lovable.dev/cloud-auth-js`

## External Services
- Cloudinary (signed uploads + delivery)
- UddoktaPay (payments, bKash/Nagad/cards)
- Resend (transactional + inbound email)
- Telegram Bot API (admin notifications)
- Lovable AI Gateway (Gemini 2.5)
- Google Analytics 4 (`G-TKCXDY69Q9`)
- YouTube IFrame + VideoJS YouTube plugin

## Theming
- `next-themes` (dark default)

## Dev Deps
- ESLint, TypeScript, Tailwind config, PostCSS

## Package Manager
- Bun (lockfile `bun.lock`)

## Editor / IDE
- Any (VS Code recommended)
