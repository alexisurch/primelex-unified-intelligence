import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, ListFilter as Filter, WalletCards, ReceiptText, TrendingUp, CircleDollarSign, Percent, Info } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { Header } from "@/components/layout/Header";
import { GlassCard, KPICard, SectionCard } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { trips, tripFuelHistory, maintenanceRecords, type Trip } from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/accounts/pnl")({ component: Pnl });

type FinancialTrip = Trip & { revenue?: number; fuelCost?: number; otherExpenses?: number; date?: string };
type Range = "today" | "week" | "month" | "last-month" | "quarter" | "year" | "custom";

type ProfitRow = {
  trip: FinancialTrip;
  revenue: number;
  expenses: number;
  profit: number;
};

const currency = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
const colors = ["hsl(var(--info))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--danger))", "hsl(var(--purple))", "hsl(var(--muted-foreground))"];

function Pnl() {
  const { open } = useProfileDrawer();
  const [range, setRange] = useState<Range>("year");
  const [showFilter, setShowFilter] = useState(false);
  const [status, setStatus] = useState<"all" | "Delivered">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const financialTrips = trips as FinancialTrip[];
  const selectedTrips = useMemo(() => financialTrips.filter((trip) => {
    if (status === "Delivered" && trip.status !== "Delivered") return false;
    if (!trip.revenue || !trip.date) return false;
    const date = new Date(trip.date);
    const now = new Date();
    const start = new Date(now);
    if (range === "today") start.setHours(0, 0, 0, 0);
    if (range === "week") start.setDate(now.getDate() - 7);
    if (range === "month") start.setMonth(now.getMonth() - 1);
    if (range === "last-month") { start.setMonth(now.getMonth() - 2); now.setMonth(now.getMonth() - 1); }
    if (range === "quarter") start.setMonth(now.getMonth() - 3);
    if (range === "year") start.setFullYear(now.getFullYear() - 1);
    if (range === "custom" && from && date < new Date(from)) return false;
    if (range === "custom" && to && date > new Date(`${to}T23:59:59`)) return false;
    return range === "custom" || date >= start && date <= now;
  }), [financialTrips, range, status, from, to]);

  const rows = useMemo<ProfitRow[]>(() => selectedTrips.map((trip) => {
    const fuel = tripFuelHistory.filter((record) => record.tripId === trip.id).reduce((sum, record) => sum + record.fuelCostNGN, 0);
    const maintenance = maintenanceRecords.filter((record) => record.truck === trip.truck && record.status === "Completed").reduce((sum, record) => sum + record.cost, 0);
    const expenses = (trip.fuelCost ?? fuel) + maintenance + (trip.otherExpenses ?? 0);
    return { trip, revenue: trip.revenue ?? 0, expenses, profit: (trip.revenue ?? 0) - expenses };
  }), [selectedTrips]);

  const totals = useMemo(() => rows.reduce((sum, row) => ({ revenue: sum.revenue + row.revenue, expenses: sum.expenses + row.expenses, profit: sum.profit + row.profit }), { revenue: 0, expenses: 0, profit: 0 }), [rows]);
  const hasData = rows.length > 0;
  const margin = totals.revenue ? (totals.profit / totals.revenue) * 100 : 0;
  const costBreakdown = useMemo(() => {
    const fuel = rows.reduce((sum, row) => sum + (row.trip.fuelCost ?? tripFuelHistory.filter((record) => record.tripId === row.trip.id).reduce((inner, record) => inner + record.fuelCostNGN, 0)), 0);
    const maintenance = rows.reduce((sum, row) => sum + maintenanceRecords.filter((record) => record.truck === row.trip.truck && record.status === "Completed").reduce((inner, record) => inner + record.cost, 0), 0);
    return [{ name: "Diesel / Fuel", value: fuel }, { name: "Maintenance", value: maintenance }, { name: "Other", value: Math.max(0, totals.expenses - fuel - maintenance) }].filter((item) => item.value > 0);
  }, [rows, totals.expenses]);
  const trend = useMemo(() => rows.reduce<Array<{ label: string; revenue: number; expenses: number }>>((items, row) => {
    const label = row.trip.date?.slice(0, 7) ?? "Unknown";
    const item = items.find((entry) => entry.label === label);
    if (item) { item.revenue += row.revenue; item.expenses += row.expenses; } else items.push({ label, revenue: row.revenue, expenses: row.expenses });
    return items;
  }, []), [rows]);

  function exportRows() {
    if (!hasData) { toast.info("No financial data is available for this period"); return; }
    const csv = ["Trip ID,Client,Truck,Revenue,Expenses,Profit", ...rows.map((row) => `${row.trip.id},${row.trip.customer},${row.trip.truck},${row.revenue},${row.expenses},${row.profit}`)].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "p-and-l.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return <>
    <Header title="P&L" subtitle="Financial performance and profitability overview." actions={<div className="flex flex-wrap items-center gap-2">
      <Select value={range} onValueChange={(value) => setRange(value as Range)}><SelectTrigger className="h-9 w-[190px] border-border bg-elevated/60 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="today">Today</SelectItem><SelectItem value="week">This Week</SelectItem><SelectItem value="month">This Month</SelectItem><SelectItem value="last-month">Last Month</SelectItem><SelectItem value="quarter">This Quarter</SelectItem><SelectItem value="year">This Year</SelectItem><SelectItem value="custom">Custom Range</SelectItem></SelectContent></Select>
      <Button variant="outline" size="sm" className="border-border bg-elevated/60" onClick={() => setShowFilter((value) => !value)}><Filter className="mr-1.5 h-3.5 w-3.5" />Filter</Button>
      <Button variant="outline" size="sm" className="border-border bg-elevated/60" onClick={exportRows}><Download className="mr-1.5 h-3.5 w-3.5" />Export</Button>
    </div>} />
    <div className="space-y-6 p-8">
      {showFilter && <GlassCard className="flex flex-wrap items-center gap-3 p-4"><Select value={status} onValueChange={(value) => setStatus(value as "all" | "Delivered")}><SelectTrigger className="h-9 w-44 bg-elevated/60 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All trip statuses</SelectItem><SelectItem value="Delivered">Delivered only</SelectItem></SelectContent></Select>{range === "custom" && <><Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="h-9 w-40 bg-elevated/60 text-xs" /><Input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="h-9 w-40 bg-elevated/60 text-xs" /></>}</GlassCard>}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <KPICard label="Total Revenue" value={hasData ? currency.format(totals.revenue) : "—"} icon={WalletCards} tone="success" footnote={hasData ? `${rows.length} trips in period` : "No financial data"} />
        <KPICard label="Total Expenses" value={hasData ? currency.format(totals.expenses) : "—"} icon={ReceiptText} tone="danger" footnote={hasData ? "Direct and allocated costs" : "No financial data"} />
        <KPICard label="Gross Profit" value={hasData ? currency.format(totals.profit) : "—"} icon={TrendingUp} tone="info" footnote={hasData ? "Revenue less direct costs" : "Awaiting revenue"} />
        <KPICard label="Net Profit" value={hasData ? currency.format(totals.profit) : "—"} icon={CircleDollarSign} tone="success" footnote={hasData ? "Before configured overheads" : "Awaiting revenue"} />
        <KPICard label="Net Profit Margin" value={hasData ? `${margin.toFixed(1)}%` : "—"} icon={Percent} tone="purple" footnote={hasData ? "Based on available records" : "No financial data"} />
      </div>
      {!hasData ? <GlassCard className="flex min-h-[360px] flex-col items-center justify-center text-center"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-info/15"><Info className="h-7 w-7 text-info" /></div><h2 className="mt-4 text-lg font-semibold">No financial data available for this period</h2><p className="mt-2 max-w-md text-sm text-muted-foreground">Revenue has not been recorded against trips in the selected range. Once trip revenue is available, this page will calculate profitability from the underlying operational records.</p></GlassCard> : <>
        <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]"><SectionCard title="Revenue vs Expenses Trend" action={<span className="text-xs text-muted-foreground">Values in Nigerian Naira</span>}><ResponsiveContainer width="100%" height={280}><AreaChart data={trend}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(value) => `${Math.round(value / 1000000)}M`} /><Tooltip formatter={(value: number) => currency.format(value)} /><Legend /><Area type="monotone" dataKey="revenue" stroke="hsl(var(--info))" fill="url(#revenueFill)" strokeWidth={2} /><Area type="monotone" dataKey="expenses" stroke="hsl(var(--danger))" fill="none" strokeWidth={2} /></AreaChart></ResponsiveContainer></SectionCard><SectionCard title="Cost Breakdown" action={<span className="text-xs text-muted-foreground">{currency.format(totals.expenses)} total</span>}><div className="flex items-center gap-5"><ResponsiveContainer width="48%" height={230}><PieChart><Pie data={costBreakdown} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={3}>{costBreakdown.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}</Pie><Tooltip formatter={(value: number) => currency.format(value)} /></PieChart></ResponsiveContainer><div className="space-y-3 text-xs">{costBreakdown.map((item, index) => <div key={item.name} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} /><span className="text-muted-foreground">{item.name}</span><strong className="ml-auto pl-3 text-foreground">{currency.format(item.value)}</strong></div>)}</div></div></SectionCard></div>
        <div className="grid gap-6 xl:grid-cols-3">{(["trip", "client", "truck"] as const).map((kind) => <ProfitabilityTable key={kind} kind={kind} rows={rows} onOpen={open} />)}</div>
      </>}
    </div>
  </>;
}

function ProfitabilityTable({ kind, rows, onOpen }: { kind: "trip" | "client" | "truck"; rows: ProfitRow[]; onOpen: (target: { kind: "trip" | "client" | "truck"; id: string }) => void }) {
  const title = kind === "trip" ? "Trip Profitability" : kind === "client" ? "Client Profitability" : "Truck Profitability";
  const grouped = kind === "trip" ? rows.map((row) => ({ name: row.trip.id, secondary: row.trip.customer, revenue: row.revenue, expenses: row.expenses, profit: row.profit })) : Object.values(rows.reduce<Record<string, { name: string; secondary: string; revenue: number; expenses: number; profit: number }>>((result, row) => { const name = kind === "client" ? row.trip.customer : row.trip.truck; const current = result[name] ?? { name, secondary: kind === "client" ? "Client" : "Trips", revenue: 0, expenses: 0, profit: 0 }; current.revenue += row.revenue; current.expenses += row.expenses; current.profit += row.profit; result[name] = current; return result; }, {}));
  return <SectionCard title={`${title} (Top 5)`} action={<Button variant="outline" size="sm" className="h-7 border-primary/50 px-2 text-[11px] text-primary">View all</Button>}><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-b border-border/50 text-muted-foreground"><tr><th className="pb-3 font-medium">{kind === "trip" ? "Trip ID" : kind === "client" ? "Client" : "Truck"}</th><th className="pb-3 text-right font-medium">Revenue</th><th className="pb-3 text-right font-medium">Expenses</th><th className="pb-3 text-right font-medium">Profit</th></tr></thead><tbody>{grouped.slice(0, 5).map((row) => <tr key={row.name} className="border-b border-border/30 last:border-0"><td className="py-3"><button className="font-medium text-primary hover:underline" onClick={() => onOpen({ kind, id: row.name })}>{row.name}</button><div className="text-[10px] text-muted-foreground">{row.secondary}</div></td><td className="py-3 text-right">{currency.format(row.revenue)}</td><td className="py-3 text-right">{currency.format(row.expenses)}</td><td className="py-3 text-right font-semibold text-success">{currency.format(row.profit)}</td></tr>)}</tbody></table></div>{grouped.length === 0 && <p className="py-10 text-center text-xs text-muted-foreground">No profitability records in this period.</p>}</SectionCard>;
}
