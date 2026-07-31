import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Truck,
  Fuel,
  Route as RouteIcon,
  Wrench,
  ShieldCheck,
  BarChart3,
  PieChart,
  User,
  Lock,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  DollarSign,
  Shield,
  BrainCircuit,
  Radio,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { HeroSection } from "@/components/layout/HeroSection";

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
      <PublicHeader />
      <HeroSection />
      <ModulesSection />
      <BenefitsSection />
      <CtaSection />
      <SiteFooter />
    </div>
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
          LIS helps logistics companies reduce costs, improve efficiency and make smarter decisions every day.
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
          background:
            "linear-gradient(100deg, oklch(0.22 0.055 258) 0%, oklch(0.28 0.07 258) 50%, oklch(0.2 0.04 260) 100%)",
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
            Create your organisation and start running your operations smarter, faster and more profitably.
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
        <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[42%] lg:block">
          <img
            src="https://images.pexels.com/photos/1121123/pexels-photo-1121123.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-left"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, oklch(1 0 0) 35%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, oklch(1 0 0) 35%)",
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
              Building intelligent logistics software solutions that help businesses operate smarter and achieve more.
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
