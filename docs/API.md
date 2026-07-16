# API Reference

Two API surfaces: **Supabase PostgREST** (auto-generated from the DB schema, secured by RLS) and **Edge Functions** (custom serverless endpoints).

## Auth
All endpoints require a Supabase JWT (`Authorization: Bearer <access_token>`) except explicitly public ones. Client injects it automatically via `@/integrations/supabase/client`.

## Internal REST (PostgREST)
Base: `${VITE_SUPABASE_URL}/rest/v1`. One resource per public table. Access controlled entirely by RLS + `user_roles`. See [`Database.md`](./Database.md) for tables.

## Edge Functions (`supabase/functions/*`)

| Function | Method | Purpose | Auth |
|---|---|---|---|
| `send-otp` | POST | Email OTP for signup/login | Public |
| `verify-otp` | POST | Verify OTP + issue session | Public |
| `ensure-student-onboarding` | POST | Create profile + student role after signup | User |
| `create-admin` | POST | Provision admin account (bootstrap) | Service key |
| `create-teacher` | POST | Admin creates teacher | Admin |
| `create-student` | POST | Admin creates student manually | Admin |
| `delete-student` | POST | Full DB wipe of student | Admin |
| `approve-enrollment` | POST | Approve pending enrollment | Admin |
| `public-enrollment` | POST | Create enrollment request | Public |
| `public-course-info` | GET | Fetch course info without auth | Public |
| `uddoktapay-checkout` | POST | Start UddoktaPay session | User |
| `uddoktapay-verify` | POST | Verify payment callback | Public (signed) |
| `uddoktapay-refund` | POST | Refund a payment | Admin |
| `api-create-payment` / `api-checkout-start` / `api-checkout-info` / `api-payment-callback` / `api-verify-payment` | Mixed | Public API for third-party clients (`api_clients` table) | API key |
| `sign-upload` | POST | Cloudinary signature for direct upload | User |
| `upload-video` | POST | Register uploaded video row | Teacher/Admin |
| `migrate-images` | POST | One-off asset migration | Admin |
| `send-welcome-email` | POST | Resend on signup | Trigger |
| `send-custom-email` | POST | Admin outbound email | Admin |
| `send-invoice-email` | POST | Send checkout invoice | Trigger |
| `email-inbound-webhook` | POST | Resend inbound webhook → `email_threads`/`email_messages` | Resend signature |
| `student-enrollment-notify` | POST | Telegram admin ping | Trigger |
| `verify-certificate` | GET | Public certificate verification | Public |
| `admin-ai-assistant` | POST | Alpha Assistant (Gemini 2.5 via Lovable AI Gateway) | Admin |
| `ai-assistant` | POST | Public Alpha One chatbot | Public |

## External APIs
- **Lovable AI Gateway** – Gemini text/vision (assistants, search fallback)
- **UddoktaPay** – payments (bKash, Nagad, cards)
- **Cloudinary** – signed video/image uploads + delivery
- **Resend** – transactional and inbound email
- **Telegram Bot API** – admin notifications
- **Google Analytics 4** – `G-TKCXDY69Q9`
- **YouTube IFrame API** – SecureVideoPlayer + live embed

## Errors
Standard shape: `{ error: string, code?: string }` with matching HTTP status. Client wraps via react-query and surfaces toasts.

## Rate Limits
- Supabase Edge Functions: platform defaults.
- UddoktaPay / Resend / Telegram: provider limits apply.
- Public API clients rate-limited per `api_clients` row.

## Security
- No secret keys shipped to client. Publishable anon key is safe (RLS-enforced).
- All admin functions re-check `has_role(auth.uid(), 'admin')` server-side.
- Webhook endpoints verify provider signatures.
