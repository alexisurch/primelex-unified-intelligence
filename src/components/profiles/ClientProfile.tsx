import { Building2, TrendingUp, Package, CircleCheck as CheckCircle2, Activity, TriangleAlert as AlertTriangle, DollarSign, Clock, Route as RouteIcon, Circle, Phone, Mail, MapPin, ShieldAlert } from "lucide-react";
import { clients, trips, incidents } from "@/lib/mock-data";
import type { ProfileTarget } from "@/lib/profile-drawer";
import { ProfileHeader, ProfileSection, ProfileTabs, InfoGrid, StatTile, TimelineList, DocumentsGrid, type Tone } from "./ProfileShell";
import { Pill } from "@/components/shared/Cards";
import { RecommendationsSection, type Recommendation } from "@/components/shared/Insights";
import { CollaborationPanel } from "@/components/shared/CollaborationPanel";
import { AuditTrailPanel } from "@/components/shared/AuditTrailPanel";

const naira = (n: number) => "₦" + n.toLocaleString();

export function ClientProfile({ id, onOpen, onBack }: { id: string; onOpen: (t: ProfileTarget) => void; onBack?: () => void }) {
  const client = clients.find((c) => c.id === id) ?? clients.find((c) => c.name === id);
  if (!client) return <div className="p-6 text-sm text-muted-foreground">Client not found.</div>;

  const clientTrips = trips.filter((t) => t.customer === client.name);
  const activeTrips = clientTrips.filter((t) => t.status === "In Transit" || t.status === "Scheduled");
  const delivered = clientTrips.filter((t) => t.status === "Delivered");
  const delayed = clientTrips.filter((t) => t.status === "Delayed");
  const totalDist = clientTrips.reduce((s, t) => s + t.distance, 0);
  const totalRev = totalDist * 4500;
  const clientIncidents = incidents.filter((i) => i.client === client.name);
  const statusTone: Tone = client.status === "Active" ? "success" : client.status === "Prospect" ? "warning" : "purple";

  return (
    <>
      <ProfileHeader
        onBack={onBack}
        icon={<Building2 className="h-6 w-6 text-primary" />}
        title={client.name}
        subtitle={<><span>{client.id}</span><Circle className="h-1 w-1 fill-muted-foreground" /><span>{client.industry}</span></>}
        statusTone={statusTone}
        statusLabel={client.status}
      />
      <ProfileTabs defaultValue="overview" tabs={[
        { value: "overview", label: "Overview", content: (
          <>
            <ProfileSection title="Company Information" icon={Building2}>
              <InfoGrid items={[
                ["Company Name", client.name], ["Industry", client.industry],
                ["Customer Since", client.since], ["Status", client.status],
                ["Contact Person", client.contact],
                ["Phone", <span key="p" className="inline-flex items-center gap-1"><Phone className="h-3 w-3 text-muted-foreground" />{client.phone}</span>],
                ["Email", <span key="e" className="inline-flex items-center gap-1"><Mail className="h-3 w-3 text-muted-foreground" />{client.email}</span>],
                ["Address", <span key="a" className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{client.address}</span>],
              ]} />
            </ProfileSection>
            <ProfileSection title="Operational KPIs" icon={TrendingUp}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <StatTile label="Total Trips" value={String(clientTrips.length)} icon={Package} />
                <StatTile label="Active Trips" value={String(activeTrips.length)} icon={Activity} />
                <StatTile label="Completed" value={String(delivered.length)} icon={CheckCircle2} />
                <StatTile label="Delayed" value={String(delayed.length)} icon={AlertTriangle} />
                <StatTile label="Total Distance" value={`${totalDist.toLocaleString()} km`} icon={RouteIcon} />
                <StatTile label="Total Revenue" value={naira(totalRev)} icon={DollarSign} />
                <StatTile label="Avg Delivery Time" value="18h" icon={Clock} />
                <StatTile label="Avg Trip Value" value={naira(clientTrips.length ? totalRev / clientTrips.length | 0 : 0)} icon={DollarSign} />
              </div>
            </ProfileSection>
          </>
        )},
        { value: "active", label: "Active Deliveries", content: (
          <TripList trips={activeTrips} onOpen={onOpen} empty="No active deliveries." />
        )},
        { value: "history", label: "Trip History", content: (
          <TripList trips={clientTrips} onOpen={onOpen} empty="No trips yet." />
        )},
        { value: "incidents", label: "Incidents", content: (
          <div className="space-y-2">
            {clientIncidents.length === 0 && <p className="text-xs text-muted-foreground">No incidents.</p>}
            {clientIncidents.map((i) => (
              <button key={i.id} onClick={() => onOpen({ kind: "incident", id: i.id })} className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/30 p-3 hover:border-danger/40">
                <div className="text-left"><div className="text-sm font-medium text-primary">{i.id} · {i.type}</div><div className="text-xs text-muted-foreground">{i.date} · {i.trip}</div></div>
                <Pill tone={i.severity === "Critical" ? "purple" : i.severity === "High" ? "danger" : "warning"}>{i.severity}</Pill>
              </button>
            ))}
          </div>
        )},
        { value: "timeline", label: "Timeline", content: (
          <TimelineList events={[
            { time: client.since, label: "Customer Created", detail: `${client.name} onboarded`, tone: "info" },
            { time: "2025-10-14", label: "First Trip", detail: clientTrips[0]?.id ?? "-", tone: "success" },
            ...delivered.slice(0, 3).map((t) => ({ time: "Recent", label: "Delivery Completed", detail: `${t.id} · ${t.destination}`, tone: "success" as const })),
            ...clientIncidents.slice(0, 2).map((i) => ({ time: i.date, label: "Incident Reported", detail: `${i.type} · ${i.location}`, tone: "danger" as const })),
            { time: "This week", label: "New Booking", detail: activeTrips[0]?.id ?? "-", tone: "info" as const },
          ]} />
        )},
        { value: "documents", label: "Documents", content: <DocumentsGrid docs={[
          { name: "Master Service Agreement", expiry: "2027-12-31", status: "Valid" },
          { name: "Purchase Order" }, { name: "Invoices" }, { name: "Delivery Confirmations" },
        ]} /> },
        { value: "notes", label: "Notes", content: <CollaborationPanel entityType="client" entityId={id} className="px-1 py-2" /> },
        { value: "audit", label: "Audit Trail", content: <AuditTrailPanel entityType="client" entityId={id} className="px-1 py-2" /> },
      ]} />
      <div className="px-6 pb-10">
        <RecommendationsSection title="Client Recommendations" recommendations={clientRecommendations(clientTrips, delayed, clientIncidents)} />
      </div>
    </>
  );
}

function clientRecommendations(clientTrips: typeof trips, delayed: typeof trips, clientIncidents: typeof incidents): Recommendation[] {
  const recs: Recommendation[] = [];
  if (delayed.length >= 2) recs.push({ title: "Frequent Delays", detail: delayed.length + " delayed trips. Review scheduling and route planning.", tone: "warning", icon: "performance" });
  if (clientIncidents.length >= 2) recs.push({ title: "Repeated Cargo Damage", detail: clientIncidents.length + " incidents. Review handling procedures.", tone: "danger", icon: "incident" });
  if (clientTrips.length >= 10) recs.push({ title: "High Volume Customer", detail: clientTrips.length + " total trips. Priority client - ensure dedicated fleet manager.", tone: "success", icon: "performance" });
  if (recs.length === 0) recs.push({ title: "Client in Good Standing", detail: "No operational concerns detected.", tone: "success", icon: "performance" });
  return recs;
}

function TripList({ trips: rows, onOpen, empty }: { trips: typeof trips; onOpen: (t: ProfileTarget) => void; empty: string }) {
  if (rows.length === 0) return <p className="text-xs text-muted-foreground">{empty}</p>;
  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <table className="w-full text-sm">
        <thead className="bg-elevated/70"><tr>{["Trip","Route","Truck","Driver","Distance","Status"].map((h) => <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id} className="border-t border-border/60">
              <td className="px-4 py-3 text-xs"><button onClick={() => onOpen({ kind: "trip", id: t.id })} className="font-semibold text-primary hover:underline">{t.id}</button></td>
              <td className="px-4 py-3 text-xs">{t.origin} → {t.destination}</td>
              <td className="px-4 py-3 text-xs">{t.truck}</td>
              <td className="px-4 py-3 text-xs">{t.driver}</td>
              <td className="px-4 py-3 text-xs">{t.distance} km</td>
              <td className="px-4 py-3"><Pill tone={t.status === "Delivered" ? "success" : t.status === "Delayed" ? "danger" : t.status === "In Transit" ? "info" : "warning"}>{t.status}</Pill></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
