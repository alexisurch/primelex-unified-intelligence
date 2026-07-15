import { Route as RouteIcon, Package, MapPin, Fuel, DollarSign, ClipboardList, Truck as TruckIcon, CircleUser as UserCircle2, Building2, Circle, FileText, Clock, Upload } from "lucide-react";
import { trips, trucks, drivers, clients, incidents, tripFuelHistory, getRouteFor, getTruckAvgLkm } from "@/lib/mock-data";
import { usePreferences } from "@/lib/preferences";
import type { ProfileTarget } from "@/lib/profile-drawer";
import { ProfileHeader, ProfileSection, ProfileTabs, InfoGrid, StatTile, DocumentsGrid, type Tone } from "./ProfileShell";
import { Pill } from "@/components/shared/Cards";
import { CollaborationPanel } from "@/components/shared/CollaborationPanel";
import { DocumentUploadDialog } from "./ProfileDialogs";
import { useState } from "react";

const naira = (n: number) => "₦" + n.toLocaleString();

export function TripProfile({ id, onOpen, onBack }: { id: string; onOpen: (t: ProfileTarget) => void; onBack?: () => void }) {
  const { trackingMode } = usePreferences();
  const isManual = trackingMode === "manual";
  const trip = trips.find((t) => t.id === id);
  const [uploadOpen, setUploadOpen] = useState(false);
  if (!trip) return <div className="p-6 text-sm text-muted-foreground">Trip not found.</div>;

  const truck = trucks.find((t) => t.id === trip.truck);
  const driver = drivers.find((d) => d.name === trip.driver);
  const client = clients.find((c) => c.name === trip.customer);
  const tripIncidents = incidents.filter((i) => i.trip === trip.id);
  const statusTone: Tone = trip.status === "Delivered" ? "success" : trip.status === "Delayed" ? "danger" : trip.status === "In Transit" ? "info" : trip.status === "Scheduled" ? "warning" : "purple";

  const fuelL = Math.round(trip.distance * 0.32);
  const pricePerL = 980;
  const fuelCost = fuelL * pricePerL;
  const revenue = trip.distance * 4500;
  const otherExp = 45000;
  const margin = revenue - fuelCost - otherExp;
  const lpk = trip.distance ? (fuelL / trip.distance).toFixed(2) : "—";
  const truckAvgLkm = truck ? getTruckAvgLkm(truck.id) : 0;

  return (
    <>
      <ProfileHeader
        onBack={onBack}
        icon={<Package className="h-6 w-6 text-primary" />}
        title={`${trip.id} · ${trip.customer}`}
        subtitle={<><span>{trip.origin} → {trip.destination}</span><Circle className="h-1 w-1 fill-muted-foreground" /></>}
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
            <ProfileSection title="Route Information" icon={MapPin}>
              {isManual ? (
                <InfoGrid items={[
                  ["Last Known Location", truck?.location.split(" → ")[0] ?? trip.origin],
                  ["Last Updated", "12m ago"],
                  ["Distance", `${trip.distance} km`],
                  ["ETA", trip.eta],
                ]} />
              ) : (
                <InfoGrid items={[
                  ["Current Live Location", truck?.location.split(" → ")[0] ?? trip.origin],
                  ["ETA", trip.eta],
                  ["Distance", `${trip.distance} km`],
                  ["Route", truck?.route ?? "—"],
                ]} />
              )}
            </ProfileSection>
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
          <ProfileSection title="Financial Summary" icon={DollarSign}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatTile label="Trip Revenue" value={naira(revenue)} icon={DollarSign} />
              <StatTile label="Fuel Cost" value={naira(fuelCost)} icon={Fuel} />
              <StatTile label="Other Expenses" value={naira(otherExp)} icon={DollarSign} />
              <StatTile label="Estimated Margin" value={naira(margin)} icon={DollarSign} />
            </div>
          </ProfileSection>
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
    </>
  );
}
