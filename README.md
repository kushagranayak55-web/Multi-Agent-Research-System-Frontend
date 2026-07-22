# MARS — Multi Agent Research System

A Product by Kushagra Nayak

This repository is the **frontend foundation** for MARS. It intentionally
does not yet contain the landing page, the research workspace UI, the
agent network graph, or the report/critic presentation — those are
built in subsequent phases on top of this scaffold. What's here is the
part that has to be right before any of that: routing, design tokens,
state architecture, and the API layer.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion ·
shadcn/ui conventions · Zustand · react-router-dom

## Getting started

```bash
npm install
cp .env.example .env.local   # then set VITE_API_BASE_URL
npm run dev
```

## Scripts

| Command           | Purpose                                   |
| ------------------ | ------------------------------------------ |
| `npm run dev`       | Local dev server                          |
| `npm run build`     | Type-check (`tsc -b`) + production build  |
| `npm run preview`   | Preview the production build locally      |
| `npm run lint`      | ESLint                                     |
| `npm run typecheck` | Type-check only, no emit                  |

## Environment variables

Defined and validated in one place: `src/config/env.ts`. Nothing else
in the app reads `import.meta.env` directly.

| Variable               | Required | Description                                  |
| ----------------------- | -------- | --------------------------------------------- |
| `VITE_API_BASE_URL`     | yes      | FastAPI backend origin, no trailing slash     |
| `VITE_API_TIMEOUT_MS`   | no       | Client request timeout (default `120000`)     |

Local dev: `.env.local` (gitignored). Production: set the same keys in
**Vercel → Project Settings → Environment Variables**.

## Folder structure

```
src/
├── App.tsx                  # Router provider mount
├── main.tsx                 # Entry point
├── index.css                 # Tailwind layers + design-token CSS variables
├── routes/
│   └── router.tsx            # createBrowserRouter route table
├── layouts/
│   └── RootLayout.tsx        # Providers + header/footer chrome + <Outlet/>
├── pages/
│   ├── LandingPage.tsx        # Placeholder — real build is a later phase
│   └── WorkspacePage.tsx      # Placeholder, wired to the real store/service
├── components/
│   ├── ui/                   # shadcn-pattern primitives (button, card, ...)
│   ├── layout/                # Header, Footer
│   ├── common/                 # ErrorBoundary and other cross-cutting UI
│   └── providers/               # ThemeProvider
├── features/                  # Reserved for phase-specific UI:
│   ├── agents/                  #   agent cards, status badges, timeline
│   ├── research/                 #   network graph, topic input
│   └── report/                    #   report viewer, critic panel, export
├── store/
│   ├── researchStore.ts          # Zustand: research run + agent state machine
│   └── uiStore.ts                 # Ephemeral UI-only state (nav, etc.)
├── services/
│   ├── api/
│   │   ├── client.ts                # fetch wrapper: timeout, retry, ApiError
│   │   ├── endpoints.ts               # named route paths
│   │   └── researchService.ts          # domain calls + response mapping
│   └── types/
│       └── research.types.ts            # backend + client-side domain types
├── hooks/
│   ├── useResearch.ts                    # ergonomic store accessor
│   └── useMediaQuery.ts                   # responsive breakpoint hook
├── lib/
│   ├── utils.ts                             # cn() class merge helper
│   └── constants.ts                          # routes, site copy, agent pipeline
└── config/
    └── env.ts                                 # validated environment config
```

# MARS — Multi Agent Research System

A Product by Kushagra Nayak

The complete production frontend for MARS: a landing page, a live research
workspace, an animated agent network graph, and a full report/critic
presentation — built on top of the foundation scaffold, wired to a FastAPI
backend contract.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion ·
shadcn/ui conventions · Zustand · react-router-dom · react-markdown

## Getting started

```bash
npm install
cp .env.example .env.local   # then set VITE_API_BASE_URL
npm run dev
```

## Scripts

| Command           | Purpose                                   |
| ------------------ | ------------------------------------------ |
| `npm run dev`       | Local dev server                          |
| `npm run build`     | Type-check (`tsc -b`) + production build  |
| `npm run preview`   | Preview the production build locally      |
| `npm run lint`      | ESLint                                     |
| `npm run typecheck` | Type-check only, no emit                  |

## Environment variables

Defined and validated in one place: `src/config/env.ts`. Nothing else
in the app reads `import.meta.env` directly.

| Variable               | Required | Description                                  |
| ----------------------- | -------- | --------------------------------------------- |
| `VITE_API_BASE_URL`     | yes      | FastAPI backend origin, no trailing slash     |
| `VITE_API_TIMEOUT_MS`   | no       | Client request timeout (default `120000`)     |

Local dev: `.env.local` (gitignored). Production: set the same keys in
**Vercel → Project Settings → Environment Variables**.

## Backend contract

```
POST {VITE_API_BASE_URL}/research
Body: { "topic": string }

200 response:
{
  "search_result": string,
  "scraped_content": string,
  "report": string,
  "feedback": string
}
```

`src/services/api/researchService.ts` maps this into the UI-facing
`ResearchResult` type, including a best-effort parser that extracts
score / strengths / areas-to-improve / verdict out of the free-text
`feedback` field (see the `parseCriticFeedback` TODO for what changes
once the Critic Agent returns structured JSON).

## What was built, by phase

1. **Landing page** — hero, agent showcase (real input→output data flow
   per agent, not generic feature cards), "How MARS Works" timeline,
   "Why Multi-Agent Systems" technical comparison, CTA.
2. **Research workspace** — topic input with real example topics, an
   idle empty state, and the running/failed/completed layout.
3. **Agent network visualization** — the shared `AgentNetworkGraph`
   (used live in both the hero showcase-loop and the workspace),
   `ExecutionTimeline`, and `AgentActivityFeed`, all driven by real
   agent state transitions.
4. **Report experience** — `ReportViewer` (react-markdown with fully
   custom, token-based element styling), collapsible Search/Reader
   output panels, and `DownloadMenu` (real Markdown export + print-to-PDF).
5. **Critic experience** — `ScoreGauge` (SVG ring) and `CriticPanel`,
   which renders only the sections the parser actually found.
6. **FastAPI integration hardening** — request cancellation, a Render
   cold-start-aware "backend waking up" notice, and a Retry action on
   failure.
7. **Production polish** — 404 page, OG/Twitter meta tags, robots.txt,
   scroll-to-top on navigation, final lint/build verification.

## Folder structure

```
src/
├── App.tsx / main.tsx / index.css
├── routes/router.tsx              # includes the 404 catch-all
├── layouts/RootLayout.tsx          # + ScrollToTop
├── pages/
│   ├── LandingPage.tsx              # composes features/landing/*
│   ├── WorkspacePage.tsx             # composes features/research + report
│   └── NotFoundPage.tsx
├── components/
│   ├── graph/                        # AgentNetworkGraph, layout data, showcase loop
│   ├── ui/                            # Button, Card
│   ├── layout/                         # Header, Footer
│   ├── common/                          # ErrorBoundary, ScrollToTop, SectionHeading, CollapsiblePanel
│   └── providers/                        # ThemeProvider
├── features/
│   ├── landing/                           # Hero, AgentShowcase, HowItWorks, WhyMultiAgent, CtaSection
│   ├── agents/                             # AgentStatusCard, ExecutionTimeline, AgentActivityFeed
│   ├── research/                            # TopicInput, WorkspaceEmptyState, ResearchExecutionView
│   └── report/                               # ReportViewer, ReportSection, CriticPanel, ScoreGauge, DownloadMenu
├── store/researchStore.ts + uiStore.ts
├── services/api/ + services/types/
├── hooks/ · lib/ · config/
```

## Deployment

**Frontend (Vercel):** import the repo, framework preset "Vite," set
`VITE_API_BASE_URL` in project env vars. `vercel.json` includes the
SPA rewrite rule required for client-side routes to not 404 on refresh.

**Backend (Render):** point `VITE_API_BASE_URL` at the Render service
URL. CORS on the FastAPI backend must allow the Vercel production
domain (and `http://localhost:5173` for local dev). The frontend
already tolerates Render free-tier cold starts (generous timeout +
one retry on 5xx + a "waking up" notice after 8s).

