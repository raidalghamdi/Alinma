import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "executive" | "manager" | "tech";

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  user: { name: string; title: string; initials: string };
};

const RoleContext = createContext<Ctx | null>(null);

const USERS: Record<Role, Ctx["user"]> = {
  executive: { name: "Raid Alghamdi", title: "Chief of Strategy & Business Excellence", initials: "RA" },
  manager:   { name: "Layla Al-Mutairi",  title: "Portfolio & Delivery Lead",            initials: "LM" },
  tech:      { name: "Khaled Al-Shehri",  title: "Principal Data Engineer · Squad Lead", initials: "KS" },
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("executive");
  return (
    <RoleContext.Provider value={{ role, setRole, user: USERS[role] }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
