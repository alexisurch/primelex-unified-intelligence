import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill, SectionCard } from "@/components/shared/Cards";
import { AIInsight } from "@/components/shared/Insights";
import { trucks, weekly } from "@/lib/mock-data";
import { Wrench, Calendar, DollarSign, Clock } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export const Route = createFileRoute("/_app/maintenance")({
  component: Maintenance,
});

const upcoming = trucks.slice(0, 8).map((t, i) => ({
  ...t,
  service: ["Oil Change","Brake Inspection","Tire Rotation","Engine Diagnostics","Full Service","Transmission","AC Service","Filter Change"][i],
  dueIn: `${(i + 1) * 2} days`,
  mechanic: ["Bola A.","Kunle P.","Chinedu O.","Musa I."][i % 4],
  cost: `₦${(120 + i * 47).toLocaleString()}K`,
}));

function Maintenance() {
  return (
    <>
      <Header title="Maintenance" subtitle="Schedule, track and optimize fleet maintenance activities" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Upcoming Services" value="24" icon={Calendar} tone="info" footnote="Next 30 days" />
          <KPICard label="In Workshop" value="10" icon={Wrench} tone="warning" footnote="Avg 2.3 days" />
          <KPICard label="Maintenance Cost" value="₦284M" icon={DollarSign} tone="danger" delta={{ value: "4.2%", direction: "down" }} />
          <KPICard label="Avg Downtime" value="18h" icon={Clock} tone="purple" delta={{ value: "6%", direction: "up" }} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <SectionCard title="Upcoming Maintenance" className="xl:col-span-2">
            <div className="divide-y divide-border/60">
              {upcoming.map((u) => (
                <div key={u.id} className="flex items-center gap-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/15"><Wrench className="h-5 w-5 text-warning"/></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{u.service}</span>
                      <Pill tone={u.dueIn.startsWith("2") ? "danger" : "warning"}>{u.dueIn}</Pill>
                    </div>
                    <div className="text-xs text-muted-foreground">{u.id} • {u.plate} • Mechanic: {u.mechanic}</div>
                  </div>
                  <div className="text-sm font-semibold">{u.cost}</div>
                </div>
              ))}
            </div>
          </SectionCard>
          <AIInsight title="AI Maintenance Prediction" insights={[
            { label: "TRK-1007 brake failure risk", detail: "Predicted 78% probability within 14 days — schedule inspection now" },
            { label: "Reduce cost by ₦12M/month", detail: "Consolidate oil changes for northern fleet on same day" },
            { label: "TRK-1023 sensor anomaly", detail: "Engine temp variance exceeds baseline by 18%" },
          ]}/>
        </div>

        <SectionCard title="Maintenance Costs — Weekly">
          <div className="h-[240px]">
            <ResponsiveContainer>
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)"/>
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11}/>
                <YAxis stroke="var(--muted-foreground)" fontSize={11}/>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}/>
                <Bar dataKey="fuel" fill="var(--warning)" radius={[6,6,0,0]} />
                <Bar dataKey="trips" fill="var(--info)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
