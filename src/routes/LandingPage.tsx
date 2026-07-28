import { Truck, MapPin, Fuel, Route as RouteIcon, Wrench, ShieldCheck, ChartBar as BarChart3, ChartPie as PieChart, ChevronDown, User, Lock, Linkedin, Twitter, Facebook, Youtube, DollarSign, Zap, Shield, BrainCircuit, Radio, Search, Bell, Settings, TrendingUp, TrendingDown, CircleDot, Navigation, Clock, Gauge } from "lucide-react";

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

export default function LandingPage() {
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
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[oklch(0.16_0.028_260)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-4 lg:px-8">
        <a href="#" className="flex shrink-0 items-center gap-3">
          <div className="relative h-10 w-10 shrink-0">
            <div className="absolute inset-0 bg-primary" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              <RouteIcon className="h-[18px] w-[18px] text-white" />
            </div>
          </div>
          <div className="leading-none">
            <div className="text-[17px] font-black tracking-[0.06em] text-foreground">PRIMELEX</div>
            <div className="mt-0.5 text-[9px] font-medium tracking-[0.22em] text-muted-foreground">TECHNOLOGIES</div>
          </div>
        </a>

        <nav className="ml-auto hidden items-center lg:flex">
          {NAV_LINKS.map((n) => (
            <button key={n.label} className="inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground">
              {n.label}
              {n.dropdown && <ChevronDown className="h-[14px] w-[14px]" />}
            </button>
          ))}
        </nav>

        <a href="#" className="hidden shrink-0 items-center gap-2 rounded-lg border border-white/[0.22] bg-transparent px-5 py-2.5 text-[14px] font-medium text-foreground transition-all hover:border-white/40 hover:bg-white/[0.04] lg:inline-flex">
          <User className="h-[15px] w-[15px]" />
          Sign In
        </a>
      </div>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.16_0.028_260)]">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 70% at 10% 50%, oklch(0.55 0.2 258 / 0.18) 0%, transparent 65%)" }} />

      <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-14 lg:px-8">
        {/* Desktop: two columns */}
        <div className="hidden lg:grid lg:grid-cols-[42%_58%] lg:items-center lg:gap-10">
          <div className="flex flex-col">
            <div className="mb-5 inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/[0.08] px-4 py-[6px] text-[11px] font-semibold uppercase tracking-[0.13em] text-primary/90">
              Logistics Intelligence System (LIS)
            </div>
            <h1 className="text-[3.4rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-foreground">
              The Operating System
              <br />
              for <span className="text-primary">Modern Logistics</span>
              <br />
              Companies
            </h1>
            <p className="mt-5 max-w-[380px] text-[15px] leading-[1.65] text-muted-foreground">
              Manage your fleet, dispatch, trips, fuel, maintenance, routes and operations from one intelligent platform. Optimize performance. Reduce costs. Deliver more.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a href="#" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-[11px] text-[14px] font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90">
                <User className="h-4 w-4" />
                Create Organisation
              </a>
              <a href="#" className="inline-flex items-center gap-2 rounded-lg border border-white/[0.22] bg-white/[0.04] px-6 py-[11px] text-[14px] font-semibold text-foreground transition-all hover:border-white/35 hover:bg-white/[0.07]">
                <Lock className="h-4 w-4" />
                Administrator Sign In
              </a>
            </div>
            <div className="mt-10">
              <p className="mb-4 text-[13px] text-muted-foreground">Trusted by forward-thinking logistics companies</p>
              <div className="flex flex-wrap items-center gap-7">
                <span className="text-[13px] font-black italic tracking-wide text-white/40">MIKANO</span>
                <span className="text-[13px] font-black tracking-wide text-white/40">DANGOTE</span>
                <span className="text-[12px] font-bold tracking-[0.08em] text-white/40">SIFAX GROUP</span>
                <span className="text-[12px] font-bold tracking-[0.06em] text-white/40">WAECORP</span>
                <span className="text-[13px] font-semibold tracking-wide text-white/40">ABC <span className="font-light">Logistics</span></span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <DashboardMockup />
          </div>
        </div>

        {/* Mobile/tablet single column */}
        <div className="flex flex-col lg:hidden">
          <div className="mb-5 inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/[0.08] px-4 py-[6px] text-[11px] font-semibold uppercase tracking-[0.13em] text-primary/90">
            Logistics Intelligence System (LIS)
          </div>
          <h1 className="text-[2.4rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-foreground">
            The Operating System
            <br />
            for <span className="text-primary">Modern Logistics</span>
            <br />
            Companies
          </h1>
          <p className="mt-5 text-[15px] leading-[1.65] text-muted-foreground">
            Manage your fleet, dispatch, trips, fuel, maintenance, routes and operations from one intelligent platform. Optimize performance. Reduce costs. Deliver more.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-[11px] text-[14px] font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90">
              <User className="h-4 w-4" />
              Create Organisation
            </a>
            <a href="#" className="inline-flex items-center gap-2 rounded-lg border border-white/[0.22] bg-white/[0.04] px-5 py-[11px] text-[14px] font-semibold text-foreground transition-all hover:border-white/35">
              <Lock className="h-4 w-4" />
              Administrator Sign In
            </a>
          </div>
          <div className="mt-8">
            <p className="mb-4 text-[13px] text-muted-foreground">Trusted by forward-thinking logistics companies</p>
            <div className="flex flex-wrap items-center gap-5">
              <span className="text-[12px] font-black italic text-white/40">MIKANO</span>
              <span className="text-[12px] font-black text-white/40">DANGOTE</span>
              <span className="text-[11px] font-bold text-white/40">SIFAX GROUP</span>
              <span className="text-[11px] font-bold text-white/40">WAECORP</span>
              <span className="text-[12px] font-semibold text-white/40">ABC Logistics</span>
            </div>
          </div>
          <div className="mt-8">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Dashboard Mockup (coded, matches the approved design) ─────────────────── */
function DashboardMockup() {
  return (
    <div className="w-full overflow-hidden rounded-[14px] border border-white/[0.1] bg-[oklch(0.19_0.03_258)]" style={{ boxShadow: "0 0 0 1px oklch(1 0 0 / 0.04), 0 40px 100px -20px oklch(0 0 0 / 0.7), 0 8px 32px -8px oklch(0 0 0 / 0.5)" }}>
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[oklch(0.66_0.2_25)]" />
          <div className="h-3 w-3 rounded-full bg-warning" />
          <div className="h-3 w-3 rounded-full bg-success" />
        </div>
        <div className="ml-2 flex flex-1 items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5">
          <Search className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Search fleet, drivers, trips...</span>
        </div>
        <Bell className="h-3.5 w-3.5 text-muted-foreground" />
        <Settings className="h-3.5 w-3.5 text-muted-foreground" />
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">AO</div>
      </div>

      {/* Body: sidebar + content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-[150px] shrink-0 border-r border-white/[0.07] p-3 sm:block">
          <div className="mb-3 flex items-center gap-2 px-1">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary">
              <RouteIcon className="h-3 w-3 text-white" />
            </div>
            <span className="text-[10px] font-bold tracking-wide text-foreground">PRIMELEX LIS</span>
          </div>
          <div className="mb-2 px-2 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">Main</div>
          <ul className="flex flex-col gap-0.5">
            {[
              { icon: PieChart, label: "Dashboard", active: true },
              { icon: Truck, label: "Fleet" },
              { icon: Radio, label: "Dispatch" },
              { icon: MapPin, label: "Trips" },
              { icon: Fuel, label: "Fuel" },
              { icon: Wrench, label: "Maintenance" },
              { icon: ShieldCheck, label: "Safety" },
              { icon: BarChart3, label: "Reports" },
            ].map((item) => (
              <li key={item.label}>
                <div className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${item.active ? "bg-primary/15 text-primary" : "text-muted-foreground"}`}>
                  <item.icon className="h-3 w-3 shrink-0" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4">
          {/* Header row */}
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[12px] font-bold text-foreground">Operations Overview</div>
              <div className="text-[9px] text-muted-foreground">Welcome back, Ade · Real-time data</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-md border border-white/[0.1] px-2 py-1 text-[8px] font-medium text-muted-foreground">Last 30 days</div>
              <div className="rounded-md bg-primary px-2 py-1 text-[8px] font-semibold text-white">+ New Trip</div>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[
              { icon: Truck, label: "Active Vehicles", value: "248", delta: "+12", up: true, sub: "of 280 fleet" },
              { icon: Navigation, label: "Active Trips", value: "36", delta: "+5", up: true, sub: "in transit" },
              { icon: Fuel, label: "Fuel Cost", value: "₦4.2M", delta: "-8%", up: false, sub: "this month" },
              { icon: CircleDot, label: "On-time Rate", value: "94.2%", delta: "+2.1%", up: true, sub: "delivery SLA" },
            ].map((k) => (
              <div key={k.label} className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5">
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/12">
                    <k.icon className="h-3 w-3 text-primary" />
                  </div>
                  <span className={`flex items-center gap-0.5 text-[8px] font-semibold ${k.up ? "text-success" : "text-error"}`}>
                    {k.up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {k.delta}
                  </span>
                </div>
                <div className="text-[14px] font-bold text-foreground">{k.value}</div>
                <div className="text-[8px] text-muted-foreground">{k.label}</div>
                <div className="mt-0.5 text-[7px] text-muted-foreground/70">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart + side panel */}
          <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-3">
            {/* Bar chart card */}
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-3 lg:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[10px] font-semibold text-foreground">Fleet Performance — Weekly</div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[8px] text-muted-foreground"><span className="h-2 w-2 rounded-sm bg-primary" /> Utilization</span>
                  <span className="flex items-center gap-1 text-[8px] text-muted-foreground"><span className="h-2 w-2 rounded-sm bg-accent" /> Efficiency</span>
                </div>
              </div>
              <div className="flex h-[90px] items-end justify-between gap-1.5">
                {[
                  { d: "Mon", u: 62, e: 48 },
                  { d: "Tue", u: 78, e: 60 },
                  { d: "Wed", u: 70, e: 55 },
                  { d: "Thu", u: 88, e: 72 },
                  { d: "Fri", u: 95, e: 80 },
                  { d: "Sat", u: 68, e: 52 },
                  { d: "Sun", u: 54, e: 40 },
                ].map((b) => (
                  <div key={b.d} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex w-full items-end justify-center gap-0.5" style={{ height: 70 }}>
                      <div className="w-1/2 rounded-t-sm bg-primary/80" style={{ height: `${b.u}%` }} />
                      <div className="w-1/2 rounded-t-sm bg-accent/70" style={{ height: `${b.e}%` }} />
                    </div>
                    <span className="text-[7px] text-muted-foreground">{b.d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live fleet status */}
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-3">
              <div className="mb-2 text-[10px] font-semibold text-foreground">Live Fleet Status</div>
              <div className="flex flex-col gap-2">
                {[
                  { label: "In Transit", count: 142, pct: 57, color: "bg-primary" },
                  { label: "Idle", count: 61, pct: 25, color: "bg-warning" },
                  { label: "Maintenance", count: 28, pct: 11, color: "bg-error" },
                  { label: "Offline", count: 17, pct: 7, color: "bg-white/30" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="mb-0.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[9px] text-foreground"><span className={`h-1.5 w-1.5 rounded-full ${s.color}`} />{s.label}</span>
                      <span className="text-[9px] font-semibold text-foreground">{s.count}</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/[0.08]">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t border-white/[0.06] pt-2">
                <div className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">Maintenance Due</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[16px] font-bold text-warning">14</span>
                  <span className="text-[8px] text-muted-foreground">vehicles</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent trips table */}
          <div className="mt-2 rounded-lg border border-white/[0.07] bg-white/[0.025] p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-semibold text-foreground">Recent Trips</div>
              <span className="text-[8px] text-primary">View all →</span>
            </div>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[7px] uppercase tracking-wider text-muted-foreground">
                    <th className="pb-1.5 font-medium">Trip</th>
                    <th className="pb-1.5 font-medium">Vehicle</th>
                    <th className="pb-1.5 font-medium">Route</th>
                    <th className="pb-1.5 font-medium">Status</th>
                    <th className="hidden pb-1.5 font-medium sm:table-cell">ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "TRP-1042", veh: "LAG-421-XA", route: "Lagos → Abuja", status: "In Transit", eta: "2h 14m", color: "text-primary bg-primary/12" },
                    { id: "TRP-1041", veh: "LAG-318-KD", route: "Apapa → Kano", status: "Loading", eta: "—", color: "text-warning bg-warning/12" },
                    { id: "TRP-1040", veh: "LAG-205-AB", route: "Lagos → PH", status: "Delivered", eta: "Done", color: "text-success bg-success/12" },
                    { id: "TRP-1039", veh: "LAG-512-GH", route: "Ikeja → Ibadan", status: "Delayed", eta: "45m", color: "text-error bg-error/12" },
                  ].map((t) => (
                    <tr key={t.id} className="border-t border-white/[0.05]">
                      <td className="py-1.5 text-[9px] font-medium text-foreground">{t.id}</td>
                      <td className="py-1.5 text-[9px] text-muted-foreground">{t.veh}</td>
                      <td className="py-1.5 text-[9px] text-muted-foreground">{t.route}</td>
                      <td className="py-1.5"><span className={`rounded px-1.5 py-0.5 text-[8px] font-semibold ${t.color}`}>{t.status}</span></td>
                      <td className="hidden py-1.5 text-[9px] text-muted-foreground sm:table-cell">{t.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Modules ─────────────────────────────────────────────────────────────── */
function ModulesSection() {
  return (
    <section className="border-t border-white/[0.06] bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">One Platform. Complete Visibility.</div>
        <h2 className="text-center text-[1.85rem] font-bold leading-tight tracking-tight text-foreground lg:text-[2.1rem]">
          Everything You Need in One Intelligent Platform
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-muted-foreground">
          Power your operations with connected modules built for logistics.
        </p>
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {MODULES.map((m) => (
            <div key={m.label} className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-5 text-center transition-all hover:border-primary/30 hover:bg-white/[0.04]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <m.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="whitespace-pre-line text-[12px] font-medium leading-snug text-foreground/90">{m.label}</span>
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
        <div className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Drive Real Results</div>
        <h2 className="text-center text-[1.85rem] font-bold leading-tight tracking-tight text-foreground lg:text-[2.1rem]">
          Turn Operations into Competitive Advantage
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          LIS helps logistics companies reduce costs, improve efficiency and make smarter decisions every day.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all hover:border-primary/25 hover:bg-white/[0.04]">
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
      {/* Single horizontal strip — title | buttons | truck image */}
      <div
        className="relative flex min-h-[130px] items-center overflow-hidden"
        style={{ background: "linear-gradient(100deg, #0b1528 0%, #0d1e3a 45%, #101f3c 75%, #0a1626 100%)" }}
      >
        {/* Left: title + subtitle */}
        <div className="relative z-10 shrink-0 px-10 py-8 lg:w-[45%]">
          <h2 className="text-[1.45rem] font-bold leading-snug tracking-tight text-white lg:text-[1.55rem]">
            Ready to Modernize Your Logistics Operations?
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
            Create your organisation and start running your operations smarter, faster and more profitably.
          </p>
          {/* Buttons on mobile — stacked under text */}
          <div className="mt-5 flex flex-wrap gap-3 lg:hidden">
            <a href="#" className="inline-flex items-center gap-2 rounded-md bg-[#2563eb] px-5 py-[9px] text-[13px] font-semibold text-white transition-colors hover:bg-[#1d4ed8]">
              <User className="h-[15px] w-[15px]" />
              Create Organisation
            </a>
            <a href="#" className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/[0.05] px-5 py-[9px] text-[13px] font-semibold text-white transition-all hover:border-white/45 hover:bg-white/[0.09]">
              <Lock className="h-[15px] w-[15px]" />
              Administrator Sign In
            </a>
          </div>
        </div>

        {/* Centre: buttons on desktop */}
        <div className="relative z-10 hidden shrink-0 items-center gap-3 px-8 lg:flex">
          <a href="#" className="inline-flex items-center gap-2 rounded-md bg-[#2563eb] px-5 py-[9px] text-[13px] font-semibold text-white shadow-md shadow-blue-900/50 transition-colors hover:bg-[#1d4ed8]">
            <User className="h-[15px] w-[15px]" />
            Create Organisation
          </a>
          <a href="#" className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/[0.05] px-5 py-[9px] text-[13px] font-semibold text-white transition-all hover:border-white/45 hover:bg-white/[0.09]">
            <Lock className="h-[15px] w-[15px]" />
            Administrator Sign In
          </a>
        </div>

        {/* Right: truck image fading in from right edge */}
        <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[30%] lg:block">
          <img
            src="/truck.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-left"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 30%, black 60%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 30%, black 60%)",
            }}
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
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary" style={{ clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)" }}>
                <RouteIcon className="h-5 w-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-[13px] font-bold tracking-wide text-foreground">PRIMELEX</div>
                <div className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">TECHNOLOGIES</div>
              </div>
            </a>
            <p className="max-w-[200px] text-[12px] leading-relaxed text-muted-foreground">
              Building intelligent logistics software solutions that help businesses operate smarter and achieve more.
            </p>
            <div className="mt-1 flex items-center gap-3">
              {[Linkedin, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.1] text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground">
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <div className="text-[12px] font-semibold text-foreground">{col.heading}</div>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[12px] text-muted-foreground transition-colors hover:text-foreground">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <div className="text-[12px] font-semibold text-foreground">Support</div>
            <ul className="flex flex-col gap-2.5">
              <li className="flex items-start gap-2 text-[12px] text-muted-foreground"><span className="mt-px text-primary">✉</span>hello@primelextech.com</li>
              <li className="flex items-start gap-2 text-[12px] text-muted-foreground"><span className="mt-px text-primary">☎</span>+234 800 123 4567</li>
              <li className="flex items-start gap-2 text-[12px] text-muted-foreground"><span className="mt-px text-primary">🕐</span>Mon – Fri: 8:00 AM – 6:00 PM</li>
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
