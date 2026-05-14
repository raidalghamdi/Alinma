import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, KpiCard, SectionCard, StatusPill, MiniProgress, Tag } from "@/components/primitives";
import { demands, projects, squadCapacity, milestones, vendors, risks } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend,
} from "recharts";
import { ArrowRight, Filter, Plus, Sparkle, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

const STAGES = ["Intake", "Discovery", "Prioritization", "Approval"] as const;

export default function ManagerView({ onOpenAI }: { onOpenAI: () => void }) {
  const { toast } = useToast();
  const onApprove = (id: string) => toast({ title: "Demand approved", description: `${id} moved to roadmap intake.` });
  const onDefer   = (id: string) => toast({ title: "Demand deferred", description: `${id} pushed to next committee.` });
  const onReject  = (id: string) => toast({ title: "Demand rejected", description: `${id} returned to requester with notes.` });
  const stageCounts = STAGES.map(s => ({
    stage: s, count: demands.filter(d => d.stage === s).length,
  }));

  const burnup = squadCapacity[0].burnup.map((v, i) => ({
    sprint: `S${i + 1}`,
    AI: squadCapacity[0].burnup[i],
    Lakehouse: squadCapacity[1].burnup[i],
    Analytics: squadCapacity[2].burnup[i],
  }));

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Managers & Leads Workspace"
        title="Delivery oversight — May 2026"
        subtitle="Pipeline, prioritization, capacity, budget vs actuals, risks and approvals across the portfolio."
        actions={
          <>
            <Button variant="outline" className="h-9 rounded-xl gap-1.5"><Filter className="size-3.5" /> Filter</Button>
            <Button onClick={onOpenAI} className="h-9 rounded-xl gap-1.5"><Sparkle className="size-3.5" /> Ask Copilot</Button>
            <Button variant="default" className="h-9 rounded-xl gap-1.5 bg-[#C66E4E] hover:bg-[#b15f43] text-white"><Plus className="size-3.5" /> New demand</Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard label="Pipeline Demands" value={128} delta="+23 MoM" trend="up" accent="purple2" />
        <KpiCard label="Active Projects"  value={47}  delta="+6 QoQ"  trend="up" accent="primary" />
        <KpiCard label="Squads Overloaded" value={2}  delta="re-balance" trend="flat" accent="coral" />
        <KpiCard label="Pending Approvals" value={6}  delta="2 critical" trend="up" accent="orange" />
      </div>

      {/* Demand pipeline visualization */}
      <div className="grid lg:grid-cols-5 gap-4">
        <SectionCard
          className="lg:col-span-3"
          title="Demand Pipeline"
          subtitle="Funnel from intake to approval · 128 active demands"
        >
          <div className="grid grid-cols-4 gap-2 mb-4">
            {stageCounts.map((s, i) => (
              <div key={s.stage}
                className={`rounded-xl px-3 py-3 ${
                  i === 0 ? "bg-[#FCF4EF] dark:bg-secondary"
                  : i === 1 ? "bg-[#F9EBE0] dark:bg-secondary/80"
                  : i === 2 ? "bg-[#FFA38B]/25 dark:bg-secondary/60"
                  : "bg-[#CFCCEF]/55 dark:bg-primary/15"
                }`}
              >
                <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{s.stage}</div>
                <div className="font-display text-[24px] font-bold tabular-nums">{s.count}</div>
                <div className="text-[10.5px] text-muted-foreground mt-0.5">demands</div>
              </div>
            ))}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {demands.map(d => (
                  <tr key={d.id} className="hover:bg-secondary/40 transition-colors">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          className="lg:col-span-2"
          title="Approval Queue"
          subtitle="Awaiting your decision"
          actions={<Badge variant="secondary" className="text-[10.5px]">6 pending</Badge>}
        >
          <div className="space-y-2">
            {demands.filter(d => d.stage === "Approval").map(d => (
              <div key={d.id} className="rounded-xl border border-card-border bg-card p-3 hover-elevate transition-all">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-[10.5px] font-mono text-muted-foreground">{d.id}</span>
                  <StatusPill>{d.priority}</StatusPill>
                </div>
                <div className="text-[13px] font-semibold leading-snug">{d.title}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{d.requester} · value score {d.value.toFixed(1)} · effort {d.effort}</div>
                <div className="flex gap-2 mt-2.5">
                  <Button onClick={() => onApprove(d.id)} size="sm" className="h-7 text-[11px] flex-1 bg-ok/15 text-ok hover:bg-ok/25 border-0">
                    <CheckCircle2 className="size-3 mr-1" /> Approve
                  </Button>
                  <Button onClick={() => onDefer(d.id)} size="sm" variant="ghost" className="h-7 text-[11px] flex-1">
                    <Clock className="size-3 mr-1" /> Defer
                  </Button>
                  <Button onClick={() => onReject(d.id)} size="sm" variant="ghost" className="h-7 text-[11px] flex-1 text-bad hover:bg-bad/10">
                    <XCircle className="size-3 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Capacity + Burnup */}
      <div className="grid lg:grid-cols-5 gap-4">
        <SectionCard
          className="lg:col-span-3"
          title="Squad Capacity & Allocation"
          subtitle="Allocation > 100% indicates overload"
        >
          <div className="space-y-3">
            {squadCapacity.map(s => {
              const pct = Math.round((s.allocated / s.capacity) * 100);
              const over = pct > 100;
              return (
                <div key={s.squad} className="grid grid-cols-12 items-center gap-3 px-3 py-3 rounded-xl bg-secondary/40">
                  <div className="col-span-4">
                    <div className="text-[13px] font-semibold">{s.squad}</div>
                    <div className="text-[11px] text-muted-foreground">{s.members} members</div>
                  </div>
                  <div className="col-span-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-muted-foreground">{s.allocated} / {s.capacity} sp</span>
                      <span className={`text-[12px] font-semibold tabular-nums ${over ? "text-warn" : "text-foreground"}`}>{pct}%</span>
                    </div>
                    <div className="relative w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${over ? "bg-warn" : "bg-primary"}`} style={{ width: `${Math.min(100, pct)}%` }} />
                      {over && <div className="absolute right-0 top-0 h-full bg-bad rounded-r-full" style={{ width: `${pct - 100}%` }} />}
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    {over ? <StatusPill>At Risk</StatusPill> : pct < 75 ? <Tag tone="warm">Under-used</Tag> : <StatusPill>On Track</StatusPill>}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          className="lg:col-span-2"
          title="Sprint Burnup — Top Squads"
          subtitle="Story points completed over time"
        >
          <div className="h-[230px]">
            <ResponsiveContainer>
              <LineChart data={burnup} margin={{ top: 6, right: 6, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--popover-border))", borderRadius: 12, fontSize: 12 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="AI"        stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Lakehouse" stroke="hsl(var(--chart-2))" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Analytics" stroke="hsl(var(--chart-3))" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Milestone timeline */}
      <SectionCard
        title="Milestones & Deliverables"
        subtitle="Next 90 days · gated by approval & UAT"
        actions={<Button variant="ghost" size="sm" className="h-8 text-[12px] gap-1">Open roadmap <ArrowRight className="size-3.5" /></Button>}
      >
        <div className="relative pl-6 ml-2 border-l border-dashed border-border space-y-4">
          {milestones.map(m => (
            <div key={m.id} className="relative">
              <div className={`absolute -left-[31px] top-1.5 size-3 rounded-full ring-4 ring-background
                ${m.status === "Delayed" ? "bg-bad" : m.status === "At Risk" ? "bg-warn" : "bg-primary"}`} />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-secondary/40 hover-elevate transition-all">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10.5px] font-mono text-muted-foreground">{m.id}</span>
                    <span className="text-[10.5px] font-mono text-muted-foreground">· {m.project}</span>
                    <StatusPill>{m.status}</StatusPill>
                  </div>
                  <div className="text-[13.5px] font-semibold mt-1">{m.title}</div>
                </div>
                <div className="text-[12px] tabular-nums text-muted-foreground">{m.date}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Risks + Vendor SLA */}
      <div className="grid lg:grid-cols-2 gap-4">
        <SectionCard title="Open Risks & Issues" subtitle="Across managed portfolio">
          <div className="space-y-2">
            {risks.slice(0, 5).map(r => (
              <div key={r.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-secondary/40">
                <div className="size-9 rounded-lg bg-warn/12 text-warn grid place-items-center shrink-0">
                  <AlertTriangle className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10.5px] font-mono text-muted-foreground">{r.id}</span>
                    <StatusPill>{r.severity}</StatusPill>
                    <Tag tone="purple">{r.project}</Tag>
                  </div>
                  <div className="text-[13px] font-medium mt-1 leading-snug">{r.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">Owner · {r.owner} · ETA {r.eta}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Vendor SLA Tracker" subtitle="Live SLA & deliverables">
          <div className="space-y-2.5">
            {vendors.slice(0, 5).map(v => (
              <div key={v.id} className="px-3 py-2.5 rounded-xl bg-secondary/40">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold">{v.name}</span>
                    <Tag tone="warm">{v.category}</Tag>
                  </div>
                  <StatusPill>{v.status}</StatusPill>
                </div>
                <div className="grid grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <div className="text-muted-foreground">SLA</div>
                    <div className="font-semibold tabular-nums text-[12.5px]">{v.sla}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Perf</div>
                    <div className="font-semibold tabular-nums text-[12.5px]">{v.perf}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Contract</div>
                    <div className="font-semibold tabular-nums text-[12.5px]">{v.contract}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
