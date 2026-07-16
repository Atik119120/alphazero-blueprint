# Features

Each feature end-to-end, linking pages → components → tables → functions.

## Bilingual UX
`LanguageContext` toggles Bangla ↔ English. Every string, font, hero image swaps. No mixed script in one view.

## Authentication
Phone-mandatory signup + email OTP (`send-otp`, `verify-otp`) + Cloudflare Turnstile. Roles in `user_roles`. Hierarchy: admin > teacher > student. `ensure-student-onboarding` bootstraps profile + role.

## Course Catalog & Enrollment
`useCourses` / `usePublicCourses` power `CoursesPage`. Direct enrollment (pass-code system removed) — admin assigns via `CourseManagement`; paid enrollment flows through `CustomCheckoutPage` → UddoktaPay → `uddoktapay-verify` → `student_courses` row.

## Course Viewer (LMS)
`CourseViewerPage` with **locked layout** — video fixed on top, sidebar scrolls only. `SecureVideoPlayer` uses VideoJS + YouTube plugin: no forward seek, resumes from `max_watched_time`, marks complete at 90 %.

## Q&A / Comments
`LessonComments` writes to `lesson_comments`; teachers/admin reply, threaded. Realtime updates via Supabase channel.

## Feedback
Thumbs up/down per video → `video_feedback`, aggregated in `FeedbackViewer`.

## Certificates
`course_completions` triggers `certificates` row with `CERT-XXXXXXXX` id (`generate_certificate_id`). Rendered via html2canvas + jsPDF. Public verify at `/verify-certificate`.

## Live Classes
`live_classes` scheduled by teacher/admin, embedded via `YouTubeLiveEmbed` + `LiveStatusBadge`. Attendance tracked in `live_class_attendance`.

## Recorded Classes
`recorded_classes` archive, browsable in `StudentRecordedClassesTab`.

## Chat
One `chat_rooms` row per teacher-student pair. `chat_messages` realtime. Teacher-side shows student profile name (per rule).

## Notices
Admin/teacher broadcast → `notices`; per-user read receipts in `notice_reads`.

## Support Tickets
`support_tickets` (`TKT-XXXXXXXX`) with `ticket_messages` thread. Teacher and admin both handle.

## Revenue Split
`calculate_revenue_split(amount, type)` — 40/60 recorded, 70/30 live, 80/20 paid work, 0/0 free. Records in `revenue_records`. Teacher earnings in `TeacherEarningsTab`; withdrawals via `withdrawal_requests`.

## Coupons
`coupons` table (retained; direct-enrollment flow bypasses in current UI).

## Team & Portfolio (Public)
`team_members` synced with teacher profiles; unlimited custom links via `team_member_custom_links`. Public `works` portfolio with hero editor.

## CMS
Admin edits Homepage sections, Landing pages, Footer, Page hero, Page content (Bengali keys), Services, Works, About, Learn pages, Contact info, Site settings — every table has a dedicated admin module.

## Email
Resend integration: `send-welcome-email`, `send-custom-email`, `send-invoice-email`, plus inbound webhook → `email_threads` / `email_messages`. Sender identities managed via `sender_identities`.

## Telegram Notifications
`student-enrollment-notify` pings admin bot on new enrollment.

## AI
- **Alpha Assistant** (admin) — Gemini 2.5 via Lovable AI Gateway (`admin-ai-assistant`), vision + metadata + vibe-coding ops.
- **Alpha One** (public chatbot) — `ai-assistant`, multimedia via `media-uploads` bucket.
- **Search fallback** — SearchModal falls back to AI edge if no local match.

## Media
- Cloudinary signed upload (`sign-upload` + `upload-video`) for videos up to 10 MB chunks.
- Supabase Storage (`avatars`, `media-uploads`) via `ImageUploader`.
- All images use `no-referrer` + `crossOrigin` for security.

## Search & SEO
Bilingual global search; JSON-LD founder identity; per-page `<Helmet>` overrides. See [`SEO.md`](./SEO.md).

## Analytics
GA4 `G-TKCXDY69Q9` embedded in `index.html`.
