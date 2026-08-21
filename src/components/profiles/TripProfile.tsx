import { Route as RouteIcon, Package, MapPin, Fuel, DollarSign, ClipboardList, Truck as TruckIcon, CircleUser as UserCircle2, Building2, Circle, FileText, Clock, Upload, Receipt, Percent, Pencil } from "lucide-react";
import { trucks, drivers, clients, incidents, tripFuelHistory, getRouteFor, getTruckAvgLkm, tripFuelCost, tripOtherExpenses, getDepreciationForTrip, tripGrossProfit, tripNetProfit, tripTotalExpenses } from "@/lib/mock-data";
import { usePreferences } from "@/lib/preferences";
import { useTrips, formatRouteDisplay, isRoutePending, type TripWithRoute } from "@/lib/trips-store";
import type { ProfileTarget } from "@/lib/profile-drawer";
import { ProfileHeader, ProfileSection, ProfileTabs, InfoGrid, StatTile, DocumentsGrid, type Tone } from "./ProfileShell";
import { Pill } from "@/components/shared/Cards";
import { CollaborationPanel } from "@/components/shared/CollaborationPanel";
import { DocumentUploadDialog } from "./ProfileDialogs";
import { RouteEditorDialog } from "@/components/shared/RouteEditorDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const naira = (n: number) => "₦" + n.toLocaleString();

export function TripProfile({ id, onOpen, onBack }: { id: string; onOpen: (t: ProfileTarget) => void; onBack?: () => void }) {
  const { trackingMode } = usePreferences();
  const { getTrip } = useTrips();
  const isManual = trackingMode === "manual";
  const trip = getTrip(id) as TripWithRoute | undefined;
  const [uploadOpen, setUploadOpen] = useState(false);
  const [routeEditOpen, setRouteEditOpen] = useState(false);
  if (!trip) return <div className="p-6 text-sm text-muted-foreground">Trip not found.</div>;

  const truck = trucks.find((t) => t.id === trip.truck);
  const driver = drivers.find((d) => d.name === trip.driver);
  const client = clients.find((c) => c.name === trip.customer);
  const tripIncidents = incidents.filter((i) => i.trip === trip.id);
  const statusTone: Tone = trip.status === "Delivered" ? "success" : trip.status === "Delayed" ? "danger" : trip.status === "In Transit" ? "info" : trip.status === "Scheduled" ? "warning" : trip.status === "Dispatched" ? "warning" : "purple";

  const fuelL = Math.round(trip.distance * 0.32);
  const pricePerL = 980;
  const fuelCost = fuelL * pricePerL;
  const revenue = trip.distance * 4500;
  const otherExp = 45000;
  const depreciation = getDepreciationForTrip(trip)?.perTrip ?? 0;
  const grossProfit = tripGrossProfit(trip);
  const totalExpenses = tripTotalExpenses(trip);
  const netProfit = tripNetProfit(trip);
  const netMargin = revenue ? (netProfit / revenue) * 100 : 0;
  const lpk = trip.distance ? (fuelL / trip.distance).toFixed(2) : "—";
  const truckAvgLkm = truck ? getTruckAvgLkm(truck.id) : 0;

  return (
    <>
      <ProfileHeader
        onBack={onBack}
        icon={<Package className="h-6 w-6 text-primary" />}
        title={`${trip.id} · ${trip.customer}`}
        subtitle={<><span>{isRoutePending(trip) ? "Route Pending" : formatRouteDisplay(trip.routeStops)}</span><Circle className="h-1 w-1 fill-muted-foreground" /></>}
        statusTone={statusTone}
        statusLabel={trip.status}
      />
      <ProfileTabs defaultValue="overview" tabs={[
        { value: "overview", label: "Overview", content: (
          <>
            <ProfileSection title="Trip Details" icon={RouteIcon}>
              <InfoGrid items={[
                ["Trip ID", trip.id],
                ["Client", client ? <button key="c" onClick={() => onOpen({ kind: "client", id: client.id })} className="text-primary hover:underline">{trip.customer}</button> : trip.customer],
                ["Pickup Location", trip.origin],
                ["Destination", trip.destination],
                ["Cargo Description", "General freight"],
                ["Cargo Weight", `${5 + trip.distance % 15} T`],
                ["Priority", <Pill key="p" tone={trip.priority === "Critical" ? "danger" : trip.priority === "High" ? "warning" : "info"}>{trip.priority}</Pill>],
                ["Assigned Truck", truck ? <button key="t" onClick={() => onOpen({ kind: "truck", id: truck.id })} className="text-primary hover:underline">{trip.truck}</button> : trip.truck],
                ["Assigned Driver", driver ? <button key="d" onClick={() => onOpen({ kind: "driver", id: driver.id })} className="text-primary hover:underline">{trip.driver}</button> : trip.driver],
                ["Dispatcher", "A. Bello"],
                ["Trip Status", trip.status],
                ["Tracking Mode", isManual ? "Manual" : "GPS"],
              ]} />
            </ProfileSection>
            <ProfileSection title="Route Information" icon={MapPin} action={
              <Button size="sm" variant="ghost" className="h-7 text-xs text-primary" onClick={() => setRouteEditOpen(true)}><Pencil className="mr-1 h-3 w-3" />{isRoutePending(trip) ? "Add Route" : "Edit Route"}</Button>
            }>
              {isRoutePending(trip) ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground italic">Route Pending — no route has been assigned yet.</p>
                  <InfoGrid items={[
                    ["Distance", `${trip.distance} km`],
                    ["ETA", trip.eta],
                  ]} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/60 bg-elevated/30 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Full Route</div>
                    <div className="flex flex-col gap-1.5">
                      {trip.routeStops!.map((stop, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${idx === 0 ? "bg-success/20 text-success" : idx === trip.routeStops!.length - 1 ? "bg-danger/20 text-danger" : "bg-primary/20 text-primary"}`}>{idx + 1}</div>
                          <span className="text-sm font-medium">{stop}</span>
                          {idx < trip.routeStops!.length - 1 && <div className="ml-3.5 h-4 w-px bg-border" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <InfoGrid items={[
                    ["Origin", trip.origin],
                    ["Destination", trip.destination],
                    ["Stops", String(trip.stops)],
                    ["Distance", `${trip.distance} km`],
                    ["ETA", trip.eta],
                  ]} />
                </div>
              )}
            </ProfileSection>
            {trip.routeUpdates && trip.routeUpdates.length > 0 && (
              <ProfileSection title="Route Updates" icon={Clock}>
                <div className="space-y-3">
                  {trip.routeUpdates.map((ru, idx) => (
                    <div key={ru.id} className="rounded-lg border border-border/60 bg-elevated/30 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{idx === 0 ? "Latest Update" : "Previous"}</span>
                        <span className="text-[10px] text-muted-foreground">{ru.date}</span>
                      </div>
                      {ru.previousRoute && <div className="text-xs text-muted-foreground line-through">{ru.previousRoute}</div>}
                      <div className="text-xs font-medium text-foreground">{ru.newRoute}</div>
                    </div>
                  ))}
                </div>
              </ProfileSection>
            )}
            <ProfileSection title="Fuel" icon={Fuel}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <StatTile label="Fuel Assigned" value={`${fuelL} L`} icon={Fuel} />
                <StatTile label="Price Per Litre" value={naira(pricePerL)} icon={DollarSign} />
                <StatTile label="Fuel Cost" value={naira(fuelCost)} icon={DollarSign} />
                <StatTile label="Cost Per KM" value={naira(Math.round(fuelCost / trip.distance))} icon={RouteIcon} />
                <StatTile label="Trip L/km" value={lpk} icon={Fuel} />
                <StatTile label="Truck Avg L/km" value={truckAvgLkm ? truckAvgLkm.toFixed(2) : "—"} icon={Fuel} />
              </div>
            </ProfileSection>
          </>
        )},
        { value: "delivery", label: "Delivery", content: (
          <ProfileSection title="Delivery Details" icon={ClipboardList}>
            <InfoGrid items={[
              ["Delivery Time", trip.status === "Delivered" ? "Day 2 · 14:30" : "—"],
              ["Receiver", trip.status === "Delivered" ? "K. Adebayo" : "—"],
              ["Proof of Delivery", trip.status === "Delivered" ? "Signed POD attached" : "Pending"],
              ["Delivery Notes", trip.status === "Delivered" ? "Delivered in full, no damages." : "—"],
            ]} />
          </ProfileSection>
        )},
        { value: "financials", label: "Financials", content: (
          <>
            <ProfileSection title="Financial Summary" icon={DollarSign}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <StatTile label="Trip Revenue" value={naira(revenue)} icon={DollarSign} />
                <StatTile label="Payment Status" value={trip.paymentStatus} icon={Receipt} muted={trip.paymentStatus === "Pending"} />
                <StatTile label="Total Expenses" value={naira(totalExpenses)} icon={Receipt} />
                <StatTile label="Gross Profit" value={naira(grossProfit)} icon={DollarSign} />
                <StatTile label="Depreciation" value={naira(depreciation)} icon={Fuel} muted />
                <StatTile label="Net Profit" value={naira(netProfit)} icon={DollarSign} />
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">Gross Profit excludes depreciation. Net Profit includes depreciation. Total Expenses includes depreciation.</p>
              <div className="mt-3 rounded-lg border border-border/60 bg-elevated/30 px-3 py-2 flex justify-between text-xs">
                <span className="text-muted-foreground">Net Profit Margin</span>
                <span className="font-semibold text-purple">{netMargin.toFixed(1)}%</span>
              </div>
            </ProfileSection>
            <ProfileSection title="Expense Breakdown" icon={Receipt}>
              <InfoGrid items={[
                ["Fuel Cost", naira(fuelCost)],
                ["Other Expenses", naira(otherExp)],
                ["Depreciation", naira(depreciation)],
                ["Total Expenses", naira(totalExpenses)],
              ]} />
            </ProfileSection>
          </>
        )},
        { value: "incidents", label: "Incidents", content: (
          <div className="space-y-2">
            {tripIncidents.length === 0 && <p className="text-xs text-muted-foreground">No incidents on this trip.</p>}
            {tripIncidents.map((i) => (
              <button key={i.id} onClick={() => onOpen({ kind: "incident", id: i.id })} className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/30 p-3 hover:border-danger/40">
                <div className="text-left"><div className="text-sm font-medium text-primary">{i.id} · {i.type}</div><div className="text-xs text-muted-foreground">{i.date} · {i.location}</div></div>
                <Pill tone={i.severity === "Critical" ? "purple" : i.severity === "High" ? "danger" : "warning"}>{i.severity}</Pill>
              </button>
            ))}
          </div>
        )},
        { value: "documents", label: "Documents", content: <DocumentsGrid docs={[
          { name: "Waybill" }, { name: "Invoice" }, { name: "Delivery Note" }, { name: "Proof of Delivery" },
        ]} onUpload={() => setUploadOpen(true)} /> },
        { value: "notes", label: "Notes", content: <CollaborationPanel entityType="trip" entityId={id} className="px-1 py-2" /> },
      ]} />

      <DocumentUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} entityType="trip" />
      <RouteEditorDialog open={routeEditOpen} onOpenChange={setRouteEditOpen} trip={trip} />
    </>
  );
}
