import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, KpiCard, SectionCard, StatusPill, MiniProgress, Tag } from "@/components/primitives";
import { sprintBoard, squadCapacity } from "@/lib/mock-data";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import {
  Sparkle, GitBranch, GitMerge, CheckCircle2, AlertTriangle, Database, Cpu,
  FileText, Rocket, FlaskConical, BookOpen, ArrowRight,
} from "lucide-react";

const burnup = squadCapacity[0].burnup.map((v, i) => ({
  day: `D${i * 2 + 1}`,
  completed: v,
  scope: 92,
}));

const dataReadiness = [
  { source: "CRM (Salesforce)",   status: "Ready",        quality: 92 },
  { source: "ERP (SAP S/4)",      status: "Validating",   quality: 78 },
  { source: "Core Banking Feed",  status: "Ready",        quality: 95 },
  { source: "Vendor Master",      status: "Gap",          quality: 62 },
  { source: "Risk Events Stream", status: "Ready",        quality: 89 },
];

const techDeps = [
  { name: "Vector store quota uplift",         team: "Cloud Eng",        status: "Blocked",  eta: "Jun 02" },
  { name: "SAP master-data extract",           team: "SAP CoE",          status: "In Review",eta: "May 22" },
  { name: "Snowflake account share",           team: "Data Platform",    status: "Ready",    eta: "Done"   },
  { name: "OIDC config for GenAI front-end",   team: "IAM",              status: "Ready",    eta: "Done"   },
];

function ColumnTitle({ icon: Icon, label, count, tone }: any) {
  return (
    <div className="flex items-center gap-2 mb-2.5 px-1">
      <div className={`size-6 rounded-md grid place-items-center ${tone}`}><Icon className="size-3.5" /></div>
      <span className="text-[12px] font-semibold uppercase tracking-[0.14em]">{label}</span>
      <span className="ml-auto text-[10.5px] text-muted-foreground tabular-nums">{count}</span>
    </div>
  );
}

function Card({ id, title, assignee, points, type }: any) {
  return (
    <div className="bg-card rounded-xl border border-card-border p-3 shadow-soft hover-elevate transition-all cursor-pointer">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] font-mono text-muted-foreground">{id}</span>
        <Tag tone={type === "Task" ? "neutral" : "purple"}>{type}</Tag>
      </div>
      <div className="text-[12.5px] font-medium leading-snug mb-2">{title}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="size-5 rounded-full bg-primary/15 text-primary text-[9.5px] font-semibold grid place-items-center">
            {assignee.split(" ").map((p: string) => p[0]).join("")}
          </div>
          <span className="text-[10.5px] text-muted-foreground">{assignee}</span>
        </div>
        <span className="text-[10.5px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md bg-muted">{points}sp</span>
      </div>
    </div>
  );
}

export default function TechView({ onOpenAI }: { onOpenAI: () => void }) {
  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Squad & Tech Workspace"
        title="AI Foundations · Sprint 14"
        subtitle="Sprint progress, Jira tasks, dependencies, data readiness, model & deployment status."
        actions={
          <>
            <Button variant="outline" className="h-9 rounded-xl gap-1.5"><GitBranch className="size-3.5" /> Branch</Button>
            <Button onClick={onOpenAI} className="h-9 rounded-xl gap-1.5"><Sparkle className="size-3.5" /> Ask Copilot</Button>
            <Button className="h-9 rounded-xl gap-1.5 bg-[#0C2341] hover:bg-[#15355e] text-white"><Rocket className="size-3.5" /> Deploy</Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard label="Sprint Progress"     value={68} suffix="%" delta="Day 7 / 10" trend="up"   accent="primary" />
        <KpiCard label="Open Blockers"       value={3}              delta="-2 today"  trend="down" accent="coral"   />
        <KpiCard label="Tests Passing"       value={94} suffix="%"  delta="+3 pts"    trend="up"   accent="purple2" />
        <KpiCard label="Deploy Readiness"    value="Amber"          delta="UAT pending" trend="flat" accent="orange" />
      </div>

      {/* Sprint burnup + capacity */}
      <div className="grid lg:grid-cols-3 gap-4">
        <SectionCard className="lg:col-span-2" title="Sprint Burnup" subtitle="Story points completed vs scope">
          <div className="h-[230px]">
            <ResponsiveContainer>
              <AreaChart data={burnup} margin={{ top: 6, right: 6, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--popover-border))", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="scope"     stroke="hsl(var(--chart-3))" strokeDasharray="4 4" fill="none" strokeWidth={2} />
                <Area type="monotone" dataKey="completed" stroke="hsl(var(--chart-1))" fill="url(#gComp)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="My Assignments" subtitle="K. Al-Shehri · 4 active">
          <div className="space-y-2">
            {[
              { id: "DI-2001", t: "Feature-store online API perf tuning", st: "In Review" },
              { id: "DI-2017", t: "Eval harness for GenAI summarizer",    st: "In Progress" },
              { id: "DI-2061", t: "Vector store quota uplift request",    st: "To Do" },
              { id: "DI-2070", t: "ADR-0037 · Embedding model selection", st: "In Progress" },
            ].map(a => (
              <div key={a.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/40 hover-elevate transition-all">
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">{a.id}</span>
                <span className="text-[12px] font-medium flex-1 truncate">{a.t}</span>
                <StatusPill>{a.st === "In Progress" ? "At Risk" : a.st === "In Review" ? "On Track" : "On Hold"}</StatusPill>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Kanban board */}
      <SectionCard
        title="Sprint Board — Jira sync"
        subtitle="Live · synced 30s ago from Jira DI-Sprint-14"
        actions={<Badge variant="secondary" className="gap-1 text-[10.5px]"><span className="size-1.5 rounded-full bg-ok pulse-dot" /> Live</Badge>}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <ColumnTitle icon={FileText}      label="To Do"        count={sprintBoard.todo.length}       tone="bg-muted text-muted-foreground" />
            <div className="space-y-2">{sprintBoard.todo.map(c => <Card key={c.id} {...c} />)}</div>
          </div>
          <div>
            <ColumnTitle icon={Cpu}           label="In Progress"  count={sprintBoard.in_progress.length} tone="bg-primary/15 text-primary" />
            <div className="space-y-2">{sprintBoard.in_progress.map(c => <Card key={c.id} {...c} />)}</div>
          </div>
          <div>
            <ColumnTitle icon={GitMerge}      label="In Review"    count={sprintBoard.review.length}     tone="bg-[#FFA38B]/30 text-[#623B2A] dark:text-[#FFA38B]" />
            <div className="space-y-2">{sprintBoard.review.map(c => <Card key={c.id} {...c} />)}</div>
          </div>
          <div>
            <ColumnTitle icon={CheckCircle2}  label="Done"         count={sprintBoard.done.length}       tone="bg-ok/15 text-ok" />
            <div className="space-y-2">{sprintBoard.done.map(c => <Card key={c.id} {...c} />)}</div>
          </div>
        </div>
      </SectionCard>

      {/* Data readiness + dependencies */}
      <div className="grid lg:grid-cols-2 gap-4">
        <SectionCard title="Data Readiness" subtitle="Source readiness & quality scores">
          <div className="space-y-2.5">
            {dataReadiness.map(d => (
              <div key={d.source} className="grid grid-cols-12 items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/40">
                <div className="col-span-5 flex items-center gap-2">
                  <Database className="size-3.5 text-muted-foreground" />
                  <span className="text-[12.5px] font-medium">{d.source}</span>
                </div>
                <div className="col-span-3">
                  <StatusPill>{d.status === "Ready" ? "On Track" : d.status === "Gap" ? "Delayed" : "At Risk"}</StatusPill>
                </div>
                <div className="col-span-4 flex items-center gap-2">
                  <div className="flex-1">
                    <MiniProgress value={d.quality} tone={d.quality < 70 ? "bad" : d.quality < 85 ? "warn" : "ok"} />
                  </div>
                  <span className="tabular-nums text-[11.5px] font-semibold">{d.quality}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Technical Dependencies" subtitle="Cross-team blockers and approvals">
          <div className="space-y-2">
            {techDeps.map(d => (
              <div key={d.name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/40">
                <div className={`size-9 rounded-lg grid place-items-center shrink-0
                  ${d.status === "Blocked" ? "bg-bad/12 text-bad"
                   : d.status === "In Review" ? "bg-warn/14 text-warn"
                   : "bg-ok/12 text-ok"}`}>
                  {d.status === "Blocked" ? <AlertTriangle className="size-4" />
                   : d.status === "In Review" ? <GitMerge className="size-4" />
                   : <CheckCircle2 className="size-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium leading-snug">{d.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{d.team} · ETA {d.eta}</div>
                </div>
                <StatusPill>{d.status === "Blocked" ? "Delayed" : d.status === "In Review" ? "At Risk" : "On Track"}</StatusPill>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Model / Deploy / Docs */}
      <div className="grid lg:grid-cols-3 gap-4">
        <SectionCard title="Model Delivery" subtitle="GenAI Summarizer v0.4">
          <div className="space-y-3">
            {[
              { l: "Training data", v: "Ready · v3 corpus", tone: "ok" },
              { l: "Eval suite",    v: "Running · 78%",     tone: "warn" },
              { l: "PII redaction", v: "Pass · 99.6%",      tone: "ok" },
              { l: "Latency p95",   v: "1.2s (target 1.5s)",tone: "ok" },
              { l: "Hallucination", v: "2.4% (target <3%)", tone: "ok" },
            ].map(r => (
              <div key={r.l} className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">{r.l}</span>
                <span className={`font-medium ${r.tone === "warn" ? "text-warn" : "text-foreground"}`}>{r.v}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Deployment Readiness" subtitle="UAT → Staging → Production">
          <div className="relative pl-5 ml-1.5 border-l border-dashed border-border space-y-3">
            {[
              { l: "Unit & contract tests",  s: "Pass" },
              { l: "Integration tests",      s: "Pass" },
              { l: "Security scan (SAST)",   s: "Pass" },
              { l: "Performance/load",       s: "Pass" },
              { l: "UAT sign-off",           s: "Pending" },
              { l: "Production change rec.", s: "Pending" },
            ].map((x, i) => (
              <div key={x.l} className="relative">
                <div className={`absolute -left-[26px] top-1 size-2.5 rounded-full ring-4 ring-background
                  ${x.s === "Pass" ? "bg-ok" : "bg-warn"}`} />
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px]">{x.l}</span>
                  <span className={`text-[11px] font-semibold ${x.s === "Pass" ? "text-ok" : "text-warn"}`}>{x.s}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Documentation Status" subtitle="ADRs · runbooks · tickets" actions={<Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1">Open <ArrowRight className="size-3" /></Button>}>
          <div className="space-y-2">
            {[
              { id: "ADR-0034", t: "Vector store selection",        s: "Approved" },
              { id: "ADR-0035", t: "Embedding model evaluation",    s: "In Review" },
              { id: "RB-0012",  t: "Incident playbook · vector",    s: "Draft" },
              { id: "RB-0013",  t: "Model rollback procedure",      s: "Approved" },
              { id: "RB-0014",  t: "Drift detection & alerts",      s: "Draft" },
            ].map(d => (
              <div key={d.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/40">
                <BookOpen className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-[10.5px] font-mono text-muted-foreground">{d.id}</span>
                <span className="text-[12px] font-medium flex-1 truncate">{d.t}</span>
                <StatusPill>{d.s === "Approved" ? "On Track" : d.s === "In Review" ? "At Risk" : "On Hold"}</StatusPill>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Test status */}
      <SectionCard title="Testing & Quality Gates" subtitle="Live results from CI · GitHub Enterprise">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { l: "Unit", v: 412, p: 99.5,  i: FlaskConical },
            { l: "Integration", v: 86, p: 96.5, i: GitMerge },
            { l: "E2E", v: 24, p: 91.6,         i: Rocket },
            { l: "Security (SAST)", v: 1, p: 100, i: AlertTriangle },
            { l: "Perf benchmarks", v: 12, p: 100, i: Cpu },
          ].map(t => (
            <div key={t.l} className="rounded-xl p-3.5 bg-secondary/40">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary/15 text-primary grid place-items-center"><t.i className="size-3.5" /></div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{t.l}</div>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-display text-[22px] font-bold tabular-nums">{t.p}%</span>
                <span className="text-[11px] text-muted-foreground">{t.v} tests</span>
              </div>
              <div className="mt-2"><MiniProgress value={t.p} tone={t.p < 90 ? "warn" : "ok"} /></div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
