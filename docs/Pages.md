# Pages

Every route component in `src/pages/`. Data via hooks in `src/hooks/`. SEO managed with `react-helmet-async` per page.

## Marketing
### `Index.tsx` — `/`
Home. CMS-driven `homepage_sections` + Hero, ProjectMarquee, HomeTeamSection, services teaser. SEO: main title/description in `index.html`.

### `AboutPage.tsx` — `/about`
Founder story, agency milestones. Editable via `AboutPageEditor` in admin.

### `LearnAboutPage.tsx`
Learn sub-brand About; rendered when hostname `learn.*`.

### `ServicesPage.tsx` — `/services`
Services grid from `services` table + static `pricing.ts` (6 core policies). Anchors like `#logo-design` (see `mem://technical/pricing-navigation-logic`).

### `WorkPage.tsx` — `/work`
Portfolio from `works` table. Hero editable via `WorkHeroEditor`.

### `TeamPage.tsx` — `/team`
Team grid from `team_members` + custom social links. Syncs with teacher profiles.

### `JoinTeamPage.tsx` — `/join-team`
Recruiting form.

### `ContactPage.tsx` / `LearnContactPage.tsx` — `/contact`, `/learn-contact`
Dynamic contact info from `site_settings`. WhatsApp numeric sanitization applied.

### `CoursesPage.tsx` — `/courses`, `/instructors`
Course catalog + auto-scrolling trainer marquee (CSS `marquee-left`, pauses on hover).

### `CourseLandingPage.tsx` — `/vibe-coding`, `/courses/vibe-coding`
Standalone landing page for Vibe Coding course.

### `CertificatePage.tsx` — `/certificate/:certificateId`
Public certificate render (html2canvas / jsPDF export).

### `VerifyCertificatePage.tsx` — `/verify-certificate`
Public verification via `verify-certificate` Edge Function.

## Auth
### `StudentLoginPage.tsx`, `TeacherLoginPage.tsx`, `AdminLoginPage.tsx`
Phone + password / email OTP + Turnstile. Redirects via `/dashboard` after session.

### `DashboardPage.tsx` — `/dashboard`
Role router (admin/teacher/student).

### `ForgotPasswordPage.tsx`, `ResetPasswordPage.tsx`
Password recovery via Supabase Auth.

## Student
### `StudentDashboard.tsx` — `/student`
Tabs: Courses, Live Classes, Recorded Classes, Notices, Chat, Support, Certificates, Profile/ID Card.

### `CourseViewerPage.tsx` — `/student/course/:courseId`
Locked layout: video fixed top, only sidebar scrolls. `SecureVideoPlayer` + `LessonComments` + materials + feedback.

### `MyCertificatesPage.tsx` — `/my-certificates`
All issued certificates for the current user.

## Teacher
### `TeacherDashboard.tsx` — `/teacher`
Tabs: Courses, Students, Live Classes, Recorded Classes, Paid Works, Earnings, Notices, Chat, Support, Profile.

## Admin
### `AdminDashboard.tsx` — `/admin`
Tabs mount every admin module (see [`Components.md`](./Components.md)) including Alpha Assistant.

## Payments
### `CustomCheckoutPage.tsx` — `/pay/:invoiceId`
Custom invoice checkout → UddoktaPay.
### `PaymentCallbackPage.tsx` / `PaymentCancelPage.tsx`
Post-payment success/cancel routes; verify via `uddoktapay-verify`.

### `NotFound.tsx`
Branded 404.
