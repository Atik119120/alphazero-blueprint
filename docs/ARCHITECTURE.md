# Architecture

## Stack
- **Frontend:** React 18 + Vite 5 + TypeScript 5 + Tailwind CSS v3 + shadcn/ui
- **Backend:** Lovable Cloud (Supabase) — Postgres, Auth, Storage, Edge Functions, Realtime
- **Deployment:** Frontend on Vercel/Netlify; backend persists independently on Supabase
- **Payments:** UddoktaPay (GET return_type)
- **Email:** Resend (transactional + inbound webhook)
- **Notifications:** Telegram Bot API
- **AI:** Lovable AI Gateway (Gemini for Alpha Assistant / vision metadata)

## Decoupled Architecture
Frontend deployment এবং Lovable subscription থেকে backend **independent** — subscription expire হলেও app চলবে।

## Directory Structure
```
src/
  components/
    admin/        # Admin dashboards
    teacher/      # Teacher panels (TeacherChatTab, etc.)
    student/      # Student LMS (StudentSupportChat, StudentRecordedClassesTab)
    ui/           # shadcn primitives
  pages/          # Route-level pages (CourseViewerPage, etc.)
  integrations/
    supabase/
      client.ts   # AUTO-GEN — never edit
      types.ts    # AUTO-GEN — never edit
  hooks/
  lib/
supabase/
  migrations/     # Timestamped SQL migrations
  functions/      # Edge Functions (create-admin, delete-student, ensure-student-onboarding, student-enrollment-notify, etc.)
  config.toml     # AUTO-GEN
docs/             # PRD, DESIGN, ARCHITECTURE, RULES, MEMORY
```

## Database Hierarchy
```
Courses → Modules → Videos
Courses ← enrollments → Students
Courses ← course_trainers → Teachers
Videos ← comments/qa, feedback, progress
```

## Auth & Roles
- `user_roles` table (separate) with enum `app_role: admin | teacher | student`
- `has_role(uuid, app_role)` SECURITY DEFINER function
- RLS everywhere; GRANT on every public table
- Never store roles on `profiles`

## Security
- Strict RLS on `profiles`, `enrollments`, `chat_messages`, etc.
- Admin-only Edge Functions for destructive ops (delete-student)
- Teacher data isolation (only own students/courses)
- Video: VideoJS anti-forward seek, `max_watched_time` enforced
- CSP headers via Cloudflare Transform Rules
- Passwords redacted from logs

## Realtime
- Supabase channels for chat + onboarding
- `ensure-student-onboarding` edge function on first login

## Content Binding
- CMS uses Bengali DB keys for dynamic content
- Fallback hierarchy: DB key → site_settings → hardcoded default
- API config strips trailing `/api`

## Search
- Bilingual global search with AI edge function fallback
