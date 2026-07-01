# InfinitySheets Clone — PRD

## Original Problem Statement
Clone `https://infinitysheets.netlify.app/#dashboard-view` as a pixel-perfect, fully functional MVP with:
- Replicated Landing Page and Dashboard UI
- Personalized exam prep (Worksheets, Mistake tracking, Subject Overviews)
- Dark Mode & Demo Mode
- Multi-subject Course Onboarding wizard, interactive Tutorial, Progress analytics
- Frontend-only w/ localStorage now; FastAPI/MongoDB + AI generation later

## Tech Stack
- **Frontend**: React + TailwindCSS + Shadcn UI + Recharts + Lucide-React
- **State**: React Context (`AppContext.jsx`) + localStorage persistence
- **Backend**: FastAPI + Motor (MongoDB async) — boilerplate only, not yet wired to frontend
- **Planned**: Emergent LLM Key for adaptive worksheet generation

## Design System (as of Feb 2026)
- **Primary**: Royal Blue `#2563eb`
- **Secondary**: Purple `#7c3aed`
- **Tertiary**: Red `#dc2626`
- **Success**: Emerald `#10b981`
- **Dark Mode**: True off-black `#0a0a0a` (bg), `#171717` (cards)
- **No gradients, no glow shadows, no blur decorations** — clean flat design
- **No emojis** — all iconography via Lucide-React; subject badges use letter symbols (M, P, C, B, etc.)
- Sharp corners (custom rounded overrides in CSS), Instrument Serif for italic accents

## Completed
- Landing page (Hero, WhatIs, HowItWorks, Features, Research, ExamPathways, Pricing, Testimonials, Signup, FinalCTA, Footer)
- Dashboard app (AppShell, Dashboard, MyCourses, StartStudying, Worksheets, WorksheetHistory, QuestionBank, ProgressView, Strengths, Mistakes, Recommendations, Profile, Settings, SubjectOverview)
- Multi-subject Course Wizard with per-subject exam dates
- 5-step interactive tutorial overlay with DOM highlighting
- Dark Mode + Demo Mode + Reset Demo flow
- Line-chart Progress View tracking % deltas over time
- Hand-drawn laboratory/cobweb empty state scenes
- **Feb 2026**: Color palette swap → Royal Blue primary / Purple secondary / Red tertiary; removed all gradients, glows, and emojis (Lucide icons + letter symbols); dark mode changed to true off-black

## In Progress
- None

## P0 Backlog — Backend Integration & AI
- Phase 1: FastAPI models & endpoints (Users, Courses, Worksheets, Progress, Mistakes)
- Phase 2: Emergent LLM Key integration for AI-generated worksheets
- Phase 3: Wire AppContext.jsx to real API, remove localStorage mocks

## P1 Backlog — Authentication
- Real registration/login (JWT custom or Emergent Google OAuth)

## P2 Backlog — Refactoring
- Split AppShell.jsx, SubjectOverview.jsx, StudyPlanModal.jsx into sub-components
- Replace index-as-key with stable UUIDs in list maps
- Fix minor React Hook useMemo dependency warnings in QuestionBank/ProgressView

## Key Files
- `/app/frontend/src/index.css` — CSS variables, dark mode overrides, global gradient/glow suppression
- `/app/frontend/src/data/mock.js` — SUBJECT_INFO (letter symbols), SUBJECTS, question bank
- `/app/frontend/src/context/AppContext.jsx` — global state + localStorage
- `/app/frontend/src/components/app/AppShell.jsx` — sidebar (Lucide icons), routing, theme toggle
- `/app/frontend/src/components/decor/` — InfinityBackground, StudyDecor, EmptyStateScene

## Health
- All services running via supervisor (hot-reload enabled)
- Broken: None
- Mocked: DB, Auth, AI worksheet generation, Study Plans
