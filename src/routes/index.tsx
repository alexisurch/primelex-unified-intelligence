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
import {
  PublicHeader,
  PublicFooter,
  CTASection,
  Badge,
  PrimaryButton,
  SecondaryButton,
  SectionHeading,
  Container,
} from "../components/public/PublicShared";

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
    description:
      "Real-time data and AI-powered insights for better decision-making.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060c1a] text-foreground">
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
    <section className="relative bg-[#060c1a]" style={{ overflow: "hidden" }}>
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-[60%]"
        style={{
          background:
            "radial-gradient(ellipse 75% 80% at -5% 52%, rgba(26,86,219,0.32) 0%, rgba(26,86,219,0.08) 45%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-[55%]"
        style={{
          background:
            "radial-gradient(ellipse 65% 75% at 85% 40%, rgba(26,86,219,0.20) 0%, transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 45%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[1280px] items-start px-8 pb-16 pt-[60px] lg:gap-10">
        <div className="flex w-full shrink-0 flex-col lg:w-[44%]">
          <Badge>Logistics Intelligence System (LIS)</Badge>
          <h1
            className="font-extrabold leading-[1.05] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(2.4rem, 3.4vw, 3.5rem)" }}
          >
            <span style={{ whiteSpace: "nowrap" }}>The Operating System</span>
            <br />
            for <span className="text-[#3b82f6]">Modern Logistics</span>
            <br />
            Companies
          </h1>
          <p
            className="mt-6 text-[15.5px] leading-[1.72] text-white/50"
            style={{ maxWidth: "430px" }}
          >
            Manage your fleet, dispatch, trips, fuel, maintenance, routes and
            operations from one intelligent platform. Optimize performance.
            Reduce costs. Deliver more.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-[14px]">
            <PrimaryButton to="/register">Create Organisation</PrimaryButton>
            <SecondaryButton to="/login">Administrator Sign In</SecondaryButton>
          </div>
        </div>

        <div
          className="relative hidden flex-1 lg:block"
          style={{ marginTop: "18px", marginRight: "0px", perspective: "1600px" }}
        >
          <div
            style={{
              transform: "rotateY(-5deg) rotateX(1.5deg) rotate(1.5deg)",
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

        <div className="mt-10 block w-full lg:hidden">
          <div
            style={{
              borderRadius: "14px",
              overflow: "hidden",
              border: "1px solid rgba(59,130,246,0.30)",
              boxShadow:
                "0 20px 60px -10px rgba(0,0,0,0.8), 0 0 40px rgba(26,86,219,0.2)",
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
      <Container>
        <SectionHeading
          eyebrow="One Platform. Complete Visibility."
          title="Everything You Need in One Intelligent Platform"
          description="Power your operations with connected modules built for logistics."
        />
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
      </Container>
    </section>
  );
}

/* ── Benefits ────────────────────────────────────────────────────────────── */
function BenefitsSection() {
  return (
    <section className="border-t border-white/[0.06] bg-[#060c1a] py-20">
      <Container>
        <SectionHeading
          eyebrow="Drive Real Results"
          title="Turn Operations into Competitive Advantage"
          description="LIS helps logistics companies reduce costs, improve efficiency and make smarter decisions every day."
        />
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
      </Container>
    </section>
  );
}
