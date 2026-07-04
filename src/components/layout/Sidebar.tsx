import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, Truck, Radio, Route as RouteIcon, Wrench, Fuel,
  Users, ShieldAlert, FileText, BarChart3, Target,
  Plug, UserCog, Settings, Building2, PanelLeftClose, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const groups = [
  {
    label: null,
    items: [{ to: "/", label: "Executive Overview", icon: LayoutDashboard }],
  },
  {
    label: "OPERATIONS",
    items: [
      { to: "/fleet-operations", label: "Fleet Operations", icon: Truck },
      { to: "/dispatch-center", label: "Dispatch Center", icon: Radio },
      { to: "/trips-deliveries", label: "Trips & Deliveries", icon: RouteIcon },
      { to: "/maintenance", label: "Maintenance", icon: Wrench },
      { to: "/fuel-intelligence", label: "Fuel Intelligence", icon: Fuel },
    ],
  },
  {
    label: "COMPLIANCE",
    items: [
      { to: "/drivers-compliance", label: "Drivers & Compliance", icon: Users },
      { to: "/safety-incidents", label: "Safety & Incidents", icon: ShieldAlert },
      { to: "/documents", label: "Documents", icon: FileText },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      { to: "/reports", label: "Reports", icon: BarChart3 },
      { to: "/kpi-scorecard", label: "KPI Scorecard", icon: Target },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { to: "/integrations", label: "Integrations", icon: Plug },
      { to: "/users-access", label: "Users & Access", icon: UserCog },
      { to: "/system-settings", label: "System Settings", icon: Settings },
    ],
  },
] as const;

export function Sidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-[width] duration-300",
        collapsed ? "w-[76px]" : "w-[260px]",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-info shadow-lg shadow-primary/30">
          <RouteIcon className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-[13px] font-bold tracking-wide">PRIMELEX</div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Unified Intelligence System</div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        {groups.map((group, gi) => (
          <div key={gi} className="mb-4">
            {group.label && !collapsed && (
              <div className="px-3 pb-2 text-[10px] font-semibold tracking-[0.15em] text-muted-foreground">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all",
                      active
                        ? "bg-primary/15 text-white shadow-[inset_0_0_0_1px_oklch(0.62_0.19_258/0.3)]"
                        : "text-muted-foreground hover:bg-white/[0.04] hover:text-white",
                    )}
                  >
                    <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-primary")} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-white">
          <Building2 className="h-[18px] w-[18px]" />
          {!collapsed && <span className="truncate">Primelex Logistics</span>}
        </button>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-white"
        >
          <PanelLeftClose className={cn("h-[18px] w-[18px] transition-transform", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
