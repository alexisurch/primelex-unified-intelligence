import { CircleUser as UserCircle2, IdCard, ClipboardList, TrendingUp, Activity, CircleCheck as CheckCircle2, Fuel, Clock, Route as RouteIcon, ShieldAlert, Circle, Pencil } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/shared/Cards";
import { drivers, trucks, incidents, getDriverAvgLkm, clients } from "@/lib/mock-data";
import { useTrips, formatRouteDisplay, isRoutePending, type TripWithRoute } from "@/lib/trips-store";
import { useFleetManagers } from "@/lib/fleet-managers-store";
import type { ProfileTarget } from "@/lib/profile-drawer";
import { ProfileHeader, ProfileSection, ProfileTabs, InfoGrid, StatTile, DocumentsGrid, initials, type Tone } from "./ProfileShell";
import { CollaborationPanel } from "@/components/shared/CollaborationPanel";
import { DocumentUploadDialog, EditProfileDialog } from "./ProfileDialogs";
import { useState } from "react";

export function DriverProfile({ id, onOpen, onBack }: { id: string; onOpen: (t: ProfileTarget) => void; onBack?: () => void }) {
  const { getManagerForTruck } = useFleetManagers();
  const { trips } = useTrips();
  const d = drivers.find((x) => x.id === id) ?? drivers.find((x) => x.name === id);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  if (!d) return <div className="p-6 text-sm text-muted-foreground">Driver not found.</div>;
  const truck = trucks.find((t) => t.driver === d.name);
  const driverTrips = trips.filter((t) => t.driver === d.name);
  const active = driverTrips.find((t) => t.status !== "Delivered" && t.status !== "Cancelled");
  const driverIncidents = incidents.filter((i) => i.driver === d.name);
  const statusTone: Tone = d.status === "Active" ? "success" : d.status === "On Leave" ? "warning" : "danger";
  const fleetManager = truck ? getManagerForTruck(truck.id) : undefined;
  const avgLkm = getDriverAvgLkm(d.name);

  return (
    <>
      <ProfileHeader
        onBack={onBack}
        icon={<Avatar className="h-11 w-11"><AvatarFallback className="bg-primary/20 text-primary">{initials(d.name)}</AvatarFallback></Avatar>}
        title={d.name}
        subtitle={<><span>{d.id}</span><Circle className="h-1 w-1 fill-muted-foreground" /></>}
        statusTone={statusTone}
        statusLabel={d.status}
      />
      <ProfileTabs defaultValue="overview" tabs={[
        { value: "overview", label: "Overview", content: (
          <>
            <ProfileSection title="Personal Information" icon={UserCircle2} action={
              <Button size="sm" variant="ghost" className="h-7 text-xs text-primary" onClick={() => setEditOpen(true)}><Pencil className="mr-1 h-3 w-3" />Edit</Button>
            }>
              <InfoGrid items={[
                ["Name", d.name], ["Driver ID", d.id],
                ["Phone", "+234 803 000 0000"],
                ["Address", "12 Adeola Odeku St., Lagos"],
                ["Emergency Contact", "+234 802 000 0000"],
                ["Employment Status", d.status],
              ]} />
            </ProfileSection>
            <ProfileSection title="Licence Information" icon={IdCard}>
              <InfoGrid items={[
                ["Licence Number", d.license],
                ["Licence Expiry", d.licenseExpiry],
                ["Medical Expiry", d.medicalExpiry],
                ["Risk Level", d.risk],
                ["Safety Score", String(d.score)],
                ["Trainings", String(d.trainings)],
              ]} />
            </ProfileSection>
            <ProfileSection title="Current Assignment" icon={ClipboardList} action={truck && (
              <Button size="sm" variant="ghost" className="h-7 text-xs text-primary" onClick={() => onOpen({ kind: "truck", id: truck.id })}>View Truck</Button>
            )}>
              <InfoGrid items={[
                ["Assigned Truck", truck?.id ?? "—"],
                ["Current Trip", active ? <button key="a" className="text-primary hover:underline" onClick={() => onOpen({ kind: "trip", id: active.id })}>{active.id}</button> : "—"],
              ["Current Route", active ? (isRoutePending(active as TripWithRoute) ? <span key="r" className="text-muted-foreground italic">Route Pending</span> : <span key="r" className="text-foreground">{formatRouteDisplay((active as TripWithRoute).routeStops)}</span>) : "—"],
              ["Current Client", active ? (() => { const c = clients.find((cl) => cl.name === active.customer); return c ? <button key="cl" className="text-primary hover:underline" onClick={() => onOpen({ kind: "client", id: c.id })}>{active.customer}</button> : active.customer; })() : "—"],
                ["Current Status", d.status],
                ["Last Known Location", truck?.location.split(" → ")[0] ?? "—"],
                ["Fleet Manager", fleetManager ? <button key="fm" className="text-primary hover:underline" onClick={() => onOpen({ kind: "fleet-manager", id: fleetManager.id })}>{fleetManager.name}</button> : "—"],
              ]} />
            </ProfileSection>
            <ProfileSection title="Driver Statistics" icon={TrendingUp}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <StatTile label="Trips Completed" value={String(driverTrips.filter(t => t.status === "Delivered").length)} icon={CheckCircle2} />
                <StatTile label="Active Trips" value={String(active ? 1 : 0)} icon={Activity} />
                <StatTile label="Total Distance" value={`${(driverTrips.reduce((s,t)=>s+t.distance,0)).toLocaleString()} km`} icon={RouteIcon} />
                <StatTile label="Fuel Assigned" value={`${(driverTrips.reduce((s,t)=>s+t.distance,0)*0.32|0).toLocaleString()} L`} icon={Fuel} />
                <StatTile label="Avg L/km" value={avgLkm ? avgLkm.toFixed(2) : "—"} icon={Fuel} />
                <StatTile label="Violations" value={String(d.violations)} icon={ShieldAlert} />
                <StatTile label="Incidents" value={String(driverIncidents.length)} icon={ShieldAlert} />
              </div>
            </ProfileSection>
          </>
        )},
        { value: "trips", label: "Trip History", content: (
          <div className="overflow-hidden rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-elevated/70"><tr>{["Trip","Customer","Route","Distance","Status"].map((h) => <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr></thead>
              <tbody>
                {driverTrips.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-xs text-muted-foreground">No trips.</td></tr>}
                {driverTrips.map((tp) => (
                  <tr key={tp.id} className="border-t border-border/60">
                    <td className="px-4 py-3 text-xs"><button onClick={() => onOpen({ kind: "trip", id: tp.id })} className="font-semibold text-primary hover:underline">{tp.id}</button></td>
                    <td className="px-4 py-3 text-xs">{tp.customer}</td>
                    <td className="px-4 py-3 text-xs">{isRoutePending(tp as TripWithRoute) ? <span className="text-muted-foreground italic">Route Pending</span> : formatRouteDisplay((tp as TripWithRoute).routeStops)}</td>
                    <td className="px-4 py-3 text-xs">{tp.distance} km</td>
                    <td className="px-4 py-3"><Pill tone={tp.status === "Delivered" ? "success" : tp.status === "Delayed" ? "danger" : tp.status === "Dispatched" ? "warning" : "info"}>{tp.status}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )},
        { value: "safety", label: "Safety Record", content: (
          <div className="space-y-2">
            {driverIncidents.length === 0 && <p className="text-xs text-muted-foreground">Clean record — no incidents.</p>}
            {driverIncidents.map((i) => (
              <button key={i.id} onClick={() => onOpen({ kind: "incident", id: i.id })} className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/30 p-3 hover:border-danger/40">
                <div className="text-left">
                  <div className="text-sm font-medium text-primary">{i.id} · {i.type}</div>
                  <div className="text-xs text-muted-foreground">{i.date} · {i.location} · {i.rootCause}</div>
                </div>
                <Pill tone={i.severity === "Critical" ? "purple" : i.severity === "High" ? "danger" : "warning"}>{i.severity}</Pill>
              </button>
            ))}
          </div>
        )},
        { value: "documents", label: "Documents", content: <DocumentsGrid docs={[
          { name: "Driver's Licence", expiry: d.licenseExpiry, status: "Valid" },
          { name: "Medical Certificate", expiry: d.medicalExpiry, status: "Valid" },
          { name: "Training Records" },
        ]} onUpload={() => setUploadOpen(true)} /> },
        { value: "notes", label: "Notes", content: <CollaborationPanel entityType="driver" entityId={id} className="px-1 py-2" /> },
      ]} />

      <DocumentUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} entityType="driver" />
      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} fields={[
        { key: "name", label: "Name", value: d.name },
        { key: "phone", label: "Phone", value: "+234 803 000 0000" },
        { key: "address", label: "Address", value: "12 Adeola Odeku St., Lagos" },
        { key: "license", label: "Licence Number", value: d.license },
        { key: "licenseExpiry", label: "Licence Expiry", value: d.licenseExpiry },
        { key: "medicalExpiry", label: "Medical Expiry", value: d.medicalExpiry },
      ]} />
    </>
  );
}
