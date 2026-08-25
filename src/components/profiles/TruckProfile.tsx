import { Truck as TruckIcon, CircleUser as UserCircle2, ClipboardList, TrendingUp, MapPin, Clock, Gauge, Satellite, Route as RouteIcon, Activity, Fuel, DollarSign, CircleCheck as CheckCircle2, Circle, Wrench, IdCard, Calendar, Phone, ShieldAlert, UserCog, Pencil, Archive, ArchiveRestore, Receipt, Percent } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pill } from "@/components/shared/Cards";
import { trucks, trips, drivers, incidents, maintenanceRecords, tripFuelHistory, getRouteFor, getTruckAvgLkm, getTruckHealthScore, getAvgDowntime, getAvgRepairCost, getMTBR, getMaintenanceSpend, getDepreciationForTruck, depreciationCalculations, tripFuelCost, tripOtherExpenses, getDepreciationForTrip } from "@/lib/mock-data";
import { useFleetManagers } from "@/lib/fleet-managers-store";
import { usePreferences } from "@/lib/preferences";
import type { ProfileTarget } from "@/lib/profile-drawer";
import { ProfileHeader, ProfileSection, ProfileTabs, InfoGrid, StatTile, DocumentsGrid, initials, type Tone } from "./ProfileShell";
import { CollaborationPanel } from "@/components/shared/CollaborationPanel";
import { DocumentUploadDialog, EditProfileDialog } from "./ProfileDialogs";
import { useState } from "react";
import { cn } from "@/lib/utils";

const naira = (n: number) => "₦" + n.toLocaleString();

function ExpenseLine({ label, amount, total, isDepreciation }: { label: string; amount: number; total: number; isDepreciation?: boolean }) {
  const pct = total ? (amount / total) * 100 : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className={cn("text-muted-foreground", isDepreciation && "font-medium text-warning")}>
          {isDepreciation && <span className="mr-1.5 inline-flex items-center rounded px-1.5 py-0.5 bg-warning/15 text-warning text-[9px] font-semibold uppercase">Excl. Gross</span>}
          {label}
        </span>
        <span className={cn("font-medium text-foreground", isDepreciation && "text-warning")}>{naira(amount)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background/70">
        <div className={cn("h-full rounded-full", isDepreciation ? "bg-warning ring-1 ring-warning/30" : "bg-primary")} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function TruckProfile({ id, onOpen, onBack }: { id: string; onOpen: (t: ProfileTarget) => void; onBack?: () => void }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [archived, setArchived] = useState(false);
  const { trackingMode } = usePreferences();
  const { getManagerForTruck } = useFleetManagers();
  const isManual = trackingMode === "manual";
  const t = trucks.find((x) => x.id === id);
  if (!t) return <div className="p-6 text-sm text-muted-foreground">Truck not found.</div>;
  const fleetManager = getManagerForTruck(t.id);

  const truckTrips = trips.filter((tp) => tp.truck === t.id);
  const active = truckTrips.find((tp) => tp.status === "In Transit" || tp.status === "Scheduled" || tp.status === "Delayed");
  const truckIncidents = incidents.filter((i) => i.truck === t.id);
  const truckMaint = maintenanceRecords.filter((m) => m.truck === t.id);
  const [lastLoc] = t.location.split(" → ");
  const driver = drivers.find((d) => d.name === t.driver);
  const opStatusTone: Tone = t.status === "On The Road" ? "info" : t.status === "Idle" ? "success" : t.status === "Maintenance" ? "danger" : "purple";
  const totalTrips = truckTrips.length + 40;
  const totalDist = totalTrips * 240;
  const totalFuel = Math.round(totalDist * 0.32);
  const avgLkm = getTruckAvgLkm(t.id);

  const overviewTab = (
    <>
      <ProfileSection title="Vehicle Information" icon={TruckIcon} action={
        <Button size="sm" variant="ghost" className="h-7 text-xs text-primary" onClick={() => setEditOpen(true)}><Pencil className="mr-1 h-3 w-3" />Edit</Button>
      }>
        <InfoGrid items={[
          ["Truck Number", t.id], ["Registration", t.plate], ["Model", t.model],
          ["Manufacturer", t.model.split(" ")[0]], ["Odometer", `${t.odometer.toLocaleString()} km`],
          ["Fuel Level", `${t.fuel}%`], ["GPS", t.gps], ["Last Service", t.lastService],
          ["Tracking Number", t.trackingNumber || "Not Available"],
          ["Tracking Source", isManual ? "Manual" : "GPS"],
          ["Fleet Manager", fleetManager ? <button key="fm" onClick={() => onOpen({ kind: "fleet-manager", id: fleetManager.id })} className="text-primary hover:underline inline-flex items-center gap-1"><UserCog className="h-3 w-3" />{fleetManager.name}</button> : "—"],
        ]} />
      </ProfileSection>
      <ProfileSection title="Assigned Driver" icon={UserCircle2} action={driver && (
        <Button size="sm" variant="ghost" className="h-7 text-xs text-primary" onClick={() => onOpen({ kind: "driver", id: driver.id })}>View Driver Profile</Button>
      )}>
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14"><AvatarFallback className="bg-primary/20 text-primary text-sm">{initials(t.driver)}</AvatarFallback></Avatar>
          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div><div className="text-[10px] uppercase text-muted-foreground">Name</div><div className="mt-0.5 text-sm font-medium">{t.driver}</div></div>
            {driver && <div><div className="text-[10px] uppercase text-muted-foreground">Phone</div><div className="mt-0.5 flex items-center gap-1.5 text-sm font-medium"><Phone className="h-3 w-3 text-muted-foreground" />+234 803 000 0000</div></div>}
            {driver && <div><div className="text-[10px] uppercase text-muted-foreground">Licence No.</div><div className="mt-0.5 flex items-center gap-1.5 text-sm font-medium"><IdCard className="h-3 w-3 text-muted-foreground" />{driver.license}</div></div>}
            {driver && <div><div className="text-[10px] uppercase text-muted-foreground">Licence Expiry</div><div className="mt-0.5 flex items-center gap-1.5 text-sm font-medium"><Calendar className="h-3 w-3 text-muted-foreground" />{driver.licenseExpiry}</div></div>}
          </div>
        </div>
      </ProfileSection>
      <ProfileSection title="Current Assignment" icon={ClipboardList}>
        {active ? (
          <div className="space-y-3">
            <InfoGrid items={[
              ["Trip", <button key="tr" onClick={() => onOpen({ kind: "trip", id: active.id })} className="text-primary hover:underline">{active.id}</button>],
              ["Client", <button key="cl" onClick={() => { const c = active.customer; onOpen({ kind: "client", id: `CLI-${300 + ["ABC Stores","Dangote Cement","Chi Ltd","Konga","Jumia","MTN Nigeria","Nestlé NG","Shoprite","SPAR","Unilever"].indexOf(c) }` }); }} className="text-primary hover:underline">{active.customer}</button>],
              ["Pickup", active.origin], ["Destination", active.destination], ["Status", active.status],
            ]} />
            <div className="rounded-lg border border-border/60 bg-background/30 p-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <Info label={isManual ? "Last Known Location" : "Live Location"} icon={MapPin} value={lastLoc} />
              <Info label={isManual ? "Last Updated" : "GPS Timestamp"} icon={Clock} value="12m ago" />
              {!isManual && <Info label="Speed" icon={Gauge} value="52 km/h" />}
              <Info label="Tracking Source" icon={Satellite} value={isManual ? "Manual" : "GPS"} />
            </div>
          </div>
        ) : <p className="text-xs text-muted-foreground">No active trip assigned.</p>}
      </ProfileSection>
      <ProfileSection title="Operational Statistics" icon={TrendingUp}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile label="Total Trips" value={String(totalTrips)} icon={RouteIcon} />
          <StatTile label="Total Distance" value={`${(totalDist/1000).toFixed(1)}k km`} icon={Activity} />
          <StatTile label="Fuel Assigned" value={`${totalFuel.toLocaleString()} L`} icon={Fuel} />
          <StatTile label="Avg L/km" value={avgLkm ? avgLkm.toFixed(2) : "—"} icon={Fuel} />
          <StatTile label="Fuel Cost" value={naira(totalFuel * 980)} icon={DollarSign} />
          <StatTile label="Incidents" value={String(truckIncidents.length)} icon={ShieldAlert} />
          <StatTile label="Maintenance Records" value={String(truckMaint.length)} icon={Wrench} />
          <StatTile label="Engine Health" value={`${t.engineHealth}%`} icon={Gauge} />
        </div>
      </ProfileSection>
      <ProfileSection title="Maintenance Intelligence" icon={Wrench}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile label="Truck Health Score" value={`${getTruckHealthScore(t.id)}/100`} icon={Gauge} />
          <StatTile label="Avg Downtime" value={`${getAvgDowntime(t.id)}h`} icon={Clock} />
          <StatTile label="Avg Repair Cost" value={naira(getAvgRepairCost(t.id))} icon={DollarSign} />
          <StatTile label="MTBR" value={`${getMTBR(t.id)}d`} icon={Wrench} />
          <StatTile label="Maintenance Spend" value={naira(getMaintenanceSpend(t.id))} icon={DollarSign} />
        </div>
      </ProfileSection>
    </>
  );

  const tripsTab = (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <table className="w-full text-sm">
        <thead className="bg-elevated/70">
          <tr>{["Trip","Date","Client","Route","Driver","Distance","Revenue","Payment","Status"].map((h) => <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr>
        </thead>
        <tbody>
          {truckTrips.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-xs text-muted-foreground">No trips recorded.</td></tr>}
          {truckTrips.map((tp) => {
            const hist = tripFuelHistory.find((h) => h.tripId === tp.id);
            const routeId = getRouteFor(tp.origin, tp.destination)?.id;
            return (
              <tr key={tp.id} className="border-t border-border/60 hover:bg-white/[0.03]">
                <td className="px-4 py-3 text-xs"><button onClick={() => onOpen({ kind: "trip", id: tp.id })} className="font-semibold text-primary hover:underline">{tp.id}</button></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{tp.date}</td>
                <td className="px-4 py-3 text-xs">{tp.customer}</td>
                <td className="px-4 py-3 text-xs">{routeId ? <button onClick={() => onOpen({ kind: "route", id: routeId })} className="text-primary hover:underline">{tp.origin} → {tp.destination}</button> : `${tp.origin} → ${tp.destination}`}</td>
                <td className="px-4 py-3 text-xs">{tp.driver}</td>
                <td className="px-4 py-3 text-xs">{tp.distance} km</td>
                <td className="px-4 py-3 text-xs font-semibold text-foreground">{naira(tp.revenue)}</td>
                <td className="px-4 py-3"><Pill tone={tp.paymentStatus === "Paid" ? "success" : "warning"}>{tp.paymentStatus}</Pill></td>
                <td className="px-4 py-3"><Pill tone={tp.status === "Delivered" ? "success" : tp.status === "Delayed" ? "danger" : tp.status === "In Transit" ? "info" : "warning"}>{tp.status}</Pill></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const truckRevenue = truckTrips.reduce((s, tp) => s + tp.revenue, 0);
  const truckFuelTotal = truckTrips.reduce((s, tp) => s + tripFuelCost(tp), 0);
  const truckOtherExpTotal = truckTrips.reduce((s) => s + tripOtherExpenses(), 0);
  const truckMaintSpend = getMaintenanceSpend(t.id);
  const truckTolls = truckTrips.length * 15000;
  const truckDriverExp = truckTrips.length * 25000;
  const truckInsurance = 40000;
  const truckDepreciationRecord = getDepreciationForTruck(t.id);
  const truckDepreciationMonthly = truckDepreciationRecord ? depreciationCalculations(truckDepreciationRecord).monthly : 0;
  const truckDepreciationAllocated = truckTrips.reduce((s, tp) => s + (getDepreciationForTrip(tp)?.perTrip ?? 0), 0);
  const truckExpensesExclDep = truckFuelTotal + truckMaintSpend + truckTolls + truckDriverExp + truckOtherExpTotal + truckInsurance;
  const truckTotalExpenses = truckExpensesExclDep + truckDepreciationAllocated;
  const truckGrossProfit = truckRevenue - truckExpensesExclDep;
  const truckNetProfit = truckRevenue - truckTotalExpenses;
  const truckNetMargin = truckRevenue ? (truckNetProfit / truckRevenue) * 100 : 0;

  const accountsTab = (
    <>
      <ProfileSection title="Financial Summary" icon={Receipt}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <StatTile label="Revenue" value={naira(truckRevenue)} icon={DollarSign} />
          <StatTile label="Total Expenses" value={naira(truckTotalExpenses)} icon={Receipt} />
          <StatTile label="Gross Profit" value={naira(truckGrossProfit)} icon={TrendingUp} />
          <StatTile label="Depreciation" value={naira(truckDepreciationAllocated)} icon={Wrench} muted />
          <StatTile label="Net Profit" value={naira(truckNetProfit)} icon={DollarSign} />
          <StatTile label="Net Margin" value={`${truckNetMargin.toFixed(1)}%`} icon={Percent} />
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">Gross Profit excludes depreciation. Net Profit includes depreciation. Total Expenses includes depreciation.</p>
      </ProfileSection>
      <ProfileSection title="Revenue by Trip" icon={DollarSign}>
        <div className="overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-elevated/70">
              <tr>{["Trip","Date","Client","Revenue","Expenses","Payment"].map((h) => <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr>
            </thead>
            <tbody>
              {truckTrips.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-xs text-muted-foreground">No trips recorded.</td></tr>}
              {truckTrips.map((tp) => (
                <tr key={tp.id} className="border-t border-border/60 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-xs"><button onClick={() => onOpen({ kind: "trip", id: tp.id })} className="font-semibold text-primary hover:underline">{tp.id}</button></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{tp.date}</td>
                  <td className="px-4 py-3 text-xs">{tp.customer}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-foreground">{naira(tp.revenue)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{naira(tripFuelCost(tp) + tripOtherExpenses())}</td>
                  <td className="px-4 py-3"><Pill tone={tp.paymentStatus === "Paid" ? "success" : "warning"}>{tp.paymentStatus}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ProfileSection>
      <ProfileSection title="Expenses by Category" icon={Receipt}>
        <div className="space-y-3">
          <ExpenseLine label="Diesel / Fuel" amount={truckFuelTotal} total={truckTotalExpenses} />
          <ExpenseLine label="Maintenance" amount={truckMaintSpend} total={truckTotalExpenses} />
          <ExpenseLine label="Tolls" amount={truckTolls} total={truckTotalExpenses} />
          <ExpenseLine label="Driver Expenses" amount={truckDriverExp} total={truckTotalExpenses} />
          <ExpenseLine label="Other Trip Expenses" amount={truckOtherExpTotal} total={truckTotalExpenses} />
          <ExpenseLine label="Insurance" amount={truckInsurance} total={truckTotalExpenses} />
          <ExpenseLine label="Depreciation" amount={truckDepreciationAllocated} total={truckTotalExpenses} isDepreciation />
        </div>
        <div className="mt-4 flex justify-between border-t border-border/60 pt-3 text-sm">
          <span className="font-semibold text-foreground">Total Expenses</span>
          <span className="font-semibold text-foreground">{naira(truckTotalExpenses)}</span>
        </div>
      </ProfileSection>
      {truckDepreciationRecord && (
        <ProfileSection title="Depreciation" icon={Wrench}>
          <InfoGrid items={[
            ["Total Asset Cost", naira(depreciationCalculations(truckDepreciationRecord).cost)],
            ["Monthly Depreciation", naira(truckDepreciationMonthly)],
            ["Allocated to Trips", naira(truckDepreciationAllocated)],
            ["Depreciation Period", `${truckDepreciationRecord.depreciationPeriod} months`],
          ]} />
        </ProfileSection>
      )}
      <ProfileSection title="Profitability" icon={TrendingUp}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile label="Revenue" value={naira(truckRevenue)} icon={DollarSign} />
          <StatTile label="Gross Profit" value={naira(truckGrossProfit)} icon={TrendingUp} />
          <StatTile label="Net Profit" value={naira(truckNetProfit)} icon={DollarSign} />
          <StatTile label="Net Margin" value={`${truckNetMargin.toFixed(1)}%`} icon={Percent} />
        </div>
      </ProfileSection>
    </>
  );

  const maintTab = (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <table className="w-full text-sm">
        <thead className="bg-elevated/70">
          <tr>{["Date","Service","Status","Cost","Performed By"].map((h) => <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr>
        </thead>
        <tbody>
          {truckMaint.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-xs text-muted-foreground">No maintenance recorded.</td></tr>}
          {truckMaint.map((m) => (
            <tr key={m.id} className="border-t border-border/60">
              <td className="px-4 py-3 text-xs">{m.date}</td>
              <td className="px-4 py-3 text-xs">{m.service}</td>
              <td className="px-4 py-3"><Pill tone={m.status === "Completed" ? "success" : m.status === "Overdue" ? "danger" : m.status === "In Workshop" ? "warning" : "info"}>{m.status}</Pill></td>
              <td className="px-4 py-3 text-xs">{naira(m.cost)}</td>
              <td className="px-4 py-3 text-xs">{m.performedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const incidentsTab = (
    <div className="space-y-2">
      {truckIncidents.length === 0 && <p className="text-xs text-muted-foreground">No incidents on record.</p>}
      {truckIncidents.map((i) => (
        <button key={i.id} onClick={() => onOpen({ kind: "incident", id: i.id })} className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/30 p-3 hover:border-danger/40">
          <div className="text-left">
            <div className="text-sm font-medium text-primary">{i.id} · {i.type}</div>
            <div className="text-xs text-muted-foreground">{i.date} · {i.location} · {i.rootCause}</div>
          </div>
          <Pill tone={i.severity === "Critical" ? "purple" : i.severity === "High" ? "danger" : i.severity === "Moderate" ? "warning" : "info"}>{i.severity}</Pill>
        </button>
      ))}
    </div>
  );

  return (
    <>
      <ProfileHeader
        onBack={onBack}
        icon={<TruckIcon className="h-6 w-6 text-primary" />}
        title={`${t.id} · ${t.plate}`}
        subtitle={<><span>{t.model}</span><Circle className="h-1 w-1 fill-muted-foreground" /></>}
        statusTone={opStatusTone}
        statusLabel={t.status}
        actions={
          <Button
            size="sm"
            variant="outline"
            className={archived ? "border-success/40 text-success" : "border-warning/40 text-warning"}
            onClick={() => {
              setArchived((v) => !v);
              toast.success(archived ? `${t.plate} restored to active fleet` : `${t.plate} archived — removed from active trucks`);
            }}
          >
            {archived ? <ArchiveRestore className="mr-1.5 h-3.5 w-3.5" /> : <Archive className="mr-1.5 h-3.5 w-3.5" />}
            {archived ? "Unarchive" : "Archive"}
          </Button>
        }
      />
      <ProfileTabs defaultValue="overview" tabs={[
        { value: "overview", label: "Overview", content: overviewTab },
        { value: "accounts", label: "Accounts", content: accountsTab },
        { value: "trips", label: "Trip History", content: tripsTab },
        { value: "maintenance", label: "Maintenance", content: maintTab },
        { value: "incidents", label: "Incidents", content: incidentsTab },
        { value: "documents", label: "Documents", content: <DocumentsGrid docs={[
          { name: "Vehicle Registration", expiry: "2027-03-14", status: "Valid" },
          { name: "Insurance Certificate", expiry: "2026-11-02", status: "Expiring" },
          { name: "Road Worthiness", expiry: "2026-09-30", status: "Valid" },
          { name: "Inspection Certificate", expiry: "2026-08-18", status: "Valid" },
        ]} onUpload={() => setUploadOpen(true)} /> },
        { value: "notes", label: "Notes", content: <CollaborationPanel entityType="truck" entityId={id} className="px-1 py-2" /> },
      ]} />

      <DocumentUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} entityType="truck" />
      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} fields={[
        { key: "id", label: "Truck Number", value: t.id },
        { key: "plate", label: "Registration", value: t.plate },
        { key: "model", label: "Model", value: t.model },
        { key: "odometer", label: "Odometer (km)", value: String(t.odometer) },
        { key: "trackingNumber", label: "Tracking Number", value: t.trackingNumber || "" },
        { key: "lastService", label: "Last Service", value: t.lastService },
      ]} />
    </>
  );
}

function Info({ label, icon: Icon, value }: { label: string; icon: React.ElementType; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 flex items-center gap-1.5 text-sm font-medium"><Icon className="h-3 w-3 text-muted-foreground" />{value}</div>
    </div>
  );
}
