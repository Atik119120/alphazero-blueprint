# Folder Structure

```
.
├── docs/                         # Project documentation (this folder)
├── public/                       # Static assets served as-is
│   ├── favicon*.png              # Multi-size favicons + learn variant
│   ├── site.webmanifest          # PWA manifest
│   ├── robots.txt                # Crawler directives
│   ├── sitemap.xml               # Public route sitemap
│   └── _redirects                # SPA fallback for Netlify/Vercel-style hosts
├── src/
│   ├── App.tsx                   # Router + providers + global shell
│   ├── main.tsx                  # ReactDOM bootstrap
│   ├── index.css                 # Design tokens + Tailwind base + custom keyframes
│   ├── App.css                   # Legacy globals (minimal)
│   ├── vite-env.d.ts             # Vite ambient types
│   │
│   ├── assets/                   # Bundled brand assets
│   │   ├── logo*.png             # Brand marks (theme-aware via CSS filters)
│   │   ├── brands/               # Client logos
│   │   ├── clients/              # Client showcase
│   │   ├── instructors/          # Trainer photos
│   │   ├── marquee/              # Marquee assets
│   │   ├── services/             # Service imagery
│   │   └── *.png.asset.json      # Lovable asset descriptors
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui primitives (do not embed business logic)
│   │   ├── admin/                # 25 admin dashboard modules
│   │   ├── student/              # Student dashboard tabs + widgets
│   │   ├── teacher/              # Teacher dashboard tabs
│   │   ├── live/                 # YouTube live embed + status badge
│   │   └── *.tsx                 # Global shell: Navbar, Footer, Preloader,
│   │                             #   SmoothScroll, ScrollReveal, ScrollToTop,
│   │                             #   PageTransition, SecureVideoPlayer,
│   │                             #   SearchModal, AIChatbot, ProjectMarquee,
│   │                             #   HomeTeamSection, Layout, NavLink, Reveal
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx       # Session + role hierarchy
│   │   ├── LanguageContext.tsx   # bn ↔ en toggle
│   │   ├── SiteScopeContext.tsx  # main vs learn sub-brand
│   │   └── AdminSiteScopeContext.tsx
│   │
│   ├── data/
│   │   └── pricing.ts            # Centralized service pricing
│   │
│   ├── hooks/                    # Data-fetching hooks (react-query wrappers)
│   │   ├── useCourses.ts
│   │   ├── usePublicCourses.ts
│   │   ├── useStudentCourses.ts
│   │   ├── useTeacherData.ts
│   │   ├── useTeamMembers.ts
│   │   ├── useHomepageSections.ts
│   │   ├── useFooterData.ts
│   │   ├── usePageContent.ts
│   │   ├── usePageHero.ts
│   │   ├── useLiveClasses.ts
│   │   ├── useServices.ts
│   │   ├── useWorks.ts
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── integrations/
│   │   ├── supabase/             # AUTO-GENERATED client + types (DO NOT EDIT)
│   │   └── lovable/              # Lovable Cloud helpers
│   │
│   ├── lib/
│   │   └── utils.ts              # `cn()` classname helper
│   │
│   ├── pages/                    # Route components (see Routes.md, Pages.md)
│   │
│   ├── utils/
│   │   └── emailValidation.ts    # Disposable-domain + format checks
│   │
│   └── types/                    # Shared TS types
│
├── supabase/
│   └── functions/                # 30 Edge Functions (see API.md)
│
├── index.html                    # Head tags, favicons, GA4, preloads
├── tailwind.config.ts            # Tailwind + design tokens config
├── postcss.config.js
├── tsconfig*.json                # TS project references
├── vite.config.ts                # Vite config, @/ alias
├── eslint.config.js
├── components.json               # shadcn/ui config
├── bun.lock / package.json       # Deps (Bun primary)
└── .env                          # Auto-managed publishable vars
```

## Why each folder
- `docs/` — single source of truth so any dev can onboard without reading code.
- `assets/` — bundled with build for cache-busting and preload capability.
- `components/ui/` — kept pure to keep shadcn upgrade path clean.
- `components/<role>/` — feature modules isolated per user role.
- `contexts/` — global concerns that would otherwise thread props everywhere.
- `hooks/` — every server-state query in one place, cached by react-query.
- `integrations/supabase/` — auto-gen, must not be edited or business logic breaks on regen.
- `pages/` — one file per route to keep bundling predictable.
- `supabase/functions/` — all secret-holding server logic; never in client.
