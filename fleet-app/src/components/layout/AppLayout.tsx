import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ProfileDrawerProvider } from "@/lib/profile-drawer";
import { PreferencesProvider } from "@/lib/preferences";
import { BrandingProvider } from "@/lib/branding";
import { FleetManagersProvider } from "@/lib/fleet-managers-store";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface AppLayoutProps {
  /** Optional page title override. If omitted, derived from the route. */
  title?: string;
  /** Optional page subtitle override. If omitted, derived from the route. */
  subtitle?: string;
  /** Whether to show the Export button in the header. Defaults to true. */
  showExport?: boolean;
}

/* ------------------------------------------------------------------ */
/* Route metadata                                                      */
/* ------------------------------------------------------------------ */

/**
 * Static metadata keyed by pathname. Used to derive a page title and
 * subtitle from the current route when no explicit override is passed.
 */
const ROUTE_META: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Overview",
    subtitle: "Fleet performance at a glance",
  },
  "/action-center": {
    title: "Action Center",
    subtitle: "Prioritised tasks and alerts",
  },
  "/fleet-operations": {
    title: "Fleet Operations",
    subtitle: "Live status of every vehicle",
  },
  "/dispatch-center": {
    title: "Dispatch Center",
    subtitle: "Coordinate drivers and assignments",
  },
  "/trips-deliveries": {
    title: "Trips & Deliveries",
    subtitle: "Track active and completed trips",
  },
  "/route-intelligence": {
    title: "Route Intelligence",
    subtitle: "Optimise routes and reduce mileage",
  },
  "/maintenance": {
    title: "Maintenance",
    subtitle: "Service schedules and work orders",
  },
  "/fuel-intelligence": {
    title: "Fuel Intelligence",
    subtitle: "Consumption trends and savings",
  },
  "/incidents": {
    title: "Incidents",
    subtitle: "Safety events and compliance",
  },
  "/documents": {
    title: "Documents",
    subtitle: "Licences, permits, and records",
  },
  "/kpi-scorecard": {
    title: "KPI Scorecard",
    subtitle: "Operational targets and progress",
  },
  "/reports": {
    title: "Reports",
    subtitle: "Build and export custom reports",
  },
  "/users-access": {
    title: "Users & Access",
    subtitle: "Manage roles and permissions",
  },
  "/organisation": {
    title: "Organisation",
    subtitle: "Company profile and branding",
  },
  "/system-settings": {
    title: "System Settings",
    subtitle: "Workspace configuration",
  },
};

/* ------------------------------------------------------------------ */
/* AppLayout                                                           */
/* ------------------------------------------------------------------ */

/**
 * Root application layout.
 *
 * Wraps the entire app in the four required context providers, then
 * renders the fixed Sidebar alongside a scrollable main content area
 * that contains the sticky Header and the active route's <Outlet />.
 *
 * Provider nesting order (outermost → innermost):
 *   BrandingProvider → PreferencesProvider → FleetManagersProvider → ProfileDrawerProvider
 *
 * This order ensures that the profile drawer (which may read branding
 * and fleet-manager data) sits closest to the rendered tree, while
 * branding and preferences — which have no cross-dependencies — sit
 * at the outermost layers.
 */
export function AppLayout({
  title,
  subtitle,
  showExport = true,
}: AppLayoutProps = {}) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Derive title/subtitle from the current route when not explicitly passed.
  const meta = ROUTE_META[location.pathname] ?? {
    title: "Fleet Dashboard",
    subtitle: "PrimeLex Logistics",
  };
  const resolvedTitle = title ?? meta.title;
  const resolvedSubtitle = subtitle ?? meta.subtitle;

  return (
    <BrandingProvider>
      <PreferencesProvider>
        <FleetManagersProvider>
          <ProfileDrawerProvider>
            <div className="flex min-h-screen bg-background text-foreground">
              {/* Fixed sidebar */}
              <Sidebar
                collapsed={collapsed}
                onToggleCollapsed={() => setCollapsed((prev) => !prev)}
              />

              {/* Main content area — left margin mirrors the sidebar width
                  so content never overlaps it. The transition stays in sync
                  with the sidebar's own width transition. */}
              <div
                className={cn(
                  "flex min-h-screen flex-1 flex-col transition-[margin] duration-200 ease-in-out",
                  collapsed ? "ml-[72px]" : "ml-[260px]",
                )}
              >
                <Header
                  title={resolvedTitle}
                  subtitle={resolvedSubtitle}
                  showExport={showExport}
                />

                {/* Scrollable page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <Outlet />
                </main>
              </div>
            </div>
          </ProfileDrawerProvider>
        </FleetManagersProvider>
      </PreferencesProvider>
    </BrandingProvider>
  );
}

export default AppLayout;
