import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader, KpiCard, SectionCard, StatusPill, MiniProgress, Tag } from "@/components/primitives";
import { downloadPDF, downloadPPTX, downloadXLSX, emailReport, type ReportPayload } from "@/lib/exports";
import { useToast } from "@/hooks/use-toast";
import {
  demands, projects, vendors, risks, budgetByPortfolio, valueRealization,
  squadCapacity, milestones, integrations, auditLog, sprintBoard, strategicInitiatives,
} from "@/lib/mock-data";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area, RadialBarChart, RadialBar, Cell, ComposedChart, Line,
} from "recharts";
import {
  Sparkle, Filter, Plus, Download, ArrowRight, Plug, History, CheckCircle2, XCircle,
  Clock, AlertTriangle, FileBarChart2, Mail, Presentation, FileDown,
  Webhook, Workflow, Database, Cable, RefreshCcw, Building2, Wallet,
  FlaskConical, ShieldCheck, BookOpen, Layers,
} from "lucide-react";

/* ============================ DEMAND INTAKE ============================ */
export function DemandPage({ onOpenAI }: { onOpenAI: () => void }) {
  const { toast } = useToast();
  const showItem = (title: string, desc: string) => () => toast({ title, description: desc });
  const stages = ["Intake", "Discovery", "Prioritization", "Approval"] as const;
  const onNewDemand = () => toast({ title: "New demand", description: "Intake form would open here." });
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Demand Intake & Prioritization"
        title="128 demands in pipeline"
        subtitle="Standardized intake from business, captured via ServiceNow and scored against value, effort, strategic fit and risk."
        actions={
          <>
            <Button onClick={onOpenAI} variant="outline" className="h-9 rounded-xl gap-1.5"><Sparkle className="size-3.5" /> Score with AI</Button>
            <Button onClick={onNewDemand} className="h-9 rounded-xl gap-1.5 bg-[#C66E4E] hover:bg-[#b15f43] text-white"><Plus className="size-3.5" /> New demand</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard label="Demands in Pipeline" value={128} delta="+23 MoM" trend="up"   accent="purple2" />
        <KpiCard label="In Approval"         value={6}   delta="2 critical" trend="up"   accent="coral" />
        <KpiCard label="Avg Cycle Time"      value={14}  suffix=" days" delta="-2d" trend="down" accent="primary" />
        <KpiCard label="Value Score Avg"     value={7.2} delta="+0.4" trend="up"   accent="orange" />
      </div>

      <SectionCard title="Pipeline Funnel" subtitle="Stage distribution">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {stages.map((s, i) => {
            const count = demands.filter(d => d.stage === s).length;
            return (
              <div key={s} className={`rounded-xl px-4 py-4 ${["bg-[#FCF4EF] dark:bg-secondary","bg-[#F9EBE0] dark:bg-secondary/80","bg-[#FFA38B]/25","bg-[#CFCCEF]/55 dark:bg-primary/15"][i]}`}>
                <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{s}</div>
                <div className="font-display text-[28px] font-bold tabular-nums mt-1">{count}</div>
                <div className="text-[11px] text-muted-foreground">demands</div>
              </div>
            );
          })}
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="text-left font-medium py-2 pr-3">ID</th>
                <th className="text-left font-medium py-2 pr-3">Title</th>
                <th className="text-left font-medium py-2 pr-3">Requester</th>
                <th className="text-left font-medium py-2 pr-3">Priority</th>
                <th className="text-left font-medium py-2 pr-3">Stage</th>
                <th className="text-left font-medium py-2 pr-3 w-[100px]">Value</th>
                <th className="text-left font-medium py-2 pr-3">Effort</th>
                <th className="text-left font-medium py-2 pr-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {demands.map(d => (
                <tr key={d.id} onClick={showItem(`${d.id} · ${d.title}`, `${d.requester} · ${d.priority} · ${d.stage} · value ${d.value.toFixed(1)} · effort ${d.effort}`)} className="hover:bg-secondary/40 transition-colors cursor-pointer">
                  <td className="py-2.5 pr-3 font-mono text-[10.5px] text-muted-foreground">{d.id}</td>
                  <td className="py-2.5 pr-3 font-medium">{d.title}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{d.requester}</td>
                  <td className="py-2.5 pr-3"><StatusPill>{d.priority}</StatusPill></td>
                  <td className="py-2.5 pr-3"><Tag tone="purple">{d.stage}</Tag></td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 max-w-[60px]"><MiniProgress value={d.value * 10} /></div>
                      <span className="font-semibold tabular-nums text-[11.5px]">{d.value.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3"><Tag tone="warm">{d.effort}</Tag></td>
                  <td className="py-2.5 pr-3 text-muted-foreground tabular-nums">{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ============================ BUDGET ============================ */
export function BudgetPage() {
  const { toast } = useToast();
  const onExportBudget = () => {
    const rows = projects.slice(0, 6).map(p => ({
      Project: p.name, ID: p.id, Plan_SAR_M: 12.4, Actual_SAR_M: +(12.4 * p.budgetUsed / 100).toFixed(1),
      Utilization_Pct: p.budgetUsed, Status: p.status, Owner: p.owner,
    }));
    downloadXLSX(rows, "budget-burn-down");
    toast({ title: "Excel ready", description: "Budget burn-down exported." });
  };
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Budget Management"
        title="Budget vs Actuals — 134M SAR portfolio"
        subtitle="Plan, commitment and actuals tracked from SAP S/4 Finance with nightly reconciliation."
        actions={<Button onClick={onExportBudget} variant="outline" className="h-9 rounded-xl gap-1.5"><Download className="size-3.5" /> Export</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard label="Total Plan"        value="134M" suffix="SAR" accent="navy"    delta="FY 2026" />
        <KpiCard label="Committed"         value="117M" suffix="SAR" accent="orange"  delta="87% of plan" trend="up" />
        <KpiCard label="Actual Spent"      value="91M"  suffix="SAR" accent="primary" delta="68% utilized" trend="up" />
        <KpiCard label="Forecast Variance" value="-3.2" suffix="%"   accent="coral"   delta="Within tolerance" />
      </div>

      <SectionCard title="Budget Utilization by Portfolio" subtitle="Plan / committed / actual · SAR M">
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={budgetByPortfolio} margin={{ top: 6, right: 6, bottom: 0, left: -10 }} barGap={4}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="portfolio" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--popover-border))", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="planned"   fill="hsl(var(--chart-4))" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="committed" fill="hsl(var(--chart-3))" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="actual"    fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Burn-down by Project" subtitle="Top 6 by spend">
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="text-left font-medium py-2 pr-3">Project</th>
                <th className="text-left font-medium py-2 pr-3">Plan</th>
                <th className="text-left font-medium py-2 pr-3">Actual</th>
                <th className="text-left font-medium py-2 pr-3 w-[180px]">Utilization</th>
                <th className="text-left font-medium py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {projects.slice(0, 6).map(p => (
                <tr key={p.id} onClick={() => toast({ title: `${p.id} · ${p.name}`, description: `Plan 12.4M SAR · actual ${(12.4 * p.budgetUsed / 100).toFixed(1)}M · ${p.budgetUsed}% utilized · ${p.status}` })} className="hover:bg-secondary/40 cursor-pointer">
                  <td className="py-3 pr-3 font-semibold">{p.name} <span className="font-mono text-[10.5px] text-muted-foreground ml-1">{p.id}</span></td>
                  <td className="py-3 pr-3 tabular-nums">12.4M SAR</td>
                  <td className="py-3 pr-3 tabular-nums">{(12.4 * p.budgetUsed / 100).toFixed(1)}M SAR</td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1"><MiniProgress value={p.budgetUsed} tone={p.budgetUsed > 85 ? "bad" : p.budgetUsed > 70 ? "warn" : "primary"} /></div>
                      <span className="tabular-nums font-medium">{p.budgetUsed}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3"><StatusPill>{p.status}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ============================ VENDORS ============================ */
export function VendorsPage() {
  const { toast } = useToast();
  const onFilter = () => toast({ title: "Filter", description: "Vendor filter panel would open here." });
  const onOpenScorecard = (v: typeof vendors[number]) => {
    const payload: ReportPayload = {
      title: `Vendor Scorecard — ${v.name}`,
      subtitle: `${v.category} · ${v.id} · ${v.projects} projects\nContract ${v.contract} · Status ${v.status}`,
      kpis: [
        { label: "Performance", value: `${v.perf}/100`, hint: v.perf < 75 ? "Underperforming" : v.perf < 85 ? "Watch" : "On track" },
        { label: "SLA",         value: `${v.sla}%`,     hint: v.sla < 97 ? "Below target" : "Within target" },
        { label: "Utilization", value: `${v.utilization}%`, hint: "Contract burn" },
        { label: "Projects",    value: String(v.projects),  hint: "Active engagements" },
      ],
      sections: [
        { heading: "Performance summary", bullets: [
          `Overall performance score ${v.perf}/100`,
          `SLA adherence ${v.sla}% across active deliverables`,
          `Contract utilization at ${v.utilization}% — ${v.contract}`,
        ]},
      ],
    };
    downloadPDF(payload, `vendor-${v.id.toLowerCase()}-scorecard`);
    toast({ title: "Scorecard exported", description: `${v.name} scorecard PDF downloaded.` });
  };
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Vendor Management"
        title="Vendor performance & contract utilization"
        subtitle="Live vendor scorecard across performance, SLA adherence, deliverables and contract burn."
        actions={<Button onClick={onFilter} variant="outline" className="h-9 rounded-xl gap-1.5"><Filter className="size-3.5" /> Filter</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard label="Active Vendors"   value={6}  delta="56.6M SAR committed" accent="navy" />
        <KpiCard label="Avg Performance"  value={86} delta="+3 pts" trend="up" accent="primary" />
        <KpiCard label="SLA Adherence"    value={98.4} suffix="%" delta="-0.2 pts" trend="down" accent="orange" />
        <KpiCard label="At Risk"          value={2}  delta="1 watch · 1 underperform" accent="coral" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {vendors.map(v => (
          <div key={v.id} className="rounded-2xl border border-card-border bg-card p-5 shadow-soft hover-elevate transition-all">
            <div className="flex items-start gap-3">
              <div className="size-12 rounded-xl gradient-purple-soft grid place-items-center text-[14px] font-semibold text-[#3a3585]">
                {v.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 justify-between">
                  <div className="font-display text-[15px] font-semibold truncate">{v.name}</div>
                  <StatusPill>{v.status}</StatusPill>
                </div>
                <div className="text-[11.5px] text-muted-foreground mt-1">{v.category} · {v.id} · {v.projects} projects</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/60">
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">Contract</div>
                <div className="font-display text-[16px] font-bold tabular-nums mt-0.5">{v.contract}</div>
              </div>
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">Performance</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="font-display text-[16px] font-bold tabular-nums">{v.perf}</div>
                  <span className="text-[10.5px] text-muted-foreground">/100</span>
                </div>
                <div className="mt-1"><MiniProgress value={v.perf} tone={v.perf < 75 ? "bad" : v.perf < 85 ? "warn" : "primary"} /></div>
              </div>
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">SLA</div>
                <div className="font-display text-[16px] font-bold tabular-nums mt-0.5">{v.sla}%</div>
                <div className="mt-1"><MiniProgress value={v.sla} tone={v.sla < 97 ? "warn" : "ok"} /></div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11.5px]">
              <span className="text-muted-foreground">Utilization · <span className="font-semibold tabular-nums text-foreground">{v.utilization}%</span></span>
              <Button onClick={() => onOpenScorecard(v)} variant="ghost" size="sm" className="h-7 px-2 text-[11px] gap-1">Open scorecard <ArrowRight className="size-3" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ RISKS ============================ */
export function RisksPage() {
  const { toast } = useToast();
  const showItem = (title: string, desc: string) => () => toast({ title, description: desc });
  const matrix = ["Critical", "High", "Medium", "Low"];
  const likes = ["Low", "Medium", "High"];
  const onExportRegister = () => {
    const rows = risks.map(r => ({
      ID: r.id, Title: r.title, Project: r.project, Severity: r.severity,
      Likelihood: r.likelihood, Owner: r.owner, ETA: r.eta,
    }));
    downloadXLSX(rows, "risk-register");
    toast({ title: "Excel ready", description: "Risk register exported." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Risk, Issue & Dependency Register"
        title="Active risks & escalations"
        subtitle="Aggregated from ServiceNow GRC, Jira and project records. Heatmap by severity × likelihood."
        actions={<Button onClick={onExportRegister} variant="outline" className="h-9 rounded-xl gap-1.5"><Download className="size-3.5" /> Export register</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard label="Open Risks"        value={42} delta="+6 WoW" trend="up"   accent="purple2" />
        <KpiCard label="Critical"          value={2}  delta="escalated to ExCo" accent="coral" />
        <KpiCard label="High"              value={9}  delta="+1 WoW" trend="up"   accent="orange" />
        <KpiCard label="Resolved YTD"      value={87} delta="MTTR 11d" trend="down" accent="primary" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <SectionCard className="lg:col-span-2" title="Risk Register" subtitle="Open risks across portfolio">
          <div className="space-y-2">
            {risks.map(r => (
              <button key={r.id} onClick={showItem(`${r.id} · ${r.title}`, `${r.severity} · ${r.project} · likelihood ${r.likelihood} · owner ${r.owner} · ETA ${r.eta}`)} className="w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl bg-secondary/40 hover-elevate transition-all cursor-pointer">
                <div className={`size-9 rounded-lg grid place-items-center shrink-0
                  ${r.severity === "Critical" ? "bg-bad/14 text-bad"
                  : r.severity === "High" ? "bg-warn/14 text-warn"
                  : "bg-primary/12 text-primary"}`}>
                  <AlertTriangle className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10.5px] font-mono text-muted-foreground">{r.id}</span>
                    <StatusPill>{r.severity}</StatusPill>
                    <Tag tone="purple">{r.project}</Tag>
                    <span className="text-[10.5px] text-muted-foreground">Likelihood · {r.likelihood}</span>
                  </div>
                  <div className="text-[13px] font-medium mt-1 leading-snug">{r.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">Owner · {r.owner} · ETA {r.eta}</div>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Severity × Likelihood Heatmap" subtitle="Risk concentration">
          <div className="space-y-1">
            <div className="grid grid-cols-4 gap-1 text-[10px] text-muted-foreground text-center mb-1">
              <div></div>{likes.map(l => <div key={l} className="text-center">{l}</div>)}
            </div>
            {matrix.map((sev, i) => (
              <div key={sev} className="grid grid-cols-4 gap-1">
                <div className="text-[10.5px] text-muted-foreground self-center">{sev}</div>
                {likes.map((l, j) => {
                  // approximate density
                  const density = [
                    [1, 3, 5], [2, 5, 8], [4, 7, 9], [6, 4, 2],
                  ][i][j];
                  const intensity = Math.min(100, density * 10);
                  const heat =
                    i === 0 ? `rgba(232,78,55,${0.15 + intensity / 200})`
                    : i === 1 ? `rgba(198,110,78,${0.12 + intensity / 220})`
                    : i === 2 ? `rgba(139,132,215,${0.10 + intensity / 240})`
                    : `rgba(207,204,239,${0.10 + intensity / 280})`;
                  return (
                    <div key={l} className="aspect-square rounded-lg grid place-items-center text-[14px] font-semibold tabular-nums"
                      style={{ background: heat, color: "#0C2341" }}>
                      {density}
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="pt-3 text-[10.5px] text-muted-foreground">Rows = severity · Columns = likelihood · Cell = open risk count</div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ============================ VALUE REALIZATION ============================ */
export function ValuePage() {
  const { toast } = useToast();
  const showItem = (title: string, desc: string) => () => toast({ title, description: desc });
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Value Realization & Benefits"
        title="142M SAR realized YTD · 156M planned"
        subtitle="Benefits tracked against business cases — efficiency, revenue, cost avoidance and regulatory readiness."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard label="Realized YTD"        value="142M" suffix="SAR" delta="+18M MoM" trend="up" accent="primary" />
        <KpiCard label="Forecast (FY)"        value="172M" suffix="SAR" delta="+12% vs plan" trend="up" accent="purple2" />
        <KpiCard label="Realization Rate"     value={91}  suffix="%"   delta="+2 pts" trend="up" accent="orange" />
        <KpiCard label="Initiatives Realizing" value={29}                delta="of 47 active" accent="coral" />
      </div>

      <SectionCard title="Cumulative Value · Plan vs Realized" subtitle="SAR millions · YTD">
        <div className="h-[320px]">
          <ResponsiveContainer>
            <AreaChart data={valueRealization} margin={{ top: 6, right: 6, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="vReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--popover-border))", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="planned"  stroke="hsl(var(--chart-3))" fill="none" strokeWidth={2} strokeDasharray="4 4" />
              <Area type="monotone" dataKey="realized" stroke="hsl(var(--chart-1))" fill="url(#vReal)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Initiative Benefits Tracking">
        <div className="space-y-2">
          {strategicInitiatives.map((i, idx) => (
            <button key={i.id} onClick={showItem(`${i.id} · ${i.name}`, `${i.vision} · planned ${(8 + idx * 4)}M SAR · realized ${Math.round((8 + idx * 4) * i.progress / 100)}M SAR · ${i.progress}% realization`)} className="w-full text-left grid grid-cols-12 items-center gap-3 px-3 py-3 rounded-xl bg-secondary/40 hover-elevate transition-all cursor-pointer">
              <div className="col-span-5">
                <div className="font-mono text-[10.5px] text-muted-foreground">{i.id}</div>
                <div className="text-[13px] font-semibold">{i.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Theme · {i.vision.replace("Vision 2030 · ", "")}</div>
              </div>
              <div className="col-span-2 text-center">
                <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">Planned</div>
                <div className="font-display text-[16px] font-bold tabular-nums">{(8 + idx * 4)}M</div>
              </div>
              <div className="col-span-2 text-center">
                <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">Realized</div>
                <div className="font-display text-[16px] font-bold tabular-nums text-primary">{Math.round((8 + idx * 4) * i.progress / 100)}M</div>
              </div>
              <div className="col-span-3">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground">Realization</span>
                  <span className="tabular-nums font-semibold">{i.progress}%</span>
                </div>
                <MiniProgress value={i.progress} tone={i.progress < 50 ? "warn" : "primary"} />
              </div>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ============================ REPORTING ============================ */
export function ReportingPage({ onOpenAI }: { onOpenAI: () => void }) {
  const { toast } = useToast();
  const onNewPack = () => toast({ title: "New pack", description: "Report pack template selector would open here." });

  const buildPayload = (title: string, desc: string): ReportPayload => ({
    title, subtitle: desc, owner: "D&I Portfolio Office",
    kpis: [
      { label: "Active projects",  value: "47",       hint: "+6 QoQ" },
      { label: "Value YTD",        value: "142M SAR", hint: "+18M MoM" },
      { label: "Budget utilized",  value: "68%",      hint: "+4 pts" },
      { label: "On-time delivery", value: "84%",      hint: "+2 pts" },
    ],
    sections: [
      { heading: "Overview",       bullets: [desc, "Auto-generated from live portfolio data", "Brand-styled, citation-grounded"] },
      { heading: "Top exposures",  bullets: ["Regulatory deadline shift (PRJ-1045)", "Snowflake cost overrun", "Local SI Partner underperforming"] },
      { heading: "Recommendations", bullets: ["Re-balance ML Platform squad", "Accelerate UAT for Risk Predictive Models", "Renegotiate SI Partner SOW"] },
    ],
  });

  const openPack = (p: { title: string; desc: string; format: string }) => {
    const payload = buildPayload(p.title, p.desc);
    const base = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (p.format === "PowerPoint") { downloadPPTX(payload, base); toast({ title: "PowerPoint ready", description: `${p.title} downloaded.` }); }
    else if (p.format === "Excel")  { downloadXLSX(vendors.map(v => ({ Vendor: v.name, ID: v.id, Category: v.category, Contract: v.contract, Performance: v.perf, SLA: `${v.sla}%`, Utilization: `${v.utilization}%`, Status: v.status })), base); toast({ title: "Excel ready", description: `${p.title} downloaded.` }); }
    else                            { downloadPDF(payload,  base); toast({ title: "PDF ready",        description: `${p.title} downloaded.` }); }
  };
  const downloadPack = openPack;
  const emailPack = (p: { title: string; desc: string }) => {
    emailReport(`${p.title} — D&I Portfolio`, `${p.desc}\n\nReport pack from the D&I Portfolio Portal.`);
    toast({ title: "Email draft opened", description: "Your mail client will open." });
  };

  const packs = [
    { title: "Executive Pack · May 2026",     desc: "Portfolio health, value, risks, vendors · auto-generated", date: "2026-05-14", format: "PowerPoint" },
    { title: "ExCo Risk Briefing",            desc: "Top 5 risks, mitigation, escalations · regulatory deep-dive", date: "2026-05-12", format: "PDF" },
    { title: "Vision 2030 Alignment Report",  desc: "Theme contribution and weighted progress",                date: "2026-05-10", format: "PDF" },
    { title: "Vendor Performance Quarterly",  desc: "Scorecards, SLA breaches, contract burn",                  date: "2026-05-01", format: "Excel" },
    { title: "Demand Pipeline Brief",         desc: "Intake, prioritization committee outputs",                 date: "2026-04-29", format: "PowerPoint" },
    { title: "Sprint Health · Engineering",   desc: "Velocity, burnup, blockers, deployment cadence",          date: "2026-04-28", format: "PDF" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Executive Reporting"
        title="Reporting packs & one-click summaries"
        subtitle="Composable reports auto-generated from live portfolio data. Brand-styled, citation-grounded, export-ready."
        actions={
          <>
            <Button onClick={onOpenAI} variant="outline" className="h-9 rounded-xl gap-1.5"><Sparkle className="size-3.5" /> Generate with AI</Button>
            <Button onClick={onNewPack} className="h-9 rounded-xl gap-1.5 bg-primary hover:bg-primary/90"><Plus className="size-3.5" /> New pack</Button>
          </>
        }
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {packs.map(p => (
          <div key={p.title} className="rounded-2xl border border-card-border bg-card overflow-hidden shadow-soft hover-elevate transition-all">
            <div className="h-20 gradient-purple-soft relative grain">
              <div className="absolute right-3 top-3"><Tag tone="warm">{p.format}</Tag></div>
              <FileBarChart2 className="absolute bottom-3 left-4 size-6 text-[#3a3585]" />
            </div>
            <div className="p-4">
              <div className="font-display text-[14.5px] font-semibold leading-snug">{p.title}</div>
              <div className="text-[11.5px] text-muted-foreground mt-1 leading-snug">{p.desc}</div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                <div className="text-[11px] text-muted-foreground tabular-nums">{p.date}</div>
                <div className="flex gap-1">
                  <Button onClick={() => openPack(p)}     variant="ghost" size="icon" className="size-7" aria-label="Open pack"><Presentation className="size-3.5" /></Button>
                  <Button onClick={() => downloadPack(p)} variant="ghost" size="icon" className="size-7" aria-label="Download pack"><FileDown className="size-3.5" /></Button>
                  <Button onClick={() => emailPack(p)}    variant="ghost" size="icon" className="size-7" aria-label="Email pack"><Mail className="size-3.5" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ INTEGRATIONS ============================ */
export function IntegrationsPage() {
  const { toast } = useToast();
  const showItem = (title: string, desc: string) => () => toast({ title, description: desc });
  const flow = [
    { name: "Source systems",  d: "Jira · Azure DevOps · ServiceNow · SAP · GitHub · Power BI", i: Database },
    { name: "Connector tier",   d: "API · Webhook · Scheduled batch · CDC streams",              i: Cable },
    { name: "Integration bus",  d: "Event broker · normalization · enrichment",                   i: Webhook },
    { name: "Portfolio service",d: "Domain model · projections · derivations · KPIs",            i: Workflow },
    { name: "Portal & Copilot", d: "Role-aware UI · grounded AI · exports",                       i: Layers },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Integration Layer"
        title="Connectors, sync health and integration architecture"
        subtitle="The portfolio service is the source of truth — populated from operational systems through API, webhook, CDC and scheduled batch."
        actions={<Button onClick={() => toast({ title: "Sync triggered", description: "All connectors are re-syncing in the background." })} variant="outline" className="h-9 rounded-xl gap-1.5"><RefreshCcw className="size-3.5" /> Sync all</Button>}
      />

      <SectionCard title="Integration Flow" subtitle="Conceptual data flow from source systems to the portal">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-3">
          {flow.map((f, i) => (
            <div key={f.name} className="relative">
              <button onClick={showItem(f.name, f.d)} className="w-full text-left rounded-2xl bg-secondary/50 p-4 h-full border border-border/60 hover-elevate transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-7 rounded-lg bg-primary/15 text-primary grid place-items-center"><f.i className="size-3.5" /></div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Layer {i + 1}</div>
                </div>
                <div className="font-display text-[13.5px] font-semibold">{f.name}</div>
                <div className="text-[11px] text-muted-foreground mt-1.5 leading-snug">{f.d}</div>
              </button>
              {i < flow.length - 1 && (
                <ArrowRight className="hidden md:block size-4 text-muted-foreground absolute -right-3 top-1/2 -translate-y-1/2 z-10" />
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Connected Systems" subtitle="Live sync health">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-3">
          {integrations.map(c => (
            <button key={c.name} onClick={showItem(c.name, `${c.category} · health ${c.health}% · ${c.mode} · last sync ${c.lastSync}`)} className="w-full text-left rounded-xl border border-card-border bg-card p-3.5 hover-elevate transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-9 rounded-lg bg-secondary grid place-items-center"><Plug className="size-4" /></div>
                  <div>
                    <div className="font-display text-[13.5px] font-semibold">{c.name}</div>
                    <div className="text-[10.5px] text-muted-foreground">{c.category}</div>
                  </div>
                </div>
                <StatusPill>{c.status}</StatusPill>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
                <div>
                  <div className="text-muted-foreground">Health</div>
                  <div className="font-semibold tabular-nums">{c.health}%</div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground">Mode</div>
                  <div className="font-medium leading-tight">{c.mode}</div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[10.5px] text-muted-foreground">
                <span>Last sync · {c.lastSync}</span>
                <Button onClick={(e) => { e.stopPropagation(); toast({ title: `Sync · ${c.name}`, description: "Syncing now." }); }} variant="ghost" size="sm" className="h-6 px-1.5 text-[10.5px]"><RefreshCcw className="size-3" /></Button>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ============================ GOVERNANCE / AUDIT ============================ */
export function GovernancePage() {
  const { toast } = useToast();
  const showItem = (title: string, desc: string) => () => toast({ title, description: desc });
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audit & Governance"
        title="Audit trail, governance log and access oversight"
        subtitle="Immutable activity log capturing every approval, change, export and integration event."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard label="Events (24h)"          value={234} delta="+12% vs avg" trend="up"   accent="primary" />
        <KpiCard label="Approvals Logged"      value={48}  delta="6 critical"  accent="purple2" />
        <KpiCard label="Access Reviews Due"    value={3}   delta="this week"   accent="coral" />
        <KpiCard label="Policy Violations"     value={0}   delta="clean"       accent="orange" />
      </div>

      <SectionCard title="Activity Log" subtitle="Most recent 24 hours">
        <div className="space-y-1.5">
          {auditLog.map((a, i) => (
            <button key={i} onClick={showItem(`${a.ts} · ${a.actor}`, `${a.action} · target ${a.target} · ${a.severity}`)} className="w-full text-left grid grid-cols-12 gap-2 px-3 py-2.5 rounded-lg bg-secondary/40 hover-elevate transition-all text-[12px] cursor-pointer">
              <div className="col-span-3 font-mono text-[10.5px] text-muted-foreground tabular-nums">{a.ts}</div>
              <div className="col-span-2 truncate">{a.actor}</div>
              <div className="col-span-5 truncate">{a.action}</div>
              <div className="col-span-1"><Tag tone="purple">{a.target}</Tag></div>
              <div className="col-span-1 text-right">
                <StatusPill>{a.severity === "Critical" ? "Critical" : a.severity === "Warn" ? "Warn" : "Info"}</StatusPill>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      <div className="grid lg:grid-cols-2 gap-4">
        <SectionCard title="Role-Based Access Control" subtitle="Effective permissions">
          <div className="space-y-2">
            {[
              { r: "Executive",     scope: "Read all · export · audit",                                 users: 18 },
              { r: "Portfolio Mgr", scope: "Read all · edit pipeline · approve demands · reports",     users: 24 },
              { r: "Delivery Lead", scope: "Read portfolio · edit project · risks · vendors",          users: 36 },
              { r: "Tech Lead",     scope: "Read assigned · Jira sync · ADRs · deploy reqs",           users: 52 },
              { r: "Squad Member",  scope: "Read assigned · update tasks · documentation",             users: 118 },
              { r: "Auditor",       scope: "Read all · audit log · exports",                            users: 5 },
            ].map(r => (
              <button key={r.r} onClick={showItem(r.r, `${r.scope} · ${r.users} users`)} className="w-full text-left grid grid-cols-12 items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/40 hover-elevate transition-all cursor-pointer">
                <div className="col-span-3 flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-primary" />
                  <span className="font-semibold text-[12.5px]">{r.r}</span>
                </div>
                <div className="col-span-7 text-[11.5px] text-muted-foreground truncate">{r.scope}</div>
                <div className="col-span-2 text-right text-[11.5px] tabular-nums">{r.users} users</div>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Document & Evidence Repository" subtitle="ADRs, governance docs, evidence packs">
          <div className="space-y-2">
            {[
              { t: "Portfolio Governance Charter v2.1", k: "Charter",       at: "2 weeks ago" },
              { t: "AI Risk Management Policy",          k: "Policy",       at: "1 month ago" },
              { t: "Data Classification Standard",       k: "Standard",     at: "3 weeks ago" },
              { t: "Vendor Onboarding Playbook",         k: "Playbook",     at: "1 week ago"  },
              { t: "Cyber Architecture Pattern Library", k: "Reference",    at: "5 days ago"  },
              { t: "Vision 2030 Mapping Workbook",       k: "Workbook",     at: "2 days ago"  },
            ].map(d => (
              <button key={d.t} onClick={showItem(d.t, `${d.k} · updated ${d.at}`)} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/40 hover-elevate transition-all cursor-pointer">
                <BookOpen className="size-3.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium truncate">{d.t}</div>
                  <div className="text-[10.5px] text-muted-foreground">{d.k} · updated {d.at}</div>
                </div>
                <span className="text-[11px] font-medium text-primary px-2">Open</span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ============================ SQUADS ============================ */
export function SquadsPage() {
  const { toast } = useToast();
  const showItem = (title: string, desc: string) => () => toast({ title, description: desc });
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resource & Capacity"
        title="Squads, capacity, and performance"
        subtitle="Allocation, velocity, burnup, and team health across delivery squads."
      />
      <div className="grid lg:grid-cols-2 gap-4">
        {squadCapacity.map(s => {
          const pct = Math.round((s.allocated / s.capacity) * 100);
          return (
            <button key={s.squad} onClick={showItem(s.squad, `${s.members} members · ${s.allocated}/${s.capacity} sp · ${pct}% allocated`)} className="w-full text-left rounded-2xl bg-card border border-card-border p-5 shadow-soft hover-elevate transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-display text-[16px] font-semibold">{s.squad}</div>
                  <div className="text-[11.5px] text-muted-foreground">{s.members} members · {s.capacity} sp capacity</div>
                </div>
                <StatusPill>{pct > 100 ? "At Risk" : pct < 75 ? "On Hold" : "On Track"}</StatusPill>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1"><MiniProgress value={Math.min(100, pct)} tone={pct > 100 ? "warn" : "primary"} /></div>
                <span className="text-[12.5px] font-semibold tabular-nums">{pct}%</span>
              </div>
              <div className="h-[120px] mt-4 pointer-events-none">
                <ResponsiveContainer>
                  <AreaChart data={s.burnup.map((v, i) => ({ sprint: `S${i + 1}`, v }))} margin={{ top: 6, right: 6, bottom: 0, left: -30 }}>
                    <defs>
                      <linearGradient id={`g${s.squad}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="hsl(var(--chart-1))" fill={`url(#g${s.squad})`} strokeWidth={2.5} />
                    <XAxis dataKey="sprint" hide />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--popover-border))", borderRadius: 12, fontSize: 12 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ MILESTONES ============================ */
export function MilestonesPage() {
  const { toast } = useToast();
  const showItem = (title: string, desc: string) => () => toast({ title, description: desc });
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Milestones & Deliverables"
        title="Portfolio milestone roadmap"
        subtitle="Cross-project milestones, deliverables and gates."
      />
      <SectionCard title="Next 120 days">
        <div className="relative pl-6 ml-2 border-l border-dashed border-border space-y-4">
          {milestones.map(m => (
            <div key={m.id} className="relative">
              <div className={`absolute -left-[31px] top-1.5 size-3 rounded-full ring-4 ring-background
                ${m.status === "Delayed" ? "bg-bad" : m.status === "At Risk" ? "bg-warn" : "bg-primary"}`} />
              <button onClick={showItem(`${m.id} · ${m.title}`, `${m.project} · ${m.status} · due ${m.date}`)} className="w-full text-left flex flex-col md:flex-row md:items-center justify-between gap-2 px-3 py-3 rounded-xl bg-secondary/40 hover-elevate transition-all cursor-pointer">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10.5px] font-mono text-muted-foreground">{m.id}</span>
                    <span className="text-[10.5px] font-mono text-muted-foreground">· {m.project}</span>
                    <StatusPill>{m.status}</StatusPill>
                  </div>
                  <div className="text-[14px] font-semibold mt-1">{m.title}</div>
                </div>
                <div className="text-[12.5px] tabular-nums text-muted-foreground">{m.date}</div>
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ============================ SPRINT (alias of tech board minimal) ============================ */
export function SprintPage() {
  const { toast } = useToast();
  const showItem = (title: string, desc: string) => () => toast({ title, description: desc });
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sprint"
        title="DI-Sprint-14 · AI Foundations"
        subtitle="Live Jira sync · 4 columns · 11 items"
      />
      <SectionCard title="Sprint Board">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {(["todo","in_progress","review","done"] as const).map(k => {
            const map = { todo: "To Do", in_progress: "In Progress", review: "In Review", done: "Done" } as const;
            const items = (sprintBoard as any)[k];
            return (
              <div key={k}>
                <div className="text-[12px] font-semibold uppercase tracking-[0.14em] mb-2 px-1 flex items-center justify-between">
                  <span>{map[k]}</span><span className="text-[10.5px] text-muted-foreground">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((c: any) => (
                    <button key={c.id} onClick={showItem(`${c.id} · ${c.title}`, `${c.type} · ${c.assignee} · ${c.points}sp`)} className="w-full text-left bg-card rounded-xl border border-card-border p-3 shadow-soft hover-elevate cursor-pointer">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono text-muted-foreground">{c.id}</span>
                        <Tag tone="purple">{c.type}</Tag>
                      </div>
                      <div className="text-[12.5px] font-medium leading-snug mb-2">{c.title}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] text-muted-foreground">{c.assignee}</span>
                        <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-md bg-muted">{c.points}sp</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

/* ============================ APPROVALS ============================ */
export function ApprovalsPage() {
  const { toast } = useToast();
  const onAct = (action: string, id: string) => toast({ title: `Demand ${action}`, description: `${id} ${action}.` });
  const pending = demands.filter(d => d.stage === "Approval");
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Approval Workflow" title="Pending approvals" subtitle="Demand intake committee · 6 items awaiting decision." />
      <div className="grid md:grid-cols-2 gap-4">
        {pending.map(d => (
          <div key={d.id} className="rounded-2xl border border-card-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10.5px] font-mono text-muted-foreground">{d.id}</span>
              <StatusPill>{d.priority}</StatusPill>
            </div>
            <div className="font-display text-[15px] font-semibold leading-snug">{d.title}</div>
            <div className="text-[11.5px] text-muted-foreground mt-1.5">{d.requester} · value {d.value.toFixed(1)} · effort {d.effort}</div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button onClick={() => onAct("approved", d.id)} className="h-9 text-[12px] bg-ok/15 text-ok hover:bg-ok/25 border-0 gap-1"><CheckCircle2 className="size-3.5" /> Approve</Button>
              <Button onClick={() => onAct("deferred", d.id)} variant="outline" className="h-9 text-[12px] gap-1"><Clock className="size-3.5" /> Defer</Button>
              <Button onClick={() => onAct("rejected", d.id)} variant="ghost" className="h-9 text-[12px] text-bad hover:bg-bad/10 gap-1"><XCircle className="size-3.5" /> Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ ARCHITECTURE ============================ */
export function ArchitecturePage() {
  const { toast } = useToast();
  const showItem = (title: string, desc: string) => () => toast({ title, description: desc });
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Architecture & Data" title="Solution & data architecture status" />

      <div className="grid md:grid-cols-3 gap-4">
        <SectionCard title="Solution Architecture">
          <div className="space-y-2">
            {[
              { l: "Reference architecture",   s: "Approved" },
              { l: "Domain decomposition",     s: "Approved" },
              { l: "Integration patterns",     s: "In Review" },
              { l: "Non-functional reqs",      s: "Approved" },
            ].map(x => (
              <button key={x.l} onClick={showItem(x.l, `Status: ${x.s}`)} className="w-full text-left flex items-center justify-between text-[12.5px] px-3 py-2 rounded-xl bg-secondary/40 hover-elevate transition-all cursor-pointer">
                <span>{x.l}</span>
                <StatusPill>{x.s === "Approved" ? "On Track" : "At Risk"}</StatusPill>
              </button>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Data Architecture">
          <div className="space-y-2">
            {[
              { l: "Logical model",            s: "Approved" },
              { l: "Lineage coverage",         s: "82% mapped" },
              { l: "MDM golden records",       s: "In Progress" },
              { l: "Data contracts (active)",  s: "31 contracts" },
            ].map(x => (
              <button key={x.l} onClick={showItem(x.l, `Status: ${x.s}`)} className="w-full text-left flex items-center justify-between text-[12.5px] px-3 py-2 rounded-xl bg-secondary/40 hover-elevate transition-all cursor-pointer">
                <span>{x.l}</span>
                <span className="text-[11.5px] font-semibold">{x.s}</span>
              </button>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Quality Gates">
          <div className="space-y-2">
            {[
              { l: "SAST", v: "Pass" }, { l: "DAST", v: "Pass" }, { l: "License scan", v: "Pass" },
              { l: "Cost guardrails", v: "Pass" }, { l: "Privacy DPIA", v: "Pending" },
            ].map(x => (
              <button key={x.l} onClick={showItem(x.l, `Result: ${x.v}`)} className="w-full text-left flex items-center justify-between text-[12.5px] px-3 py-2 rounded-xl bg-secondary/40 hover-elevate transition-all cursor-pointer">
                <span>{x.l}</span>
                <StatusPill>{x.v === "Pass" ? "On Track" : "At Risk"}</StatusPill>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
