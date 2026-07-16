# SEO

## Meta
`index.html` sets base tags:
- `<title>` — "AlphaZero BD — Agency Bangladesh | Logo & Web Design" (< 60 chars)
- `<meta name="description">` — < 160 chars, keyword-rich
- Author, robots, googlebot, bingbot
- Google site verification
- Google Analytics 4 (`G-TKCXDY69Q9`)

Per-route overrides via `react-helmet-async` inside individual pages.

## Open Graph & Twitter
`og:title`, `og:description`, `og:type`, `og:url` (relative until custom domain), `twitter:card=summary_large_image`. Social preview image auto-added by hosting.

## JSON-LD Schema
- Organization + Person (Founder: Sofiullah Ahammad) schemas embedded (see `mem://features/seo/founder-identity`).
- Course schema on course pages where applicable.

## Robots & Sitemap
- `public/robots.txt` — allows all major crawlers.
- `public/sitemap.xml` — enumerates public routes.

## Canonical
- Relative `<link rel="canonical">` per page.
- Prevents duplicate `learn.*` vs main-domain indexing conflicts.

## Semantic HTML
- Single `<h1>` per page.
- Landmark elements (`<nav>`, `<main>`, `<footer>`).
- Alt text on all images.

## Performance-driven SEO
- LCP < 2.5 s on marketing pages (preload logo, preconnect fonts).
- CLS minimized via reserved image dimensions.
- Lazy-load below-the-fold images.

## Bilingual SEO
- Language toggle updates `<html lang>` and content simultaneously.
- Both `bn` and `en` variants indexable.

## Global Search
Bilingual global search (`SearchModal`) with AI edge fallback for user retention.

## Accessibility
- Keyboard-navigable modals (Radix primitives).
- Focus rings via `--ring` token.
- Screen-reader labels on icons.

## Character Limits
- Title 60, description 160, og:title 60, og:description 160.

## Findings / Rescan
Managed via the SEO & AI search tab. Update findings after fixes with `update_findings`.
