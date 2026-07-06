import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill, SectionCard, GlassCard, StatusDot } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { trucks as rawTrucks, trips as rawTrips, drivers as rawDrivers, type Truck as RawTruck } from "@/lib/mock-data";
import { usePreferences } from "@/lib/preferences";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Truck as TruckIcon, Activity, Wrench, Fuel, Circle, MapPin, Satellite, Gauge,
  UserCircle2, Phone, Calendar, IdCard, Package, ClipboardList, History, FileText,
  Upload, Edit, UserPlus, ArchiveRestore, Clock, CheckCircle2, AlertTriangle,
  Route as RouteIcon, TrendingUp, DollarSign, ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/_app/fleet-operations")({
  component: FleetOperations,
});

// ---------- Derived operational model ----------
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
  // sprinkle some Loading among on-the-road for realism
  return idx % 9 === 0 ? "Loading" : "On Trip";
}

interface OpTruck extends RawTruck {
  opStatus: OpStatus;
  trackingNumber: string;
  vehicleType: string;
  manufacturer: string;
  year: number;
  capacityKg: number;
  vin: string;
  engineNumber: string;
  colour: string;
  purchaseDate: string;
  currentTripId?: string;
  currentTripCustomer?: string;
  pickup?: string;
  destination?: string;
  lastKnownLocation: string;
  lastUpdatedMin: number;
  updatedBy: string;
  plannedDistanceToday: number;
  fuelAssignedToday: number;
  fuelCostToday: number;
  totalTrips: number;
  totalPlannedDistance: number;
  totalFuelAssigned: number;
  totalFuelCost: number;
  driverPhone: string;
  driverLicense: string;
  driverLicenseExpiry: string;
}

const opTrucks: OpTruck[] = rawTrucks.map((t, i) => {
  const opStatus = mapStatus(t.status, i);
  const trip = rawTrips.find((tp) => tp.truck === t.id);
  const [lastLoc] = t.location.split(" → ");
  const plannedDistanceToday = opStatus === "On Trip" || opStatus === "Loading" ? 100 + ((i * 47) % 380) : 0;
  const fuelAssignedToday = plannedDistanceToday ? Math.round(plannedDistanceToday * 0.35) : 0;
  const priceL = 1250;
  const totalTrips = 40 + ((i * 13) % 120);
  const totalPlannedDistance = totalTrips * (180 + (i % 60));
  const totalFuelAssigned = Math.round(totalPlannedDistance * 0.32);
  const driver = rawDrivers.find((d) => d.name === t.driver) ?? rawDrivers[i % rawDrivers.length];
  return {
    ...t,
    opStatus,
    trackingNumber: `TRK-GPS-${20000 + i * 41}`,
    vehicleType: i % 3 === 0 ? "Rigid Truck" : i % 3 === 1 ? "Articulated Tractor" : "Box Truck",
    manufacturer: t.model.split(" ")[0],
    year: 2018 + (i % 7),
    capacityKg: [15000, 20000, 25000, 30000, 40000][i % 5],
    vin: `WVWZZZ${(1000000 + i * 7919).toString().slice(0, 10)}`,
    engineNumber: `ENG-${900000 + i * 331}`,
    colour: ["White", "Blue", "Red", "Silver", "Green"][i % 5],
    purchaseDate: `20${18 + (i % 7)}-0${(i % 9) + 1}-1${i % 9}`,
    currentTripId: trip?.id,
    currentTripCustomer: trip?.customer,
    pickup: trip?.origin,
    destination: trip?.destination,
    lastKnownLocation: lastLoc,
    lastUpdatedMin: 3 + ((i * 7) % 55),
    updatedBy: ["A. Bello", "M. Yusuf", "C. Okoro", "S. Adeyemi", "N. Ibrahim"][i % 5],
    plannedDistanceToday,
    fuelAssignedToday,
    fuelCostToday: fuelAssignedToday * priceL,
    totalTrips,
    totalPlannedDistance,
    totalFuelAssigned,
    totalFuelCost: totalFuelAssigned * priceL,
    driverPhone: `+234 80${(1000000 + i * 12345).toString().slice(0, 7)}`,
    driverLicense: driver.license,
    driverLicenseExpiry: driver.licenseExpiry,
  };
});

const counts = opTrucks.reduce(
  (acc, t) => {
    acc[t.opStatus] = (acc[t.opStatus] ?? 0) + 1;
    return acc;
  },
  {} as Record<OpStatus, number>,
);

const naira = (n: number) => "₦" + n.toLocaleString();

// ---------- Page ----------
function FleetOperations() {
  const [selectedTruck, setSelectedTruck] = useState<OpTruck | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  return (
    <>
      <Header
        title="Fleet Operations"
        subtitle="Operational monitoring center — complete visibility into every vehicle and driver"
      />
      <div className="space-y-6 p-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="h-10 bg-elevated/60 border border-border/60">
            <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Fleet Overview
            </TabsTrigger>
            <TabsTrigger value="fleet" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Fleet
            </TabsTrigger>
            <TabsTrigger value="drivers" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Drivers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-0">
            <FleetOverviewTab onOpenTruck={setSelectedTruck} />
          </TabsContent>
          <TabsContent value="fleet" className="space-y-6 mt-0">
            <FleetRegisterTab onOpenTruck={setSelectedTruck} />
          </TabsContent>
          <TabsContent value="drivers" className="space-y-6 mt-0">
            <DriversTab onOpenDriver={setSelectedDriver} onOpenTruck={setSelectedTruck} />
          </TabsContent>
        </Tabs>
      </div>

      <TruckProfileSheet truck={selectedTruck} onClose={() => setSelectedTruck(null)} onOpenDriver={setSelectedDriver} />
      <DriverProfileSheet driverName={selectedDriver} onClose={() => setSelectedDriver(null)} onOpenTruck={setSelectedTruck} />
    </>
  );
}

// ---------- Tab 1: Fleet Overview ----------
function FleetOverviewTab({ onOpenTruck }: { onOpenTruck: (t: OpTruck) => void }) {
  const { trackingMode } = usePreferences();
  const trackingSource = trackingMode === "manual" ? "Manual" : "GPS";

  const fuelWeek = opTrucks.reduce((s, t) => s + t.fuelAssignedToday, 0) * 6;
  const fuelToday = opTrucks.reduce((s, t) => s + t.fuelAssignedToday, 0);
  const activeTrips = opTrucks.filter((t) => t.opStatus === "On Trip" || t.opStatus === "Loading").length;
  const avgFuelPerTrip = activeTrips ? Math.round(fuelToday / activeTrips) : 0;

  const cols: Column<OpTruck>[] = [
    { key: "id", label: "Truck", render: (r) => (
      <button className="text-left" onClick={() => onOpenTruck(r)}>
        <div className="font-semibold text-primary">{r.id}</div>
        <div className="text-[11px] text-muted-foreground">{r.plate}</div>
      </button>
    )},
    { key: "driver", label: "Driver" },
    { key: "opStatus", label: "Current Status", render: (r) => <Pill tone={opStatusTone[r.opStatus]}>{r.opStatus}</Pill> },
    { key: "currentTripId", label: "Current Trip", render: (r) => r.currentTripId
      ? <span className="text-xs"><span className="text-primary font-medium">{r.currentTripId}</span> <span className="text-muted-foreground">· {r.currentTripCustomer}</span></span>
      : <span className="text-xs text-muted-foreground">—</span> },
    { key: "lastKnownLocation", label: "Last Known Location", render: (r) => (
      <div className="flex items-center gap-1.5 text-xs">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span>{r.lastKnownLocation}</span>
      </div>
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

      <DataTable
        title="Fleet Status"
        columns={cols}
        rows={opTrucks}
        searchKeys={["id", "plate", "driver", "lastKnownLocation"]}
        pageSize={10}
      />

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
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
        <Icon className={`h-4 w-4 ${text}`} />
      </div>
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

// ---------- Tab 2: Fleet Register ----------
function FleetRegisterTab({ onOpenTruck }: { onOpenTruck: (t: OpTruck) => void }) {
  const cols: Column<OpTruck>[] = [
    { key: "id", label: "Truck Number", render: (r) => (
      <button className="text-left font-semibold text-primary hover:underline" onClick={() => onOpenTruck(r)}>{r.id}</button>
    )},
    { key: "plate", label: "Registration Number" },
    { key: "trackingNumber", label: "Tracking Number", render: (r) => <span className="text-xs text-muted-foreground">{r.trackingNumber}</span> },
    { key: "driver", label: "Assigned Driver" },
    { key: "opStatus", label: "Current Status", render: (r) => <Pill tone={opStatusTone[r.opStatus]}>{r.opStatus}</Pill> },
  ];
  return (
    <DataTable
      title="Fleet Register"
      columns={cols}
      rows={opTrucks}
      searchKeys={["id", "plate", "trackingNumber", "driver"]}
      pageSize={12}
    />
  );
}

// ---------- Tab 3: Drivers ----------
interface OpDriver {
  id: string;
  name: string;
  phone: string;
  assignedTruck: string;
  status: OpStatus;
  currentTrip?: string;
  licenseExpiry: string;
  employment: "Active" | "On Leave" | "Suspended";
  license: string;
  licenseClass: string;
  lastKnownLocation: string;
  lastUpdatedMin: number;
  address: string;
  emergencyContact: string;
  tripsCompleted: number;
  activeTrips: number;
  plannedDistance: number;
  fuelAssigned: number;
  avgTripDurationHr: number;
}

const opDrivers: OpDriver[] = rawDrivers.map((d, i) => {
  const truck = opTrucks.find((t) => t.driver === d.name) ?? opTrucks[i % opTrucks.length];
  return {
    id: d.id,
    name: d.name,
    phone: truck.driverPhone,
    assignedTruck: truck.id,
    status: truck.opStatus,
    currentTrip: truck.currentTripId,
    licenseExpiry: d.licenseExpiry,
    employment: d.status,
    license: d.license,
    licenseClass: ["Class C", "Class D", "Class E"][i % 3],
    lastKnownLocation: truck.lastKnownLocation,
    lastUpdatedMin: truck.lastUpdatedMin,
    address: `${["12", "45", "9", "27", "88"][i % 5]} ${["Adeola Odeku", "Bode Thomas", "Aminu Kano", "Herbert Macaulay"][i % 4]} St., Lagos`,
    emergencyContact: `+234 80${(2000000 + i * 8171).toString().slice(0, 7)}`,
    tripsCompleted: truck.totalTrips,
    activeTrips: truck.opStatus === "On Trip" || truck.opStatus === "Loading" ? 1 : 0,
    plannedDistance: truck.totalPlannedDistance,
    fuelAssigned: truck.totalFuelAssigned,
    avgTripDurationHr: 4 + (i % 6),
  };
});

function DriversTab({ onOpenDriver, onOpenTruck }: { onOpenDriver: (name: string) => void; onOpenTruck: (t: OpTruck) => void }) {
  const cols: Column<OpDriver>[] = [
    { key: "name", label: "Driver", render: (r) => (
      <button className="flex items-center gap-2 text-left" onClick={() => onOpenDriver(r.name)}>
        <Avatar className="h-7 w-7"><AvatarFallback className="bg-primary/20 text-primary text-[10px]">{initials(r.name)}</AvatarFallback></Avatar>
        <div>
          <div className="text-sm font-medium hover:underline">{r.name}</div>
          <div className="text-[11px] text-muted-foreground">{r.id}</div>
        </div>
      </button>
    )},
    { key: "phone", label: "Phone", render: (r) => <span className="text-xs">{r.phone}</span> },
    { key: "assignedTruck", label: "Assigned Truck", render: (r) => (
      <button className="text-primary hover:underline text-xs font-medium" onClick={() => { const t = opTrucks.find(x => x.id === r.assignedTruck); if (t) onOpenTruck(t); }}>{r.assignedTruck}</button>
    )},
    { key: "status", label: "Current Status", render: (r) => <Pill tone={opStatusTone[r.status]}>{r.status}</Pill> },
    { key: "currentTrip", label: "Current Trip", render: (r) => r.currentTrip
      ? <span className="text-xs text-primary font-medium">{r.currentTrip}</span>
      : <span className="text-xs text-muted-foreground">—</span> },
    { key: "licenseExpiry", label: "Licence Expiry", render: (r) => <span className="text-xs">{r.licenseExpiry}</span> },
    { key: "employment", label: "Employment Status", render: (r) => (
      <Pill tone={r.employment === "Active" ? "success" : r.employment === "On Leave" ? "warning" : "danger"}>{r.employment}</Pill>
    )},
  ];
  return (
    <DataTable
      title="Drivers Directory"
      columns={cols}
      rows={opDrivers}
      searchKeys={["name", "id", "assignedTruck", "phone"]}
      pageSize={12}
    />
  );
}

// ---------- Truck Profile Sheet ----------
function TruckProfileSheet({ truck, onClose, onOpenDriver }: { truck: OpTruck | null; onClose: () => void; onOpenDriver: (name: string) => void }) {
  const { trackingMode } = usePreferences();
  const isManual = trackingMode === "manual";
  const timeline = useMemo(() => truck ? buildTruckTimeline(truck) : [], [truck]);
  const truckTrips = useMemo(() => truck ? rawTrips.filter(t => t.truck === truck.id) : [], [truck]);

  return (
    <Sheet open={!!truck} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto scrollbar-thin border-l border-border bg-background/95 backdrop-blur p-0">
        {truck && (
          <>
            <SheetHeader className="border-b border-border/60 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
                    <TruckIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <SheetTitle className="text-lg">{truck.id} · {truck.plate}</SheetTitle>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{truck.manufacturer} {truck.model}</span>
                      <Circle className="h-1 w-1 fill-muted-foreground" />
                      <Pill tone={opStatusTone[truck.opStatus]}>{truck.opStatus}</Pill>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <QuickAction icon={Edit} label="Edit" />
                  <QuickAction icon={UserPlus} label="Assign Driver" />
                  <QuickAction icon={Upload} label="Documents" />
                  <QuickAction icon={ArchiveRestore} label="Archive" tone="danger" />
                </div>
              </div>
            </SheetHeader>

            <Tabs defaultValue="overview" className="px-6 pt-4">
              <TabsList className="h-9 bg-elevated/60 border border-border/60">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="trips" className="text-xs">Trip History</TabsTrigger>
                <TabsTrigger value="timeline" className="text-xs">Activity Timeline</TabsTrigger>
                <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-5 space-y-5 pb-8">
                <ProfileSection title="Vehicle Information" icon={TruckIcon}>
                  <InfoGrid items={[
                    ["Truck Number", truck.id],
                    ["Registration Number", truck.plate],
                    ["Tracking Number", truck.trackingNumber],
                    ["Vehicle Type", truck.vehicleType],
                    ["Manufacturer", truck.manufacturer],
                    ["Model", truck.model],
                    ["Year", String(truck.year)],
                    ["Capacity", `${truck.capacityKg.toLocaleString()} kg`],
                    ["VIN / Chassis", truck.vin],
                    ["Engine Number", truck.engineNumber],
                    ["Colour", truck.colour],
                    ["Purchase Date", truck.purchaseDate],
                    ["Odometer", `${truck.odometer.toLocaleString()} km`],
                    ["Tracking Source", isManual ? "Manual" : "GPS"],
                  ]} />
                </ProfileSection>

                <ProfileSection title="Assigned Driver" icon={UserCircle2} action={
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-primary hover:text-primary" onClick={() => onOpenDriver(truck.driver)}>
                    View Driver Profile <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                }>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14"><AvatarFallback className="bg-primary/20 text-primary text-sm">{initials(truck.driver)}</AvatarFallback></Avatar>
                    <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-2 text-xs">
                      <InfoLine label="Name" value={truck.driver} />
                      <InfoLine label="Phone" value={truck.driverPhone} icon={Phone} />
                      <InfoLine label="Licence No." value={truck.driverLicense} icon={IdCard} />
                      <InfoLine label="Licence Expiry" value={truck.driverLicenseExpiry} icon={Calendar} />
                      <InfoLine label="Employment" value="Active" />
                    </div>
                  </div>
                </ProfileSection>

                <ProfileSection title="Current Assignment" icon={ClipboardList}>
                  {truck.currentTripId ? (
                    <div className="space-y-3">
                      <InfoGrid items={[
                        ["Customer", truck.currentTripCustomer!],
                        ["Current Trip", truck.currentTripId],
                        ["Pickup", truck.pickup!],
                        ["Destination", truck.destination!],
                        ["Current Status", truck.opStatus],
                      ]} />
                      <div className="rounded-lg border border-border/60 bg-background/30 p-3">
                        {isManual ? (
                          <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
                            <InfoLine label="Last Known Location" value={truck.lastKnownLocation} icon={MapPin} />
                            <InfoLine label="Updated By" value={truck.updatedBy} />
                            <InfoLine label="Last Updated" value={`${truck.lastUpdatedMin}m ago`} icon={Clock} />
                            <InfoLine label="Tracking Source" value="Manual" icon={Satellite} />
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
                            <InfoLine label="Live Location" value={truck.lastKnownLocation} icon={MapPin} />
                            <InfoLine label="GPS Timestamp" value={`${truck.lastUpdatedMin}m ago`} icon={Clock} />
                            <InfoLine label="Speed" value={`${40 + (truck.odometer % 45)} km/h`} icon={Gauge} />
                            <InfoLine label="Tracking Source" value="GPS" icon={Satellite} />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No active trip assigned.</p>
                  )}
                </ProfileSection>

                <ProfileSection title="Operational Statistics" icon={TrendingUp}>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <StatTile label="Total Trips" value={truck.totalTrips.toString()} icon={RouteIcon} />
                    <StatTile label="Planned Distance" value={`${(truck.totalPlannedDistance/1000).toFixed(1)}k km`} icon={Activity} />
                    <StatTile label="Fuel Assigned" value={`${truck.totalFuelAssigned.toLocaleString()} L`} icon={Fuel} />
                    <StatTile label="Fuel Cost" value={naira(truck.totalFuelCost)} icon={DollarSign} />
                    <StatTile label="Avg Trip Distance" value={`${Math.round(truck.totalPlannedDistance/truck.totalTrips)} km`} icon={RouteIcon} />
                    <StatTile label="Avg Fuel / Trip" value={`${Math.round(truck.totalFuelAssigned/truck.totalTrips)} L`} icon={Fuel} />
                    <StatTile label="Total Revenue" value="— (Coming Soon)" icon={DollarSign} muted />
                    <StatTile label="Odometer" value={`${(truck.odometer/1000).toFixed(1)}k km`} icon={Gauge} />
                  </div>
                </ProfileSection>
              </TabsContent>

              <TabsContent value="trips" className="mt-5 pb-8">
                <div className="overflow-hidden rounded-xl border border-border/60">
                  <table className="w-full text-sm">
                    <thead className="bg-elevated/70">
                      <tr>
                        {["Date","Customer","Origin","Destination","Distance","Fuel","Status"].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {truckTrips.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-10 text-center text-xs text-muted-foreground">No trips recorded.</td></tr>
                      )}
                      {truckTrips.map((t, i) => (
                        <tr key={t.id} className="border-t border-border/60">
                          <td className="px-4 py-3 text-xs text-muted-foreground">2026-06-{String(10 + i).padStart(2,"0")}</td>
                          <td className="px-4 py-3 text-xs">{t.customer}</td>
                          <td className="px-4 py-3 text-xs">{t.origin}</td>
                          <td className="px-4 py-3 text-xs">{t.destination}</td>
                          <td className="px-4 py-3 text-xs">{t.distance} km</td>
                          <td className="px-4 py-3 text-xs">{Math.round(t.distance * 0.32)} L</td>
                          <td className="px-4 py-3"><Pill tone={t.status === "Delivered" ? "success" : t.status === "Delayed" ? "danger" : t.status === "In Transit" ? "info" : "warning"}>{t.status}</Pill></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="mt-5 pb-8">
                <ol className="relative space-y-4 border-l border-border/60 pl-6">
                  {timeline.map((ev, i) => (
                    <li key={i} className="relative">
                      <span className={`absolute -left-[27px] top-1 flex h-3 w-3 items-center justify-center rounded-full ring-2 ring-background ${toneBg(ev.tone)}`} />
                      <div className="flex items-baseline justify-between gap-4">
                        <div>
                          <div className="text-sm font-medium">{ev.label}</div>
                          {ev.detail && <div className="mt-0.5 text-xs text-muted-foreground">{ev.detail}</div>}
                        </div>
                        <div className="whitespace-nowrap text-[11px] text-muted-foreground">{ev.time}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </TabsContent>

              <TabsContent value="documents" className="mt-5 pb-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Vehicle registration, insurance, road worthiness, inspection & images.</p>
                  <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30"><Upload className="mr-1.5 h-3.5 w-3.5"/>Upload</Button>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {[
                    { name: "Vehicle Registration", exp: "2027-03-14", status: "Valid" as const },
                    { name: "Insurance Certificate", exp: "2026-11-02", status: "Expiring" as const },
                    { name: "Road Worthiness", exp: "2026-09-30", status: "Valid" as const },
                    { name: "Inspection Certificate", exp: "2026-08-18", status: "Valid" as const },
                  ].map(d => (
                    <div key={d.name} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/30 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/15"><FileText className="h-4 w-4 text-info"/></div>
                        <div>
                          <div className="text-sm font-medium">{d.name}</div>
                          <div className="text-[11px] text-muted-foreground">Expires {d.exp}</div>
                        </div>
                      </div>
                      <Pill tone={d.status === "Valid" ? "success" : "warning"}>{d.status}</Pill>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ---------- Driver Profile Sheet ----------
function DriverProfileSheet({ driverName, onClose, onOpenTruck }: { driverName: string | null; onClose: () => void; onOpenTruck: (t: OpTruck) => void }) {
  const driver = driverName ? opDrivers.find(d => d.name === driverName) : null;
  const truck = driver ? opTrucks.find(t => t.id === driver.assignedTruck) : null;
  return (
    <Sheet open={!!driver} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto scrollbar-thin border-l border-border bg-background/95 backdrop-blur p-0">
        {driver && (
          <>
            <SheetHeader className="border-b border-border/60 px-6 py-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14"><AvatarFallback className="bg-primary/20 text-primary">{initials(driver.name)}</AvatarFallback></Avatar>
                <div>
                  <SheetTitle className="text-lg">{driver.name}</SheetTitle>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{driver.id}</span>
                    <Circle className="h-1 w-1 fill-muted-foreground" />
                    <Pill tone={opStatusTone[driver.status]}>{driver.status}</Pill>
                  </div>
                </div>
              </div>
            </SheetHeader>
            <div className="space-y-5 px-6 py-5 pb-10">
              <ProfileSection title="Personal Information" icon={UserCircle2}>
                <InfoGrid items={[
                  ["Name", driver.name],
                  ["Phone", driver.phone],
                  ["Address", driver.address],
                  ["Emergency Contact", driver.emergencyContact],
                ]}/>
              </ProfileSection>
              <ProfileSection title="Licence Information" icon={IdCard}>
                <InfoGrid items={[
                  ["Licence Number", driver.license],
                  ["Licence Class", driver.licenseClass],
                  ["Licence Expiry", driver.licenseExpiry],
                  ["Employment", driver.employment],
                ]}/>
              </ProfileSection>
              <ProfileSection title="Current Assignment" icon={ClipboardList} action={truck && (
                <Button size="sm" variant="ghost" className="h-7 text-xs text-primary" onClick={() => onOpenTruck(truck)}>View Truck <ChevronRight className="ml-1 h-3 w-3"/></Button>
              )}>
                <InfoGrid items={[
                  ["Current Truck", driver.assignedTruck],
                  ["Current Trip", driver.currentTrip ?? "—"],
                  ["Current Status", driver.status],
                  ["Last Known Location", `${driver.lastKnownLocation} · ${driver.lastUpdatedMin}m ago`],
                ]}/>
              </ProfileSection>
              <ProfileSection title="Driver Statistics" icon={TrendingUp}>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  <StatTile label="Trips Completed" value={driver.tripsCompleted.toString()} icon={CheckCircle2}/>
                  <StatTile label="Active Trips" value={driver.activeTrips.toString()} icon={Activity}/>
                  <StatTile label="Planned Distance" value={`${(driver.plannedDistance/1000).toFixed(1)}k km`} icon={RouteIcon}/>
                  <StatTile label="Fuel Assigned" value={`${driver.fuelAssigned.toLocaleString()} L`} icon={Fuel}/>
                  <StatTile label="Avg Trip Duration" value={`${driver.avgTripDurationHr}h`} icon={Clock}/>
                </div>
              </ProfileSection>
              <ProfileSection title="Driver Timeline" icon={History}>
                <ol className="relative space-y-4 border-l border-border/60 pl-6">
                  {buildDriverTimeline(driver).map((ev, i) => (
                    <li key={i} className="relative">
                      <span className={`absolute -left-[27px] top-1 flex h-3 w-3 rounded-full ring-2 ring-background ${toneBg(ev.tone)}`} />
                      <div className="flex items-baseline justify-between gap-4">
                        <div>
                          <div className="text-sm font-medium">{ev.label}</div>
                          {ev.detail && <div className="mt-0.5 text-xs text-muted-foreground">{ev.detail}</div>}
                        </div>
                        <div className="whitespace-nowrap text-[11px] text-muted-foreground">{ev.time}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </ProfileSection>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ---------- Small helpers ----------
function initials(name: string) {
  return name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
}
function toneBg(t: "success"|"info"|"warning"|"danger"|"purple") {
  return { success:"bg-success", info:"bg-info", warning:"bg-warning", danger:"bg-danger", purple:"bg-purple" }[t];
}

function ProfileSection({ title, icon: Icon, action, children }: { title: string; icon: React.ElementType; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <GlassCard hover={false}>
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15"><Icon className="h-3.5 w-3.5 text-primary"/></div>
          <h4 className="text-[13px] font-semibold">{title}</h4>
        </div>
        {action}
      </div>
      {children}
    </GlassCard>
  );
}

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
      {items.map(([k, v]) => (
        <div key={k}>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
          <div className="mt-0.5 text-sm font-medium text-foreground">{v}</div>
        </div>
      ))}
    </div>
  );
}

function InfoLine({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 flex items-center gap-1.5 text-sm font-medium">
        {Icon && <Icon className="h-3 w-3 text-muted-foreground"/>}
        <span>{value}</span>
      </div>
    </div>
  );
}

function StatTile({ label, value, icon: Icon, muted }: { label: string; value: string; icon: React.ElementType; muted?: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/30 p-3">
      <div className="flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${muted ? "text-muted-foreground" : "text-primary"}`}/>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
      <div className={`mt-1.5 text-base font-semibold ${muted ? "text-muted-foreground" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, tone }: { icon: React.ElementType; label: string; tone?: "danger" }) {
  return (
    <Button size="sm" variant="outline" className={`h-8 border-border bg-elevated/60 text-xs ${tone === "danger" ? "hover:border-danger/40 hover:text-danger" : ""}`}>
      <Icon className="mr-1.5 h-3.5 w-3.5"/>{label}
    </Button>
  );
}

function buildTruckTimeline(t: OpTruck) {
  return [
    { time: t.purchaseDate, label: "Truck Registered", detail: `${t.manufacturer} ${t.model} added to fleet`, tone: "info" as const },
    { time: "2026-05-12", label: "Driver Assigned", detail: `${t.driver} assigned`, tone: "info" as const },
    ...(t.currentTripId ? [
      { time: "Today 08:22", label: "Trip Assigned", detail: `${t.currentTripId} · ${t.currentTripCustomer}`, tone: "success" as const },
      { time: "Today 09:41", label: "Arrived at Pickup", detail: t.pickup ?? "", tone: "info" as const },
      { time: "Today 10:12", label: "Loading Completed", detail: "", tone: "warning" as const },
      { time: `Today · ${t.lastUpdatedMin}m ago`, label: "Location Updated", detail: t.lastKnownLocation, tone: "info" as const },
    ] : []),
    ...(t.opStatus === "Under Maintenance" ? [
      { time: "2 days ago", label: "Maintenance Started", detail: "Scheduled service", tone: "danger" as const },
    ] : []),
  ];
}

function buildDriverTimeline(d: OpDriver) {
  return [
    { time: "2025-08-01", label: "Onboarded", detail: `Licence ${d.license} verified`, tone: "info" as const },
    { time: "2026-04-14", label: "Truck Assigned", detail: d.assignedTruck, tone: "info" as const },
    ...(d.currentTrip ? [
      { time: "Today 08:22", label: "Trip Assigned", detail: d.currentTrip, tone: "success" as const },
      { time: "Today 08:45", label: "Trip Started", detail: "", tone: "info" as const },
      { time: `Today · ${d.lastUpdatedMin}m ago`, label: "Status Update", detail: d.status, tone: "warning" as const },
    ] : [
      { time: "Yesterday", label: "Trip Completed", detail: "TRP-7301 · Lagos → Abuja", tone: "success" as const },
    ]),
  ];
}
