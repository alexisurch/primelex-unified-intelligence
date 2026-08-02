import { createFileRoute } from "@tanstack/react-router";
import {
  Truck,
  Fuel,
  Route as RouteIcon,
  Wrench,
  ShieldCheck,
  ChartBar as BarChart3,
  ChartPie as PieChart,
  Radio,
  FileText,
  Users,
  Building2,
  Gauge,
  BrainCircuit,
  Lock,
  Cloud,
  Plug,
  ScrollText,
} from "lucide-react";
import {
  PublicPage,
  CTASection,
  Badge,
  PrimaryButton,
  SecondaryButton,
  SectionHeading,
  Container,
  FeatureCard,
} from "../components/public/PublicShared";

export const Route = createFileRoute("/product")({
  component: ProductPage,
});

const MODULE_CARDS = [
  {
    icon: Truck,
    name: "Fleet Operations",
    description: "Track every truck, driver and assignment in one unified registry.",
  },
  {
    icon: Radio,
    name: "Dispatch Center",
    description: "Plan, assign and monitor live trips and deliveries in real time.",
  },
  {
    icon: BarChart3,
    name: "Trips & Deliveries",
    description: "Full visibility into trip status, delivery progress and outcomes.",
  },
  {
    icon: Fuel,
    name: "Fuel Intelligence",
    description: "Measure fuel performance across fleet, trucks, drivers and routes.",
  },
  {
    icon: RouteIcon,
    name: "Route Intelligence",
    description: "Profile routes with preferred trucks, drivers and health scoring.",
  },
  {
    icon: Wrench,
    name: "Maintenance Intelligence",
    description: "Monitor truck health, repair history and predictive maintenance.",
  },
  {
    icon: ShieldCheck,
    name: "Safety & Incidents",
    description: "Log, track and analyse incidents to improve driver safety.",
  },
  {
    icon: PieChart,
    name: "Executive Dashboard",
    description: "KPI scorecards and operations health for leadership.",
  },
  {
    icon: FileText,
    name: "Reports & Analytics",
    description: "Generate operational and executive reports across every module.",
  },
  {
    icon: ScrollText,
    name: "Audit Trail",
    description: "Immutable records of every action across the platform.",
  },
  {
    icon: Users,
    name: "Users & Access",
    description: "Role-based permissions and team management for your workspace.",
  },
  {
    icon: Building2,
    name: "Organisation Management",
    description: "Multi-tenant workspaces with secure isolation per company.",
  },
];

const FUEL_METRICS = [
  { label: "Fleet Average L/km", value: "3.8", note: "Across all active trucks" },
  { label: "Truck Average L/km", value: "3.6", note: "Per-vehicle breakdown" },
  { label: "Driver Average L/km", value: "4.1", note: "Per-driver performance" },
  { label: "Route Average L/km", value: "3.9", note: "Per-route efficiency" },
];

const FUEL_FEATURES = [
  "Fuel Trends",
  "Fuel Assignments",
  "Estimated Fuel Cost Impact",
  "AI Fuel Insights",
];

const ROUTE_FEATURES = [
  "Route Profiles",
  "Preferred Trucks",
  "Preferred Drivers",
  "Route Health",
  "Fuel Summary",
  "Maintenance Summary",
  "Incident History",
  "Operational Intelligence",
];

const MAINTENANCE_FEATURES = [
  "Truck Health Score",
  "Maintenance Spend",
  "Mean Time Between Repairs",
  "Downtime",
  "Repair History",
  "Predictive Maintenance",
];

const EXEC_KPIS = [
  {
    icon: Gauge,
    name: "Operations Health Index",
    description: "A single score summarising the health of your entire operation.",
  },
  {
    icon: Truck,
    name: "Fleet Utilisation",
    description: "Measure how effectively your fleet is being used over time.",
  },
  {
    icon: Fuel,
    name: "Fuel Performance",
    description: "Track fuel efficiency and cost impact across the fleet.",
  },
  {
    icon: Wrench,
    name: "Maintenance Performance",
    description: "Monitor repair cycles, downtime and maintenance spend.",
  },
  {
    icon: BarChart3,
    name: "Operational Reviews",
    description: "Periodic reviews of performance across every module.",
  },
  {
    icon: BrainCircuit,
    name: "AI Insights",
    description: "AI-generated recommendations tailored to your operations.",
  },
  {
    icon: FileText,
    name: "Executive Reports",
    description: "Board-ready reports summarising operational performance.",
  },
];

const SECURITY_ITEMS = [
  {
    icon: Lock,
    title: "Role-Based Permissions",
    description: "Granular access control over every module and action.",
  },
  {
    icon: Building2,
    title: "Organisation Workspaces",
    description: "Secure multi-tenant isolation per company.",
  },
  { icon: Lock, title: "Encrypted Data", description: "Data encrypted in transit and at rest." },
  {
    icon: ScrollText,
    title: "Audit Trail",
    description: "Immutable record of every action across the platform.",
  },
  {
    icon: Cloud,
    title: "Secure Cloud Platform",
    description: "Hosted on enterprise-grade cloud infrastructure.",
  },
  {
    icon: Plug,
    title: "Future-Ready Integrations",
    description: "Designed to connect with GPS, telematics and more.",
  },
];

function ProductPage() {
  return (
    <PublicPage>
      <ProductHero />
      <PlatformOverview />
      <FuelIntelligence />
      <RouteIntelligence />
      <MaintenanceIntelligence />
      <ExecutiveIntelligence />
      <Security />
      <CTASection />
    </PublicPage>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function ProductHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-[60%]"
        style={{
          background:
            "radial-gradient(ellipse 75% 80% at -5% 52%, rgba(26,86,219,0.32) 0%, rgba(26,86,219,0.08) 45%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <Container>
        <div className="relative z-10 mx-auto max-w-2xl py-24 text-center">
          <Badge>Product</Badge>
          <h1
            className="font-extrabold leading-[1.05] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(2.2rem, 3.2vw, 3.25rem)" }}
          >
            The Operating System
            <br />
            for <span className="text-[#3b82f6]">Modern Logistics</span> Companies
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-[1.72] text-white/50">
            LIS unifies fleet operations, dispatch, maintenance, fuel intelligence, route
            intelligence, reporting and operational AI into one intelligent platform.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-[14px]">
            <PrimaryButton to="/register">Create Organisation</PrimaryButton>
            <SecondaryButton to="/login">Administrator Sign In</SecondaryButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Platform Overview ────────────────────────────────────────────────────── */
function PlatformOverview() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Platform Overview"
          title="One Connected Platform"
          description="LIS brings every logistics function into a single intelligent system — no more disconnected tools."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULE_CARDS.map((m) => (
            <FeatureCard key={m.name} icon={m.icon} name={m.name} description={m.description} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Fuel Intelligence ────────────────────────────────────────────────────── */
function FuelIntelligence() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Fuel Intelligence"
          title="Measure Fuel Performance at Every Level"
          description="Track fuel efficiency across your fleet, individual trucks, drivers and routes — with AI insights that flag waste before it grows."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {FUEL_METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all hover:border-[#3b82f6]/30"
            >
              <div className="text-[12px] text-white/45">{m.label}</div>
              <div className="mt-2 text-[2rem] font-bold text-white">{m.value}</div>
              <div className="mt-1 text-[11px] text-white/40">{m.note}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {FUEL_FEATURES.map((f) => (
            <div
              key={f}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-4"
            >
              <Fuel className="h-4 w-4 shrink-0 text-[#3b82f6]" />
              <span className="text-[13px] font-medium text-white/80">{f}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Route Intelligence ──────────────────────────────────────────────────── */
function RouteIntelligence() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Route Intelligence"
          title="Know Your Routes Inside Out"
          description="Build route profiles with preferred trucks, drivers, health scores and full operational context."
        />
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROUTE_FEATURES.map((f) => (
            <div
              key={f}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-4 transition-all hover:border-[#3b82f6]/30"
            >
              <RouteIcon className="h-4 w-4 shrink-0 text-[#3b82f6]" />
              <span className="text-[13px] font-medium text-white/80">{f}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Maintenance Intelligence ────────────────────────────────────────────── */
function MaintenanceIntelligence() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Maintenance Intelligence"
          title="Keep Every Truck on the Road"
          description="Monitor truck health, repair cycles and downtime — with predictive maintenance that flags issues early."
        />
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MAINTENANCE_FEATURES.map((f) => (
            <div
              key={f}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-4 transition-all hover:border-[#3b82f6]/30"
            >
              <Wrench className="h-4 w-4 shrink-0 text-[#3b82f6]" />
              <span className="text-[13px] font-medium text-white/80">{f}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Executive Intelligence ──────────────────────────────────────────────── */
function ExecutiveIntelligence() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Executive Intelligence"
          title="KPIs That Tell the Full Story"
          description="Beautiful KPI cards that give leadership a clear, real-time view of operational performance."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXEC_KPIS.map((k) => (
            <FeatureCard key={k.name} icon={k.icon} name={k.name} description={k.description} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Security ────────────────────────────────────────────────────────────── */
function Security() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Security"
          title="Enterprise-Grade Security by Design"
          description="Built for organisations that take data protection and access control seriously."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECURITY_ITEMS.map((s) => (
            <FeatureCard key={s.title} icon={s.icon} name={s.title} description={s.description} />
          ))}
        </div>
      </Container>
    </section>
  );
}
