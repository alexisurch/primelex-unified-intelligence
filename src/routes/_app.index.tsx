import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard, KPICard, SectionCard, Pill } from "@/components/shared/Cards";
import {
  Truck, TruckIcon, Package, Clock, Gauge, Wallet, ArrowRight, CheckCircle2,
  AlertTriangle, Wrench, IdCard, ShieldAlert, Flame, ShieldCheck,
} from "lucide-react";
import { alerts, priorities, fleetBreakdown, costBreakdown, weekly, kpis } from "@/lib/mock-data";
import {
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

const alertIcons = { AlertTriangle, Wrench, IdCard, ShieldAlert };
const priorityIcons = { Flame, Clock, Wrench, ShieldCheck };

function Dashboard() {
  return (
    <>
      <Header title="Executive Overview" subtitle="Real-time summary of your fleet operations" />
      <div className="space-y-6 p-8">
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <KPICard label="Total Trucks" value={kpis.totalTrucks} icon={Truck} tone="info" delta={{ value: "4", direction: "up" }} />
          <KPICard label="Trucks On The Road" value={kpis.onTheRoad} icon={TruckIcon} tone="success" footnote="76.6% of fleet" />
          <KPICard label="Active Deliveries" value={kpis.activeDeliveries} icon={Package} tone="purple" delta={{ value: "12", direction: "up" }} />
          <KPICard label="On-Time Delivery" value={`${kpis.onTimeRate}%`} icon={Clock} tone="info" delta={{ value: "3.2%", direction: "down" }} />
          <KPICard label="Fleet Utilization" value={`${kpis.utilization}%`} icon={Gauge} tone="warning" delta={{ value: "5.6%", direction: "up" }} />
          <KPICard label="Total Operating Cost" value={kpis.operatingCost} icon={Wallet} tone="danger" delta={{ value: "8.4%", direction: "down" }} />
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {/* Fleet at a Glance */}
          <SectionCard title="Fleet at a Glance" action={<button className="text-xs text-primary hover:underline flex items-center gap-1">View Fleet Map <ArrowRight className="h-3 w-3" /></button>}>
            <div className="flex items-center gap-4">
              <div className="relative h-[180px] w-[180px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={fleetBreakdown} innerRadius={60} outerRadius={82} paddingAngle={2} dataKey="value">
                      {fleetBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-semibold">128</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {fleetBreakdown.map((f) => (
                  <div key={f.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: f.color }} />
                      <span className="text-muted-foreground">{f.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{f.value} ({((f.value/128)*100).toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Operations Overview */}
          <SectionCard title="Operations Overview (Today)">
            <div className="flex items-center justify-between px-2">
              {[
                { icon: Truck, label: "Departed", value: 156, delta: "8%", tone: "info", up: true },
                { icon: TruckIcon, label: "In Transit", value: 142, delta: "5%", tone: "success", up: true },
                { icon: Package, label: "Delivered", value: 112, delta: "12%", tone: "warning", up: true },
                { icon: AlertTriangle, label: "Delayed", value: 18, delta: "10%", tone: "danger", up: false },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-${s.tone}/15`}>
                      <s.icon className={`h-5 w-5 text-${s.tone}`} />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
                    <span className="text-lg font-semibold">{s.value}</span>
                    <span className={`text-[11px] font-medium ${s.up ? "text-success" : "text-danger"}`}>{s.up ? "▲" : "▼"} {s.delta}</span>
                  </div>
                  {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-success/20 bg-success/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div className="flex-1">
                <div className="text-sm font-medium">All operations are running smoothly</div>
                <div className="text-xs text-muted-foreground">No critical issues at the moment</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </SectionCard>

          {/* Delivery Performance */}
          <SectionCard
            title="Deliveries Performance"
            action={<select className="rounded-md border border-border bg-elevated/60 px-2 py-1 text-xs"><option>This Week</option><option>This Month</option></select>}
          >
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">On-Time Delivery</div>
              <div className="flex items-center gap-3">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-success" style={{ width: "92.3%" }} />
                </div>
                <span className="text-sm font-semibold text-success">92.3%</span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Total</div><div className="mt-1 text-xl font-semibold">142</div></div>
              <div><div className="text-[11px] uppercase tracking-wider text-muted-foreground">On-Time</div><div className="mt-1 text-xl font-semibold text-success">131</div></div>
              <div><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Delayed</div><div className="mt-1 text-xl font-semibold text-danger">11</div></div>
            </div>
            <div className="mt-4 h-[70px]">
              <ResponsiveContainer>
                <LineChart data={weekly}>
                  <Line type="monotone" dataKey="onTime" stroke="var(--success)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <button className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline">View Delivery Performance <ArrowRight className="h-3 w-3" /></button>
          </SectionCard>
        </div>

        {/* Third row */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {/* Alerts */}
          <SectionCard title="Alerts & Notifications" action={<button className="text-xs text-primary hover:underline">View all (8)</button>}>
            <div className="space-y-3">
              {alerts.map((a) => {
                const Icon = alertIcons[a.icon];
                return (
                  <div key={a.id} className="flex items-start gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-white/[0.03]">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-${a.type}/15`}>
                      <Icon className={`h-4 w-4 text-${a.type}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="text-sm font-medium truncate">{a.title}</div>
                        <div className="text-[11px] text-muted-foreground shrink-0">{a.time}</div>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{a.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline">View all alerts <ArrowRight className="h-3 w-3" /></button>
          </SectionCard>

          {/* Priorities */}
          <SectionCard title="Top Priorities" action={<button className="text-xs text-primary hover:underline">View all</button>}>
            <div className="space-y-3">
              {priorities.map((p) => {
                const Icon = priorityIcons[p.icon];
                return (
                  <div key={p.id} className="flex items-start gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-white/[0.03]">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-${p.color}/15`}>
                      <Icon className={`h-4 w-4 text-${p.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className={`text-sm font-medium truncate text-${p.color}`}>{p.title}</div>
                        <div className="text-[11px] text-muted-foreground shrink-0">{p.time}</div>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{p.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline">View all priorities <ArrowRight className="h-3 w-3" /></button>
          </SectionCard>

          {/* Cost Summary */}
          <SectionCard title="Cost Summary (This Month)" action={<button className="text-xs text-primary hover:underline">View Cost Analysis</button>}>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-3xl font-semibold">₦1.42B</div>
                <div className="mt-1 text-xs text-muted-foreground">Total Operating Cost</div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <Pill tone="danger">▼ 6.7% vs last month</Pill>
                </div>
              </div>
              <div className="relative h-[140px] w-[140px] shrink-0">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={costBreakdown} innerRadius={44} outerRadius={64} paddingAngle={2} dataKey="value">
                      {costBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              {costBreakdown.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-sm" style={{ background: c.color }} />
                    <span className="text-muted-foreground">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{c.value}%</span>
                    <span className="w-16 text-right font-medium">{c.amount}</span>
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
