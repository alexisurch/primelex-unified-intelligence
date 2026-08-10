import { Link } from "@tanstack/react-router";
import { Lock, User } from "lucide-react";
import { DashboardShowcase } from "./DashboardShowcase";

const TRUST_LOGOS: { label: string; style?: string; sub?: string }[] = [
  { label: "MIKANO", style: "font-black italic tracking-tight text-[23px]" },
  { label: "DANGOTE", style: "font-black tracking-wide text-[16px]" },
  { label: "SIFAX", style: "font-black tracking-tight text-[23px]", sub: "GROUP" },
  { label: "WAECORP", style: "font-bold tracking-[0.08em] text-[16px]", sub: "LIMITED" },
  { label: "ABC", style: "text-[27px] font-semibold", sub: "Logistics" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[oklch(0.105_0.035_260)] pt-[92px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_75%_at_8%_42%,oklch(0.48_0.22_258/0.2),transparent_68%),radial-gradient(ellipse_60%_55%_at_74%_48%,oklch(0.45_0.2_258/0.16),transparent_67%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,oklch(0.075_0.028_260/0.9),transparent_45%,oklch(0.075_0.028_260/0.55))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-92px)] max-w-[1400px] items-center px-6 py-10 sm:px-10 lg:grid-cols-[42%_58%] lg:px-12 lg:py-8">
        <HeroContent />
        <div className="mt-12 lg:mt-0">
          <DashboardShowcase />
        </div>
      </div>
    </section>
  );
}

function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col lg:-mt-8">
      <div className="inline-flex w-fit items-center rounded-full border border-primary/70 bg-primary/[0.07] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-primary shadow-[0_0_28px_oklch(0.55_0.22_258/0.16)]">
        Logistics Intelligence System (LIS)
      </div>

      <h1 className="mt-6 max-w-[620px] text-[clamp(2.8rem,4.1vw,4.95rem)] font-extrabold leading-[1.16] tracking-[-0.045em] text-white">
        <span className="block">ALL -IN-ONE System</span>
        <span className="block">
          for{" "}
          <span className="text-primary drop-shadow-[0_0_35px_oklch(0.60_0.22_258/0.45)]">
            Modern Logistics
          </span>
        </span>
        <span className="block">Companies</span>
      </h1>

      <p className="mt-5 max-w-[520px] text-[18px] leading-[1.55] text-white/70">
        Manage your fleet, dispatch, trips, fuel, maintenance, routes and operations from one
        intelligent platform. Optimize performance. Reduce costs. Deliver more.
      </p>

      <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link
          to="/register"
          className="inline-flex items-center justify-center gap-3 rounded-[5px] bg-primary px-7 py-4 text-[15px] font-semibold text-white shadow-[0_14px_40px_oklch(0.55_0.22_258/0.32)] transition-all hover:bg-primary/90"
        >
          <User className="h-5 w-5" /> Create Organisation
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-3 rounded-[5px] border border-primary/70 bg-white/[0.015] px-7 py-4 text-[15px] font-semibold text-white transition-all hover:bg-primary/10"
        >
          <Lock className="h-5 w-5" /> Administrator Sign In
        </Link>
      </div>

      <div className="mt-14">
        <p className="mb-6 text-[13px] text-white/45">
          Trusted by forward-thinking logistics companies
        </p>
        <div className="flex flex-wrap items-end gap-x-9 gap-y-4">
          {TRUST_LOGOS.map((logo) => (
            <span key={logo.label} className={`leading-none text-white/38 ${logo.style ?? ""}`}>
              {logo.label}
              {logo.sub && (
                <span className="ml-1 text-[11px] font-semibold tracking-wide text-white/34">
                  {logo.sub}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
