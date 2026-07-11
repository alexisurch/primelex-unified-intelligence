import {
  Fuel,
  Gauge,
  TrendingDown,
  ShieldAlert,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Header } from "@/components/layout/Header";
import {
  KPICard,
  GlassCard,
  SectionCard,
  Pill,
  type Tone,
} from "@/components/shared/Cards";
import { trucks } from "@/lib/mock-data";

/* ------------------------------------------------------------------ */
/* Tone → oklch color map (for chart fills)                            */
/* ------------------------------------------------------------------ */

const TONE_OKLCH: Record<Tone, string> = {
  info: "oklch(0.68 0.13 230)",
  success: "oklch(0.65 0.17 145)",
  warning: "oklch(0.75 0.16 85)",
  danger: "oklch(0.62 0.22 25)",
  purple: "oklch(0.6 0.2 300)",
};

const BAR_TONE: Record<Tone, string> = {
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  purple: "bg-purple",
};

/* ------------------------------------------------------------------ */
/* Monthly fuel cost dataset (₦ millions)                             */
/* ------------------------------------------------------------------ */

interface MonthlyFuel {
  m: string;
  fuelCost: number;
}

const monthlyFuel: MonthlyFuel[] = [
  { m: "Jan", fuelCost: 52 },
  { m: "Feb", fuelCost: 55 },
  { m: "Mar", fuelCost: 61 },
  { m: "Apr", fuelCost: 58 },
  { m: "May", fuelCost: 64 },
  { m: "Jun", fuelCost: 67 },
  { m: "Jul", fuelCost: 71 },
  { m: "Aug", fuelCost: 74 },
  { m: "Sep", fuelCost: 69 },
  { m: "Oct", fuelCost: 76 },
  { m: "Nov", fuelCost: 81 },
  { m: "Dec", fuelCost: 84 },
];

/* ------------------------------------------------------------------ */
/* Per-truck fuel efficiency (km per litre, derived)                  */
/* ------------------------------------------------------------------ */

interface TruckEfficiency {
  id: string;
  plate: string;
  /** Kilometres per litre — higher is better. */
  kpl: number;
  /** Normalised 0–100 score for the progress bar. */
  score: number;
  tone: Tone;
}

const PEAK_KPL = 4.2; // best-in-class reference for normalisation

function efficiencyTone(kpl: number): Tone {
  if (kpl >= 3.6) return "success";
  if (kpl >= 3.0) return "warning";
  return "danger";
}

const truckEfficiency: TruckEfficiency[] = trucks
  .filter((t) => t.status !== "Offline")
  .map((t) => {
    // Derive a plausible km/l from engine health + fuel level so the list
    // varies meaningfully across the fleet without extra mock data.
    const base = 2.6 + (t.engineHealth / 100) * 1.4;
    const jitter = ((t.odometer % 17) / 17) * 0.4;
    const kpl = Math.round((base - jitter) * 10) / 10;
    return {
      id: t.id,
      plate: t.plate,
      kpl,
      score: Math.round((kpl / PEAK_KPL) * 100),
      tone: efficiencyTone(kpl),
    };
  })
  .sort((a, b) => b.kpl - a.kpl);

/* ------------------------------------------------------------------ */
/* KPI values                                                          */
/* ------------------------------------------------------------------ */

const totalFuelCost = monthlyFuel.reduce((sum, p) => sum + p.fuelCost, 0);
const fleetKm = trucks.reduce((sum, t) => sum + t.odometer, 0);
const costPerKm = `₦${((totalFuelCost * 1_000_000) / fleetKm).toFixed(0)}`;
const fleetEfficiency = "3.4 km/L";
const theftEvents = 2;

/* ------------------------------------------------------------------ */
/* Chart tooltip                                                       */
/* ------------------------------------------------------------------ */

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-foreground">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Fuel cost:{" "}
        <span className="font-semibold text-foreground">
          ₦{payload[0].value}M
        </span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function FuelIntelligence() {
  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Fuel Intelligence"
        subtitle="Fuel spend, efficiency and theft monitoring across the fleet."
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          icon={Fuel}
          label="Total Fuel Cost"
          value={`₦${totalFuelCost}M`}
          tone="danger"
          delta={{ value: "6.4%", direction: "up" }}
        />
        <KPICard
          icon={TrendingDown}
          label="Cost per KM"
          value={costPerKm}
          tone="warning"
          delta={{ value: "1.8%", direction: "down" }}
        />
        <KPICard
          icon={Gauge}
          label="Fleet Efficiency"
          value={fleetEfficiency}
          tone="info"
          footnote="Avg across active trucks"
        />
        <KPICard
          icon={ShieldAlert}
          label="Theft Events"
          value={theftEvents}
          tone="danger"
        />
      </div>

      {/* Monthly fuel cost bar chart */}
      <SectionCard
        title="Monthly Fuel Cost"
        action={
          <Pill tone="danger">
            <Fuel className="mr-1 h-3 w-3" strokeWidth={2.5} />
            ₦{totalFuelCost}M YTD
          </Pill>
        }
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyFuel}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.3 0.02 260)"
                vertical={false}
              />
              <XAxis
                dataKey="m"
                stroke="oklch(0.65 0.02 260)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="oklch(0.65 0.02 260)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `₦${v}M`}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "oklch(0.3 0.02 260 / 0.2)" }}
              />
              <Bar dataKey="fuelCost" radius={[4, 4, 0, 0]} maxBarSize={42}>
                {monthlyFuel.map((entry) => {
                  const tone: Tone =
                    entry.fuelCost >= 75
                      ? "danger"
                      : entry.fuelCost >= 65
                        ? "warning"
                        : "success";
                  return (
                    <Cell key={entry.m} fill={TONE_OKLCH[tone]} />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Fuel efficiency by truck */}
      <SectionCard
        title="Fuel Efficiency by Truck"
        action={
          <span className="text-xs text-muted-foreground">
            {truckEfficiency.length} active trucks · sorted by km/L
          </span>
        }
      >
        <ul className="flex flex-col gap-3">
          {truckEfficiency.map((t) => (
            <li key={t.id}>
              <GlassCard hover={false} className="p-3">
                <div className="flex items-center gap-4">
                  <span className="w-28 shrink-0 text-sm font-medium text-foreground">
                    {t.plate}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${BAR_TONE[t.tone]}`}
                      style={{ width: `${t.score}%` }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-sm font-semibold text-foreground">
                    {t.kpl} km/L
                  </span>
                </div>
              </GlassCard>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

export default FuelIntelligence;
