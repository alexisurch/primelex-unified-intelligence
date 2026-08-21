import { ShieldAlert, ClipboardList, Camera, FileText, TrendingUp, Circle, MapPin, Clock, TriangleAlert as AlertTriangle, DollarSign, Activity } from "lucide-react";
import { incidents, trucks, drivers, clients } from "@/lib/mock-data";
import { useTrips, formatRouteDisplay, isRoutePending, type TripWithRoute } from "@/lib/trips-store";
import type { ProfileTarget } from "@/lib/profile-drawer";
import { ProfileHeader, ProfileSection, ProfileTabs, InfoGrid, StatTile, TimelineList, DocumentsGrid, type Tone } from "./ProfileShell";
import { Pill } from "@/components/shared/Cards";
import { CollaborationPanel } from "@/components/shared/CollaborationPanel";
import { AuditTrailPanel } from "@/components/shared/AuditTrailPanel";

const naira = (n: number) => "₦" + n.toLocaleString();

export function IncidentProfile({ id, onOpen, onBack }: { id: string; onOpen: (t: ProfileTarget) => void; onBack?: () => void }) {
  const { getTrip } = useTrips();
  const inc = incidents.find((i) => i.id === id);
  if (!inc) return <div className="p-6 text-sm text-muted-foreground">Incident not found.</div>;

  const truck = trucks.find((t) => t.id === inc.truck);
  const driver = drivers.find((d) => d.name === inc.driver);
  const trip = inc.trip ? (getTrip(inc.trip) as TripWithRoute | undefined) : undefined;
  const client = clients.find((c) => c.name === inc.client);
  const sevTone: Tone = inc.severity === "Critical" ? "purple" : inc.severity === "High" ? "danger" : inc.severity === "Moderate" ? "warning" : "info";
  const statusTone: Tone = inc.status === "Open" ? "danger" : inc.status === "Investigating" ? "warning" : "success";

  return (
    <>
      <ProfileHeader
        onBack={onBack}
        icon={<ShieldAlert className="h-6 w-6 text-primary" />}
        title={`${inc.id} · ${inc.type}`}
        subtitle={<><span>{inc.date}</span><Circle className="h-1 w-1 fill-muted-foreground" /><Pill tone={sevTone}>{inc.severity}</Pill></>}
        statusTone={statusTone}
        statusLabel={inc.status}
      />
      <ProfileTabs defaultValue="details" tabs={[
        { value: "details", label: "Details", content: (
          <>
            <ProfileSection title="Incident Details" icon={ClipboardList}>
              <InfoGrid items={[
                ["Incident ID", inc.id], ["Type", inc.type], ["Severity", inc.severity], ["Status", inc.status],
                ["Date & Time", inc.date], ["Location", inc.location],
                ["Root Cause", inc.rootCause], ["Reported By", inc.reportedBy], ["Investigator", inc.investigator],
              ]} />
              <div className="mt-4 rounded-lg border border-border/60 bg-background/30 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Description</div>
                <p className="mt-1 text-sm">{inc.description}</p>
              </div>
            </ProfileSection>
            <ProfileSection title="Corrective Actions" icon={ClipboardList}>
              <p className="text-sm">{inc.correctiveActions}</p>
            </ProfileSection>
          </>
        )},
        { value: "impact", label: "Operational Impact", content: (
          <>
            <ProfileSection title="Impacted Records" icon={TrendingUp}>
              <div className="space-y-2">
                {truck && <button onClick={() => onOpen({ kind: "truck", id: truck.id })} className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/30 p-3 hover:border-primary/40"><span className="text-sm">Affected Truck · <span className="text-primary font-medium">{truck.id}</span></span><span className="text-xs text-muted-foreground">{truck.plate}</span></button>}
                {driver && <button onClick={() => onOpen({ kind: "driver", id: driver.id })} className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/30 p-3 hover:border-primary/40"><span className="text-sm">Affected Driver · <span className="text-primary font-medium">{driver.name}</span></span><span className="text-xs text-muted-foreground">{driver.id}</span></button>}
                {trip && <button onClick={() => onOpen({ kind: "trip", id: trip.id })} className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/30 p-3 hover:border-primary/40"><span className="text-sm">Affected Trip · <span className="text-primary font-medium">{trip.id}</span></span><span className="text-xs text-muted-foreground">{isRoutePending(trip) ? "Route Pending" : formatRouteDisplay(trip.routeStops)}</span></button>}
                {client && <button onClick={() => onOpen({ kind: "client", id: client.id })} className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/30 p-3 hover:border-primary/40"><span className="text-sm">Affected Client · <span className="text-primary font-medium">{client.name}</span></span><span className="text-xs text-muted-foreground">{client.industry}</span></button>}
              </div>
            </ProfileSection>
            <ProfileSection title="Impact Metrics" icon={AlertTriangle}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <StatTile label="Estimated Delay" value={`${inc.estDelayMin}m`} icon={Clock} />
                <StatTile label="Financial Impact" value={naira(inc.estFinancialImpact)} icon={DollarSign} />
                <StatTile label="Current Status" value={inc.status} icon={Activity} />
              </div>
            </ProfileSection>
          </>
        )},
        { value: "timeline", label: "Timeline", content: (
          <TimelineList events={[
            { time: inc.date, label: "Incident Reported", detail: `By ${inc.reportedBy}`, tone: "danger" },
            { time: inc.date, label: "Investigator Assigned", detail: inc.investigator, tone: "warning" },
            { time: inc.date, label: "Investigation In Progress", tone: "info" },
            ...(inc.status === "Resolved" ? [{ time: "Recent", label: "Resolved", detail: inc.correctiveActions, tone: "success" as const }] : []),
          ]} />
        )},
        { value: "investigation", label: "Investigation", content: (
          <ProfileSection title="Investigation Notes" icon={ClipboardList}>
            <p className="text-sm text-muted-foreground">Investigator: <span className="text-foreground font-medium">{inc.investigator}</span></p>
            <div className="mt-3 rounded-lg border border-border/60 bg-background/30 p-3 text-sm">
              Preliminary findings suggest {inc.rootCause.toLowerCase()}. Full investigation report will follow.
            </div>
          </ProfileSection>
        )},
        { value: "photos", label: "Photos", content: (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[1,2,3,4].map((n) => (
              <div key={n} className="flex aspect-square items-center justify-center rounded-xl border border-border/60 bg-background/30 text-muted-foreground">
                <Camera className="h-6 w-6" />
              </div>
            ))}
          </div>
        )},
        { value: "documents", label: "Documents", content: <DocumentsGrid docs={[
          { name: "Incident Report" }, { name: "Police Report" }, { name: "Insurance Claim" },
        ]} /> },
        { value: "notes", label: "Notes", content: <CollaborationPanel entityType="incident" entityId={id} className="px-1 py-2" /> },
        { value: "audit", label: "Audit Trail", content: <AuditTrailPanel entityType="incident" entityId={id} className="px-1 py-2" /> },
      ]} />
    </>
  );
}
