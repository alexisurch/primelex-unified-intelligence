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
import { maintenanceRecords, trucks, getMaintenanceSpend, getAvgDowntime, getAvgRepairCost, exportCSV, type MaintenanceRecord } from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { Calendar, Wrench, TriangleAlert as AlertTriangle, DollarSign, Clock, ShieldCheck, Plus, MoveVertical as MoreVertical, Eye, Truck as TruckIcon, ChevronDown, Search as SearchIcon, Download } from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { useState, useMemo } from "react";
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
  const totalCost = getMaintenanceSpend();
  const avgDowntime = getAvgDowntime();
  const avgRepairCost = getAvgRepairCost();

  const [allScheduledOpen, setAllScheduledOpen] = useState(false);

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
          <KPICard label="In Workshop" value={String(inWorkshop)} icon={Wrench} tone="warning" footnote={`Avg ${avgDowntime}h`} />
          <KPICard label="Maintenance Cost (MTD)" value={naira(totalCost)} icon={DollarSign} tone="danger" delta={{ value: "4.2%", direction: "down", label: "vs last month" }} />
          <KPICard label="Avg Downtime" value={`${avgDowntime}h`} icon={Clock} tone="purple" delta={{ value: "6%", direction: "up", label: "vs last month" }} />
          <KPICard label="Avg Repair Cost" value={naira(avgRepairCost)} icon={DollarSign} tone="warning" />
        </div>

        <div className="flex items-center justify-end">
          <MaintenanceButton />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
          <SectionCard title="Upcoming Maintenance" action={<button className="text-xs text-primary hover:underline" onClick={() => setAllScheduledOpen(true)}>View all</button>}>
            <UpcomingTable rows={upcoming} />
            <div className="mt-3 text-center"><button className="text-xs text-primary hover:underline" onClick={() => setAllScheduledOpen(true)}>View all scheduled maintenance →</button></div>
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

      <AllScheduledDialog open={allScheduledOpen} onOpenChange={setAllScheduledOpen} />
    </>
  );
}

function MaintenanceButton() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"menu" | "schedule" | "log">("menu");

  function reset() { setOpen(false); setMode("menu"); }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); else setOpen(true); }}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="mr-1.5 h-4 w-4" />Maintenance</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        {mode === "menu" && (
          <>
            <DialogHeader><DialogTitle>Maintenance</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              <button onClick={() => setMode("schedule")} className="flex flex-col items-start gap-2 rounded-xl border border-border/60 bg-background/30 p-5 text-left hover:border-primary/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/15"><Calendar className="h-5 w-5 text-info" /></div>
                <div className="text-sm font-semibold">Schedule Maintenance</div>
                <div className="text-xs text-muted-foreground">Schedule by date or by distance target</div>
              </button>
              <button onClick={() => setMode("log")} className="flex flex-col items-start gap-2 rounded-xl border border-border/60 bg-background/30 p-5 text-left hover:border-primary/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15"><Wrench className="h-5 w-5 text-success" /></div>
                <div className="text-sm font-semibold">Log Maintenance</div>
                <div className="text-xs text-muted-foreground">Record completed maintenance work</div>
              </button>
            </div>
          </>
        )}
        {mode === "schedule" && <ScheduleMaintenanceDialog onDone={reset} />}
        {mode === "log" && <LogMaintenanceDialog onDone={reset} />}
      </DialogContent>
    </Dialog>
  );
}

function SearchableTruckSelect({ value, onValueChange }: { value: string; onValueChange: (v: string) => void }) {
  const [search, setSearch] = useState("");
  const filtered = trucks.filter((t) => t.id.toLowerCase().includes(search.toLowerCase()) || t.plate.toLowerCase().includes(search.toLowerCase()) || t.driver.toLowerCase().includes(search.toLowerCase()));
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="mt-1"><SelectValue placeholder="Search and select truck…" /></SelectTrigger>
      <SelectContent>
        <div className="p-2" onClick={(e) => e.stopPropagation()}>
          <Input placeholder="Search trucks…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 text-xs" />
        </div>
        {filtered.slice(0, 20).map((t) => (
          <SelectItem key={t.id} value={t.id}>{t.id} · {t.plate} · {t.driver}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ScheduleMaintenanceDialog({ onDone }: { onDone: () => void }) {
  const [scheduleType, setScheduleType] = useState<"date" | "distance">("date");
  const [title, setTitle] = useState("");
  const [truck, setTruck] = useState("");
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");

  const submit = () => {
    if (!title.trim()) { toast.error("Maintenance title is required"); return; }
    if (!truck) { toast.error("Truck is required"); return; }
    if (scheduleType === "date" && !date) { toast.error("Date is required"); return; }
    if (scheduleType === "distance" && !distance) { toast.error("Distance target is required"); return; }
    toast.success(`Maintenance scheduled for ${truck}`);
    onDone();
  };

  return (
    <>
      <DialogHeader><DialogTitle>Schedule Maintenance</DialogTitle></DialogHeader>
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="col-span-2">
          <Label className="text-[11px] uppercase text-muted-foreground">Maintenance Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Oil Change" className="mt-1" />
        </div>
        <div className="col-span-2">
          <Label className="text-[11px] uppercase text-muted-foreground">Truck</Label>
          <SearchableTruckSelect value={truck} onValueChange={setTruck} />
        </div>
        <div className="col-span-2">
          <Label className="text-[11px] uppercase text-muted-foreground">Schedule By</Label>
          <Select value={scheduleType} onValueChange={(v) => setScheduleType(v as "date" | "distance")}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">By Date</SelectItem>
              <SelectItem value="distance">By Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {scheduleType === "date" ? (
          <div className="col-span-2">
            <Label className="text-[11px] uppercase text-muted-foreground">Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
          </div>
        ) : (
          <div className="col-span-2">
            <Label className="text-[11px] uppercase text-muted-foreground">Distance Target (KM)</Label>
            <Input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g. 10000" className="mt-1" />
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onDone}>Cancel</Button>
        <Button onClick={submit} className="bg-primary text-primary-foreground">Schedule</Button>
      </DialogFooter>
    </>
  );
}

function LogMaintenanceDialog({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [truck, setTruck] = useState("");
  const [cost, setCost] = useState("");
  const [summary, setSummary] = useState("");

  const submit = () => {
    if (!truck) { toast.error("Truck is required"); return; }
    if (!title.trim()) { toast.error("Maintenance title is required"); return; }
    toast.success(`Maintenance logged for ${truck}`);
    onDone();
  };

  return (
    <>
      <DialogHeader><DialogTitle>Log Maintenance</DialogTitle></DialogHeader>
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="col-span-2">
          <Label className="text-[11px] uppercase text-muted-foreground">Truck</Label>
          <SearchableTruckSelect value={truck} onValueChange={setTruck} />
        </div>
        <div>
          <Label className="text-[11px] uppercase text-muted-foreground">Maintenance Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Brake Replacement" className="mt-1" />
        </div>
        <div>
          <Label className="text-[11px] uppercase text-muted-foreground">Cost (₦)</Label>
          <Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="mt-1" />
        </div>
        <div className="col-span-2">
          <Label className="text-[11px] uppercase text-muted-foreground">Summary</Label>
          <Textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Describe work done…" className="mt-1" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onDone}>Cancel</Button>
        <Button onClick={submit} className="bg-primary text-primary-foreground">Log Maintenance</Button>
      </DialogFooter>
    </>
  );
}

function AllScheduledDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const scheduled = maintenanceRecords.filter((m) => m.status === "Scheduled" || m.status === "Overdue");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader><DialogTitle>All Scheduled Maintenance</DialogTitle></DialogHeader>
        <div className="pt-2">
          <UpcomingTable rows={scheduled} />
        </div>
      </DialogContent>
    </Dialog>
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
                  <div><div className="font-semibold text-primary hover:underline">{r.truck}</div><div className="text-[10px] text-muted-foreground">Volvo FH16</div></div>
                </button>
              </td>
              <td className="px-3 py-3 text-xs"><div className="flex items-center gap-2"><Wrench className="h-3.5 w-3.5 text-warning" /><div><div className="font-medium">{r.service}</div><div className="text-[10px] text-muted-foreground">Every 10,000 km</div></div></div></td>
              <td className="px-3 py-3 text-xs"><div>{r.dueDate}</div><div className="text-[10px] text-danger">In {Math.max(1, Math.round(Math.random() * 12) + 1)} days</div></td>
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return r.truck.toLowerCase().includes(s) || r.service.toLowerCase().includes(s) || r.performedBy.toLowerCase().includes(s);
    });
  }, [rows, search, statusFilter]);

  function handleExport() {
    exportCSV(
      "maintenance-records.csv",
      ["ID", "Date", "Truck", "Service", "Type", "Cost", "Status", "Performed By"],
      filtered.map((r) => [r.id, r.date, r.truck, r.service, r.type, r.cost, r.status, r.performedBy]),
    );
    toast.success("Exported maintenance records to CSV");
  }

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
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search maintenance records…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-elevated/60" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-40 text-xs bg-elevated/60"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="In Workshop">In Workshop</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" className="border-border bg-elevated/60" onClick={handleExport}>
          <Download className="mr-1.5 h-3.5 w-3.5" />Export CSV
        </Button>
      </div>
      <DataTable title="Maintenance Records" columns={cols} rows={filtered} searchKeys={[]} pageSize={10} hideToolbar />
    </div>
  );
}


