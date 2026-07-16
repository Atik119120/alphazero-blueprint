# Deployment

## Architecture
Decoupled: static React SPA + Supabase backend. Frontend can be redeployed on any static host without touching backend.

## Frontend
Build:
```bash
bun run build      # outputs dist/
```
Deploy `dist/` to:
- **Lovable Publish** (default): `alphazero00.lovable.app`
- **Vercel** / **Netlify** / **Cloudflare Pages** as fallback (persistence beyond Lovable subscription).

SPA fallback route required — `public/_redirects` handles it (`/* /index.html 200`). See `mem://technical/spa-routing-configuration`.

## Environment Variables (frontend)
Provided by Lovable Cloud, must exist at build time:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

If any is missing the built site fails silently — never blank them.

## Backend
Managed by Lovable Cloud (Supabase). Migrations applied through the platform migration tool. Edge Functions in `supabase/functions/` deploy automatically.

## Secrets (server-only)
Configured in Supabase Vault (do not commit): `CLOUDINARY_*`, `RESEND_API_KEY`, `UDDOKTAPAY_*`, `TELEGRAM_*`, `LOVABLE_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## Domains
- Preview: `id-preview--<id>.lovable.app`
- Published: `alphazero00.lovable.app`
- Custom: DNS via A + TXT records (see `mem://technical/dns-configuration-v1`)
- Sub-brand: `learn.<domain>` triggers Learn variant of `/`, `/about`, `/contact` and swaps favicons.

## Security Headers
Applied via Cloudflare Transform Rules (CSP, HSTS, etc.). See `mem://technical/security-headers-server-config-v1`.

## Analytics
GA4 (`G-TKCXDY69Q9`) embedded in `index.html`.

## Post-deploy Checklist
1. Verify login flows for all three roles.
2. Verify UddoktaPay checkout succeeds end-to-end.
3. Trigger a test enrollment → Telegram + Resend welcome.
4. Confirm certificate PDF generates.
5. Run Lighthouse on `/` and `/courses`.
6. Confirm SEO tags render (not placeholder).
