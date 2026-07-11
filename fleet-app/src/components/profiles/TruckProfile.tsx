import { useMemo } from "react";
import { Truck as TruckIcon, Fuel, Gauge, HeartPulse, MapPin, Wrench, TriangleAlert as AlertTriangle, FileText, Route as RouteIcon, Navigation } from "lucide-react";
import {
  type ProfileTarget,
} from "@/lib/profile-drawer";
import {
  trucks,
  trips,
  incidents,
  maintenanceRecords,
  documents,
  drivers,
  getRouteFor,
  type Truck,
  type Trip,
  type MaintenanceRecord,
  type DocumentRecord,
  type TruckStatus,
  type TripStatus,
  type IncidentStatus,
  type IncidentSeverity,
} from "@/lib/mock-data";
import { useFleetManagers } from "@/lib/fleet-managers-store";
import { usePreferences } from "@/lib/preferences";
import {
  RecommendationsSection,
  type Recommendation,
} from "@/components/shared/Insights";
import { Pill } from "@/components/shared/Cards";
import {
  ProfileHeader,
  ProfileSection,
  ProfileTabs,
  ProfileTabContent,
  InfoGrid,
  StatTile,
  TimelineList,
  DocumentsGrid,
  EmptyState,
  type Tone,
} from "@/components/profiles/ProfileShell";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Tone helpers                                                         */
/* ------------------------------------------------------------------ */

function truckStatusTone(status: TruckStatus): Tone {
  switch (status) {
    case "On The Road":
      return "success";
    case "Idle":
      return "warning";
    case "Maintenance":
      return "danger";
    case "Offline":
      return "info";
    default:
      return "info";
  }
}

function tripStatusTone(status: TripStatus): Tone {
  switch (status) {
    case "Delivered":
      return "success";
    case "In Transit":
      return "info";
    case "Delayed":
      return "warning";
    case "Scheduled":
      return "purple";
    default:
      return "info";
  }
}


function severityTone(severity: IncidentSeverity): Tone {
  switch (severity) {
    case "Critical":
      return "danger";
    case "High":
      return "danger";
    case "Medium":
      return "warning";
    case "Low":
      return "info";
    default:
      return "info";
  }
}

function maintenanceStatusTone(status: string): Tone {
  switch (status) {
    case "Completed":
      return "success";
    case "Scheduled":
      return "info";
    case "Overdue":
      return "danger";
    default:
      return "info";
  }
}

function engineHealthTone(value: number): Tone {
  if (value >= 85) return "success";
  if (value >= 70) return "warning";
  return "danger";
}

function fuelTone(value: number): Tone {
  if (value >= 50) return "success";
  if (value >= 25) return "warning";
  return "danger";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/* Link button (opens another profile)                                 */
/* ------------------------------------------------------------------ */

interface LinkButtonProps {
  label: string;
  onClick: () => void;
}

function LinkButton({ label, onClick }: LinkButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-sm font-medium text-primary underline-offset-2",
        "transition-colors hover:text-primary/80 hover:underline",
        "focus:outline-none focus:ring-2 focus:ring-primary rounded",
      )}
    >
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Trip row                                                             */
/* ------------------------------------------------------------------ */

interface TripRowProps {
  trip: Trip;
  onOpen: (t: ProfileTarget) => void;
}

function TripRow({ trip, onOpen }: TripRowProps) {
  const route = getRouteFor(trip.routeId);
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-3">
        <LinkButton
          label={trip.id}
          onClick={() => onOpen({ kind: "trip", id: trip.id })}
        />
        <Pill tone={tripStatusTone(trip.status)}>{trip.status}</Pill>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{trip.origin}</span>
        <RouteIcon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="font-medium text-foreground">{trip.destination}</span>
        <span className="text-xs">· {trip.distance} km</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          Truck:{" "}
          <LinkButton
            label={trip.truck}
            onClick={() => onOpen({ kind: "truck", id: trip.truck })}
          />
        </span>
        <span>
          Driver:{" "}
          <LinkButton
            label={trip.driver}
            onClick={() => {
              const drv = drivers.find((d) => d.name === trip.driver);
              if (drv) onOpen({ kind: "driver", id: drv.id });
            }}
          />
        </span>
        {route ? (
          <span>
            Route:{" "}
            <LinkButton
              label={route.name}
              onClick={() => onOpen({ kind: "route", id: route.id })}
            />
          </span>
        ) : null}
        <span>Dep: {formatDateTime(trip.departureTime)}</span>
        <span>Cargo: {trip.cargo}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Maintenance row                                                    */
/* ------------------------------------------------------------------ */

interface MaintenanceRowProps {
  record: MaintenanceRecord;
}

function MaintenanceRow({ record }: MaintenanceRowProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">
          {record.service}
        </span>
        <Pill tone={maintenanceStatusTone(record.status)}>
          {record.status}
        </Pill>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>{formatDate(record.date)}</span>
        <span>{record.performedBy}</span>
        <span className="font-medium text-foreground">{record.cost}</span>
        <span>Priority: {record.priority}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Recommendations                                                      */
/* ------------------------------------------------------------------ */

function buildTruckRecommendations(truck: Truck): Recommendation[] {
  const recs: Recommendation[] = [];

  if (truck.fuel < 25) {
    recs.push({
      title: "Refuel soon",
      detail: `Fuel level is at ${truck.fuel}%. Schedule a refuel stop to avoid running dry mid-trip.`,
      tone: "danger",
      icon: "fuel",
    });
  } else if (truck.fuel < 50) {
    recs.push({
      title: "Monitor fuel level",
      detail: `Fuel at ${truck.fuel}%. Plan a refuel within the next leg of the journey.`,
      tone: "warning",
      icon: "fuel",
    });
  }

  if (truck.engineHealth < 70) {
    recs.push({
      title: "Engine health critical",
      detail: `Engine health reading ${truck.engineHealth}%. Book a diagnostic inspection at the nearest workshop.`,
      tone: "danger",
      icon: "maintenance",
    });
  } else if (truck.engineHealth < 85) {
    recs.push({
      title: "Schedule preventive maintenance",
      detail: `Engine health at ${truck.engineHealth}%. Consider a preventive service to avoid roadside failure.`,
      tone: "warning",
      icon: "maintenance",
    });
  }

  if (truck.status === "Maintenance") {
    recs.push({
      title: "Truck under maintenance",
      detail: `${truck.plate} is currently in the workshop. Confirm the expected return-to-service date.`,
      tone: "warning",
      icon: "maintenance",
    });
  }

  if (truck.status === "Offline") {
    recs.push({
      title: "Truck offline",
      detail: `${truck.plate} is offline. Investigate telematics connectivity or depot status.`,
      tone: "danger",
      icon: "general",
    });
  }

  if (truck.odometer > 250000) {
    recs.push({
      title: "High odometer reading",
      detail: `Odometer at ${truck.odometer.toLocaleString()} km. Prioritize wear-item inspections (brakes, tires, fluids).`,
      tone: "warning",
      icon: "maintenance",
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: "Truck in good shape",
      detail: "All key metrics are within healthy ranges. Keep up the regular service schedule.",
      tone: "success",
      icon: "performance",
    });
  }

  return recs;
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export interface TruckProfileProps {
  id: string;
  onOpen: (t: ProfileTarget) => void;
  onBack?: () => void;
}

export function TruckProfile({ id, onOpen }: TruckProfileProps) {
  const { getManagerForTruck } = useFleetManagers();
  const { trackingMode } = usePreferences();

  const truck = useMemo(() => trucks.find((t) => t.id === id), [id]);

  const truckTrips = useMemo(
    () => trips.filter((t) => t.truck === id),
    [id],
  );
  const truckIncidents = useMemo(
    () => incidents.filter((i) => i.truckId === id),
    [id],
  );
  const truckMaintenance = useMemo(
    () => maintenanceRecords.filter((m) => m.truck === id),
    [id],
  );
  const truckDocs = useMemo<DocumentRecord[]>(
    () => documents.filter((d) => d.owner === truck?.plate),
    [truck],
  );

  if (!truck) {
    return (
      <EmptyState message={`Truck ${id} not found.`} />
    );
  }

  const manager = getManagerForTruck(id);
  const assignedDriver = drivers.find((d) => d.name === truck.driver);
  const statusTone = truckStatusTone(truck.status);

  const overviewItems = [
    { label: "Type", value: truck.type },
    { label: "Capacity", value: truck.capacity },
    { label: "Fuel Level", value: `${truck.fuel}%` },
    { label: "Odometer", value: `${truck.odometer.toLocaleString()} km` },
    { label: "Engine Health", value: `${truck.engineHealth}%` },
    { label: "Status", value: <Pill tone={statusTone}>{truck.status}</Pill> },
    { label: "Current Location", value: truck.location },
    {
      label: "Assigned Driver",
      value: assignedDriver ? (
        <LinkButton
          label={truck.driver}
          onClick={() => onOpen({ kind: "driver", id: assignedDriver.id })}
        />
      ) : (
        truck.driver
      ),
    },
    {
      label: "Fleet Manager",
      value: manager ? (
        <LinkButton
          label={manager.name}
          onClick={() => onOpen({ kind: "fleet-manager", id: manager.id })}
        />
      ) : (
        "Unassigned"
      ),
    },
  ];

  const incidentTimeline = truckIncidents
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((i) => ({
      time: formatDate(i.date),
      title: `${i.type} · ${i.severity}`,
      detail: i.description,
      tone: severityTone(i.severity),
    }));

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        icon={TruckIcon}
        title={truck.plate}
        subtitle={truck.model}
        tone={statusTone}
        badge={<Pill tone={statusTone}>{truck.status}</Pill>}
      />

      {trackingMode === "automated" ? (
        <div className="flex items-center gap-2 rounded-xl border border-info/30 bg-info/10 px-4 py-3 text-sm text-info">
          <Navigation className="h-4 w-4" aria-hidden="true" />
          <span>Live tracking active — last ping from {truck.location}.</span>
        </div>
      ) : null}

      <ProfileTabs
        tabs={[
          { label: "Overview", value: "overview" },
          { label: "Trips", value: "trips" },
          { label: "Maintenance", value: "maintenance" },
          { label: "Incidents", value: "incidents" },
          { label: "Documents", value: "documents" },
        ]}
      >
        <ProfileTabContent value="overview" className="flex flex-col gap-6 pt-4">
          <ProfileSection title="Key Metrics">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile
                label="Fuel"
                value={`${truck.fuel}%`}
                icon={Fuel}
                tone={fuelTone(truck.fuel)}
              />
              <StatTile
                label="Odometer"
                value={`${(truck.odometer / 1000).toFixed(0)}k km`}
                icon={Gauge}
                tone="info"
              />
              <StatTile
                label="Engine Health"
                value={`${truck.engineHealth}%`}
                icon={HeartPulse}
                tone={engineHealthTone(truck.engineHealth)}
              />
              <StatTile
                label="Trips"
                value={truckTrips.length}
                icon={RouteIcon}
                tone="purple"
              />
            </div>
          </ProfileSection>

          <ProfileSection title="Vehicle Details">
            <InfoGrid items={overviewItems} />
          </ProfileSection>

          <ProfileSection title="Location">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-info" aria-hidden="true" />
              <span className="font-medium text-foreground">
                {truck.location}
              </span>
            </div>
          </ProfileSection>
        </ProfileTabContent>

        <ProfileTabContent value="trips" className="pt-4">
          <ProfileSection
            title={`Trips (${truckTrips.length})`}
          >
            {truckTrips.length === 0 ? (
              <EmptyState message="No trips recorded for this truck." />
            ) : (
              <div className="flex flex-col gap-3">
                {truckTrips.map((trip) => (
                  <TripRow key={trip.id} trip={trip} onOpen={onOpen} />
                ))}
              </div>
            )}
          </ProfileSection>
        </ProfileTabContent>

        <ProfileTabContent value="maintenance" className="pt-4">
          <ProfileSection
            title={`Maintenance (${truckMaintenance.length})`}
            action={
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                Service history
              </span>
            }
          >
            {truckMaintenance.length === 0 ? (
              <EmptyState message="No maintenance records for this truck." />
            ) : (
              <div className="flex flex-col gap-3">
                {truckMaintenance.map((m) => (
                  <MaintenanceRow key={m.id} record={m} />
                ))}
              </div>
            )}
          </ProfileSection>
        </ProfileTabContent>

        <ProfileTabContent value="incidents" className="pt-4">
          <ProfileSection
            title={`Incidents (${truckIncidents.length})`}
            action={
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                Safety log
              </span>
            }
          >
            {truckIncidents.length === 0 ? (
              <EmptyState message="No incidents reported for this truck." />
            ) : (
              <TimelineList items={incidentTimeline} />
            )}
          </ProfileSection>
        </ProfileTabContent>

        <ProfileTabContent value="documents" className="pt-4">
          <ProfileSection
            title={`Documents (${truckDocs.length})`}
            action={
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                On file
              </span>
            }
          >
            <DocumentsGrid
              docs={truckDocs.map((d) => ({
                type: d.type,
                owner: d.owner,
                expiry: formatDate(d.expiryDate),
                status: d.status,
              }))}
            />
          </ProfileSection>
        </ProfileTabContent>
      </ProfileTabs>

      <RecommendationsSection
        title="Recommendations"
        recommendations={buildTruckRecommendations(truck)}
      />
    </div>
  );
}

export default TruckProfile;
