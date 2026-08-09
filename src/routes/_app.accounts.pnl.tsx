import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, CircleDollarSign, Download, ListFilter as Filter, Fuel, Percent, Receipt, Wrench } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { KPICard, SectionCard } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportCSV, fuelTransactions, maintenanceRecords } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/accounts/pnl")({ component: PnlPage });

type RangeKey = "today" | "week" | "month" | "last-month" | "quarter" | "year" | "custom";
type SourceKey = "all" | "fuel" | "maintenance";
type CostTone = "info" | "success" | "warning" | "purple" | "danger";
interface CostRow { id: string; name: string; amount: number; tone: CostTone }
interface DateRange { start: Date; end: Date; label: string }

const ranges: Array<{ value: RangeKey; label: string }> = [
  { value: "today", label: "Today" }, { value: "week", label: "This Week" }, { value: "month", label: "This Month" },
  { value: "last-month", label: "Last Month" }, { value: "quarter", label: "This Quarter" }, { value: "year", label: "This Year" }, { value: "custom", label: "Custom Range" },
];
const money = (value: number) => `₦${value.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
const day = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const endDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
const recordDate = (value: string) => new Date(`${value.slice(0, 10)}T00:00:00`);
const inputDate = (date: Date) => date.toISOString().slice(0, 10);

function getDateRange(key: RangeKey, customStart: string, customEnd: string): DateRange {
  const now = new Date("2026-08-09T12:00:00");
  const today = day(now);
  if (key === "custom") {
    const start = customStart ? new Date(`${customStart}T00:00:00`) : today;
    const end = customEnd ? endDay(new Date(`${customEnd}T00:00:00`)) : endDay(now);
    return { start, end, label: `${inputDate(start)} – ${inputDate(end)}` };
  }
  if (key === "today") return { start: today, end: endDay(now), label: "Today" };
  if (key === "week") { const start = new Date(today); start.setDate(today.getDate() - today.getDay()); return { start, end: endDay(now), label: "This Week" }; }
  if (key === "month") return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: endDay(now), label: "This Month" };
  if (key === "last-month") return { start: new Date(today.getFullYear(), today.getMonth() - 1, 1), end: new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59), label: "Last Month" };
  if (key === "quarter") { const startMonth = Math.floor(today.getMonth() / 3) * 3; return { start: new Date(today.getFullYear(), startMonth, 1), end: endDay(now), label: "This Quarter" }; }
  return { start: new Date(today.getFullYear(), 0, 1), end: endDay(now), label: "This Year" };
}

function PnlPage() {
  const [rangeKey, setRangeKey] = useState<RangeKey>("year");
  const [source, setSource] = useState<SourceKey>("all");
  const [customStart, setCustomStart] = useState("2026-05-01");
  const [customEnd, setCustomEnd] = useState("2026-08-09");
  const range = useMemo(() => getDateRange(rangeKey, customStart, customEnd), [rangeKey, customStart, customEnd]);
  const fuel = useMemo(() => fuelTransactions.filter((item) => recordDate(item.date) >= range.start && recordDate(item.date) <= range.end), [range]);
  const maintenance = useMemo(() => maintenanceRecords.filter((item) => item.status === "Completed" && recordDate(item.date) >= range.start && recordDate(item.date) <= range.end), [range]);
  const fuelTotal = source === "maintenance" ? 0 : fuel.reduce((sum, item) => sum + item.amount, 0);
  const maintenanceTotal = source === "fuel" ? 0 : maintenance.reduce((sum, item) => sum + item.cost, 0);
  const expenses = fuelTotal + maintenanceTotal;
  const rows: CostRow[] = [
    { id: "fuel", name: "Diesel / Fuel", amount: fuelTotal, tone: "info" },
    { id: "maintenance", name: "Maintenance", amount: maintenanceTotal, tone: "success" },
    { id: "tolls", name: "Tolls", amount: 0, tone: "warning" },
    { id: "driver", name: "Driver Expenses", amount: 0, tone: "purple" },
    { id: "other", name: "Other", amount: 0, tone: "danger" },
  ];
  const exportExpenses = () => exportCSV("pnl-expenses.csv", ["Category", "Amount", "Period"], rows.map((row) => [row.name, row.amount, range.label]));

  return <>
    <Header title="P&L" subtitle="Financial performance and profitability overview." actions={<div className="flex flex-wrap items-center justify-end gap-2">
      <Select value={rangeKey} onValueChange={(value) => setRangeKey(value as RangeKey)}><SelectTrigger className="h-9 w-[175px] border-border bg-elevated/60 text-xs"><SelectValue /></SelectTrigger><SelectContent>{ranges.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select>
      <Select value={source} onValueChange={(value) => setSource(value as SourceKey)}><SelectTrigger className="h-9 w-[135px] border-border bg-elevated/60 text-xs"><Filter className="mr-1.5 h-3.5 w-3.5" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All sources</SelectItem><SelectItem value="fuel">Fuel only</SelectItem><SelectItem value="maintenance">Maintenance only</SelectItem></SelectContent></Select>
      <Button variant="outline" size="sm" className="h-9 border-border bg-elevated/60 text-xs" onClick={exportExpenses}><Download className="mr-1.5 h-3.5 w-3.5" />Export</Button>
    </div>} />
    <main className="space-y-6 p-8">
      {rangeKey === "custom" && <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-elevated/30 p-4"><span className="text-xs font-medium text-muted-foreground">Custom period</span><Input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} className="h-9 w-auto bg-background/40 text-xs" /><span className="text-xs text-muted-foreground">to</span><Input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} className="h-9 w-auto bg-background/40 text-xs" /></div>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KPICard label="Total Revenue" value="—" icon={ArrowUp} tone="success" footnote="No revenue records available" />
        <KPICard label="Total Expenses" value={expenses ? money(expenses) : "—"} icon={ArrowDown} tone="danger" footnote={expenses ? range.label : "No expense records available"} />
        <KPICard label="Gross Profit" value="—" icon={CircleDollarSign} tone="info" footnote="Requires revenue data" />
        <KPICard label="Net Profit" value="—" icon={Receipt} tone="success" footnote="Requires revenue data" />
        <KPICard label="Net Profit Margin" value="—" icon={Percent} tone="purple" footnote="Requires revenue data" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_1fr]">
        <SectionCard title="Revenue vs Expenses Trend"><EmptyPanel icon={CircleDollarSign} title="Revenue data is not available for this period." detail="Expenses are aggregated from operational records. Revenue and profit are not estimated." /></SectionCard>
        <SectionCard title="Cost Breakdown"><div className="mb-4 text-xs text-muted-foreground">Total expenses: <span className="font-semibold text-foreground">{expenses ? money(expenses) : "—"}</span></div><div className="space-y-4">{rows.map((row) => <div key={row.id}><div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{row.name}</span><span className="font-medium text-foreground">{row.amount ? money(row.amount) : "—"}</span></div><div className="h-2 overflow-hidden rounded-full bg-background/70"><div className={cn("h-full rounded-full", row.tone === "info" ? "bg-info" : row.tone === "success" ? "bg-success" : row.tone === "warning" ? "bg-warning" : row.tone === "purple" ? "bg-purple" : "bg-danger")} style={{ width: `${expenses ? (row.amount / expenses) * 100 : 0}%` }} /></div></div>)}</div>{!expenses && <p className="mt-5 text-center text-xs text-muted-foreground">No financial data available for this period.</p>}</SectionCard>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3"><ProfitCard title="Trip Profitability" icon={Receipt} detail="Revenue data is required to calculate trip profit." /><ProfitCard title="Client Profitability" icon={CircleDollarSign} detail="Revenue data is required to calculate client margin." /><ProfitCard title="Truck Profitability" icon={Fuel} detail="Revenue data is required to calculate truck margin." /></div>
      <div className="flex flex-wrap justify-between gap-2 rounded-xl border border-border/60 bg-elevated/20 px-4 py-3 text-xs text-muted-foreground"><span>Gross Profit = Revenue − Direct Trip Costs</span><span>Net Profit = Gross Profit − Operating Costs</span><span>Revenue records not connected</span></div>
    </main>
  </>;
}

function EmptyPanel({ icon: Icon, title, detail }: { icon: typeof CircleDollarSign; title: string; detail: string }) { return <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-border/50 bg-background/20 px-6 text-center"><Icon className="h-9 w-9 text-muted-foreground/50" /><p className="mt-3 text-sm font-medium text-foreground">{title}</p><p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">{detail}</p></div>; }
function ProfitCard({ title, icon: Icon, detail }: { title: string; icon: typeof CircleDollarSign; detail: string }) { return <SectionCard title={`${title} (Top 5)`} action={<Button variant="outline" size="sm" className="h-8 border-border bg-elevated/60 text-xs" disabled>View all</Button>}><EmptyPanel icon={Icon} title="No profitability data available." detail={detail} /></SectionCard>; }
