import { Building2, Phone, Mail, MapPin, Wrench, DollarSign, FileText, TrendingUp, Activity, Circle } from "lucide-react";
import { useSuppliers } from "@/lib/suppliers-store";
import type { ProfileTarget } from "@/lib/profile-drawer";
import { ProfileHeader, ProfileSection, ProfileTabs, InfoGrid, StatTile, type Tone } from "./ProfileShell";
import { Pill } from "@/components/shared/Cards";
import { getPurchasesForSupplier, getMaintenanceForSupplier, getSupplierSpend, type MaintenanceRecord, type SupplierPurchase } from "@/lib/mock-data";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

const naira = (n: number) => "₦" + Math.round(n).toLocaleString();

export function SupplierProfile({ id, onOpen, onBack }: { id: string; onOpen: (t: ProfileTarget) => void; onBack?: () => void }) {
  const { getSupplier } = useSuppliers();
  const supplier = getSupplier(id);

  if (!supplier) return <div className="p-6 text-sm text-muted-foreground">Supplier not found.</div>;

  const purchases = getPurchasesForSupplier(supplier.id);
  const maintenanceRecords = getMaintenanceForSupplier(supplier.id);
  const totalSpend = getSupplierSpend(supplier.id);
  const avgTransaction = purchases.length ? totalSpend / purchases.length : 0;
  const lastTransaction = purchases.length ? purchases[purchases.length - 1].date : "—";
  const statusTone: Tone = supplier.status === "Active" ? "success" : "danger";

  return (
    <>
      <ProfileHeader
        onBack={onBack}
        icon={<Building2 className="h-6 w-6 text-primary" />}
        title={supplier.name}
        subtitle={<><span>{supplier.id}</span><Circle className="h-1 w-1 fill-muted-foreground" /><span>{supplier.type}</span></>}
        statusTone={statusTone}
        statusLabel={supplier.status}
      />
      <ProfileTabs defaultValue="overview" tabs={[
        { value: "overview", label: "Overview", content: (
          <>
            <ProfileSection title="Supplier Information" icon={Building2}>
              <InfoGrid items={[
                ["Supplier Name", supplier.name],
                ["Supplier Type", supplier.type],
                ["Contact Person", supplier.contactPerson],
                ["Phone", <span key="p" className="inline-flex items-center gap-1"><Phone className="h-3 w-3 text-muted-foreground" />{supplier.phone}</span>],
                ["Email", <span key="e" className="inline-flex items-center gap-1"><Mail className="h-3 w-3 text-muted-foreground" />{supplier.email}</span>],
                ["Address", <span key="a" className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{supplier.address}</span>],
                ["City", supplier.city],
                ["State", supplier.state],
                ["Status", supplier.status],
              ]} />
              {supplier.notes && (
                <div className="mt-4 rounded-lg border border-border/60 bg-background/30 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Notes</div>
                  <div className="mt-1 text-xs text-muted-foreground">{supplier.notes}</div>
                </div>
              )}
            </ProfileSection>
            <ProfileSection title="Financial Summary" icon={DollarSign}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <StatTile label="Total Spend" value={naira(totalSpend)} icon={DollarSign} />
                <StatTile label="Transactions" value={String(purchases.length)} icon={Activity} />
                <StatTile label="Avg Transaction" value={naira(avgTransaction)} icon={TrendingUp} />
                <StatTile label="Last Transaction" value={lastTransaction} icon={FileText} muted />
                <StatTile label="Maintenance Records" value={String(maintenanceRecords.length)} icon={Wrench} />
                <StatTile label="Status" value={supplier.status} icon={Circle} muted />
              </div>
            </ProfileSection>
          </>
        )},
        { value: "maintenance", label: "Maintenance", content: (
          <MaintenanceTab records={maintenanceRecords} onOpen={onOpen} />
        )},
        { value: "purchases", label: "Purchases", content: (
          <PurchasesTab purchases={purchases} onOpen={onOpen} />
        )},
      ]} />
    </>
  );
}

function MaintenanceTab({ records, onOpen }: { records: MaintenanceRecord[]; onOpen: (t: ProfileTarget) => void }) {
  if (records.length === 0) return <p className="text-xs text-muted-foreground">No maintenance records associated with this supplier.</p>;
  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <table className="w-full text-sm">
        <thead className="bg-elevated/70">
          <tr>{["Date", "Maintenance ID", "Truck", "Type", "Description", "Cost", "Status"].map((h) => (
            <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-t border-border/60 hover:bg-white/[0.03]">
              <td className="px-4 py-3 text-xs">{r.date}</td>
              <td className="px-4 py-3 text-xs font-medium text-primary">{r.id}</td>
              <td className="px-4 py-3 text-xs">
                <button onClick={() => onOpen({ kind: "truck", id: r.truck })} className="font-semibold text-primary hover:underline">{r.truck}</button>
              </td>
              <td className="px-4 py-3 text-xs"><Pill tone="info">{r.type}</Pill></td>
              <td className="px-4 py-3 text-xs"><div className="max-w-[200px] truncate">{r.service}</div></td>
              <td className="px-4 py-3 text-xs font-medium">{naira(r.cost)}</td>
              <td className="px-4 py-3"><Pill tone={r.status === "Completed" ? "success" : r.status === "Overdue" ? "danger" : r.status === "In Workshop" ? "warning" : "info"}>{r.status}</Pill></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PurchasesTab({ purchases, onOpen }: { purchases: SupplierPurchase[]; onOpen: (t: ProfileTarget) => void }) {
  const [search, setSearch] = useState("");
  const filtered = purchases.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.partItem.toLowerCase().includes(s) || p.truck.toLowerCase().includes(s) || p.id.toLowerCase().includes(s);
  });

  if (purchases.length === 0) return <p className="text-xs text-muted-foreground">No purchases recorded for this supplier.</p>;

  return (
    <div className="space-y-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search purchases..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 pl-9 text-xs" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-elevated/70">
            <tr>{["Date", "Part / Item", "Truck", "Qty", "Unit Cost", "Total Cost", "Maintenance Ref"].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border/60 hover:bg-white/[0.03]">
                <td className="px-4 py-3 text-xs">{p.date}</td>
                <td className="px-4 py-3 text-xs font-medium">{p.partItem}</td>
                <td className="px-4 py-3 text-xs">
                  <button onClick={() => onOpen({ kind: "truck", id: p.truck })} className="font-semibold text-primary hover:underline">{p.truck}</button>
                </td>
                <td className="px-4 py-3 text-xs">{p.quantity}</td>
                <td className="px-4 py-3 text-xs">{naira(p.unitCost)}</td>
                <td className="px-4 py-3 text-xs font-medium">{naira(p.totalCost)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{p.maintenanceId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
