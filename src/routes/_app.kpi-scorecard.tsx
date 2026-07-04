import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard, SectionCard, StatusDot } from "@/components/shared/Cards";
import { weekly } from "@/lib/mock-data";
import { ResponsiveContainer, LineChart, Line } from "recharts";

export const Route = createFileRoute("/_app/kpi-scorecard")({
  component: KPIScorecard,
});

const departments = [
  { name: "Operations", metrics: [
    { name: "Fleet Utilization", actual: 81.7, target: 85, unit: "%" },
    { name: "On-Time Delivery", actual: 92.3, target: 95, unit: "%" },
    { name: "Trips Completed", actual: 1420, target: 1500, unit: "" },
  ]},
  { name: "Fuel", metrics: [
    { name: "Cost per KM", actual: 62, target: 55, unit: "₦" },
    { name: "Fleet Efficiency", actual: 87, target: 90, unit: "%" },
    { name: "Theft Events", actual: 4, target: 0, unit: "" },
  ]},
  { name: "Safety", metrics: [
    { name: "Safety Score", actual: 92, target: 95, unit: "" },
    { name: "Open Incidents", actual: 7, target: 3, unit: "" },
    { name: "Training Complete", actual: 76, target: 85, unit: "%" },
  ]},
  { name: "Maintenance", metrics: [
    { name: "Downtime", actual: 18, target: 12, unit: "h" },
    { name: "Cost per Truck", actual: 2.2, target: 1.8, unit: "M" },
    { name: "PM Compliance", actual: 88, target: 95, unit: "%" },
  ]},
];

function traffic(actual: number, target: number, inverse = false) {
  const ratio = inverse ? target / actual : actual / target;
  if (ratio >= 0.98) return "success";
  if (ratio >= 0.85) return "warning";
  return "danger";
}

function KPIScorecard() {
  return (
    <>
      <Header title="KPI Scorecard" subtitle="Executive KPI monitoring across departments — actual vs target" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {departments.map((d) => (
            <SectionCard key={d.name} title={d.name}>
              <div className="space-y-3">
                {d.metrics.map((m) => {
                  const inverse = ["Cost per KM","Theft Events","Open Incidents","Downtime","Cost per Truck"].includes(m.name);
                  const tone = traffic(m.actual, m.target, inverse);
                  const variance = ((m.actual - m.target) / m.target * 100).toFixed(1);
                  return (
                    <GlassCard key={m.name} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusDot tone={tone as any} />
                          <span className="text-sm font-medium">{m.name}</span>
                        </div>
                        <div className="flex items-center gap-6 text-xs">
                          <div><span className="text-muted-foreground">Target</span> <span className="ml-1 font-medium">{m.unit === "₦" ? "₦" : ""}{m.target}{m.unit === "%" ? "%" : m.unit === "h" ? "h" : m.unit === "M" ? "M" : ""}</span></div>
                          <div><span className="text-muted-foreground">Actual</span> <span className={`ml-1 font-semibold text-${tone}`}>{m.unit === "₦" ? "₦" : ""}{m.actual}{m.unit === "%" ? "%" : m.unit === "h" ? "h" : m.unit === "M" ? "M" : ""}</span></div>
                          <div className={`font-medium text-${tone}`}>{Number(variance) >= 0 ? "+" : ""}{variance}%</div>
                        </div>
                      </div>
                      <div className="mt-3 h-8">
                        <ResponsiveContainer>
                          <LineChart data={weekly}>
                            <Line type="monotone" dataKey="onTime" stroke={`var(--${tone})`} strokeWidth={2} dot={false}/>
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </SectionCard>
          ))}
        </div>
      </div>
    </>
  );
}
