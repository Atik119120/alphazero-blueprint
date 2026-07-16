# Security

## Authentication
- Supabase Auth (JWT). Phone-mandatory signup + email OTP + Cloudflare Turnstile.
- Disposable domains blocked via `disposable_email_domains`.
- No anonymous signups.
- Teacher access gated by `teacher_approved` flag.
- Passwords never logged / redacted in all server logs.

## Authorization
- Roles in dedicated `public.user_roles` table (never on `profiles`) — prevents privilege escalation.
- All checks via `has_role()` SECURITY DEFINER function to avoid recursive RLS.
- Role hierarchy: `admin > teacher > student`.
- Every admin Edge Function re-verifies `has_role(auth.uid(), 'admin')` server-side.

## Row-Level Security
- Enabled on **every** public table (47 tables).
- Explicit `GRANT`s per role. No default anon grants.
- Teacher/student data isolation enforced by `is_teacher_of_current_student`, `is_student_of_current_teacher`, `is_progress_visible_to_teacher`, `user_has_course_access`.
- Chat room membership enforced by `is_chat_room_member`, `can_current_user_add_chat_member`, `can_current_teacher_add_chat_member`.

## Validation
- Client: zod schemas + react-hook-form on all forms.
- Server: Edge Functions re-validate input (never trust client).
- `emailValidation.ts` utility used across signup flows.

## Sanitization
- No `dangerouslySetInnerHTML` in critical paths (or wrapped with DOMPurify where present).
- Images use `crossOrigin` + `no-referrer` (see `mem://technical/image-loading-security-v2`).

## CSRF
- SPA + JWT bearer tokens → no CSRF surface (no cookie-based auth for the app API).
- Webhook endpoints (UddoktaPay, Resend inbound) verify provider signatures.

## XSS
- React auto-escapes strings.
- User-generated content sanitized before render.

## SQL Injection
- All DB access via PostgREST / supabase-js parameterized queries. No dynamic SQL from client.

## Rate Limiting
- Supabase Edge Functions: platform-default limits.
- Public API clients (`api_clients`) rate-limited per row.
- OTP throttled server-side.

## Passwords / Sessions
- Passwords hashed by Supabase Auth (never stored plaintext).
- Sessions in browser storage via supabase-js.
- Password reset via `/forgot-password` → Supabase magic link → `/reset-password`.

## Cookies
- App primarily uses `localStorage` (SPA) for auth.
- GA4 sets analytic cookies (users notified via privacy statement).

## Security Headers
Applied at CDN (Cloudflare Transform Rules): CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy. See `mem://technical/security-headers-server-config-v1`.

## Secrets Management
- Publishable / anon keys — safe in code.
- Service role, Cloudinary, UddoktaPay, Resend, Telegram, Lovable AI — Supabase Vault only.
- `SUPABASE_SERVICE_ROLE_KEY` and DB password are **inaccessible** on Lovable Cloud and never fetched.
- `LOVABLE_API_KEY` rotated via platform tool only.

## Student Data
- `delete-student` Edge Function performs full DB wipe on admin request.
- Enrollment requests deleted immediately on approve/reject (no stale records).

## Logging
- No PII in client logs.
- Server logs redact passwords + tokens.
- Telegram notifications include names/emails only for admin visibility.

## Known Accepted Risks
- Public buckets `avatars`, `media-uploads` are intentionally readable (public content).
- Publishable Supabase key intentionally shipped in bundle (RLS enforced).
