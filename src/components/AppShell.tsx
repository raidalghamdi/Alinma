import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useRole, type Role } from "@/lib/role-context";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  LayoutDashboard, Inbox, FolderKanban, KanbanSquare, Users, Wallet, Building2,
  ShieldAlert, Flag, Sparkles, FileBarChart2, FileCheck2, Plug,
  BellDot, Search, Sparkle, Settings, ChevronDown, Sun, Moon, Crown, Briefcase, Wrench, Menu
} from "lucide-react";

type NavItem = { href: string; label: string; icon: any; badge?: string };

const NAV_BY_ROLE: Record<Role, { section: string; items: NavItem[] }[]> = {
  executive: [
    { section: "Executive", items: [
      { href: "/",                  label: "Executive Cockpit",   icon: LayoutDashboard },
      { href: "/portfolio",         label: "Portfolio Dashboard", icon: FolderKanban },
      { href: "/value",             label: "Value Realization",   icon: Sparkles },
      { href: "/reporting",         label: "Executive Reporting", icon: FileBarChart2 },
    ]},
    { section: "Oversight", items: [
      { href: "/risks",             label: "Risks & Escalations", icon: ShieldAlert, badge: "7" },
      { href: "/vendors",           label: "Vendor Performance",  icon: Building2 },
      { href: "/budget",            label: "Budget & Finance",    icon: Wallet },
      { href: "/governance",        label: "Audit & Governance",  icon: FileCheck2 },
    ]},
    { section: "Platform", items: [
      { href: "/integrations",      label: "Integration Layer",   icon: Plug },
    ]},
  ],
  manager: [
    { section: "Pipeline", items: [
      { href: "/",                  label: "Manager Workspace",   icon: LayoutDashboard },
      { href: "/demand",            label: "Demand & Intake",     icon: Inbox, badge: "23" },
      { href: "/projects",          label: "Projects",            icon: FolderKanban },
      { href: "/milestones",        label: "Milestones",          icon: Flag },
    ]},
    { section: "Delivery", items: [
      { href: "/squads",            label: "Squads & Capacity",   icon: Users },
      { href: "/vendors",           label: "Vendor Management",   icon: Building2 },
      { href: "/budget",            label: "Budget vs Actuals",   icon: Wallet },
      { href: "/risks",             label: "Risks & Issues",      icon: ShieldAlert, badge: "12" },
    ]},
    { section: "Workflow", items: [
      { href: "/approvals",         label: "Approvals",           icon: FileCheck2, badge: "6" },
      { href: "/reporting",         label: "Reporting Packs",     icon: FileBarChart2 },
      { href: "/integrations",      label: "Integrations",        icon: Plug },
    ]},
  ],
  tech: [
    { section: "My Work", items: [
      { href: "/",                  label: "Squad Workspace",     icon: LayoutDashboard },
      { href: "/sprint",            label: "Sprint Board",        icon: KanbanSquare },
      { href: "/projects",          label: "Project Tracking",    icon: FolderKanban },
    ]},
    { section: "Engineering", items: [
      { href: "/architecture",      label: "Architecture & Data", icon: Wrench },
      { href: "/risks",             label: "Blockers & Risks",    icon: ShieldAlert, badge: "3" },
      { href: "/integrations",      label: "Integrations",        icon: Plug },
    ]},
    { section: "Quality", items: [
      { href: "/governance",        label: "Documentation & ADRs",icon: FileCheck2 },
    ]},
  ],
};

const ROLE_META: Record<Role, { label: string; icon: any; tagline: string }> = {
  executive: { label: "Executive View",        icon: Crown,     tagline: "C-Suite cockpit" },
  manager:   { label: "Managers & Leads View", icon: Briefcase, tagline: "Delivery oversight" },
  tech:      { label: "Squad & Tech View",     icon: Wrench,    tagline: "Build & ship" },
};

function SidebarContent({ onOpenAI, onNavigate }: { onOpenAI: () => void; onNavigate?: () => void }) {
  const { role, setRole } = useRole();
  const [location] = useLocation();
  const groups = NAV_BY_ROLE[role];

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="px-5 pt-5 pb-4 border-b border-sidebar-border">
        <Logo />
      </div>

      {/* Role switcher */}
      <div className="px-3 pt-3 pb-2">
        <div className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/60 px-2 mb-2">
          Switch View
        </div>
        <div className="space-y-1">
          {(Object.keys(ROLE_META) as Role[]).map(r => {
            const M = ROLE_META[r];
            const active = role === r;
            return (
              <button
                key={r}
                data-testid={`button-role-${r}`}
                onClick={() => { setRole(r); onNavigate?.(); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all
                  ${active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-sidebar-primary/40"
                    : "hover:bg-sidebar-accent/60 text-sidebar-foreground/80"}`}
              >
                <M.icon className="size-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium leading-tight">{M.label}</div>
                  <div className="text-[10px] text-sidebar-foreground/55 leading-tight mt-0.5">{M.tagline}</div>
                </div>
                {active && <div className="size-1.5 rounded-full bg-sidebar-primary pulse-dot" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
        {groups.map(group => (
          <div key={group.section} className="mb-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/55 px-2 mb-1.5">
              {group.section}
            </div>
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const active = location === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => onNavigate?.()}
                      data-testid={`nav-${item.href.replace(/\//g, "-") || "home"}`}
                      className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all
                        ${active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-soft"
                          : "text-sidebar-foreground/85 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"}`}
                    >
                      <Icon className="size-[15px] shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md
                          ${active ? "bg-white/20" : "bg-sidebar-foreground/10 text-sidebar-foreground/80"}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* AI Quick launcher */}
      <div className="px-3 pb-4">
        <button
          data-testid="button-open-ai-sidebar"
          onClick={() => { onOpenAI(); onNavigate?.(); }}
          className="w-full rounded-xl p-3 text-left bg-gradient-to-br from-[#8B84D7]/20 to-[#FFA38B]/15 hover:from-[#8B84D7]/30 hover:to-[#FFA38B]/20 ring-1 ring-sidebar-primary/30 transition-all"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="size-7 rounded-lg bg-sidebar-primary/90 grid place-items-center">
              <Sparkle className="size-3.5 text-sidebar-primary-foreground" />
            </div>
            <div className="text-[12px] font-semibold">D&amp;I Copilot</div>
            <Badge className="ml-auto text-[9px] bg-[#FFA38B] text-[#623B2A] border-0 hover:bg-[#FFA38B]">Beta</Badge>
          </div>
          <div className="text-[11px] text-sidebar-foreground/70 leading-snug">
            Ask anything · portfolio search · generate executive summaries.
          </div>
        </button>
      </div>

      <div className="px-4 py-3 border-t border-sidebar-border text-[10px] text-sidebar-foreground/50">
        v1.0 · Vision 2030 aligned
      </div>
    </div>
  );
}

export function AppShell({ children, onOpenAI }: { children: ReactNode; onOpenAI: () => void }) {
  const { user } = useRole();
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDark = () => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-sidebar-border">
        <SidebarContent onOpenAI={onOpenAI} />
      </aside>

      {/* MOBILE SIDEBAR (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[280px] bg-sidebar border-r border-sidebar-border">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent onOpenAI={onOpenAI} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* MAIN */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 glass-panel border-b border-border">
          <div className="h-16 px-4 lg:px-8 flex items-center gap-3 lg:gap-4">
            {/* Mobile hamburger */}
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="lg:hidden rounded-xl shrink-0"
                onClick={() => setMobileOpen(true)}
                data-testid="button-mobile-menu"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <div className="hidden md:flex items-center gap-2 text-[12px] text-muted-foreground">
              <span className="opacity-70">Workspace</span>
              <ChevronDown className="size-3 opacity-50" />
              <span className="text-foreground font-medium">Data &amp; Intelligence Office</span>
            </div>

            <div className="flex-1 max-w-xl mx-auto relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                data-testid="input-global-search"
                placeholder="Search portfolio"
                className="pl-9 h-10 bg-card border-card-border rounded-xl"
              />
              <kbd className="hidden md:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>
            </div>

            <Button
              size="sm"
              variant="default"
              onClick={onOpenAI}
              data-testid="button-open-ai-top"
              className="hidden md:inline-flex h-9 rounded-xl gap-1.5 bg-primary hover:bg-primary/90"
            >
              <Sparkle className="size-3.5" /> Ask Copilot
            </Button>

            <Button size="icon" variant="ghost" className="rounded-xl" onClick={toggleDark} data-testid="button-toggle-dark">
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button size="icon" variant="ghost" className="hidden sm:inline-flex rounded-xl relative" data-testid="button-notifications">
              <BellDot className="size-4" />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-[#FFA38B] pulse-dot" />
            </Button>
            <Button size="icon" variant="ghost" className="hidden sm:inline-flex rounded-xl" data-testid="button-settings">
              <Settings className="size-4" />
            </Button>

            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 sm:ml-1 sm:border-l border-border">
              <Avatar className="size-9 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/15 text-primary font-medium text-[12px]">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block leading-tight">
                <div className="text-[12.5px] font-semibold">{user.name}</div>
                <div className="text-[10.5px] text-muted-foreground">{user.title}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0 p-4 sm:p-5 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
