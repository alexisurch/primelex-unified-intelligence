import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill, SectionCard } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { InteractiveMap } from "@/components/shared/Insights";
import { trucks, type Truck } from "@/lib/mock-data";
import { Truck as TruckIcon, Activity, Wrench, Fuel, Gauge, MapPin } from "lucide-react";

export const Route = createFileRoute("/_app/fleet-operations")({
  component: FleetOperations,
});

const statusTone: Record<Truck["status"], "success" | "warning" | "danger" | "info"> = {
  "On The Road": "success", "Idle": "warning", "Maintenance": "danger", "Offline": "info",
};

function FleetOperations() {
  const cols: Column<Truck>[] = [
    { key: "id", label: "Truck ID", render: (r) => <span className="font-medium text-primary">{r.id}</span> },
    { key: "plate", label: "Plate" },
    { key: "model", label: "Model", render: (r) => <span className="text-muted-foreground">{r.model}</span> },
    { key: "driver", label: "Driver" },
    { key: "status", label: "Status", render: (r) => <Pill tone={statusTone[r.status]}>{r.status}</Pill> },
    { key: "fuel", label: "Fuel", render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/5">
          <div className={`h-full ${r.fuel < 25 ? "bg-danger" : r.fuel < 50 ? "bg-warning" : "bg-success"}`} style={{ width: `${r.fuel}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">{r.fuel}%</span>
      </div>
    )},
    { key: "engineHealth", label: "Engine", render: (r) => <span className="text-xs">{r.engineHealth}%</span> },
    { key: "location", label: "Route", render: (r) => <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/>{r.location}</span> },
  ];

  return (
    <>
      <Header title="Fleet Operations" subtitle="Real-time visibility into every truck across your fleet" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Total Fleet" value="128" icon={TruckIcon} tone="info" delta={{ value: "4", direction: "up" }} />
          <KPICard label="Active Now" value="98" icon={Activity} tone="success" footnote="76.6% utilization" />
          <KPICard label="In Maintenance" value="10" icon={Wrench} tone="warning" footnote="Avg 2.3 days" />
          <KPICard label="Avg Fuel Level" value="64%" icon={Fuel} tone="purple" delta={{ value: "2.1%", direction: "up" }} />
        </div>
        <SectionCard title="Live Fleet Map">
          <InteractiveMap height={340} label="128 trucks tracked live" />
        </SectionCard>
        <DataTable title="Fleet Directory" columns={cols} rows={trucks} searchKeys={["id","plate","driver","model"]} pageSize={10} />
      </div>
    </>
  );
}
