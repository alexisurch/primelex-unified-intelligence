import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, SectionCard } from "@/components/shared/Cards";
import { TrendingUp, Clock, Package, Fuel, TrendingDown, TriangleAlert as AlertTriangle, ShieldCheck, Activity, CircleCheck as CheckCircle2, Gauge, Wrench, CalendarClock } from "lucide-react";

export const Route = createFileRoute("/organisation/$orgSlug/_workspace/kpi-scorecard")({
  component: KPIScorecard,
});

const departments = [
  {
    name: "Operations",
    desc: "Trip throughput and delivery reliability.",
    kpis: [
      { label: "On-Time Delivery",  value: "92.3%", tone: "warning" as const, icon: CheckCircle2,  delta: { value: "3.2%", direction: "down" as const }, footnote: "Target 95%" },
      { label: "Active Deliveries", value: "142",   tone: "success" as const, icon: Package,        delta: { value: "+12",  direction: "up"   as const }, footnote: "Target 130" },
      { label: "Delayed Trips",     value: "18",    tone: "danger"  as const, icon: Clock,          delta: { value: "-6",   direction: "down" as const }, footnote: "Target < 12" },
    ],
  },
  {
    name: "Fuel",
    desc: "Consumption efficiency and spend.",
    kpis: [
      { label: "Avg Fuel Efficiency",   value: "3.8 km/L", tone: "danger"  as const, icon: Fuel,         delta: { value: "-0.4", direction: "down" as const }, footnote: "Target 4.2 km/L" },
      { label: "Monthly Fuel Cost",     value: "₦640M",    tone: "success" as const, icon: TrendingDown,  delta: { value: "-6.7%",direction: "down" as const }, footnote: "Target ₦680M" },
      { label: "Fuel Theft Incidents",  value: "2",        tone: "warning" as const, icon: AlertTriangle, delta: { value: "+1",   direction: "up"   as const }, footnote: "Target 0" },
    ],
  },
  {
    name: "Safety",
    desc: "Incident rates and compliance.",
    kpis: [
      { label: "Incident Rate",    value: "1.4", tone: "warning" as const, icon: ShieldCheck,   delta: { value: "-0.3", direction: "down" as const }, footnote: "Target < 1.0" },
      { label: "Open Incidents",   value: "3",   tone: "info"    as const, icon: Activity,       delta: { value: "-2",   direction: "down" as const }, footnote: "Target 0" },
      { label: "Compliance Score", value: "94%", tone: "success" as const, icon: CheckCircle2,   delta: { value: "+2%",  direction: "up"   as const }, footnote: "Target 95%" },
    ],
  },
  {
    name: "Maintenance",
    desc: "Service adherence and fleet uptime.",
    kpis: [
      { label: "Fleet Uptime",          value: "91.2%", tone: "warning" as const, icon: Gauge,         delta: { value: "-1.8%", direction: "down" as const }, footnote: "Target 95%" },
      { label: "Overdue Services",      value: "1",     tone: "success" as const, icon: Wrench,         delta: { value: "-1",    direction: "down" as const }, footnote: "Target 0" },
      { label: "Scheduled This Week",   value: "4",     tone: "info"    as const, icon: CalendarClock,  delta: { value: "+1",    direction: "up"   as const }, footnote: "Target 5" },
    ],
  },
];

function KPIScorecard() {
  return (
    <>
      <Header title="KPI Scorecard" subtitle="Department-level KPIs measured against monthly targets." />
      <div className="space-y-6 p-8">
        {departments.map((dept) => (
          <SectionCard
            key={dept.name}
            title={dept.name}
            action={<span className="text-xs text-muted-foreground">{dept.desc}</span>}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dept.kpis.map((k) => (
                <KPICard
                  key={k.label}
                  icon={k.icon}
                  label={k.label}
                  value={k.value}
                  tone={k.tone}
                  delta={k.delta}
                  footnote={k.footnote}
                />
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
