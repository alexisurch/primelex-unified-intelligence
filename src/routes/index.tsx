import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, Fuel, Route as RouteIcon, Wrench, ShieldCheck, ChartBar as BarChart3, ChartPie as PieChart, ChevronDown, User, Lock, Linkedin, Twitter, Facebook, Youtube, DollarSign, Shield, BrainCircuit, Radio } from "lucide-react";
import ctaTruck from "../assets/cta-truck.png";

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
    <section className="relative bg-[#060c1a]" style={{ overflow: "hidden" }}>

      {/* Left blue glow — matches approved design warm left-centre bloom */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-[60%]"
        style={{
          background:
            "radial-gradient(ellipse 75% 80% at -5% 52%, rgba(26,86,219,0.32) 0%, rgba(26,86,219,0.08) 45%, transparent 70%)",
        }}
      />
      {/* Right blue glow behind dashboard */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-[55%]"
        style={{
          background:
            "radial-gradient(ellipse 65% 75% at 85% 40%, rgba(26,86,219,0.20) 0%, transparent 60%)",
        }}
      />
      {/* Edge vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 45%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      {/* Subtle dot-grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Two-column flex container */}
      <div className="relative z-10 mx-auto flex max-w-[1280px] items-start px-8 pt-[72px] pb-0 lg:gap-8">

        {/* ── Left column ≈44% ── */}
        <div className="flex w-full shrink-0 flex-col pb-16 lg:w-[44%]">

          {/* Badge */}
          <div className="mb-5 inline-flex w-fit items-center rounded-full border border-[#1a56db]/55 bg-[#1a56db]/[0.08] px-[14px] py-[6px] text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#60a5fa]">
            Logistics Intelligence System (LIS)
          </div>

          {/* Headline — 3 locked lines */}
          <h1
            className="font-extrabold leading-[1.05] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(2.4rem, 3.4vw, 3.5rem)" }}
          >
            <span style={{ whiteSpace: "nowrap" }}>The Operating System</span>
            <br />
            for{" "}
            <span className="text-[#3b82f6]">Modern Logistics</span>
            <br />
            Companies
          </h1>

          {/* Description */}
          <p className="mt-6 text-[15.5px] leading-[1.72] text-white/50" style={{ maxWidth: "430px" }}>
            Manage your fleet, dispatch, trips, fuel, maintenance,
            routes and operations from one intelligent platform.
            Optimize performance. Reduce costs. Deliver more.
          </p>

          {/* CTA buttons */}
          <div className="mt-9 flex flex-wrap items-center gap-[14px]">
            <Link
              to="/register"
              className="inline-flex items-center gap-[9px] rounded-lg bg-[#1a56db] px-8 py-[14px] text-[15px] font-semibold text-white shadow-xl shadow-[#1a56db]/25 transition-all hover:bg-[#1d4ed8]"
            >
              <User className="h-[16px] w-[16px]" />
              Create Organisation
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-[9px] rounded-lg border border-white/25 bg-transparent px-8 py-[14px] text-[15px] font-semibold text-white transition-all hover:border-white/40 hover:bg-white/[0.05]"
            >
              <Lock className="h-[16px] w-[16px]" />
              Administrator Sign In
            </Link>
          </div>

          {/* Trusted strip */}
          <div className="mt-11">
            <p className="mb-4 text-[11.5px] text-white/35">
              Trusted by forward-thinking logistics companies
            </p>
            <div className="flex flex-nowrap items-center gap-6 whitespace-nowrap">
              <span className="text-[13px] font-black italic tracking-wide text-white/35">MIKANO</span>
              <span className="text-[12.5px] font-black tracking-wide text-white/35">DANGOTE</span>
              <span className="text-[12px] font-bold tracking-[0.04em] text-white/35">SIFAX GROUP</span>
              <span className="text-[12px] font-bold tracking-[0.04em] text-white/35">WAECORP</span>
              <span className="text-[13px] font-semibold tracking-wide text-white/35">
                ABC <span className="font-light">Logistics</span>
              </span>
            </div>
          </div>

        </div>

        {/* ── Right column ≈56% — dashboard showcase ── */}
        <div
          className="relative hidden flex-1 lg:block"
          style={{ marginTop: "18px", marginRight: "-56px", perspective: "1600px" }}
        >
          <div
            style={{
              transform: "rotateY(-7deg) rotateX(2deg) rotate(1.5deg) scale(1.1)",
              transformOrigin: "left center",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1.5px solid rgba(59,130,246,0.40)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.06)," +
                "0 50px 120px -20px rgba(0,0,0,0.90)," +
                "0 0 100px -10px rgba(26,86,219,0.38)," +
                "0 0 40px 0 rgba(59,130,246,0.18)",
            }}
          >
            <img
              src="/dashboard-preview.png"
              alt="LIS platform dashboard overview"
              className="block w-full"
              style={{ display: "block", width: "100%" }}
              draggable={false}
            />
          </div>
        </div>


        {/* Mobile fallback */}
        <div className="mt-10 block w-full lg:hidden">
          <div
            style={{
              borderRadius: "14px",
              overflow: "hidden",
              border: "1px solid rgba(59,130,246,0.30)",
              boxShadow: "0 20px 60px -10px rgba(0,0,0,0.8), 0 0 40px rgba(26,86,219,0.2)",
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
    <section className="px-8 py-14">
      <div className="mx-auto max-w-[1280px]">
        <div
          className="relative isolate flex items-center overflow-hidden rounded-[22px] border border-white/[0.08]"
          style={{
            background:
              "linear-gradient(105deg, #081326 0%, #0b1c3f 45%, #0d2350 72%, #081428 100%)",
            boxShadow:
              "0 24px 70px -24px rgba(0,0,0,0.7), 0 0 50px -14px rgba(26,86,219,0.22), inset 0 1px 0 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* soft blue lighting */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 60% 120% at 78% 55%, rgba(29,96,232,0.30) 0%, transparent 62%), radial-gradient(ellipse 55% 100% at 8% 40%, rgba(26,86,219,0.14) 0%, transparent 65%)",
            }}
          />

          {/* Truck illustration — flush right, blended into the background */}
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-0 hidden w-[52%] select-none lg:block">
            <img
              src={ctaTruck}
              alt=""
              width={1024}
              height={640}
              loading="lazy"
              draggable={false}
              className="absolute bottom-0 right-[-3%] h-[116%] w-auto max-w-none object-contain"
              style={{
                filter: "brightness(0.6) saturate(0.7) contrast(1.05)",
                maskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 16%, rgba(0,0,0,0.9) 38%, #000 55%), linear-gradient(to top, transparent 0%, rgba(0,0,0,0.6) 10%, #000 26%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 16%, rgba(0,0,0,0.9) 38%, #000 55%), linear-gradient(to top, transparent 0%, rgba(0,0,0,0.6) 10%, #000 26%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
            />
          </div>


          {/* Left content ≈62% */}
          <div className="relative z-10 flex w-full flex-col justify-center px-8 py-10 sm:px-12 lg:w-[62%] lg:px-14 lg:py-11">
            <h2 className="text-[1.6rem] font-bold leading-[1.2] tracking-tight text-white sm:text-[1.75rem]">
              Ready to Modernize Your Logistics Operations?
            </h2>
            <p className="mt-3 max-w-[400px] text-[14px] leading-[1.65] text-white/55">
              Create your organisation and start running your operations
              smarter, faster and more profitably.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-[14px]">
              <Link
                to="/register"
                className="inline-flex items-center gap-[9px] rounded-lg bg-[#1a56db] px-8 py-[14px] text-[15px] font-semibold text-white shadow-xl shadow-[#1a56db]/25 transition-all hover:bg-[#1d4ed8]"
              >
                <User className="h-[16px] w-[16px]" />
                Create Organisation
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-[9px] rounded-lg border border-white/25 bg-transparent px-8 py-[14px] text-[15px] font-semibold text-white transition-all hover:border-white/40 hover:bg-white/[0.05]"
              >
                <Lock className="h-[16px] w-[16px]" />
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
