# Routes

All routes defined in `src/App.tsx` using `react-router-dom` v7. Route guards live inside each page (via `AuthContext`). LMS routes skip the preloader.

## Public (marketing)
| Path | Component | Notes |
|---|---|---|
| `/` | `Index` (or `CoursesPage` on `learn.*`) | Home |
| `/about` | `AboutPage` (or `LearnAboutPage` on `learn.*`) | About |
| `/services` | `ServicesPage` | Services + pricing |
| `/work` | `WorkPage` | Portfolio |
| `/team` | `TeamPage` | Team grid |
| `/join-team` | `JoinTeamPage` | Recruiting |
| `/contact` | `ContactPage` (or `LearnContactPage` on `learn.*`) | Contact |
| `/learn-contact` | `LearnContactPage` | Learn contact |
| `/courses` | `CoursesPage` | Catalog + trainers marquee |
| `/instructors` | `CoursesPage` | Alias |
| `/vibe-coding`, `/courses/vibe-coding` | `CourseLandingPage` | Landing |
| `/verify-certificate` | `VerifyCertificatePage` | Public verify |
| `/certificate/:certificateId` | `CertificatePage` | Public certificate view |

## Auth
| Path | Component |
|---|---|
| `/student/login` | `StudentLoginPage` |
| `/teacher/login` | `TeacherLoginPage` |
| `/admin/login` | `AdminLoginPage` |
| `/auth` | `StudentLoginPage` (alias) |
| `/forgot-password` | `ForgotPasswordPage` |
| `/reset-password` | `ResetPasswordPage` |
| `/dashboard` | `DashboardPage` (role-based redirect) |

## Student
| Path | Component | Guard |
|---|---|---|
| `/student` | `StudentDashboard` | role=student |
| `/student/course/:courseId` | `CourseViewerPage` | enrolled |
| `/my-certificates` | `MyCertificatesPage` | authed |

## Teacher
| Path | Component | Guard |
|---|---|---|
| `/teacher` | `TeacherDashboard` | role=teacher + approved |

## Admin
| Path | Component | Guard |
|---|---|---|
| `/admin` | `AdminDashboard` | role=admin |

## Payments
| Path | Component |
|---|---|
| `/pay/:invoiceId` | `CustomCheckoutPage` |
| `/payment/callback` | `PaymentCallbackPage` |
| `/payment/cancel` | `PaymentCancelPage` |

## Fallback
| Path | Component |
|---|---|
| `*` | `NotFound` |

## Middleware
No server middleware — access control is enforced client-side via `AuthContext` + server-side via Supabase RLS. SPA routing uses `public/_redirects` (see `mem://technical/spa-routing-configuration`).

## Sub-brand routing
When `window.location.hostname.startsWith('learn.')`, `/`, `/about`, `/contact` render the Learn variants and favicons swap (script in `index.html`).
