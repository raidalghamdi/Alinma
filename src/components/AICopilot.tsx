import { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/lib/role-context";
import {
  Sparkle, FileDown, Mail, Presentation, Send, ChevronRight,
  AlertTriangle, Building2, Wallet, Users, FolderKanban, FileBarChart2, BookOpen
} from "lucide-react";

type Msg =
  | { kind: "user"; text: string }
  | { kind: "ai";   text: string; cards?: SourceCard[]; followups?: string[]; tag?: string };

type SourceCard = {
  type: "project" | "risk" | "vendor" | "budget" | "demand" | "doc";
  title: string;
  meta: string;
  source: string;
};

const SUGGESTIONS_BY_ROLE: Record<string, { icon: any; q: string }[]> = {
  executive: [
    { icon: FileBarChart2,  q: "Generate an executive summary for May 2026." },
    { icon: AlertTriangle,  q: "What are the top risks this month?" },
    { icon: Building2,      q: "Which vendors are underperforming?" },
    { icon: Wallet,         q: "What is budget utilization by portfolio?" },
  ],
  manager: [
    { icon: FolderKanban,   q: "Which projects are delayed?" },
    { icon: Users,          q: "Which squads are overloaded?" },
    { icon: FileBarChart2,  q: "Summarize Jira progress for the GenAI initiative." },
    { icon: AlertTriangle,  q: "Show projects with blocked dependencies." },
  ],
  tech: [
    { icon: FolderKanban,   q: "What is the status of PRJ-1043?" },
    { icon: AlertTriangle,  q: "Show my open blockers and dependencies." },
    { icon: BookOpen,       q: "Summarize ADR-0034 for the vector store." },
    { icon: Users,          q: "Sprint burnup for AI Foundations squad." },
  ],
};

const CANNED: Record<string, Omit<Extract<Msg, { kind: "ai" }>, "kind">> = {
  delayed: {
    tag: "Portfolio insight",
    text:
      "There are **3 delayed projects** out of 47 active. The largest exposure is on Regulatory Reporting Engineering — currently 18 days behind, with regulatory deadline risk escalated. Risk Predictive Models v2 has slipped 9 days due to data quality on the CRM extract.",
    cards: [
      { type: "project", title: "PRJ-1045 · Regulatory Reporting Engineering", meta: "Delayed · -18d · Critical priority", source: "Jira / Power BI" },
      { type: "project", title: "PRJ-1044 · Risk Predictive Models v2",        meta: "At Risk · -9d · UAT pending",         source: "Jira / Azure ML" },
      { type: "risk",    title: "RSK-078 · Regulatory deadline shift",          meta: "Critical · escalated to ExCo",         source: "ServiceNow GRC" },
    ],
    followups: [
      "Draft a one-pager for the regulatory escalation.",
      "Which dependencies are blocking PRJ-1045?",
      "Compare planned vs realized value for delayed projects.",
    ],
  },
  exec: {
    tag: "Executive summary",
    text:
      "**Portfolio is amber-green for May 2026.** 28 of 47 projects on track, 9 at risk, 3 delayed. YTD value realized stands at **142M SAR (+18M MoM)**. On-time delivery at 84% (+2pts). Top exposure is regulatory reporting — escalated. AI/GenAI portfolio leads value contribution at 38%.",
    cards: [
      { type: "budget", title: "Budget utilization · 68%", meta: "Plan 134M · Actual 91M SAR", source: "SAP S/4 · Finance API" },
      { type: "risk",   title: "7 open critical risks",     meta: "-3 WoW · 2 escalated to ExCo", source: "ServiceNow GRC" },
      { type: "vendor", title: "Local SI Partner underperforming", meta: "Perf 74 / SLA 96.1%", source: "Ariba VMS" },
    ],
    followups: [
      "Export this as PowerPoint executive pack.",
      "What's the Vision 2030 alignment view?",
      "Email this to the CEO and CFO.",
    ],
  },
  vendor: {
    tag: "Vendor analysis",
    text:
      "**1 vendor is currently underperforming**: Local SI Partner — performance score 74, allocated to 4 projects including PRJ-1042 Lakehouse. **1 vendor on watch**: Informatica — performance 79 and SLA 97.4%. Total committed contract value across the portfolio is 56.6M SAR.",
    cards: [
      { type: "vendor", title: "Local SI Partner", meta: "Perf 74 · SLA 96.1% · 4 projects", source: "Ariba VMS" },
      { type: "vendor", title: "Informatica",      meta: "Perf 79 · SLA 97.4% · 1 project",  source: "Ariba VMS" },
    ],
    followups: ["Draft remediation plan for SI Partner.", "Compare to FY24 vendor performance."],
  },
  budget: {
    tag: "Budget utilization",
    text:
      "Total portfolio plan: **134M SAR**. Actual spent **91M (68%)**. Top consumer: AI / GenAI (31M actual / 42M plan · 74%). Lowest: Data Governance (8M / 12M · 67%). Committed but not yet invoiced: **117M (87%)** — burn pacing slightly ahead of forecast.",
    cards: [
      { type: "budget", title: "AI / GenAI",    meta: "31M / 42M · 74% utilization", source: "SAP S/4" },
      { type: "budget", title: "Data Platform", meta: "29M / 38M · 76% utilization", source: "SAP S/4" },
    ],
    followups: ["Flag any portfolio over 90% utilization.", "Forecast burn for Q4."],
  },
  squads: {
    tag: "Capacity",
    text:
      "**2 squads are overloaded**: AI Foundations (96/88, +109%) and MLOps & Platform (60/56, +107%). Governance & MDM is under-utilized (38/48, 79%) — re-balance candidate.",
    cards: [
      { type: "project", title: "AI Foundations squad", meta: "11 members · 109% allocated", source: "Jira capacity API" },
      { type: "project", title: "MLOps & Platform squad", meta: "7 members · 107% allocated", source: "Jira capacity API" },
    ],
    followups: ["Propose a re-balancing plan.", "Show capacity over next 4 sprints."],
  },
  demands: {
    tag: "Approval queue",
    text:
      "**6 demands are pending approval**, of which 2 are Critical. Highest-value pending: DMD-0231 Real-time Fraud Detection (value score 9.2) — sponsor Risk Dept. Recommendation: prioritize DMD-0231 and DMD-0238 for next intake committee.",
    cards: [
      { type: "demand", title: "DMD-0231 · Real-time Fraud Detection Dataset", meta: "Critical · Value 9.2 · Approval", source: "ServiceNow Demand" },
      { type: "demand", title: "DMD-0237 · HR Workforce Planning Cube",         meta: "Medium · Value 5.4 · Approval", source: "ServiceNow Demand" },
    ],
    followups: ["Open DMD-0231 in the approval workspace.", "Generate intake committee pack."],
  },
  status: {
    tag: "Project status",
    text:
      "**PRJ-1043 · GenAI Knowledge Assistant** — On Track. Progress 58%, budget 52% used, deadline Nov 15 2026. Owner F. Al-Otaibi. Latest sprint closed at 92% completion. 2 open medium risks. UAT entry gate scheduled for Aug 12.",
    cards: [
      { type: "project", title: "PRJ-1043 · GenAI Knowledge Assistant", meta: "On Track · 58% · Owner F. Al-Otaibi", source: "Jira · Portfolio Service" },
      { type: "risk",    title: "RSK-081 · CRM extract data quality",    meta: "Medium · open · owner Data Steward", source: "ServiceNow GRC" },
    ],
    followups: ["Show sprint burnup chart.", "List dependencies for PRJ-1043."],
  },
  risks: {
    tag: "Top risks",
    text:
      "**Top 5 risks this month** ranked by exposure score. Critical regulatory deadline shift on PRJ-1045 leads exposure, followed by Snowflake credit overrun (22% over forecast) and model drift on Risk v1.",
    cards: [
      { type: "risk", title: "RSK-078 · Regulatory deadline shift",   meta: "Critical · escalated", source: "ServiceNow GRC" },
      { type: "risk", title: "RSK-077 · Snowflake cost overrun",      meta: "High · 22% over",      source: "Snowflake billing" },
      { type: "risk", title: "RSK-080 · Model drift on Risk v1",      meta: "Medium · production",  source: "Azure ML" },
    ],
    followups: ["Open mitigation plan for RSK-078.", "Export risk register to PDF."],
  },
  blocked: {
    tag: "Dependencies",
    text:
      "**2 projects have blocked dependencies**. PRJ-1043 is blocked by vector-store capacity (cross-team — Cloud Eng). PRJ-1045 is blocked by SAP master data extract availability — owner SAP Center of Excellence.",
    cards: [
      { type: "project", title: "PRJ-1043 · GenAI Knowledge Assistant", meta: "Blocked by: Vector store quota",        source: "Jira dependency graph" },
      { type: "project", title: "PRJ-1045 · Regulatory Reporting",       meta: "Blocked by: SAP master data extract", source: "Jira dependency graph" },
    ],
    followups: ["Notify dependency owners.", "Visualize cross-portfolio dependencies."],
  },
  default: {
    tag: "Copilot",
    text:
      "I'm grounded across Jira, ServiceNow, SAP, Azure DevOps, Power BI and SharePoint. I'll answer with role-aware context, cite sources, and offer one-click drill-downs and exports. Try one of the suggestions below — or ask in natural language (Arabic and English supported).",
    followups: [
      "Generate an executive summary for this month.",
      "Which projects are delayed?",
      "What is budget utilization by portfolio?",
    ],
  },
};

function route(q: string): keyof typeof CANNED {
  const s = q.toLowerCase();
  if (/(delay|behind|slipp)/.test(s))                                 return "delayed";
  if (/(executive|summary|brief|monthly|exco|pack)/.test(s))          return "exec";
  if (/(vendor|supplier|underperform)/.test(s))                       return "vendor";
  if (/(budget|spend|finance|burn)/.test(s))                          return "budget";
  if (/(squad|capacity|overload|allocation)/.test(s))                 return "squads";
  if (/(demand|intake|approval|pending)/.test(s))                     return "demands";
  if (/(blocker|dependency|blocked)/.test(s))                         return "blocked";
  if (/(risk|escalat|top risks)/.test(s))                             return "risks";
  if (/(status|prj-|project)/.test(s))                                return "status";
  return "default";
}

function SourceIcon({ t }: { t: SourceCard["type"] }) {
  const map = { project: FolderKanban, risk: AlertTriangle, vendor: Building2, budget: Wallet, demand: Send, doc: BookOpen };
  const I = map[t];
  return <I className="size-3.5" />;
}

export function AICopilot({ open, onOpenChange }: { open: boolean; onOpenChange: (b: boolean) => void }) {
  const { role, user } = useRole();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      kind: "ai",
      tag: "Welcome",
      text: `Hi ${user.name.split(" ")[0]} — I'm your D&I Copilot. I can answer portfolio questions, generate executive packs, summarize Jira progress, and explain KPIs. Everything I say is grounded with citations from your connected systems.`,
      followups: SUGGESTIONS_BY_ROLE[role].map(s => s.q),
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  function send(q: string) {
    if (!q.trim()) return;
    const ans = CANNED[route(q)];
    setMsgs(m => [...m, { kind: "user", text: q }, { kind: "ai", ...ans }]);
    setInput("");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[520px] p-0 flex flex-col gap-0 bg-card"
      >
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border bg-gradient-to-br from-[#0C2341] to-[#0C2341]/95 text-white">
          <SheetTitle className="flex items-center gap-2.5 text-white">
            <div className="size-9 rounded-xl bg-gradient-to-br from-[#8B84D7] to-[#FFA38B] grid place-items-center shadow-soft">
              <Sparkle className="size-4 text-[#0C2341]" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-display text-[16px] font-semibold leading-tight">D&amp;I Copilot</div>
              <div className="text-[11px] font-normal text-white/60 leading-tight mt-0.5">
                Role-aware · grounded across Jira, ServiceNow, SAP, Power BI
              </div>
            </div>
            <Badge className="bg-[#FFA38B] text-[#623B2A] border-0 hover:bg-[#FFA38B] font-medium">Beta</Badge>
          </SheetTitle>
        </SheetHeader>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-background">
          {msgs.map((m, i) =>
            m.kind === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] bg-primary text-primary-foreground px-3.5 py-2.5 rounded-2xl rounded-br-md text-[13px] shadow-soft">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={i} className="space-y-2.5">
                {m.tag && (
                  <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-medium flex items-center gap-1.5">
                    <Sparkle className="size-3" /> {m.tag}
                  </div>
                )}
                <div className="bg-secondary/60 px-3.5 py-3 rounded-2xl rounded-tl-md text-[13px] leading-relaxed text-foreground"
                     dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>') }}
                />
                {m.cards && (
                  <div className="space-y-1.5">
                    {m.cards.map((c, j) => (
                      <button
                        key={j}
                        data-testid={`copilot-card-${i}-${j}`}
                        className="w-full flex items-start gap-3 text-left bg-card border border-card-border rounded-xl px-3 py-2.5 hover-elevate transition-all"
                      >
                        <div className="size-7 rounded-lg bg-primary/12 text-primary grid place-items-center mt-0.5 shrink-0">
                          <SourceIcon t={c.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12.5px] font-medium leading-tight truncate">{c.title}</div>
                          <div className="text-[11px] text-muted-foreground mt-1 leading-tight">{c.meta}</div>
                          <div className="text-[10px] text-primary/80 mt-1.5 flex items-center gap-1">
                            <span className="opacity-70">Source:</span> {c.source}
                          </div>
                        </div>
                        <ChevronRight className="size-3.5 text-muted-foreground mt-1" />
                      </button>
                    ))}
                  </div>
                )}
                {m.followups && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.followups.map((f, k) => (
                      <button
                        key={k}
                        onClick={() => send(f)}
                        data-testid={`copilot-followup-${i}-${k}`}
                        className="text-[11px] px-2.5 py-1.5 rounded-full bg-[#E7E5F7] text-[#3a3585] hover:bg-[#CFCCEF] dark:bg-primary/15 dark:text-primary transition-colors font-medium"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Export bar */}
        <div className="border-t border-border bg-card px-5 py-2.5 flex items-center gap-2">
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground mr-1">Export</span>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-[11.5px] gap-1" data-testid="copilot-export-pptx">
            <Presentation className="size-3.5" /> PowerPoint
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-[11.5px] gap-1" data-testid="copilot-export-pdf">
            <FileDown className="size-3.5" /> PDF
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-[11.5px] gap-1" data-testid="copilot-export-email">
            <Mail className="size-3.5" /> Email draft
          </Button>
        </div>

        {/* Composer */}
        <div className="border-t border-border bg-card p-3.5">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2"
          >
            <Input
              data-testid="input-copilot"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything · e.g. Which projects are delayed?"
              className="h-10 rounded-xl bg-background"
            />
            <Button type="submit" size="icon" className="rounded-xl bg-primary hover:bg-primary/90" data-testid="button-copilot-send">
              <Send className="size-4" />
            </Button>
          </form>
          <div className="text-[10px] text-muted-foreground mt-2 leading-snug px-1">
            Answers are role-scoped to your permissions. Sources cited from Jira, ServiceNow, SAP, Power BI, GitHub, SharePoint.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
