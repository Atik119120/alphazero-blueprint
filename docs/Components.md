# Components Reference

Only project-specific components documented — shadcn/ui primitives in `components/ui/*` follow shadcn conventions and are not re-documented here.

## Shell / Layout
| Component | Purpose |
|---|---|
| `Layout.tsx` | Base page wrapper (Navbar + Footer + children) |
| `Navbar.tsx` | Main-site sticky nav, language toggle, login CTA |
| `CoursesNavbar.tsx` | Nav variant for Learn sub-brand |
| `Footer.tsx` | CMS-driven footer (uses `useFooterData`) |
| `CoursesFooter.tsx` | Learn variant footer |
| `NavLink.tsx` | Active-aware nav link with underline motion |
| `Preloader.tsx` | Initial brand preloader (skipped on LMS routes) |
| `PageTransition.tsx` | framer-motion fade wrapper |
| `ScrollToTop.tsx` | Restores scroll on route change |
| `SmoothScroll.tsx` | Lenis wrapper (marketing routes only) |
| `ScrollReveal.tsx` | IntersectionObserver reveal on scroll |
| `Reveal.tsx` | Per-element reveal helper |

## Feature
| Component | Purpose |
|---|---|
| `SecureVideoPlayer.tsx` | VideoJS + YouTube plugin, anti-forward-seek, 90 % completion event |
| `SearchModal.tsx` | Global bilingual search with AI edge fallback |
| `AIChatbot.tsx` | Public "Alpha One" chatbot (media-uploads bucket) |
| `HomeTeamSection.tsx` | Public team grid on home page |
| `ProjectMarquee.tsx` | Client/brand logo marquee |

## Admin (`components/admin/`)
25 modules mounted inside `pages/AdminDashboard.tsx` tabs, each managing one CMS domain:
`AboutPageEditor`, `AdminAssistant` (Gemini 2.5), `AdminSiteScopeSwitcher`, `ApiKeyManagement`, `CommentManagement`, `ContactInfoManagement`, `CouponManagement`, `CourseManagement`, `EmailInbox`, `EmailManagement`, `FeedbackViewer`, `FooterManagement`, `HomepageEditor`, `ImageUploader` (shared uploader), `LandingPageManagement`, `LearnPagesEditor`, `PageContentManagement`, `PageHeroEditor`, `PaymentApiManagement`, `ServicesManagement`, `SiteSettingsManagement`, `TeacherManagement`, `TeamManagement`, `WorkHeroEditor`, `WorksManagement`.

Each performs CRUD against its Supabase table via react-query mutations. All use semantic tokens.

## Student (`components/student/`)
`CourseEnrollmentModal`, `LessonComments`, `ProfilePhotoUpload`, `StudentChatTab`, `StudentIDCard` (barcode + QR), `StudentLiveClassesTab`, `StudentNoticesTab`, `StudentRecordedClassesTab`, `StudentSupportChat`.

## Teacher (`components/teacher/`)
`TeacherChatTab`, `TeacherCoursesTab`, `TeacherEarningsTab` (uses `calculate_revenue_split`), `TeacherLiveClassesTab`, `TeacherNoticesTab`, `TeacherPaidWorksTab`, `TeacherProfileTab`, `TeacherStudentsTab`, `TeacherTicketsTab`, `TeacherVideoManager`.

## Live (`components/live/`)
`YouTubeLiveEmbed`, `LiveStatusBadge`.

## Reusable Props Convention
- All feature components accept typed props (see file for exact shape).
- Prefer composition + shadcn primitives over new UI.
- Never duplicate — extend existing components (see [`Rules.md`](./Rules.md)).
