# D&I Portfolio — Performance Portal

A premium enterprise portal prototype for a Data & Intelligence Office to track, manage and report end-to-end portfolio performance across the full delivery lifecycle — from demand intake through value realization — with three role-aware views and an AI Copilot.

> Vision 2030 aligned · Built for executive, delivery and engineering audiences on one governed data model.

---

## Live demo

Deploy this repo to Vercel in one click (see [Deploy to Vercel](#deploy-to-vercel)) or run locally:

```bash
npm install
npm run dev
```

The app boots at <http://localhost:5173>.

---

## What's inside

### Three role-aware views
- **Executive Cockpit** — KPI hero, value realization, portfolio health, Vision 2030 contribution, top risks, vendor health, delivery snapshot
- **Managers & Leads Workspace** — demand funnel, approval queue, squad capacity, sprint burnup, milestone timeline, vendor SLA tracker
- **Squad & Tech Workspace** — sprint burnup, personal assignments, Kanban board, data readiness, dependencies, deployment readiness, quality gates

### 17 functional modules
Demand Intake · Portfolio Dashboard · Project Tracking · Sprint Board · Vendor Management · Budget · Capacity · Risk/Issue/Dependency Register · Milestones · Value Realization · Executive Reporting · Squad Performance · Approval Workflow · Document Repository · Audit Log · RBAC · Integration Layer

### AI Copilot
Right-side sheet. Role-aware suggestions. Source-cited responses. Suggested follow-ups. Export to PowerPoint / PDF / email.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | React 18 + Vite + TypeScript (strict) |
| Routing | wouter (hash mode) |
| Data layer | TanStack Query 5 (mock data in `src/lib/mock-data.ts`) |
| UI | Tailwind CSS v3 + shadcn/ui + Radix primitives |
| Charts | Recharts |
| Motion | Framer Motion |
| Icons | lucide-react |
| Fonts | Fontshare — Satoshi (display + body), JetBrains Mono (data) |

This prototype is **frontend-only**. All data is mocked in `src/lib/mock-data.ts` so the entire app is statically hostable.

---

## Project structure

```
di-portal/
├── src/
│   ├── App.tsx                       Router + RoleProvider + ThemeProvider
│   ├── main.tsx
│   ├── index.css                     Design tokens (HSL), fonts, gradients
│   ├── lib/
│   │   ├── role-context.tsx          3 roles + persona context
│   │   ├── mock-data.ts              All prototype data
│   │   ├── queryClient.ts
│   │   └── utils.ts
│   ├── components/
│   │   ├── AppShell.tsx              Sidebar + topbar + role switcher
│   │   ├── Logo.tsx                  Inline SVG hexagon + bars
│   │   ├── AICopilot.tsx             Right-side sheet, messages, sources, export
│   │   ├── primitives.tsx            KpiCard, SectionCard, StatusPill, etc.
│   │   └── ui/                       shadcn/ui components
│   └── pages/
│       ├── executive.tsx
│       ├── manager.tsx
│       ├── tech.tsx
│       ├── portfolio.tsx
│       ├── modules.tsx               13 module sub-pages
│       └── not-found.tsx
├── index.html
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── vercel.json
└── package.json
```

---

## Brand system (mandatory palette)

| Token | Hex | Use |
| --- | --- | --- |
| Primary Dark | `#0C2341` | Sidebar, hero gradients |
| Purple Accent | `#8B84D7` | Primary CTAs, KPI accents |
| Light Purple 1 | `#CFCCEF` | Purple-tinted surfaces |
| Light Purple 2 | `#E7E5F7` | Soft section backgrounds |
| Dark Brown | `#623B2A` | Headers in warm sections |
| Warm Orange | `#C66E4E` | Secondary CTA, warning accents |
| Soft Coral | `#FFA38B` | Highlights, at-risk pills |
| Warm BG 1 | `#F9EBE0` | Card backgrounds (warm sections) |
| Warm BG 2 | `#FCF4EF` | Page background (light mode) |

Defined as HSL CSS variables in `src/index.css` and consumed via Tailwind tokens in `tailwind.config.ts`.

---

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local dev server (Vite, HMR) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run TypeScript type-checking |

---

## Deploy to Vercel

### Option 1 — One-click via dashboard
1. Push this repo to GitHub
2. Go to <https://vercel.com/new> and import the repository
3. Vercel auto-detects Vite. Defaults work as-is:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Click **Deploy**

The included `vercel.json` adds an SPA rewrite so deep links work.

### Option 2 — CLI
```bash
npm i -g vercel
vercel             # preview deployment
vercel --prod      # production deployment
```

---

## Customizing the data

All mock data lives in `src/lib/mock-data.ts`. To wire to a real backend:
1. Replace mock arrays with TanStack Query hooks (`useQuery`) calling your portfolio API
2. Re-introduce an `apiRequest` helper in `src/lib/queryClient.ts`
3. Keep the entity shapes the same so component code is unchanged

See the handover document (`docs/HANDOVER.md`) for the full data model, integration architecture, AI copilot intent catalog and 8–10 week MVP plan.

---

## License

MIT © 2026 Raid Alghamdi
