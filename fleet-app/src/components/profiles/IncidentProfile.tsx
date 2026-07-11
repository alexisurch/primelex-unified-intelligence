import { useMemo } from "react";
import {
  ShieldAlert,
  Calendar,
  MapPin,
  User,
  Truck as TruckIcon,
  Route as RouteIcon,
  Search,
} from "lucide-react";
import {
  type ProfileTarget,
} from "@/lib/profile-drawer";
import {
  incidents,
  trucks,
  drivers,
  routes,
  type Incident,
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
  InfoGrid,
  StatTile,
  EmptyState,
  type Tone,
} from "@/components/profiles/ProfileShell";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Tone helpers                                                         */
/* ------------------------------------------------------------------ */

function incidentStatusTone(status: IncidentStatus): Tone {
  switch (status) {
    case "Open":
      return "danger";
    case "Investigating":
      return "warning";
    case "Resolved":
      return "success";
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
/* Recommendations                                                      */
/* ------------------------------------------------------------------ */

function buildIncidentRecommendations(incident: Incident): Recommendation[] {
  const recs: Recommendation[] = [];

  if (incident.status === "Open") {
    recs.push({
      title: "Assign an investigator",
      detail: `${incident.id} is still open. Assign or notify an investigator to begin the formal review.`,
      tone: "danger",
      icon: "incident",
    });
  }

  if (incident.status === "Investigating") {
    recs.push({
      title: "Follow up on investigation",
      detail: `${incident.id} is under investigation. Request a progress update from ${incident.investigator}.`,
      tone: "warning",
      icon: "incident",
    });
  }

  if (incident.severity === "Critical" || incident.severity === "High") {
    recs.push({
      title: "High-severity incident",
      detail: `${incident.severity} severity. Notify leadership and review whether the truck should be pulled from service.`,
      tone: "danger",
      icon: "incident",
    });
  }

  if (incident.type === "Fuel Theft") {
    recs.push({
      title: "Review fuel security",
      detail: "Fuel theft reported. Audit overnight parking procedures and fuel-tank locks across the fleet.",
      tone: "warning",
      icon: "fuel",
    });
  }

  if (incident.type === "Accident") {
    recs.push({
      title: "Accident response",
      detail: "Confirm insurance has been notified and schedule a medical check for the driver if applicable.",
      tone: "danger",
      icon: "incident",
    });
  }

  if (incident.type === "Mechanical Failure") {
    recs.push({
      title: "Mechanical follow-up",
      detail: "Verify the repair was completed and add the failed component to the preventive maintenance schedule.",
      tone: "warning",
      icon: "maintenance",
    });
  }

  if (incident.status === "Resolved") {
    recs.push({
      title: "Incident resolved",
      detail: "Document lessons learned and update the risk profile of the associated route.",
      tone: "success",
      icon: "general",
    });
  }

  return recs;
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export interface IncidentProfileProps {
  id: string;
  onOpen: (t: ProfileTarget) => void;
  onBack?: () => void;
}

export function IncidentProfile({ id, onOpen }: IncidentProfileProps) {
  const incident = useMemo(() => incidents.find((i) => i.id === id), [id]);

  if (!incident) {
    return <EmptyState message={`Incident ${id} not found.`} />;
  }

  const truck = trucks.find((t) => t.id === incident.truckId);
  const driver = drivers.find((d) => d.id === incident.driverId);
  const route = routes.find((r) => r.id === incident.routeId);

  const statusTone = incidentStatusTone(incident.status);
  const sevTone = severityTone(incident.severity);

  const detailItems = [
    {
      label: "Type",
      value: incident.type,
    },
    {
      label: "Severity",
      value: <Pill tone={sevTone}>{incident.severity}</Pill>,
    },
    {
      label: "Status",
      value: <Pill tone={statusTone}>{incident.status}</Pill>,
    },
    {
      label: "Date",
      value: formatDateTime(incident.date),
    },
    {
      label: "Location",
      value: incident.location,
    },
    {
      label: "Investigator",
      value: incident.investigator,
    },
    {
      label: "Truck",
      value: (
        <LinkButton
          label={truck ? `${incident.truckId} (${truck.plate})` : incident.truckId}
          onClick={() => onOpen({ kind: "truck", id: incident.truckId })}
        />
      ),
    },
    {
      label: "Driver",
      value: (
        <LinkButton
          label={driver ? driver.name : incident.driverId}
          onClick={() => onOpen({ kind: "driver", id: incident.driverId })}
        />
      ),
    },
    {
      label: "Route",
      value: route ? (
        <LinkButton
          label={route.name}
          onClick={() => onOpen({ kind: "route", id: incident.routeId })}
        />
      ) : (
        incident.routeId
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        icon={ShieldAlert}
        title={incident.type}
        subtitle={`${incident.id} · ${formatDate(incident.date)}`}
        tone={sevTone}
        badge={<Pill tone={sevTone}>{incident.severity}</Pill>}
      />

      <ProfileSection title="Key Metrics">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label="Severity"
            value={incident.severity}
            icon={ShieldAlert}
            tone={sevTone}
          />
          <StatTile
            label="Status"
            value={incident.status}
            icon={ShieldAlert}
            tone={statusTone}
          />
          <StatTile
            label="Date"
            value={formatDate(incident.date)}
            icon={Calendar}
            tone="info"
          />
          <StatTile
            label="Location"
            value={incident.location.split(",")[0]}
            icon={MapPin}
            tone="purple"
          />
        </div>
      </ProfileSection>

      <ProfileSection title="Incident Details">
        <InfoGrid items={detailItems} />
      </ProfileSection>

      <ProfileSection title="Description">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {incident.description}
        </p>
      </ProfileSection>

      <ProfileSection title="Linked Entities">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/[0.02] p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-info/15 text-info">
              <TruckIcon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Truck
              </p>
              <LinkButton
                label={truck ? `${incident.truckId} · ${truck.plate}` : incident.truckId}
                onClick={() => onOpen({ kind: "truck", id: incident.truckId })}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/[0.02] p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <User className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Driver
              </p>
              <LinkButton
                label={driver ? driver.name : incident.driverId}
                onClick={() => onOpen({ kind: "driver", id: incident.driverId })}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/[0.02] p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple/15 text-purple">
              <RouteIcon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Route
              </p>
              {route ? (
                <LinkButton
                  label={route.name}
                  onClick={() => onOpen({ kind: "route", id: incident.routeId })}
                />
              ) : (
                <span className="text-sm font-medium text-foreground">
                  {incident.routeId}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/[0.02] p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
              <Search className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Investigator
              </p>
              <span className="text-sm font-medium text-foreground">
                {incident.investigator}
              </span>
            </div>
          </div>
        </div>
      </ProfileSection>

      <RecommendationsSection
        title="Recommendations"
        recommendations={buildIncidentRecommendations(incident)}
      />
    </div>
  );
}

export default IncidentProfile;
