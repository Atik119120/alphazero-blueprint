---
name: docs-source-of-truth
description: docs/ folder holds PRD, DESIGN, ARCHITECTURE, RULES, MEMORY — always consult before major changes
type: reference
---
Project source-of-truth documentation lives in `docs/`:
- `docs/PRD.md` — Product requirements, users, features, non-goals
- `docs/DESIGN.md` — Aesthetic direction, typography, tokens, layout rules
- `docs/ARCHITECTURE.md` — Stack, directory structure, DB hierarchy, security
- `docs/RULES.md` — Hard rules for code, backend, auth, LMS, chat, layout
- `docs/MEMORY.md` — Consolidated persistent decisions

Rules of use:
1. Before adding a feature, check PRD (is it in scope? does it violate non-goals?)
2. Before UI change, follow DESIGN.md (glassmorphism, Playfair/Hind Siliguri, semantic tokens only)
3. Before backend/schema change, follow ARCHITECTURE.md + RULES.md (GRANT + RLS + policies pattern, user_roles separate)
4. Never violate the "Removed / Forbidden" list in MEMORY.md:
   - No pass-code enrollment
   - No video gallery module
   - No floating AIChatbot in student area
   - No roles on profile table
   - No hardcoded colors bypassing tokens
   - No editing auto-gen Supabase files
5. Course Viewer layout is locked: video fixed top, only sidebar scrolls
6. Chat: single room per teacher-student pair, teacher sees student profile names
7. When user states a new decision, update the relevant docs/*.md AND mem://index.md Core if universal
