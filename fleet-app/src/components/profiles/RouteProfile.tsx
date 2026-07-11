import { useMemo } from "react";
import { Route as RouteIcon, MapPin, Clock, ShieldAlert, TriangleAlert as AlertTriangle, Gauge, ArrowRight } from "lucide-react";
import {
  type ProfileTarget,
} from "@/lib/profile-drawer";
import {
  routes,
  trips,
  getIncidentsForRoute,
  type Route,
  type Trip,
  type Incident,
  type TripStatus,
  type IncidentStatus,
  type IncidentSeverity,
  type RiskLevel,
  type RouteCondition,
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

function riskTone(risk: RiskLevel): Tone {
  switch (risk) {
    case "Low":
      return "success";
    case "Medium":
      return "warning";
    case "High":
      return "danger";
    default:
      return "info";
  }
}

function conditionTone(condition: RouteCondition): Tone {
  switch (condition) {
    case "Good":
      return "success";
    case "Fair":
      return "warning";
    case "Poor":
      return "danger";
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
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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
        <span>Driver: {trip.driver}</span>
        <span>Dep: {formatDateTime(trip.departureTime)}</span>
        <span>Cargo: {trip.cargo}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Incident row (clickable -> opens incident profile)                  */
/* ------------------------------------------------------------------ */

interface IncidentRowProps {
  incident: Incident;
  onOpen: (t: ProfileTarget) => void;
}

function IncidentRow({ incident, onOpen }: IncidentRowProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen({ kind: "incident", id: incident.id })}
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border border-border/60 bg-white/[0.02] p-4 text-left",
        "transition-colors hover:border-primary/40 hover:bg-white/[0.04]",
        "focus:outline-none focus:ring-2 focus:ring-primary",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">
          {incident.type}
        </span>
        <div className="flex items-center gap-2">
          <Pill tone={severityTone(incident.severity)}>
            {incident.severity}
          </Pill>
          <Pill tone={incidentStatusTone(incident.status)}>
            {incident.status}
          </Pill>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {incident.description}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{incident.id}</span>
        <span>{formatDate(incident.date)}</span>
        <span>{incident.location}</span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Recommendations                                                      */
/* ------------------------------------------------------------------ */

function buildRouteRecommendations(
  route: Route,
  routeIncidents: Incident[],
): Recommendation[] {
  const recs: Recommendation[] = [];

  if (route.riskLevel === "High") {
    recs.push({
      title: "High-risk route",
      detail: `${route.name} is flagged as high risk. Consider additional safety briefings and escort support for trips.`,
      tone: "danger",
      icon: "incident",
    });
  } else if (route.riskLevel === "Medium") {
    recs.push({
      title: "Moderate risk route",
      detail: `${route.name} has a medium risk rating. Monitor conditions and driver feedback closely.`,
      tone: "warning",
      icon: "incident",
    });
  }

  if (route.condition === "Poor") {
    recs.push({
      title: "Poor road condition",
      detail: `Road condition on ${route.name} is poor. Advise reduced speed and extra cargo securing.`,
      tone: "danger",
      icon: "maintenance",
    });
  } else if (route.condition === "Fair") {
    recs.push({
      title: "Fair road condition",
      detail: `Road condition on ${route.name} is fair. Schedule trips during daylight where possible.`,
      tone: "warning",
      icon: "maintenance",
    });
  }

  const openIncidents = routeIncidents.filter((i) => i.status !== "Resolved");
  if (openIncidents.length > 0) {
    recs.push({
      title: `${openIncidents.length} unresolved incident${openIncidents.length === 1 ? "" : "s"}`,
      detail: `There ${openIncidents.length === 1 ? "is" : "are"} ${openIncidents.length} unresolved incident${openIncidents.length === 1 ? "" : "s"} on this route. Review and assign investigators.`,
      tone: "warning",
      icon: "incident",
    });
  }

  if (route.tripsCount > 200) {
    recs.push({
      title: "High-traffic route",
      detail: `${route.tripsCount} trips logged. Consider capacity planning to avoid congestion delays.`,
      tone: "info",
      icon: "performance",
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: "Route operating normally",
      detail: "Risk, condition, and incident levels are all within acceptable bounds.",
      tone: "success",
      icon: "general",
    });
  }

  return recs;
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export interface RouteProfileProps {
  id: string;
  onOpen: (t: ProfileTarget) => void;
  onBack?: () => void;
}

export function RouteProfile({ id, onOpen }: RouteProfileProps) {
  const route = useMemo(() => routes.find((r) => r.id === id), [id]);

  const routeTrips = useMemo(
    () => trips.filter((t) => t.routeId === id),
    [id],
  );
  const routeIncidents = useMemo(
    () => getIncidentsForRoute(id),
    [id],
  );

  if (!route) {
    return <EmptyState message={`Route ${id} not found.`} />;
  }

  const riskToneVal = riskTone(route.riskLevel);
  const conditionToneVal = conditionTone(route.condition);

  const overviewItems = [
    { label: "Origin", value: route.origin },
    { label: "Destination", value: route.destination },
    { label: "Distance", value: `${route.distance} km` },
    { label: "Avg Duration", value: `${route.avgDuration} hrs` },
    {
      label: "Risk Level",
      value: <Pill tone={riskToneVal}>{route.riskLevel}</Pill>,
    },
    {
      label: "Condition",
      value: <Pill tone={conditionToneVal}>{route.condition}</Pill>,
    },
    { label: "Trips Count", value: route.tripsCount },
    { label: "Incidents", value: routeIncidents.length },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        icon={RouteIcon}
        title={route.name}
        subtitle={`${route.origin} → ${route.destination}`}
        tone={riskToneVal}
        badge={<Pill tone={riskToneVal}>{route.riskLevel} risk</Pill>}
      />

      <ProfileTabs
        tabs={[
          { label: "Overview", value: "overview" },
          { label: "Trips", value: "trips" },
          { label: "Incidents", value: "incidents" },
        ]}
      >
        <ProfileTabContent value="overview" className="flex flex-col gap-6 pt-4">
          <ProfileSection title="Key Metrics">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile
                label="Distance"
                value={`${route.distance} km`}
                icon={MapPin}
                tone="info"
              />
              <StatTile
                label="Avg Duration"
                value={`${route.avgDuration}h`}
                icon={Clock}
                tone="purple"
              />
              <StatTile
                label="Trips"
                value={route.tripsCount}
                icon={RouteIcon}
                tone="success"
              />
              <StatTile
                label="Incidents"
                value={routeIncidents.length}
                icon={ShieldAlert}
                tone={routeIncidents.length > 0 ? "danger" : "success"}
              />
            </div>
          </ProfileSection>

          <ProfileSection title="Route Details">
            <InfoGrid items={overviewItems} />
          </ProfileSection>

          <ProfileSection title="Condition & Risk">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">Condition:</span>
                <Pill tone={conditionToneVal}>{route.condition}</Pill>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">Risk:</span>
                <Pill tone={riskToneVal}>{route.riskLevel}</Pill>
              </div>
            </div>
          </ProfileSection>
        </ProfileTabContent>

        <ProfileTabContent value="trips" className="pt-4">
          <ProfileSection title={`Trips (${routeTrips.length})`}>
            {routeTrips.length === 0 ? (
              <EmptyState message="No trips recorded on this route." />
            ) : (
              <div className="flex flex-col gap-3">
                {routeTrips.map((trip) => (
                  <TripRow key={trip.id} trip={trip} onOpen={onOpen} />
                ))}
              </div>
            )}
          </ProfileSection>
        </ProfileTabContent>

        <ProfileTabContent value="incidents" className="pt-4">
          <ProfileSection
            title={`Incidents (${routeIncidents.length})`}
            action={
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                Click an incident for details
              </span>
            }
          >
            {routeIncidents.length === 0 ? (
              <EmptyState message="No incidents reported on this route." />
            ) : (
              <div className="flex flex-col gap-3">
                {routeIncidents.map((incident) => (
                  <IncidentRow
                    key={incident.id}
                    incident={incident}
                    onOpen={onOpen}
                  />
                ))}
              </div>
            )}
          </ProfileSection>
        </ProfileTabContent>
      </ProfileTabs>

      <RecommendationsSection
        title="Recommendations"
        recommendations={buildRouteRecommendations(route, routeIncidents)}
      />
    </div>
  );
}

export default RouteProfile;
