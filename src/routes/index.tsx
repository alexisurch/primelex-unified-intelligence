import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Truck,
  Radio,
  Fuel,
  Route as RouteIcon,
  Wrench,
  ShieldAlert,
  LayoutDashboard,
  ClipboardList,
  Sparkles,
  ArrowRight,
  Building2,
  ShieldCheck,
  TrendingUp,
  Zap,
  Eye,
  Workflow,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const PLATFORM_HIGHLIGHTS = [
  { icon: Truck, title: "Fleet Operations", description: "Track every vehicle, driver and asset across your network in real time." },
  { icon: Radio, title: "Dispatch Management", description: "Coordinate assignments, loads and dispatch from a single command console." },
  { icon: Fuel, title: "Fuel Intelligence", description: "Monitor consumption, flag anomalies and control fuel costs fleet-wide." },
  { icon: RouteIcon, title: "Route Intelligence", description: "Optimize corridors, analyse performance and reduce dead mileage." },
  { icon: Wrench, title: "Maintenance Intelligence", description: "Stay ahead of service intervals and prevent unplanned downtime." },
  { icon: ShieldAlert, title: "Incident Management", description: "Log, investigate and resolve safety incidents with full audit trails." },
  { icon: LayoutDashboard, title: "Executive Dashboards", description: "Decision-grade visibility into KPIs and operational health." },
  { icon: ClipboardList, title: "Operational Reviews", description: "Standardize reviews with structured insights and action tracking." },
  { icon: Sparkles, title: "AI-Powered Operational Insights", description: "Coming soon. Predictive recommendations across your operations." },
];

const ENTERPRISE_OUTCOMES = [
  { icon: TrendingUp, label: "Reduce operational costs" },
  { icon: Truck, label: "Improve fleet utilization" },
  { icon: Eye, label: "Increase operational visibility" },
  { icon: Zap, label: "Make faster decisions" },
  { icon: Workflow, label: "Standardize operational workflows" },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <PlatformHighlights />
      <EnterpriseMessaging />
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <RouteIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-wide">PrimeLex Technologies</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Logistics Intelligence System</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Create Organisation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{ background: "radial-gradient(80% 60% at 50% 0%, oklch(0.62 0.19 258 / 0.18), transparent 70%)" }}
      />
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-24 text-center sm:pt-32">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-elevated/60 px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Enterprise Logistics Platform
        </div>
        <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          The Operating System for Modern Logistics Companies.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Manage fleets, dispatch, trips, fuel, maintenance, incidents, routes, and operational
          performance from one intelligent enterprise platform.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
          >
            Create Organisation
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-elevated/60 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 sm:w-auto"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}

function PlatformHighlights() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">One platform. Every operation.</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          The Logistics Intelligence System unifies the full operational lifecycle into a single
          decision-grade console.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORM_HIGHLIGHTS.map((h) => (
          <div key={h.title} className="glass-card glass-card-hover flex flex-col gap-3 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
              <h.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">{h.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{h.description}</p>
            {h.title.includes("Coming Soon") && (
              <span className="mt-1 inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                Coming Soon
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function EnterpriseMessaging() {
  return (
    <section className="border-y border-border/60 bg-elevated/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Built for logistics companies that run on discipline.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              LIS gives your operations team the structure, visibility and intelligence to run a
              tighter, more profitable fleet — without the spreadsheets and fragmented tools.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ENTERPRISE_OUTCOMES.map((o) => (
              <div key={o.label} className="glass-card flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                  <o.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col items-center justify-between gap-6 border-t border-border/60 pt-8 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">PrimeLex Technologies</div>
            <div className="text-[11px] text-muted-foreground">Logistics Intelligence System</div>
          </div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">Privacy Policy</a>
          <a href="#" className="transition-colors hover:text-foreground">Terms of Service</a>
          <a href="#" className="transition-colors hover:text-foreground">Support</a>
        </nav>
      </div>
      <div className="mt-6 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} PrimeLex Technologies. All rights reserved.
      </div>
    </footer>
  );
}
