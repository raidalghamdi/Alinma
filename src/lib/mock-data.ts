// Centralized mock data for the Data & Intelligence Portfolio Portal.
// In production these come from Jira / Azure DevOps / ServiceNow / Power BI / Finance APIs.

export type ProjectStatus = "On Track" | "At Risk" | "Delayed" | "On Hold" | "Completed";
export type Priority = "Critical" | "High" | "Medium" | "Low";

export const portfolioKPIs = [
  { id: "active",   label: "Active Projects",     value: 47,  delta: "+6 QoQ", trend: "up",   suffix: "" },
  { id: "demand",   label: "Demands in Pipeline", value: 128, delta: "+23 MoM", trend: "up",   suffix: "" },
  { id: "budget",   label: "Budget Utilized",     value: 68,  delta: "+4 pts", trend: "up",   suffix: "%" },
  { id: "value",    label: "Value Realized YTD",  value: 142, delta: "+18 MoM", trend: "up", suffix: "M SAR" },
  { id: "ontime",   label: "On-Time Delivery",    value: 84,  delta: "+2 pts", trend: "up",   suffix: "%" },
  { id: "risk",     label: "Open Critical Risks", value: 7,   delta: "-3 WoW", trend: "down", suffix: "" },
];

export const portfolioHealth = [
  { name: "On Track",  value: 28, color: "hsl(var(--chart-1))" },
  { name: "At Risk",   value: 9,  color: "hsl(var(--chart-2))" },
  { name: "Delayed",   value: 4,  color: "hsl(var(--chart-3))" },
  { name: "On Hold",   value: 3,  color: "hsl(var(--chart-4))" },
  { name: "Completed", value: 3,  color: "hsl(var(--chart-5))" },
];

export const budgetByPortfolio = [
  { portfolio: "AI / GenAI",          planned: 42, actual: 31, committed: 36 },
  { portfolio: "Data Platform",       planned: 38, actual: 29, committed: 33 },
  { portfolio: "Analytics & BI",      planned: 24, actual: 19, committed: 22 },
  { portfolio: "Data Governance",     planned: 12, actual: 8,  committed: 10 },
  { portfolio: "MLOps & Engineering", planned: 18, actual: 14, committed: 16 },
];

export const valueRealization = [
  { month: "Jan", planned:  8, realized:  6 },
  { month: "Feb", planned: 14, realized: 12 },
  { month: "Mar", planned: 24, realized: 22 },
  { month: "Apr", planned: 36, realized: 31 },
  { month: "May", planned: 52, realized: 47 },
  { month: "Jun", planned: 72, realized: 63 },
  { month: "Jul", planned: 92, realized: 81 },
  { month: "Aug", planned:112, realized:101 },
  { month: "Sep", planned:130, realized:118 },
  { month: "Oct", planned:142, realized:128 },
  { month: "Nov", planned:156, realized:142 },
];

export const strategicInitiatives = [
  { id: "INIT-001", name: "Enterprise GenAI Copilot",        owner: "AI CoE",            progress: 62, status: "On Track",  vision: "Vision 2030 · Digital Economy" },
  { id: "INIT-002", name: "Unified Data Lakehouse",          owner: "Data Platform",     progress: 78, status: "On Track",  vision: "Vision 2030 · Government Effectiveness" },
  { id: "INIT-003", name: "Regulatory Reporting Automation", owner: "Analytics & BI",    progress: 41, status: "At Risk",   vision: "Vision 2030 · Public Sector" },
  { id: "INIT-004", name: "Data Governance & MDM",           owner: "Governance Office", progress: 55, status: "On Track",  vision: "Vision 2030 · Digital Economy" },
  { id: "INIT-005", name: "Predictive Compliance Models",    owner: "AI CoE",            progress: 33, status: "Delayed",   vision: "Vision 2030 · Public Sector" },
  { id: "INIT-006", name: "Self-Service BI Rollout",         owner: "Analytics & BI",    progress: 88, status: "On Track",  vision: "Vision 2030 · Workforce Capability" },
];

export const projects = [
  { id: "PRJ-1042", name: "Customer 360 Lakehouse",        portfolio: "Data Platform",       owner: "L. Al-Mutairi",  status: "On Track" as ProjectStatus, progress: 72, budgetUsed: 64, deadline: "2026-09-30", priority: "Critical" as Priority, vendor: "Snowflake + Local SI" },
  { id: "PRJ-1043", name: "GenAI Knowledge Assistant",     portfolio: "AI / GenAI",          owner: "F. Al-Otaibi",   status: "On Track" as ProjectStatus, progress: 58, budgetUsed: 52, deadline: "2026-11-15", priority: "High"     as Priority, vendor: "Microsoft / Azure" },
  { id: "PRJ-1044", name: "Risk Predictive Models v2",     portfolio: "AI / GenAI",          owner: "N. Al-Qahtani",  status: "At Risk" as ProjectStatus,  progress: 41, budgetUsed: 49, deadline: "2026-08-30", priority: "High"     as Priority, vendor: "Databricks" },
  { id: "PRJ-1045", name: "Regulatory Reporting Eng.",     portfolio: "Analytics & BI",      owner: "H. Al-Dossari",  status: "Delayed" as ProjectStatus,  progress: 33, budgetUsed: 58, deadline: "2026-07-31", priority: "Critical" as Priority, vendor: "Power BI / SAP" },
  { id: "PRJ-1046", name: "Master Data Management",        portfolio: "Data Governance",     owner: "S. Al-Ghamdi",   status: "On Track" as ProjectStatus, progress: 55, budgetUsed: 41, deadline: "2026-12-20", priority: "High"     as Priority, vendor: "Informatica" },
  { id: "PRJ-1047", name: "MLOps Platform Modernization",  portfolio: "MLOps",               owner: "K. Al-Shehri",   status: "On Track" as ProjectStatus, progress: 64, budgetUsed: 48, deadline: "2026-10-10", priority: "High"     as Priority, vendor: "Azure ML / GitHub" },
  { id: "PRJ-1048", name: "Self-Service Analytics Rollout",portfolio: "Analytics & BI",      owner: "R. Al-Anazi",    status: "On Track" as ProjectStatus, progress: 88, budgetUsed: 72, deadline: "2026-06-15", priority: "Medium"   as Priority, vendor: "Power BI" },
  { id: "PRJ-1049", name: "GenAI Compliance Co-pilot",     portfolio: "AI / GenAI",          owner: "M. Al-Harbi",    status: "On Hold" as ProjectStatus,  progress: 18, budgetUsed: 12, deadline: "2027-02-28", priority: "Medium"   as Priority, vendor: "OpenAI / Azure" },
];

export const demands = [
  { id: "DMD-0231", title: "Real-time Fraud Detection Dataset",    requester: "Risk Dept.",        priority: "Critical" as Priority, stage: "Approval",       value: 9.2, effort: "L",  date: "2026-05-08" },
  { id: "DMD-0232", title: "Procurement Spend Analytics Dashboard",requester: "Procurement",       priority: "High"     as Priority, stage: "Prioritization", value: 7.4, effort: "M",  date: "2026-05-09" },
  { id: "DMD-0233", title: "GenAI Contract Summarizer",             requester: "Legal & Compliance",priority: "High"     as Priority, stage: "Intake",         value: 8.1, effort: "M",  date: "2026-05-10" },
  { id: "DMD-0234", title: "Customer Churn Predictive Model",       requester: "Commercial",        priority: "High"     as Priority, stage: "Discovery",      value: 7.8, effort: "L",  date: "2026-05-10" },
  { id: "DMD-0235", title: "Vendor Performance Scorecard",          requester: "Procurement",       priority: "Medium"   as Priority, stage: "Prioritization", value: 6.2, effort: "S",  date: "2026-05-11" },
  { id: "DMD-0236", title: "ESG Disclosure Data Pipeline",          requester: "Sustainability",    priority: "Medium"   as Priority, stage: "Intake",         value: 6.8, effort: "M",  date: "2026-05-12" },
  { id: "DMD-0237", title: "HR Workforce Planning Cube",            requester: "HR",                priority: "Medium"   as Priority, stage: "Approval",       value: 5.4, effort: "M",  date: "2026-05-12" },
  { id: "DMD-0238", title: "Branch KPI Realtime Stream",            requester: "Operations",        priority: "Critical" as Priority, stage: "Discovery",      value: 8.6, effort: "L",  date: "2026-05-13" },
];

export const risks = [
  { id: "RSK-077", title: "Snowflake credit consumption running 22% over forecast",  project: "PRJ-1042", severity: "High",     likelihood: "High",   owner: "Finance Ops",   eta: "2026-05-30" },
  { id: "RSK-078", title: "Regulatory deadline shift may invalidate current scope",  project: "PRJ-1045", severity: "Critical", likelihood: "Medium", owner: "Compliance",    eta: "2026-06-10" },
  { id: "RSK-079", title: "Vendor SI resource ramp-down ahead of UAT",               project: "PRJ-1042", severity: "High",     likelihood: "Medium", owner: "PMO",           eta: "2026-06-01" },
  { id: "RSK-080", title: "Model drift detected in Risk v1 production",              project: "PRJ-1044", severity: "Medium",   likelihood: "High",   owner: "ML Platform",   eta: "2026-05-25" },
  { id: "RSK-081", title: "Data quality gap in source CRM extract",                  project: "PRJ-1043", severity: "Medium",   likelihood: "Medium", owner: "Data Steward",  eta: "2026-06-15" },
  { id: "RSK-082", title: "Azure region capacity constraint for vector store",       project: "PRJ-1043", severity: "Low",      likelihood: "Medium", owner: "Cloud Eng.",    eta: "2026-06-20" },
];

export const vendors = [
  { id: "VND-001", name: "Snowflake",        category: "Data Platform",   contract: "12.4M SAR", utilization: 78, sla: 99.2, perf: 91, projects: 3, status: "Healthy"     },
  { id: "VND-002", name: "Databricks",       category: "AI / ML",         contract:  "8.6M SAR", utilization: 64, sla: 98.7, perf: 88, projects: 2, status: "Healthy"     },
  { id: "VND-003", name: "Microsoft Azure",  category: "Cloud / GenAI",   contract: "21.2M SAR", utilization: 81, sla: 99.6, perf: 93, projects: 6, status: "Healthy"     },
  { id: "VND-004", name: "Informatica",      category: "Data Governance", contract:  "4.8M SAR", utilization: 52, sla: 97.4, perf: 79, projects: 1, status: "Watch"       },
  { id: "VND-005", name: "Local SI Partner", category: "Implementation",  contract:  "6.2M SAR", utilization: 88, sla: 96.1, perf: 74, projects: 4, status: "Underperform" },
  { id: "VND-006", name: "Power BI Premium", category: "Analytics & BI",  contract:  "3.4M SAR", utilization: 67, sla: 99.1, perf: 90, projects: 5, status: "Healthy"     },
];

export const squadCapacity = [
  { squad: "AI Foundations",      members: 11, capacity: 88, allocated: 96, burnup: [12,22,34,46,58,72,85] },
  { squad: "Lakehouse Core",      members:  9, capacity: 72, allocated: 64, burnup: [10,18,28,40,52,60,68] },
  { squad: "Analytics Delivery",  members: 12, capacity: 96, allocated: 92, burnup: [14,26,40,52,66,80,90] },
  { squad: "Governance & MDM",    members:  6, capacity: 48, allocated: 38, burnup: [ 6,12,20,28,36,40,44] },
  { squad: "MLOps & Platform",    members:  7, capacity: 56, allocated: 60, burnup: [ 8,16,24,34,44,52,58] },
];

export const sprintBoard = {
  todo: [
    { id: "DI-2041", title: "Refactor ingest DAG for partition pruning", assignee: "A. Khan",   points: 5, type: "Story" },
    { id: "DI-2055", title: "Add lineage hooks to feature pipeline",     assignee: "S. Ali",    points: 3, type: "Story" },
    { id: "DI-2061", title: "Vector store quota uplift request",         assignee: "K. Shehri", points: 2, type: "Task" },
  ],
  in_progress: [
    { id: "DI-2017", title: "Eval harness for GenAI summarizer",     assignee: "F. Otaibi", points: 8, type: "Story" },
    { id: "DI-2032", title: "PII redaction service v2",              assignee: "N. Qahtani",points: 5, type: "Story" },
    { id: "DI-2048", title: "Build CDC connector to SAP S/4",        assignee: "H. Dossari",points: 8, type: "Story" },
  ],
  review: [
    { id: "DI-2001", title: "Feature-store online API perf tuning",  assignee: "K. Shehri", points: 5, type: "Story" },
    { id: "DI-2014", title: "Snowflake cost guardrails policy",      assignee: "L. Mutairi",points: 3, type: "Task" },
  ],
  done: [
    { id: "DI-1988", title: "Power BI dataset reusability framework",assignee: "R. Anazi",  points: 8, type: "Story" },
    { id: "DI-1992", title: "MLflow upgrade & tracking migration",   assignee: "K. Shehri", points: 5, type: "Story" },
    { id: "DI-1994", title: "Compliance dashboard sign-off",         assignee: "L. Mutairi",points: 3, type: "Task" },
  ],
};

export const milestones = [
  { id: "M-21", project: "PRJ-1042", title: "Lakehouse Foundation Live",     date: "2026-06-30", status: "On Track" },
  { id: "M-22", project: "PRJ-1043", title: "GenAI Pilot Go-Live",           date: "2026-07-15", status: "On Track" },
  { id: "M-23", project: "PRJ-1044", title: "Risk Model v2 UAT",             date: "2026-06-20", status: "At Risk"  },
  { id: "M-24", project: "PRJ-1045", title: "Reg Reporting Phase 1 Deploy", date: "2026-07-31", status: "Delayed" },
  { id: "M-25", project: "PRJ-1046", title: "MDM Golden Records Cut-over",   date: "2026-09-10", status: "On Track" },
  { id: "M-26", project: "PRJ-1047", title: "MLOps Platform Production",     date: "2026-10-10", status: "On Track" },
];

export const integrations = [
  { name: "Jira Cloud",         category: "Project & Sprint",   status: "Connected",  lastSync: "2 min ago",  health: 99, mode: "API · 5 min interval" },
  { name: "Azure DevOps",       category: "Engineering",         status: "Connected",  lastSync: "4 min ago",  health: 98, mode: "API · 5 min interval" },
  { name: "ServiceNow",         category: "Demand & ITSM",       status: "Connected",  lastSync: "9 min ago",  health: 96, mode: "Webhook + nightly" },
  { name: "Power BI",           category: "Analytics",           status: "Connected",  lastSync: "1 min ago",  health: 99, mode: "Dataset refresh" },
  { name: "SharePoint",         category: "Documents",           status: "Connected",  lastSync: "14 min ago", health: 97, mode: "Graph API" },
  { name: "Confluence",         category: "Knowledge",           status: "Connected",  lastSync: "22 min ago", health: 94, mode: "API · hourly" },
  { name: "SAP S/4 Finance",    category: "Budget & Finance",    status: "Connected",  lastSync: "1 hr ago",   health: 92, mode: "Nightly batch" },
  { name: "Vendor Mgmt (Ariba)",category: "Procurement",         status: "Degraded",   lastSync: "3 hr ago",   health: 78, mode: "Scheduled · 4 hr"  },
  { name: "GitHub Enterprise",  category: "Source & MR",         status: "Connected",  lastSync: "30 sec ago", health: 99, mode: "Webhook" },
];

export const auditLog = [
  { ts: "2026-05-14 21:42", actor: "L. Al-Mutairi", action: "Approved demand DMD-0237 (HR Workforce Planning Cube)", target: "Demand Intake", severity: "Info"   },
  { ts: "2026-05-14 20:18", actor: "System",        action: "Vendor Ariba sync degraded — fallback to nightly batch",  target: "Integrations",  severity: "Warn"   },
  { ts: "2026-05-14 17:55", actor: "K. Al-Shehri",  action: "Deployed feature-store v2.4 to production",               target: "PRJ-1047",      severity: "Info"   },
  { ts: "2026-05-14 16:09", actor: "Compliance Bot",action: "Risk RSK-078 escalated to Executive Committee",           target: "PRJ-1045",      severity: "Critical"},
  { ts: "2026-05-14 14:32", actor: "R. Alghamdi",   action: "Exported Executive Pack — May 2026",                      target: "Reporting",     severity: "Info"   },
  { ts: "2026-05-14 11:01", actor: "F. Al-Otaibi",  action: "Updated architecture record ADR-0034 (Vector Store)",     target: "PRJ-1043",      severity: "Info"   },
];

export const visionAlignment = [
  { theme: "Government Effectiveness", initiatives: 12, weight: 28, value: 48 },
  { theme: "Public Sector Innovation", initiatives:  9, weight: 22, value: 36 },
  { theme: "Digital Economy",          initiatives: 11, weight: 24, value: 32 },
  { theme: "Workforce Capability",     initiatives:  7, weight: 14, value: 18 },
  { theme: "Cybersecurity & Trust",    initiatives:  8, weight: 12, value: 22 },
];
