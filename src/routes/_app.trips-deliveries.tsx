import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { KPICard } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { clients, getRouteFor, exportCSV, type Trip, type PaymentStatus, type TripStatus } from "@/lib/mock-data";
import { useTrips } from "@/lib/trips-store";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { nigerianLocations, nigerianStates } from "@/lib/nigerian-locations";
import { Route as RouteIcon, Package, Clock, TriangleAlert as AlertTriangle, Download, Search, ListFilter as Filter, Plus, X, MapPin, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/trips-deliveries")({
  component: TripsDeliveries,
});

const ALL_STATUSES: TripStatus[] = ["Dispatched", "In Transit", "Delivered", "Delayed", "Scheduled", "Cancelled"];
const ALL_PAYMENTS: PaymentStatus[] = ["Paid", "Pending"];

const naira = (n: number) => "₦" + n.toLocaleString("en-NG", { maximumFractionDigits: 0 });

interface ConfirmState {
  trip: Trip;
  newStatus: PaymentStatus;
  previousStatus: PaymentStatus;
}

interface RouteBuilderState {
  tripId: string;
  origin: string;
  destination: string;
  stops: string[];
}

function TripsDeliveries() {
  const { open } = useProfileDrawer();
  const { trips, updatePaymentStatus, updateTripRoute, updateTripStatus } = useTrips();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [routeBuilder, setRouteBuilder] = useState<RouteBuilderState | null>(null);

  const filtered = useMemo(() => {
    return trips.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (paymentFilter !== "all" && t.paymentStatus !== paymentFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return t.id.toLowerCase().includes(s) || t.customer.toLowerCase().includes(s) || t.driver.toLowerCase().includes(s) || t.truck.toLowerCase().includes(s) || t.origin.toLowerCase().includes(s) || t.destination.toLowerCase().includes(s);
    });
  }, [trips, search, statusFilter, paymentFilter]);

  function handleStatusChange(tripId: string, newStatus: TripStatus) {
    updateTripStatus(tripId, newStatus);
    toast.success(`Trip ${tripId} status updated to ${newStatus}`);
  }

  function handlePaymentChange(tripId: string, newStatus: PaymentStatus) {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;
    if (trip.paymentStatus === newStatus) return;
    setConfirm({ trip, newStatus, previousStatus: trip.paymentStatus });
  }

  function confirmPaymentChange() {
    if (!confirm) return;
    updatePaymentStatus(confirm.trip.id, confirm.newStatus);
    if (confirm.newStatus === "Paid") {
      toast.success(`Payment confirmed for ${confirm.trip.id}`);
    } else {
      toast.success(`Payment status for ${confirm.trip.id} changed to ${confirm.newStatus}`);
    }
    setConfirm(null);
  }

  function openRouteBuilder(trip: Trip) {
    setRouteBuilder({
      tripId: trip.id,
      origin: trip.origin || "",
      destination: trip.destination || "",
      stops: trip.routeStops ?? [],
    });
  }

  function saveRoute() {
    if (!routeBuilder) return;
    if (!routeBuilder.origin) { toast.error("Please select an origin"); return; }
    if (!routeBuilder.destination) { toast.error("Please select a final destination"); return; }
    updateTripRoute(routeBuilder.tripId, {
      origin: routeBuilder.origin,
      destination: routeBuilder.destination,
      stops: routeBuilder.stops.filter(Boolean),
    });
    const routeText = [routeBuilder.origin, ...routeBuilder.stops.filter(Boolean), routeBuilder.destination].join(" → ");
    toast.success(`Route saved for trip ${routeBuilder.tripId}: ${routeText}`);
    setRouteBuilder(null);
  }

  function handleExport() {
    exportCSV(
      "trips-deliveries.csv",
      ["Trip ID", "Customer", "Route", "Driver", "Truck", "Status", "ETA", "Distance", "Revenue", "Payment Status"],
      filtered.map((t) => {
        const hasRoute = !!(t.origin && t.destination);
        const routeText = hasRoute
          ? [t.origin, ...(t.routeStops ?? []), t.destination].join(" → ")
          : "Route Pending";
        return [t.id, t.customer, routeText, t.driver, t.truck, t.status, t.eta, t.distance ? `${t.distance} km` : "—", t.revenue ? naira(t.revenue) : "—", t.paymentStatus];
      }),
    );
    toast.success("Exported trips to CSV");
  }

  const clientIdFor = (name: string) => clients.find((c) => c.name === name)?.id;

  const cols: Column<Trip>[] = [
    { key: "id", label: "Trip ID", render: (r) => (
      <button onClick={() => open({ kind: "trip", id: r.id })} className="font-semibold text-primary hover:underline">{r.id}</button>
    )},
    { key: "customer", label: "Customer", render: (r) => {
      const cid = clientIdFor(r.customer);
      return cid ? <button onClick={() => open({ kind: "client", id: cid })} className="hover:underline">{r.customer}</button> : r.customer;
    }},
    { key: "origin", label: "Route", render: (r) => {
      const hasRoute = !!(r.origin && r.destination);
      if (hasRoute) {
        const route = getRouteFor(r.origin, r.destination, r.routeStops ?? []);
        const routeText = [r.origin, ...(r.routeStops ?? []), r.destination].join(" → ");
        return route ? (
          <button onClick={() => open({ kind: "route", id: route.id })} className="text-xs text-primary hover:underline">{routeText}</button>
        ) : (
          <span className="text-xs text-muted-foreground">{routeText}</span>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground italic">Route Pending</span>
          <button
            onClick={() => openRouteBuilder(r)}
            className="flex items-center gap-0.5 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/20"
          >
            <Plus className="h-3 w-3" /> Add Route
          </button>
        </div>
      );
    }},
    { key: "driver", label: "Driver", render: (r) => (
      <button onClick={() => open({ kind: "driver", id: r.driver })} className="hover:underline">{r.driver}</button>
    )},
    { key: "truck", label: "Truck", render: (r) => (
      <button onClick={() => open({ kind: "truck", id: r.truck })} className="text-primary hover:underline text-xs font-medium">{r.truck}</button>
    )},
    { key: "status", label: "Status", render: (r) => (
      <Select value={r.status} onValueChange={(v) => handleStatusChange(r.id, v as TripStatus)}>
        <SelectTrigger className="h-7 w-32 text-xs border-border/60 bg-elevated/60"><SelectValue /></SelectTrigger>
        <SelectContent>
          {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
    )},
    { key: "eta", label: "ETA", render: (r) => <span className="text-xs">{r.eta}</span> },
    { key: "distance", label: "Distance", render: (r) => <span className="text-xs">{r.distance ? `${r.distance} km` : "—"}</span> },
    { key: "revenue", label: "Revenue", render: (r) => (
      <span className="text-xs font-semibold text-foreground">{r.revenue ? naira(r.revenue) : "—"}</span>
    )},
    { key: "paymentStatus", label: "Payment Status", render: (r) => (
      <Select value={r.paymentStatus} onValueChange={(v) => handlePaymentChange(r.id, v as PaymentStatus)}>
        <SelectTrigger className="h-7 w-28 text-xs border-border/60 bg-elevated/60">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ALL_PAYMENTS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </SelectContent>
      </Select>
    )},
  ];

  const isPendingToPaid = confirm?.previousStatus === "Pending" && confirm?.newStatus === "Paid";
  const isPaidToPending = confirm?.previousStatus === "Paid" && confirm?.newStatus === "Pending";

  return (
    <>
      <Header title="Trips & Deliveries" subtitle="Track every trip from dispatch to proof of delivery" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Active Trips" value="142" icon={RouteIcon} tone="info" delta={{ value: "12", direction: "up" }} />
          <KPICard label="Delivered Today" value="112" icon={Package} tone="success" delta={{ value: "8%", direction: "up" }} />
          <KPICard label="On-Time Rate" value="92.3%" icon={Clock} tone="purple" delta={{ value: "3.2%", direction: "down" }} />
          <KPICard label="Delayed" value="11" icon={AlertTriangle} tone="danger" footnote="4 critical" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by trip ID, customer, driver, truck, route…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-elevated/60"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-40 text-xs bg-elevated/60"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="h-9 w-44 text-xs bg-elevated/60"><SelectValue placeholder="All Payment Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Statuses</SelectItem>
                  {ALL_PAYMENTS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-border bg-elevated/60" onClick={handleExport}>
            <Download className="mr-1.5 h-3.5 w-3.5" />Export CSV
          </Button>
        </div>

        <DataTable title="Trips" columns={cols} rows={filtered} searchKeys={[]} pageSize={10} hideToolbar />
      </div>

      {/* Payment Confirmation Dialog */}
      <Dialog open={!!confirm} onOpenChange={(o) => { if (!o) setConfirm(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isPendingToPaid ? "Mark Payment as Paid?" : "Change Payment Status?"}
            </DialogTitle>
            <DialogDescription>
              {isPendingToPaid ? (
                <>You are about to mark this trip as Paid.</>
              ) : isPaidToPending ? (
                <>You are about to change the payment status for this trip from <strong>Paid</strong> to <strong>Pending</strong>.</>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          {confirm && (
            <div className="space-y-2 rounded-lg border border-border/60 bg-elevated/30 px-4 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trip</span>
                <span className="font-medium">{confirm.trip.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium">{confirm.trip.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-semibold text-foreground">{confirm.trip.revenue ? naira(confirm.trip.revenue) : "—"}</span>
              </div>
            </div>
          )}

          {isPendingToPaid && (
            <p className="text-sm text-muted-foreground">Please confirm that payment for this trip has been received.</p>
          )}
          {isPaidToPending && (
            <p className="text-sm text-muted-foreground">Are you sure you want to continue?</p>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirm(null)}>Cancel</Button>
            <Button onClick={confirmPaymentChange}>
              {isPendingToPaid ? "Confirm Payment" : "Confirm Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Route Builder Dialog */}
      {routeBuilder && (
        <RouteBuilderDialog
          state={routeBuilder}
          onChange={setRouteBuilder}
          onClose={() => setRouteBuilder(null)}
          onSave={saveRoute}
        />
      )}
    </>
  );
}

function LocationSelect({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [customLocations, setCustomLocations] = useState<{ name: string; state: string }[]>([]);
  const [addNewOpen, setAddNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newState, setNewState] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const allLocations = useMemo(() => {
    const combined = [...nigerianLocations, ...customLocations];
    if (!searchQuery) return combined;
    const q = searchQuery.toLowerCase();
    return combined.filter((l) => l.name.toLowerCase().includes(q));
  }, [customLocations, searchQuery]);

  function handleAddNew() {
    if (!newName.trim()) { toast.error("Location name is required"); return; }
    const newLoc = { name: newName.trim(), state: newState || "Unknown" };
    setCustomLocations((prev) => [...prev, newLoc]);
    onChange(newLoc.name);
    setNewName(""); setNewState("");
    setAddNewOpen(false);
    toast.success(`Location "${newLoc.name}" added`);
  }

  return (
    <div className="relative">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-elevated/60">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <div className="px-2 pb-2">
            <Input
              placeholder="Search location…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-xs"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          {allLocations.length === 0 && (
            <div className="px-3 py-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">No matching location found.</p>
              <button
                onClick={() => setAddNewOpen(true)}
                className="flex items-center gap-1 mx-auto text-xs text-primary hover:underline"
              >
                <Plus className="h-3 w-3" /> Add New Location
              </button>
            </div>
          )}
          {allLocations.map((loc) => (
            <SelectItem key={loc.name} value={loc.name}>
              {loc.name} <span className="text-muted-foreground">· {loc.state}</span>
            </SelectItem>
          ))}
          {allLocations.length > 0 && (
            <div className="border-t border-border/60 pt-2 mt-1">
              <button
                onClick={() => setAddNewOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 w-full text-xs text-primary hover:underline"
              >
                <Plus className="h-3 w-3" /> Add New Location
              </button>
            </div>
          )}
        </SelectContent>
      </Select>

      {addNewOpen && (
        <Dialog open={addNewOpen} onOpenChange={setAddNewOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label className="text-[11px] uppercase text-muted-foreground">Location Name *</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter location" className="mt-1" />
              </div>
              <div>
                <Label className="text-[11px] uppercase text-muted-foreground">State / Region (Optional)</Label>
                <Select value={newState} onValueChange={setNewState}>
                  <SelectTrigger className="mt-1 bg-elevated/60"><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {nigerianStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setAddNewOpen(false)}>Cancel</Button>
              <Button onClick={handleAddNew} className="bg-primary text-primary-foreground">Add Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function RouteBuilderDialog({ state, onChange, onClose, onSave }: {
  state: RouteBuilderState;
  onChange: (s: RouteBuilderState) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  function addStop() {
    onChange({ ...state, stops: [...state.stops, ""] });
  }
  function removeStop(index: number) {
    onChange({ ...state, stops: state.stops.filter((_, i) => i !== index) });
  }
  function updateStop(index: number, value: string) {
    onChange({ ...state, stops: state.stops.map((s, i) => (i === index ? value : s)) });
  }

  const routePreview = [state.origin, ...state.stops.filter(Boolean), state.destination].filter(Boolean).join(" → ");

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Route · {state.tripId}</DialogTitle>
          <DialogDescription>Build the route for this trip. Add stops between origin and destination as needed.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
          <div>
            <Label className="text-[11px] uppercase text-muted-foreground">Origin *</Label>
            <div className="mt-1">
              <LocationSelect value={state.origin} onChange={(v) => onChange({ ...state, origin: v })} placeholder="Select Origin" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label className="text-[11px] uppercase text-muted-foreground">Stops (Optional)</Label>
              <button onClick={addStop} className="flex items-center gap-0.5 text-[11px] text-primary hover:underline">
                <Plus className="h-3 w-3" /> Add Stop
              </button>
            </div>
            <div className="mt-1 space-y-2">
              {state.stops.length === 0 && (
                <p className="text-xs text-muted-foreground py-1">No stops added. This will be a direct route.</p>
              )}
              {state.stops.map((stop, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground shrink-0 w-12">Stop {i + 1}</span>
                  <div className="flex-1">
                    <LocationSelect value={stop} onChange={(v) => updateStop(i, v)} placeholder="Select Location" />
                  </div>
                  <button onClick={() => removeStop(i)} className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-danger hover:bg-danger/10">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-[11px] uppercase text-muted-foreground">Destination *</Label>
            <div className="mt-1">
              <LocationSelect value={state.destination} onChange={(v) => onChange({ ...state, destination: v })} placeholder="Select Destination" />
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-elevated/30 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3 w-3" /> Route Preview
            </div>
            <div className="mt-2 flex items-center flex-wrap gap-1 text-sm font-medium">
              {routePreview ? (
                routePreview.split(" → ").map((loc, i, arr) => (
                  <span key={i} className="flex items-center gap-1">
                    <span>{loc}</span>
                    {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground text-xs">Select origin and destination to preview the route</span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave} className="bg-primary text-primary-foreground">Save Route</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
