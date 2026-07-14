# Project Rules

## Language & Communication
- Platform bilingual (বাংলা + English), সম্পূর্ণ isolated switching
- Never mix Bangla + English in the same UI string block

## Code
- React 18 + Vite + TS + Tailwind v3 only — no Next/Vue/Svelte
- Never edit auto-generated files:
  - `src/integrations/supabase/client.ts`
  - `src/integrations/supabase/types.ts`
  - `.env` (VITE_SUPABASE_*)
  - `supabase/config.toml`
- Use semantic design tokens — no hardcoded colors in components
- Small focused components, prefer search-replace over rewrites
- Use `lucide-react` for icons

## Backend / Database
- Every `CREATE TABLE public.*` migration MUST include:
  1. `GRANT` statements for `authenticated` / `service_role` (and `anon` only if truly public)
  2. `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
  3. `CREATE POLICY ...`
- Roles ONLY in `user_roles` table — never on `profiles`
- Use `has_role()` SECURITY DEFINER in policies to avoid recursion
- Never touch schemas: `auth`, `storage`, `realtime`, `supabase_functions`, `vault`
- SUPABASE_SERVICE_ROLE_KEY and DB password are NOT accessible on Lovable Cloud

## Auth
- Phone-mandatory signup
- Email OTP + Google OAuth (configure Google provider same turn)
- OAuth `redirect_uri` = `window.location.origin` or `/auth/callback` — never a protected route
- No anonymous signup
- No auto-confirm email unless asked
- Admin > Teacher > Student hierarchy strictly enforced

## LMS Rules
- Direct DB enrollment (no pass-codes — do NOT re-add)
- Video gallery module — do NOT re-add
- Floating chatbot widget in student area — do NOT re-add
- Video security: VideoJS YouTube plugin only, anti-forward seek, 90% completion threshold
- Teachers see ONLY their assigned courses + own students
- Certificates: separate logic for free vs paid

## Chat
- Single room per teacher-student pair — never open new room on every message
- Teacher must see student profile name in chat list
- Left sidebar = student list, right = active conversation

## Course Viewer Layout
- Video fixed at top (never scrolls with body)
- Only class list sidebar scrolls
- Root locked: `fixed inset-0 h-[100dvh] overflow-hidden`
- Mobile YouTube-style sticky video

## Media
- All uploads via reusable `ImageUploader` → `media-uploads` bucket
- Cloudinary for large video (10MB chunked signed uploads)
- Images: `no-referrer`, proper `crossOrigin`

## Payments
- UddoktaPay: `return_type=GET`, structured metadata JSON
- Revenue split formulas differ for Recorded / Live / Agency

## SEO
- Title <60 chars with keyword; meta description <160 chars
- Single H1, semantic HTML, alt text
- JSON-LD Founder identity schema
- Canonical domain enforced
- Responsive viewport

## Never Do
- Never say "Supabase" to user — say Lovable Cloud / backend / database
- Never show Supabase project IDs, URLs, or dashboard links
- Never expose service role key or fabricate placeholder for it
- Never store roles on profile table (privilege escalation)
- Never use client-side storage for admin checks
- Never hardcode colors bypassing design tokens
