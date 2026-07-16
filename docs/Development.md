# Development Guide

## Prerequisites
- Node.js ≥ 18
- Bun (recommended) or npm/pnpm
- A Supabase project already provisioned by Lovable Cloud (auto)

## Setup
```bash
bun install
bun run dev        # http://localhost:8080
```

`.env` is auto-managed by Lovable Cloud — don't remove Supabase vars.

## Scripts
| Command | Purpose |
|---|---|
| `bun run dev` | Vite dev server (port 8080) |
| `bun run build` | Production build → `dist/` |
| `bun run build:dev` | Dev-mode build |
| `bun run preview` | Serve built dist |
| `bun run lint` | ESLint |

## Coding Style
- TypeScript strict.
- Prefer function components + hooks.
- One component per file. Keep components < 250 lines when possible.
- Use `@/` alias for `src/` imports.
- Never edit `src/integrations/supabase/*` (auto-generated).
- Semantic tokens only — never hardcoded colors.

## Naming
- Components `PascalCase`, hooks `useCamelCase`, utilities `camelCase`, tables `snake_case`, routes `kebab-case`.

## Git Strategy
- Trunk-based with feature branches: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`.
- Conventional commits (`feat:`, `fix:`, `docs:` …).
- Small PRs, one logical change per commit.
- Never commit `.env` values or secrets.

## Testing
Currently no automated test suite. Manual QA checklist:
1. Signup + login flow (student/teacher/admin).
2. Course enrollment → payment → viewer → certificate.
3. Chat + notices realtime.
4. Language toggle across every page.
5. Dark and light theme.
6. Mobile (320–768 px) and desktop (≥ 1024 px).

## Debugging
- Console logs + network tab in browser DevTools.
- Supabase → Edge Functions → Logs for server errors.
- GA4 real-time for production.
- Telegram bot mirrors enrollment events.
- Use Playwright script harness for reproducing runtime bugs.

## Adding a Feature (workflow)
1. Read `docs/PRD.md` — is it in scope? Any non-goal violation?
2. Read `docs/ARCHITECTURE.md` + `docs/RULES.md`.
3. Plan DB changes → write migration with `CREATE TABLE → GRANT → RLS → POLICY`.
4. Add hook in `src/hooks/`, page in `src/pages/`, components in the correct role folder.
5. Update SEO tags via Helmet.
6. Update `docs/*.md` + `mem://index.md` if a decision changed.

## Deployment
See [`Deployment.md`](./Deployment.md).
