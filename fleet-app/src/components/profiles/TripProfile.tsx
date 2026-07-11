import { useMemo } from "react";
import {
  Route as RouteIcon,
  ArrowRight,
  Truck as TruckIcon,
  User,
  Package,
  Building2,
  Clock,
  MapPin,
  Gauge,
} from "lucide-react";
import {
  type ProfileTarget,
} from "@/lib/profile-drawer";
import {
  trips,
  trucks,
  drivers,
  routes,
  clients,
  type Trip,
  type TripStatus,
} from "@/lib/mock-data";
import {
  RecommendationsSection,
  type Recommendation,
} from "@/components/shared/Insights";
import { Pill } from "@/components/shared/Cards";
import {
  ProfileHeader,
  ProfileSection,
  InfoGrid,
  StatTile,
  EmptyState,
  type Tone,
} from "@/components/profiles/ProfileShell";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Tone helpers                                                         */
/* ------------------------------------------------------------------ */

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
/* Link button                                                          */
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
/* Linked entity row                                                   */
/* ------------------------------------------------------------------ */

interface LinkedEntityRowProps {
  icon: React.ComponentType<{ className?: string }>;
  iconTone: Tone;
  label: string;
  value: React.ReactNode;
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

function LinkedEntityRow({
  icon: Icon,
  iconTone,
  label,
  value,
}: LinkedEntityRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/[0.02] p-4">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          toneBg15[iconTone],
          toneText[iconTone],
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Recommendations                                                      */
/* ------------------------------------------------------------------ */

function buildTripRecommendations(trip: Trip): Recommendation[] {
  const recs: Recommendation[] = [];

  if (trip.status === "Delayed") {
    recs.push({
      title: "Trip delayed",
      detail: `${trip.id} is delayed. Contact the driver and client to share an updated ETA.`,
      tone: "warning",
      icon: "general",
    });
  }

  if (trip.status === "Scheduled") {
    recs.push({
      title: "Pre-trip checklist",
      detail: `${trip.id} is scheduled. Confirm truck readiness, cargo loading, and driver briefing.`,
      tone: "info",
      icon: "compliance",
    });
  }

  if (trip.status === "In Transit") {
    recs.push({
      title: "Monitor live trip",
      detail: `${trip.id} is in transit. Track progress against the planned route and ETA.`,
      tone: "info",
      icon: "performance",
    });
  }

  if (trip.distance > 500) {
    recs.push({
      title: "Long-haul trip",
      detail: `Distance is ${trip.distance} km. Ensure driver rest stops and fuel planning are in place.`,
      tone: "warning",
      icon: "general",
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: "Trip completed",
      detail: `${trip.id} has been delivered successfully. Log any feedback for future trips.`,
      tone: "success",
      icon: "performance",
    });
  }

  return recs;
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export interface TripProfileProps {
  id: string;
  onOpen: (t: ProfileTarget) => void;
  onBack?: () => void;
}

export function TripProfile({ id, onOpen }: TripProfileProps) {
  const trip = useMemo(() => trips.find((t) => t.id === id), [id]);

  if (!trip) {
    return <EmptyState message={`Trip ${id} not found.`} />;
  }

  const truck = trucks.find((t) => t.id === trip.truck);
  const driver = drivers.find((d) => d.name === trip.driver);
  const route = routes.find((r) => r.id === trip.routeId);
  const client = clients.find((c) => c.id === trip.clientId);

  const statusTone = tripStatusTone(trip.status);

  const detailItems = [
    { label: "Origin", value: trip.origin },
    { label: "Destination", value: trip.destination },
    { label: "Distance", value: `${trip.distance} km` },
    {
      label: "Status",
      value: <Pill tone={statusTone}>{trip.status}</Pill>,
    },
    { label: "Departure", value: formatDateTime(trip.departureTime) },
    { label: "Arrival", value: formatDateTime(trip.arrivalTime) },
    { label: "Cargo", value: trip.cargo },
    {
      label: "Truck",
      value: (
        <LinkButton
          label={truck ? `${trip.truck} · ${truck.plate}` : trip.truck}
          onClick={() => onOpen({ kind: "truck", id: trip.truck })}
        />
      ),
    },
    {
      label: "Driver",
      value: (
        <LinkButton
          label={trip.driver}
          onClick={() => {
            if (driver) onOpen({ kind: "driver", id: driver.id });
          }}
        />
      ),
    },
    {
      label: "Route",
      value: route ? (
        <LinkButton
          label={route.name}
          onClick={() => onOpen({ kind: "route", id: trip.routeId })}
        />
      ) : (
        trip.routeId
      ),
    },
    {
      label: "Client",
      value: client ? (
        <LinkButton
          label={client.name}
          onClick={() => onOpen({ kind: "client", id: trip.clientId })}
        />
      ) : (
        trip.clientId
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        icon={RouteIcon}
        title={trip.id}
        subtitle={`${trip.origin} → ${trip.destination}`}
        tone={statusTone}
        badge={<Pill tone={statusTone}>{trip.status}</Pill>}
      />

      <ProfileSection title="Key Metrics">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label="Distance"
            value={`${trip.distance} km`}
            icon={Gauge}
            tone="info"
          />
          <StatTile
            label="Status"
            value={trip.status}
            icon={RouteIcon}
            tone={statusTone}
          />
          <StatTile
            label="Departure"
            value={formatDateTime(trip.departureTime)}
            icon={Clock}
            tone="purple"
          />
          <StatTile
            label="Arrival"
            value={formatDateTime(trip.arrivalTime)}
            icon={Clock}
            tone="success"
          />
        </div>
      </ProfileSection>

      <ProfileSection title="Trip Details">
        <InfoGrid items={detailItems} />
      </ProfileSection>

      <ProfileSection title="Route Summary">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/[0.02] p-4">
          <MapPin className="h-5 w-5 text-info" aria-hidden="true" />
          <span className="font-medium text-foreground">{trip.origin}</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <MapPin className="h-5 w-5 text-success" aria-hidden="true" />
          <span className="font-medium text-foreground">{trip.destination}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {trip.distance} km
          </span>
        </div>
      </ProfileSection>

      <ProfileSection title="Linked Entities">
        <div className="flex flex-col gap-3">
          <LinkedEntityRow
            icon={TruckIcon}
            iconTone="info"
            label="Truck"
            value={
              <LinkButton
                label={truck ? `${trip.truck} · ${truck.plate}` : trip.truck}
                onClick={() => onOpen({ kind: "truck", id: trip.truck })}
              />
            }
          />
          <LinkedEntityRow
            icon={User}
            iconTone="success"
            label="Driver"
            value={
              <LinkButton
                label={trip.driver}
                onClick={() => {
                  if (driver) onOpen({ kind: "driver", id: driver.id });
                }}
              />
            }
          />
          <LinkedEntityRow
            icon={RouteIcon}
            iconTone="purple"
            label="Route"
            value={
              route ? (
                <LinkButton
                  label={route.name}
                  onClick={() => onOpen({ kind: "route", id: trip.routeId })}
                />
              ) : (
                <span>{trip.routeId}</span>
              )
            }
          />
          <LinkedEntityRow
            icon={Building2}
            iconTone="warning"
            label="Client"
            value={
              client ? (
                <LinkButton
                  label={client.name}
                  onClick={() => onOpen({ kind: "client", id: trip.clientId })}
                />
              ) : (
                <span>{trip.clientId}</span>
              )
            }
          />
          <LinkedEntityRow
            icon={Package}
            iconTone="info"
            label="Cargo"
            value={<span>{trip.cargo}</span>}
          />
        </div>
      </ProfileSection>

      <RecommendationsSection
        title="Recommendations"
        recommendations={buildTripRecommendations(trip)}
      />
    </div>
  );
}

export default TripProfile;
