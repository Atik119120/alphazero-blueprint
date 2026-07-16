# Database

**Engine:** Postgres (Supabase / Lovable Cloud).
**Access:** PostgREST + supabase-js. **All** public tables have RLS enabled and explicit `GRANT`s. Roles live in `public.user_roles` (never on `profiles`).

## Roles enum (`app_role`)
`admin`, `teacher`, `student`.

## Key security functions (SECURITY DEFINER)
- `has_role(uuid, app_role) → bool`
- `is_teacher(uuid) → bool`
- `is_chat_room_member(room, user) → bool`
- `is_student_of_current_teacher(uuid) → bool`
- `is_teacher_of_current_student(uuid) → bool`
- `is_progress_visible_to_teacher(student, video) → bool`
- `can_current_user_add_chat_member(...)`, `can_current_teacher_add_chat_member(...)`
- `user_has_course_access(user, course) → bool`
- `get_user_pass_code(uuid) → text` (legacy)
- `calculate_revenue_split(amount, type) → (teacher_share, agency_share, teacher_pct, agency_pct)`
- `generate_pass_code()`, `generate_certificate_id()`, `generate_ticket_number()`
- `make_admin(email)` (admin-only)
- `update_updated_at_column()`, `update_thread_last_message()` (triggers)
- `auto_create_pass_code_on_role()` / `auto_create_pass_code_for_student()` (legacy retained for backfill)

## Tables (47)

| Table | Purpose |
|---|---|
| `profiles` | User profile (mandatory phone, avatar, email). One row per `auth.users`. |
| `user_roles` | Role assignments (unique `user_id + role`). |
| `courses` | Course catalog, bilingual columns, teacher_id FK. |
| `course_modules` | Modules inside a course. |
| `course_topics` | Topics inside a module. |
| `videos` | Video lessons (Cloudinary-hosted). |
| `video_materials` | PDFs / docs per video. |
| `video_progress` | Per-user watch state (max_watched_time, completed). |
| `video_feedback` | Thumbs up/down per lesson. |
| `lesson_comments` | Threaded Q&A per video. |
| `student_courses` | Enrollments (user_id + course_id + is_active). |
| `enrollment_requests` | Pending enrollment requests. |
| `course_completions` | Completion records → drive certificates. |
| `certificates` | Issued certificates (`certificate_id` = `CERT-XXXXXXXX`). |
| `pass_codes` / `pass_code_courses` | Legacy pass-code system (retained, unused). |
| `live_classes` | Scheduled live sessions (YouTube-based). |
| `live_class_attendance` | Attendance rows. |
| `recorded_classes` | Recording archive. |
| `chat_rooms` | One per teacher-student pair. |
| `chat_room_members` | Membership. |
| `chat_messages` | Realtime messages. |
| `notices` | Broadcast notices. |
| `notice_reads` | Per-user read receipts. |
| `support_tickets` | Student → teacher/admin tickets (`TKT-XXXXXXXX`). |
| `ticket_messages` | Ticket thread. |
| `email_threads` / `email_messages` | Resend inbound/outbound threads. |
| `sender_identities` | Verified Resend senders. |
| `disposable_email_domains` | Signup blocklist. |
| `otp_codes` | Email OTP challenges. |
| `coupons` | Discount codes. |
| `paid_works` | Agency projects assigned to teachers. |
| `works` | Public portfolio items. |
| `services` | Marketing services list. |
| `revenue_records` | Split records (uses `calculate_revenue_split`). |
| `withdrawal_requests` | Teacher payout requests. |
| `team_members` / `team_member_custom_links` | Public team + unlimited custom social links. |
| `gallery_videos` | (Legacy – gallery module removed.) |
| `homepage_sections` / `homepage_section_items` | CMS blocks for `/`. |
| `page_content` | Key-value CMS content (Bengali keys). |
| `page_hero` (via `page_content`) | Hero backgrounds per route. |
| `footer_content` / `footer_links` | Footer CMS. |
| `site_settings` | Global settings (contact, socials, API fallback). |
| `api_clients` / `api_payments` | Public payment API for third parties. |

## Storage Buckets
- `avatars` (public)
- `media-uploads` (public)

## Grants pattern (every new table)
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON public.<t> TO authenticated;
GRANT ALL ON public.<t> TO service_role;
-- add GRANT SELECT ... TO anon ONLY if a policy allows anon reads.
```

## Constraints & Indexes
- Unique: `user_roles(user_id, role)`, `student_courses(user_id, course_id)`, `enrollment_requests` uniqueness prevents duplicates.
- FKs cascade from `auth.users` via `profiles.user_id`.
- Triggers: `update_updated_at_column` on tables with `updated_at`; `update_thread_last_message` on `email_messages`.

## Future
- Materialized views for revenue/analytics dashboards.
- Partitioning `chat_messages` by month if volume grows.
