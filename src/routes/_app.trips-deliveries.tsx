import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { trips as rawTrips, clients, routes, getRouteFor, exportCSV, type Trip } from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Route as RouteIcon, Package, Clock, TriangleAlert as AlertTriangle, Download, Search, ListFilter as Filter } from "lucide-react";

export const Route = createFileRoute("/_app/trips-deliveries")({
  component: TripsDeliveries,
});

const tone = { "In Transit": "info", "Delivered": "success", "Delayed": "danger", "Scheduled": "warning", "Cancelled": "purple" } as const;
const ALL_STATUSES = ["In Transit", "Delivered", "Delayed", "Scheduled", "Cancelled"] as const;

function TripsDeliveries() {
  const { open } = useProfileDrawer();
  const [trips, setTrips] = useState<Trip[]>(rawTrips);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return trips.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return t.id.toLowerCase().includes(s) || t.customer.toLowerCase().includes(s) || t.driver.toLowerCase().includes(s) || t.truck.toLowerCase().includes(s) || t.origin.toLowerCase().includes(s) || t.destination.toLowerCase().includes(s);
    });
  }, [trips, search, statusFilter]);

  function handleStatusChange(tripId: string, newStatus: string) {
    setTrips((prev) => prev.map((t) => t.id === tripId ? { ...t, status: newStatus as Trip["status"] } : t));
    toast.success(`Trip ${tripId} status updated to ${newStatus}`);
    if (newStatus === "On Trip") {
      toast.info("Route dialog would open here to create/attach route");
    }
  }

  function handleExport() {
    exportCSV(
      "trips-deliveries.csv",
      ["Trip ID", "Customer", "Origin", "Destination", "Driver", "Truck", "Status", "ETA", "Distance"],
      filtered.map((t) => [t.id, t.customer, t.origin, t.destination, t.driver, t.truck, t.status, t.eta, `${t.distance} km`]),
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
      const route = getRouteFor(r.origin, r.destination);
      return route ? (
        <button onClick={() => open({ kind: "route", id: route.id })} className="text-xs text-primary hover:underline">{r.origin} → {r.destination}</button>
      ) : (
        <span className="text-xs text-muted-foreground">{r.origin} → {r.destination}</span>
      );
    }},
    { key: "driver", label: "Driver", render: (r) => (
      <button onClick={() => open({ kind: "driver", id: r.driver })} className="hover:underline">{r.driver}</button>
    )},
    { key: "truck", label: "Truck", render: (r) => (
      <button onClick={() => open({ kind: "truck", id: r.truck })} className="text-primary hover:underline text-xs font-medium">{r.truck}</button>
    )},
    { key: "status", label: "Status", render: (r) => (
      <Select value={r.status} onValueChange={(v) => handleStatusChange(r.id, v)}>
        <SelectTrigger className="h-7 w-32 text-xs border-border/60 bg-elevated/60"><SelectValue /></SelectTrigger>
        <SelectContent>
          {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
    )},
    { key: "eta", label: "ETA" },
    { key: "distance", label: "Distance", render: (r) => <span className="text-xs">{r.distance} km</span> },
  ];

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
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-border bg-elevated/60" onClick={handleExport}>
            <Download className="mr-1.5 h-3.5 w-3.5" />Export CSV
          </Button>
        </div>

        <DataTable title="Trips" columns={cols} rows={filtered} searchKeys={[]} pageSize={10} />
      </div>
    </>
  );
}
