import { useMemo } from "react";
import {
  UserCog,
  Mail,
  Phone,
  Truck as TruckIcon,
  Building2,
} from "lucide-react";
import {
  type ProfileTarget,
} from "@/lib/profile-drawer";
import {
  useFleetManagers,
  type FleetManager,
  type FleetManagerStatus,
} from "@/lib/fleet-managers-store";
import { trucks } from "@/lib/mock-data";
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
  initials,
  type Tone,
} from "@/components/profiles/ProfileShell";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Tone helpers                                                         */
/* ------------------------------------------------------------------ */

function managerStatusTone(status: FleetManagerStatus): Tone {
  switch (status) {
    case "active":
      return "success";
    case "off-duty":
      return "warning";
    case "on-leave":
      return "info";
    default:
      return "info";
  }
}

/* ------------------------------------------------------------------ */
/* Assigned truck row (clickable -> opens truck profile)               */
/* ------------------------------------------------------------------ */

interface AssignedTruckRowProps {
  truckId: string;
  onOpen: (t: ProfileTarget) => void;
}

function AssignedTruckRow({ truckId, onOpen }: AssignedTruckRowProps) {
  const truck = trucks.find((t) => t.id === truckId);
  return (
    <button
      type="button"
      onClick={() => onOpen({ kind: "truck", id: truckId })}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-border/60 bg-white/[0.02] p-4 text-left",
        "transition-colors hover:border-primary/40 hover:bg-white/[0.04]",
        "focus:outline-none focus:ring-2 focus:ring-primary",
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-info/15 text-info">
        <TruckIcon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {truck ? `${truckId} · ${truck.plate}` : truckId}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {truck ? `${truck.model} · ${truck.location}` : "Truck details unavailable"}
        </p>
      </div>
      {truck ? (
        <Pill tone={truck.status === "On The Road" ? "success" : "warning"}>
          {truck.status}
        </Pill>
      ) : null}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Recommendations                                                      */
/* ------------------------------------------------------------------ */

function buildManagerRecommendations(
  manager: FleetManager,
): Recommendation[] {
  const recs: Recommendation[] = [];

  if (manager.assignedTrucks.length === 0) {
    recs.push({
      title: "No trucks assigned",
      detail: `${manager.name} currently has no trucks under management. Assign trucks to utilize their capacity.`,
      tone: "warning",
      icon: "general",
    });
  }

  if (manager.status === "off-duty") {
    reassignHint(recs, manager);
  } else if (manager.status === "on-leave") {
    recs.push({
      title: "Manager on leave",
      detail: `${manager.name} is on leave. Ensure their assigned trucks have interim coverage.`,
      tone: "info",
      icon: "general",
    });
  }

  if (manager.assignedTrucks.length >= 4) {
    recs.push({
      title: "Large portfolio",
      detail: `${manager.name} manages ${manager.assignedTrucks.length} trucks. Verify workload is sustainable.`,
      tone: "info",
      icon: "performance",
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: "Manager available",
      detail: `${manager.name} is active and managing ${manager.assignedTrucks.length} truck${manager.assignedTrucks.length === 1 ? "" : "s"}.`,
      tone: "success",
      icon: "general",
    });
  }

  return recs;
}

function reassignHint(recs: Recommendation[], manager: FleetManager): void {
  recs.push({
    title: "Manager off-duty",
    detail: `${manager.name} is off-duty. Confirm ${manager.assignedTrucks.length === 0 ? "no trucks need coverage" : "their assigned trucks have coverage"}.`,
    tone: "warning",
    icon: "general",
  });
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export interface FleetManagerProfileProps {
  id: string;
  onOpen: (t: ProfileTarget) => void;
  onBack?: () => void;
}

export function FleetManagerProfile({ id, onOpen }: FleetManagerProfileProps) {
  // We need the managers list; pull it from the hook via a small wrapper.
  const manager = useFleetManagerById(id);

  const assignedTrucks = useMemo(() => {
    if (!manager) return [];
    return manager.assignedTrucks
      .map((tid) => trucks.find((t) => t.id === tid))
      .filter((t): t is NonNullable<typeof t> => Boolean(t));
  }, [manager]);

  if (!manager) {
    return <EmptyState message={`Fleet manager ${id} not found.`} />;
  }

  const statusTone = managerStatusTone(manager.status);

  const overviewItems = [
    { label: "Email", value: manager.email },
    { label: "Phone", value: manager.phone },
    { label: "Department", value: manager.department },
    {
      label: "Status",
      value: <Pill tone={statusTone}>{manager.status}</Pill>,
    },
    { label: "Assigned Trucks", value: manager.assignedTrucks.length },
    { label: "Initials", value: initials(manager.name) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        icon={UserCog}
        title={manager.name}
        subtitle={manager.department}
        tone={statusTone}
        badge={<Pill tone={statusTone}>{manager.status}</Pill>}
      />

      <ProfileSection title="Key Metrics">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatTile
            label="Trucks"
            value={manager.assignedTrucks.length}
            icon={TruckIcon}
            tone="info"
          />
          <StatTile
            label="Department"
            value={manager.department}
            icon={Building2}
            tone="purple"
          />
          <StatTile
            label="Status"
            value={manager.status}
            icon={UserCog}
            tone={statusTone}
          />
        </div>
      </ProfileSection>

      <ProfileSection title="Manager Details">
        <InfoGrid items={overviewItems} />
      </ProfileSection>

      <ProfileSection title="Contact">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-info" aria-hidden="true" />
            <span className="font-medium text-foreground">
              {manager.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-info" aria-hidden="true" />
            <span className="font-medium text-foreground">
              {manager.phone}
            </span>
          </div>
        </div>
      </ProfileSection>

      <ProfileSection
        title={`Assigned Trucks (${manager.assignedTrucks.length})`}
        action={
          <span className="text-xs text-muted-foreground">
            Click a truck to view its profile
          </span>
        }
      >
        {assignedTrucks.length === 0 ? (
          <EmptyState message="No trucks assigned to this manager." />
        ) : (
          <div className="flex flex-col gap-3">
            {assignedTrucks.map((truck) => (
              <AssignedTruckRow
                key={truck.id}
                truckId={truck.id}
                onOpen={onOpen}
              />
            ))}
          </div>
        )}
      </ProfileSection>

      <RecommendationsSection
        title="Recommendations"
        recommendations={buildManagerRecommendations(manager)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Local hook to look up a single manager by id.                       */
/* ------------------------------------------------------------------ */

function useFleetManagerById(id: string): FleetManager | undefined {
  const { managers } = useFleetManagers();
  return managers.find((m) => m.id === id);
}

export default FleetManagerProfile;
