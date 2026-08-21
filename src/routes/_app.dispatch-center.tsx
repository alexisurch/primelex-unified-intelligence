import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard, Pill } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import { trucks, drivers, clients, getTruckAvgLkm, exportCSV, type Client } from "@/lib/mock-data";
import { useTrips, formatRouteDisplay, isRoutePending } from "@/lib/trips-store";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { DispatchDialog } from "@/components/shared/DispatchDialog";
import { RouteEditorDialog } from "@/components/shared/RouteEditorDialog";
import { useFleetManagers } from "@/lib/fleet-managers-store";
import { usePreferences } from "@/lib/preferences";
import { toast } from "sonner";
import {
  Search, MapPin, Truck as TruckIcon, Plus, Minus, Layers, Locate, X, Phone, Satellite, EyeOff, UserCog, Building2, ArrowUpDown, ClipboardList,
} from "lucide-react";

export const Route = createFileRoute("/_app/dispatch-center")({
  component: DispatchCenter,
});

function DispatchCenter() {
  const { open } = useProfileDrawer();
  const { getManagerForTruck } = useFleetManagers();
  const { trackingMode } = usePreferences();
  const { trips: storeTrips, isTruckAvailable } = useTrips();
  const isManual = trackingMode === "manual";
  const [pickup, setPickup] = useState("ABC Stores, 27 Warehouse Road, Ikeja, Lagos");
  const [truckType, setTruckType] = useState("any");
  const [selectedId, setSelectedId] = useState<string>("");
  const [detailOpen, setDetailOpen] = useState(true);
  const [selectedClient, setSelectedClient] = useState("none");
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [clientList, setClientList] = useState(clients);
  const [sortBy, setSortBy] = useState<"distance" | "plate" | "driver">("distance");
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [dispatchPreselect, setDispatchPreselect] = useState<string | undefined>(undefined);
  const [routeEditTripId, setRouteEditTripId] = useState<string | null>(null);

  const available = useMemo(() => {
    const filtered = trucks.filter(t => isTruckAvailable(t.id)).slice(0, 6).map((t, i) => ({
      ...t,
      distanceKm: [8.2, 9.7, 11.3, 14.8, 20.1, 22.4][i] ?? (8 + i * 3),
      tone: (["success","success","success","warning","danger","danger"] as const)[i] ?? "success",
      avgLkm: getTruckAvgLkm(t.id),
    }));
    if (sortBy === "distance") filtered.sort((a, b) => a.distanceKm - b.distanceKm);
    else if (sortBy === "plate") filtered.sort((a, b) => a.plate.localeCompare(b.plate));
    else filtered.sort((a, b) => a.driver.localeCompare(b.driver));
    return filtered;
  }, [sortBy, isTruckAvailable]);

  const selected = available.find(t => t.id === selectedId) ?? available[0];
  const selectedDriver = drivers.find(d => d.name === selected?.driver);

  const dispatchedTrips = storeTrips.filter(t => t.status === "Dispatched");
  const routeEditTrip = storeTrips.find(t => t.id === routeEditTripId) ?? null;

  function handleAddClient(name: string) {
    const newClient: Client = {
      id: `CLI-${300 + clientList.length}`,
      name,
      industry: "Logistics",
      contact: "",
      phone: "",
      email: "",
      address: "",
      since: new Date().toISOString().split("T")[0],
      status: "Active",
    };
    setClientList((prev) => [...prev, newClient]);
    setSelectedClient(newClient.id);
    toast.success(`Client "${name}" created and added to dropdown`);
  }

  return (
    <>
      <Header title="Dispatch Command Center" subtitle="Find and dispatch the best available trucks near any location" />
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_1fr]">
          {/* LEFT rail */}
          <div className="space-y-4">
            <GlassCard hover={false} className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">1</span>
                <h3 className="text-sm font-semibold">Where do you need a truck?</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Enter pickup location</label>
                  <div className="relative mt-1">
                    <Input value={pickup} onChange={(e) => setPickup(e.target.value)} className="pr-9 bg-elevated/60" />
                    <Locate className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Client / Company</label>
                    <button type="button" onClick={() => setAddClientOpen(true)} className="flex items-center gap-0.5 text-[11px] text-primary hover:underline">
                      <Plus className="h-3 w-3" /> Add Client
                    </button>
                  </div>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="mt-1 bg-elevated/60"><SelectValue placeholder="Select client" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No client selected</SelectItem>
                      {clientList.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Truck Type / Capacity (Optional)</label>
                  <Select value={truckType} onValueChange={setTruckType}>
                    <SelectTrigger className="mt-1 bg-elevated/60"><SelectValue placeholder="Select type or capacity" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any type</SelectItem>
                      <SelectItem value="box">Box Truck</SelectItem>
                      <SelectItem value="rigid">Rigid Truck</SelectItem>
                      <SelectItem value="artic">Articulated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => toast.success("Search updated")}>
                  <Search className="mr-2 h-4 w-4" />Find Available Trucks
                </Button>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">2</span>
                <h3 className="text-sm font-semibold">Available Trucks</h3>
              </div>
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{available.length} trucks found{!isManual && " within 25 km"}</span>
                <button
                  type="button"
                  onClick={() => setSortBy(sortBy === "distance" ? "plate" : sortBy === "plate" ? "driver" : "distance")}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <ArrowUpDown className="h-3 w-3" /> Sort: {sortBy === "distance" ? "Distance" : sortBy === "plate" ? "Plate" : "Driver"}
                </button>
              </div>
              <div className="space-y-2.5">
                {available.map((t) => {
                  const active = t.id === selectedId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setSelectedId(t.id); setDetailOpen(true); }}
                      className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${active ? "border-primary bg-primary/10" : "border-border/60 bg-background/30 hover:border-primary/40"}`}
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-elevated/60"><TruckIcon className="h-7 w-7 text-muted-foreground" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {!isManual && <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold text-white bg-${t.tone}`}>{t.distanceKm} km</span>}
                          <span className="text-sm font-semibold">{t.plate}</span>
                          <Pill tone="success">Available</Pill>
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground">{t.model} · 20 Ton · Box Truck</div>
                        <div className="text-[11px] text-muted-foreground">Driver: {t.driver}</div>
                        <div className="text-[11px] text-muted-foreground">Current: {t.location.split(" → ")[0]}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 text-center text-xs text-muted-foreground">Can't find what you need? <button className="text-primary hover:underline">Expand search area</button></div>
            </GlassCard>
          </div>

          {/* RIGHT map + detail */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-border/60" style={{ minHeight: 520 }}>
              {isManual ? (
                <div className="flex h-[520px] w-full flex-col items-center justify-center gap-3 bg-[#0d1a2b] text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning/15"><EyeOff className="h-6 w-6 text-warning" /></div>
                  <div className="text-sm font-semibold text-white">Manual Tracking Mode</div>
                  <p className="max-w-sm text-xs text-white/60">Live vehicle markers, live route tracking and live movement are disabled. Operations staff provide location updates from the trip and truck profiles.</p>
                  <div className="mt-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/70 flex items-center gap-1.5"><Satellite className="h-3 w-3" /> Switch to Automated Tracking in System Settings to enable the live map.</div>
                </div>
              ) : (
                <>
                  <MapCanvas trucks={available} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setDetailOpen(true); }} />
                  <div className="absolute right-3 top-3 flex flex-col gap-1">
                    <button className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/70 backdrop-blur hover:bg-background"><Plus className="h-4 w-4" /></button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/70 backdrop-blur hover:bg-background"><Minus className="h-4 w-4" /></button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/70 backdrop-blur hover:bg-background"><Layers className="h-4 w-4" /></button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/70 backdrop-blur hover:bg-background"><Locate className="h-4 w-4" /></button>
                  </div>
                  <button className="absolute right-16 top-3 flex items-center gap-2 rounded-md border border-border bg-background/70 backdrop-blur px-3 py-2 text-xs hover:bg-background">
                    <Search className="h-3.5 w-3.5" /> Search in this area
                  </button>
                </>
              )}
            </div>

            {selected && detailOpen && (
              <GlassCard hover={false} className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Selected Truck</div>
                    <div className="mt-1 flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{selected.plate}</h3>
                      <Pill tone="success">Available</Pill>
                      {!isManual && <span className="text-xs text-muted-foreground">{selected.distanceKm} km away</span>}
                    </div>
                  </div>
                  <button onClick={() => setDetailOpen(false)}><X className="h-4 w-4 text-muted-foreground hover:text-foreground" /></button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-border/60 bg-background/30 p-4 flex flex-col items-center justify-center">
                    <div className="flex h-24 w-full items-center justify-center rounded-lg bg-elevated/60"><TruckIcon className="h-10 w-10 text-muted-foreground" /></div>
                    {selectedDriver && (
                      <div className="mt-3 flex items-center gap-2 text-left">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-[11px] font-semibold text-primary">{selected.driver.split(" ").map(w => w[0]).join("").slice(0,2)}</div>
                        <div>
                          <div className="text-xs font-semibold">{selected.driver}</div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1"><Phone className="h-2.5 w-2.5" />+234 803 000 0000</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <DetailCol title="Truck Details" rows={[
                    ["Truck Type", "Box Truck"], ["Make / Model", selected.model], ["Capacity", "20 Ton"],
                    ["Length", "9.5 m"], ["Height", "2.6 m"], ["Fuel Type", "Diesel"], ["Reg. Year", "2021"],
                  ]} />
                  <DetailCol title="Current Status" rows={[
                    ["Location", selected.location.split(" → ")[0]], ["Status", "Available"], ["Last Update", `${3}m ago`],
                    ["Odometer", `${selected.odometer.toLocaleString()} km`], ["Current L/km", selected.avgLkm ? selected.avgLkm.toFixed(2) : "—"],
                    ...(!isManual ? [["Distance Away", `${selected.distanceKm} km`] as [string,string]] : []),
                  ]} />
                </div>

                {(() => { const fm = getManagerForTruck(selected.id); return fm ? (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-border/60 bg-background/30 px-3 py-2 text-xs">
                    <UserCog className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Fleet Manager:</span>
                    <button onClick={() => open({ kind: "fleet-manager", id: fm.id })} className="text-primary font-medium hover:underline">{fm.name}</button>
                  </div>
                ) : null; })()}

                <div className="mt-5 flex items-center justify-between">
                  <Button variant="outline" className="border-border bg-elevated/60" disabled={isManual}><MapPin className="mr-2 h-3.5 w-3.5" />View Live Location</Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-border bg-elevated/60" onClick={() => open({ kind: "truck", id: selected.id })}>View Full Truck Profile</Button>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setDispatchPreselect(selected.id); setDispatchOpen(true); }}>Dispatch This Truck</Button>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        </div>

        {dispatchedTrips.length > 0 && (
          <GlassCard hover={false} className="mt-4 p-5">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Active Dispatched Trips</h3>
              <Pill tone="info">{dispatchedTrips.length}</Pill>
            </div>
            <div className="overflow-hidden rounded-xl border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-elevated/70">
                  <tr>{["Trip","Truck","Driver","Client","Route","Status",""].map((h) => <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {dispatchedTrips.map((tp) => {
                    const truck = trucks.find(t => t.id === tp.truck);
                    return (
                      <tr key={tp.id} className="border-t border-border/60 hover:bg-white/[0.03]">
                        <td className="px-4 py-3 text-xs"><button onClick={() => open({ kind: "trip", id: tp.id })} className="font-semibold text-primary hover:underline">{tp.id}</button></td>
                        <td className="px-4 py-3 text-xs"><button onClick={() => open({ kind: "truck", id: tp.truck })} className="text-primary hover:underline">{truck?.plate ?? tp.truck}</button></td>
                        <td className="px-4 py-3 text-xs">{tp.driver}</td>
                        <td className="px-4 py-3 text-xs">{tp.customer}</td>
                        <td className="px-4 py-3 text-xs">{isRoutePending(tp) ? <span className="text-muted-foreground italic">Route Pending</span> : <span className="text-foreground">{formatRouteDisplay(tp.routeStops)}</span>}</td>
                        <td className="px-4 py-3"><Pill tone="warning">Dispatched</Pill></td>
                        <td className="px-4 py-3"><Button size="sm" variant="outline" className="h-7 text-[11px] border-border bg-elevated/60" onClick={() => setRouteEditTripId(tp.id)}>{isRoutePending(tp) ? "Add Route" : "Update Route"}</Button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>

      <DispatchDialog open={dispatchOpen} onOpenChange={setDispatchOpen} preselectedTruckId={dispatchPreselect} />
      <RouteEditorDialog open={!!routeEditTripId} onOpenChange={(v) => { if (!v) setRouteEditTripId(null); }} trip={routeEditTrip} />
      <AddClientDialog open={addClientOpen} onOpenChange={setAddClientOpen} onAdd={handleAddClient} />
    </>
  );
}

function AddClientDialog({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (v: boolean) => void; onAdd: (name: string) => void }) {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!name.trim()) { toast.error("Client name is required"); return; }
    onAdd(name.trim());
    setName(""); setIndustry(""); setContact(""); setPhone("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Add New Client</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="col-span-2">
            <Label className="text-[11px] uppercase text-muted-foreground">Client Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. ABC Logistics" className="mt-1" />
          </div>
          <div>
            <Label className="text-[11px] uppercase text-muted-foreground">Industry (Optional)</Label>
            <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Logistics" className="mt-1" />
          </div>
          <div>
            <Label className="text-[11px] uppercase text-muted-foreground">Contact Person (Optional)</Label>
            <Input value={contact} onChange={(e) => setContact(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-[11px] uppercase text-muted-foreground">Phone (Optional)</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-primary text-primary-foreground">Add Client</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailCol({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/30 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="mt-3 space-y-2 text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">{k}</span>
            <span className="font-medium text-right">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapCanvas({ trucks: list, selectedId, onSelect }: { trucks: Array<{ id: string; plate: string; distanceKm: number; tone: "success"|"warning"|"danger" }>; selectedId: string; onSelect: (id: string) => void }) {
  const positions = [
    { x: 32, y: 30 }, { x: 55, y: 26 }, { x: 72, y: 40 }, { x: 78, y: 55 }, { x: 40, y: 70 }, { x: 55, y: 78 },
  ];
  return (
    <div className="relative h-full w-full bg-[#0d1a2b]" style={{ minHeight: 520 }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="road" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1e3a5f" /><stop offset="1" stopColor="#0d1a2b" /></linearGradient>
        </defs>
        <path d="M 0 45 C 30 40, 60 55, 100 30" stroke="#1a3355" strokeWidth="1.5" fill="none" />
        <path d="M 20 100 L 55 55 L 100 40" stroke="#1a3355" strokeWidth="1.5" fill="none" />
        <path d="M 0 80 L 100 75" stroke="#1a3355" strokeWidth="1" fill="none" />
        <path d="M 50 0 L 50 100" stroke="#1a3355" strokeWidth="1" fill="none" />
      </svg>
      {[
        { x: 25, y: 20, name: "Ikeja" }, { x: 60, y: 20, name: "Oshodi" }, { x: 78, y: 35, name: "Mushin" },
        { x: 45, y: 55, name: "Yaba" }, { x: 62, y: 60, name: "Surulere" }, { x: 55, y: 82, name: "Lagos" },
        { x: 75, y: 82, name: "Victoria Island" }, { x: 88, y: 78, name: "Lekki" },
      ].map((c) => (
        <div key={c.name} className="absolute -translate-x-1/2 text-[11px] font-medium text-white/70" style={{ left: `${c.x}%`, top: `${c.y}%` }}>{c.name}</div>
      ))}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: "48%", top: "45%" }}>
        <div className="relative">
          <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-danger/30" />
          <MapPin className="relative h-8 w-8 text-danger drop-shadow-lg" fill="currentColor" />
        </div>
      </div>
      {list.map((t, i) => {
        const p = positions[i] ?? { x: 50, y: 50 };
        const active = t.id === selectedId;
        const bg = t.tone === "success" ? "bg-success" : t.tone === "warning" ? "bg-warning" : "bg-danger";
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-white shadow-lg ${bg} ${active ? "ring-2 ring-white" : ""}`}>
              <TruckIcon className="h-3 w-3" />{t.distanceKm} km
            </div>
            <div className={`mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent ${t.tone === "success" ? "border-t-success" : t.tone === "warning" ? "border-t-warning" : "border-t-danger"}`} />
          </button>
        );
      })}
    </div>
  );
}
