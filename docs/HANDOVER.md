# D&I Portfolio — Performance Portal
## Front-End Handover Document v1.0

**Owner:** Chief of Strategy & Business Excellence — Data & Intelligence Office
**Audience:** Front-end engineering team, solution architects, integration leads
**Prototype:** Live, interactive prototype deployed (see deployment section)
**Stack of record:** React 18 · Vite · TypeScript · Tailwind · shadcn/ui · Recharts
**Brand system:** Navy (`#0C2341`) + Purple (`#8B84D7`) + Warm coral/brown accents · Vision 2030 aligned

---

## Table of Contents

1. Product concept & portal structure
2. Information architecture & sitemap
3. Roles & permissions matrix
4. Key user journeys
5. Dashboard layouts per view
6. Core screens & module inventory
7. Data model — main entities
8. Integration architecture (5-layer flow)
9. AI chat assistant — design specification
10. Sample KPIs by view
11. Front-end component structure
12. Recommended tech stack
13. Responsive UI behavior
14. Security, access, audit
15. Wireframe references
16. MVP scope & release plan
17. Future enhancements

---

## 1. Product Concept & Portal Structure

### 1.1 One-line vision
A single source of truth for the Data & Intelligence Office to track, manage and report the end-to-end portfolio — from demand intake through value realization — with executive, delivery and engineering views built on the same governed data, accessible through a single navy-and-purple branded portal and an AI Copilot.

### 1.2 Problem statement
D&I work today is fragmented across Jira, Azure DevOps, ServiceNow, SharePoint, Power BI, Confluence, vendor portals and finance systems. Executives lack a board-ready view of portfolio health, value realization and Vision 2030 contribution. Delivery leads lack a unified pipeline, capacity and risk picture. Engineering leads lack a single squad scorecard. Reporting is manual, slow and error-prone.

### 1.3 Portal objectives
- One governed view of the **end-to-end portfolio lifecycle**: Demand → Approval → Delivery → Value
- Three audience-aware views (Executive, Manager, Tech) on top of one data model
- **Citation-grounded AI Copilot** for natural-language portfolio Q&A and one-click exports
- Plug-in **integration layer** with the existing tool stack (no rip-and-replace)
- **Vision 2030 alignment** rendered as first-class data, not a slide

### 1.4 Portal structure
```
┌────────────────────────────────────────────────────────────────────────┐
│  D&I Portfolio Performance Portal                                      │
├─────────────────┬─────────────────┬──────────────────┬─────────────────┤
│  Executive View │ Managers & Leads│  Tech & Squads   │  AI Copilot     │
│  (C-suite)      │ (PMO + Owners)  │  (Engineering)   │  (cross-cutting)│
├─────────────────┴─────────────────┴──────────────────┴─────────────────┤
│              17 Functional Modules (shared)                            │
│   Demand · Portfolio · Projects · Vendors · Budget · Capacity ·        │
│   Risks · Milestones · Value · Reporting · Squads · Approvals ·        │
│   Documents · Audit · Notifications · RBAC · Integrations              │
├────────────────────────────────────────────────────────────────────────┤
│              Integration Layer (event bus + connectors)                │
│   Jira · ADO · ServiceNow · SharePoint · Power BI · Confluence ·       │
│              Vendor Mgmt · Finance / ERP                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Information Architecture & Sitemap

### 2.1 Sitemap
```
/                           → Role-aware landing (one of the three views below)
/exec                       → Executive Cockpit
/manager                    → Manager Workspace
/tech                       → Tech / Squad Workspace

Modules (shared, role-permissioned):
/portfolio                  → Portfolio Dashboard (projects grid + table)
/demand                     → Demand Intake & Prioritization
/approvals                  → Approval Workflow Queue
/projects                   → Project Tracking detail pages
/milestones                 → Milestone Tracking
/sprint                     → Sprint / Jira board
/squads                     → Squad Performance
/risks                      → Risk / Issue / Dependency Register
/vendors                    → Vendor Management & SLAs
/budget                     → Budget Management
/value                      → Value Realization
/reporting                  → Executive Reporting / Report packs
/governance                 → Audit Log, RBAC, Document Repository
/integrations               → Integration Layer status & connectors
/architecture               → System Architecture (reference page)
```

Routing uses hash-based paths in the prototype (`/#/portfolio`); production should switch to history-based routing behind the authenticated app shell.

### 2.2 Navigation model
**Persistent left sidebar** — three sections per role:
- **Switch View** (role pill switcher: Executive · Managers & Leads · Squad & Tech)
- **Primary** modules for that role (e.g. for Exec: Cockpit, Portfolio, Value, Reporting)
- **Oversight** modules (Risks, Vendors, Budget, Audit)
- **Platform** (Integration Layer, Architecture)

**Top bar** — Workspace breadcrumb · Global search (⌘K, indexes projects/demands/risks/vendors/documents) · "Ask Copilot" launcher · Theme toggle · Notifications · Settings · User avatar.

**AI Copilot** — Right-side sheet, launchable from anywhere via top bar or sidebar shortcut, never blocks navigation.

---

## 3. Roles & Permissions Matrix

Five canonical roles. RBAC is enforced server-side; the portal adapts navigation, widgets and actions to the user's role.

| Capability                              | Executive | Portfolio Manager | Project Manager | Tech Lead / Squad | Viewer |
| --------------------------------------- | --------- | ----------------- | --------------- | ----------------- | ------ |
| View Executive Cockpit                  | ✅        | ✅                | —               | —                 | ✅ read |
| View Portfolio Dashboard                | ✅        | ✅                | ✅              | ✅                | ✅     |
| View Manager Workspace                  | ✅        | ✅                | ✅              | —                 | —      |
| View Tech / Squad Workspace             | ✅        | ✅                | ✅              | ✅                | —      |
| Submit Demand                           | ✅        | ✅                | ✅              | ✅                | —      |
| Approve / reject Demand                 | ✅        | ✅                | —               | —                 | —      |
| Create / edit Project                   | —         | ✅                | ✅              | —                 | —      |
| Update Sprint board (Jira-synced)       | —         | ✅                | ✅              | ✅                | —      |
| Edit Budget / financial actuals         | —         | ✅                | ✅ (own)        | —                 | —      |
| Manage Vendors / contracts              | —         | ✅                | —               | —                 | —      |
| Raise / edit Risks                      | ✅        | ✅                | ✅              | ✅                | —      |
| Generate Reporting Pack                 | ✅        | ✅                | ✅              | —                 | ✅ read |
| Use AI Copilot                          | ✅        | ✅                | ✅              | ✅                | ✅ (read-only answers) |
| Export to PowerPoint / PDF / email      | ✅        | ✅                | ✅              | ✅ (own)          | ✅ read |
| View Audit Log                          | ✅        | ✅                | own actions     | own actions       | —      |
| Manage RBAC                             | ✅ (admin) | —                | —               | —                 | —      |
| Configure Integrations                  | ✅ (admin) | —                | —               | —                 | —      |

AI Copilot answers are **always filtered by the calling user's RBAC scope** — a Tech Lead asking "show me total budget" only sees data for projects they're assigned to.

---

## 4. Key User Journeys

### 4.1 Executive (Raid Alghamdi · Chief of Strategy & Business Excellence)
**Monday 8:00 AM — Weekly board prep**
1. Logs in → lands on **Executive Cockpit** (role-aware home)
2. Scans the 6 KPI cards: portfolio health, value realized, budget utilization, on-track %, at-risk count, Vision 2030 contribution
3. Notices "At Risk" count is up → clicks → **Risks page** filtered to High/Critical
4. Opens AI Copilot → "Summarize the top 5 risks and what's being done"
5. Clicks **Export to PowerPoint** → board pack generated in brand template
6. Forwards via "Send by email" action

### 4.2 Manager (Layla Al-Mutairi · Portfolio Manager)
**Daily standup workflow**
1. Lands on **Manager Workspace**
2. Reviews **Demand Pipeline** funnel — 3 demands awaiting approval
3. Clicks first card → reviews business case → **Approve** (with comment)
4. Checks **Squad Capacity** — sees "ML Platform" squad overloaded at 112%
5. Drills in → reassigns one initiative to next sprint via dependency view
6. Reviews **Vendor SLA tracker** — one underperforming vendor flagged → escalation note added

### 4.3 Tech Lead (Khaled Al-Shehri · Tech Lead, Data Platform)
**Sprint mid-week check**
1. Lands on **Squad Workspace** — sees burnup chart and personal assignments
2. Opens **Sprint board** (synced from Jira) — drags a story from In Review → Done
3. Updates **Data Readiness** checklist for the upcoming Lakehouse cutover
4. Adds a new technical dependency on the Vendor Snowflake provisioning ticket
5. Asks Copilot: "What tickets are blocked on infra?" → receives grounded list with deep links

---

## 5. Dashboard Layouts Per View

### 5.1 Executive Cockpit (`/exec`)
```
┌──────────────────────────────────────────────────────────────────────────┐
│  HERO STRIP — navy gradient                                              │
│  "D&I Portfolio · This week"   |  ticker: 47 init · 142M realized · 91%  │
└──────────────────────────────────────────────────────────────────────────┘
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│  KPI 1   │  KPI 2   │  KPI 3   │  KPI 4   │  KPI 5   │  KPI 6   │
│ Health   │ Value YTD│ Budget   │ On Track │ At Risk  │ Vision 30│
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
┌──────────────────────────────────┬───────────────────────────────┐
│  Value Realization · area chart  │  Portfolio Health · donut     │
│  Plan vs Realized YTD            │  On Track / Risk / Delayed    │
└──────────────────────────────────┴───────────────────────────────┘
┌──────────────────────────────────┬───────────────────────────────┐
│  Strategic Initiatives (6) list  │  Vision 2030 · radial chart   │
└──────────────────────────────────┴───────────────────────────────┘
┌──────────────────────────────────┬───────────────────────────────┐
│  Budget by portfolio · bar chart │  Top Risks list (severity)    │
└──────────────────────────────────┴───────────────────────────────┘
┌──────────────────────────────────┬───────────────────────────────┐
│  Vendor performance list         │  Delivery snapshot · table    │
└──────────────────────────────────┴───────────────────────────────┘
```

### 5.2 Manager Workspace (`/manager`)
```
KPI row (5): Open demands · Approvals pending · Avg cycle · Capacity util · SLA index
┌──────────────────────────┬───────────────────────────────────────┐
│ Demand Pipeline funnel   │  Approval Queue cards                 │
│ + table                  │  (Approve · Defer · Reject)           │
└──────────────────────────┴───────────────────────────────────────┘
┌──────────────────────────┬───────────────────────────────────────┐
│ Squad Capacity bars      │  Sprint Burnup · line chart           │
└──────────────────────────┴───────────────────────────────────────┘
┌──────────────────────────┬───────────────────────────────────────┐
│ Milestone Timeline       │  Open Risks (top 5)                   │
└──────────────────────────┴───────────────────────────────────────┘
                  Vendor SLA tracker (full width)
```

### 5.3 Tech / Squad Workspace (`/tech`)
```
KPI row (5): Sprint completion · Story points · Cycle time · Defects · Deploy frequency
┌──────────────────────────┬───────────────────────────────────────┐
│ Sprint Burnup area chart │  My Assignments (5)                   │
└──────────────────────────┴───────────────────────────────────────┘
              Kanban board — To Do · In Progress · In Review · Done
┌────────────────┬────────────────┬───────────────────────────────┐
│ Data Readiness │ Tech Deps      │  Model Delivery               │
└────────────────┴────────────────┴───────────────────────────────┘
┌────────────────┬────────────────┬───────────────────────────────┐
│ Deployment     │ Documentation  │  Testing & Quality Gates      │
│ Readiness      │ Status         │                               │
└────────────────┴────────────────┴───────────────────────────────┘
```

---

## 6. Core Screens & Module Inventory

All 17 functional modules from the brief are implemented. Each module is a separate page rendered through the shared `AppShell` layout, gated by RBAC.

| # | Module | Route | Purpose |
| - | ------ | ----- | ------- |
| 1 | Demand Intake & Prioritization | `/demand` | Kanban of demands across New → Triage → Scoring → Ready, with WSJF/RICE scoring |
| 2 | Portfolio Dashboard | `/portfolio` | Grid + table of all projects, filterable, status pills |
| 3 | Project Tracking | `/projects` | Per-project detail (RAG, milestones, team, dependencies, finance) |
| 4 | Jira / ADO Sprint Board | `/sprint` | Live-synced board (mirror, not master) |
| 5 | Vendor Management | `/vendors` | Scorecards, contract burn, SLA adherence |
| 6 | Budget Management | `/budget` | Plan vs actual by portfolio + initiative |
| 7 | Resource & Capacity | `/squads` | Squad utilization, allocation, overload alerts |
| 8 | Risk / Issue / Dependency | `/risks` | Register + severity×likelihood heatmap |
| 9 | Milestone Tracking | `/milestones` | Cross-portfolio Gantt-style timeline |
| 10 | Value Realization | `/value` | Plan vs realized benefits with initiative drill-down |
| 11 | Executive Reporting | `/reporting` | Generated report packs (PPT/PDF/Excel) |
| 12 | Squad Performance | `/squads` | Velocity, cycle time, defects, quality |
| 13 | Approval Workflow | `/approvals` | Cross-module approval queue |
| 14 | Document Repository | `/governance` | SharePoint-mirrored, tagged, RBAC-gated |
| 15 | Audit & Governance Log | `/governance` | Immutable event stream |
| 16 | Notifications | top-bar bell | In-app + email + Teams |
| 17 | RBAC | `/governance` | Role assignment matrix |

Plus a cross-cutting **AI Copilot** sheet and an **Integration Layer** status page (`/integrations`).

---

## 7. Data Model — Main Entities

Conceptual model. Field names use camelCase to match the prototype's TypeScript types; production may map to a different naming convention.

### 7.1 Initiative (strategic level)
```
Initiative {
  id, code (INIT-001), name, theme (Vision 2030 theme),
  ownerId, sponsorId, status (On Track | At Risk | Delayed | Complete),
  startDate, endDate,
  plannedBenefit (SAR), realizedBenefit (SAR), realizationRate,
  budgetPlanned, budgetActual, budgetCommitted,
  visionAlignment[]  // {themeId, weight}
  projects[] // ProjectId references
}
```

### 7.2 Project
```
Project {
  id, code (PRJ-1042), name, initiativeId,
  ownerId, managerId, squadId,
  status, healthRag (R|A|G), phase (Discover | Define | Build | Test | Deploy | Hypercare),
  startDate, endDate, percentComplete,
  jiraProjectKey, adoProjectId,  // integration anchors
  budgetPlanned, budgetActual,
  risks[], milestones[], demands[], dependencies[]
}
```

### 7.3 Demand
```
Demand {
  id, code (DMD-2026-021), title, description,
  requesterId, requesterDept,
  submittedAt, stage (New | Triage | Scoring | Ready | Rejected),
  businessCaseUrl,                   // SharePoint
  score { wsjf, rice, strategicFit, effort },
  decision { approverId, decidedAt, comment, outcome },
  linkedInitiativeId?, linkedProjectId?
}
```

### 7.4 Risk / Issue / Dependency
```
RiskItem {
  id, code (RSK-077), type (risk | issue | dependency),
  projectId, initiativeId?,
  title, description,
  severity (Low|Medium|High|Critical),
  likelihood (Low|Medium|High),
  status (Open | Mitigating | Closed),
  ownerId, eta,
  source ("ServiceNow GRC" | "Jira" | "manual"),
  sourceRef
}
```

### 7.5 Vendor & Contract
```
Vendor { id, code (VND-001), name, category, healthStatus, slaScore, performanceScore }
Contract {
  id, vendorId, value (SAR), startDate, endDate,
  utilizationPct, committedAmount, invoicedAmount,
  slaTargets[], slaActuals[],
  linkedProjects[]
}
```

### 7.6 Squad / Capacity
```
Squad { id, name, leadId, capacityHrsPerSprint, members[] }
Allocation { squadId, sprintId, plannedPoints, completedPoints, utilizationPct }
```

### 7.7 Milestone
```
Milestone {
  id, projectId, name, dueDate, completedDate?,
  status (Upcoming | At Risk | Done | Slipped),
  dependencies[], gateType (Stage Gate | Go-Live | Audit)
}
```

### 7.8 Approval, AuditEvent, Integration, Document, KPI Definition
```
Approval { id, entityType, entityId, requestorId, approverId, state, decidedAt, comment }
AuditEvent { id, actorId, action, entityType, entityId, before, after, ts, source }
Integration { id, system, type, status (Healthy|Degraded|Down), lastSyncAt, recordsIn24h, errorCount }
Document { id, title, url (SharePoint), tags[], rbacScope, version, lastModifiedBy, lastModifiedAt }
KpiDefinition { id, name, formula, sourceSystem, owner, refreshCadence }
```

### 7.9 Vision 2030 alignment
```
Vision2030Theme { id, name, parentProgram, weight }   // National Transformation, NIDLP, etc.
InitiativeAlignment { initiativeId, themeId, weight, evidence[] }
```

---

## 8. Integration Architecture

### 8.1 Five-layer integration flow
This is the same flow rendered on the `/integrations` page of the portal.

```
Layer 1 — SOURCE SYSTEMS
┌─────────┬─────────────┬───────────┬─────────────┬───────────┬────────────┬──────────────┬──────────┐
│  Jira   │ Azure DevOps│ServiceNow │ SharePoint  │ Power BI  │ Confluence │ Vendor Mgmt  │ Finance  │
└────┬────┴──────┬──────┴─────┬─────┴──────┬──────┴─────┬─────┴──────┬─────┴──────┬───────┴────┬─────┘
     │           │            │            │            │            │            │            │
Layer 2 — CONNECTORS  (REST · webhook · OData · file/CSV · SFTP · ODBC)
     │           │            │            │            │            │            │            │
Layer 3 — INTEGRATION BUS  (event streaming + retry + DLQ + schema registry)
                              Kafka / Azure Event Hubs
     │
Layer 4 — PORTFOLIO SERVICES  (domain APIs + write-back rules)
     │       Demand · Project · Risk · Vendor · Value · Audit
     │       (Postgres + Redis cache + OpenSearch index)
     │
Layer 5 — PORTAL & COPILOT
         React app + AI Copilot (Azure OpenAI + vector store grounded on portfolio facts)
```

### 8.2 Connector responsibilities

| System | Direction | Cadence | Purpose |
| ------ | --------- | ------- | ------- |
| **Jira** | Read | Webhook + 5-min poll | Issues, sprints, story points, status |
| **Azure DevOps** | Read | Webhook | Work items, PRs, build/release |
| **ServiceNow GRC** | Read + Write | Webhook | Risks, controls, audit findings |
| **SharePoint Online** | Read | Webhook (Graph) | Documents, business cases |
| **Power BI** | Embed + REST | On demand | Embedded dashboards, dataset refresh status |
| **Confluence** | Read | 1-h poll | Pages, decision records |
| **Vendor Mgmt** | Read + Write | Daily | Contracts, SLAs, invoices |
| **Finance / ERP** | Read | Daily | Actual costs, commitments |

### 8.3 Write-back guardrails
- Jira / ADO are **source of truth** for delivery work — portal never writes back to delivery boards
- ServiceNow GRC is master for risks — portal annotates and links, does not duplicate
- Approvals raised in the portal are persisted in the portal database **and** mirrored to ServiceNow

### 8.4 Health & observability
The `/integrations` page surfaces per-connector status, last-sync timestamp, throughput and error count. SLO: < 5 min freshness for Jira / ADO; < 1 h for SharePoint / Confluence; < 24 h for Finance.

---

## 9. AI Chat Assistant — Design Specification

### 9.1 Persona & scope
"D&I Copilot" — a portfolio analyst that answers questions about the data in the portal. Never invents data. Always cites sources. Refuses out-of-scope questions politely.

### 9.2 Capabilities (from brief)
- Natural-language questions
- Role-based answers (filtered by caller's RBAC scope)
- Portfolio search across all entities
- Report generation (executive summary, risk brief, value summary, vendor scorecard)
- KPI explanation
- Drill-down ("show me the projects behind this number")
- Suggested follow-ups
- Source citation (every fact links to the underlying record)
- Export to PowerPoint / PDF / email

### 9.3 Conversation surface
Right-side **Sheet**, launchable from anywhere. Navy gradient header. Message bubbles (assistant left, user right). Each assistant message contains:
1. The answer (short paragraph)
2. **Source cards** — typed (Project / Risk / Vendor / Document) with deep link
3. **Suggested follow-ups** — 3 chips below the answer
4. **Export bar** — PowerPoint / PDF / Email buttons

### 9.4 Intent catalog (initial)
| Intent | Example utterance | Backed by |
| ------ | ----------------- | --------- |
| Status query | "Which projects are delayed?" | Project store + RAG filter |
| Risk briefing | "Top 5 risks this week" | RiskItem store ranked by severity×likelihood |
| Vendor health | "How is Local SI Partner performing?" | Vendor scorecard |
| Budget query | "How much have we spent on Initiative INIT-002?" | Budget aggregator |
| Capacity query | "Which squads are over capacity?" | Allocation store |
| Demand pipeline | "What's awaiting approval?" | Demand store, stage=Triage|Scoring|Ready |
| Blockers | "What's blocked on infrastructure?" | RiskItem store, type=dependency |
| Executive summary | "Generate this week's board pack" | Composite — triggers report generator |
| KPI explain | "What is on-track %?" | KpiDefinition store |

### 9.5 Grounding strategy
- Retrieval-augmented generation against the **portfolio service** (structured) **+ vector store** of documents (SharePoint + Confluence)
- Hybrid: SQL/OpenSearch for facts, vector search for unstructured
- LLM (Azure OpenAI / GPT-4 class) only synthesizes; never generates numerical facts directly
- Every numeric claim must trace to a record ID surfaced in the source card
- If a question cannot be grounded, the Copilot responds: "I don't have data for that — please refine your question."

### 9.6 Export pipeline
- PowerPoint: brand-styled template, server-side via python-pptx (or unoconv); honors org branding
- PDF: same content, rendered via headless Chromium (Puppeteer)
- Email: composes draft in Outlook via Microsoft Graph; user reviews before sending

### 9.7 Safety & governance
- Every Copilot query is logged in the audit log (user, prompt, answer, sources)
- PII scrub on prompts and responses
- Configurable refusal list (e.g. cannot answer HR / compensation questions)
- Caller RBAC enforced at the data-retrieval layer (not the prompt) — server filters before LLM ever sees data

---

## 10. Sample KPIs

These KPIs are wired into the prototype's mock data and shown on the three home views. Each KPI is defined as a `KpiDefinition` so the formula, source and owner are governed.

### 10.1 Executive Cockpit
| KPI | Formula | Source | Target |
| --- | ------- | ------ | ------ |
| Portfolio Health Score | weighted avg of project RAG (G=100, A=60, R=0) | Project store | ≥ 80 |
| Value Realized YTD | Σ Initiative.realizedBenefit | Value store | ≥ 90% of plan |
| Budget Utilization | Σ Project.budgetActual ÷ Σ Project.budgetPlanned | Budget store | 85–105% |
| On-Track % | count(status=On Track) ÷ count(all active) | Project store | ≥ 80% |
| At-Risk Count | count(status ∈ {At Risk, Delayed}) | Project store | trend ↓ |
| Vision 2030 Contribution | Σ Initiative.realized × theme.weight | Vision align. | ≥ plan |

### 10.2 Manager Workspace
- Open demands · Approvals pending · Avg approval cycle (days) · Squad utilization % · Vendor SLA index · Milestones this month · Risks opened (WoW)

### 10.3 Tech / Squad Workspace
- Sprint completion % · Story points (planned vs done) · Cycle time (days) · Defect escape rate · Deployment frequency · Code review TAT · Data readiness % · Documentation coverage %

---

## 11. Front-End Component Structure

### 11.1 File tree (current prototype, production-ready as a starting point)
```
di-portal/
├── client/
│   ├── index.html                       # title + meta + inline favicon
│   └── src/
│       ├── App.tsx                      # Wouter router + RoleProvider + ThemeProvider
│       ├── main.tsx
│       ├── index.css                    # design tokens (HSL), fonts, gradients, status pills
│       ├── lib/
│       │   ├── role-context.tsx         # Role + persona context (3 roles)
│       │   ├── mock-data.ts             # All prototype data — replace with API in prod
│       │   ├── queryClient.ts           # TanStack Query client (template default)
│       │   └── utils.ts
│       ├── components/
│       │   ├── AppShell.tsx             # Sidebar + topbar + role switcher + AI launcher
│       │   ├── Logo.tsx                 # Inline SVG hexagon + bars
│       │   ├── AICopilot.tsx            # Right-side sheet, messages, sources, export
│       │   ├── primitives.tsx           # PageHeader, KpiCard, SectionCard, StatusPill,
│       │   │                            # MiniProgress, Tag
│       │   └── ui/                      # shadcn/ui (~50 components, template-provided)
│       └── pages/
│           ├── executive.tsx
│           ├── manager.tsx
│           ├── tech.tsx
│           ├── portfolio.tsx
│           └── modules.tsx              # 13 module sub-pages co-located
├── server/                              # Express scaffold (replace with NestJS in prod)
├── shared/schema.ts                     # Drizzle schema (extend per §7)
└── tailwind.config.ts                   # brand.* tokens, status semantics
```

### 11.2 Recommended decomposition for production
Split `modules.tsx` into per-module files: `pages/demand.tsx`, `pages/budget.tsx`, etc. Move pure presentational pieces (e.g. `RiskHeatmap`, `VendorScorecard`, `SprintBoard`) into `components/charts/` and `components/widgets/`.

Adopt **feature-first folder layout**:
```
src/features/
  demand/   { api/  components/  hooks/  pages/  types.ts }
  vendor/   { api/  components/  hooks/  pages/  types.ts }
  ...
```

### 11.3 Shared primitives (already in prototype, harden for prod)
- `KpiCard` — props: title, value, suffix, trend, accent (`primary|coral|orange|purple2|navy`)
- `SectionCard` — titled container with optional toolbar slot
- `StatusPill` — semantic colors (On Track · At Risk · Delayed · Done · Blocked · Watch · Healthy · Underperform)
- `MiniProgress` — accessible progress bar with screen-reader value
- `Tag` — categorical chip (neutral · purple · warm · coral)
- `PageHeader` — eyebrow + title + subtitle + actions

---

## 12. Recommended Tech Stack

### 12.1 Frontend
- **Framework:** React 18 + Vite + TypeScript (strict)
- **Routing:** React Router 6 (history mode in prod; hash mode in prototype only)
- **State / data:** TanStack Query 5 + Zustand for client-only state
- **UI:** Tailwind CSS v3 + shadcn/ui + Radix primitives
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts (primary), Visx/D3 for any non-standard viz
- **Motion:** Framer Motion (page transitions, micro-interactions)
- **Icons:** lucide-react
- **Fonts:** Fontshare — Satoshi (display + body), JetBrains Mono (data)
- **i18n:** react-i18next with Arabic + English bundles; RTL via Tailwind's `dir` utilities
- **Testing:** Vitest (unit), Playwright (e2e), Storybook for components

### 12.2 Backend
- **API:** NestJS (Node 20 + TypeScript)
- **Database:** PostgreSQL 16 (with logical replicas for reporting reads)
- **Cache:** Redis 7
- **Search:** OpenSearch (full-text + faceted across entities)
- **Object storage:** Azure Blob (documents, generated reports)
- **Auth:** OIDC via Azure AD / Entra ID; SSO; MFA enforced
- **Event bus:** Apache Kafka or Azure Event Hubs
- **Workflow:** Temporal.io or n8n for approval orchestration
- **File generation:** python-pptx + WeasyPrint (PowerPoint + PDF)

### 12.3 AI
- **LLM:** Azure OpenAI (GPT-4 class) in customer's tenant — data residency compliant
- **Vector store:** Azure AI Search (or pgvector for smaller scale)
- **Orchestration:** LangChain / Semantic Kernel; structured tool-calling
- **Guardrails:** Azure Content Safety + custom RBAC filter pre-retrieval

### 12.4 DevOps
- **CI/CD:** Azure DevOps Pipelines or GitHub Actions
- **Hosting:** Azure App Service / AKS + Azure Front Door (TLS, WAF)
- **Observability:** OpenTelemetry → Azure Monitor; structured logs to Log Analytics
- **IaC:** Bicep or Terraform

### 12.5 Why this stack
- Aligns with the existing Microsoft / Azure footprint of most Saudi-government enterprises
- Allows data and AI to remain within the customer's tenant (Vision 2030 data-residency expectations)
- All components have managed services with SLAs

---

## 13. Responsive UI Behavior

### 13.1 Breakpoints (Tailwind defaults retained)
- `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536

### 13.2 Behavior by breakpoint
- **≥ xl (desktop dashboards):** Full sidebar (240px), 3-column grid on KPIs (6-up), 2-column charts
- **lg (1024–1279):** Sidebar collapses to icon rail (64px); KPIs go 3-up; charts stack to single column at narrow lg
- **md (768–1023, tablet):** Off-canvas sidebar (hamburger), KPIs 2-up, charts stack
- **< md (mobile):** KPIs 1-up, sticky bottom navigation with 5 primary destinations, AI Copilot becomes full-screen modal not side sheet, tables degrade to summary cards

### 13.3 Density modes
Compact mode for power users (Manager + Tech views) reduces row heights and removes secondary metadata. Toggle in user settings.

### 13.4 RTL / Arabic
- Tailwind `dir="rtl"` flips the entire layout
- Icons are mirrored where directional (arrows, chevrons); not mirrored where universal (settings, search)
- Numerals remain Arabic-Indic by user preference; default to Latin for KPI cards (financial convention)

### 13.5 Theme
- **Light mode:** Warm cream surfaces (`#FCF4EF`) with navy sidebar — used in the prototype
- **Dark mode:** Navy-dominant; charts re-tint via `--chart-1..6` HSL variables
- Toggle in top bar; persists in user profile (not localStorage in iframe — production should use cookie or profile API)

---

## 14. Security, Access & Audit

### 14.1 Authentication
- OIDC via Azure AD / Entra ID, SSO
- MFA required for all roles; conditional access policies enforced
- Session length 8 h with sliding expiration; idle timeout 30 min

### 14.2 Authorization
- RBAC per §3
- Permissions evaluated server-side on every API call
- Frontend hides UI elements user lacks permission for, but **never trusts the frontend** to enforce access

### 14.3 Data classification
- **Public** — released report packs
- **Internal** — portfolio dashboards, KPIs
- **Confidential** — vendor contracts, budgets, individual performance
- **Restricted** — audit log, RBAC matrix, integration credentials

Visual classification banner shown on Confidential and Restricted screens.

### 14.4 Audit log
Every state-changing action persisted as an immutable `AuditEvent`:
- Who (actor + role)
- What (action, entityType, entityId)
- Before / after snapshot (JSON)
- When (UTC + KSA)
- Source (UI · API · Connector · Copilot)

Logs retained 7 years (compliance standard); exportable for external audit.

### 14.5 AI-specific safeguards
See §9.7. Additionally:
- Prompt + response stored with content-safety scores
- Quarterly review of low-confidence answers
- Red-team test suite run before each release

### 14.6 Network & data
- All traffic TLS 1.3
- Azure Front Door + WAF
- Database at-rest encryption (TDE), customer-managed keys
- Secrets in Azure Key Vault, rotated 90 days
- No PII leaves the tenant boundary

---

## 15. Wireframe References

The interactive prototype IS the wireframe — every screen described here is implemented and screenshotted. Key screens and their visual treatment:

| Screen | Route | What to inspect |
| ------ | ----- | --------------- |
| Executive Cockpit | `/exec` | Hero gradient, KPI strip, dual-column charts, vision radial |
| Manager Workspace | `/manager` | Demand funnel, approval cards, capacity bars |
| Tech / Squad Workspace | `/tech` | Burnup, Kanban, readiness checklists |
| Portfolio Dashboard | `/portfolio` | Grid + table toggle, status filters |
| Demand | `/demand` | 4-stage Kanban with scoring |
| Risks | `/risks` | Register list + severity×likelihood heatmap |
| Vendors | `/vendors` | Scorecards with contract burn |
| Budget | `/budget` | Plan vs actual bars + initiative table |
| Value | `/value` | Cumulative area chart + initiative benefit table |
| Reporting | `/reporting` | 6 report-pack cards with export controls |
| Integrations | `/integrations` | 5-layer flow diagram + 9 connector cards |
| Governance | `/governance` | Audit log + RBAC matrix + document repo |
| AI Copilot | sheet | Sources, follow-ups, export bar |

All screens follow the design system in §11 and use the mandatory brand palette.

---

## 16. MVP Scope & Release Plan

### 16.1 MVP (8–10 weeks)
**Goal:** Replace the Monday board pack and the weekly status email.

Included:
- Executive Cockpit + Portfolio Dashboard + Reporting
- Read-only integrations: Jira, ServiceNow GRC, SharePoint, Finance
- AI Copilot with Status / Risk / Budget / Vendor intents
- RBAC for 3 roles (Executive, Manager, Viewer)
- PowerPoint + PDF export
- Light theme + English only

Excluded (deferred):
- Write-back to ServiceNow
- Azure DevOps connector
- Approval workflow
- Arabic localization & RTL
- Dark theme

### 16.2 Release 2 (next 8 weeks)
- Manager Workspace + Demand Intake + Approval Workflow
- ADO + Confluence + Vendor Mgmt connectors
- Arabic + RTL
- Notifications (in-app + email + Teams)

### 16.3 Release 3
- Tech / Squad Workspace + Sprint board mirror
- Value Realization deep dive + scenario planning
- Copilot expansion: KPI explanation, follow-ups, exec summary generation
- Dark theme

### 16.4 Acceptance criteria for MVP go-live
- All MVP screens pass WCAG AA on lighthouse
- p95 page load < 2 s on Riyadh region
- 100% of KPI numbers traceable to a source record (no orphan data)
- Pen test clean, no Critical or High findings
- 5 executive users sign off on the Cockpit board pack

---

## 17. Future Enhancements

- **Scenario planner** — "what if we descope project X" → recompute portfolio health and value forecast
- **Predictive risk scoring** — ML on historical risk + delivery data to surface emerging risks before they're filed
- **Vision 2030 alignment optimizer** — recommend re-weighting to maximize national-theme contribution within budget
- **Mobile companion app** — Executive view + Copilot only, push notifications for material changes
- **Voice Copilot** — Arabic + English speech in/out for hands-free executive briefing
- **Cross-organization benchmarking** — anonymized comparison with peer Saudi entities
- **Sustainability dimension** — extend Value Realization with carbon / efficiency KPIs

---

## Appendix A — Brand Palette Reference

| Token | Hex | Use |
| ----- | --- | --- |
| Primary Dark | `#0C2341` | Sidebar, hero gradients, body text on light |
| Purple Accent | `#8B84D7` | Primary CTAs, KPI accents, chart series 1 |
| Light Purple 1 | `#CFCCEF` | Purple-tinted surfaces, badges |
| Light Purple 2 | `#E7E5F7` | Soft section backgrounds |
| Dark Brown | `#623B2A` | Headers in warm sections, contrast text on coral |
| Warm Orange | `#C66E4E` | Secondary CTA, "warning" KPI accents |
| Soft Coral | `#FFA38B` | Highlight states, "at-risk" pills |
| Warm BG 1 | `#F9EBE0` | Card backgrounds in warm sections |
| Warm BG 2 | `#FCF4EF` | Page background (light mode) |

Status semantics (derived):
- `--ok` green for On Track / Healthy / Done
- `--warn` amber/coral for At Risk / Watch
- `--bad` deeper coral/red for Delayed / Underperform / Blocked
- `--info` purple for Informational pills

## Appendix B — File Locations in the Prototype

- Design tokens & fonts: `client/src/index.css`
- Tailwind theme: `tailwind.config.ts`
- Role/persona context: `client/src/lib/role-context.tsx`
- Mock data (replace with API): `client/src/lib/mock-data.ts`
- Shared primitives: `client/src/components/primitives.tsx`
- AI Copilot: `client/src/components/AICopilot.tsx`
- Per-page implementations: `client/src/pages/*.tsx`

---

*Document v1.0 · D&I Office · Vision 2030 aligned · Prepared for front-end implementation handover.*
