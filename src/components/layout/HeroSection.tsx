import { Link } from "@tanstack/react-router";
import { Lock, User } from "lucide-react";
import { DashboardPreview } from "./DashboardPreview";

const TRUST_LOGOS: { label: string; style?: string }[] = [
  { label: "MIKANO", style: "font-black italic tracking-wide text-[13px]" },
  { label: "DANGOTE", style: "font-black tracking-wide text-[13px]" },
  { label: "SIFAX GROUP", style: "font-bold tracking-[0.08em] text-[12px]" },
  { label: "WAECORP", style: "font-bold tracking-[0.06em] text-[12px]" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.16_0.028_260)]">
      {/* Subtle left radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 52% 70% at 8% 52%, oklch(0.5 0.22 258 / 0.16) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-10 pb-12 pt-16">
        {/* ── Desktop two-column ── */}
        <div className="hidden lg:grid lg:grid-cols-[45%_55%] lg:items-center lg:gap-12">
          {/* Left */}
          <div className="flex flex-col">
            {/* Badge */}
            <div className="mb-6 inline-flex w-fit items-center rounded-full border border-primary/50 bg-primary/[0.07] px-4 py-[7px] text-[10.5px] font-semibold uppercase tracking-[0.15em] text-primary">
              Logistics Intelligence System (LIS)
            </div>

            {/* Headline */}
            <h1 className="text-[3.6rem] font-extrabold leading-[1.08] tracking-[-0.025em] text-white">
              The Operating System
              <br />
              for{" "}
              <span className="text-primary">Modern Logistics</span>
              <br />
              Companies
            </h1>

            {/* Sub-copy */}
            <p className="mt-6 max-w-[370px] text-[15px] leading-[1.7] text-white/55">
              Manage your fleet, dispatch, trips, fuel, maintenance,
              <br />
              routes and operations from one intelligent platform.
              <br />
              Optimize performance. Reduce costs. Deliver more.
            </p>

            {/* CTA buttons */}
            <div className="mt-9 flex items-center gap-[14px]">
              <Link
                to="/register"
                className="inline-flex items-center gap-[9px] rounded-lg bg-primary px-6 py-[12px] text-[14px] font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
              >
                <User className="h-[15px] w-[15px]" />
                Create Organisation
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-[9px] rounded-lg border border-white/20 bg-white/[0.04] px-6 py-[12px] text-[14px] font-semibold text-white/90 transition-all hover:border-white/30 hover:bg-white/[0.07]"
              >
                <Lock className="h-[15px] w-[15px]" />
                Administrator Sign In
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-11">
              <p className="mb-5 text-[12.5px] font-normal text-white/40">
                Trusted by forward-thinking logistics companies
              </p>
              <div className="flex items-center gap-8">
                {TRUST_LOGOS.map((logo) => (
                  <span key={logo.label} className={`text-white/30 ${logo.style}`}>
                    {logo.label}
                  </span>
                ))}
                <span className="text-[13px] font-semibold tracking-wide text-white/30">
                  ABC{" "}
                  <span className="font-light">Logistics</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right — dashboard frame */}
          <div className="relative flex items-center justify-end">
            {/* Blue glow behind */}
            <div
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
              style={{
                width: "90%",
                height: "90%",
                background:
                  "radial-gradient(ellipse 70% 60% at 55% 50%, oklch(0.48 0.22 258 / 0.24) 0%, transparent 70%)",
                filter: "blur(36px)",
              }}
            />
            {/* Dashboard */}
            <div className="relative w-full">
              <DashboardPreview />
            </div>
          </div>
        </div>

        {/* ── Mobile / tablet stacked ── */}
        <div className="flex flex-col lg:hidden">
          <div className="mb-5 inline-flex w-fit items-center rounded-full border border-primary/50 bg-primary/[0.07] px-4 py-[7px] text-[10.5px] font-semibold uppercase tracking-[0.15em] text-primary">
            Logistics Intelligence System (LIS)
          </div>
          <h1 className="text-[2.4rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
            The Operating System
            <br />
            for{" "}
            <span className="text-primary">Modern Logistics</span>
            <br />
            Companies
          </h1>
          <p className="mt-5 text-[15px] leading-[1.7] text-white/55">
            Manage your fleet, dispatch, trips, fuel, maintenance, routes and
            operations from one intelligent platform. Optimize performance.
            Reduce costs. Deliver more.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-[12px] text-[14px] font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
            >
              <User className="h-[15px] w-[15px]" />
              Create Organisation
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-5 py-[12px] text-[14px] font-semibold text-white/90 transition-all hover:border-white/30"
            >
              <Lock className="h-[15px] w-[15px]" />
              Administrator Sign In
            </Link>
          </div>
          <div className="mt-9">
            <p className="mb-4 text-[12.5px] text-white/40">
              Trusted by forward-thinking logistics companies
            </p>
            <div className="flex flex-wrap items-center gap-5">
              {TRUST_LOGOS.map((logo) => (
                <span key={logo.label} className={`text-white/30 ${logo.style}`}>
                  {logo.label}
                </span>
              ))}
              <span className="text-[12px] font-semibold text-white/30">
                ABC <span className="font-light">Logistics</span>
              </span>
            </div>
          </div>
          <div className="mt-8 overflow-hidden rounded-[14px]">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
