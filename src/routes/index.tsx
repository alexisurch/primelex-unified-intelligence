import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Route as RouteIcon,
  Truck,
  Navigation,
  Fuel,
  Wrench,
  TriangleAlert,
  Route as RouteIntelligenceIcon,
  LayoutDashboard,
  ClipboardList,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Eye,
  Zap,
  Workflow,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const HIGHLIGHTS = [
  { icon: Truck, title: "Fleet Operations", description: "Track every vehicle, driver and asset across your fleet in real time." },
  { icon: Navigation, title: "Dispatch Management", description: "Assign trucks, drivers and routes with intelligent dispatch workflows." },
  { icon: Fuel, title: "Fuel Intelligence", description: "Monitor fuel transactions, consumption and fraud across the entire fleet." },
  { icon: RouteIntelligenceIcon, title: "Route Intelligence", description: "Optimize routes, reduce empty miles and improve delivery performance." },
  { icon: Wrench, title: "Maintenance Intelligence", description: "Schedule, track and forecast maintenance to keep fleets road-ready." },
  { icon: TriangleAlert, title: "Incident Management", description: "Report, investigate and resolve safety incidents with full audit trails." },
  { icon: LayoutDashboard, title: "Executive Dashboards", description: "Decision-grade KPIs and operational performance for leadership." },
  { icon: ClipboardList, title: "Operational Reviews", description: "Standardize reviews and reporting across every operating unit." },
  { icon: Sparkles, title: "AI-Powered Operational Insights", description: "Coming soon. Predictive intelligence for the next era of logistics." },
];

const OUTCOMES = [
  { icon: TrendingUp, title: "Reduce operational costs", description: "Unify fuel, maintenance and dispatch data to surface cost-saving opportunities." },
  { icon: Truck, title: "Improve fleet utilization", description: "Match trucks and drivers to demand with real-time visibility." },
  { icon: Eye, title: "Increase operational visibility", description: "Every truck, trip and incident in one intelligent console." },
  { icon: Zap, title: "Make faster decisions", description: "Live KPIs and executive dashboards built for decision-grade reporting." },
  { icon: Workflow, title: "Standardize operational workflows", description: "Consistent processes for dispatch, maintenance and compliance." },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <RouteIcon className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-wide">PrimeLex Technologies</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Logistics Intelligence System</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-elevated/60"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create Organisation
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-elevated/40 px-3 py-1 text-xs text-muted-foreground">
              <span className="flex h-1.5 w-1.5 rounded-full bg-success" />
              PrimeLex Technologies · Logistics Intelligence System
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
              The Operating System for Modern Logistics Companies.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Manage fleets, dispatch, trips, fuel, maintenance, incidents, routes, and operational performance from one intelligent enterprise platform.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Create Organisation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-md border border-border bg-elevated/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-elevated/60"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform highlights */}
      <section className="border-t border-border/60 bg-elevated/20">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              One platform. Every logistics operation.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              LIS unifies the full operational stack — from the yard to the boardroom — into a single, intelligent system of record.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="group rounded-xl border border-border/60 bg-background p-5 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <h.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{h.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise messaging */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Built for logistics companies that operate at scale.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              LIS helps logistics companies run tighter, safer and more profitable operations.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OUTCOMES.map((o) => (
              <div key={o.title} className="rounded-xl border border-border/60 bg-elevated/40 p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-elevated/80 text-foreground">
                  <o.icon className="h-4.5 w-4.5" strokeWidth={2} />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{o.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{o.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-border/60 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Ready to modernize your logistics operation?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Create your organisation workspace and bring your team on board in minutes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create Organisation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              Administrator Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <RouteIcon className="h-4 w-4 text-white" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-bold tracking-wide">PrimeLex Technologies</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Logistics Intelligence System</div>
                </div>
              </div>
              <p className="mt-3 max-w-xs text-xs text-muted-foreground">
                The operating system for modern logistics companies.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted-foreground">
              <span className="cursor-default hover:text-foreground">Privacy Policy</span>
              <span className="cursor-default hover:text-foreground">Terms of Service</span>
              <span className="cursor-default hover:text-foreground">Support</span>
            </div>
          </div>
          <div className="mt-8 border-t border-border/60 pt-6 text-xs text-muted-foreground">
            © 2026 PrimeLex Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
