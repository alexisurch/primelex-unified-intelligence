import { createFileRoute } from "@tanstack/react-router";
import {
  Lightbulb,
  Target,
  Eye,
  Compass,
  Sparkles,
  Gauge,
  Shield,
  HeartHandshake,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import {
  PublicPage,
  CTASection,
  Badge,
  SectionHeading,
  Container,
  FeatureCard,
} from "../components/public/PublicShared";

export const Route = createFileRoute("/company")({
  component: CompanyPage,
});

const VALUES = [
  {
    icon: Lightbulb,
    name: "Innovation",
    description: "We build software that thinks ahead, so operators don't have to catch up.",
  },
  {
    icon: Gauge,
    name: "Operational Excellence",
    description: "We hold ourselves to the same standard of precision we build for our customers.",
  },
  {
    icon: Sparkles,
    name: "Intelligence",
    description: "Every feature is designed to turn raw data into decisions.",
  },
  {
    icon: Shield,
    name: "Reliability",
    description: "Our platform is built to be dependable when operations depend on it.",
  },
  {
    icon: HeartHandshake,
    name: "Customer Success",
    description: "We succeed only when our customers' operations run smoother.",
  },
];

function CompanyPage() {
  return (
    <PublicPage>
      <CompanyHero />
      <AboutSection />
      <MissionVision />
      <Philosophy />
      <Values />
      <Contact />
      <CTASection />
    </PublicPage>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function CompanyHero() {
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
          <Badge>Company</Badge>
          <h1
            className="font-extrabold leading-[1.05] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(2.2rem, 3.2vw, 3.25rem)" }}
          >
            Building the Operating System
            <br />
            for <span className="text-[#3b82f6]">Modern Logistics</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-[1.72] text-white/50">
            PrimeLex Technologies builds intelligent software that helps logistics companies operate
            smarter, faster and more profitably.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ── About ───────────────────────────────────────────────────────────────── */
function AboutSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="About PrimeLex Technologies"
            title="About PrimeLex Technologies"
            description="We are a technology company focused on building intelligent software for the logistics industry."
            align="left"
          />
          <div className="mt-8 space-y-5 text-[15px] leading-[1.8] text-white/55">
            <p>
              Logistics companies operate in a world of disconnected tools — spreadsheets for fuel,
              paper for dispatch, separate apps for maintenance, and reports that arrive too late to
              act on.
            </p>
            <p>
              We built LIS to replace that fragmentation with a single, intelligent platform. One
              place to manage fleet, dispatch, fuel, maintenance, routes, safety and reporting —
              with operational AI that turns data into decisions.
            </p>
            <p>
              Our mission is simple: give logistics companies an operating system, not just another
              app.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Mission & Vision ────────────────────────────────────────────────────── */
function MissionVision() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#1a56db]/25 bg-[#1a56db]/[0.12]">
              <Target className="h-5 w-5 text-[#3b82f6]" />
            </div>
            <h3 className="text-[18px] font-bold text-white">Our Mission</h3>
            <p className="mt-3 text-[14px] leading-[1.75] text-white/55">
              To give logistics companies a single intelligent platform that unifies every part of
              their operation — so they can reduce costs, improve efficiency and make smarter
              decisions every day.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#1a56db]/25 bg-[#1a56db]/[0.12]">
              <Eye className="h-5 w-5 text-[#3b82f6]" />
            </div>
            <h3 className="text-[18px] font-bold text-white">Our Vision</h3>
            <p className="mt-3 text-[14px] leading-[1.75] text-white/55">
              A world where every logistics company operates from one source of truth — where data,
              decisions and action are connected in real time, and no operation is limited by
              disconnected software.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Philosophy ──────────────────────────────────────────────────────────── */
function Philosophy() {
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#1a56db]/25 bg-[#1a56db]/[0.12]">
              <Compass className="h-5 w-5 text-[#3b82f6]" />
            </div>
          </div>
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3b82f6]">
            Why we built LIS
          </div>
          <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-white">
            Our Philosophy
          </h2>
          <blockquote className="mx-auto mt-6 max-w-2xl text-[1.5rem] font-medium leading-[1.45] text-white/85">
            "We believe logistics companies deserve an operating system, not disconnected software."
          </blockquote>
        </div>
      </Container>
    </section>
  );
}

/* ── Values ──────────────────────────────────────────────────────────────── */
function Values() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Core Values"
          title="What We Stand For"
          description="The principles that guide how we build, ship and support our platform."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v) => (
            <FeatureCard key={v.name} icon={v.icon} name={v.name} description={v.description} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Contact ─────────────────────────────────────────────────────────────── */
function Contact() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Get in Touch"
          description="Have a question or want to learn more about LIS? We'd love to hear from you."
        />
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <ContactRow icon={Mail} label="Email" value="hello@primelextech.com" />
            <ContactRow icon={Phone} label="Phone" value="+234 800 123 4567" />
            <ContactRow icon={MapPin} label="Location" value="Lagos, Nigeria" />
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder:text-white/30 focus:border-[#3b82f6] focus:outline-none"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder:text-white/30 focus:border-[#3b82f6] focus:outline-none"
                />
              </Field>
            </div>
            <Field label="Message">
              <textarea
                rows={4}
                placeholder="Tell us how we can help..."
                className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder:text-white/30 focus:border-[#3b82f6] focus:outline-none"
              />
            </Field>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1a56db] px-6 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#1d4ed8]"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1a56db]/25 bg-[#1a56db]/[0.12]">
        <Icon className="h-5 w-5 text-[#3b82f6]" />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-white/40">{label}</div>
        <div className="text-[15px] font-medium text-white">{value}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12px] font-medium text-white/60">{label}</span>
      {children}
    </label>
  );
}
