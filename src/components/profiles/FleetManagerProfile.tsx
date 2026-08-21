import { UserCog, Truck as TruckIcon, Users, Package, Route as RouteIcon, Fuel, Wrench, ShieldAlert, TrendingUp, Circle, Phone, Mail, IdCard, Calendar, Activity, CircleCheck as CheckCircle2, Clock, TriangleAlert as AlertTriangle, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pill } from "@/components/shared/Cards";
import { trucks, drivers, incidents, maintenanceRecords, fuelTransactions, tripFuelHistory, getRouteFor } from "@/lib/mock-data";
import { useTrips, formatRouteDisplay, isRoutePending, type TripWithRoute } from "@/lib/trips-store";
import { useFleetManagers } from "@/lib/fleet-managers-store";
import type { ProfileTarget } from "@/lib/profile-drawer";
import { ProfileHeader, ProfileSection, ProfileTabs, InfoGrid, StatTile, TimelineList, initials, type Tone } from "./ProfileShell";
import { CollaborationPanel } from "@/components/shared/CollaborationPanel";
import { AuditTrailPanel } from "@/components/shared/AuditTrailPanel";

const naira = (n: number) => "₦" + n.toLocaleString();

export function FleetManagerProfile({ id, onOpen, onBack }: { id: string; onOpen: (t: ProfileTarget) => void; onBack?: () => void }) {
  const { getManager } = useFleetManagers();
  const { trips } = useTrips();
  const m = getManager(id);
  if (!m) return <div className="p-6 text-sm text-muted-foreground">Fleet Manager not found.</div>;

  const myTrucks = trucks.filter((t) => m.assignedTruckIds.includes(t.id));
  const myDriverNames = new Set(myTrucks.map((t) => t.driver));
  const myDrivers = drivers.filter((d) => myDriverNames.has(d.name));
  const myTrips = trips.filter((tp) => m.assignedTruckIds.includes(tp.truck));
  const activeTrips = myTrips.filter((tp) => tp.status === "In Transit" || tp.status === "Scheduled" || tp.status === "Dispatched");
  const completedTrips = myTrips.filter((tp) => tp.status === "Delivered");
  const delayed = myTrips.filter((tp) => tp.status === "Delayed");
  const myIncidents = incidents.filter((i) => m.assignedTruckIds.includes(i.truck));
  const openIncidents = myIncidents.filter((i) => i.status !== "Resolved");
  const myMaint = maintenanceRecords.filter((r) => m.assignedTruckIds.includes(r.truck));
  const trucksUnderMaint = myMaint.filter((r) => r.status === "In Workshop" || r.status === "Overdue");
  const myFuel = fuelTransactions.filter((f) => m.assignedTruckIds.includes(f.truck));
  const totalFuelL = myFuel.reduce((s, f) => s + f.quantity, 0);
  const totalFuelCost = myFuel.reduce((s, f) => s + f.amount, 0);
  const totalDist = myTrips.reduce((s, t) => s + t.distance, 0);
  const avgLpk = totalDist ? totalFuelL / totalDist : 0;
  const utilizationPct = myTrucks.length ? Math.round((myTrucks.filter((t) => t.status === "On The Road").length / myTrucks.length) * 100) : 0;

  const myRoutes = Array.from(new Set(myTrips.map((t) => getRouteFor(t.origin, t.destination)?.id).filter(Boolean))) as string[];

  const statusTone: Tone = m.status === "Active" ? "success" : m.status === "On Leave" ? "warning" : "danger";

  return (
    <>
      <ProfileHeader
        onBack={onBack}
        icon={<Avatar className="h-11 w-11"><AvatarFallback className="bg-primary/20 text-primary">{initials(m.name)}</AvatarFallback></Avatar>}
        title={m.name}
        subtitle={<><span>{m.id}</span><Circle className="h-1 w-1 fill-muted-foreground" /><span>{m.role}</span></>}
        statusTone={statusTone}
        statusLabel={m.status}
      />
      <ProfileTabs defaultValue="overview" tabs={[
        { value: "overview", label: "Overview", content: (
          <>
            <ProfileSection title="Profile" icon={UserCog}>
              <InfoGrid items={[
                ["Full Name", m.name],
                ["Employee ID", m.employeeId],
                ["Role", m.role],
                ["Department", m.department],
                ["Phone", <span key="p" className="inline-flex items-center gap-1"><Phone className="h-3 w-3 text-muted-foreground" />{m.phone}</span>],
                ["Email", <span key="e" className="inline-flex items-center gap-1"><Mail className="h-3 w-3 text-muted-foreground" />{m.email}</span>],
                ["Employment Status", m.status],
                ["Date Joined", <span key="d" className="inline-flex items-center gap-1"><Calendar className="h-3 w-3 text-muted-foreground" />{m.dateJoined}</span>],
              ]} />
            </ProfileSection>
            <ProfileSection title="Operational KPIs" icon={TrendingUp}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <StatTile label="Assigned Trucks" value={String(myTrucks.length)} icon={TruckIcon} />
                <StatTile label="Assigned Drivers" value={String(myDrivers.length)} icon={Users} />
                <StatTile label="Active Trips" value={String(activeTrips.length)} icon={Activity} />
                <StatTile label="Completed Trips" value={String(completedTrips.length)} icon={CheckCircle2} />
                <StatTile label="Delayed Trips" value={String(delayed.length)} icon={Clock} />
                <StatTile label="Open Incidents" value={String(openIncidents.length)} icon={ShieldAlert} />
                <StatTile label="Trucks Under Maintenance" value={String(trucksUnderMaint.length)} icon={Wrench} />
                <StatTile label="Fuel Assigned" value={`${totalFuelL.toLocaleString()} L`} icon={Fuel} />
                <StatTile label="Avg Fleet L/km" value={avgLpk.toFixed(2)} icon={Fuel} />
                <StatTile label="Total Distance" value={`${totalDist.toLocaleString()} km`} icon={RouteIcon} />
                <StatTile label="Fleet Utilization" value={`${utilizationPct}%`} icon={Activity} />
                <StatTile label="Fuel Cost" value={naira(totalFuelCost)} icon={DollarSign} />
              </div>
            </ProfileSection>
          </>
        )},
        { value: "fleet", label: "Assigned Fleet", content: (
          <SimpleTable headers={["Truck", "Plate", "Model", "Driver", "Status"]}
            rows={myTrucks.map((t) => [
              <button key="t" onClick={() => onOpen({ kind: "truck", id: t.id })} className="text-primary font-semibold hover:underline">{t.id}</button>,
              t.plate, t.model,
              <button key="d" onClick={() => onOpen({ kind: "driver", id: t.driver })} className="hover:underline">{t.driver}</button>,
              <Pill key="s" tone={t.status === "On The Road" ? "info" : t.status === "Idle" ? "success" : t.status === "Maintenance" ? "danger" : "purple"}>{t.status}</Pill>,
            ])}
            empty="No trucks assigned yet."
          />
        )},
        { value: "drivers", label: "Drivers", content: (
          <SimpleTable headers={["Driver", "Licence", "Truck", "Score", "Status"]}
            rows={myDrivers.map((d) => {
              const truck = myTrucks.find((t) => t.driver === d.name);
              return [
                <button key="d" onClick={() => onOpen({ kind: "driver", id: d.id })} className="text-primary font-semibold hover:underline">{d.name}</button>,
                <span key="l" className="inline-flex items-center gap-1"><IdCard className="h-3 w-3 text-muted-foreground" />{d.license}</span>,
                truck ? <button key="t" onClick={() => onOpen({ kind: "truck", id: truck.id })} className="text-primary hover:underline">{truck.id}</button> : "—",
                String(d.score),
                <Pill key="s" tone={d.status === "Active" ? "success" : d.status === "On Leave" ? "warning" : "danger"}>{d.status}</Pill>,
              ];
            })}
            empty="No drivers under this manager."
          />
        )},
        { value: "trips", label: "Active Trips", content: (
          <SimpleTable headers={["Trip", "Client", "Route", "Truck", "Status"]}
            rows={activeTrips.map((tp) => [
              <button key="t" onClick={() => onOpen({ kind: "trip", id: tp.id })} className="text-primary font-semibold hover:underline">{tp.id}</button>,
              tp.customer,
              isRoutePending(tp as TripWithRoute) ? "Route Pending" : formatRouteDisplay((tp as TripWithRoute).routeStops),
              <button key="tr" onClick={() => onOpen({ kind: "truck", id: tp.truck })} className="hover:underline">{tp.truck}</button>,
              <Pill key="s" tone={tp.status === "Delivered" ? "success" : tp.status === "Delayed" ? "danger" : tp.status === "In Transit" ? "info" : tp.status === "Dispatched" ? "warning" : "warning"}>{tp.status}</Pill>,
            ])}
            empty="No active trips."
          />
        )},
        { value: "routes", label: "Routes", content: (
          <SimpleTable headers={["Route", "Trips"]}
            rows={myRoutes.map((rid) => {
              const rt = trips.find((t) => getRouteFor(t.origin, t.destination)?.id === rid);
              const count = myTrips.filter((t) => getRouteFor(t.origin, t.destination)?.id === rid).length;
              return [
                <button key="r" onClick={() => onOpen({ kind: "route", id: rid })} className="text-primary font-semibold hover:underline">{rt ? `${rt.origin} → ${rt.destination}` : rid}</button>,
                String(count),
              ];
            })}
            empty="No routes operated yet."
          />
        )},
        { value: "fuel", label: "Fuel", content: (
          <>
            <ProfileSection title="Fuel Intelligence" icon={Fuel}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <StatTile label="Total Fuel Assigned" value={`${totalFuelL.toLocaleString()} L`} icon={Fuel} />
                <StatTile label="Average L/km" value={avgLpk.toFixed(2)} icon={Fuel} />
                <StatTile label="Fuel Cost" value={naira(totalFuelCost)} icon={DollarSign} />
                <StatTile label="Fuel Alerts" value={String(tripFuelHistory.filter((h) => m.assignedTruckIds.includes(trips.find((t) => t.id === h.tripId)?.truck ?? "")).length ? 0 : 0)} icon={AlertTriangle} />
              </div>
            </ProfileSection>
            <SimpleTable headers={["Date", "Truck", "Type", "Qty", "Cost"]}
              rows={myFuel.slice(0, 12).map((f) => [
                f.date, <button key="t" onClick={() => onOpen({ kind: "truck", id: f.truck })} className="text-primary hover:underline">{f.truck}</button>,
                f.fuelType, `${f.quantity} L`, naira(f.amount),
              ])}
              empty="No fuel records yet."
            />
          </>
        )},
        { value: "maintenance", label: "Maintenance", content: (
          <>
            <div className="mb-4 grid grid-cols-3 gap-3">
              <StatTile label="Upcoming" value={String(myMaint.filter((r) => r.status === "Scheduled").length)} icon={Wrench} />
              <StatTile label="Overdue" value={String(myMaint.filter((r) => r.status === "Overdue").length)} icon={AlertTriangle} />
              <StatTile label="Completed" value={String(myMaint.filter((r) => r.status === "Completed").length)} icon={CheckCircle2} />
            </div>
            <SimpleTable headers={["Truck", "Service", "Date", "Cost", "Status"]}
              rows={myMaint.map((r) => [
                <button key="t" onClick={() => onOpen({ kind: "truck", id: r.truck })} className="text-primary hover:underline">{r.truck}</button>,
                r.service, r.date, naira(r.cost),
                <Pill key="s" tone={r.status === "Completed" ? "success" : r.status === "Overdue" ? "danger" : r.status === "In Workshop" ? "warning" : "info"}>{r.status}</Pill>,
              ])}
              empty="No maintenance records."
            />
          </>
        )},
        { value: "incidents", label: "Incidents", content: (
          <div className="space-y-2">
            {myIncidents.length === 0 && <p className="text-xs text-muted-foreground">No incidents involving this manager's fleet.</p>}
            {myIncidents.map((i) => (
              <button key={i.id} onClick={() => onOpen({ kind: "incident", id: i.id })} className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/30 p-3 hover:border-danger/40">
                <div className="text-left">
                  <div className="text-sm font-medium text-primary">{i.id} · {i.type}</div>
                  <div className="text-xs text-muted-foreground">{i.date} · {i.location} · {i.rootCause}</div>
                </div>
                <Pill tone={i.severity === "Critical" ? "purple" : i.severity === "High" ? "danger" : i.severity === "Moderate" ? "warning" : "info"}>{i.severity}</Pill>
              </button>
            ))}
          </div>
        )},
        { value: "timeline", label: "Timeline", content: (
          <TimelineList events={[
            { time: m.dateJoined, label: "Fleet Manager Onboarded", detail: `${m.name} · ${m.department}`, tone: "info" },
            ...myTrucks.slice(0, 3).map((t) => ({ time: "2025-10-02", label: "Truck Assigned", detail: `${t.id} · ${t.plate}`, tone: "info" as const })),
            ...myDrivers.slice(0, 2).map((d) => ({ time: "2025-11-14", label: "Driver Assigned", detail: d.name, tone: "info" as const })),
            ...activeTrips.slice(0, 2).map((t) => ({ time: "Today", label: "Trip Started", detail: `${t.id} · ${t.customer}`, tone: "success" as const })),
            ...completedTrips.slice(0, 2).map((t) => ({ time: "This week", label: "Trip Completed", detail: `${t.id} · ${t.destination}`, tone: "success" as const })),
            ...myIncidents.slice(0, 2).map((i) => ({ time: i.date, label: `Incident Reported: ${i.type}`, detail: i.location, tone: "danger" as const })),
            ...myMaint.filter((r) => r.status === "Completed").slice(0, 2).map((r) => ({ time: r.date, label: `Maintenance Approved: ${r.service}`, detail: r.truck, tone: "warning" as const })),
            ...myFuel.slice(0, 2).map((f) => ({ time: f.date, label: "Fuel Assigned", detail: `${f.quantity} L · ${f.truck}`, tone: "info" as const })),
          ]} />
        )},
        { value: "notes", label: "Notes", content: <CollaborationPanel entityType="fleet-manager" entityId={id} className="px-1 py-2" /> },
        { value: "audit", label: "Audit Trail", content: <AuditTrailPanel entityType="fleet-manager" entityId={id} className="px-1 py-2" /> },
      ]} />
    </>
  );
}

function SimpleTable({ headers, rows, empty }: { headers: string[]; rows: React.ReactNode[][]; empty: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <table className="w-full text-sm">
        <thead className="bg-elevated/70"><tr>{headers.map((h) => <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={headers.length} className="px-4 py-10 text-center text-xs text-muted-foreground">{empty}</td></tr>}
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border/60 hover:bg-white/[0.03]">
              {r.map((cell, j) => <td key={j} className="px-4 py-3 text-xs">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
