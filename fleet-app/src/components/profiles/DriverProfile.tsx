import { useMemo } from "react";
import { User, Phone, ShieldCheck, OctagonAlert as AlertOctagon, Route as RouteIcon, IdCard, Star } from "lucide-react";
import {
  type ProfileTarget,
} from "@/lib/profile-drawer";
import {
  drivers,
  trips,
  incidents,
  documents,
  trucks,
  type Driver,
  type Trip,
  type DocumentRecord,
  type DriverStatus,
  type TripStatus,
  type IncidentStatus,
  type IncidentSeverity,
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
  TimelineList,
  DocumentsGrid,
  EmptyState,
  initials,
  type Tone,
} from "@/components/profiles/ProfileShell";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Tone helpers                                                         */
/* ------------------------------------------------------------------ */

function driverStatusTone(status: DriverStatus): Tone {
  switch (status) {
    case "Active":
      return "success";
    case "On Leave":
      return "warning";
    case "Suspended":
      return "danger";
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

function scoreTone(score: number): Tone {
  if (score >= 90) return "success";
  if (score >= 80) return "info";
  if (score >= 70) return "warning";
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
        <span>Dep: {formatDateTime(trip.departureTime)}</span>
        <span>Cargo: {trip.cargo}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Recommendations                                                      */
/* ------------------------------------------------------------------ */

function buildDriverRecommendations(driver: Driver): Recommendation[] {
  const recs: Recommendation[] = [];

  if (driver.score < 80) {
    recs.push({
      title: "Improve safety score",
      detail: `Safety score is ${driver.score}. Enroll the driver in a defensive driving refresher course.`,
      tone: driver.score < 70 ? "danger" : "warning",
      icon: "performance",
    });
  }

  if (driver.violations >= 4) {
    recs.push({
      title: "High violation count",
      detail: `${driver.violations} violations on record. Review driving history and schedule a compliance review.`,
      tone: "danger",
      icon: "compliance",
    });
  } else if (driver.violations >= 2) {
    recs.push({
      title: "Monitor violations",
      detail: `${driver.violations} violations recorded. Keep monitoring to avoid escalation.`,
      tone: "warning",
      icon: "compliance",
    });
  }

  const expiry = new Date(driver.licenseExpiry);
  const now = new Date();
  const daysToExpiry = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysToExpiry < 0) {
    recs.push({
      title: "License expired",
      detail: `Driver license expired on ${formatDate(driver.licenseExpiry)}. The driver cannot operate until renewed.`,
      tone: "danger",
      icon: "compliance",
    });
  } else if (daysToExpiry < 60) {
    recs.push({
      title: "License expiring soon",
      detail: `Driver license expires on ${formatDate(driver.licenseExpiry)} (${daysToExpiry} days). Start the renewal process now.`,
      tone: "warning",
      icon: "compliance",
    });
  }

  if (driver.status === "Suspended") {
    recs.push({
      title: "Driver suspended",
      detail: `${driver.name} is currently suspended. Reassign any scheduled trips and review reinstatement criteria.`,
      tone: "danger",
      icon: "general",
    });
  } else if (driver.status === "On Leave") {
    recs.push({
      title: "Driver on leave",
      detail: `${driver.name} is on leave. Confirm coverage for their assigned truck ${driver.assignedTruck}.`,
      tone: "warning",
      icon: "general",
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: "Strong driver profile",
      detail: "Safety score, violations, and license are all in good standing.",
      tone: "success",
      icon: "performance",
    });
  }

  return recs;
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export interface DriverProfileProps {
  id: string;
  onOpen: (t: ProfileTarget) => void;
  onBack?: () => void;
}

export function DriverProfile({ id, onOpen }: DriverProfileProps) {
  const driver = useMemo(() => drivers.find((d) => d.id === id), [id]);

  const driverTrips = useMemo(
    () => trips.filter((t) => t.driver === driver?.name),
    [driver],
  );
  const driverIncidents = useMemo(
    () => incidents.filter((i) => i.driverId === id),
    [id],
  );
  const driverDocs = useMemo<DocumentRecord[]>(
    () => documents.filter((d) => d.owner === driver?.name),
    [driver],
  );

  if (!driver) {
    return <EmptyState message={`Driver ${id} not found.`} />;
  }

  const statusTone = driverStatusTone(driver.status);
  const assignedTruck = trucks.find((t) => t.id === driver.assignedTruck);

  const overviewItems = [
    { label: "Phone", value: driver.phone },
    { label: "Status", value: <Pill tone={statusTone}>{driver.status}</Pill> },
    {
      label: "Assigned Truck",
      value: assignedTruck ? (
        <LinkButton
          label={`${driver.assignedTruck} (${assignedTruck.plate})`}
          onClick={() => onOpen({ kind: "truck", id: driver.assignedTruck })}
        />
      ) : (
        driver.assignedTruck
      ),
    },
    { label: "License Expiry", value: formatDate(driver.licenseExpiry) },
    { label: "Trips Completed", value: driver.tripsCompleted },
    { label: "Violations", value: driver.violations },
    { label: "Safety Score", value: `${driver.score}/100` },
    { label: "Initials", value: initials(driver.name) },
  ];

  const incidentTimeline = driverIncidents
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
        icon={User}
        title={driver.name}
        subtitle={driver.phone}
        tone={statusTone}
        badge={<Pill tone={statusTone}>{driver.status}</Pill>}
      />

      <ProfileTabs
        tabs={[
          { label: "Overview", value: "overview" },
          { label: "Trips", value: "trips" },
          { label: "Incidents", value: "incidents" },
          { label: "Documents", value: "documents" },
        ]}
      >
        <ProfileTabContent value="overview" className="flex flex-col gap-6 pt-4">
          <ProfileSection title="Key Metrics">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile
                label="Safety Score"
                value={`${driver.score}`}
                icon={ShieldCheck}
                tone={scoreTone(driver.score)}
              />
              <StatTile
                label="Violations"
                value={driver.violations}
                icon={AlertOctagon}
                tone={driver.violations >= 3 ? "danger" : "warning"}
              />
              <StatTile
                label="Trips Done"
                value={driver.tripsCompleted}
                icon={RouteIcon}
                tone="purple"
              />
              <StatTile
                label="Rating"
                value={driver.score >= 90 ? "A" : driver.score >= 80 ? "B" : "C"}
                icon={Star}
                tone={scoreTone(driver.score)}
              />
            </div>
          </ProfileSection>

          <ProfileSection title="Driver Details">
            <InfoGrid items={overviewItems} />
          </ProfileSection>

          <ProfileSection title="Contact">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-info" aria-hidden="true" />
              <span className="font-medium text-foreground">{driver.phone}</span>
            </div>
          </ProfileSection>
        </ProfileTabContent>

        <ProfileTabContent value="trips" className="pt-4">
          <ProfileSection title={`Trips (${driverTrips.length})`}>
            {driverTrips.length === 0 ? (
              <EmptyState message="No trips recorded for this driver." />
            ) : (
              <div className="flex flex-col gap-3">
                {driverTrips.map((trip) => (
                  <TripRow key={trip.id} trip={trip} onOpen={onOpen} />
                ))}
              </div>
            )}
          </ProfileSection>
        </ProfileTabContent>

        <ProfileTabContent value="incidents" className="pt-4">
          <ProfileSection title={`Incidents (${driverIncidents.length})`}>
            {driverIncidents.length === 0 ? (
              <EmptyState message="No incidents reported for this driver." />
            ) : (
              <TimelineList items={incidentTimeline} />
            )}
          </ProfileSection>
        </ProfileTabContent>

        <ProfileTabContent value="documents" className="pt-4">
          <ProfileSection
            title={`Documents (${driverDocs.length})`}
            action={
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <IdCard className="h-3.5 w-3.5" aria-hidden="true" />
                Credentials
              </span>
            }
          >
            <DocumentsGrid
              docs={driverDocs.map((d) => ({
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
        recommendations={buildDriverRecommendations(driver)}
      />
    </div>
  );
}

export default DriverProfile;
