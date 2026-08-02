import { Link } from "@tanstack/react-router";
import { Lock, User } from "lucide-react";
import { DashboardShowcase } from "./DashboardShowcase";

const TRUST_LOGOS: { label: string; style?: string; sub?: string }[] = [
  { label: "MIKANO", style: "font-black italic tracking-wide text-[15px]" },
  { label: "DANGOTE", style: "font-black tracking-wide text-[15px]" },
  { label: "SIFAX GROUP", style: "font-bold tracking-[0.08em] text-[14px]" },
  { label: "WAECORP", style: "font-bold tracking-[0.07em] text-[14px]" },
  { label: "ABC", style: "text-[15px] font-semibold", sub: "Logistics" },
];

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "oklch(0.155 0.028 260)" }}
    >
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

      {/* Bottom vignette */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, oklch(0.13 0.025 258 / 0.5))",
        }}
      />

      {/* Very subtle dot-grid texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div
        className="relative mx-auto max-w-[1400px] px-10"
        style={{ minHeight: "820px", paddingTop: "72px", paddingBottom: "72px" }}
      >
        {/* ── Desktop two-column ── */}
        <div className="hidden lg:grid lg:grid-cols-[44%_56%] lg:items-start lg:gap-12">
          <HeroContent />
          <DashboardShowcase />
        </div>

        {/* ── Mobile stacked ── */}
        <div className="flex flex-col lg:hidden">
          <HeroContent />
          <div className="mt-12">
            <DashboardShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductBadge() {
  return (
    <div className="inline-flex w-fit items-center rounded-full border border-primary/50 bg-primary/[0.08] px-5 py-[9px] text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
      Logistics Intelligence System (LIS)
    </div>
  );
}

function HeroContent() {
  return (
    <div className="flex flex-col pt-4">
      <ProductBadge />

      <h1
        className="mt-6 font-extrabold leading-[1.04] tracking-[-0.035em] text-white"
        style={{ fontSize: "clamp(2.6rem, 4.2vw, 4.2rem)" }}
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

      <p className="mt-7 max-w-[480px] text-[15.5px] leading-[1.8] text-white/55">
        Manage your fleet, dispatch, trips, fuel, maintenance,
        <br />
        routes and operations from one intelligent platform.
        <br />
        Optimize performance. Reduce costs. Deliver more.
      </p>

      <HeroActions />
      <TrustedCompanies />
    </div>
  );
}

function HeroActions() {
  return (
    <div className="mt-11 flex items-center gap-5">
      <Link
        to="/register"
        className="inline-flex items-center gap-[9px] rounded-lg bg-primary px-9 py-[15px] text-[15px] font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
      >
        <User className="h-[16px] w-[16px]" />
        Create Organisation
      </Link>
      <Link
        to="/login"
        className="inline-flex items-center gap-[9px] rounded-lg border border-white/22 bg-white/[0.04] px-9 py-[15px] text-[15px] font-semibold text-white/90 transition-all hover:border-white/35 hover:bg-white/[0.07]"
      >
        <Lock className="h-[16px] w-[16px]" />
        Administrator Sign In
      </Link>
    </div>
  );
}

function TrustedCompanies() {
  return (
    <div className="mt-16">
      <p className="mb-7 text-[13px] font-normal text-white/40">
        Trusted by forward-thinking logistics companies
      </p>
      <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
        {TRUST_LOGOS.map((logo) => (
          <span
            key={logo.label}
            className={`whitespace-nowrap text-white/30 ${logo.style ?? ""}`}
          >
            {logo.label}
            {logo.sub && <span className="font-light"> {logo.sub}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
