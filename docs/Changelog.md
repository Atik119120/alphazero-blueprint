# Changelog

All notable project decisions. Loosely follows [Keep a Changelog].

## [Unreleased]
- Full `/docs` folder introduced (this documentation set).
- Courses page trainers strip converted to CSS marquee (auto-scroll, hover-pause).
- Courses page grid re-tuned: 2-col gaps → 5 then 6 across; larger cards.

## v4 — 2026
- Alpha Assistant (admin) upgraded to Gemini 2.5 Vibe Coding with vision + metadata ops.
- Certificates system v4 (free vs paid logic, html2canvas + jsPDF).
- Security hardening v4 (admin-only functions, password redaction, student RLS).
- Database schema profiles v4 (mandatory phone, avatar_url, admin sync).

## v3
- Cloudinary adaptive streaming (HLS/DASH) integrated.
- Realtime onboarding + `ensure-student-onboarding` Edge Function.
- Telegram notifications for enrollments.
- Teacher panel v3 (data isolation, read-only student details).
- Team management v3 (unlimited custom social links).
- GA4 (`G-TKCXDY69Q9`) wired.
- Preloader exceptions for LMS routes.

## v2
- **Decoupled architecture** — React frontend on Vercel/Netlify, Supabase persists independently.
- Direct enrollment replaces pass-code system (pass-code retained as legacy).
- LMS database hierarchy consolidated (Courses → Modules → Videos).
- Dual-language courses (English + Bangla columns).
- Course materials system v2 (embedded PDF viewer).
- Media upload system v2 (reusable `ImageUploader`).
- Cloudinary chunked upload architecture v2.
- Image loading security v2 (`no-referrer` + `crossOrigin`).
- Email/support system v2 (custom outbound HTML via admin).
- LMS revenue logic v2 (40/70/80 splits formalized).
- LMS UI language theme v5 (Playfair + Hind Siliguri).

## v1
- Initial launch: agency site + LMS foundation.
- Phone-mandatory signup + email OTP + Turnstile.
- Roles table (`user_roles`) with SECURITY DEFINER `has_role`.
- UddoktaPay checkout integration.
- Resend transactional email.

## Removed
- Pass-code enrollment UI.
- Video gallery module.
- Floating AIChatbot inside student area.
