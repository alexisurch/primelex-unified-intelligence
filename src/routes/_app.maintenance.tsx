import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, GlassCard, SectionCard, Pill } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { maintenanceRecords, type MaintenanceRecord } from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";
import {
  Calendar, Wrench, AlertTriangle, DollarSign, Clock, ShieldCheck, Plus, MoreVertical, Eye, Truck as TruckIcon, Droplet,
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/maintenance")({
  component: Maintenance,
});

const naira = (n: number) => "₦" + Math.round(n).toLocaleString();

function Maintenance() {
  const upcoming = maintenanceRecords.filter(m => m.status === "Scheduled" || m.status === "Overdue").slice(0, 6);
  const inWorkshop = maintenanceRecords.filter(m => m.status === "In Workshop").length;
  const overdue = maintenanceRecords.filter(m => m.status === "Overdue").length;
  const completed = maintenanceRecords.filter(m => m.status === "Completed");
  const totalCost = maintenanceRecords.reduce((s, m) => s + (m.status === "Completed" ? m.cost : 0), 0);

  const statusData = [
    { name: "Scheduled", value: maintenanceRecords.filter(m => m.status === "Scheduled").length, color: "var(--info)" },
    { name: "In Workshop", value: inWorkshop, color: "var(--warning)" },
    { name: "Completed", value: completed.length, color: "var(--success)" },
    { name: "Overdue", value: overdue, color: "var(--danger)" },
  ];
  const totalRecords = statusData.reduce((s, x) => s + x.value, 0);

  const costTrend = Array.from({ length: 8 }, (_, i) => ({ d: `May ${i * 4 + 1}`, cost: 400000 + (i * 91) % 500000 }));

  const costBreakdown = [
    { name: "Engine", pct: 43, amount: 12400000, color: "bg-info" },
    { name: "Brakes", pct: 24, amount: 6800000, color: "bg-warning" },
    { name: "Tires", pct: 15, amount: 4200000, color: "bg-success" },
    { name: "Transmission", pct: 11, amount: 3100000, color: "bg-danger" },
    { name: "Other", pct: 7, amount: 1900000, color: "bg-purple" },
  ];

  return (
    <>
      <Header title="Maintenance" subtitle="Schedule, track and optimize fleet maintenance activities" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <KPICard label="Upcoming Services" value="24" icon={Calendar} tone="info" footnote="Next 30 days" />
          <KPICard label="Overdue Services" value={String(overdue)} icon={AlertTriangle} tone="danger" footnote="Requires immediate attention" />
          <KPICard label="In Workshop" value={String(inWorkshop)} icon={Wrench} tone="warning" footnote="Avg 2.3 days" />
          <KPICard label="Maintenance Cost (MTD)" value={naira(totalCost)} icon={DollarSign} tone="danger" delta={{ value: "4.2%", direction: "down", label: "vs last month" }} />
          <KPICard label="Avg Downtime" value="18h" icon={Clock} tone="purple" delta={{ value: "6%", direction: "up", label: "vs last month" }} />
          <KPICard label="Maintenance Compliance" value="92%" icon={ShieldCheck} tone="success" delta={{ value: "8%", direction: "up", label: "vs last month" }} />
        </div>

        <div className="flex items-center justify-end"><LogMaintenanceDialog /></div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
          <SectionCard title="Upcoming Maintenance" action={<button className="text-xs text-primary hover:underline">View all</button>}>
            <UpcomingTable rows={upcoming} />
            <div className="mt-3 text-center"><button className="text-xs text-primary hover:underline">View all scheduled maintenance →</button></div>
          </SectionCard>

          <div className="space-y-4">
            <SectionCard title="Maintenance by Status">
              <div className="flex items-center gap-4">
                <div className="relative h-[140px] w-[140px]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={statusData} innerRadius={44} outerRadius={64} paddingAngle={2} dataKey="value">
                        {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-lg font-semibold">{totalRecords}</div>
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Total</div>
                  </div>
                </div>
                <div className="flex-1 space-y-2 text-xs">
                  {statusData.map((s) => (
                    <div key={s.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-sm" style={{ background: s.color }} /><span className="text-muted-foreground">{s.name}</span></div>
                      <span className="font-medium">{s.value} ({Math.round(s.value / totalRecords * 100)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Maintenance Cost (This Month)" action={<span className="text-[11px] text-danger">▼ 4.2% vs last month</span>}>
              <div className="h-[130px]">
                <ResponsiveContainer>
                  <LineChart data={costTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                    <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={10} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="cost" stroke="var(--info)" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
            <SectionCard title="Cost Breakdown (This Month)">
              <div className="space-y-3">
                {costBreakdown.map((c) => (
                  <div key={c.name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-muted-foreground">{naira(c.amount)} <span className="text-[10px]">({c.pct}%)</span></span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div className={`h-full ${c.color}`} style={{ width: `${c.pct * 2}%`, maxWidth: "100%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        <RecordsTable rows={maintenanceRecords} />
      </div>
    </>
  );
}

function UpcomingTable({ rows }: { rows: MaintenanceRecord[] }) {
  const { open } = useProfileDrawer();
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm">
        <thead>
          <tr>{["Truck","Service","Due Date","Priority","Est. Cost","Status","Actions"].map(h => (
            <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border/60 hover:bg-white/[0.03]">
              <td className="px-3 py-3 text-xs">
                <button onClick={() => open({ kind: "truck", id: r.truck })} className="flex items-center gap-2 text-left">
                  <div className="flex h-8 w-10 items-center justify-center rounded bg-elevated/60"><TruckIcon className="h-4 w-4 text-muted-foreground" /></div>
                  <div>
                    <div className="font-semibold text-primary hover:underline">{r.truck}</div>
                    <div className="text-[10px] text-muted-foreground">Volvo FH16</div>
                  </div>
                </button>
              </td>
              <td className="px-3 py-3 text-xs">
                <div className="flex items-center gap-2">
                  <Wrench className="h-3.5 w-3.5 text-warning" />
                  <div>
                    <div className="font-medium">{r.service}</div>
                    <div className="text-[10px] text-muted-foreground">Every 10,000 km</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-xs">
                <div>{r.dueDate}</div>
                <div className="text-[10px] text-danger">In {Math.max(1, Math.round(Math.random() * 12) + 1)} days</div>
              </td>
              <td className="px-3 py-3"><Pill tone={r.priority === "High" ? "danger" : r.priority === "Medium" ? "warning" : "info"}>{r.priority}</Pill></td>
              <td className="px-3 py-3 text-xs font-medium">{naira(r.cost)}</td>
              <td className="px-3 py-3"><Pill tone={r.status === "Overdue" ? "danger" : "info"}>{r.status}</Pill></td>
              <td className="px-3 py-3"><button className="text-muted-foreground hover:text-foreground"><MoreVertical className="h-4 w-4" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecordsTable({ rows }: { rows: MaintenanceRecord[] }) {
  const { open } = useProfileDrawer();
  const cols: Column<MaintenanceRecord>[] = [
    { key: "date", label: "Date" },
    { key: "truck", label: "Truck", render: (r) => (
      <button onClick={() => open({ kind: "truck", id: r.truck })} className="flex items-center gap-2">
        <div className="flex h-8 w-10 items-center justify-center rounded bg-elevated/60"><TruckIcon className="h-4 w-4 text-muted-foreground" /></div>
        <div className="text-left"><div className="font-semibold text-primary hover:underline">{r.truck}</div><div className="text-[10px] text-muted-foreground">Volvo FH16</div></div>
      </button>
    )},
    { key: "service", label: "Service Type", render: (r) => (
      <div><div className="font-medium">{r.service}</div><div className="text-[10px]"><Pill tone="info">{r.type}</Pill></div></div>
    )},
    { key: "workDone", label: "Work Done", render: (r) => (
      <div className="max-w-xs"><div className="text-xs">{r.workDone || "—"}</div><div className="text-[10px] text-muted-foreground truncate">{r.nextService}</div></div>
    )},
    { key: "cost", label: "Cost", render: (r) => <span className="text-xs font-medium">{naira(r.cost)}</span> },
    { key: "performedBy", label: "Performed By" },
    { key: "status", label: "Status", render: (r) => <Pill tone={r.status === "Completed" ? "success" : r.status === "Overdue" ? "danger" : r.status === "In Workshop" ? "warning" : "info"}>{r.status}</Pill> },
    { key: "id", label: "Actions", render: () => (
      <div className="flex gap-1">
        <button className="rounded p-1 hover:bg-white/5"><Eye className="h-4 w-4 text-muted-foreground" /></button>
        <button className="rounded p-1 hover:bg-white/5"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
      </div>
    )},
  ];
  return <DataTable title="Maintenance Records" columns={cols} rows={rows} searchKeys={["truck","service","performedBy"]} pageSize={10} />;
}

function LogMaintenanceDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ truck: "", service: "Oil Change", type: "Routine", cost: "", workDone: "", performedBy: "AutoCare Workshop" });

  const submit = () => {
    if (!form.truck) { toast.error("Truck is required"); return; }
    toast.success(`Maintenance logged for ${form.truck}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="mr-1.5 h-4 w-4" />Log Maintenance</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Log Maintenance Record</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div><Label className="text-[11px] uppercase text-muted-foreground">Truck</Label><Input value={form.truck} onChange={(e) => setForm({ ...form, truck: e.target.value })} placeholder="TRK-1000" className="mt-1" /></div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Service</Label><Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="mt-1" /></div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Routine">Routine</SelectItem><SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Diagnostic">Diagnostic</SelectItem><SelectItem value="Repair">Repair</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Cost (₦)</Label><Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="mt-1" /></div>
          <div className="col-span-2"><Label className="text-[11px] uppercase text-muted-foreground">Performed By</Label><Input value={form.performedBy} onChange={(e) => setForm({ ...form, performedBy: e.target.value })} className="mt-1" /></div>
          <div className="col-span-2"><Label className="text-[11px] uppercase text-muted-foreground">Work Done</Label><Textarea rows={3} value={form.workDone} onChange={(e) => setForm({ ...form, workDone: e.target.value })} className="mt-1" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-primary text-primary-foreground">Log Maintenance</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
