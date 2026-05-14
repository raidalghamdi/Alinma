import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, SectionCard, StatusPill, MiniProgress, Tag } from "@/components/primitives";
import { projects } from "@/lib/mock-data";
import { Filter, LayoutGrid, List, ArrowRight, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PortfolioPage() {
  const { toast } = useToast();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [q, setQ] = useState("");
  const onOpenProject = (p: typeof projects[number]) => toast({ title: p.name, description: `${p.id} · ${p.status} · ${p.progress}% complete · owner ${p.owner}` });
  const onFilter = () => toast({ title: "Filter", description: "Project filter panel would open here." });
  const filtered = projects.filter(p =>
    !q ||
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.portfolio.toLowerCase().includes(q.toLowerCase()) ||
    p.owner.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Portfolio"
        title="Projects across all Data &amp; Intelligence portfolios"
        subtitle="47 active projects spanning AI/GenAI, Data Platform, Analytics & BI, Data Governance and MLOps."
        actions={
          <>
            <div className="relative w-[280px]">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search projects, portfolio, owner…" className="pl-9 h-9 rounded-xl" />
            </div>
            <Button onClick={onFilter} variant="outline" className="h-9 rounded-xl gap-1.5"><Filter className="size-3.5" /> Filter</Button>
            <div className="flex bg-muted rounded-xl p-0.5">
              <button onClick={() => setView("grid")} className={`h-8 px-3 rounded-lg text-[12px] flex items-center gap-1.5 transition-all ${view === "grid" ? "bg-card shadow-soft" : "text-muted-foreground"}`}>
                <LayoutGrid className="size-3.5" /> Grid
              </button>
              <button onClick={() => setView("table")} className={`h-8 px-3 rounded-lg text-[12px] flex items-center gap-1.5 transition-all ${view === "table" ? "bg-card shadow-soft" : "text-muted-foreground"}`}>
                <List className="size-3.5" /> Table
              </button>
            </div>
          </>
        }
      />

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="rounded-2xl border border-card-border bg-card p-5 shadow-soft hover-elevate transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-[10.5px] font-mono text-muted-foreground mb-1">{p.id}</div>
                  <div className="font-display text-[15px] font-semibold leading-snug">{p.name}</div>
                </div>
                <StatusPill>{p.status}</StatusPill>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                <Tag tone="purple">{p.portfolio}</Tag>
                <Tag tone="warm">{p.priority}</Tag>
              </div>
              <div className="mt-4 space-y-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1 text-[11px]">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="tabular-nums font-semibold">{p.progress}%</span>
                  </div>
                  <MiniProgress value={p.progress} tone={p.status === "Delayed" ? "bad" : p.status === "At Risk" ? "warn" : "primary"} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1 text-[11px]">
                    <span className="text-muted-foreground">Budget used</span>
                    <span className="tabular-nums font-semibold">{p.budgetUsed}%</span>
                  </div>
                  <MiniProgress value={p.budgetUsed} tone={p.budgetUsed > 75 ? "warn" : "primary"} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between text-[11.5px]">
                <div>
                  <div className="text-muted-foreground">Owner</div>
                  <div className="font-medium">{p.owner}</div>
                </div>
                <div className="text-right">
                  <div className="text-muted-foreground">Deadline</div>
                  <div className="font-medium tabular-nums">{p.deadline}</div>
                </div>
                <Button onClick={() => onOpenProject(p)} size="sm" variant="ghost" className="h-7 px-2 text-[11px] gap-1">Open <ArrowRight className="size-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SectionCard title="All Projects" subtitle={`${filtered.length} projects`}>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="text-left font-medium py-2 pr-3">Project</th>
                  <th className="text-left font-medium py-2 pr-3">Portfolio</th>
                  <th className="text-left font-medium py-2 pr-3">Status</th>
                  <th className="text-left font-medium py-2 pr-3 w-[170px]">Progress</th>
                  <th className="text-left font-medium py-2 pr-3 w-[140px]">Budget</th>
                  <th className="text-left font-medium py-2 pr-3">Owner</th>
                  <th className="text-left font-medium py-2 pr-3">Vendor</th>
                  <th className="text-left font-medium py-2 pr-3">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map(p => (
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
                    <td className="py-3 pr-3">{p.owner}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{p.vendor}</td>
                    <td className="py-3 pr-3 tabular-nums text-muted-foreground">{p.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
