import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  Truck,
  Radio,
  Route,
  Wrench,
  Fuel,
  ShieldAlert,
  FileText,
  Target,
  BarChart3,
  UserCog,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

/** A single navigation item rendered as a NavLink. */
interface NavItem {
  /** Human-readable label shown in the sidebar. */
  label: string;
  /** Lucide icon component. */
  icon: React.ComponentType<LucideProps>;
  /** Route path the link navigates to. */
  path: string;
}

/** A group of navigation items with an optional uppercase label. */
interface NavGroup {
  /** Optional group label. When omitted, items render without a header. */
  label?: string;
  /** Navigation items in this group. */
  items: NavItem[];
}

export interface SidebarProps {
  /** Whether the sidebar is in its collapsed (icon-only) state. */
  collapsed: boolean;
  /** Toggle the collapsed state. */
  onToggleCollapsed: () => void;
}

/* ------------------------------------------------------------------ */
/* Navigation configuration                                            */
/* ------------------------------------------------------------------ */

const NAV_GROUPS: NavGroup[] = [
  {
    // No label — primary navigation at the top.
    items: [
      { label: "Overview", icon: LayoutDashboard, path: "/" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Action Center", icon: Zap, path: "/action-center" },
      { label: "Fleet Operations", icon: Truck, path: "/fleet-operations" },
      { label: "Dispatch Center", icon: Radio, path: "/dispatch-center" },
      { label: "Trips & Deliveries", icon: Route, path: "/trips-deliveries" },
      { label: "Route Intelligence", icon: Route, path: "/route-intelligence" },
      { label: "Maintenance", icon: Wrench, path: "/maintenance" },
      { label: "Fuel Intelligence", icon: Fuel, path: "/fuel-intelligence" },
    ],
  },
  {
    label: "Safety & Compliance",
    items: [
      { label: "Incidents", icon: ShieldAlert, path: "/incidents" },
      { label: "Documents", icon: FileText, path: "/documents" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "KPI Scorecard", icon: Target, path: "/kpi-scorecard" },
      { label: "Reports", icon: BarChart3, path: "/reports" },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Users & Access", icon: UserCog, path: "/users-access" },
      { label: "Organisation", icon: Building2, path: "/organisation" },
      { label: "System Settings", icon: Settings, path: "/system-settings" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

/**
 * Collapsible left-hand navigation sidebar.
 *
 * - Expanded width: 260px, collapsed width: 72px.
 * - Fixed to the left edge, full viewport height.
 * - Active route is highlighted via NavLink's isActive state.
 * - Collapse/expand state is controlled by the parent (AppLayout) so
 *   the main content margin can stay in sync.
 */
export function Sidebar({ collapsed, onToggleCollapsed }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-border bg-background transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      {/* ---------------------------------------------------------- */}
      {/* Logo / brand area                                           */}
      {/* ---------------------------------------------------------- */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border",
          collapsed ? "justify-center px-2" : "px-5",
        )}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Truck className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </span>
          {!collapsed && (
            <span className="whitespace-nowrap text-base font-bold tracking-wide text-foreground">
              PRIMELEX
            </span>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Navigation (scrollable)                                     */}
      {/* ---------------------------------------------------------- */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-3"
        aria-label="Primary navigation"
      >
        <ul className="flex flex-col gap-1 px-2">
          {NAV_GROUPS.map((group, groupIdx) => (
            <li key={group.label ?? `group-${groupIdx}`}>
              {/* Group label */}
              {group.label && !collapsed && (
                <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
              )}
              {/* Spacer when collapsed to visually separate groups */}
              {group.label && collapsed && groupIdx > 0 && (
                <div className="mx-3 my-2 h-px bg-border/60" aria-hidden="true" />
              )}

              {/* Items */}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.path === "/"}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center rounded-lg text-sm font-medium transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            collapsed
                              ? "h-10 w-full justify-center px-0"
                              : "h-10 w-full gap-3 px-3",
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                          )
                        }
                      >
                        <Icon
                          className="h-[18px] w-[18px] shrink-0"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      {/* ---------------------------------------------------------- */}
      {/* Collapse / expand toggle                                    */}
      {/* ---------------------------------------------------------- */}
      <div className="shrink-0 border-t border-border p-2">
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className={cn(
            "flex h-9 w-full items-center rounded-lg text-sm font-medium text-muted-foreground transition-colors",
            "hover:bg-white/[0.04] hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            collapsed ? "justify-center px-0" : "justify-between px-3",
          )}
        >
          {!collapsed && (
            <span className="text-xs uppercase tracking-wider">Collapse</span>
          )}
          {collapsed ? (
            <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
