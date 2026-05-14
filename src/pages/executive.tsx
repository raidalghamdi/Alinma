import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader, KpiCard, SectionCard, StatusPill, MiniProgress, Tag } from "@/components/primitives";
import {
  portfolioKPIs, portfolioHealth, budgetByPortfolio, valueRealization,
  strategicInitiatives, risks, vendors, visionAlignment, projects,
} from "@/lib/mock-data";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line, RadialBarChart, RadialBar,
} from "recharts";
import {
  Download, FileDown, Presentation, Sparkle, ArrowRight, AlertTriangle, TrendingUp,
} from "lucide-react";

export default function ExecutiveView({ onOpenAI }: { onOpenAI: () => void }) {
  const accentOrder: Array<"primary" | "coral" | "orange" | "purple2" | "navy" | "primary"> =
    ["primary", "purple2", "coral", "orange", "navy", "primary"];

  return (
    <div className="space-y-7">
      {/* HERO — executive cockpit */}
      <div className="relative overflow-hidden rounded-3xl gradient-hero text-white grain p-7 md:p-9 shadow-executive">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-[10.5px] uppercase tracking-[0.22em] text-white/80 mb-4">
              <span className="size-1.5 rounded-full bg-[#FFA38B] pulse-dot" /> Executive Cockpit · May 2026
            </div>
            <h1 className="font-display text-[34px] md:text-[44px] font-bold tracking-tight leading-[1.05]">
              Data &amp; Intelligence<br />
              <span className="bg-gradient-to-r from-[#CFCCEF] via-[#FFA38B] to-[#FFA38B] bg-clip-text text-transparent">
                Portfolio Performance
              </span>
            </h1>
            <p className="mt-4 text-[14px] text-white/75 max-w-xl leading-relaxed">
              End-to-end visibility across demand intake, delivery, vendors, value realization,
              and Vision 2030 alignment — grounded across Jira, ServiceNow, SAP and Power BI.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 shrink-0">
            <Button onClick={onOpenAI} className="h-10 rounded-xl gap-2 bg-[#8B84D7] hover:bg-[#9b94e2] text-white border-0">
              <Sparkle className="size-4" /> Ask Copilot for executive brief
            </Button>
            <div className="grid grid-cols-3 gap-1.5">
              <Button variant="secondary" className="h-9 rounded-xl gap-1.5 bg-white/10 text-white hover:bg-white/15 border-0 text-[12px]">
                <Presentation className="size-3.5" /> PPT
              </Button>
              <Button variant="secondary" className="h-9 rounded-xl gap-1.5 bg-white/10 text-white hover:bg-white/15 border-0 text-[12px]">
                <FileDown className="size-3.5" /> PDF
              </Button>
              <Button variant="secondary" className="h-9 rounded-xl gap-1.5 bg-white/10 text-white hover:bg-white/15 border-0 text-[12px]">
                <Download className="size-3.5" /> XLS
              </Button>
            </div>
          </div>
        </div>

        {/* Mini stat strip */}
        <div className="relative z-10 mt-7 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { l: "Portfolio Health",   v: "Amber-Green",  s: "28 / 47 on track" },
            { l: "Vision 2030 Score",  v: "82 / 100",     s: "+4 pts QoQ" },
            { l: "Value Realized YTD", v: "142M",         s: "+18M MoM · SAR" },
            { l: "ExCo Escalations",   v: "2 open",       s: "Reg deadline · SI ramp" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.06] backdrop-blur-md ring-1 ring-white/10 px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/55">{s.l}</div>
              <div className="text-[20px] font-display font-bold mt-1">{s.v}</div>
              <div className="text-[11px] text-white/65 mt-0.5">{s.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {portfolioKPIs.map((k, i) => (
          <KpiCard
            key={k.id}
            label={k.label}
            value={k.value}
            suffix={k.suffix}
            delta={k.delta}
            trend={k.trend as "up" | "down" | "flat"}
            accent={accentOrder[i]}
          />
        ))}
      </div>

      {/* Value Realization + Health */}
      <div className="grid lg:grid-cols-3 gap-4">
        <SectionCard
          className="lg:col-span-2"
          title="Value Realization vs Plan"
          subtitle="Cumulative business value · YTD · SAR millions"
          actions={
            <div className="flex items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Realized</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#FFA38B]" /> Planned</span>
            </div>
          }
        >
          <div className="h-[280px]">
            <ResponsiveContainer>
              <AreaChart data={valueRealization} margin={{ top: 6, right: 6, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="gRealized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gPlanned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--popover-border))", borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="planned"  stroke="hsl(var(--chart-3))" strokeWidth={2} fill="url(#gPlanned)" />
                <Area type="monotone" dataKey="realized" stroke="hsl(var(--chart-1))" strokeWidth={2.5} fill="url(#gRealized)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-2 pt-4 border-t border-border/60">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Realized</div>
              <div className="font-display text-[20px] font-bold mt-0.5">142M <span className="text-[11px] text-muted-foreground font-normal">SAR</span></div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Plan</div>
              <div className="font-display text-[20px] font-bold mt-0.5">156M <span className="text-[11px] text-muted-foreground font-normal">SAR</span></div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Variance</div>
              <div className="font-display text-[20px] font-bold mt-0.5 text-warn">-9%</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Portfolio Health"
          subtitle="47 active projects · live"
          actions={<Badge variant="secondary" className="text-[10px] gap-1"><span className="size-1.5 rounded-full bg-ok pulse-dot" /> Live</Badge>}
        >
          <div className="h-[200px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={portfolioHealth}
                  innerRadius={56}
                  outerRadius={84}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {portfolioHealth.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--popover-border))", borderRadius: 12, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {portfolioHealth.map(p => (
              <div key={p.name} className="flex items-center justify-between text-[12px]">
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </span>
                <span className="font-medium tabular-nums">{p.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Strategic Initiatives + Vision 2030 */}
      <div className="grid lg:grid-cols-3 gap-4">
        <SectionCard
          className="lg:col-span-2"
          title="Strategic Initiatives"
          subtitle="C-suite portfolio · status, owner, Vision 2030 mapping"
          actions={<Button variant="ghost" size="sm" className="h-8 text-[12px] gap-1">View all <ArrowRight className="size-3.5" /></Button>}
        >
          <div className="space-y-2.5">
            {strategicInitiatives.map(i => (
              <div key={i.id} className="grid grid-cols-12 items-center gap-3 px-3 py-3 rounded-xl bg-secondary/40 hover-elevate transition-all">
                <div className="col-span-12 md:col-span-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-mono text-muted-foreground">{i.id}</span>
                    <StatusPill>{i.status}</StatusPill>
                  </div>
                  <div className="text-[13.5px] font-semibold mt-1">{i.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Owner · {i.owner}</div>
                </div>
                <div className="col-span-7 md:col-span-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-muted-foreground">Progress</span>
                    <span className="text-[12px] font-semibold tabular-nums">{i.progress}%</span>
                  </div>
                  <MiniProgress
                    value={i.progress}
                    tone={i.status === "Delayed" ? "bad" : i.status === "At Risk" ? "warn" : "primary"}
                  />
                </div>
                <div className="col-span-5 md:col-span-3 flex md:justify-end">
                  <Tag tone="purple">{i.vision.replace("Vision 2030 · ", "")}</Tag>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Vision 2030 Alignment"
          subtitle="Initiatives mapped to national themes"
        >
          <div className="h-[210px]">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="20%" outerRadius="100%" data={visionAlignment} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "hsl(var(--muted))" }}>
                  {visionAlignment.map((_, i) => (
                    <Cell key={i} fill={`hsl(var(--chart-${(i % 6) + 1}))`} />
                  ))}
                </RadialBar>
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--popover-border))", borderRadius: 12, fontSize: 12 }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {visionAlignment.map((v, i) => (
              <div key={v.theme} className="flex items-center justify-between text-[11.5px]">
                <span className="inline-flex items-center gap-2 truncate">
                  <span className="size-2 rounded-full shrink-0" style={{ background: `hsl(var(--chart-${(i % 6) + 1}))` }} />
                  <span className="truncate">{v.theme}</span>
                </span>
                <span className="font-medium tabular-nums shrink-0">{v.initiatives}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Budget by portfolio */}
      <SectionCard
        title="Budget Utilization by Portfolio"
        subtitle="Plan vs Committed vs Actual · SAR millions · YTD"
        actions={
          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-sm bg-[#CFCCEF]" />Plan</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-sm bg-[#FFA38B]" />Committed</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-sm bg-primary" />Actual</span>
          </div>
        }
      >
        <div className="h-[280px]">
          <ResponsiveContainer>
            <BarChart data={budgetByPortfolio} margin={{ top: 6, right: 6, bottom: 0, left: -10 }} barGap={4}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="portfolio" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--popover-border))", borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="planned"   fill="hsl(var(--chart-4))" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="committed" fill="hsl(var(--chart-3))" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="actual"    fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Risks + Vendors row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <SectionCard
          title="Top Risks & Escalations"
          subtitle="Critical & High exposure · this month"
          actions={
            <Button variant="ghost" size="sm" className="h-8 text-[12px] gap-1">
              <AlertTriangle className="size-3.5" /> Risk register
            </Button>
          }
        >
          <div className="space-y-2">
            {risks.slice(0, 4).map(r => (
              <div key={r.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-secondary/40 hover-elevate transition-all">
                <div className="size-9 rounded-lg bg-bad/12 text-bad grid place-items-center shrink-0">
                  <AlertTriangle className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10.5px] font-mono text-muted-foreground">{r.id}</span>
                    <StatusPill>{r.severity}</StatusPill>
                    <span className="text-[10.5px] text-muted-foreground">Project · {r.project}</span>
                  </div>
                  <div className="text-[13px] font-medium mt-1 leading-snug">{r.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">Owner · {r.owner} · ETA {r.eta}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Vendor Performance"
          subtitle="Performance score · contract utilization · SLA"
          actions={<Button variant="ghost" size="sm" className="h-8 text-[12px] gap-1">All vendors <ArrowRight className="size-3.5" /></Button>}
        >
          <div className="space-y-2">
            {vendors.slice(0, 4).map(v => (
              <div key={v.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/40 hover-elevate transition-all">
                <div className="size-10 rounded-xl gradient-purple-soft grid place-items-center text-[12px] font-semibold text-[#3a3585] shrink-0">
                  {v.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold truncate">{v.name}</span>
                    <StatusPill>{v.status}</StatusPill>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{v.category} · {v.contract}</div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1">
                      <MiniProgress
                        value={v.perf}
                        tone={v.perf < 75 ? "bad" : v.perf < 85 ? "warn" : "primary"}
                      />
                    </div>
                    <span className="text-[11.5px] font-semibold tabular-nums">{v.perf}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Delivery snapshot */}
      <SectionCard
        title="Delivery Snapshot — Top Projects"
        subtitle="Drill into the projects driving this month's outcomes"
        actions={<Button variant="ghost" size="sm" className="h-8 text-[12px] gap-1">Open portfolio <ArrowRight className="size-3.5" /></Button>}
      >
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="text-left font-medium py-2 pr-3">Project</th>
                <th className="text-left font-medium py-2 pr-3">Portfolio</th>
                <th className="text-left font-medium py-2 pr-3">Status</th>
                <th className="text-left font-medium py-2 pr-3 w-[180px]">Progress</th>
                <th className="text-left font-medium py-2 pr-3 w-[150px]">Budget used</th>
                <th className="text-left font-medium py-2 pr-3">Vendor</th>
                <th className="text-left font-medium py-2 pr-3">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {projects.slice(0, 6).map(p => (
                <tr key={p.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="py-3 pr-3">
                    <div className="font-mono text-[10.5px] text-muted-foreground">{p.id}</div>
                    <div className="font-semibold text-[13px]">{p.name}</div>
                  </td>
                  <td className="py-3 pr-3"><Tag tone="purple">{p.portfolio}</Tag></td>
                  <td className="py-3 pr-3"><StatusPill>{p.status}</StatusPill></td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1"><MiniProgress value={p.progress} tone={p.status === "Delayed" ? "bad" : p.status === "At Risk" ? "warn" : "primary"} /></div>
                      <span className="tabular-nums text-[11.5px] font-medium">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1"><MiniProgress value={p.budgetUsed} tone={p.budgetUsed > 75 ? "warn" : "primary"} /></div>
                      <span className="tabular-nums text-[11.5px] font-medium">{p.budgetUsed}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-muted-foreground">{p.vendor}</td>
                  <td className="py-3 pr-3 tabular-nums text-muted-foreground">{p.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
