import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, Fuel, Route as RouteIcon, Wrench, ShieldCheck, ChartBar as BarChart3, ChartPie as PieChart, ChevronDown, User, Lock, Linkedin, Twitter, Facebook, Youtube, DollarSign, Shield, BrainCircuit, Radio, TriangleAlert, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const NAV_LINKS = [
  { label: "Product", dropdown: true },
  { label: "Solutions", dropdown: true },
  { label: "Resources", dropdown: true },
  { label: "Company", dropdown: false },
  { label: "Pricing", dropdown: false },
];

const MODULES = [
  { icon: Truck, label: "Fleet\nOperations" },
  { icon: Radio, label: "Dispatch\nCenter" },
  { icon: Fuel, label: "Fuel\nIntelligence" },
  { icon: RouteIcon, label: "Route\nIntelligence" },
  { icon: Wrench, label: "Maintenance\nManagement" },
  { icon: ShieldCheck, label: "Safety &\nIncidents" },
  { icon: BarChart3, label: "Reports &\nAnalytics" },
  { icon: PieChart, label: "Executive\nDashboard" },
];

const BENEFITS = [
  { icon: DollarSign, title: "Reduce Costs", description: "Identify inefficiencies and reduce fuel waste across your fleet." },
  { icon: Truck, title: "Improve Efficiency", description: "Increase fleet utilization and optimize operational workflows." },
  { icon: Shield, title: "Improve Safety", description: "Reduce incidents and ensure driver and asset safety." },
  { icon: BrainCircuit, title: "Smarter Decisions", description: "Real-time data and AI-powered insights for better decision-making." },
];

const FOOTER_COLS = [
  { heading: "Product", links: ["Features", "Modules", "Integrations", "Security"] },
  { heading: "Solutions", links: ["Fleet Management", "Dispatch Management", "Fuel Management", "Operations Intelligence"] },
  { heading: "Resources", links: ["Documentation", "Help Center", "Blog", "API Reference"] },
  { heading: "Company", links: ["About Us", "Careers", "Partners", "Contact Us"] },
  { heading: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <ModulesSection />
      <BenefitsSection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
}

/* ── Navigation ─────────────────────────────────────────────────────────── */
function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[oklch(0.13_0.028_260)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-8 py-4">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="relative h-10 w-10 shrink-0">
            <div
              className="absolute inset-0 bg-primary"
              style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            />
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              <RouteIcon className="h-[18px] w-[18px] text-white" />
            </div>
          </div>
          <div className="leading-tight">
            <div className="text-[16px] font-black tracking-[0.07em] text-foreground">PRIMELEX</div>
            <div className="text-[9px] font-medium tracking-[0.22em] text-muted-foreground">TECHNOLOGIES</div>
          </div>
        </Link>

        {/* Nav links — centred */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((n) => (
            <button
              key={n.label}
              className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
              {n.dropdown && <ChevronDown className="h-[13px] w-[13px]" />}
            </button>
          ))}
        </nav>

        {/* Sign In button */}
        <Link
          to="/login"
          className="hidden shrink-0 items-center gap-2 rounded-lg border border-white/[0.2] bg-white/[0.04] px-5 py-2.5 text-[14px] font-semibold text-foreground transition-all hover:border-white/40 hover:bg-white/[0.08] lg:inline-flex"
        >
          <User className="h-[15px] w-[15px]" />
          Sign In
        </Link>
      </div>
    </header>
  );
}

/* ── Dashboard Mockup ───────────────────────────────────────────────────── */
function DashboardMockup() {
  /* tiny SVG line chart path for delivery performance */
  const chartPoints = [
    [0, 55], [28, 45], [56, 52], [84, 38], [112, 42], [140, 32], [168, 36], [196, 28],
  ];
  const pathD = chartPoints.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

  /* donut segments: On Trip 55%, Available 24%, Maintenance 13%, Out of Service 8% */
  const donutSegments = [
    { pct: 55, color: "#3b82f6" },
    { pct: 24, color: "#22c55e" },
    { pct: 13, color: "#8b5cf6" },
    { pct: 8, color: "#64748b" },
  ];

  function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  }

  let startAngle = 0;
  const arcs = donutSegments.map((seg) => {
    const sweep = (seg.pct / 100) * 360;
    const arc = { ...seg, startAngle, endAngle: startAngle + sweep - 1.5 };
    startAngle += sweep;
    return arc;
  });

  const sidebarItems = [
    { label: "Overview", active: true },
    { label: "Fleet Operations" },
    { label: "Dispatch Center" },
    { label: "Trips & Deliveries" },
    { label: "Fuel Intelligence" },
    { label: "Maintenance" },
    { label: "Safety & Incidents" },
    { label: "Reports" },
    { label: "Documents" },
    { label: "Users & Access" },
    { label: "Organisation" },
  ];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0d1117]"
      style={{ boxShadow: "0 0 0 1px oklch(1 0 0 / 0.04), 0 40px 100px -20px oklch(0 0 0 / 0.8), 0 8px 32px -8px oklch(0 0 0 / 0.6)" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0d1117] px-4 py-2.5">
        <div className="flex items-center gap-2">
          {/* LIS logo */}
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
            <RouteIcon className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[11px] font-bold tracking-widest text-white">LIS</span>
          {/* collapse icon placeholder */}
          <div className="ml-1 h-3 w-0.5 rounded bg-white/20" />
        </div>
        {/* Search */}
        <div className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-3 py-1">
          <svg className="h-3 w-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <span className="text-[10px] text-white/30">Search anything...</span>
        </div>
        {/* User */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/30 text-[9px] font-bold text-primary">JD</div>
          <div className="text-right">
            <div className="text-[9px] font-semibold text-white">John Doe</div>
            <div className="text-[8px] text-white/40">Operations Manager</div>
          </div>
        </div>
      </div>

      {/* Body: sidebar + main */}
      <div className="flex" style={{ height: 390 }}>
        {/* Sidebar */}
        <div className="flex w-[130px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0a0d14] py-2">
          {sidebarItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 px-3 py-1.5 text-[9px] font-medium ${
                item.active ? "bg-primary/20 text-primary" : "text-white/40"
              }`}
            >
              <div className={`h-1.5 w-1.5 rounded-full ${item.active ? "bg-primary" : "bg-white/20"}`} />
              {item.label}
              {item.active && <div className="ml-auto h-2 w-0.5 rounded bg-primary" />}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden bg-[#0d1117] p-3">
          {/* Page title */}
          <div className="mb-3 text-[13px] font-bold text-white">Overview</div>

          {/* KPI cards */}
          <div className="mb-3 grid grid-cols-4 gap-2">
            {[
              { label: "Total Trucks", value: "142", delta: "+12 vs last month", up: true, pct: "+8%", color: "text-[#3b82f6]" },
              { label: "Active Trips", value: "78", delta: "+6 vs yesterday", up: true, pct: "+8%", color: "text-[#3b82f6]" },
              { label: "Total Drivers", value: "156", delta: "+9 vs last month", up: true, pct: "+6%", color: "text-[#3b82f6]" },
              { label: "Incidents", value: "12", delta: "-3 vs yesterday", up: false, pct: "", color: "text-[#ef4444]" },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-white/[0.06] bg-[#131920] p-2.5">
                <div className="mb-1 flex items-start justify-between">
                  <span className="text-[8px] text-white/50">{kpi.label}</span>
                  {kpi.label === "Incidents" ? (
                    <TriangleAlert className="h-3 w-3 text-yellow-500/70" />
                  ) : (
                    <Truck className="h-3 w-3 text-[#3b82f6]/60" />
                  )}
                </div>
                <div className="text-[18px] font-bold text-white">{kpi.value}</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className={`text-[7px] ${kpi.up ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                    {kpi.up ? "▲" : "▼"} {kpi.delta}
                  </span>
                  {kpi.pct && <span className="text-[7px] text-[#22c55e]">{kpi.pct}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Fleet Status + Delivery Performance */}
          <div className="mb-3 grid grid-cols-2 gap-2">
            {/* Fleet Status */}
            <div className="rounded-lg border border-white/[0.06] bg-[#131920] p-3">
              <div className="mb-1 text-[10px] font-semibold text-white">Fleet Status</div>
              <div className="mb-1 text-[7px] uppercase tracking-widest text-white/30">Distribution of Vehicles</div>
              <div className="flex items-center gap-3">
                {/* Donut */}
                <div className="relative shrink-0">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    {arcs.map((arc, i) => (
                      <path
                        key={i}
                        d={describeArc(40, 40, 28, arc.startAngle, arc.endAngle)}
                        fill="none"
                        stroke={arc.color}
                        strokeWidth="10"
                      />
                    ))}
                    <text x="40" y="37" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">142</text>
                    <text x="40" y="47" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6">Total</text>
                  </svg>
                </div>
                {/* Legend */}
                <div className="flex flex-col gap-1 text-[7px]">
                  {[
                    { label: "On Trip", val: "78 (55%)", color: "#3b82f6" },
                    { label: "Available", val: "34 (24%)", color: "#22c55e" },
                    { label: "In Maintenance", val: "18 (13%)", color: "#8b5cf6" },
                    { label: "Out of Service", val: "12 (8%)", color: "#64748b" },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: l.color }} />
                      <span className="text-white/50">{l.label}</span>
                      <span className="ml-auto font-medium text-white/80">{l.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Performance */}
            <div className="rounded-lg border border-white/[0.06] bg-[#131920] p-3">
              <div className="mb-1 flex items-center justify-between">
                <div className="text-[10px] font-semibold text-white">Delivery Performance</div>
                <span className="text-[7px] text-white/30">This Month</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[22px] font-bold text-white">92.6%</div>
                <span className="text-[9px] font-semibold text-[#22c55e]">▲ 8.4%</span>
              </div>
              {/* Mini line chart */}
              <div className="mt-2">
                <svg width="100%" height="60" viewBox="0 0 196 60" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path
                    d={`${pathD} L 196 60 L 0 60 Z`}
                    fill="url(#lineGrad)"
                  />
                  {/* Line */}
                  <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Data points */}
                  {chartPoints.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="2" fill="#3b82f6" />
                  ))}
                </svg>
                {/* X axis labels */}
                <div className="mt-1 flex justify-between text-[6px] text-white/30">
                  <span>01</span><span>07</span><span>14</span><span>21</span><span>28</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts + Top Priority */}
          <div className="grid grid-cols-2 gap-2">
            {/* Alerts */}
            <div className="rounded-lg border border-white/[0.06] bg-[#131920] p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-white">Alerts</span>
                <span className="text-[8px] text-[#3b82f6]">View all</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  { icon: "⚠", color: "#ef4444", label: "Maintenance overdue", time: "10m ago" },
                  { icon: "⚠", color: "#f59e0b", label: "High fuel consumption", time: "25m ago" },
                  { icon: "⚠", color: "#f59e0b", label: "Driver license expiring", time: "1h ago" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded" style={{ background: `${a.color}22` }}>
                      <span style={{ fontSize: 8, color: a.color }}>!</span>
                    </div>
                    <span className="flex-1 text-[8px] text-white/70">{a.label}</span>
                    <span className="text-[7px] text-white/30">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Priority */}
            <div className="rounded-lg border border-white/[0.06] bg-[#131920] p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-white">Top Priority</span>
                <span className="text-[8px] text-[#3b82f6]">View all</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  { icon: "🔒", label: "TRK-102 Maintenance overdue", badge: "High", badgeColor: "#ef4444" },
                  { icon: "🔒", label: "Insurance expiring", badge: "Medium", badgeColor: "#f59e0b" },
                  { icon: "🔒", label: "Incident needs review", badge: "Medium", badgeColor: "#f59e0b" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/[0.05]">
                      <ShieldAlert className="h-3 w-3 text-white/40" />
                    </div>
                    <span className="flex-1 text-[8px] text-white/70">{p.label}</span>
                    <span className="rounded px-1.5 py-0.5 text-[7px] font-semibold text-white" style={{ background: `${p.badgeColor}33`, color: p.badgeColor }}>
                      {p.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.13_0.028_260)]">
      {/* Radial glow left */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 80% at 5% 55%, oklch(0.55 0.22 258 / 0.22) 0%, transparent 60%)",
        }}
      />
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,oklch(1 0 0) 0 1px,transparent 1px 60px),repeating-linear-gradient(90deg,oklch(1 0 0) 0 1px,transparent 1px 60px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-8 pb-16 pt-14">
        {/* ── Desktop two-col ── */}
        <div className="hidden lg:grid lg:grid-cols-[46%_54%] lg:items-center lg:gap-12">
          {/* Left */}
          <div className="flex flex-col">
            {/* Badge */}
            <div className="mb-6 inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/[0.08] px-4 py-[5px] text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/90">
              Logistics Intelligence System (LIS)
            </div>

            {/* Headline */}
            <h1 className="text-[3.25rem] font-extrabold leading-[1.08] tracking-[-0.025em] text-white">
              The Operating System
              <br />
              for{" "}
              <span className="text-primary">Modern Logistics</span>
              <br />
              Companies
            </h1>

            {/* Sub-copy */}
            <p className="mt-5 max-w-[390px] text-[15px] leading-[1.7] text-white/55">
              Manage your fleet, dispatch, trips, fuel, maintenance,
              routes and operations from one intelligent platform.
              Optimize performance. Reduce costs. Deliver more.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-[14px] font-semibold text-white shadow-lg shadow-primary/40 transition-all hover:bg-primary/90"
              >
                <User className="h-4 w-4" />
                Create Organisation
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.18] bg-white/[0.04] px-6 py-3 text-[14px] font-semibold text-white transition-all hover:border-white/30 hover:bg-white/[0.07]"
              >
                <Lock className="h-4 w-4" />
                Administrator Sign In
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-10">
              <p className="mb-5 text-[12px] text-white/35">
                Trusted by forward-thinking logistics companies
              </p>
              <div className="flex flex-wrap items-center gap-7">
                <span className="text-[13px] font-black italic tracking-wide text-white/35">MIKANO</span>
                <span className="flex items-center gap-1.5 text-[13px] font-black tracking-wide text-white/35">
                  <span className="inline-block h-4 w-4 rounded-full border border-white/20 text-[8px] leading-none flex items-center justify-center">🦅</span>
                  DANGOTE
                </span>
                <span className="text-[12px] font-bold tracking-[0.06em] text-white/35">SIFAX GROUP</span>
                <span className="text-[12px] font-bold tracking-[0.06em] text-white/35">WAECORP</span>
                <span className="text-[13px] font-semibold tracking-wide text-white/35">
                  ABC <span className="font-light">Logistics</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right — dashboard mockup */}
          <div className="flex items-center justify-end">
            <DashboardMockup />
          </div>
        </div>

        {/* ── Mobile/tablet single-column ── */}
        <div className="flex flex-col lg:hidden">
          <div className="mb-5 inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/[0.08] px-4 py-[5px] text-[11px] font-semibold uppercase tracking-[0.13em] text-primary/90">
            Logistics Intelligence System (LIS)
          </div>
          <h1 className="text-[2.3rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-white">
            The Operating System<br />
            for{" "}<span className="text-primary">Modern Logistics</span><br />
            Companies
          </h1>
          <p className="mt-4 text-[14px] leading-[1.65] text-white/55">
            Manage your fleet, dispatch, trips, fuel, maintenance,
            routes and operations from one intelligent platform.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-[14px] font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90"
            >
              <User className="h-4 w-4" />
              Create Organisation
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.18] bg-white/[0.04] px-5 py-3 text-[14px] font-semibold text-white hover:border-white/30"
            >
              <Lock className="h-4 w-4" />
              Administrator Sign In
            </Link>
          </div>
          <div className="mt-8">
            <p className="mb-4 text-[12px] text-white/35">Trusted by forward-thinking logistics companies</p>
            <div className="flex flex-wrap gap-5">
              {["MIKANO", "DANGOTE", "SIFAX GROUP", "WAECORP", "ABC Logistics"].map((n) => (
                <span key={n} className="text-[12px] font-bold text-white/35">{n}</span>
              ))}
            </div>
          </div>
          <div className="mt-8 scale-[0.92] origin-top">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Modules ─────────────────────────────────────────────────────────────── */
function ModulesSection() {
  return (
    <section className="border-t border-white/[0.06] bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          One Platform. Complete Visibility.
        </div>
        <h2 className="text-center text-[1.85rem] font-bold leading-tight tracking-tight text-foreground lg:text-[2.1rem]">
          Everything You Need in One Intelligent Platform
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-muted-foreground">
          Power your operations with connected modules built for logistics.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {MODULES.map((m) => (
            <div
              key={m.label}
              className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-5 text-center transition-all hover:border-primary/30 hover:bg-white/[0.04]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <m.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="whitespace-pre-line text-[12px] font-medium leading-snug text-foreground/90">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Benefits ────────────────────────────────────────────────────────────── */
function BenefitsSection() {
  return (
    <section className="border-t border-white/[0.06] bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Drive Real Results
        </div>
        <h2 className="text-center text-[1.85rem] font-bold leading-tight tracking-tight text-foreground lg:text-[2.1rem]">
          Turn Operations into Competitive Advantage
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          LIS helps logistics companies reduce costs, improve efficiency and
          make smarter decisions every day.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all hover:border-primary/25 hover:bg-white/[0.04]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-[15px] font-semibold text-foreground">{b.title}</h3>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA Banner ──────────────────────────────────────────────────────────── */
function CtaSection() {
  return (
    <section className="mx-6 my-12 overflow-hidden rounded-2xl lg:mx-auto lg:max-w-7xl">
      <div
        className="relative flex min-h-[220px] items-center overflow-hidden"
        style={{
          background: "linear-gradient(100deg, oklch(0.22 0.055 258) 0%, oklch(0.28 0.07 258) 50%, oklch(0.2 0.04 260) 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,oklch(1 0 0) 0 1px,transparent 1px 40px),repeating-linear-gradient(90deg,oklch(1 0 0) 0 1px,transparent 1px 40px)",
          }}
        />
        <div className="relative z-10 flex-1 px-10 py-10">
          <h2 className="max-w-sm text-[1.65rem] font-bold leading-tight tracking-tight text-foreground">
            Ready to Modernize Your Logistics Operations?
          </h2>
          <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
            Create your organisation and start running your operations
            smarter, faster and more profitably.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90"
            >
              <User className="h-4 w-4" />
              Create Organisation
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-md border border-white/[0.2] bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-foreground hover:border-white/30 hover:bg-white/[0.1]"
            >
              <Lock className="h-4 w-4" />
              Administrator Sign In
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[42%] lg:block">
          <img
            src="https://images.pexels.com/photos/1121123/pexels-photo-1121123.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-left"
            style={{ maskImage: "linear-gradient(to right, transparent 0%, oklch(1 0 0) 35%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, oklch(1 0 0) 35%)" }}
          />
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-7">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"
                style={{ clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)" }}
              >
                <RouteIcon className="h-5 w-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-[13px] font-bold tracking-wide text-foreground">PRIMELEX</div>
                <div className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">TECHNOLOGIES</div>
              </div>
            </Link>
            <p className="max-w-[200px] text-[12px] leading-relaxed text-muted-foreground">
              Building intelligent logistics software solutions that help
              businesses operate smarter and achieve more.
            </p>
            <div className="mt-1 flex items-center gap-3">
              {[Linkedin, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.1] text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <div className="text-[12px] font-semibold text-foreground">{col.heading}</div>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[12px] text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Support */}
          <div className="flex flex-col gap-3">
            <div className="text-[12px] font-semibold text-foreground">Support</div>
            <ul className="flex flex-col gap-2.5">
              <li className="flex items-start gap-2 text-[12px] text-muted-foreground">
                <span className="mt-px text-primary">✉</span>
                hello@primelextech.com
              </li>
              <li className="flex items-start gap-2 text-[12px] text-muted-foreground">
                <span className="mt-px text-primary">☎</span>
                +234 800 123 4567
              </li>
              <li className="flex items-start gap-2 text-[12px] text-muted-foreground">
                <span className="mt-px text-primary">🕐</span>
                Mon – Fri: 8:00 AM – 6:00 PM
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05] py-4 text-center text-[11px] text-muted-foreground">
        © 2025 PrimeLex Technologies. All rights reserved.
      </div>
    </footer>
  );
}
