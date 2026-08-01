import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, Fuel, Route as RouteIcon, Wrench, ShieldCheck, ChartBar as BarChart3, ChartPie as PieChart, ChevronDown, User, Lock, Linkedin, Twitter, Facebook, Youtube, DollarSign, Shield, BrainCircuit, Radio } from "lucide-react";

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
    <div className="min-h-screen bg-[#060c1a] text-foreground">
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
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#060c1a]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center px-8" style={{ height: "84px" }}>
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="relative h-[46px] w-[46px] shrink-0">
            <div
              className="absolute inset-0 bg-[#1a56db]"
              style={{ clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)", borderRadius: "4px" }}
            />
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              <RouteIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="leading-[1.15]">
            <div className="text-[18px] font-black tracking-[0.06em] text-white">PRIMELEX</div>
            <div className="text-[10px] font-medium tracking-[0.24em] text-white/45">TECHNOLOGIES</div>
          </div>
        </Link>

        {/* Nav links — perfectly centred */}
        <nav className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((n) => (
            <button
              key={n.label}
              className="inline-flex items-center gap-[5px] rounded-md px-5 py-2.5 text-[15px] font-medium text-white/75 transition-colors hover:text-white"
            >
              {n.label}
              {n.dropdown && <ChevronDown className="h-[13px] w-[13px] text-white/50" />}
            </button>
          ))}
        </nav>

        {/* Sign In */}
        <Link
          to="/login"
          className="hidden shrink-0 items-center gap-2 rounded-lg border border-white/[0.22] bg-transparent px-6 py-3 text-[14.5px] font-semibold text-white transition-all hover:border-white/40 hover:bg-white/[0.05] lg:inline-flex"
        >
          <User className="h-[15px] w-[15px]" />
          Sign In
        </Link>
      </div>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[#060c1a]"
      style={{ minHeight: "800px" }}
    >
      {/* Left blue glow */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-3/5"
        style={{
          background:
            "radial-gradient(ellipse 70% 85% at -8% 50%, rgba(26,86,219,0.30) 0%, transparent 60%)",
        }}
      />
      {/* Right subtle blue glow behind dashboard */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 80% 45%, rgba(26,86,219,0.18) 0%, transparent 65%)",
        }}
      />
      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Dot-grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[1280px] items-start gap-12 px-8 pt-16 pb-10 lg:pt-20">
        {/* ── Left column ≈45% ── */}
        <div className="flex w-full flex-col lg:w-[45%] lg:shrink-0">
          {/* Badge */}
          <div className="mb-6 inline-flex w-fit items-center rounded-full border border-[#1a56db]/60 bg-[#1a56db]/[0.1] px-4 py-[5px] text-[11px] font-semibold uppercase tracking-[0.15em] text-[#60a5fa]">
            Logistics Intelligence System (LIS)
          </div>

          {/* Headline */}
          <h1 className="text-[3.7rem] font-extrabold leading-[1.06] tracking-[-0.025em] text-white lg:text-[4.1rem]">
            The Operating System
            <br />
            for{" "}
            <span className="text-[#3b82f6]">Modern Logistics</span>
            <br />
            Companies
          </h1>

          {/* Sub-copy */}
          <p className="mt-7 max-w-[460px] text-[16px] leading-[1.7] text-white/50">
            Manage your fleet, dispatch, trips, fuel, maintenance,
            routes and operations from one intelligent platform.
            Optimize performance. Reduce costs. Deliver more.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2.5 rounded-lg bg-[#1a56db] px-8 py-4 text-[15.5px] font-semibold text-white shadow-xl shadow-[#1a56db]/30 transition-all hover:bg-[#1e4fc2]"
            >
              <User className="h-[17px] w-[17px]" />
              Create Organisation
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 rounded-lg border border-white/[0.22] bg-transparent px-8 py-4 text-[15.5px] font-semibold text-white transition-all hover:border-white/35 hover:bg-white/[0.05]"
            >
              <Lock className="h-[17px] w-[17px]" />
              Administrator Sign In
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mt-16">
            <p className="mb-6 text-[13px] text-white/35">
              Trusted by forward-thinking logistics companies
            </p>
            <div className="flex flex-wrap items-center gap-10">
              <span className="text-[18px] font-black italic tracking-wide text-white/45">MIKANO</span>
              <span className="text-[17px] font-black tracking-wide text-white/45">DANGOTE</span>
              <span className="text-[16px] font-bold tracking-[0.05em] text-white/45">SIFAX GROUP</span>
              <span className="text-[16px] font-bold tracking-[0.05em] text-white/45">WAECORP</span>
              <span className="text-[18px] font-semibold tracking-wide text-white/45">
                ABC <span className="font-light">Logistics</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Right column ≈55% — dashboard screenshot ── */}
        <div className="hidden flex-1 items-start justify-end lg:flex" style={{ paddingTop: "4px" }}>
          <div
            className="relative w-full max-w-[740px] overflow-hidden rounded-[20px]"
            style={{
              border: "1.5px solid rgba(59,130,246,0.35)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.06), 0 40px 100px -15px rgba(0,0,0,0.85), 0 0 90px 0 rgba(26,86,219,0.28)",
              transform: "rotate(2deg)",
            }}
          >
            <img
              src="/dashboard-preview.png"
              alt="LIS platform dashboard overview"
              className="block w-full"
              draggable={false}
            />
          </div>
        </div>

        {/* Mobile: image below text */}
        <div className="mt-10 block w-full lg:hidden">
          <div className="overflow-hidden rounded-xl" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 20px 60px -10px rgba(0,0,0,0.8)" }}>
            <img
              src="/dashboard-preview.png"
              alt="LIS platform dashboard overview"
              className="block w-full"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Modules ─────────────────────────────────────────────────────────────── */
function ModulesSection() {
  return (
    <section className="border-t border-white/[0.06] bg-[#07101f] py-20">
      <div className="mx-auto max-w-[1280px] px-8">
        <div className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3b82f6]">
          One Platform. Complete Visibility.
        </div>
        <h2 className="text-center text-[2rem] font-bold leading-tight tracking-tight text-white lg:text-[2.25rem]">
          Everything You Need in One Intelligent Platform
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-[14px] leading-relaxed text-white/50">
          Power your operations with connected modules built for logistics.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {MODULES.map((m) => (
            <div
              key={m.label}
              className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-6 text-center transition-all hover:border-[#3b82f6]/40 hover:bg-white/[0.045]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1a56db]/25 bg-[#1a56db]/[0.12]">
                <m.icon className="h-6 w-6 text-[#3b82f6]" />
              </div>
              <span className="whitespace-pre-line text-[12px] font-medium leading-snug text-white/85">
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
    <section className="border-t border-white/[0.06] bg-[#060c1a] py-20">
      <div className="mx-auto max-w-[1280px] px-8">
        <div className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3b82f6]">
          Drive Real Results
        </div>
        <h2 className="text-center text-[2rem] font-bold leading-tight tracking-tight text-white lg:text-[2.25rem]">
          Turn Operations into Competitive Advantage
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[14px] leading-relaxed text-white/50">
          LIS helps logistics companies reduce costs, improve efficiency and
          make smarter decisions every day.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all hover:border-[#3b82f6]/30 hover:bg-white/[0.04]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#1a56db]/25 bg-[#1a56db]/[0.12]">
                <b.icon className="h-5 w-5 text-[#3b82f6]" />
              </div>
              <h3 className="text-[15px] font-semibold text-white">{b.title}</h3>
              <p className="text-[13px] leading-relaxed text-white/50">{b.description}</p>
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
    <section className="px-8 py-12">
      <div className="mx-auto max-w-[1280px]">
        <div
          className="relative flex min-h-[240px] items-center overflow-hidden rounded-2xl"
          style={{
            background:
              "linear-gradient(110deg, #0d1f4a 0%, #102060 50%, #0a1535 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 40px),repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 40px)",
            }}
          />
          <div className="relative z-10 flex-1 px-12 py-10">
            <h2 className="max-w-sm text-[1.85rem] font-bold leading-tight tracking-tight text-white">
              Ready to Modernize Your Logistics Operations?
            </h2>
            <p className="mt-2.5 max-w-xs text-[13.5px] leading-relaxed text-white/55">
              Create your organisation and start running your operations
              smarter, faster and more profitably.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1a56db] px-6 py-3 text-[14px] font-semibold text-white shadow-lg shadow-[#1a56db]/30 hover:bg-[#1e4fc2]"
              >
                <User className="h-4 w-4" />
                Create Organisation
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.2] bg-white/[0.06] px-6 py-3 text-[14px] font-semibold text-white hover:border-white/30 hover:bg-white/[0.1]"
              >
                <Lock className="h-4 w-4" />
                Administrator Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#07101f]">
      <div className="mx-auto max-w-[1280px] px-8 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-7">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center bg-[#1a56db]"
                style={{ clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)" }}
              >
                <RouteIcon className="h-4 w-4 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-[13px] font-bold tracking-wide text-white">PRIMELEX</div>
                <div className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/40">TECHNOLOGIES</div>
              </div>
            </Link>
            <p className="max-w-[200px] text-[12px] leading-relaxed text-white/45">
              Building intelligent logistics software solutions that help
              businesses operate smarter and achieve more.
            </p>
            <div className="mt-1 flex items-center gap-3">
              {[Linkedin, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.1] text-white/40 transition-colors hover:border-white/25 hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <div className="text-[12px] font-semibold text-white">{col.heading}</div>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[12px] text-white/45 transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Support */}
          <div className="flex flex-col gap-3">
            <div className="text-[12px] font-semibold text-white">Support</div>
            <ul className="flex flex-col gap-2.5">
              <li className="text-[12px] text-white/45">hello@primelextech.com</li>
              <li className="text-[12px] text-white/45">+234 800 123 4567</li>
              <li className="text-[12px] text-white/45">Mon – Fri: 8:00 AM – 6:00 PM</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05] py-4 text-center text-[11px] text-white/30">
        © 2025 PrimeLex Technologies. All rights reserved.
      </div>
    </footer>
  );
}
