# Project Memory

Persistent decisions, preferences, and constraints across sessions.

## Core Identity
- **AlphaZero** — Bilingual (বাংলা + English) digital agency + academy/LMS
- Aesthetic: Premium Editorial Glassmorphism (glass-cards, mesh-bg)
- Fonts: Playfair Display (headings) + Hind Siliguri (Bangla)
- Auth hierarchy: **Admin > Teacher > Student**
- Phone-mandatory signup + Email OTP

## Architecture Decisions
- **Decoupled:** React frontend on Vercel/Netlify, backend on Supabase — app persists after Lovable subscription expires
- DNS: A/TXT records, Lovable verification
- Security headers via Cloudflare Transform Rules (CSP)
- SPA routing via `public/_redirects`
- Strict RLS on `profiles`; unauthenticated access only via Edge Functions

## LMS Decisions
- Direct DB enrollment (pass-code system **removed** — do not re-add)
- Courses → Modules → Videos hierarchy
- Dual-language courses via English columns
- Trainer assignment manual by admin
- Video: VideoJS YouTube plugin, anti-forward seek, 90% threshold, max_watched_time seek limit
- Cloudinary adaptive streaming (HLS/DASH) for non-YouTube video
- Course materials: embedded PDF viewer
- Post-video thumbs up/down feedback
- Threaded Q&A per lesson synced to admin
- Certificates: html2canvas/jsPDF, separate free vs paid logic
- Realtime onboarding via `ensure-student-onboarding` edge function
- Coupon system bypassed in streamlined enrollment
- Video gallery **removed** — do not re-add

## Chat System
- Single room per teacher-student pair (no new room per message)
- Teacher panel: left = student list with profile names, right = active chat
- Realtime via Supabase channels

## Course Viewer Layout
- Video fixed top, only class list sidebar scrolls
- Root `fixed inset-0 h-[100dvh] overflow-hidden`, body/html overflow locked via useEffect
- Mobile YouTube-style sticky top

## Removed / Forbidden
- ❌ Pass-code enrollment
- ❌ Video gallery module
- ❌ Floating AIChatbot widget in student area
- ❌ Roles on profile table
- ❌ Hardcoded color classes in components
- ❌ Editing auto-generated Supabase files

## Integrations
- **Payments:** UddoktaPay (return_type=GET, metadata JSON)
- **Email:** Resend (outbound + inbound webhook to DB, MX records, noreply)
- **Notifications:** Telegram bot via `student-enrollment-notify`
- **AI:** Lovable AI Gateway — Alpha Assistant (Gemini 2.5 Vibe Coding + vision metadata)
- **Analytics:** GA4 `G-TKCXDY69Q9`

## Admin Features
- CMS with Bengali DB keys, resilient content binding fallback hierarchy
- API management (central DB for payment/marketing keys)
- Team management with unlimited custom social links
- Entrepreneurs showcase module
- Bilingual global search with AI edge fallback
- Alpha Assistant (vibe coding + vision-powered metadata)
- Secure `delete-student` Edge Function for full DB wipe
- Admin provisioning via `create-admin` Edge Function

## Media
- Reusable `ImageUploader` → `media-uploads` Supabase bucket
- Cloudinary 10MB chunked client-side signed uploads
- `no-referrer` + `crossOrigin` for images

## SEO
- Canonical domain enforced
- Title <60, description <160
- JSON-LD founder identity schema

## Pricing / Services
- 6 core service policies (see `src/data/pricing.ts`)
- Revenue split formulas: Recorded / Live / Agency (different)
- Pricing navigation uses `window.location.href` for `#anchors`

## Testing / Demo
- Demo teacher account exists for QA

## User Preferences
- User prefers **very short Bangla responses**

## Subscription Longevity
- Platform MUST outlive Lovable subscription — no lock-in dependencies
