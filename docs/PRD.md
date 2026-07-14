# Product Requirements Document (PRD)

## Product Name
**AlphaZero** — Bilingual Digital Agency + Learning Management System (LMS)

## Vision
AlphaZero একটি bilingual (বাংলা + English) platform যেখানে একদিকে digital agency services (branding, marketing, web/app development) এবং অন্যদিকে একটি complete LMS (recorded + live courses, certificates, teacher panel) থাকে।

## Target Users
1. **Students** — যারা course কিনে শিখবে (recorded/live)।
2. **Teachers/Trainers** — যারা course এর video, materials, live class, chat manage করবে।
3. **Admins** — যারা platform, users, payments, content সব manage করবে।
4. **Agency Clients** — যারা service কিনবে।

## Core Features

### Public Site
- Bilingual landing page (Bangla / English toggle)
- Services / Pricing / Team / Entrepreneurs showcase
- Contact + WhatsApp integration
- SEO optimized (JSON-LD, canonical, sitemap)

### Authentication
- Phone-mandatory signup
- Email OTP verification
- Google OAuth
- Role hierarchy: Admin > Teacher > Student
- Turnstile bot protection

### LMS (Student)
- Course browse + enroll (direct DB enrollment, UddoktaPay checkout)
- Course viewer: fixed video top + scrollable class list sidebar
- Secure YouTube video (anti-forward seek, 90% completion threshold)
- Course materials (PDF viewer)
- Comment/Q&A per lesson
- Post-video feedback (thumbs up/down)
- Certificate generation (free vs paid logic)
- Support chat with teachers (single-room per teacher-student pair)

### LMS (Teacher)
- Assigned courses only (data isolation)
- Upload video, materials, live class
- View enrolled students (read-only details)
- Chat with own students only
- Revenue split visibility

### LMS (Admin)
- Full CRUD on courses, modules, videos, materials
- Assign trainers to courses
- Manage students (delete via secure Edge Function)
- Payment/API key management
- CMS for dynamic bilingual content
- Team management (unlimited social links)
- Alpha Assistant (Gemini vibe coding + vision metadata)
- Email support system (Resend)
- Telegram enrollment notifications

### Payments
- UddoktaPay (primary, BDT)
- Revenue split: Recorded, Live, Agency projects (different formulas)

## Success Metrics
- Student course completion rate (via 90% watched)
- Enrollment conversion (checkout success)
- Teacher activity (uploads, chat responses)
- Platform uptime + video security (no leak)

## Non-Goals
- No anonymous signup
- No re-adding pass-code enrollment system
- No re-adding video gallery module
- No floating chatbot widget in student area
