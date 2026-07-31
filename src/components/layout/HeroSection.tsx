import { Link } from "@tanstack/react-router";
import { Lock, User } from "lucide-react";
import { DashboardShowcase } from "./DashboardShowcase";

const TRUST_LOGOS: { label: string; style?: string }[] = [
  { label: "MIKANO", style: "font-black italic tracking-wide text-[14px]" },
  { label: "DANGOTE", style: "font-black tracking-wide text-[14px]" },
  { label: "SIFAX GROUP", style: "font-bold tracking-[0.08em] text-[13px]" },
  { label: "WAECORP", style: "font-bold tracking-[0.06em] text-[13px]" },
  { label: "ABC", style: "text-[14px] font-semibold" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.16_0.028_260)]">
      {/* Subtle full-bleed radial — left glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 75% at 10% 50%, oklch(0.50 0.22 258 / 0.15) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[760px] max-w-[1400px] flex-col justify-center px-10 py-24 lg:min-h-[820px]">
        {/* ── Desktop two-column ── */}
        <div className="hidden lg:grid lg:grid-cols-[45%_55%] lg:items-center lg:gap-16">
          <HeroContent />
          <DashboardShowcase />
        </div>

        {/* ── Mobile / tablet stacked ── */}
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

/* ── Sub-components ──────────────────────────────────────────────────────── */

function ProductBadge() {
  return (
    <div className="inline-flex w-fit items-center rounded-full border border-primary/50 bg-primary/[0.07] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
      Logistics Intelligence System (LIS)
    </div>
  );
}

function HeroContent() {
  return (
    <div className="flex flex-col">
      <ProductBadge />

      <h1 className="mt-8 text-[4rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
        The Operating System
        <br />
        for <span className="text-primary">Modern Logistics</span>
        <br />
        Companies
      </h1>

      <p className="mt-7 max-w-[400px] text-[16px] leading-[1.75] text-white/55">
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
    <div className="mt-12 flex items-center gap-4">
      <Link
        to="/register"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-[14px] text-[15px] font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
      >
        <User className="h-[16px] w-[16px]" />
        Create Organisation
      </Link>
      <Link
        to="/login"
        className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-7 py-[14px] text-[15px] font-semibold text-white/90 transition-all hover:border-white/30 hover:bg-white/[0.07]"
      >
        <Lock className="h-[16px] w-[16px]" />
        Administrator Sign In
      </Link>
    </div>
  );
}

function TrustedCompanies() {
  return (
    <div className="mt-14">
      <p className="mb-6 text-[13px] font-normal text-white/40">
        Trusted by forward-thinking logistics companies
      </p>
      <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
        {TRUST_LOGOS.map((logo) => (
          <span key={logo.label} className={`whitespace-nowrap text-white/30 ${logo.style}`}>
            {logo.label}
            {logo.label === "ABC" && <span className="font-light"> Logistics</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
