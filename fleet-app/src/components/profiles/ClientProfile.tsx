import { useMemo } from "react";
import {
  Building2,
  Mail,
  Phone,
  Route as RouteIcon,
  Wallet,
  CalendarDays,
  User,
} from "lucide-react";
import {
  type ProfileTarget,
} from "@/lib/profile-drawer";
import {
  clients,
  trips,
  routes,
  type Client,
  type Trip,
  type TripStatus,
  type ClientStatus,
} from "@/lib/mock-data";
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
  EmptyState,
  type Tone,
} from "@/components/profiles/ProfileShell";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Tone helpers                                                         */
/* ------------------------------------------------------------------ */

function clientStatusTone(status: ClientStatus): Tone {
  return status === "Active" ? "success" : "warning";
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
/* Trip row                                                            */
/* ------------------------------------------------------------------ */

interface TripRowProps {
  trip: Trip;
  onOpen: (t: ProfileTarget) => void;
}

function TripRow({ trip, onOpen }: TripRowProps) {
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
        {(() => { const r = routes.find(rt => rt.id === trip.routeId); return r ? (
          <span>
            Route:{" "}
            <LinkButton
              label={r.name}
              onClick={() => onOpen({ kind: "route", id: trip.routeId })}
            />
          </span>
        ) : null; })()}
        <span>Dep: {formatDateTime(trip.departureTime)}</span>
        <span>Cargo: {trip.cargo}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Recommendations                                                      */
/* ------------------------------------------------------------------ */

function buildClientRecommendations(client: Client): Recommendation[] {
  const recs: Recommendation[] = [];

  if (client.status === "Inactive") {
    recs.push({
      title: "Re-engage inactive client",
      detail: `${client.name} is currently inactive. Reach out to discuss renewed logistics needs.`,
      tone: "warning",
      icon: "general",
    });
  }

  if (client.totalTrips < 100) {
    recs.push({
      title: "Grow account volume",
      detail: `${client.totalTrips} trips to date. Explore opportunities to expand the contract scope.`,
      tone: "info",
      icon: "performance",
    });
  } else {
    recs.push({
      title: "Loyal high-volume client",
      detail: `${client.totalTrips} trips completed. Consider a preferred-pricing or loyalty agreement.`,
      tone: "success",
      icon: "performance",
    });
  }

  const joined = new Date(client.joinDate);
  const years = (Date.now() - joined.getTime()) / (1000 * 60 * 60 * 24 * 365);
  if (years >= 3) {
    recs.push({
      title: "Long-standing partnership",
      detail: `Client since ${formatDate(client.joinDate)} (${years.toFixed(0)}+ years). Schedule an annual review.`,
      tone: "purple",
      icon: "general",
    });
  }

  return recs;
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export interface ClientProfileProps {
  id: string;
  onOpen: (t: ProfileTarget) => void;
  onBack?: () => void;
}

export function ClientProfile({ id, onOpen }: ClientProfileProps) {
  const client = useMemo(() => clients.find((c) => c.id === id), [id]);

  const clientTrips = useMemo(
    () => trips.filter((t) => t.clientId === id),
    [id],
  );

  if (!client) {
    return <EmptyState message={`Client ${id} not found.`} />;
  }

  const statusTone = clientStatusTone(client.status);

  const overviewItems = [
    { label: "Industry", value: client.industry },
    { label: "Status", value: <Pill tone={statusTone}>{client.status}</Pill> },
    { label: "Total Trips", value: client.totalTrips },
    { label: "Total Spent", value: client.totalSpent },
    { label: "Contact Person", value: client.contactPerson },
    { label: "Email", value: client.email },
    { label: "Phone", value: client.phone },
    { label: "Join Date", value: formatDate(client.joinDate) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        icon={Building2}
        title={client.name}
        subtitle={client.industry}
        tone={statusTone}
        badge={<Pill tone={statusTone}>{client.status}</Pill>}
      />

      <ProfileTabs
        tabs={[
          { label: "Overview", value: "overview" },
          { label: "Trips", value: "trips" },
        ]}
      >
        <ProfileTabContent value="overview" className="flex flex-col gap-6 pt-4">
          <ProfileSection title="Key Metrics">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile
                label="Total Trips"
                value={client.totalTrips}
                icon={RouteIcon}
                tone="purple"
              />
              <StatTile
                label="Total Spent"
                value={client.totalSpent}
                icon={Wallet}
                tone="success"
              />
              <StatTile
                label="Status"
                value={client.status}
                icon={User}
                tone={statusTone}
              />
              <StatTile
                label="Since"
                value={formatDate(client.joinDate)}
                icon={CalendarDays}
                tone="info"
              />
            </div>
          </ProfileSection>

          <ProfileSection title="Client Details">
            <InfoGrid items={overviewItems} />
          </ProfileSection>

          <ProfileSection title="Contact">
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-info" aria-hidden="true" />
                <span className="font-medium text-foreground">
                  {client.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-info" aria-hidden="true" />
                <span className="font-medium text-foreground">
                  {client.phone}
                </span>
              </div>
            </div>
          </ProfileSection>
        </ProfileTabContent>

        <ProfileTabContent value="trips" className="pt-4">
          <ProfileSection title={`Trips (${clientTrips.length})`}>
            {clientTrips.length === 0 ? (
              <EmptyState message="No trips recorded for this client." />
            ) : (
              <div className="flex flex-col gap-3">
                {clientTrips.map((trip) => (
                  <TripRow key={trip.id} trip={trip} onOpen={onOpen} />
                ))}
              </div>
            )}
          </ProfileSection>
        </ProfileTabContent>
      </ProfileTabs>

      <RecommendationsSection
        title="Recommendations"
        recommendations={buildClientRecommendations(client)}
      />
    </div>
  );
}

export default ClientProfile;
