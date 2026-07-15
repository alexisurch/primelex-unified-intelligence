import { Route as RouteIcon, MapPin, Users, Truck as TruckIcon, ShieldAlert, Fuel, TrendingUp, Circle, Clock, Activity, DollarSign, Wrench } from "lucide-react";
import { Pill } from "@/components/shared/Cards";
import { routes, trips, incidents, tripFuelHistory, clients, getRouteById, drivers, getPreferredTrucks, getPreferredDrivers, getRouteHealthScore, getRouteMaintenanceSummary, getRouteFuelSummary } from "@/lib/mock-data";
import type { ProfileTarget } from "@/lib/profile-drawer";
import { ProfileHeader, ProfileSection, ProfileTabs, InfoGrid, StatTile, type Tone } from "./ProfileShell";
import { useState } from "react";
import { CollaborationPanel } from "@/components/shared/CollaborationPanel";

const naira = (n: number) => "₦" + n.toLocaleString();

export function RouteProfile({ id, onOpen, onBack }: { id: string; onOpen: (t: ProfileTarget) => void; onBack?: () => void }) {
  const rt = getRouteById(id) ?? routes.find((r) => r.name === id);
  const [incidentsOpen, setIncidentsOpen] = useState(false);
  if (!rt) return <div className="p-6 text-sm text-muted-foreground">Route not found.</div>;

  const routeTrips = trips.filter((t) => t.origin === rt.origin && t.destination === rt.destination);
  const activeTrips = routeTrips.filter((t) => t.status === "In Transit" || t.status === "Scheduled");
  const completed = routeTrips.filter((t) => t.status === "Delivered");
  const routeIncidents = incidents.filter((i) => {
    const tp = trips.find((t) => t.id === i.trip);
    return tp && tp.origin === rt.origin && tp.destination === rt.destination;
  });
  const routeFuel = tripFuelHistory.filter((h) => h.routeId === rt.id);
  const clientsSet = Array.from(new Set(routeTrips.map((t) => t.customer)));
  const trucksSet = Array.from(new Set(routeTrips.map((t) => t.truck)));
  const driversSet = Array.from(new Set(routeTrips.map((t) => t.driver)));

  const totalFuelL = routeFuel.reduce((s, h) => s + h.assignedFuelL, 0);
  const totalFuelCost = routeFuel.reduce((s, h) => s + h.fuelCostNGN, 0);
  const totalDist = routeFuel.reduce((s, h) => s + h.distanceKm, 0);
  const avgLpk = totalDist ? totalFuelL / totalDist : 0;
  const avgFuel = routeFuel.length ? Math.round(totalFuelL / routeFuel.length) : 0;
  const healthScore = getRouteHealthScore(rt.id);
  const maintSummary = getRouteMaintenanceSummary(rt.id);
  const fuelSummary = getRouteFuelSummary(rt.id);
  const preferredTrucks = getPreferredTrucks(rt.id);
  const preferredDrivers = getPreferredDrivers(rt.id);

  const statusTone: Tone = "info";

  return (
    <>
      <ProfileHeader
        onBack={onBack}
        icon={<RouteIcon className="h-6 w-6 text-primary" />}
        title={rt.name}
        subtitle={<><span>{rt.id}</span><Circle className="h-1 w-1 fill-muted-foreground" /><span>{rt.distanceKm} km</span></>}
        statusTone={statusTone}
        statusLabel="Route"
      />
      <ProfileTabs defaultValue="overview" tabs={[
        { value: "overview", label: "Overview", content: (
          <>
            <ProfileSection title="Route Details" icon={MapPin}>
              <InfoGrid items={[
                ["Route Name", rt.name],
                ["Origin", rt.origin],
                ["Destination", rt.destination],
                ["Total Distance", `${rt.distanceKm} km`],
                ["Active Trips", String(activeTrips.length)],
                ["Completed Trips", String(completed.length)],
                ["Clients Served", String(clientsSet.length)],
                ["Total Incidents", (
                  <button key="ti" onClick={() => setIncidentsOpen((v) => !v)} className="text-primary hover:underline">
                    {routeIncidents.length}
                  </button>
                )],
              ]} />
              {incidentsOpen && (
                <div className="mt-4 space-y-2">
                  {routeIncidents.length === 0 && <p className="text-xs text-muted-foreground">No incidents on this route.</p>}
                  {routeIncidents.map((i) => (
                    <button key={i.id} onClick={() => onOpen({ kind: "incident", id: i.id })} className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/30 p-3 hover:border-danger/40">
                      <div className="text-left"><div className="text-sm font-medium text-primary">{i.id} · {i.type}</div><div className="text-xs text-muted-foreground">{i.date} · {i.location}</div></div>
                      <Pill tone={i.severity === "Critical" ? "purple" : i.severity === "High" ? "danger" : "warning"}>{i.severity}</Pill>
                    </button>
                  ))}
                </div>
              )}
            </ProfileSection>
            <ProfileSection title="Performance Summary" icon={TrendingUp}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <StatTile label="Avg Fuel Assigned" value={`${avgFuel} L`} icon={Fuel} />
                <StatTile label="Average L/km" value={avgLpk.toFixed(2)} icon={Fuel} />
                <StatTile label="Avg Trip Duration" value="14h" icon={Clock} />
                <StatTile label="Avg Delay" value="42m" icon={Clock} />
                <StatTile label="Total Fuel Assigned" value={`${totalFuelL.toLocaleString()} L`} icon={Fuel} />
                <StatTile label="Total Distance" value={`${totalDist.toLocaleString()} km`} icon={RouteIcon} />
                <StatTile label="Total Fuel Cost" value={naira(totalFuelCost)} icon={DollarSign} />
                <StatTile label="Total Trips" value={String(routeTrips.length)} icon={Activity} />
                <StatTile label="Route Health Score" value={`${healthScore}/100`} icon={Activity} />
              </div>
            </ProfileSection>
            <ProfileSection title="Preferred Trucks" icon={TruckIcon}>
              <div className="flex flex-wrap gap-2">
                {preferredTrucks.length === 0 && <p className="text-xs text-muted-foreground">No truck data yet.</p>}
                {preferredTrucks.map((truckId) => (
                  <button key={truckId} onClick={() => onOpen({ kind: "truck", id: truckId })} className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/30 px-3 py-2 text-xs hover:border-primary/40">
                    <TruckIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium text-primary">{truckId}</span>
                  </button>
                ))}
              </div>
            </ProfileSection>
            <ProfileSection title="Preferred Drivers" icon={Users}>
              <div className="flex flex-wrap gap-2">
                {preferredDrivers.length === 0 && <p className="text-xs text-muted-foreground">No driver data yet.</p>}
                {preferredDrivers.map((name) => {
                  const drv = drivers.find((d) => d.name === name);
                  return (
                    <button key={name} onClick={() => drv && onOpen({ kind: "driver", id: drv.id })} className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/30 px-3 py-2 text-xs hover:border-primary/40">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium text-primary">{name}</span>
                    </button>
                  );
                })}
              </div>
            </ProfileSection>
            <ProfileSection title="Maintenance Summary" icon={Wrench}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <StatTile label="Total Maintenance Events" value={String(maintSummary.totalEvents)} icon={Wrench} />
                <StatTile label="Maintenance Spend" value={naira(maintSummary.totalSpend)} icon={DollarSign} />
                <StatTile label="Downtime (hours)" value={String(maintSummary.downtimeHours)} icon={Clock} />
              </div>
            </ProfileSection>
            <ProfileSection title="Fuel Summary" icon={Fuel}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <StatTile label="Total Fuel Assigned" value={`${fuelSummary.totalFuel.toLocaleString()} L`} icon={Fuel} />
                <StatTile label="Avg Fuel Per Trip" value={`${fuelSummary.avgFuelPerTrip} L`} icon={Fuel} />
                <StatTile label="Average L/km" value={fuelSummary.avgLkm.toFixed(2)} icon={Fuel} />
              </div>
            </ProfileSection>
          </>
        )},
        { value: "trucks", label: "Trucks", content: (
          <SimpleTable headers={["Truck", "Trips", "Avg L/km", "Avg Fuel", "Last Trip"]}
            rows={trucksSet.map((truckId) => {
              const tripsOfTruck = routeTrips.filter((t) => t.truck === truckId);
              const fuelOfTruck = routeFuel.filter((h) => trips.find((t) => t.id === h.tripId)?.truck === truckId);
              const distTruck = fuelOfTruck.reduce((s, h) => s + h.distanceKm, 0);
              const fuelTruck = fuelOfTruck.reduce((s, h) => s + h.assignedFuelL, 0);
              const lpk = distTruck ? (fuelTruck / distTruck).toFixed(2) : "—";
              const avg = fuelOfTruck.length ? Math.round(fuelTruck / fuelOfTruck.length) : 0;
              return [
                <button key="t" onClick={() => onOpen({ kind: "truck", id: truckId })} className="text-primary font-semibold hover:underline">{truckId}</button>,
                String(tripsOfTruck.length),
                lpk,
                `${avg} L`,
                tripsOfTruck[0]?.id ?? "—",
              ];
            })}
            empty="No trucks recorded."
          />
        )},
        { value: "drivers", label: "Drivers", content: (
          <SimpleTable headers={["Driver", "Trips", "Avg L/km", "Incidents", "Last Trip"]}
            rows={driversSet.map((name) => {
              const tripsOfDriver = routeTrips.filter((t) => t.driver === name);
              const fuelOfDriver = routeFuel.filter((h) => trips.find((t) => t.id === h.tripId)?.driver === name);
              const distD = fuelOfDriver.reduce((s, h) => s + h.distanceKm, 0);
              const fuelD = fuelOfDriver.reduce((s, h) => s + h.assignedFuelL, 0);
              const lpk = distD ? (fuelD / distD).toFixed(2) : "—";
              const inc = routeIncidents.filter((i) => i.driver === name).length;
              const drv = drivers.find((d) => d.name === name);
              return [
                drv ? <button key="d" onClick={() => onOpen({ kind: "driver", id: drv.id })} className="text-primary font-semibold hover:underline">{name}</button> : name,
                String(tripsOfDriver.length),
                lpk,
                String(inc),
                tripsOfDriver[0]?.id ?? "—",
              ];
            })}
            empty="No drivers on this route."
          />
        )},
        { value: "clients", label: "Clients", content: (
          <SimpleTable headers={["Client", "Trips", "Volume", "Last Delivery"]}
            rows={clientsSet.map((name) => {
              const cTrips = routeTrips.filter((t) => t.customer === name);
              const client = clients.find((c) => c.name === name);
              return [
                client ? <button key="c" onClick={() => onOpen({ kind: "client", id: client.id })} className="text-primary font-semibold hover:underline">{name}</button> : name,
                String(cTrips.length),
                `${cTrips.reduce((s, t) => s + (t.stops * 2), 0)} T`,
                cTrips.find((t) => t.status === "Delivered")?.id ?? "—",
              ];
            })}
            empty="No clients on this route."
          />
        )},
        { value: "notes", label: "Notes", content: <CollaborationPanel entityType="route" entityId={id} className="px-1 py-2" /> },
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
