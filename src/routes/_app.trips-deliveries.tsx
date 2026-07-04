import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill, SectionCard } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { InteractiveMap } from "@/components/shared/Insights";
import { trips, type Trip } from "@/lib/mock-data";
import { Route as RouteIcon, Package, Clock, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/trips-deliveries")({
  component: TripsDeliveries,
});

const tone = { "In Transit": "info", "Delivered": "success", "Delayed": "danger", "Scheduled": "warning", "Cancelled": "purple" } as const;

function TripsDeliveries() {
  const cols: Column<Trip>[] = [
    { key: "id", label: "Trip ID", render: (r) => <span className="font-semibold text-primary">{r.id}</span> },
    { key: "customer", label: "Customer" },
    { key: "origin", label: "Route", render: (r) => <span className="text-xs text-muted-foreground">{r.origin} → {r.destination}</span> },
    { key: "driver", label: "Driver" },
    { key: "truck", label: "Truck" },
    { key: "status", label: "Status", render: (r) => <Pill tone={tone[r.status]}>{r.status}</Pill> },
    { key: "progress", label: "Progress", render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/5">
          <div className="h-full bg-primary" style={{ width: `${r.progress}%` }} />
        </div>
        <span className="text-xs">{r.progress}%</span>
      </div>
    )},
    { key: "eta", label: "ETA" },
    { key: "stops", label: "Stops" },
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
        <SectionCard title="Delivery Map">
          <InteractiveMap height={320} label="Active trip routes" />
        </SectionCard>
        <DataTable title="Trips" columns={cols} rows={trips} searchKeys={["id","customer","driver","truck"]} pageSize={10} />
      </div>
    </>
  );
}
