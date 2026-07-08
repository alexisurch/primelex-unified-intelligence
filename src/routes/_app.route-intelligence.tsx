import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill, SectionCard } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Route as RouteIcon, MapPin, Activity, Fuel, ShieldAlert } from "lucide-react";
import { routes, trips, incidents, tripFuelHistory, type RouteEntity } from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";

export const Route = createFileRoute("/_app/route-intelligence")({
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
  const rows: Row[] = routes.map((r) => {
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

  const totalTrips = rows.reduce((s, r) => s + r.trips, 0);
  const activeSum = rows.reduce((s, r) => s + r.active, 0);
  const incSum = rows.reduce((s, r) => s + r.incidents, 0);

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
        <SectionCard title="Route Directory">
          <DataTable columns={cols} rows={rows} searchKeys={["name", "origin", "destination", "id"]} pageSize={10} />
        </SectionCard>
      </div>
    </>
  );
}
