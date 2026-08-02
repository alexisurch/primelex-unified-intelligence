import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Truck,
  Fuel,
  Route as RouteIcon,
  Wrench,
  ShieldCheck,
  BarChart3,
  PieChart,
  ChevronDown,
  User,
  Lock,
  DollarSign,
  Shield,
  BrainCircuit,
  Radio,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

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
  {
    icon: DollarSign,
    title: "Reduce Costs",
    description:
      "Identify inefficiencies and reduce fuel waste across your fleet.",
  },
  {
    icon: Truck,
    title: "Improve Efficiency",
    description:
      "Increase fleet utilization and optimize operational workflows.",
  },
  {
    icon: Shield,
    title: "Improve Safety",
    description: "Reduce incidents and ensure driver and asset safety.",
  },
  {
    icon: BrainCircuit,
    title: "Smarter Decisions",
    description: "Real-time data and AI-powered insights for better decision-making.",
  },
];

const TRUST_LOGOS = ["MIKANO", "DANGOTE", "SIFAX GROUP", "WAECORP", "ABC Logistics"];

const FOOTER_COLS = [
  {
    heading: "Product",
    links: ["Features", "Modules", "Integrations", "Security"],
  },
  {
    heading: "Solutions",
    links: ["Fleet Management", "Dispatch Management", "Fuel Management", "Operations Intelligence"],
  },
  {
    heading: "Resources",
    links: ["Documentation", "Help Center", "Blog", "API Reference"],
  },
  {
    heading: "Company",
    links: ["About Us", "Careers", "Partners", "Contact Us"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <ModulesSection />
      <BenefitsSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}

/* ── Navigation ─────────────────────────────────────────────────────────── */
function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[oklch(0.16_0.028_260)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-8 py-4">
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
          <div className="leading-none">
            <div className="text-[17px] font-black tracking-[0.06em] text-foreground">PRIMELEX</div>
            <div className="mt-0.5 text-[9px] font-medium tracking-[0.22em] text-muted-foreground">
              TECHNOLOGIES
            </div>
          </div>
        </Link>

        {/* Nav links — pushed to the right */}
        <nav className="ml-auto hidden items-center lg:flex">
          {NAV_LINKS.map((n) => (
            <button
              key={n.label}
              className="inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
              {n.dropdown && <ChevronDown className="h-[14px] w-[14px]" />}
            </button>
          ))}
        </nav>

        {/* Sign In button */}
        <Link
          to="/login"
          className="hidden shrink-0 items-center gap-2 rounded-lg border border-white/[0.22] bg-transparent px-5 py-2.5 text-[14px] font-medium text-foreground transition-all hover:border-white/40 hover:bg-white/[0.04] lg:inline-flex"
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
    <section className="relative overflow-hidden bg-[oklch(0.16_0.028_260)]">
      {/* Large blue radial glow — left side, matching the design */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 10% 50%, oklch(0.55 0.2 258 / 0.18) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-8 pb-10 pt-14">
        <div
          className="grid grid-cols-1 items-center gap-8 lg:gap-10"
          style={{ gridTemplateColumns: "1fr" }}
        >
          {/* ── Two-col layout on lg+ ── */}
          <div className="hidden lg:grid lg:grid-cols-[42%_58%] lg:items-center lg:gap-10">
            {/* Left column */}
            <div className="flex flex-col">
              {/* Badge */}
              <div className="mb-5 inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/[0.08] px-4 py-[6px] text-[11px] font-semibold uppercase tracking-[0.13em] text-primary/90">
                Logistics Intelligence System (LIS)
              </div>

              {/* Headline */}
              <h1 className="text-[3.4rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-foreground">
                The Operating System
                <br />
                for{" "}<span className="text-primary">Modern Logistics</span>
                <br />
                Companies
              </h1>

              {/* Sub-copy */}
              <p className="mt-5 max-w-[380px] text-[15px] leading-[1.65] text-muted-foreground">
                Manage your fleet, dispatch, trips, fuel, maintenance,
                routes and operations from one intelligent platform.
                Optimize performance. Reduce costs. Deliver more.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex items-center gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-[11px] text-[14px] font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
                >
                  <User className="h-4 w-4" />
                  Create Organisation
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/[0.22] bg-white/[0.04] px-6 py-[11px] text-[14px] font-semibold text-foreground transition-all hover:border-white/35 hover:bg-white/[0.07]"
                >
                  <Lock className="h-4 w-4" />
                  Administrator Sign In
                </Link>
              </div>

              {/* Trust strip */}
              <div className="mt-10">
                <p className="mb-4 text-[13px] text-muted-foreground">
                  Trusted by forward-thinking logistics companies
                </p>
                <div className="flex flex-wrap items-center gap-7">
                  <span className="text-[13px] font-black italic tracking-wide text-white/40">MIKANO</span>
                  <span className="text-[13px] font-black tracking-wide text-white/40">DANGOTE</span>
                  <span className="text-[12px] font-bold tracking-[0.08em] text-white/40">SIFAX GROUP</span>
                  <span className="text-[12px] font-bold tracking-[0.06em] text-white/40">WAECORP</span>
                  <span className="text-[13px] font-semibold tracking-wide text-white/40">ABC <span className="font-light">Logistics</span></span>
                </div>
              </div>
            </div>

            {/* Right column – dashboard screenshot */}
            <div className="flex items-center justify-end">
              <div
                className="w-full overflow-hidden rounded-[16px] border border-white/[0.1]"
                style={{
                  boxShadow:
                    "0 0 0 1px oklch(1 0 0 / 0.04), 0 40px 100px -20px oklch(0 0 0 / 0.7), 0 8px 32px -8px oklch(0 0 0 / 0.5)",
                }}
              >
                <img
                  src="/ChatGPT_Image_Jul_23,_2026,_06_26_39_PM.1.png"
                  alt="LIS Dashboard Preview"
                  className="block w-full"
                  loading="eager"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* ── Mobile/tablet single-column ── */}
          <div className="flex flex-col lg:hidden">
            <div className="mb-5 inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/[0.08] px-4 py-[6px] text-[11px] font-semibold uppercase tracking-[0.13em] text-primary/90">
              Logistics Intelligence System (LIS)
            </div>
            <h1 className="text-[2.4rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-foreground">
              The Operating System
              <br />
              for{" "}<span className="text-primary">Modern Logistics</span>
              <br />
              Companies
            </h1>
            <p className="mt-5 text-[15px] leading-[1.65] text-muted-foreground">
              Manage your fleet, dispatch, trips, fuel, maintenance,
              routes and operations from one intelligent platform.
              Optimize performance. Reduce costs. Deliver more.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-[11px] text-[14px] font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
              >
                <User className="h-4 w-4" />
                Create Organisation
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.22] bg-white/[0.04] px-5 py-[11px] text-[14px] font-semibold text-foreground transition-all hover:border-white/35"
              >
                <Lock className="h-4 w-4" />
                Administrator Sign In
              </Link>
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
            <div className="mt-8 overflow-hidden rounded-[14px] border border-white/[0.1]" style={{ boxShadow: "0 24px 60px -12px oklch(0 0 0 / 0.6)" }}>
              <img src="/ChatGPT_Image_Jul_23,_2026,_06_26_39_PM.1.png" alt="LIS Dashboard" className="block w-full" loading="eager" />
            </div>
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
        {/* Eyebrow */}
        <div className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          One Platform. Complete Visibility.
        </div>
        <h2 className="text-center text-[1.85rem] font-bold leading-tight tracking-tight text-foreground lg:text-[2.1rem]">
          Everything You Need in One Intelligent Platform
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-muted-foreground">
          Power your operations with connected modules built for logistics.
        </p>

        {/* Module grid – 4 cols × 2 rows */}
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
    <section className="border-t border-white/[0.06] bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Eyebrow */}
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

        {/* 4-column benefit cards */}
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
              <p className="text-[13px] leading-relaxed text-white/50">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA Banner ──────────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="mx-6 my-12 overflow-hidden rounded-2xl lg:mx-auto lg:max-w-7xl">
      <div
        className="relative flex min-h-[220px] items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(100deg, oklch(0.22 0.055 258) 0%, oklch(0.28 0.07 258) 50%, oklch(0.2 0.04 260) 100%)",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,oklch(1 0 0) 0 1px,transparent 1px 40px),repeating-linear-gradient(90deg,oklch(1 0 0) 0 1px,transparent 1px 40px)",
          }}
        />

        {/* Text + buttons */}
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
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
            >
              <User className="h-4 w-4" />
              Create Organisation
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-md border border-white/[0.2] bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-white/30 hover:bg-white/[0.1]"
            >
              <Lock className="h-4 w-4" />
              Administrator Sign In
            </Link>
          </div>
        </div>

        {/* Truck image */}
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
      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-7">
          {/* Brand column – takes 2 of 7 */}
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
                <div className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  TECHNOLOGIES
                </div>
              </div>
            </Link>
            <p className="max-w-[200px] text-[12px] leading-relaxed text-muted-foreground">
              Building intelligent logistics software solutions that help
              businesses operate smarter and achieve more.
            </p>
            {/* Social */}
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
                    <a
                      href="#"
                      className="text-[12px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Support column */}
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

      {/* Copyright bar */}
      <div className="border-t border-white/[0.05] py-4 text-center text-[11px] text-muted-foreground">
        © 2025 PrimeLex Technologies. All rights reserved.
      </div>
    </footer>
  );
}
