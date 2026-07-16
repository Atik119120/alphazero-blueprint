# Application Workflow

## Visitor
1. Lands on `/` (or Learn `/` on `learn.*`).
2. Preloader plays once, SmoothScroll (Lenis) enabled.
3. Browses Services / Works / Team / Courses.
4. Optional: opens global search (SearchModal), chats with Alpha One bot.

## Registration (Student)
1. Visits `/student/login` → switches to Sign Up.
2. Enters name, phone (mandatory), email, password + solves Turnstile.
3. `send-otp` emails a 6-digit code; user submits → `verify-otp` → Supabase session.
4. `ensure-student-onboarding` inserts `profiles` row + `user_roles(role=student)`.
5. `send-welcome-email` fires; Telegram admin ping fires on first enrollment.

## Login
- Student → `/student/login`, Teacher → `/teacher/login` (requires `teacher_approved`), Admin → `/admin/login`.
- On success, `/dashboard` routes by role via `AuthContext`.

## Course Purchase
1. Student opens `CoursesPage` or Course landing.
2. Requests enrollment → creates `enrollment_requests` (or admin pre-creates invoice).
3. `CustomCheckoutPage` (`/pay/:invoiceId`) → `uddoktapay-checkout` → UddoktaPay hosted checkout.
4. Callback `/payment/callback` → `uddoktapay-verify` → inserts `student_courses(is_active=true)` and `revenue_records` split row.
5. Confirmation email via `send-invoice-email`.

## Course Learning
1. Student opens `/student/course/:courseId`.
2. `SecureVideoPlayer` loads YouTube source, forces sequential playback.
3. `video_progress.max_watched_time` updates in realtime; completion at 90 % marks `completed=true`.
4. Comments/Q&A + Feedback saved per video.
5. On course completion → row in `course_completions` → certificate auto-issued.

## Certificate
1. `certificates` row created with `CERT-XXXXXXXX`.
2. Student views on `/my-certificates` → downloads PDF (html2canvas + jsPDF).
3. Public verify via `/verify-certificate` → `verify-certificate` Edge Function.

## Teacher Workflow
1. Admin creates teacher via `create-teacher` (approved=true).
2. Teacher logs in, sees only assigned courses/students (RLS).
3. Uploads videos via `TeacherVideoManager` → Cloudinary (`sign-upload` + `upload-video`).
4. Schedules live classes, answers Q&A, chats with students, handles tickets.
5. Views earnings (auto-split), requests withdrawal.

## Admin Workflow
- Manage CMS, users, courses, coupons, APIs, emails, notices.
- Alpha Assistant handles bulk content operations via Gemini.
- Approves enrollments manually if needed (`approve-enrollment`).

## Content Publishing
Admin edits any CMS module → react-query mutation → table update → hooks refetch → UI updates. Images uploaded through shared `ImageUploader` → Supabase Storage.

## Logout
Supabase `signOut()` clears session; router redirects to `/`.
