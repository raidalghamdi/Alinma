import { useState } from "react";
import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider, useRole } from "@/lib/role-context";
import { AppShell } from "@/components/AppShell";
import { AICopilot } from "@/components/AICopilot";

import ExecutiveView from "@/pages/executive";
import ManagerView from "@/pages/manager";
import TechView from "@/pages/tech";
import PortfolioPage from "@/pages/portfolio";
import {
  DemandPage, BudgetPage, VendorsPage, RisksPage, ValuePage, ReportingPage,
  IntegrationsPage, GovernancePage, SquadsPage, MilestonesPage, SprintPage,
  ApprovalsPage, ArchitecturePage,
} from "@/pages/modules";
import NotFound from "@/pages/not-found";

function HomeRouter({ onOpenAI }: { onOpenAI: () => void }) {
  const { role } = useRole();
  if (role === "executive") return <ExecutiveView onOpenAI={onOpenAI} />;
  if (role === "manager")   return <ManagerView   onOpenAI={onOpenAI} />;
  return <TechView onOpenAI={onOpenAI} />;
}

function Inner() {
  const [aiOpen, setAiOpen] = useState(false);
  const open = () => setAiOpen(true);
  return (
    <AppShell onOpenAI={open}>
      <Switch>
        <Route path="/">              <HomeRouter onOpenAI={open} /></Route>
        <Route path="/portfolio">     <PortfolioPage /></Route>
        <Route path="/demand">        <DemandPage onOpenAI={open} /></Route>
        <Route path="/projects">      <PortfolioPage /></Route>
        <Route path="/budget">        <BudgetPage /></Route>
        <Route path="/vendors">       <VendorsPage /></Route>
        <Route path="/risks">         <RisksPage /></Route>
        <Route path="/value">         <ValuePage /></Route>
        <Route path="/reporting">     <ReportingPage onOpenAI={open} /></Route>
        <Route path="/integrations">  <IntegrationsPage /></Route>
        <Route path="/governance">    <GovernancePage /></Route>
        <Route path="/squads">        <SquadsPage /></Route>
        <Route path="/milestones">    <MilestonesPage /></Route>
        <Route path="/sprint">        <SprintPage /></Route>
        <Route path="/approvals">     <ApprovalsPage /></Route>
        <Route path="/architecture">  <ArchitecturePage /></Route>
        <Route component={NotFound} />
      </Switch>
      <AICopilot open={aiOpen} onOpenChange={setAiOpen} />
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <RoleProvider>
          <Router hook={useHashLocation}>
            <Inner />
          </Router>
        </RoleProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
