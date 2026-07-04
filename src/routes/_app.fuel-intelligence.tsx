import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, SectionCard, Pill } from "@/components/shared/Cards";
import { AIInsight } from "@/components/shared/Insights";
import { monthly, trucks } from "@/lib/mock-data";
import { Fuel, DollarSign, Gauge, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";

export const Route = createFileRoute("/_app/fuel-intelligence")({
  component: FuelIntelligence,
});

function FuelIntelligence() {
  return (
    <>
      <Header title="Fuel Intelligence" subtitle="Track consumption, cost and detect fuel anomalies" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Fuel Spend (MTD)" value="₦639M" icon={DollarSign} tone="danger" delta={{ value: "8.4%", direction: "down" }} />
          <KPICard label="Avg Consumption" value="34.2 L/100km" icon={Fuel} tone="info" delta={{ value: "1.2%", direction: "up" }} />
          <KPICard label="Fleet Efficiency" value="87%" icon={Gauge} tone="success" delta={{ value: "3%", direction: "up" }} />
          <KPICard label="Theft Alerts" value="4" icon={AlertTriangle} tone="warning" footnote="Last 30 days" />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <SectionCard title="Fuel Cost Trend" className="xl:col-span-2">
            <div className="h-[280px]">
              <ResponsiveContainer>
                <AreaChart data={monthly}>
                  <defs>
                    <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--info)" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="var(--info)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)"/>
                  <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11}/>
                  <YAxis stroke="var(--muted-foreground)" fontSize={11}/>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}/>
                  <Area type="monotone" dataKey="fuel" stroke="var(--info)" strokeWidth={2} fill="url(#fuelGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
          <AIInsight title="AI Fuel Optimization" insights={[
            { label: "Reroute 18 trucks via A2 corridor", detail: "Predicted savings of ₦4.2M/month at current fuel rates" },
            { label: "Anomaly: TRK-1017 fuel drop", detail: "12L unexplained drop overnight — potential theft" },
            { label: "Consolidate refueling stations", detail: "Switch to Total NG stations in Lagos region for 3% discount" },
          ]}/>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <SectionCard title="Efficiency Comparison — Top Vehicles">
            <div className="h-[240px]">
              <ResponsiveContainer>
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)"/>
                  <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11}/>
                  <YAxis stroke="var(--muted-foreground)" fontSize={11}/>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}/>
                  <Line type="monotone" dataKey="cost" stroke="var(--success)" strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="fuel" stroke="var(--warning)" strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="revenue" stroke="var(--purple)" strokeWidth={2} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
          <SectionCard title="Recent Refueling Events">
            <div className="divide-y divide-border/60">
              {trucks.slice(0, 6).map((t, i) => (
                <div key={t.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/15"><Fuel className="h-4 w-4 text-info"/></div>
                    <div>
                      <div className="text-sm font-medium">{t.id} <span className="text-xs text-muted-foreground">at {["Total NG","Mobil","Oando","NNPC"][i%4]}</span></div>
                      <div className="text-xs text-muted-foreground">{t.driver} • {t.location.split(" → ")[0]}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{120 + i * 13} L</div>
                    <div className="text-xs text-muted-foreground">₦{(120 + i * 13) * 850}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
