# AlphaZero BD

> Bangladesh's bilingual creative agency and AI-powered online learning platform — one product, two brands.

AlphaZero BD is a production platform combining a full-service creative agency (logo, branding, UI/UX, web and social-media design) with **AlphaZero Learn**, an AI-powered online learning platform focused on Bangladesh. The Learn side teaches AI, Graphic Design, Web Development, Programming, Digital Marketing, UI/UX Design, Video Editing, Photography, Motion Graphics, Freelancing, Content Creation, Office Applications, Cyber Security, and future digital skills — natively in Bangla and English.

Both experiences live in a single React SPA backed by a Supabase (Postgres + Auth + Storage + Edge Functions + Realtime) core, with Cloudinary media delivery, UddoktaPay for local BDT payments (bKash / Nagad / cards), Resend email, Telegram admin notifications, and Gemini 2.5 through the Lovable AI Gateway powering the in-product assistants.

---

## About the Project

AlphaZero was built for Bangladeshi learners, entrepreneurs, and small businesses who need world-class design services **and** an accessible, native-language path into digital skills. The platform is:

- **Bilingual by design.** A language toggle swaps every string, font, and hero image — no mixed-script screens.
- **Two brands, one codebase.** Requests to `learn.<domain>` transparently render the Learn variant of `/`, `/about`, `/contact` and swap favicons.
- **AI-powered.** An admin "Alpha Assistant" (Gemini 2.5 Vibe Coding) automates content ops; a public "Alpha One" multimedia chatbot handles visitor questions.
- **Locally payable.** UddoktaPay integration supports bKash, Nagad, and cards natively.
- **Decoupled.** The React frontend can be redeployed on any static host; the Supabase backend persists independently so the platform outlives any single hosting subscription.

---

## Features

Every feature listed below exists in the repository today.

**Marketing site**
- Home with animated hero, CMS-driven sections, client marquee, team teaser
- About (agency + Learn variants)
- Services & Pricing (6 core policies in `src/data/pricing.ts`)
- Works / Portfolio with hero editor
- Team + Join Team
- Contact (agency + Learn variants) with dynamic contact info
- Course Landing (`/vibe-coding`)
- Global bilingual Search with AI edge fallback
- Preloader, smooth scroll (Lenis), scroll reveal, page transitions

**Learning (Students)**
- Course catalog with auto-scrolling trainer marquee
- Course viewer with locked layout (video fixed, sidebar scrolls)
- Secure video player (VideoJS + YouTube plugin, anti-forward-seek, 90 % completion gate)
- Lesson materials (embedded PDF viewer)
- Threaded lesson comments / Q&A
- Thumbs up/down video feedback
- Live classes (YouTube-based) with attendance
- Recorded classes archive
- Notices with read receipts
- Teacher-student chat (one room per pair, realtime)
- Support tickets
- Auto certificate generation (html2canvas + jsPDF) with public verification
- Student ID card (QR + barcode)
- Profile & avatar upload

**Teaching (Teachers)**
- Course management, video manager (Cloudinary uploads)
- Live class scheduler
- Student roster
- Paid works (agency projects)
- Earnings with automatic revenue split (40 % recorded / 70 % live / 80 % paid work)
- Withdrawal requests
- Notices, chat, support tickets, profile

**Administration**
- Course, Teacher, Team, Coupon, Comment, Feedback management
- Homepage, Footer, Landing page, Page hero, About/Learn page, Services, Works editors
- Page content CMS (Bengali keys)
- Site settings, Contact info, API keys, Payment APIs
- Email inbox + outbound composer
- Alpha Assistant (Gemini 2.5)
- Enrollment approvals, student provisioning/deletion

**Cross-cutting**
- Phone-mandatory signup with email OTP and Cloudflare Turnstile
- Disposable email blocklist
- Role hierarchy (Admin > Teacher > Student) via dedicated `user_roles` table
- Automated welcome emails (Resend) and enrollment notifications (Telegram)
- Google Analytics 4

---

## Technology Stack

| Layer | Choice |
|---|---|
| Frontend | React 18, TypeScript 5, Vite 5 (SWC) |
| Routing | react-router-dom v7 |
| Styling | Tailwind CSS 3, semantic HSL tokens, `tailwindcss-animate`, `class-variance-authority`, `tailwind-merge` |
| UI kit | shadcn/ui on Radix Primitives |
| Icons | lucide-react |
| State / data | @tanstack/react-query v5, React Context (`Auth`, `Language`, `SiteScope`) |
| Forms | react-hook-form + zod |
| Animation | framer-motion, GSAP, Lenis, tsparticles, Swiper, Splide, Embla |
| Documents | html2canvas, jsPDF, qrcode.react, react-barcode |
| SEO | react-helmet-async |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions, Realtime) |
| Media | Cloudinary (signed uploads, adaptive delivery), Supabase Storage (`avatars`, `media-uploads`) |
| Email | Resend (transactional + inbound webhook) |
| Payments | UddoktaPay (bKash, Nagad, cards) |
| Notifications | Telegram Bot API |
| AI | Google Gemini 2.5 via Lovable AI Gateway |
| Analytics | Google Analytics 4 (`G-TKCXDY69Q9`) |
| Package manager | Bun (`bun.lock`) |
| Build tools | Vite, PostCSS, ESLint |

---

## Project Structure

```
.
├── docs/                     # Full project documentation
├── public/                   # Static assets, favicons, robots, sitemap, _redirects
├── src/
│   ├── assets/               # Bundled images, logos, brand marks
│   ├── components/
│   │   ├── ui/               # shadcn/ui primitives
│   │   ├── admin/            # 25 admin dashboard modules
│   │   ├── student/          # Student dashboard tabs
│   │   ├── teacher/          # Teacher dashboard tabs
│   │   ├── live/             # YouTube live embed + status badge
│   │   └── *.tsx             # Shell: Navbar, Footer, Preloader, SecureVideoPlayer, SearchModal, AIChatbot…
│   ├── contexts/             # Auth, Language, SiteScope, AdminSiteScope
│   ├── data/                 # Static data (pricing)
│   ├── hooks/                # react-query hooks per domain
│   ├── integrations/supabase/# Auto-generated client + types (do not edit)
│   ├── lib/                  # `cn()` helper
│   ├── pages/                # Route components
│   ├── utils/                # Email validation, misc utilities
│   ├── App.tsx, main.tsx     # Router + providers + entry
│   └── index.css             # Design tokens + globals
├── supabase/functions/       # 30 serverless Edge Functions
├── index.html                # SEO tags, favicons, GA4, preloads
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

See [`docs/FolderStructure.md`](./docs/FolderStructure.md) for the fully annotated tree.

---

## Installation

Requires Node 18+ and Bun (recommended).

```bash
bun install
bun run dev            # Vite dev server → http://localhost:8080
```

The Supabase backend is already provisioned; no local database is required.

---

## Environment Variables

All client variables are publishable (RLS-protected) and live in the root `.env`:

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Data API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon key (safe in bundle) |
| `VITE_SUPABASE_PROJECT_ID` | Project reference |

Server-only secrets live in the Supabase Vault and are never shipped to the client:

`CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME`, `RESEND_API_KEY`, `UDDOKTAPAY_API_KEY`, `UDDOKTAPAY_BASE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `LOVABLE_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

---

## Scripts

| Script | Description |
|---|---|
| `bun run dev` | Start Vite dev server on port 8080 |
| `bun run build` | Production build to `dist/` |
| `bun run build:dev` | Development-mode build |
| `bun run preview` | Preview the built bundle |
| `bun run lint` | Run ESLint across the project |

---

## Deployment

The frontend is a static SPA. Build with `bun run build` and deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, or the built-in publish flow). `public/_redirects` handles SPA fallback routing.

The Supabase backend (schema, RLS, Edge Functions, buckets) is managed independently and persists across frontend redeploys.

Sub-brand: any request whose hostname begins with `learn.` transparently renders the Learn variants and swaps favicons.

Full details in [`docs/Deployment.md`](./docs/Deployment.md).

---

## Performance

- Preloaded critical brand assets and preconnected font host.
- react-query caches server state and deduplicates fetches.
- Cloudinary adaptive streaming (HLS/DASH) for video.
- Route-level preloader disabled on all LMS routes for instant authenticated views.
- GPU-friendly CSS keyframe marquees instead of JS tickers.
- Targets: LCP < 2.5 s, CLS < 0.05, TBT < 200 ms on marketing pages.

See [`docs/Performance.md`](./docs/Performance.md).

---

## Security

- Row-Level Security enabled on every one of the 47 public tables, with explicit `GRANT`s per role.
- Roles stored in a dedicated `user_roles` table (never on `profiles`) to prevent privilege escalation.
- Role checks flow through `SECURITY DEFINER` functions (`has_role`, `is_teacher`, `is_chat_room_member`, …) to avoid recursive RLS.
- Phone-mandatory signup with email OTP and Cloudflare Turnstile; disposable email domains blocklisted.
- All admin Edge Functions re-verify `has_role(auth.uid(), 'admin')` server-side.
- Cloudinary uploads are signed; webhook endpoints verify provider signatures.
- Security headers applied at the CDN edge (CSP, HSTS, X-Frame-Options, Referrer-Policy).

See [`docs/Security.md`](./docs/Security.md).

---

## SEO

- Per-route `<title>` (< 60 chars) and `<meta description>` (< 160 chars) via `react-helmet-async`.
- Open Graph, Twitter Card, JSON-LD Organization + Founder schemas.
- `public/robots.txt` and `public/sitemap.xml` maintained.
- Bilingual indexing (`bn` + `en`), single `<h1>` per page, alt text on all images.
- Google Analytics 4 (`G-TKCXDY69Q9`) embedded in `index.html`.

See [`docs/SEO.md`](./docs/SEO.md).

---

## Future Roadmap

- Mobile app wrapper for the Learn experience
- Bulk teacher onboarding tooling
- Advanced admin analytics (revenue, completion, funnel)
- Group live classes with attendance analytics
- Public API expansion for third-party partners
- Consolidation of legacy tables (`pass_codes`, `gallery_videos`) after backfill audit

---

## Contributing

This is a production, internally maintained codebase. Contribution rules:

1. Read [`docs/PRD.md`](./docs/PRD.md), [`docs/Architecture.md`](./docs/Architecture.md), and [`docs/Rules.md`](./docs/Rules.md) before opening a PR.
2. Use conventional commit prefixes (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
3. Ship database changes as a single migration containing `CREATE TABLE → GRANT → ENABLE RLS → CREATE POLICY`, in that order.
4. Never edit auto-generated files under `src/integrations/supabase/`.
5. Every UI change must use semantic Tailwind tokens — no hardcoded colors.
6. Update `docs/*.md` and `mem://index.md` whenever a project decision changes.

---

## License

Proprietary. © AlphaZero BD. All rights reserved. Not licensed for redistribution or resale.

---

## Credits

- **Owner:** AlphaZero BD — Sofiullah Ahammad (Founder), Rajshahi, Bangladesh
- **Organization:** AlphaZero Creative Agency & AlphaZero Learn
- **Engineering & Design:** AlphaZero core team
- **Backend infrastructure:** Supabase
- **Payments:** UddoktaPay
- **Media delivery:** Cloudinary
- **Email:** Resend
- **AI:** Google Gemini 2.5

---

## Documentation

Full project documentation lives inside [`/docs`](./docs):

- [`PRD.md`](./docs/PRD.md) — Product requirements, users, goals, roadmap
- [`Architecture.md`](./docs/Architecture.md) — System, data, and auth architecture
- [`Design.md`](./docs/Design.md) — Design system, tokens, typography, motion
- [`API.md`](./docs/API.md) — Internal PostgREST + Edge Function reference
- [`Database.md`](./docs/Database.md) — All 47 tables, roles, RLS pattern
- [`Components.md`](./docs/Components.md) — Reusable component reference
- [`Pages.md`](./docs/Pages.md) — Per-page purpose and data sources
- [`Routes.md`](./docs/Routes.md) — Public, auth, student, teacher, admin routes
- [`Features.md`](./docs/Features.md) — End-to-end feature descriptions
- [`Workflow.md`](./docs/Workflow.md) — Visitor → student → certificate flow
- [`Rules.md`](./docs/Rules.md) — Hard project rules
- [`Memory.md`](./docs/Memory.md) — Living project decisions and rationale
- [`Deployment.md`](./docs/Deployment.md) — Build and release process
- [`Security.md`](./docs/Security.md) — Auth, RLS, secrets, headers
- [`Performance.md`](./docs/Performance.md) — Optimization strategy
- [`SEO.md`](./docs/SEO.md) — Meta, schema, indexing
- [`TechStack.md`](./docs/TechStack.md) — Full dependency inventory
- [`FolderStructure.md`](./docs/FolderStructure.md) — Annotated tree
- [`Assets.md`](./docs/Assets.md) — Images, fonts, favicons, uploads
- [`Development.md`](./docs/Development.md) — Local development guide
- [`Changelog.md`](./docs/Changelog.md) — Version history
