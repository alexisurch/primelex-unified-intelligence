import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, GlassCard, SectionCard, Pill } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { fuelTransactions, type FuelTransaction, trucks } from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { useState } from "react";
import { toast } from "sonner";
import {
  DollarSign, Fuel, Gauge, Activity, TrendingUp, Droplet, Eye, MoreVertical, Truck as TruckIcon,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell,
} from "recharts";

export const Route = createFileRoute("/_app/fuel-intelligence")({
  component: FuelIntelligence,
});

const naira = (n: number) => "₦" + Math.round(n).toLocaleString();

function FuelIntelligence() {
  const trend = Array.from({ length: 7 }, (_, i) => ({ d: `May ${14 + i}`, cost: 7000000 + (i * 91) % 3000000, litres: 25000 + (i * 41) % 15000 }));
  const fuelByType = [
    { name: "Diesel", value: 96340, color: "var(--info)" },
    { name: "Petrol", value: 24120, color: "var(--success)" },
    { name: "Others", value: 8100, color: "var(--warning)" },
  ];
  const total = fuelByType.reduce((s, f) => s + f.value, 0);
  const topConsumers = trucks.slice(0, 5).map((t, i) => ({ ...t, litres: 19560 - i * 3000, cost: 2400000 - i * 400000 }));

  return (
    <>
      <Header title="Fuel Intelligence" subtitle="Monitor, control and optimize fuel usage across your fleet" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <KPICard label="Total Fuel Cost (MTD)" value="₦12.6M" icon={DollarSign} tone="info" delta={{ value: "4.3%", direction: "down", label: "vs last month" }} />
          <KPICard label="Fuel Issued (MTD)" value="128,560 L" icon={Fuel} tone="success" delta={{ value: "6.8%", direction: "up", label: "vs last month" }} />
          <KPICard label="Avg. Cost / Liter" value="₦980" icon={Droplet} tone="warning" delta={{ value: "2.1%", direction: "down", label: "vs last month" }} />
          <KPICard label="Fuel Efficiency" value="3.42 km/L" icon={Gauge} tone="success" delta={{ value: "5.6%", direction: "up", label: "vs last month" }} />
          <KPICard label="Transactions" value="342" icon={Activity} tone="info" delta={{ value: "8.7%", direction: "up", label: "vs last month" }} />
          <KPICard label="Fuel Variance" value="-2.6%" icon={TrendingUp} tone="purple" delta={{ value: "1.4%", direction: "up", label: "better than expected" }} />
        </div>

        <div className="flex items-center justify-end"><QuickAssignButton /></div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="h-10 bg-elevated/60 border border-border/60">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="assignments" className="text-xs">Fuel Assignments</TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs">Fuel Transactions</TabsTrigger>
            <TabsTrigger value="usage" className="text-xs">Fuel Usage</TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">Fuel Analysis</TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1.2fr_1.4fr]">
              <SectionCard title="Fuel Trend" action={<Select defaultValue="daily"><SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem></SelectContent></Select>}>
                <div className="h-[260px]">
                  <ResponsiveContainer>
                    <LineChart data={trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                      <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={10} />
                      <YAxis yAxisId="l" stroke="var(--muted-foreground)" fontSize={10} />
                      <YAxis yAxisId="r" orientation="right" stroke="var(--muted-foreground)" fontSize={10} />
                      <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                      <Line yAxisId="l" type="monotone" dataKey="cost" stroke="var(--info)" strokeWidth={2} dot={{ r: 3 }} name="Fuel Cost (₦)" />
                      <Line yAxisId="r" type="monotone" dataKey="litres" stroke="var(--success)" strokeWidth={2} dot={{ r: 3 }} name="Fuel Issued (L)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>
              <SectionCard title="Fuel by Type">
                <div className="flex items-center gap-4">
                  <div className="relative h-[180px] w-[180px]">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={fuelByType} innerRadius={56} outerRadius={80} paddingAngle={2} dataKey="value">
                          {fuelByType.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-lg font-semibold">{total.toLocaleString()}</div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Total</div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 text-xs">
                    {fuelByType.map((f) => (
                      <div key={f.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-sm" style={{ background: f.color }} /><span>{f.name}</span></div>
                        <span className="font-medium">{f.value.toLocaleString()} L ({Math.round(f.value / total * 100)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>
              <SectionCard title="Top Fuel Consumers (MTD)" action={<Select defaultValue="cost"><SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cost">By Cost</SelectItem><SelectItem value="litres">By Litres</SelectItem></SelectContent></Select>}>
                <TopConsumers rows={topConsumers} />
                <div className="mt-3 text-center"><button className="text-xs text-primary hover:underline">View all</button></div>
              </SectionCard>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
              <SectionCard title="Fuel Assignments" action={<button className="text-xs text-primary hover:underline">View all assignments →</button>}>
                <AssignmentsTable rows={fuelTransactions.slice(0, 5)} />
              </SectionCard>
              <SectionCard title="Fuel Variance Analysis" action={<Pill tone="success">-2.6% Better than expected</Pill>}>
                <div className="h-[220px]">
                  <ResponsiveContainer>
                    <LineChart data={trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                      <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={10} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                      <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                      <Line type="monotone" dataKey="cost" stroke="var(--info)" strokeWidth={2} dot={{ r: 3 }} name="Expected (L)" />
                      <Line type="monotone" dataKey="litres" stroke="var(--success)" strokeWidth={2} dot={{ r: 3 }} name="Actual (L)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
              <TransactionsTable rows={fuelTransactions} />
              <QuickAssignPanel />
            </div>
          </TabsContent>

          <TabsContent value="assignments"><AssignmentsTable rows={fuelTransactions} /></TabsContent>
          <TabsContent value="transactions"><TransactionsTable rows={fuelTransactions} /></TabsContent>
          <TabsContent value="usage"><p className="text-sm text-muted-foreground p-4">Fuel usage analytics — coming soon.</p></TabsContent>
          <TabsContent value="analysis"><p className="text-sm text-muted-foreground p-4">Deep fuel analysis — coming soon.</p></TabsContent>
          <TabsContent value="alerts"><p className="text-sm text-muted-foreground p-4">Fuel alerts and anomalies — coming soon.</p></TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function TopConsumers({ rows }: { rows: Array<typeof trucks[number] & { litres: number; cost: number }> }) {
  const { open } = useProfileDrawer();
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <button key={r.id} onClick={() => open({ kind: "truck", id: r.id })} className="flex w-full items-center gap-3 rounded-lg border border-border/60 bg-background/30 p-2.5 hover:border-primary/40">
          <div className="flex h-9 w-11 items-center justify-center rounded bg-elevated/60"><TruckIcon className="h-4 w-4 text-muted-foreground" /></div>
          <div className="flex-1 text-left">
            <div className="text-xs font-semibold text-primary">{r.plate}</div>
            <div className="text-[10px] text-muted-foreground">{r.model}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold">{naira(r.cost)}</div>
            <div className="text-[10px] text-muted-foreground">{r.litres.toLocaleString()} L</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function AssignmentsTable({ rows }: { rows: FuelTransaction[] }) {
  const { open } = useProfileDrawer();
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm">
        <thead>
          <tr>{["Assignment ID","Date","Driver","Truck","Fuel Type","Quantity","Assigned By","Status","Actions"].map(h => (
            <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border/60 hover:bg-white/[0.03]">
              <td className="px-3 py-3 text-xs font-medium">{r.id}</td>
              <td className="px-3 py-3 text-xs">{r.date}</td>
              <td className="px-3 py-3 text-xs"><button onClick={() => open({ kind: "driver", id: r.driver })} className="hover:underline">{r.driver}</button></td>
              <td className="px-3 py-3 text-xs"><button onClick={() => open({ kind: "truck", id: r.truck })} className="text-primary hover:underline font-medium">{r.truck}</button></td>
              <td className="px-3 py-3 text-xs">{r.fuelType}</td>
              <td className="px-3 py-3 text-xs">{r.quantity} L</td>
              <td className="px-3 py-3 text-xs">{r.recordedBy}</td>
              <td className="px-3 py-3"><Pill tone={r.status === "Issued" ? "success" : "warning"}>{r.status}</Pill></td>
              <td className="px-3 py-3"><div className="flex gap-1"><Eye className="h-4 w-4 text-muted-foreground" /><MoreVertical className="h-4 w-4 text-muted-foreground" /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TransactionsTable({ rows }: { rows: FuelTransaction[] }) {
  const { open } = useProfileDrawer();
  const cols: Column<FuelTransaction>[] = [
    { key: "date", label: "Date & Time" },
    { key: "type", label: "Type", render: (r) => <Pill tone={r.type === "Issue" ? "info" : "warning"}>{r.type}</Pill> },
    { key: "truck", label: "Truck", render: (r) => <button onClick={() => open({ kind: "truck", id: r.truck })} className="text-primary hover:underline">{r.truck}</button> },
    { key: "driver", label: "Driver", render: (r) => r.driver ? <button onClick={() => open({ kind: "driver", id: r.driver })} className="hover:underline">{r.driver}</button> : "—" },
    { key: "fuelType", label: "Fuel Type" },
    { key: "quantity", label: "Quantity", render: (r) => `${r.quantity} L` },
    { key: "unitPrice", label: "Unit Price", render: (r) => naira(r.unitPrice) },
    { key: "amount", label: "Amount", render: (r) => naira(r.amount) },
    { key: "location", label: "Location" },
    { key: "recordedBy", label: "Recorded By" },
  ];
  return <DataTable title="Recent Fuel Transactions" columns={cols} rows={rows} searchKeys={["id","truck","driver","location"]} pageSize={8} />;
}

function QuickAssignPanel() {
  return (
    <GlassCard hover={false} className="p-5">
      <h3 className="text-sm font-semibold pb-3">Quick Assign Fuel</h3>
      <QuickAssignForm />
    </GlassCard>
  );
}

function QuickAssignButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setOpen(true)}>Assign Fuel</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-popover p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold pb-3">Assign Fuel</h3>
            <QuickAssignForm onDone={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

function QuickAssignForm({ onDone }: { onDone?: () => void }) {
  const [form, setForm] = useState({ driver: "", truck: "", fuelType: "Diesel", quantity: "", price: "980", assignType: "Trip", note: "" });
  const submit = () => {
    if (!form.truck && !form.driver) { toast.error("Select a truck or driver"); return; }
    toast.success(`Fuel assigned: ${form.quantity || 0}L`);
    onDone?.();
    setForm({ driver: "", truck: "", fuelType: "Diesel", quantity: "", price: "980", assignType: "Trip", note: "" });
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-[11px] uppercase text-muted-foreground">Driver</Label><Input value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} placeholder="Select Driver" className="mt-1" /></div>
        <div><Label className="text-[11px] uppercase text-muted-foreground">Truck</Label><Input value={form.truck} onChange={(e) => setForm({ ...form, truck: e.target.value })} placeholder="Select Truck" className="mt-1" /></div>
        <div><Label className="text-[11px] uppercase text-muted-foreground">Fuel Type</Label>
          <Select value={form.fuelType} onValueChange={(v) => setForm({ ...form, fuelType: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Diesel">Diesel</SelectItem><SelectItem value="Petrol">Petrol</SelectItem></SelectContent>
          </Select>
        </div>
        <div><Label className="text-[11px] uppercase text-muted-foreground">Quantity (L)</Label><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="mt-1" placeholder="0" /></div>
        <div><Label className="text-[11px] uppercase text-muted-foreground">Price / L (₦)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1" /></div>
        <div><Label className="text-[11px] uppercase text-muted-foreground">Assignment Type</Label>
          <Select value={form.assignType} onValueChange={(v) => setForm({ ...form, assignType: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Trip">Trip</SelectItem><SelectItem value="General Use">General Use</SelectItem></SelectContent>
          </Select>
        </div>
      </div>
      <div><Label className="text-[11px] uppercase text-muted-foreground">Note (Optional)</Label><Textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="mt-1" placeholder="Add a note..." /></div>
      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={submit}>Assign Fuel</Button>
    </div>
  );
}
