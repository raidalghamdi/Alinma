import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow, title, subtitle, actions,
}: { eyebrow?: string; title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
      <div>
        {eyebrow && (
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-primary font-medium mb-2">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-[26px] md:text-[30px] leading-[1.1] tracking-tight font-bold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13.5px] text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function KpiCard({
  label, value, suffix, delta, trend = "flat", accent = "primary", spark,
}: {
  label: string; value: string | number; suffix?: string;
  delta?: string; trend?: "up" | "down" | "flat";
  accent?: "primary" | "coral" | "orange" | "purple2" | "navy";
  spark?: ReactNode;
}) {
  const accentMap: Record<string, string> = {
    primary:  "from-[#8B84D7]/14 to-transparent",
    coral:    "from-[#FFA38B]/22 to-transparent",
    orange:   "from-[#C66E4E]/16 to-transparent",
    purple2:  "from-[#CFCCEF]/40 to-transparent",
    navy:     "from-[#0C2341]/8  to-transparent",
  };
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const trendClass = trend === "up" ? "text-ok" : trend === "down" ? "text-bad" : "text-muted-foreground";

  return (
    <Card className={`relative overflow-hidden border-card-border bg-card p-5 rounded-2xl shadow-soft hover-elevate transition-all`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${accentMap[accent]} pointer-events-none`} />
      <div className="relative">
        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-2">{label}</div>
        <div className="flex items-baseline gap-1.5">
          <div className="font-display text-[28px] font-bold tracking-tight">{value}</div>
          {suffix && <div className="text-[13px] font-medium text-muted-foreground">{suffix}</div>}
        </div>
        {delta && (
          <div className={`mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium ${trendClass}`}>
            <TrendIcon className="size-3" />
            <span>{delta}</span>
          </div>
        )}
        {spark && <div className="mt-3">{spark}</div>}
      </div>
    </Card>
  );
}

export function SectionCard({
  title, subtitle, actions, children, className = "",
}: { title?: string; subtitle?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={`bg-card border-card-border rounded-2xl shadow-soft ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-3 border-b border-border/60">
          <div>
            {title && <div className="font-display font-semibold text-[15px]">{title}</div>}
            {subtitle && <div className="text-[12px] text-muted-foreground mt-0.5">{subtitle}</div>}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </Card>
  );
}

const STATUS_MAP: Record<string, string> = {
  "On Track":      "bg-ok/10 text-ok ring-1 ring-ok/25",
  "At Risk":       "bg-warn/14 text-warn ring-1 ring-warn/30",
  "Delayed":       "bg-bad/12 text-bad ring-1 ring-bad/25",
  "On Hold":       "bg-muted text-muted-foreground ring-1 ring-border",
  "Completed":     "bg-primary/12 text-primary ring-1 ring-primary/25",
  "Healthy":       "bg-ok/10 text-ok ring-1 ring-ok/25",
  "Watch":         "bg-warn/14 text-warn ring-1 ring-warn/30",
  "Underperform":  "bg-bad/12 text-bad ring-1 ring-bad/25",
  "Connected":     "bg-ok/10 text-ok ring-1 ring-ok/25",
  "Degraded":      "bg-warn/14 text-warn ring-1 ring-warn/30",
  "Critical":      "bg-bad/14 text-bad ring-1 ring-bad/30",
  "High":          "bg-warn/14 text-warn ring-1 ring-warn/30",
  "Medium":        "bg-primary/12 text-primary ring-1 ring-primary/25",
  "Low":           "bg-muted text-muted-foreground ring-1 ring-border",
  "Info":          "bg-primary/10 text-primary ring-1 ring-primary/20",
  "Warn":          "bg-warn/14 text-warn ring-1 ring-warn/30",
};

export function StatusPill({ children }: { children: string }) {
  const cls = STATUS_MAP[children] || "bg-muted text-muted-foreground ring-1 ring-border";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${cls}`}>
      <span className="size-1 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
}

export function MiniProgress({ value, tone = "primary" }: { value: number; tone?: "primary" | "warn" | "bad" | "ok" }) {
  const color =
    tone === "warn" ? "bg-warn" : tone === "bad" ? "bg-bad" : tone === "ok" ? "bg-ok" : "bg-primary";
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "purple" | "warm" | "coral" }) {
  const map = {
    neutral: "bg-muted text-muted-foreground",
    purple:  "bg-[#E7E5F7] text-[#3a3585] dark:bg-primary/15 dark:text-primary",
    warm:    "bg-[#FCF4EF] text-[#623B2A] dark:bg-[#C66E4E]/20 dark:text-[#FFA38B]",
    coral:   "bg-[#FFA38B]/20 text-[#623B2A] dark:text-[#FFA38B]",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

export { Badge };
