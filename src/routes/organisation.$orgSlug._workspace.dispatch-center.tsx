import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ComponentType } from "react";
import {
  MapPin,
  Truck as TruckIcon,
  Navigation,
  Send,
  User,
  Gauge,
  Fuel,
  Wrench,
  AlertTriangle,
  type LucideProps,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import {
  KPICard,
  GlassCard,
  SectionCard,
  Pill,
  type Tone,
} from "@/components/shared/Cards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { usePreferences } from "@/lib/preferences";
import { useFleetManagers } from "@/lib/fleet-managers-store";
import { trucks, drivers, type Truck as TruckType } from "@/lib/mock-data";

export const Route = createFileRoute("/organisation/$orgSlug/_workspace/dispatch-center")({
  component: DispatchCenter,
});

type TruckTypeFilter = "all" | "Heavy Duty" | "Medium Duty";

interface NearbyTruck {
  truck: TruckType;
  distanceKm: number;
}

const toneBg15: Record<Tone, string> = {
  info: "bg-info/15",
  success: "bg-success/15",
  warning: "bg-warning/15",
  danger: "bg-danger/15",
  purple: "bg-purple/15",
};

const toneText: Record<Tone, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  purple: "text-purple",
};

const truckStatusTone: Record<TruckType["status"], Tone> = {
  "On The Road": "success",
  Idle: "warning",
  Maintenance: "danger",
  Offline: "info",
};

const NIGERIAN_CITIES = [
  "Lagos",
  "Abuja",
  "Kano",
  "Ibadan",
  "Port Harcourt",
  "Benin City",
  "Kaduna",
  "Enugu",
] as const;

const TRUCK_TYPES: { value: TruckTypeFilter; label: string }[] = [
  { value: "all", label: "All Truck Types" },
  { value: "Heavy Duty", label: "Heavy Duty" },
  { value: "Medium Duty", label: "Medium Duty" },
];

function distanceFor(truckId: string): number {
  let hash = 0;
  for (let i = 0; i < truckId.length; i++) {
    hash = (hash * 31 + truckId.charCodeAt(i)) >>> 0;
  }
  return 2 + (hash % 48);
}

function MapPlaceholder({ highlight }: { highlight?: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border/60 bg-[#0b0f17]">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g stroke="rgba(99,102,241,0.45)" strokeWidth="3" fill="none">
          <path d="M40,60 C120,80 200,120 360,90" />
          <path d="M60,260 C140,200 240,180 360,220" />
          <path d="M120,20 C140,120 160,200 180,280" />
          <path d="M280,20 C260,120 250,200 240,280" />
        </g>
        <g stroke="rgba(148,163,184,0.25)" strokeWidth="1.5" fill="none">
          <path d="M40,60 L120,20" />
          <path d="M360,90 L280,20" />
          <path d="M60,260 L180,280" />
          <path d="M360,220 L240,280" />
          <path d="M120,20 L280,20" />
          <path d="M40,60 L60,260" />
          <path d="M360,90 L360,220" />
        </g>
        {[
          { x: 120, y: 20, label: "Kano" },
          { x: 280, y: 20, label: "Kaduna" },
          { x: 40, y: 60, label: "Abuja" },
          { x: 360, y: 90, label: "Enugu" },
          { x: 180, y: 280, label: "Lagos" },
          { x: 240, y: 280, label: "Ibadan" },
          { x: 60, y: 260, label: "Port Harcourt" },
          { x: 360, y: 220, label: "Benin City" },
        ].map((city) => {
          const isHighlight = highlight && city.label === highlight;
          return (
            <g key={city.label}>
              <circle
                cx={city.x}
                cy={city.y}
                r={isHighlight ? 5 : 3}
                fill={isHighlight ? "#22c55e" : "rgba(148,163,184,0.7)"}
              />
              {isHighlight && (
                <circle cx={city.x} cy={city.y} r={9} fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.6">
                  <animate attributeName="r" from="5" to="14" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}
              <text x={city.x + 6} y={city.y + 3} fontSize="9" fill={isHighlight ? "#22c55e" : "rgba(203,213,225,0.7)"} fontWeight={isHighlight ? 600 : 400}>
                {city.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-md border border-border/60 bg-black/40 px-2.5 py-1.5 text-[10px] text-muted-foreground backdrop-blur">
        <span className="flex items-center gap-1.5"><span className="inline-block h-1.5 w-4 rounded-full bg-info/60" />Highway</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-1.5 w-4 rounded-full bg-muted-foreground/40" />Secondary</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-success" />Pickup</span>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: ComponentType<LucideProps>; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="flex items-center gap-2 text-sm text-muted-foreground"><Icon className="h-4 w-4" strokeWidth={2} />{label}</span>
      <span className="truncate text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function DispatchCenter() {
  const { trackingMode } = usePreferences();
  const { getManagerForTruck } = useFleetManagers();
  const { open: openProfile } = useProfileDrawer();

  const [pickupLocation, setPickupLocation] = useState<string>("Lagos");
  const [truckType, setTruckType] = useState<TruckTypeFilter>("all");
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);

  const isAutomated = trackingMode === "automated";

  const nearbyTrucks: NearbyTruck[] = useMemo(() => {
    const filtered = trucks.filter((t) => {
      if (t.driver === "Unassigned") return false;
      if (truckType !== "all" && t.type !== truckType) return false;
      if (!pickupLocation.trim()) return true;
      return t.location.toLowerCase() === pickupLocation.trim().toLowerCase();
    });
    const source = filtered.length > 0 ? filtered : trucks.filter((t) => t.driver !== "Unassigned" && (truckType === "all" || t.type === truckType));
    return source.map((truck) => ({ truck, distanceKm: distanceFor(truck.id) })).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 6);
  }, [pickupLocation, truckType]);

  const selectedTruck = useMemo<TruckType | null>(() => {
    if (!selectedTruckId) return null;
    return trucks.find((t) => t.id === selectedTruckId) ?? null;
  }, [selectedTruckId]);

  const selectedDriver = useMemo(() => {
    if (!selectedTruck || selectedTruck.driver === "Unassigned") return null;
    return drivers.find((d) => d.name === selectedTruck.driver) ?? null;
  }, [selectedTruck]);

  const selectedManager = useMemo(() => {
    if (!selectedTruck) return null;
    return getManagerForTruck(selectedTruck.id) ?? null;
  }, [selectedTruck, getManagerForTruck]);

  function handleDispatch() {
    if (!selectedTruck) return;
    toast.success("Truck dispatched", {
      description: `${selectedTruck.plate} (${selectedTruck.model}) assigned to ${pickupLocation || "the requested location"}.`,
    });
  }

  return (
    <>
      <Header title="Dispatch Center" subtitle="Find an available truck and dispatch it to a pickup location." />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard icon={TruckIcon} label="Available Trucks" value={nearbyTrucks.length} tone="info" footnote="Matching location & type" />
          <KPICard icon={Navigation} label="Pickup Location" value={pickupLocation || "—"} tone="purple" footnote={isAutomated ? "Automated tracking" : "Manual tracking"} />
          <KPICard icon={Gauge} label="Tracking Mode" value={isAutomated ? "Automated" : "Manual"} tone={isAutomated ? "success" : "warning"} footnote={isAutomated ? "GPS distances enabled" : "Self-reported"} />
          <KPICard icon={Send} label="Selected Truck" value={selectedTruck ? selectedTruck.plate : "—"} tone={selectedTruck ? "success" : "info"} footnote={selectedTruck ? selectedTruck.model : "No truck selected"} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_1fr]">
          <div className="space-y-4">
            <SectionCard title="Step 1 · Where do you need a truck?" action={<span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">1</span>}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pickup-location" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
                    <input id="pickup-location" type="text" list="pickup-cities" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder="Enter a city or address" className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary" />
                    <datalist id="pickup-cities">{NIGERIAN_CITIES.map((c) => <option key={c} value={c} />)}</datalist>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="truck-type" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Truck Type</label>
                  <Select value={truckType} onValueChange={(v) => setTruckType(v as TruckTypeFilter)}>
                    <SelectTrigger id="truck-type"><SelectValue placeholder="Select truck type" /></SelectTrigger>
                    <SelectContent>{TRUCK_TYPES.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Step 2 · Available Trucks Near This Location" action={<span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">2</span>}>
              {nearbyTrucks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">No trucks match the current filters. Try a different location or truck type.</div>
              ) : (
                <div className="space-y-2.5">
                  {nearbyTrucks.map(({ truck, distanceKm }) => {
                    const tone = truckStatusTone[truck.status];
                    const isSelected = truck.id === selectedTruckId;
                    return (
                      <button key={truck.id} type="button" onClick={() => setSelectedTruckId(truck.id)} className={[
                        "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition",
                        isSelected ? "border-primary bg-primary/10" : "border-border bg-elevated/40 hover:border-primary/40 hover:bg-elevated/60",
                      ].join(" ")}>
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-elevated/60">
                          <img src="/truck.png" alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-foreground">{truck.plate}</span>
                            {isAutomated && <Pill tone="info">{distanceKm} km away</Pill>}
                          </div>
                          <span className="truncate text-xs text-muted-foreground">{truck.model}</span>
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><User className="h-3 w-3" strokeWidth={2} />{truck.driver}</span>
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3 w-3" strokeWidth={2} />{truck.location}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard title="Live Map" action={isAutomated ? <Pill tone="success"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-success" />Automated</Pill> : <Pill tone="warning"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-warning" />Manual</Pill>}>
              {isAutomated ? (
                <div className="h-72 w-full"><MapPlaceholder highlight={pickupLocation || undefined} /></div>
              ) : (
                <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-elevated/40 p-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/15 text-warning"><AlertTriangle className="h-6 w-6" strokeWidth={2} /></span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Manual Tracking Mode</p>
                    <p className="mt-1 max-w-sm text-xs text-muted-foreground">Live GPS distances are disabled. Drivers self-report their locations. Switch to Automated tracking in Settings to see truck distances and the live map.</p>
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Selected Truck" action={selectedTruck ? <Pill tone={truckStatusTone[selectedTruck.status]}>{selectedTruck.status}</Pill> : null}>
              {!selectedTruck ? (
                <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">Select a truck from the list to view its details and dispatch it.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  <GlassCard hover={false} className="flex items-center gap-4">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-elevated/60">
                      <img src="/truck.png" alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-lg font-semibold text-foreground">{selectedTruck.plate}</span>
                      <span className="truncate text-sm text-muted-foreground">{selectedTruck.model} · {selectedTruck.capacity}</span>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => openProfile({ kind: "truck", id: selectedTruck.id })} className="inline-flex h-8 items-center justify-center rounded-md border border-border/60 px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-elevated/60 hover:text-foreground"><TruckIcon className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />Truck</button>
                      {selectedDriver && <button type="button" onClick={() => openProfile({ kind: "driver", id: selectedDriver.id })} className="inline-flex h-8 items-center justify-center rounded-md border border-border/60 px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-elevated/60 hover:text-foreground"><User className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />Driver</button>}
                    </div>
                  </GlassCard>

                  <div className="divide-y divide-border/40 rounded-lg border border-border/40 bg-elevated/40 px-4">
                    <DetailRow icon={User} label="Driver" value={selectedTruck.driver} />
                    <DetailRow icon={MapPin} label="Current Location" value={selectedTruck.location} />
                    <DetailRow icon={Gauge} label="Odometer" value={`${selectedTruck.odometer.toLocaleString()} km`} />
                    <DetailRow icon={Fuel} label="Fuel Level" value={`${selectedTruck.fuel}%`} />
                    <DetailRow icon={Wrench} label="Engine Health" value={`${selectedTruck.engineHealth}%`} />
                    {selectedManager && <DetailRow icon={User} label="Fleet Manager" value={selectedManager.name} />}
                  </div>

                  <button type="button" onClick={handleDispatch} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                    <Send className="h-4 w-4" strokeWidth={2} />Dispatch {selectedTruck.plate} to {pickupLocation || "pickup"}
                  </button>
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  );
}
