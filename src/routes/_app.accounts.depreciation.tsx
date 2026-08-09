import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarDays, Check, CreditCard, FileText, ListFilter as Filter, PackagePlus, Pencil, Plus, Search, Truck as TruckIcon, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { GlassCard, Pill } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trucks } from "@/lib/mock-data";
import { ProfileLink } from "@/lib/profile-drawer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/accounts/depreciation")({ component: DepreciationPage });

type TabKey = "monthly" | "cost" | "balance";
type StatusFilter = "all" | "active" | "fully-depreciated";

type DepreciationRecord = {
  id: string;
  truckId: string;
  purchaseDate: string;
  firstTripDate: string;
  tractorAmount: number;
  shippingCost: number;
  clearingCost: number;
  depreciationPeriod: number;
};

type FormValues = Omit<DepreciationRecord, "id">;

const asOfDate = new Date("2026-08-09T12:00:00");
const money = (value: number) => `₦${Math.round(value).toLocaleString("en-NG")}`;
const dateLabel = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const initialRecords: DepreciationRecord[] = trucks.slice(0, 5).map((truck, index) => ({
  id: `DEP-${100 + index}`,
  truckId: truck.id,
  purchaseDate: ["2024-11-06", "2025-10-05", "2025-10-05", "2026-05-14", "2026-05-14"][index],
  firstTripDate: ["2024-12-17", "2025-11-06", "2025-11-06", "2026-06-16", "2026-06-13"][index],
  tractorAmount: [25810000, 29850000, 29850000, 68000000, 68000000][index],
  shippingCost: [7440400, 0, 34000000, 0, 0][index],
  clearingCost: [1668393, 6000000, 6000000, 0, 0][index],
  depreciationPeriod: 24,
}));

function totalCost(record: FormValues): number {
  return record.tractorAmount + record.shippingCost + record.clearingCost;
}

function monthDifference(startValue: string, endValue: Date): number {
  const start = new Date(`${startValue}T00:00:00`);
  if (Number.isNaN(start.getTime()) || start > endValue) return 0;
  return Math.max(0, (endValue.getFullYear() - start.getFullYear()) * 12 + endValue.getMonth() - start.getMonth());
}

function calculations(record: FormValues) {
  const cost = totalCost(record);
  const period = Math.max(1, record.depreciationPeriod || 1);
  const monthly = cost / period;
  const elapsed = Math.min(period, monthDifference(record.firstTripDate, asOfDate));
  const depreciation = Math.min(cost, monthly * elapsed);
  return {
    cost,
    monthly,
    elapsed,
    depreciation,
    balance: Math.max(0, cost - depreciation),
    balanceMonths: Math.max(0, period - elapsed),
  };
}

function DepreciationPage() {
  const [records, setRecords] = useState<DepreciationRecord[]>(initialRecords);
  const [tab, setTab] = useState<TabKey>("monthly");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DepreciationRecord | null>(null);

  const availableTrucks = useMemo(() => {
    const linked = new Set(records.map((record) => record.truckId));
    return trucks.filter((truck) => !linked.has(truck.id));
  }, [records]);

  const filteredRecords = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return records.filter((record) => {
      const values = calculations(record);
      const matchesSearch = !needle || record.truckId.toLowerCase().includes(needle);
      const matchesStatus =
        status === "all" ||
        (status === "active" && values.balanceMonths > 0) ||
        (status === "fully-depreciated" && values.balanceMonths === 0);
      return matchesSearch && matchesStatus;
    });
  }, [records, search, status]);

  const summary = useMemo(() => {
    const values = records.map(calculations);
    const totalPurchase = values.reduce((sum, value) => sum + value.cost, 0);
    const totalDepreciation = values.reduce((sum, value) => sum + value.depreciation, 0);
    const currentMonth = records.reduce((sum, record) => {
      const value = calculations(record);
      return sum + (value.balanceMonths > 0 ? value.monthly : 0);
    }, 0);
    return {
      assets: records.length,
      totalPurchase,
      totalDepreciation,
      netBookValue: totalPurchase - totalDepreciation,
      currentMonth,
    };
  }, [records]);

  const openAdd = () => {
    setEditingRecord(null);
    setDialogOpen(true);
  };

  const openEdit = (record: DepreciationRecord) => {
    setEditingRecord(record);
    setDialogOpen(true);
  };

  const saveRecord = (values: FormValues) => {
    if (editingRecord) {
      setRecords((current) => current.map((record) => (record.id === editingRecord.id ? { ...values, id: record.id } : record)));
    } else {
      setRecords((current) => [...current, { ...values, id: `DEP-${Date.now()}` }]);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <Header
        title="Depreciation"
        subtitle="Manage truck depreciation and asset value over time."
        actions={
          <Button onClick={openAdd} className="h-9 bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Asset
          </Button>
        }
      />
      <main className="space-y-5 p-8">
        <SummaryCards summary={summary} />

        <div className="flex items-center gap-1 overflow-x-auto border-b border-border/60">
          <TabButton active={tab === "monthly"} number="1" onClick={() => setTab("monthly")}>Monthly Dep</TabButton>
          <TabButton active={tab === "cost"} number="2" onClick={() => setTab("cost")}>Cost</TabButton>
          <TabButton active={tab === "balance"} number="3" onClick={() => setTab("balance")}>Balance Dep</TabButton>
        </div>

        <GlassCard className="overflow-hidden p-0" hover={false}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 px-5 py-4">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">{tabTitle(tab)}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{tabDescription(tab)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search truck ID…" className="h-9 w-[190px] border-border bg-elevated/60 pl-9 text-xs" />
              </div>
              <Select value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
                <SelectTrigger className="h-9 w-[145px] border-border bg-elevated/60 text-xs">
                  <Filter className="mr-1.5 h-3.5 w-3.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="fully-depreciated">Fully Depreciated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredRecords.length ? (
            <DepreciationTable tab={tab} records={filteredRecords} onEdit={openEdit} />
          ) : (
            <EmptyState search={Boolean(search || status !== "all")} onAdd={openAdd} />
          )}
          <div className="border-t border-border/60 px-5 py-3 text-xs text-muted-foreground">
            Showing {filteredRecords.length} of {records.length} asset{records.length === 1 ? "" : "s"}
          </div>
        </GlassCard>
      </main>

      <AssetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        record={editingRecord}
        availableTrucks={availableTrucks}
        onSave={saveRecord}
      />
    </>
  );
}

function SummaryCards({ summary }: { summary: { assets: number; totalPurchase: number; totalDepreciation: number; netBookValue: number; currentMonth: number } }) {
  const cards = [
    { label: "Total Assets", value: String(summary.assets), note: "Linked fleet assets", icon: TruckIcon, tone: "bg-info/15 text-info" },
    { label: "Total Purchase Value", value: compactMoney(summary.totalPurchase), note: "All time", icon: PackagePlus, tone: "bg-success/15 text-success" },
    { label: "Total Depreciation", value: compactMoney(summary.totalDepreciation), note: "Accumulated", icon: FileText, tone: "bg-purple/15 text-purple" },
    { label: "Net Book Value", value: compactMoney(summary.netBookValue), note: "Current", icon: CreditCard, tone: "bg-warning/15 text-warning" },
    { label: "This Month Depreciation", value: compactMoney(summary.currentMonth), note: "Current schedule", icon: CalendarDays, tone: "bg-teal-500/15 text-teal-400" },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(({ label, value, note, icon: Icon, tone }) => (
        <GlassCard key={label} className="min-h-[104px] p-4" hover={false}>
          <div className="flex items-start gap-3">
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tone)}><Icon className="h-5 w-5" /></div>
            <div className="min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
              <div className="mt-1 text-[22px] font-semibold leading-none tracking-tight text-foreground">{value}</div>
              <div className="mt-2 text-[11px] text-muted-foreground">{note}</div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

function TabButton({ active, number, onClick, children }: { active: boolean; number: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex h-10 items-center gap-2 whitespace-nowrap border-b-2 px-5 text-xs font-medium transition-colors", active ? "border-primary bg-primary/10 text-primary" : "border-transparent text-muted-foreground hover:bg-elevated/40 hover:text-foreground")}>
      <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{number}</span>
      {children}
    </button>
  );
}

function DepreciationTable({ tab, records, onEdit }: { tab: TabKey; records: DepreciationRecord[]; onEdit: (record: DepreciationRecord) => void }) {
  const columns = tab === "monthly"
    ? ["Truck ID", "Total Cost (₦)", "Total Number of Months", "Total Depreciation (₦)", "Monthly Depreciation (₦)", "Actions"]
    : tab === "cost"
      ? ["Truck ID", "Purchase Date", "Tractor Amount (₦)", "Shipping Cost (₦)", "Clearing Cost (₦)", "Total Cost (₦)", "Actions"]
      : ["Truck ID", "Purchase Date", "First Trip Date", "Total Cost (₦)", "Total Depreciation (₦)", "Balance (₦)", "Bal in Months", "Actions"];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-sm">
        <thead className="bg-elevated/70">
          <tr>{columns.map((column) => <th key={column} className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{column}</th>)}</tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const values = calculations(record);
            return <TableRow key={record.id} tab={tab} record={record} values={values} onEdit={onEdit} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({ tab, record, values, onEdit }: { tab: TabKey; record: DepreciationRecord; values: ReturnType<typeof calculations>; onEdit: (record: DepreciationRecord) => void }) {
  const cell = (content: React.ReactNode, className?: string) => <td className={cn("whitespace-nowrap border-t border-border/60 px-5 py-3.5 text-[12px] text-foreground", className)}>{content}</td>;
  const action = <td className="border-t border-border/60 px-5 py-3.5"><Button variant="outline" size="icon" className="h-7 w-7 border-border bg-elevated/60" onClick={() => onEdit(record)} aria-label={`Edit ${record.truckId}`}><Pencil className="h-3.5 w-3.5 text-primary" /></Button></td>;
  const truckCell = <ProfileLink kind="truck" id={record.truckId} className="font-semibold text-primary hover:underline">{record.truckId}</ProfileLink>;
  if (tab === "monthly") return <tr className="transition-colors hover:bg-white/[0.03]">{cell(truckCell)}{cell(money(values.cost), "font-semibold text-success")}{cell(record.depreciationPeriod, "text-center")}{cell(money(values.depreciation), "font-semibold text-success")}{cell(money(values.monthly), "font-semibold text-success")}{action}</tr>;
  if (tab === "cost") return <tr className="transition-colors hover:bg-white/[0.03]">{cell(truckCell)}{cell(dateLabel(record.purchaseDate))}{cell(money(record.tractorAmount))}{cell(money(record.shippingCost))}{cell(money(record.clearingCost))}{cell(money(values.cost), "font-semibold text-success")}{action}</tr>;
  return <tr className="transition-colors hover:bg-white/[0.03]">{cell(truckCell)}{cell(dateLabel(record.purchaseDate))}{cell(dateLabel(record.firstTripDate))}{cell(money(values.cost), "font-semibold text-success")}{cell(money(values.depreciation), "font-semibold text-success")}{cell(money(values.balance), values.balance ? "font-semibold text-warning" : "font-semibold text-success")}{cell(values.balanceMonths, "text-center")}{action}</tr>;
}

function AssetDialog({ open, onOpenChange, record, availableTrucks, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; record: DepreciationRecord | null; availableTrucks: typeof trucks; onSave: (values: FormValues) => void }) {
  const emptyForm: FormValues = { truckId: availableTrucks[0]?.id ?? "", purchaseDate: "", firstTripDate: "", tractorAmount: 0, shippingCost: 0, clearingCost: 0, depreciationPeriod: 24 };
  const [values, setValues] = useState<FormValues>(record ? record : emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setError("");
      setValues(record ? record : emptyForm);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, record]);

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => setValues((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!values.truckId || !values.purchaseDate || !values.firstTripDate) return setError("Complete the truck and date fields before saving.");
    if (new Date(`${values.firstTripDate}T00:00:00`) < new Date(`${values.purchaseDate}T00:00:00`)) return setError("First Trip Date cannot be earlier than Purchase Date.");
    if (totalCost(values) <= 0) return setError("Enter at least one acquisition cost greater than zero.");
    if (values.depreciationPeriod <= 0) return setError("Depreciation Period must be greater than zero.");
    onSave(values);
  };

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{record ? "Edit Depreciation Record" : "Add Asset"}</DialogTitle><DialogDescription>Capture acquisition details and the depreciation schedule for this truck.</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="Truck ID" required><Select value={values.truckId} onValueChange={(value) => setField("truckId", value)} disabled={Boolean(record)}><SelectTrigger><SelectValue placeholder="Select truck" /></SelectTrigger><SelectContent>{availableTrucks.map((truck) => <SelectItem key={truck.id} value={truck.id}>{truck.id} · {truck.plate}</SelectItem>)}{record && !availableTrucks.some((truck) => truck.id === record.truckId) && <SelectItem value={record.truckId}>{record.truckId}</SelectItem>}</SelectContent></Select></Field><Field label="Depreciation Period (months)" required><Input type="number" min="1" value={values.depreciationPeriod || ""} onChange={(event) => setField("depreciationPeriod", Number(event.target.value))} /></Field><Field label="Purchase Date" required><Input type="date" value={values.purchaseDate} onChange={(event) => setField("purchaseDate", event.target.value)} /></Field><Field label="First Trip Date" required><Input type="date" value={values.firstTripDate} onChange={(event) => setField("firstTripDate", event.target.value)} /></Field></div><div><div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acquisition Cost</div><div className="grid gap-4 sm:grid-cols-3"><Field label="Tractor Amount" required><MoneyInput value={values.tractorAmount} onChange={(value) => setField("tractorAmount", value)} /></Field><Field label="Shipping Cost"><MoneyInput value={values.shippingCost} onChange={(value) => setField("shippingCost", value)} /></Field><Field label="Clearing Cost"><MoneyInput value={values.clearingCost} onChange={(value) => setField("clearingCost", value)} /></Field></div></div><CalculationPreview values={calculations(values)} />{error && <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger"><X className="h-3.5 w-3.5" />{error}</div>}<DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit"><Check className="mr-1.5 h-3.5 w-3.5" />{record ? "Save Changes" : "Add Asset"}</Button></DialogFooter></form></DialogContent></Dialog>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">{label}{required && <span className="ml-1 text-danger">*</span>}</label>{children}</div>; }
function MoneyInput({ value, onChange }: { value: number; onChange: (value: number) => void }) { return <Input type="number" min="0" value={value || ""} onChange={(event) => onChange(Math.max(0, Number(event.target.value)))} placeholder="0" />; }
function CalculationPreview({ values }: { values: ReturnType<typeof calculations> }) { return <div className="rounded-xl border border-primary/20 bg-primary/5 p-4"><div className="mb-3 flex items-center justify-between"><div className="text-xs font-semibold text-foreground">Calculated values</div><Pill tone="info">Automatic</Pill></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><PreviewItem label="Total Cost" value={money(values.cost)} /><PreviewItem label="Monthly Dep." value={money(values.monthly)} /><PreviewItem label="Balance" value={money(values.balance)} /><PreviewItem label="Bal. in Months" value={String(values.balanceMonths)} /></div></div>; }
function PreviewItem({ label, value }: { label: string; value: string }) { return <div><div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div><div className="mt-1 text-sm font-semibold text-foreground">{value}</div></div>; }
function EmptyState({ search, onAdd }: { search: boolean; onAdd: () => void }) { return <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><FileText className="h-6 w-6" /></div><p className="mt-4 text-sm font-medium text-foreground">{search ? "No matching depreciation records" : "No depreciation records have been added yet."}</p><p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">{search ? "Try another truck ID or clear the selected filter." : "Add an asset to begin tracking acquisition cost and value over time."}</p>{!search && <Button className="mt-5" onClick={onAdd}><Plus className="mr-1.5 h-3.5 w-3.5" />Add Asset</Button>}</div>; }
function tabTitle(tab: TabKey) { return tab === "monthly" ? "Monthly Depreciation" : tab === "cost" ? "Cost" : "Balance Depreciation"; }
function tabDescription(tab: TabKey) { return tab === "monthly" ? "View total cost, number of months and monthly depreciation for each truck." : tab === "cost" ? "View purchase and related costs for each truck." : "View depreciation balance and remaining months for each truck."; }
function compactMoney(value: number) { return value >= 1_000_000_000 ? `₦${(value / 1_000_000_000).toFixed(2)}B` : value >= 1_000_000 ? `₦${(value / 1_000_000).toFixed(2)}M` : money(value); }
