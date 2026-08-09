import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CircleDollarSign,
  Download,
  Receipt,
  Percent,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Header } from "@/components/layout/Header";
import { KPICard, SectionCard, GlassCard } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { usePreferences } from "@/lib/preferences";
import {
  clients,
  exportCSV,
  trips as allTrips,
  tripFuelCost,
  tripOtherExpenses,
  getDepreciationForTrip,
  type Trip,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/accounts/pnl")({
  component: PnlPage,
});

type RangeKey =
  | "today"
  | "week"
  | "month"
  | "last-month"
  | "quarter"
  | "year"
  | "custom";
type TabKey = "trips" | "clients" | "trucks";
type CostTone = "info" | "success" | "warning" | "purple" | "danger";
interface CostRow {
  id: string;
  name: string;
  amount: number;
  tone: CostTone;
}
interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

const ranges: Array<{ value: RangeKey; label: string }> = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
];

const money = (value: number) =>
  `₦${value.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
const compactMoney = (value: number) =>
  value >= 1_000_000
    ? `₦${(value / 1_000_000).toFixed(1)}M`
    : value >= 1_000
      ? `₦${(value / 1_000).toFixed(0)}K`
      : `₦${value}`;
const day = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
const endDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
const recordDate = (value: string) => new Date(`${value.slice(0, 10)}T00:00:00`);
const inputDate = (date: Date) => date.toISOString().slice(0, 10);

function getDateRange(
  key: RangeKey,
  customStart: string,
  customEnd: string,
): DateRange {
  const now = new Date("2026-08-09T12:00:00");
  const today = day(now);
  if (key === "custom") {
    const start = customStart
      ? recordDate(customStart)
      : today;
    const end = customEnd ? endDay(recordDate(customEnd)) : endDay(now);
    return {
      start,
      end,
      label: `${inputDate(start)} – ${inputDate(end)}`,
    };
  }
  if (key === "today")
    return { start: today, end: endDay(now), label: "Today" };
  if (key === "week") {
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    return { start, end: endDay(now), label: "This Week" };
  }
  if (key === "month")
    return {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: endDay(now),
      label: "This Month",
    };
  if (key === "last-month")
    return {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(
        today.getFullYear(),
        today.getMonth(),
        0,
        23,
        59,
        59,
      ),
      label: "Last Month",
    };
  if (key === "quarter") {
    const startMonth = Math.floor(today.getMonth() / 3) * 3;
    return {
      start: new Date(today.getFullYear(), startMonth, 1),
      end: endDay(now),
      label: "This Quarter",
    };
  }
  return {
    start: new Date(today.getFullYear(), 0, 1),
    end: endDay(now),
    label: "This Year",
  };
}

function tripFuel(trip: Trip): number {
  return tripFuelCost(trip);
}
function tripDepreciation(trip: Trip): number {
  return getDepreciationForTrip(trip)?.perTrip ?? 0;
}
function tripExpensesExclDep(trip: Trip): number {
  return tripFuel(trip) + tripOtherExpenses();
}
function tripAllExpenses(trip: Trip): number {
  return tripExpensesExclDep(trip) + tripDepreciation(trip);
}
function tripProfit(trip: Trip): number {
  return trip.revenue - tripAllExpenses(trip);
}

const clientIdFor = (name: string) => clients.find((c) => c.name === name)?.id;

function PnlPage() {
  const { open } = useProfileDrawer();
  const { resolvedTheme } = usePreferences();
  const isDark = resolvedTheme === "dark";
  const gridStroke = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.08)";
  const axisColour = isDark ? "#94a3b8" : "#64748b";

  const [rangeKey, setRangeKey] = useState<RangeKey>("year");
  const [customStart, setCustomStart] = useState("2026-01-01");
  const [customEnd, setCustomEnd] = useState("2026-08-09");
  const [tab, setTab] = useState<TabKey>("trips");
  const [viewAll, setViewAll] = useState<TabKey | null>(null);

  const range = useMemo(
    () => getDateRange(rangeKey, customStart, customEnd),
    [rangeKey, customStart, customEnd],
  );

  const periodTrips = useMemo(
    () =>
      allTrips.filter((t) => {
        const d = recordDate(t.date);
        return d >= range.start && d <= range.end;
      }),
    [range],
  );

  const totalRevenue = periodTrips.reduce((s, t) => s + t.revenue, 0);
  const totalFuel = periodTrips.reduce((s, t) => s + tripFuel(t), 0);
  const totalOther = periodTrips.reduce(
    (s, t) => s + tripOtherExpenses(),
    0,
  );
  const totalDepreciation = periodTrips.reduce(
    (s, t) => s + tripDepreciation(t),
    0,
  );
  const expensesExclDep = totalFuel + totalOther;
  const totalExpenses = expensesExclDep + totalDepreciation;
  const grossProfit = totalRevenue - expensesExclDep;
  const netProfit = totalRevenue - totalExpenses;
  const netProfitMargin = totalRevenue
    ? (netProfit / totalRevenue) * 100
    : 0;
  const hasData = periodTrips.length > 0;

  const costRows: CostRow[] = [
    { id: "fuel", name: "Diesel / Fuel", amount: totalFuel, tone: "info" },
    {
      id: "maintenance",
      name: "Maintenance",
      amount: 0,
      tone: "success",
    },
    { id: "tolls", name: "Tolls", amount: 0, tone: "warning" },
    {
      id: "driver",
      name: "Driver Expenses",
      amount: 0,
      tone: "purple",
    },
    {
      id: "other-trip",
      name: "Other Trip Expenses",
      amount: totalOther,
      tone: "danger",
    },
    {
      id: "depreciation",
      name: "Depreciation",
      amount: totalDepreciation,
      tone: "info",
    },
    {
      id: "other-op",
      name: "Other Operating Expenses",
      amount: 0,
      tone: "success",
    },
  ];

  const trendData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
    ];
    const buckets = months.map((m) => ({
      label: m,
      revenue: 0,
      expenses: 0,
    }));
    periodTrips.forEach((t) => {
      const m = recordDate(t.date).getMonth();
      if (m < 8) {
        buckets[m].revenue += t.revenue;
        buckets[m].expenses += tripAllExpenses(t);
      }
    });
    return buckets;
  }, [periodTrips]);

  const tripRows = useMemo(
    () =>
      periodTrips
        .map((t) => ({
          ...t,
          profit: tripProfit(t),
        }))
        .sort((a, b) => b.profit - a.profit),
    [periodTrips],
  );
  const topTrips = tripRows.slice(0, 5);

  const clientRows = useMemo(() => {
    const map = new Map<string, number>();
    periodTrips.forEach((t) =>
      map.set(t.customer, (map.get(t.customer) ?? 0) + t.revenue),
    );
    return Array.from(map.entries())
      .map(([name, revenue]) => ({ id: name, name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [periodTrips]);
  const topClients = clientRows.slice(0, 5);

  const truckRows = useMemo(() => {
    const map = new Map<
      string,
      { trips: number; revenue: number; expenses: number }
    >();
    periodTrips.forEach((t) => {
      const entry = map.get(t.truck) ?? {
        trips: 0,
        revenue: 0,
        expenses: 0,
      };
      entry.trips += 1;
      entry.revenue += t.revenue;
      entry.expenses += tripAllExpenses(t);
      map.set(t.truck, entry);
    });
    return Array.from(map.entries())
      .map(([truckId, v]) => {
        const trip = periodTrips.find((t) => t.truck === truckId);
        return {
          id: truckId,
          truck: truckId,
          trips: v.trips,
          tripId: trip?.id ?? "—",
          revenue: v.revenue,
          expenses: v.expenses,
          netProfit: v.revenue - v.expenses,
        };
      })
      .sort((a, b) => b.netProfit - a.netProfit);
  }, [periodTrips]);
  const topTrucks = truckRows.slice(0, 5);

  const exportPnl = () => {
    exportCSV(
      "pnl-summary.csv",
      ["Metric", "Amount", "Period"],
      [
        ["Total Revenue", totalRevenue, range.label],
        ["Total Expenses", totalExpenses, range.label],
        ["Gross Profit", grossProfit, range.label],
        ["Net Profit", netProfit, range.label],
        ["Net Profit Margin (%)", netProfitMargin.toFixed(1), range.label],
      ],
    );
  };

  const TabButton = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 items-center gap-2 whitespace-nowrap border-b-2 px-5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-transparent text-muted-foreground hover:bg-elevated/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );

  return (
    <>
      <Header
        title="P&L"
        subtitle="Financial performance and profitability overview."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Select
              value={rangeKey}
              onValueChange={(value) => setRangeKey(value as RangeKey)}
            >
              <SelectTrigger className="h-9 w-[175px] border-border bg-elevated/60 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ranges.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-border bg-elevated/60 text-xs"
              onClick={exportPnl}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        }
      />
      <main className="space-y-6 p-8">
        {rangeKey === "custom" && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-elevated/30 p-4">
            <span className="text-xs font-medium text-muted-foreground">
              Custom period
            </span>
            <Input
              type="date"
              value={customStart}
              onChange={(event) => setCustomStart(event.target.value)}
              className="h-9 w-auto bg-background/40 text-xs"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <Input
              type="date"
              value={customEnd}
              onChange={(event) => setCustomEnd(event.target.value)}
              className="h-9 w-auto bg-background/40 text-xs"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <KPICard
            label="Total Revenue"
            value={hasData ? money(totalRevenue) : "—"}
            icon={ArrowUp}
            tone="success"
            footnote={hasData ? range.label : "No trips in this period"}
          />
          <KPICard
            label="Total Expenses"
            value={hasData ? money(totalExpenses) : "—"}
            icon={ArrowDown}
            tone="danger"
            footnote={hasData ? "Including depreciation" : "—"}
          />
          <KPICard
            label="Gross Profit"
            value={hasData ? money(grossProfit) : "—"}
            icon={CircleDollarSign}
            tone="info"
            footnote={hasData ? "Excluding depreciation" : "—"}
          />
          <KPICard
            label="Net Profit"
            value={hasData ? money(netProfit) : "—"}
            icon={Receipt}
            tone="success"
            footnote={hasData ? "Including depreciation" : "—"}
          />
          <KPICard
            label="Net Profit Margin"
            value={hasData ? `${netProfitMargin.toFixed(1)}%` : "—"}
            icon={Percent}
            tone="purple"
            footnote={hasData ? "Net Profit / Revenue" : "—"}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_1fr]">
          <SectionCard title="Total Revenue vs Expenses Trend">
            {hasData ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trendData}
                    margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="revGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-success, #16a34a)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-success, #16a34a)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="expGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-danger, #dc2626)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-danger, #dc2626)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={gridStroke}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: axisColour, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: axisColour, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={compactMoney}
                      width={64}
                    />
                    <Tooltip
                      cursor={{
                        fill: isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.04)",
                      }}
                      contentStyle={{
                        background: isDark
                          ? "rgba(15,23,42,0.95)"
                          : "rgba(255,255,255,0.98)",
                        border: `1px solid ${gridStroke}`,
                        borderRadius: 10,
                        fontSize: 12,
                      }}
                      formatter={(value: number, name: string) => [
                        money(value),
                        name === "revenue" ? "Revenue" : "Expenses",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-success, #16a34a)"
                      strokeWidth={2}
                      fill="url(#revGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="var(--color-danger, #dc2626)"
                      strokeWidth={2}
                      fill="url(#expGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyPanel
                icon={CircleDollarSign}
                title="No data available for this period."
                detail="No trips fall within the selected date range. Adjust the date range to see the revenue vs expenses trend."
              />
            )}
          </SectionCard>

          <SectionCard title="Cost Breakdown">
            <div className="mb-4 text-xs text-muted-foreground">
              Total expenses:{" "}
              <span className="font-semibold text-foreground">
                {hasData ? money(totalExpenses) : "—"}
              </span>
            </div>
            {hasData ? (
              <div className="space-y-4">
                {costRows.map((row) => (
                  <div key={row.id}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">{row.name}</span>
                      <span className="font-medium text-foreground">
                        {row.amount ? money(row.amount) : "—"}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-background/70">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          row.tone === "info"
                            ? "bg-info"
                            : row.tone === "success"
                              ? "bg-success"
                              : row.tone === "warning"
                                ? "bg-warning"
                                : row.tone === "purple"
                                  ? "bg-purple"
                                  : "bg-danger",
                        )}
                        style={{
                          width: `${totalExpenses ? (row.amount / totalExpenses) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-center text-xs text-muted-foreground">
                No financial data available for this period.
              </p>
            )}
          </SectionCard>
        </div>

        <GlassCard hover={false} className="p-0">
          <div className="flex items-center gap-1 overflow-x-auto border-b border-border/60">
            <TabButton
              active={tab === "trips"}
              onClick={() => setTab("trips")}
            >
              Trips
            </TabButton>
            <TabButton
              active={tab === "clients"}
              onClick={() => setTab("clients")}
            >
              Clients
            </TabButton>
            <TabButton
              active={tab === "trucks"}
              onClick={() => setTab("trucks")}
            >
              Trucks
            </TabButton>
          </div>

          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="text-[15px] font-semibold text-foreground">
              {tab === "trips"
                ? "Trip Profitability"
                : tab === "clients"
                  ? "Client Profitability"
                  : "Truck Profitability"}
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-border bg-elevated/60 text-xs"
              onClick={() => setViewAll(tab)}
              disabled={!hasData}
            >
              View all
            </Button>
          </div>

          {tab === "trips" && (
            <TripsTable
              rows={topTrips}
              empty={!hasData}
              onTrip={(id) => open({ kind: "trip", id })}
              onTruck={(id) => open({ kind: "truck", id })}
            />
          )}
          {tab === "clients" && (
            <ClientsTable
              rows={topClients}
              empty={!hasData}
              onClient={(name) => {
                const cid = clientIdFor(name);
                if (cid) open({ kind: "client", id: cid });
              }}
            />
          )}
          {tab === "trucks" && (
            <TrucksTable
              rows={topTrucks}
              empty={!hasData}
              onTruck={(id) => open({ kind: "truck", id })}
              onTrip={(id) => open({ kind: "trip", id })}
            />
          )}
        </GlassCard>

        <div className="flex flex-wrap justify-between gap-2 rounded-xl border border-border/60 bg-elevated/20 px-4 py-3 text-xs text-muted-foreground">
          <span>
            Gross Profit = Revenue − Expenses (excluding depreciation)
          </span>
          <span>
            Net Profit = Revenue − Expenses (including depreciation)
          </span>
          <span>Net Profit Margin = Net Profit / Revenue × 100</span>
        </div>
      </main>

      <Dialog
        open={viewAll !== null}
        onOpenChange={(o) => !o && setViewAll(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {viewAll === "trips"
                ? "All Trips"
                : viewAll === "clients"
                  ? "All Clients"
                  : "All Trucks"}
            </DialogTitle>
          </DialogHeader>
          <ViewAllContent
            kind={viewAll}
            trips={tripRows}
            clients={clientRows}
            trucks={truckRows}
            onTrip={(id) => open({ kind: "trip", id })}
            onTruck={(id) => open({ kind: "truck", id })}
            onClient={(name) => {
              const cid = clientIdFor(name);
              if (cid) open({ kind: "client", id: cid });
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function EmptyPanel({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof CircleDollarSign;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-border/50 bg-background/20 px-6 text-center">
      <Icon className="h-9 w-9 text-muted-foreground/50" />
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

const TableShell = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[640px] text-sm">
      <thead className="bg-elevated/70">
        <tr>{children}</tr>
      </thead>
    </table>
  </div>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
    {children}
  </th>
);
const Td = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td
    className={cn(
      "whitespace-nowrap border-t border-border/60 px-5 py-3.5 text-[12px] text-foreground",
      className,
    )}
  >
    {children}
  </td>
);

function PaymentBadge({ status }: { status: "Paid" | "Pending" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        status === "Paid"
          ? "bg-success/15 text-success"
          : "bg-warning/15 text-warning",
      )}
    >
      {status}
    </span>
  );
}

function TripsTable({
  rows,
  empty,
  onTrip,
  onTruck,
}: {
  rows: Array<Trip & { profit: number }>;
  empty: boolean;
  onTrip: (id: string) => void;
  onTruck: (id: string) => void;
}) {
  if (empty)
    return (
      <div className="px-5 py-12 text-center text-sm text-muted-foreground">
        No data available for this period.
      </div>
    );
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-elevated/70">
          <tr>
            <Th>Trip ID</Th>
            <Th>Client</Th>
            <Th>Truck</Th>
            <Th>Revenue</Th>
            <Th>Profit</Th>
            <Th>Payment Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr
              key={t.id}
              className="transition-colors hover:bg-white/[0.03]"
            >
              <Td>
                <button
                  onClick={() => onTrip(t.id)}
                  className="font-semibold text-primary hover:underline"
                >
                  {t.id}
                </button>
              </Td>
              <Td>{t.customer}</Td>
              <Td>
                <button
                  onClick={() => onTruck(t.truck)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {t.truck}
                </button>
              </Td>
              <Td className="font-semibold text-foreground">
                {money(t.revenue)}
              </Td>
              <Td
                className={cn(
                  "font-semibold",
                  t.profit >= 0 ? "text-success" : "text-danger",
                )}
              >
                {money(t.profit)}
              </Td>
              <Td>
                <PaymentBadge status={t.paymentStatus} />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ClientsTable({
  rows,
  empty,
  onClient,
}: {
  rows: Array<{ id: string; name: string; revenue: number }>;
  empty: boolean;
  onClient: (name: string) => void;
}) {
  if (empty)
    return (
      <div className="px-5 py-12 text-center text-sm text-muted-foreground">
        No data available for this period.
      </div>
    );
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-sm">
        <thead className="bg-elevated/70">
          <tr>
            <Th>Rank</Th>
            <Th>Client</Th>
            <Th>Revenue</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c, i) => (
            <tr
              key={c.id}
              className="transition-colors hover:bg-white/[0.03]"
            >
              <Td className="font-semibold text-foreground">{i + 1}</Td>
              <Td>
                <button
                  onClick={() => onClient(c.name)}
                  className="font-medium text-primary hover:underline"
                >
                  {c.name}
                </button>
              </Td>
              <Td className="font-semibold text-foreground">
                {money(c.revenue)}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrucksTable({
  rows,
  empty,
  onTruck,
  onTrip,
}: {
  rows: Array<{
    id: string;
    truck: string;
    trips: number;
    tripId: string;
    revenue: number;
    expenses: number;
    netProfit: number;
  }>;
  empty: boolean;
  onTruck: (id: string) => void;
  onTrip: (id: string) => void;
}) {
  if (empty)
    return (
      <div className="px-5 py-12 text-center text-sm text-muted-foreground">
        No data available for this period.
      </div>
    );
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-elevated/70">
          <tr>
            <Th>Truck</Th>
            <Th>Trips</Th>
            <Th>Trip ID</Th>
            <Th>Revenue</Th>
            <Th>Expenses</Th>
            <Th>Net Profit</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr
              key={t.id}
              className="transition-colors hover:bg-white/[0.03]"
            >
              <Td>
                <button
                  onClick={() => onTruck(t.truck)}
                  className="font-semibold text-primary hover:underline"
                >
                  {t.truck}
                </button>
              </Td>
              <Td className="text-center">{t.trips}</Td>
              <Td>
                {t.tripId !== "—" ? (
                  <button
                    onClick={() => onTrip(t.tripId)}
                    className="font-semibold text-primary hover:underline"
                  >
                    {t.tripId}
                  </button>
                ) : (
                  "—"
                )}
              </Td>
              <Td className="font-semibold text-foreground">
                {money(t.revenue)}
              </Td>
              <Td className="text-muted-foreground">{money(t.expenses)}</Td>
              <Td
                className={cn(
                  "font-semibold",
                  t.netProfit >= 0 ? "text-success" : "text-danger",
                )}
              >
                {money(t.netProfit)}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ViewAllContent({
  kind,
  trips,
  clients,
  trucks,
  onTrip,
  onTruck,
  onClient,
}: {
  kind: TabKey | null;
  trips: Array<Trip & { profit: number }>;
  clients: Array<{ id: string; name: string; revenue: number }>;
  trucks: Array<{
    id: string;
    truck: string;
    trips: number;
    tripId: string;
    revenue: number;
    expenses: number;
    netProfit: number;
  }>;
  onTrip: (id: string) => void;
  onTruck: (id: string) => void;
  onClient: (name: string) => void;
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const list = kind === "trips" ? trips : kind === "clients" ? clients : trucks;
  const filtered = useMemo(() => {
    if (!q) return list;
    const needle = q.toLowerCase();
    return list.filter((r) =>
      kind === "trips"
        ? (r as Trip & { profit: number }).id.toLowerCase().includes(needle) ||
          (r as Trip).customer.toLowerCase().includes(needle) ||
          (r as Trip).truck.toLowerCase().includes(needle)
        : kind === "clients"
          ? (r as { name: string }).name.toLowerCase().includes(needle)
          : (r as { truck: string }).truck.toLowerCase().includes(needle),
    );
  }, [q, list, kind]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className="h-9 bg-elevated/60 text-xs"
        />
      </div>
      <div className="max-h-[420px] overflow-auto">
        {kind === "trips" && (
          <table className="w-full min-w-[640px] text-sm">
            <thead className="sticky top-0 bg-elevated/70">
              <tr>
                <Th>Trip ID</Th>
                <Th>Client</Th>
                <Th>Truck</Th>
                <Th>Revenue</Th>
                <Th>Profit</Th>
                <Th>Payment Status</Th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((t) => {
                const r = t as Trip & { profit: number };
                return (
                  <tr
                    key={r.id}
                    className="transition-colors hover:bg-white/[0.03]"
                  >
                    <Td>
                      <button
                        onClick={() => onTrip(r.id)}
                        className="font-semibold text-primary hover:underline"
                      >
                        {r.id}
                      </button>
                    </Td>
                    <Td>{r.customer}</Td>
                    <Td>
                      <button
                        onClick={() => onTruck(r.truck)}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {r.truck}
                      </button>
                    </Td>
                    <Td className="font-semibold text-foreground">
                      {money(r.revenue)}
                    </Td>
                    <Td
                      className={cn(
                        "font-semibold",
                        r.profit >= 0 ? "text-success" : "text-danger",
                      )}
                    >
                      {money(r.profit)}
                    </Td>
                    <Td>
                      <PaymentBadge status={r.paymentStatus} />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {kind === "clients" && (
          <table className="w-full min-w-[480px] text-sm">
            <thead className="sticky top-0 bg-elevated/70">
              <tr>
                <Th>Rank</Th>
                <Th>Client</Th>
                <Th>Revenue</Th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((c, i) => {
                const r = c as { id: string; name: string; revenue: number };
                const rank = (page - 1) * pageSize + i + 1;
                return (
                  <tr
                    key={r.id}
                    className="transition-colors hover:bg-white/[0.03]"
                  >
                    <Td className="font-semibold text-foreground">{rank}</Td>
                    <Td>
                      <button
                        onClick={() => onClient(r.name)}
                        className="font-medium text-primary hover:underline"
                      >
                        {r.name}
                      </button>
                    </Td>
                    <Td className="font-semibold text-foreground">
                      {money(r.revenue)}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {kind === "trucks" && (
          <table className="w-full min-w-[720px] text-sm">
            <thead className="sticky top-0 bg-elevated/70">
              <tr>
                <Th>Truck</Th>
                <Th>Trips</Th>
                <Th>Trip ID</Th>
                <Th>Revenue</Th>
                <Th>Expenses</Th>
                <Th>Net Profit</Th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((t) => {
                const r = t as {
                  id: string;
                  truck: string;
                  trips: number;
                  tripId: string;
                  revenue: number;
                  expenses: number;
                  netProfit: number;
                };
                return (
                  <tr
                    key={r.id}
                    className="transition-colors hover:bg-white/[0.03]"
                  >
                    <Td>
                      <button
                        onClick={() => onTruck(r.truck)}
                        className="font-semibold text-primary hover:underline"
                      >
                        {r.truck}
                      </button>
                    </Td>
                    <Td className="text-center">{r.trips}</Td>
                    <Td>
                      {r.tripId !== "—" ? (
                        <button
                          onClick={() => onTrip(r.tripId)}
                          className="font-semibold text-primary hover:underline"
                        >
                          {r.tripId}
                        </button>
                      ) : (
                        "—"
                      )}
                    </Td>
                    <Td className="font-semibold text-foreground">
                      {money(r.revenue)}
                    </Td>
                    <Td className="text-muted-foreground">
                      {money(r.expenses)}
                    </Td>
                    <Td
                      className={cn(
                        "font-semibold",
                        r.netProfit >= 0 ? "text-success" : "text-danger",
                      )}
                    >
                      {money(r.netProfit)}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {pageRows.length} of {filtered.length}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 border-border bg-elevated/60"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ‹
          </Button>
          <span className="tabular-nums">
            {page} / {totalPages}
          </span>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 border-border bg-elevated/60"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            ›
          </Button>
        </div>
      </div>
    </div>
  );
}
