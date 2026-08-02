import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Truck,
  Fuel,
  Route as RouteIcon,
  Wrench,
  ShieldCheck,
  ChartBar as BarChart3,
  ChartPie as PieChart,
  User,
  Lock,
  DollarSign,
  Shield,
  BrainCircuit,
  Radio,
} from "lucide-react";
import { CTASection, PublicFooter, PublicHeader } from "../components/public/PublicShared";

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
    description: "Identify inefficiencies and reduce fuel waste across your fleet.",
  },
  {
    icon: Truck,
    title: "Improve Efficiency",
    description: "Increase fleet utilization and optimize operational workflows.",
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

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />
      <Hero />
      <ModulesSection />
      <BenefitsSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "oklch(0.105 0.034 260)" }}>
      {/* Left-side radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 70% at 8% 50%, oklch(0.50 0.22 258 / 0.18) 0%, transparent 68%)",
        }}
      />

      {/* Centre radial — very subtle lift */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 50%, oklch(0.50 0.22 258 / 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Very subtle dot-grid texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div
        className="relative mx-auto max-w-[1400px] px-10"
        style={{ paddingTop: "118px", paddingBottom: "0px" }}
      >
        {/* ── Desktop two-column ── */}
        <div className="hidden lg:grid lg:grid-cols-[43%_57%] lg:items-start lg:gap-8">
          {/* Left column */}
          <div className="flex flex-col pt-0">
            {/* Badge */}
            <div className="inline-flex w-fit items-center rounded-full border border-primary/50 bg-primary/[0.08] px-4 py-[7px] text-[12px] font-semibold uppercase tracking-[0.06em] text-primary">
              Logistics Intelligence System (LIS)
            </div>

            {/* Headline */}
            <h1
              className="mt-6 font-extrabold leading-[1.04] tracking-[-0.035em] text-foreground"
              style={{ fontSize: "clamp(2.7rem, 3.55vw, 3.95rem)" }}
            >
              <span className="block whitespace-nowrap">The Operating System</span>
              <span className="block">
                for{" "}
                <span
                  className="text-primary"
                  style={{ textShadow: "0 0 48px oklch(0.60 0.22 258 / 0.45)" }}
                >
                  Modern Logistics
                </span>
              </span>
              <span className="block">Companies</span>
            </h1>

            {/* Sub-copy */}
            <p className="mt-5 max-w-[480px] text-[16px] leading-[1.55] text-muted-foreground">
              Manage your fleet, dispatch, trips, fuel, maintenance,
              <br />
              routes and operations from one intelligent platform.
              <br />
              Optimize performance. Reduce costs. Deliver more.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex items-center gap-5">
              <Link
                to="/register"
                className="inline-flex items-center gap-[9px] rounded-[5px] bg-primary px-7 py-[15px] text-[15px] font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
              >
                <User className="h-[16px] w-[16px]" />
                Create Organisation
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-[9px] rounded-[5px] border border-primary/65 bg-white/[0.02] px-7 py-[15px] text-[15px] font-semibold text-foreground transition-all hover:border-white/35 hover:bg-white/[0.07]"
              >
                <Lock className="h-[16px] w-[16px]" />
                Administrator Sign In
              </Link>
            </div>

            {/* Trust strip */}
            <p className="mt-6 text-[13px] font-normal text-white/40">
              Trusted by forward-thinking logistics companies
            </p>
          </div>

          {/* Right column – dashboard screenshot */}
          <div className="relative flex items-start justify-end lg:h-[430px]">
            {/* Blue glow behind the frame */}
            <div
              className="pointer-events-none absolute right-[-18px] top-[2%] h-[92%] w-[96%]"
              style={{
                background:
                  "radial-gradient(ellipse 70% 65% at 58% 48%, oklch(0.50 0.22 258 / 0.38) 0%, transparent 70%)",
                filter: "blur(56px)",
              }}
            />
            {/* Premium product frame */}
            <div
              className="relative mt-[-10px] w-[100%] overflow-hidden rounded-[20px] border border-primary/45 bg-[oklch(0.13_0.025_258)]"
              style={{
                boxShadow:
                  "0 0 0 1px oklch(1 0 0 / 0.06), 0 48px 110px -32px oklch(0 0 0 / 0.82), 0 18px 44px -18px oklch(0 0 0 / 0.66), 0 0 80px -28px oklch(0.50 0.22 258 / 0.48)",
                transform: "none",
              }}
            >
              <img
                src="/dashboard-screenshot.png"
                alt="PrimeLex Logistics Intelligence System dashboard"
                className="block w-full select-none lg:max-h-[430px] lg:object-cover lg:object-top"
                draggable={false}
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* ── Mobile/tablet single-column ── */}
        <div className="flex flex-col lg:hidden">
          <div className="inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/[0.08] px-4 py-[6px] text-[11px] font-semibold uppercase tracking-[0.13em] text-primary/90">
            Logistics Intelligence System (LIS)
          </div>
          <h1 className="mt-5 text-[2.4rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-foreground">
            <span className="block whitespace-nowrap">The Operating System</span>
            <span className="block">
              for <span className="text-primary">Modern Logistics</span>
            </span>
            <span className="block">Companies</span>
          </h1>
          <p className="mt-5 text-[15px] leading-[1.65] text-muted-foreground">
            Manage your fleet, dispatch, trips, fuel, maintenance, routes and operations from one
            intelligent platform. Optimize performance. Reduce costs. Deliver more.
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
          <p className="mt-5 text-[13px] text-muted-foreground">
            Trusted by forward-thinking logistics companies
          </p>
          <div
            className="mt-8 overflow-hidden rounded-[14px] border border-white/[0.1]"
            style={{ boxShadow: "0 24px 60px -12px oklch(0 0 0 / 0.6)" }}
          >
            <img
              src="/dashboard-screenshot.png"
              alt="LIS Dashboard"
              className="block w-full"
              loading="eager"
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
          LIS helps logistics companies reduce costs, improve efficiency and make smarter decisions
          every day.
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
              <p className="text-[13px] leading-relaxed text-white/50">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
