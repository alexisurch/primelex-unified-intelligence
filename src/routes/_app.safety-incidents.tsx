import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { incidents, type Incident } from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { ShieldAlert, AlertOctagon, FileWarning, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/safety-incidents")({
  component: SafetyIncidents,
});

const sevTone = { Low: "info", Moderate: "warning", High: "danger", Critical: "purple" } as const;
const stTone = { Open: "danger", Investigating: "warning", Resolved: "success" } as const;

function SafetyIncidents() {
  const { open } = useProfileDrawer();
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
          <KPICard label="Open Incidents" value={String(incidents.filter(i => i.status === "Open").length)} icon={AlertOctagon} tone="danger" footnote="3 critical" />
          <KPICard label="Insurance Claims" value="₦42M" icon={FileWarning} tone="warning" delta={{ value: "12%", direction: "down" }} />
          <KPICard label="Near Miss Reports" value="18" icon={TrendingUp} tone="purple" delta={{ value: "4", direction: "up" }} />
        </div>
        <div className="flex items-center justify-end"><ReportIncidentDialog /></div>
        <DataTable title="Incident Register" columns={cols} rows={incidents} searchKeys={["id","driver","truck","location","trip"]} pageSize={10} />
      </div>
    </>
  );
}

function ReportIncidentDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: "Accident", severity: "Moderate", truck: "", driver: "", trip: "", location: "", description: "" });
  const submit = () => {
    if (!form.truck && !form.driver) { toast.error("Provide a truck or driver"); return; }
    toast.success("Incident reported — all linked records updated");
    setOpen(false);
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
              <SelectContent>
                {["Accident","Cargo Damage","Vehicle Breakdown","Theft","Driver Misconduct","Delivery Issue","Other"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Severity</Label>
            <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{["Low","Moderate","High","Critical"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Truck</Label><Input value={form.truck} onChange={(e) => setForm({ ...form, truck: e.target.value })} placeholder="TRK-1000" className="mt-1" /></div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Driver</Label><Input value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} className="mt-1" /></div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Trip</Label><Input value={form.trip} onChange={(e) => setForm({ ...form, trip: e.target.value })} placeholder="TRP-7300" className="mt-1" /></div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="mt-1" /></div>
          <div className="col-span-2"><Label className="text-[11px] uppercase text-muted-foreground">Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit} className="bg-primary text-primary-foreground">Report Incident</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
