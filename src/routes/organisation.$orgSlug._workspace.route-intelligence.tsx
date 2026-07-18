import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill, SectionCard } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Route as RouteIcon, MapPin, Activity, Fuel, ShieldAlert, Search, Download } from "lucide-react";
import { routes, trips, incidents, tripFuelHistory, exportCSV, type RouteEntity } from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { toast } from "sonner";

export const Route = createFileRoute("/organisation/$orgSlug/_workspace/route-intelligence")({
  component: RouteIntelligence,
});

interface Row extends RouteEntity {
  trips: number;
  active: number;
  completed: number;
  incidents: number;
  avgLpk: string;
}

function RouteIntelligence() {
  const { open } = useProfileDrawer();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const allRows: Row[] = useMemo(() => {
    return routes.map((r) => {
      const rTrips = trips.filter((t) => t.origin === r.origin && t.destination === r.destination);
      const rHist = tripFuelHistory.filter((h) => h.routeId === r.id);
      const dist = rHist.reduce((s, h) => s + h.distanceKm, 0);
      const fuel = rHist.reduce((s, h) => s + h.assignedFuelL, 0);
      return {
        ...r,
        trips: rTrips.length,
        active: rTrips.filter((t) => t.status === "In Transit" || t.status === "Scheduled").length,
        completed: rTrips.filter((t) => t.status === "Delivered").length,
        incidents: incidents.filter((i) => {
          const tp = trips.find((t) => t.id === i.trip);
          return tp && tp.origin === r.origin && tp.destination === r.destination;
        }).length,
        avgLpk: dist ? (fuel / dist).toFixed(2) : "—",
      };
    });
  }, []);

  const filtered = useMemo(() => {
    return allRows.filter((r) => {
      if (statusFilter !== "all") {
        if (statusFilter === "active" && r.active === 0) return false;
        if (statusFilter === "completed" && r.completed === 0) return false;
        if (statusFilter === "incidents" && r.incidents === 0) return false;
      }
      if (!search) return true;
      const s = search.toLowerCase();
      return r.id.toLowerCase().includes(s) || r.origin.toLowerCase().includes(s) || r.destination.toLowerCase().includes(s) || r.name.toLowerCase().includes(s);
    });
  }, [allRows, search, statusFilter]);

  function handleExport() {
    exportCSV(
      "route-intelligence.csv",
      ["Route ID", "Route Name", "Origin", "Destination", "Distance (km)", "Trips", "Active", "Completed", "Incidents", "Avg L/km"],
      filtered.map((r) => [r.id, r.name, r.origin, r.destination, r.distanceKm, r.trips, r.active, r.completed, r.incidents, r.avgLpk]),
    );
    toast.success("Exported route intelligence to CSV");
  }

  const totalTrips = allRows.reduce((s, r) => s + r.trips, 0);
  const activeSum = allRows.reduce((s, r) => s + r.active, 0);
  const incSum = allRows.reduce((s, r) => s + r.incidents, 0);

  const cols: Column<Row>[] = [
    { key: "id", label: "Route ID", render: (r) => <button onClick={() => open({ kind: "route", id: r.id })} className="font-semibold text-primary hover:underline">{r.id}</button> },
    { key: "name", label: "Route", render: (r) => <button onClick={() => open({ kind: "route", id: r.id })} className="hover:underline text-left"><span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3 text-muted-foreground" />{r.origin} → {r.destination}</span></button> },
    { key: "distanceKm", label: "Distance", render: (r) => <span className="text-xs">{r.distanceKm} km</span> },
    { key: "trips", label: "Trips" },
    { key: "active", label: "Active", render: (r) => <Pill tone="info">{r.active}</Pill> },
    { key: "completed", label: "Completed", render: (r) => <Pill tone="success">{r.completed}</Pill> },
    { key: "incidents", label: "Incidents", render: (r) => r.incidents ? <Pill tone="danger">{r.incidents}</Pill> : <span className="text-xs text-muted-foreground">0</span> },
    { key: "avgLpk", label: "Avg L/km", render: (r) => <span className="text-xs font-medium">{r.avgLpk}</span> },
  ];

  return (
    <>
      <Header title="Route Intelligence" subtitle="Every route in your network as a first-class operational asset" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Total Routes" value={String(routes.length)} icon={RouteIcon} tone="info" />
          <KPICard label="Total Trips" value={String(totalTrips)} icon={Activity} tone="purple" />
          <KPICard label="Active Trips" value={String(activeSum)} icon={Fuel} tone="success" />
          <KPICard label="Route Incidents" value={String(incSum)} icon={ShieldAlert} tone="danger" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by route ID, origin, destination…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-elevated/60"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-40 text-xs bg-elevated/60"><SelectValue placeholder="All Routes" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                <SelectItem value="active">Has Active Trips</SelectItem>
                <SelectItem value="completed">Has Completed Trips</SelectItem>
                <SelectItem value="incidents">Has Incidents</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="border-border bg-elevated/60" onClick={handleExport}>
            <Download className="mr-1.5 h-3.5 w-3.5" />Export CSV
          </Button>
        </div>

        <DataTable title="Route Directory" columns={cols} rows={filtered} searchKeys={[]} pageSize={10} hideToolbar />
      </div>
    </>
  );
}
