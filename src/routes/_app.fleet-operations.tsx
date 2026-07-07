import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill, SectionCard } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { trucks as rawTrucks, trips as rawTrips, drivers as rawDrivers, type Truck as RawTruck, type Driver as RawDriver } from "@/lib/mock-data";
import { usePreferences } from "@/lib/preferences";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TruckRegistrationDialog, DriverRegistrationDialog } from "@/components/fleet/RegistrationDialogs";
import {
  Truck as TruckIcon, Activity, Wrench, Package, MapPin, Satellite, Clock, CheckCircle2, AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/_app/fleet-operations")({
  component: FleetOperations,
});

type OpStatus = "Available" | "On Trip" | "Loading" | "Under Maintenance" | "Out of Service";

const opStatusTone: Record<OpStatus, "success" | "info" | "warning" | "danger" | "purple"> = {
  "Available": "success",
  "On Trip": "info",
  "Loading": "warning",
  "Under Maintenance": "danger",
  "Out of Service": "purple",
};

function mapStatus(raw: RawTruck["status"], idx: number): OpStatus {
  if (raw === "Maintenance") return "Under Maintenance";
  if (raw === "Offline") return "Out of Service";
  if (raw === "Idle") return "Available";
  return idx % 9 === 0 ? "Loading" : "On Trip";
}

interface OpTruck extends RawTruck {
  opStatus: OpStatus;
  trackingNumber: string;
  currentTripId?: string;
  currentTripCustomer?: string;
  lastKnownLocation: string;
  lastUpdatedMin: number;
  plannedDistanceToday: number;
  fuelAssignedToday: number;
}

const opTrucks: OpTruck[] = rawTrucks.map((t, i) => {
  const opStatus = mapStatus(t.status, i);
  const trip = rawTrips.find((tp) => tp.truck === t.id);
  const [lastLoc] = t.location.split(" → ");
  const plannedDistanceToday = opStatus === "On Trip" || opStatus === "Loading" ? 100 + ((i * 47) % 380) : 0;
  return {
    ...t,
    opStatus,
    trackingNumber: `TRK-GPS-${20000 + i * 41}`,
    currentTripId: trip?.id,
    currentTripCustomer: trip?.customer,
    lastKnownLocation: lastLoc,
    lastUpdatedMin: 3 + ((i * 7) % 55),
    plannedDistanceToday,
    fuelAssignedToday: Math.round(plannedDistanceToday * 0.35),
  };
});

const counts = opTrucks.reduce((acc, t) => {
  acc[t.opStatus] = (acc[t.opStatus] ?? 0) + 1;
  return acc;
}, {} as Record<OpStatus, number>);

const naira = (n: number) => "₦" + n.toLocaleString();

function FleetOperations() {
  return (
    <>
      <Header title="Fleet Operations" subtitle="Operational monitoring center — complete visibility into every vehicle and driver" />
      <div className="space-y-6 p-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="h-10 bg-elevated/60 border border-border/60">
            <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Fleet Overview</TabsTrigger>
            <TabsTrigger value="fleet" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Fleet</TabsTrigger>
            <TabsTrigger value="drivers" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Drivers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-0"><FleetOverviewTab /></TabsContent>
          <TabsContent value="fleet" className="space-y-6 mt-0"><FleetRegisterTab /></TabsContent>
          <TabsContent value="drivers" className="space-y-6 mt-0"><DriversTab /></TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function FleetOverviewTab() {
  const { trackingMode } = usePreferences();
  const trackingSource = trackingMode === "manual" ? "Manual" : "GPS";
  const { open } = useProfileDrawer();
  const fuelWeek = opTrucks.reduce((s, t) => s + t.fuelAssignedToday, 0) * 6;
  const fuelToday = opTrucks.reduce((s, t) => s + t.fuelAssignedToday, 0);
  const activeTrips = opTrucks.filter((t) => t.opStatus === "On Trip" || t.opStatus === "Loading").length;
  const avgFuelPerTrip = activeTrips ? Math.round(fuelToday / activeTrips) : 0;

  const cols: Column<OpTruck>[] = [
    { key: "id", label: "Truck", render: (r) => (
      <button className="text-left" onClick={() => open({ kind: "truck", id: r.id })}>
        <div className="font-semibold text-primary hover:underline">{r.id}</div>
        <div className="text-[11px] text-muted-foreground">{r.plate}</div>
      </button>
    )},
    { key: "driver", label: "Driver", render: (r) => (
      <button className="hover:underline" onClick={() => open({ kind: "driver", id: r.driver })}>{r.driver}</button>
    )},
    { key: "opStatus", label: "Current Status", render: (r) => <Pill tone={opStatusTone[r.opStatus]}>{r.opStatus}</Pill> },
    { key: "currentTripId", label: "Current Trip", render: (r) => r.currentTripId
      ? <button onClick={() => open({ kind: "trip", id: r.currentTripId! })} className="text-xs"><span className="text-primary font-medium hover:underline">{r.currentTripId}</span> <span className="text-muted-foreground">· {r.currentTripCustomer}</span></button>
      : <span className="text-xs text-muted-foreground">—</span> },
    { key: "lastKnownLocation", label: "Last Known Location", render: (r) => (
      <div className="flex items-center gap-1.5 text-xs"><MapPin className="h-3 w-3 text-muted-foreground" /><span>{r.lastKnownLocation}</span></div>
    )},
    { key: "lastUpdatedMin", label: "Last Updated", render: (r) => <span className="text-xs text-muted-foreground">{r.lastUpdatedMin}m ago</span> },
    { key: "plannedDistanceToday", label: "Planned (Today)", render: (r) => <span className="text-xs">{r.plannedDistanceToday} km</span> },
    { key: "fuelAssignedToday", label: "Fuel Assigned", render: (r) => <span className="text-xs">{r.fuelAssignedToday} L</span> },
    { key: "gps", label: "Tracking Source", render: () => (
      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${trackingSource === "GPS" ? "bg-info/15 text-info" : "bg-white/[0.05] text-muted-foreground"}`}>
        <Satellite className="h-3 w-3" />{trackingSource}
      </span>
    )},
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <KPICard label="Total Fleet" value={opTrucks.length} icon={TruckIcon} tone="info" />
        <KPICard label="Available" value={counts["Available"] ?? 0} icon={CheckCircle2} tone="success" />
        <KPICard label="On Trip" value={counts["On Trip"] ?? 0} icon={Activity} tone="info" />
        <KPICard label="Loading" value={counts["Loading"] ?? 0} icon={Package} tone="warning" />
        <KPICard label="Under Maintenance" value={counts["Under Maintenance"] ?? 0} icon={Wrench} tone="danger" />
        <KPICard label="Out of Service" value={counts["Out of Service"] ?? 0} icon={AlertTriangle} tone="purple" />
      </div>
      <DataTable title="Fleet Status" columns={cols} rows={opTrucks} searchKeys={["id","plate","driver","lastKnownLocation"]} pageSize={10} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        <SectionCard title="Fleet Health">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <HealthTile label="Idle Trucks" value={counts["Available"] ?? 0} tone="success" icon={CheckCircle2}/>
            <HealthTile label="Awaiting Assignment" value={Math.round((counts["Available"] ?? 0) * 0.6)} tone="warning" icon={Clock}/>
            <HealthTile label="Delayed Trips" value={rawTrips.filter(t => t.status === "Delayed").length} tone="danger" icon={AlertTriangle}/>
            <HealthTile label="Under Maintenance" value={counts["Under Maintenance"] ?? 0} tone="danger" icon={Wrench}/>
            <HealthTile label="Out of Service" value={counts["Out of Service"] ?? 0} tone="purple" icon={AlertTriangle}/>
          </div>
        </SectionCard>
        <SectionCard title="Fuel Summary">
          <div className="space-y-3">
            <FuelRow label="Fuel Assigned Today" value={`${fuelToday.toLocaleString()} L`} sub={naira(fuelToday * 1250)} />
            <FuelRow label="Fuel Assigned This Week" value={`${fuelWeek.toLocaleString()} L`} sub={naira(fuelWeek * 1250)} />
            <FuelRow label="Avg Fuel Per Trip" value={`${avgFuelPerTrip} L`} sub={naira(avgFuelPerTrip * 1250)} />
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function HealthTile({ label, value, tone, icon: Icon }: { label: string; value: number; tone: "success"|"warning"|"danger"|"purple"|"info"; icon: React.ElementType }) {
  const bg = { success:"bg-success/15", warning:"bg-warning/15", danger:"bg-danger/15", purple:"bg-purple/15", info:"bg-info/15" }[tone];
  const text = { success:"text-success", warning:"text-warning", danger:"text-danger", purple:"text-purple", info:"text-info" }[tone];
  return (
    <div className="rounded-xl border border-border/60 bg-background/30 p-4">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}><Icon className={`h-4 w-4 ${text}`} /></div>
      <div className="mt-3 text-[22px] font-semibold leading-none">{value}</div>
      <div className="mt-1.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function FuelRow({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/30 px-4 py-3">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-1 text-lg font-semibold">{value}</div>
      </div>
      <div className="text-right">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Cost</div>
        <div className="text-sm font-semibold text-info">{sub}</div>
      </div>
    </div>
  );
}

function FleetRegisterTab() {
  const { open } = useProfileDrawer();
  const cols: Column<OpTruck>[] = [
    { key: "id", label: "Truck Number", render: (r) => (
      <button className="text-left font-semibold text-primary hover:underline" onClick={() => open({ kind: "truck", id: r.id })}>{r.id}</button>
    )},
    { key: "plate", label: "Registration Number" },
    { key: "trackingNumber", label: "Tracking Number", render: (r) => <span className="text-xs text-muted-foreground">{r.trackingNumber}</span> },
    { key: "driver", label: "Assigned Driver", render: (r) => (
      <button onClick={() => open({ kind: "driver", id: r.driver })} className="hover:underline">{r.driver}</button>
    )},
    { key: "opStatus", label: "Current Status", render: (r) => <Pill tone={opStatusTone[r.opStatus]}>{r.opStatus}</Pill> },
  ];
  return (
    <>
      <div className="flex items-center justify-end"><TruckRegistrationDialog /></div>
      <DataTable title="Fleet Register" columns={cols} rows={opTrucks} searchKeys={["id","plate","trackingNumber","driver"]} pageSize={12} />
    </>
  );
}

function initials(name: string) { return name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase(); }

function DriversTab() {
  const { open } = useProfileDrawer();
  const cols: Column<RawDriver>[] = [
    { key: "name", label: "Driver", render: (r) => (
      <button className="flex items-center gap-2 text-left" onClick={() => open({ kind: "driver", id: r.id })}>
        <Avatar className="h-7 w-7"><AvatarFallback className="bg-primary/20 text-primary text-[10px]">{initials(r.name)}</AvatarFallback></Avatar>
        <div>
          <div className="text-sm font-medium hover:underline">{r.name}</div>
          <div className="text-[11px] text-muted-foreground">{r.id}</div>
        </div>
      </button>
    )},
    { key: "license", label: "Licence No.", render: (r) => <span className="text-xs">{r.license}</span> },
    { key: "licenseExpiry", label: "Licence Expiry", render: (r) => <span className="text-xs">{r.licenseExpiry}</span> },
    { key: "truck", label: "Assigned Truck", render: (r) => (
      <button className="text-primary hover:underline text-xs font-medium" onClick={() => open({ kind: "truck", id: r.truck })}>{r.truck}</button>
    )},
    { key: "score", label: "Safety Score", render: (r) => <span className="text-xs font-medium">{r.score}</span> },
    { key: "risk", label: "Risk", render: (r) => <Pill tone={r.risk === "High" ? "danger" : r.risk === "Medium" ? "warning" : "success"}>{r.risk}</Pill> },
    { key: "status", label: "Employment", render: (r) => (
      <Pill tone={r.status === "Active" ? "success" : r.status === "On Leave" ? "warning" : "danger"}>{r.status}</Pill>
    )},
  ];
  return (
    <>
      <div className="flex items-center justify-end"><DriverRegistrationDialog /></div>
      <DataTable title="Drivers Directory" columns={cols} rows={rawDrivers} searchKeys={["name","id","truck","license"]} pageSize={12} />
    </>
  );
}
