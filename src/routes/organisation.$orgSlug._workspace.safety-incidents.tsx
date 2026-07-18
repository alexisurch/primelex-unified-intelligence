import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { incidents as rawIncidents, trucks, drivers, trips, exportCSV, type Incident } from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { ShieldAlert, OctagonAlert as AlertOctagon, MailWarning as FileWarning, TrendingUp, Plus, Search, Download, ListFilter as Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/organisation/$orgSlug/_workspace/safety-incidents")({
  component: SafetyIncidents,
});

const sevTone = { Low: "info", Moderate: "warning", High: "danger", Critical: "purple" } as const;
const stTone = { Open: "danger", Investigating: "warning", Resolved: "success" } as const;
const ALL_SEVERITIES = ["Low", "Moderate", "High", "Critical"] as const;
const ALL_STATUSES = ["Open", "Investigating", "Resolved"] as const;

function SafetyIncidents() {
  const { open } = useProfileDrawer();
  const [search, setSearch] = useState("");
  const [sevFilter, setSevFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return rawIncidents.filter((r) => {
      if (sevFilter !== "all" && r.severity !== sevFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return r.id.toLowerCase().includes(s) || r.type.toLowerCase().includes(s) || r.driver.toLowerCase().includes(s) || r.truck.toLowerCase().includes(s) || r.location.toLowerCase().includes(s);
    });
  }, [search, sevFilter, statusFilter]);

  function handleExport() {
    exportCSV(
      "incidents.csv",
      ["ID", "Type", "Driver", "Truck", "Trip", "Location", "Date", "Severity", "Status"],
      filtered.map((r) => [r.id, r.type, r.driver, r.truck, r.trip ?? "", r.location, r.date, r.severity, r.status]),
    );
    toast.success("Exported incidents to CSV");
  }

  const cols: Column<Incident>[] = [
    { key: "id", label: "Incident", render: (r) => (
      <button onClick={() => open({ kind: "incident", id: r.id })} className="font-semibold text-primary hover:underline">{r.id}</button>
    )},
    { key: "type", label: "Type", render: (r) => <Pill tone="info">{r.type}</Pill> },
    { key: "driver", label: "Driver", render: (r) => <button onClick={() => open({ kind: "driver", id: r.driver })} className="hover:underline">{r.driver}</button> },
    { key: "truck", label: "Truck", render: (r) => <button onClick={() => open({ kind: "truck", id: r.truck })} className="text-primary hover:underline">{r.truck}</button> },
    { key: "trip", label: "Trip", render: (r) => r.trip ? <button onClick={() => open({ kind: "trip", id: r.trip! })} className="text-primary hover:underline text-xs">{r.trip}</button> : "—" },
    { key: "location", label: "Location" },
    { key: "date", label: "Date" },
    { key: "severity", label: "Severity", render: (r) => <Pill tone={sevTone[r.severity]}>{r.severity}</Pill> },
    { key: "status", label: "Status", render: (r) => <Pill tone={stTone[r.status]}>{r.status}</Pill> },
  ];

  return (
    <>
      <Header title="Safety & Incidents" subtitle="Master incident register — every incident updates linked trucks, drivers, trips and clients" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Safety Score" value="92" icon={ShieldAlert} tone="success" delta={{ value: "2.4", direction: "up" }} />
          <KPICard label="Open Incidents" value={String(rawIncidents.filter(i => i.status === "Open").length)} icon={AlertOctagon} tone="danger" footnote="3 critical" />
          <KPICard label="Insurance Claims" value="₦42M" icon={FileWarning} tone="warning" delta={{ value: "12%", direction: "down" }} />
          <KPICard label="Near Miss Reports" value="18" icon={TrendingUp} tone="purple" delta={{ value: "4", direction: "up" }} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by ID, type, driver, truck, location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-elevated/60"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={sevFilter} onValueChange={setSevFilter}>
                <SelectTrigger className="h-9 w-36 text-xs bg-elevated/60"><SelectValue placeholder="All Severities" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  {ALL_SEVERITIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-36 text-xs bg-elevated/60"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-border bg-elevated/60" onClick={handleExport}>
              <Download className="mr-1.5 h-3.5 w-3.5" />Export CSV
            </Button>
            <ReportIncidentDialog />
          </div>
        </div>

        <DataTable title="Incident Register" columns={cols} rows={filtered} searchKeys={[]} pageSize={10} hideToolbar />
      </div>
    </>
  );
}

function SearchableSelect({ options, value, onValueChange, placeholder, searchPlaceholder }: {
  options: { value: string; label: string }[];
  value: string;
  onValueChange: (v: string) => void;
  placeholder: string;
  searchPlaceholder: string;
}) {
  const [search, setSearch] = useState("");
  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="mt-1"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        <div className="p-2" onClick={(e) => e.stopPropagation()}>
          <Input placeholder={searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 text-xs" />
        </div>
        {filtered.slice(0, 20).map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ReportIncidentDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: "Accident", severity: "Moderate", truck: "", driver: "", trip: "", location: "", description: "" });

  const truckOptions = trucks.map((t) => ({ value: t.id, label: `${t.id} · ${t.plate} · ${t.driver}` }));
  const driverOptions = drivers.map((d) => ({ value: d.name, label: `${d.name} · ${d.truck}` }));
  const tripOptions = trips.map((t) => ({ value: t.id, label: `${t.id} · ${t.origin} → ${t.destination}` }));

  function handleTruckChange(truckId: string) {
    const truck = trucks.find((t) => t.id === truckId);
    const driverName = truck?.driver ?? "";
    const activeTrip = trips.find((t) => t.truck === truckId && (t.status === "In Transit" || t.status === "Scheduled"));
    setForm((prev) => ({ ...prev, truck: truckId, driver: driverName, trip: activeTrip?.id ?? prev.trip }));
  }
  function handleDriverChange(driverName: string) {
    const driver = drivers.find((d) => d.name === driverName);
    const truckId = driver?.truck ?? "";
    const activeTrip = trips.find((t) => t.driver === driverName && (t.status === "In Transit" || t.status === "Scheduled"));
    setForm((prev) => ({ ...prev, driver: driverName, truck: truckId, trip: activeTrip?.id ?? prev.trip }));
  }
  function handleTripChange(tripId: string) {
    const trip = trips.find((t) => t.id === tripId);
    setForm((prev) => ({ ...prev, trip: tripId, truck: trip?.truck ?? prev.truck, driver: trip?.driver ?? prev.driver }));
  }

  const submit = () => {
    if (!form.truck && !form.driver) { toast.error("Provide a truck or driver"); return; }
    toast.success("Incident reported — all linked records updated");
    setOpen(false);
    setForm({ type: "Accident", severity: "Moderate", truck: "", driver: "", trip: "", location: "", description: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="mr-1.5 h-4 w-4" />Report Incident</Button></DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Report Incident</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div><Label className="text-[11px] uppercase text-muted-foreground">Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{["Accident","Cargo Damage","Vehicle Breakdown","Theft","Driver Misconduct","Delivery Issue","Other"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Severity</Label>
            <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{["Low","Moderate","High","Critical"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Truck</Label>
            <SearchableSelect options={truckOptions} value={form.truck} onValueChange={handleTruckChange} placeholder="Search truck…" searchPlaceholder="Search trucks…" />
          </div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Driver</Label>
            <SearchableSelect options={driverOptions} value={form.driver} onValueChange={handleDriverChange} placeholder="Search driver…" searchPlaceholder="Search drivers…" />
          </div>
          <div className="col-span-2"><Label className="text-[11px] uppercase text-muted-foreground">Trip</Label>
            <SearchableSelect options={tripOptions} value={form.trip} onValueChange={handleTripChange} placeholder="Search trip…" searchPlaceholder="Search trips…" />
          </div>
          <div className="col-span-2"><Label className="text-[11px] uppercase text-muted-foreground">Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="mt-1" /></div>
          <div className="col-span-2"><Label className="text-[11px] uppercase text-muted-foreground">Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit} className="bg-primary text-primary-foreground">Report Incident</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
