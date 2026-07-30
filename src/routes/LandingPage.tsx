import { useState } from "react";
import {
  Hexagon,
  ChevronDown,
  User,
  Lock,
  ArrowRight,
  Play,
  Truck,
  TrendingUp,
  Route as RouteIcon,
  Users,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[oklch(0.165_0.028_258)] text-white">
      <Nav mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Hero />
      <TrustBar />
      <StatsBar />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}

/* ───────────────────────────  NAV  ─────────────────────────── */

function Nav({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const navLinks = [
    { label: "Product", icon: true },
    { label: "Solutions", icon: true },
    { label: "Resources", icon: true },
    { label: "Company", icon: false },
    { label: "Pricing", icon: false },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[oklch(0.16_0.028_260)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex shrink-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center">
            <Hexagon className="h-9 w-9 fill-[#1d6ff4] text-[#1d6ff4]" strokeWidth={1.5} />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-extrabold tracking-tight">PRIMELEX</div>
            <div className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/50">
              Technologies
            </div>
          </div>
        </a>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href="#"
              className="flex items-center gap-1 rounded-lg px-4 py-2 text-[14px] font-medium text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              {l.label}
              {l.icon && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.22] bg-transparent px-5 py-2.5 text-[14px] font-medium text-white transition-all hover:border-white/40 hover:bg-white/[0.04]"
          >
            <User className="h-[15px] w-[15px]" />
            Sign In
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-white" />
            <span className="block h-0.5 w-6 bg-white" />
            <span className="block h-0.5 w-6 bg-white" />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/[0.06] bg-[oklch(0.16_0.028_260)] px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href="#"
                className="flex items-center justify-between rounded-lg px-4 py-3 text-[15px] font-medium text-white/80 transition-colors hover:bg-white/[0.04]"
              >
                {l.label}
                {l.icon && <ChevronDown className="h-4 w-4 opacity-60" />}
              </a>
            ))}
            <a
              href="#"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.22] px-5 py-3 text-[14px] font-medium text-white"
            >
              <User className="h-[15px] w-[15px]" />
              Sign In
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ───────────────────────────  HERO  ─────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.16_0.028_260)]">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[#1d6ff4]/20 blur-[120px]" />
        <div className="absolute right-0 top-40 h-[380px] w-[380px] rounded-full bg-[#1d6ff4]/10 blur-[120px]" />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-2 lg:px-8 lg:pb-32 lg:pt-28">
        {/* Left column */}
        <div>
          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1d6ff4]/30 bg-[#1d6ff4]/10 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1d6ff4] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1d6ff4]" />
            </span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#5b9dff]">
              Logistics Intelligence System (LIS)
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-[44px] font-extrabold leading-[1.07] tracking-tight text-white sm:text-[52px] lg:text-[56px]">
            The Operating System for
            <br />
            <span className="text-[#1d6ff4]">Modern Logistics</span> Companies
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/60">
            Streamline operations with AI-driven route optimization, real-time fleet tracking, and
            automated workflows. Everything you need to run a logistics business — in one platform.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-lg bg-[#1d6ff4] px-6 py-3 text-[15px] font-semibold text-white shadow-lg shadow-[#1d6ff4]/30 transition-all hover:bg-[#155fd0] hover:shadow-[#1d6ff4]/40"
            >
              <User className="h-[17px] w-[17px]" />
              Create Organisation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.22] bg-white/[0.03] px-6 py-3 text-[15px] font-semibold text-white transition-all hover:border-white/35 hover:bg-white/[0.07]"
            >
              <Lock className="h-[17px] w-[17px]" />
              Administrator Sign In
            </a>
          </div>

          {/* Sub link */}
          <div className="mt-7">
            <a
              href="#"
              className="group inline-flex items-center gap-2 text-[14px] font-medium text-white/50 transition-colors hover:text-white/80"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-white/30">
                <Play className="h-3 w-3 translate-x-[1px] fill-current" />
              </span>
              Watch 2-min product tour
            </a>
          </div>
        </div>

        {/* Right column — dashboard mockup */}
        <div className="relative">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div className="relative">
      {/* Floating glow behind frame */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#1d6ff4]/20 via-transparent to-transparent blur-2xl" />

      {/* Frame */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.205_0.03_260)] shadow-2xl shadow-black/40">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex-1">
            <div className="mx-auto w-fit rounded-md bg-white/[0.04] px-3 py-1 text-[11px] text-white/40">
              app.primelex.com/dashboard
            </div>
          </div>
        </div>

        {/* Dashboard body */}
        <div className="grid grid-cols-[200px_1fr]">
          {/* Sidebar */}
          <div className="border-r border-white/[0.06] p-3">
            <div className="mb-4 flex items-center gap-2 px-2">
              <Hexagon className="h-6 w-6 fill-[#1d6ff4] text-[#1d6ff4]" strokeWidth={1.5} />
              <span className="text-[12px] font-bold">PrimeLex</span>
            </div>
            {[
              { icon: TrendingUp, label: "Dashboard", active: true },
              { icon: Truck, label: "Fleet" },
              { icon: RouteIcon, label: "Routes" },
              { icon: Users, label: "Drivers" },
              { icon: ShieldCheck, label: "Compliance" },
            ].map((item) => (
              <div
                key={item.label}
                className={
                  "mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-colors " +
                  (item.active
                    ? "bg-[#1d6ff4]/15 text-[#5b9dff]"
                    : "text-white/45 hover:bg-white/[0.03]")
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            ))}
          </div>

          {/* Main panel */}
          <div className="p-4">
            {/* Top bar */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold">Operations Overview</div>
                <div className="text-[10px] text-white/40">Last 30 days</div>
              </div>
              <div className="flex gap-2">
                <div className="rounded-md bg-white/[0.04] px-3 py-1.5 text-[10px] text-white/50">
                  Export
                </div>
                <div className="rounded-md bg-[#1d6ff4] px-3 py-1.5 text-[10px] font-medium text-white">
                  + New Trip
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div className="mb-4 grid grid-cols-3 gap-3">
              {[
                { label: "Active Trips", value: "1,248", delta: "+12%", color: "text-[#28c840]" },
                { label: "On-time Rate", value: "97.4%", delta: "+3.1%", color: "text-[#28c840]" },
                { label: "Fuel Saved", value: "8.2k L", delta: "+8%", color: "text-[#28c840]" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="text-[10px] text-white/40">{s.label}</div>
                  <div className="mt-1 text-[18px] font-bold">{s.value}</div>
                  <div className={"text-[10px] font-medium " + s.color}>{s.delta}</div>
                </div>
              ))}
            </div>

            {/* Chart placeholder */}
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[12px] font-semibold">Trip Volume</div>
                <div className="text-[10px] text-white/40">Weekly</div>
              </div>
              <div className="flex h-28 items-end gap-2">
                {[40, 65, 50, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-[#1d6ff4]/30 to-[#1d6ff4]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -right-3 top-20 hidden rounded-xl border border-white/10 bg-[oklch(0.24_0.03_260)] px-4 py-3 shadow-xl sm:block">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#28c840]/15">
            <Zap className="h-4 w-4 text-[#28c840]" />
          </div>
          <div>
            <div className="text-[11px] font-semibold">AI Optimized</div>
            <div className="text-[9px] text-white/40">Routes recalculated</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────  TRUST BAR  ─────────────────────────── */

function TrustBar() {
  const names = ["DANGOTE", "GBH LOGISTICS", "OANDO", "NIPCO", "BOVAS"];
  return (
    <section className="border-y border-white/[0.06] bg-[oklch(0.18_0.028_260)] py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mb-6 text-center text-[12px] font-medium uppercase tracking-[0.18em] text-white/35">
          Trusted by logistics leaders across Africa
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {names.map((n) => (
            <span
              key={n}
              className="text-[15px] font-bold tracking-wide text-white/25 transition-colors hover:text-white/50"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────  STATS BAR  ─────────────────────────── */

function StatsBar() {
  const stats = [
    { value: "1,200+", label: "Organisations" },
    { value: "47M+", label: "Trips tracked" },
    { value: "97.4%", label: "On-time delivery" },
    { value: "23%", label: "Avg. fuel savings" },
  ];
  return (
    <section className="bg-[oklch(0.165_0.028_258)] py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-[36px] font-extrabold text-white">{s.value}</div>
            <div className="mt-1 text-[13px] text-white/45">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────────  FEATURES  ─────────────────────────── */

function Features() {
  const features = [
    {
      icon: RouteIcon,
      title: "AI Route Optimization",
      desc: "Cut fuel costs and delivery times with real-time route recalculation powered by machine learning.",
    },
    {
      icon: Truck,
      title: "Live Fleet Tracking",
      desc: "Monitor every vehicle in real time with GPS telemetry, geofencing, and instant status alerts.",
    },
    {
      icon: Users,
      title: "Driver Management",
      desc: "Onboard drivers, track compliance, and manage assignments with automated workflow tools.",
    },
    {
      icon: ShieldCheck,
      title: "Compliance & Safety",
      desc: "Stay audit-ready with automated regulatory checks, document expiry alerts, and safety scoring.",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Reporting",
      desc: "Make data-driven decisions with real-time dashboards, custom reports, and predictive insights.",
    },
    {
      icon: Zap,
      title: "Workflow Automation",
      desc: "Eliminate manual paperwork with automated trip assignments, approvals, and notifications.",
    },
  ];
  return (
    <section className="bg-[oklch(0.165_0.028_258)] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#5b9dff]">
              Platform
            </span>
          </div>
          <h2 className="mt-5 text-[36px] font-extrabold tracking-tight">
            Everything you need to run logistics
          </h2>
          <p className="mt-4 text-[17px] text-white/55">
            One integrated platform replacing the patchwork of spreadsheets, trackers, and tools
            your team is juggling today.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 transition-all hover:border-[#1d6ff4]/30 hover:bg-white/[0.04]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1d6ff4]/12 text-[#1d6ff4] transition-colors group-hover:bg-[#1d6ff4]/20">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-[18px] font-bold">{f.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/50">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────  CTA  ─────────────────────────── */

function CTA() {
  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[#1d6ff4]/20 bg-gradient-to-br from-[#1d6ff4]/15 via-[oklch(0.19_0.03_260)] to-[oklch(0.16_0.028_260)] p-12 lg:p-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#1d6ff4]/20 blur-[100px]" />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-[34px] font-extrabold leading-tight">
              Ready to modernize your logistics operations?
            </h2>
            <p className="mt-4 text-[16px] text-white/60">
              Set up your organisation in under five minutes. No credit card required.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1d6ff4] px-6 py-3 text-[15px] font-semibold text-white shadow-lg shadow-[#1d6ff4]/30 transition-all hover:bg-[#155fd0]"
              >
                <User className="h-[17px] w-[17px]" />
                Create Organisation
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-[15px] font-semibold text-white transition-all hover:bg-white/[0.06]"
              >
                <Lock className="h-[17px] w-[17px]" />
                Administrator Sign In
              </a>
            </div>
          </div>
          <ul className="space-y-3">
            {[
              "Free 30-day trial — full platform access",
              "No credit card required to start",
              "Onboarding support included",
              "Cancel anytime, no lock-in",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-[15px] text-white/75">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#28c840]/20">
                  <Check className="h-3 w-3 text-[#28c840]" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────  FOOTER  ─────────────────────────── */

function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "Integrations", "Pricing", "Changelog"] },
    { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
    { title: "Resources", links: ["Docs", "API Reference", "Support", "Status"] },
    { title: "Legal", links: ["Privacy", "Terms", "Security", "GDPR"] },
  ];
  return (
    <footer className="border-t border-white/[0.06] bg-[oklch(0.14_0.028_260)]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <Hexagon className="h-9 w-9 fill-[#1d6ff4] text-[#1d6ff4]" strokeWidth={1.5} />
              <div className="leading-tight">
                <div className="text-[15px] font-extrabold tracking-tight">PRIMELEX</div>
                <div className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/50">
                  Technologies
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/45">
              The Logistics Intelligence System for modern logistics companies across Africa and
              beyond.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-white/40">
                {c.title}
              </div>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[14px] text-white/55 transition-colors hover:text-white"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-[13px] text-white/40">
            © {new Date().getFullYear()} PrimeLex Technologies. All rights reserved.
          </p>
          <p className="text-[13px] text-white/40">Built for logistics, made for scale.</p>
        </div>
      </div>
    </footer>
  );
}
