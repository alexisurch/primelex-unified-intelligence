import { type ComponentType } from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  Fuel,
  Gauge,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Wrench,
  CalendarClock,
  type LucideProps,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { KPICard, SectionCard, type Tone } from "@/components/shared/Cards";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface KpiEntry {
  id: string;
  label: string;
  value: string;
  target: string;
  delta: { value: string; direction: "up" | "down" };
  tone: Tone;
  icon: ComponentType<LucideProps>;
  /** Whether meeting the target is "good" when the delta is up. */
  upIsGood: boolean;
}

interface Department {
  id: string;
  title: string;
  description: string;
  kpis: KpiEntry[];
}

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const departments: Department[] = [
  {
    id: "operations",
    title: "Operations",
    description: "Trip throughput and delivery reliability.",
    kpis: [
      {
        id: "ops-1",
        label: "On-Time Delivery",
        value: "92.3%",
        target: "Target 95%",
        delta: { value: "3.2%", direction: "down" },
        tone: "warning",
        icon: CheckCircle2,
        upIsGood: true,
      },
      {
        id: "ops-2",
        label: "Active Deliveries",
        value: "142",
        target: "Target 130",
        delta: { value: "+12", direction: "up" },
        tone: "success",
        icon: Package,
        upIsGood: true,
      },
      {
        id: "ops-3",
        label: "Delayed Trips",
        value: "18",
        target: "Target < 12",
        delta: { value: "-6", direction: "down" },
        tone: "danger",
        icon: Clock,
        upIsGood: false,
      },
    ],
  },
  {
    id: "fuel",
    title: "Fuel",
    description: "Consumption efficiency and spend.",
    kpis: [
      {
        id: "fuel-1",
        label: "Avg Fuel Efficiency",
        value: "3.8 km/L",
        target: "Target 4.2 km/L",
        delta: { value: "-0.4", direction: "down" },
        tone: "danger",
        icon: Fuel,
        upIsGood: true,
      },
      {
        id: "fuel-2",
        label: "Monthly Fuel Cost",
        value: "₦640M",
        target: "Target ₦680M",
        delta: { value: "-6.7%", direction: "down" },
        tone: "success",
        icon: TrendingDown,
        upIsGood: false,
      },
      {
        id: "fuel-3",
        label: "Fuel Theft Incidents",
        value: "2",
        target: "Target 0",
        delta: { value: "+1", direction: "up" },
        tone: "warning",
        icon: AlertTriangle,
        upIsGood: false,
      },
    ],
  },
  {
    id: "safety",
    title: "Safety",
    description: "Incident rates and compliance.",
    kpis: [
      {
        id: "safety-1",
        label: "Incident Rate",
        value: "1.4",
        target: "Target < 1.0",
        delta: { value: "-0.3", direction: "down" },
        tone: "warning",
        icon: ShieldCheck,
        upIsGood: false,
      },
      {
        id: "safety-2",
        label: "Open Incidents",
        value: "3",
        target: "Target 0",
        delta: { value: "-2", direction: "down" },
        tone: "info",
        icon: Activity,
        upIsGood: false,
      },
      {
        id: "safety-3",
        label: "Compliance Score",
        value: "94%",
        target: "Target 95%",
        delta: { value: "+2%", direction: "up" },
        tone: "success",
        icon: CheckCircle2,
        upIsGood: true,
      },
    ],
  },
  {
    id: "maintenance",
    title: "Maintenance",
    description: "Service adherence and fleet uptime.",
    kpis: [
      {
        id: "mnt-1",
        label: "Fleet Uptime",
        value: "91.2%",
        target: "Target 95%",
        delta: { value: "-1.8%", direction: "down" },
        tone: "warning",
        icon: Gauge,
        upIsGood: true,
      },
      {
        id: "mnt-2",
        label: "Overdue Services",
        value: "1",
        target: "Target 0",
        delta: { value: "-1", direction: "down" },
        tone: "success",
        icon: Wrench,
        upIsGood: false,
      },
      {
        id: "mnt-3",
        label: "Scheduled This Week",
        value: "4",
        target: "Target 5",
        delta: { value: "+1", direction: "up" },
        tone: "info",
        icon: CalendarClock,
        upIsGood: true,
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Helper                                                              */
/* ------------------------------------------------------------------ */

/**
 * Returns a delta label that reads as "good" or "needs attention" based on
 * whether an upward delta is desirable for this KPI.
 */
function deltaFootnote(entry: KpiEntry): string {
  const { delta, upIsGood } = entry;
  const isGood =
    (delta.direction === "up" && upIsGood) ||
    (delta.direction === "down" && !upIsGood);
  return `${entry.target} · ${isGood ? "On track" : "Needs attention"}`;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function KPIScorecard() {
  return (
    <div className="flex flex-col gap-6">
      <Header
        title="KPI Scorecard"
        subtitle="Department-level KPIs measured against monthly targets."
      />

      {departments.map((dept) => (
        <SectionCard
          key={dept.id}
          title={dept.title}
          action={
            <span className="text-xs text-muted-foreground">
              {dept.description}
            </span>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dept.kpis.map((entry) => {
              const Icon = entry.icon;
              return (
                <KPICard
                  key={entry.id}
                  icon={Icon}
                  label={entry.label}
                  value={entry.value}
                  tone={entry.tone}
                  delta={entry.delta}
                  footnote={deltaFootnote(entry)}
                />
              );
            })}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

export default KPIScorecard;
