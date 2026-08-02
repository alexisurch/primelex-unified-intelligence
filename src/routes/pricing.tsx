import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Fuel,
  Wrench,
  Truck,
  Clock,
  Eye,
  Zap,
  Check,
  ChevronDown,
} from "lucide-react";
import {
  PublicPage,
  CTASection,
  Badge,
  PrimaryButton,
  SectionHeading,
  Container,
} from "../components/public/PublicShared";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const PRICING_FEATURES = [
  "Fleet Operations",
  "Dispatch Center",
  "Fuel Intelligence",
  "Route Intelligence",
  "Maintenance Intelligence",
  "Safety & Incidents",
  "Executive Dashboard",
  "Reports & Analytics",
  "Operational AI Insights",
  "Unlimited Users",
  "Unlimited Reports",
  "Unlimited Roles",
  "Organisation Workspace",
  "Secure Cloud Platform",
];

const PRICING_EXAMPLES = [
  { trucks: "20 Trucks", price: "₦100,000", period: "/month" },
  { trucks: "50 Trucks", price: "₦250,000", period: "/month" },
  { trucks: "100 Trucks", price: "₦500,000", period: "/month" },
  { trucks: "250 Trucks", price: "₦1,250,000", period: "/month" },
  { trucks: "500 Trucks", price: "₦2,500,000", period: "/month" },
];

const ROI_CARDS = [
  { icon: Fuel, title: "Reduce Fuel Waste", description: "Identify inefficiencies and cut fuel costs across your fleet." },
  { icon: Wrench, title: "Reduce Downtime", description: "Predictive maintenance keeps trucks on the road longer." },
  { icon: Truck, title: "Improve Fleet Utilisation", description: "Maximise the value of every truck in your fleet." },
  { icon: Clock, title: "Save Staff Time", description: "Automate manual workflows and free up your team." },
  { icon: Eye, title: "Improve Operational Visibility", description: "One source of truth across every module and team." },
  { icon: Zap, title: "Accelerate Decision Making", description: "Real-time data and AI insights for faster, better decisions." },
];

const FAQS = [
  {
    q: "How are active trucks calculated?",
    a: "An active truck is any truck currently registered in your fleet. You only pay for trucks that are part of your operation in a given month.",
  },
  {
    q: "Can we remove inactive trucks?",
    a: "Yes. You can deactivate trucks at any time, and you will not be billed for them the following month.",
  },
  {
    q: "Can we add trucks later?",
    a: "Absolutely. Add trucks whenever your fleet grows — your subscription simply adjusts on the next billing cycle.",
  },
  {
    q: "Are updates included?",
    a: "Yes. All platform updates, improvements and new modules are included at no additional cost.",
  },
  {
    q: "Is AI included?",
    a: "Yes. Operational AI insights are included for every organisation, with no additional fees or usage limits.",
  },
  {
    q: "Do you support GPS integrations?",
    a: "LIS is designed to integrate with GPS and telematics providers. Contact us to discuss your specific integration needs.",
  },
  {
    q: "How long does implementation take?",
    a: "Most organisations are up and running within a few days. Larger fleets may take slightly longer depending on data volume.",
  },
];

function PricingPage() {
  return (
    <PublicPage>
      <PricingHero />
      <PricingCard />
      <PricingExamples />
      <ROISection />
      <FAQ />
      <CTASection />
    </PublicPage>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function PricingHero() {
  return (
    <section className="relative overflow-hidden bg-[#060c1a]">
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
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <Container>
        <div className="relative z-10 mx-auto max-w-2xl py-24 text-center">
          <Badge>Pricing</Badge>
          <h1
            className="font-extrabold leading-[1.05] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(2.2rem, 3.2vw, 3.25rem)" }}
          >
            Simple Pricing Built
            <br />
            Around Your <span className="text-[#3b82f6]">Fleet</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-[1.72] text-white/50">
            One predictable monthly subscription based on your active trucks.
            No hidden fees. Unlimited users. Unlimited AI insights. Unlimited
            modules.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ── Pricing Card ────────────────────────────────────────────────────────── */
function PricingCard() {
  return (
    <section className="border-t border-white/[0.06] bg-[#07101f] py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div
            className="relative overflow-hidden rounded-[22px] border border-white/[0.08] p-10 lg:p-14"
            style={{
              background:
                "linear-gradient(110deg, #0c1c46 0%, #0f2156 50%, #0a1430 100%)",
              boxShadow:
                "0 30px 80px -20px rgba(0,0,0,0.6), 0 0 60px -10px rgba(26,86,219,0.25), inset 0 0 120px 0 rgba(26,86,219,0.08)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 100% at 20% 50%, rgba(26,86,219,0.22) 0%, transparent 65%)",
              }}
            />
            <div className="relative z-10 text-center">
              <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#3b82f6]">
                LIS Platform
              </div>
              <div className="mt-4 flex items-end justify-center gap-2">
                <span className="text-[4rem] font-extrabold leading-none text-white">
                  ₦5,000
                </span>
              </div>
              <div className="mt-2 text-[15px] text-white/55">
                Per Active Truck / Month
              </div>

              <div className="mx-auto mt-10 grid max-w-xl grid-cols-1 gap-3 text-left sm:grid-cols-2">
                {PRICING_FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a56db]/20">
                      <Check className="h-3 w-3 text-[#3b82f6]" />
                    </div>
                    <span className="text-[13.5px] text-white/75">{f}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                <PrimaryButton to="/register">Create Organisation</PrimaryButton>
              </div>

              <p className="mt-5 text-[12.5px] text-white/40">
                Pay only for active trucks. No feature limits. No hidden charges.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Pricing Examples ────────────────────────────────────────────────────── */
function PricingExamples() {
  return (
    <section className="border-t border-white/[0.06] bg-[#060c1a] py-20">
      <Container>
        <SectionHeading
          eyebrow="Pricing Examples"
          title="What Would It Cost Your Fleet?"
          description="A few examples based on common fleet sizes."
        />
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PRICING_EXAMPLES.map((ex) => (
            <div
              key={ex.trucks}
              className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-6 text-center transition-all hover:border-[#3b82f6]/30 hover:bg-white/[0.04]"
            >
              <div className="text-[14px] font-semibold text-white">{ex.trucks}</div>
              <div className="mt-3 text-[1.5rem] font-bold text-white">{ex.price}</div>
              <div className="text-[12px] text-white/45">{ex.period}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── ROI ────────────────────────────────────────────────────────────────── */
function ROISection() {
  return (
    <section className="border-t border-white/[0.06] bg-[#07101f] py-20">
      <Container>
        <SectionHeading
          eyebrow="ROI"
          title="Why Companies Choose LIS"
          description="LIS is designed to deliver business outcomes — not just features."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ROI_CARDS.map((c) => (
            <div
              key={c.title}
              className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all hover:border-[#3b82f6]/30 hover:bg-white/[0.04]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#1a56db]/25 bg-[#1a56db]/[0.12]">
                <c.icon className="h-5 w-5 text-[#3b82f6]" />
              </div>
              <h3 className="text-[15px] font-semibold text-white">{c.title}</h3>
              <p className="text-[13px] leading-relaxed text-white/50">{c.description}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div
            className="rounded-2xl border border-[#1a56db]/30 p-8 text-center"
            style={{ background: "rgba(26,86,219,0.06)" }}
          >
            <p className="text-[1.25rem] font-semibold leading-snug text-white">
              "LIS is designed to protect significantly more value than it costs."
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────────────── */
function FAQ() {
  return (
    <section className="border-t border-white/[0.06] bg-[#060c1a] py-20">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Everything you need to know about how LIS pricing works."
        />
        <div className="mx-auto mt-12 max-w-2xl flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-white">{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white/50 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-[13.5px] leading-relaxed text-white/55">
          {a}
        </div>
      )}
    </div>
  );
}
