import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { trips, type Trip, clients } from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { Route as RouteIcon, Package, Clock, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/trips-deliveries")({
  component: TripsDeliveries,
});

const tone = { "In Transit": "info", "Delivered": "success", "Delayed": "danger", "Scheduled": "warning", "Cancelled": "purple" } as const;

function TripsDeliveries() {
  const { open } = useProfileDrawer();
  const clientIdFor = (name: string) => clients.find((c) => c.name === name)?.id;

  const cols: Column<Trip>[] = [
    { key: "id", label: "Trip ID", render: (r) => (
      <button onClick={() => open({ kind: "trip", id: r.id })} className="font-semibold text-primary hover:underline">{r.id}</button>
    )},
    { key: "customer", label: "Customer", render: (r) => {
      const cid = clientIdFor(r.customer);
      return cid ? <button onClick={() => open({ kind: "client", id: cid })} className="hover:underline">{r.customer}</button> : r.customer;
    }},
    { key: "origin", label: "Route", render: (r) => <span className="text-xs text-muted-foreground">{r.origin} → {r.destination}</span> },
    { key: "driver", label: "Driver", render: (r) => (
      <button onClick={() => open({ kind: "driver", id: r.driver })} className="hover:underline">{r.driver}</button>
    )},
    { key: "truck", label: "Truck", render: (r) => (
      <button onClick={() => open({ kind: "truck", id: r.truck })} className="text-primary hover:underline text-xs font-medium">{r.truck}</button>
    )},
    { key: "status", label: "Status", render: (r) => <Pill tone={tone[r.status]}>{r.status}</Pill> },
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
        <DataTable title="Trips" columns={cols} rows={trips} searchKeys={["id","customer","driver","truck"]} pageSize={10} />
      </div>
    </>
  );
}
