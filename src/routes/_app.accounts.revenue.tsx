import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownUp, Banknote, Clock, Download, ListFilter as Filter, Percent, Route as RouteIcon, Search, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Header } from "@/components/layout/Header";
import { KPICard, SectionCard } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfileDrawer } from "@/lib/profile-drawer";
import {
  clients,
  exportCSV,
  getRouteFor,
  trips as allTrips,
  type Trip,
} from "@/lib/mock-data";
import { usePreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/accounts/revenue")({
  component: RevenuePage,
});

type RangeKey =
  | "today"
  | "week"
  | "month"
  | "last-month"
  | "quarter"
  | "year"
  | "custom";

type AggKey = "daily" | "weekly" | "monthly";

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
const recordDate = (value: string) => new Date(`${value}T00:00:00`);
const inputDate = (date: Date) => date.toISOString().slice(0, 10);

function getDateRange(
  key: RangeKey,
  customStart: string,
  customEnd: string,
): { start: Date; end: Date; label: string } {
  const now = new Date("2026-08-09T12:00:00");
  const today = day(now);
  if (key === "custom") {
    const start = customStart ? recordDate(customStart) : today;
    const end = customEnd ? endDay(recordDate(customEnd)) : endDay(now);
    return { start, end, label: `${inputDate(start)} – ${inputDate(end)}` };
  }
  if (key === "today") return { start: today, end: endDay(now), label: "Today" };
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
      end: new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59),
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

function expenseForTrip(trip: Trip): number {
  const fuelL = Math.round(trip.distance * 0.32);
  return fuelL * 980 + 45000;
}

function bucketLabel(date: Date, agg: AggKey): string {
  if (agg === "daily")
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  if (agg === "weekly") {
    const start = day(date);
    start.setDate(start.getDate() - start.getDay());
    return `Wk ${inputDate(start).slice(5)}`;
  }
  return date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
}

function RevenuePage() {
  const { open } = useProfileDrawer();
  const { resolvedTheme } = usePreferences();
  const isDark = resolvedTheme === "dark";
  const gridStroke = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const axisColour = isDark ? "#94a3b8" : "#64748b";

  const [rangeKey, setRangeKey] = useState<RangeKey>("year");
  const [agg, setAgg] = useState<AggKey>("monthly");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [truckFilter, setTruckFilter] = useState("all");
  const [driverFilter, setDriverFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [customStart, setCustomStart] = useState("2026-08-01");
  const [customEnd, setCustomEnd] = useState("2026-08-09");

  const range = useMemo(
    () => getDateRange(rangeKey, customStart, customEnd),
    [rangeKey, customStart, customEnd],
  );

  const trucks = useMemo(
    () => Array.from(new Set(allTrips.map((t) => t.truck))).sort(),
    [],
  );
  const drivers = useMemo(
    () => Array.from(new Set(allTrips.map((t) => t.driver))).sort(),
    [],
  );
  const clientNames = useMemo(
    () => Array.from(new Set(allTrips.map((t) => t.customer))).sort(),
    [],
  );
  const statuses = useMemo(
    () => Array.from(new Set(allTrips.map((t) => t.status))),
    [],
  );

  const dateFiltered = useMemo(
    () =>
      allTrips.filter((t) => {
        const d = recordDate(t.date);
        return d >= range.start && d <= range.end;
      }),
    [range],
  );

  const filtered = useMemo(
    () =>
      dateFiltered.filter((t) => {
        if (statusFilter !== "all" && t.status !== statusFilter) return false;
        if (paymentFilter !== "all" && t.paymentStatus !== paymentFilter) return false;
        if (clientFilter !== "all" && t.customer !== clientFilter) return false;
        if (truckFilter !== "all" && t.truck !== truckFilter) return false;
        if (driverFilter !== "all" && t.driver !== driverFilter) return false;
        if (!search) return true;
        const s = search.toLowerCase();
        return (
          t.id.toLowerCase().includes(s) ||
          t.truck.toLowerCase().includes(s) ||
          t.driver.toLowerCase().includes(s) ||
          t.customer.toLowerCase().includes(s) ||
          t.origin.toLowerCase().includes(s) ||
          t.destination.toLowerCase().includes(s)
        );
      }),
    [dateFiltered, statusFilter, paymentFilter, clientFilter, truckFilter, driverFilter, search],
  );

  const totalRevenue = filtered.reduce((sum, t) => sum + t.revenue, 0);
  const totalTrips = filtered.length;
  const avgRevenue = totalTrips ? totalRevenue / totalTrips : 0;
  const paidRevenue = filtered
    .filter((t) => t.paymentStatus === "Paid")
    .reduce((sum, t) => sum + t.revenue, 0);
  const pendingRevenue = filtered
    .filter((t) => t.paymentStatus === "Pending")
    .reduce((sum, t) => sum + t.revenue, 0);
  const collectionRate = totalRevenue
    ? (paidRevenue / totalRevenue) * 100
    : 0;

  const trendData = useMemo(() => {
    const buckets = new Map<string, { revenue: number; trips: number }>();
    filtered.forEach((t) => {
      const date = recordDate(t.date);
      const key = bucketLabel(date, agg);
      const bucket = buckets.get(key) ?? { revenue: 0, trips: 0 };
      bucket.revenue += t.revenue;
      bucket.trips += 1;
      buckets.set(key, bucket);
    });
    return Array.from(buckets.entries())
      .map(([label, value]) => ({ label, ...value }))
      .sort((a, b) => {
        const dateA = new Date(a.label);
        const dateB = new Date(b.label);
        return dateA.getTime() - dateB.getTime();
      });
  }, [filtered, agg]);

  const clientData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((t) =>
      map.set(t.customer, (map.get(t.customer) ?? 0) + t.revenue),
    );
    return Array.from(map.entries())
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [filtered]);

  const handleExport = () => {
    exportCSV(
      "revenue.csv",
      [
        "Trip ID",
        "Driver",
        "Truck",
        "Route",
        "Client",
        "Status",
        "Expenses",
        "Revenue",
        "Payment",
      ],
      filtered.map((t) => [
        t.id,
        t.driver,
        t.truck,
        `${t.origin} → ${t.destination}`,
        t.customer,
        t.status,
        expenseForTrip(t),
        t.revenue,
        t.paymentStatus,
      ]),
    );
  };

  const clientIdFor = (name: string) => clients.find((c) => c.name === name)?.id;

  const cols: Column<Trip>[] = [
    {
      key: "id",
      label: "Trip ID",
      render: (r) => (
        <button
          onClick={() => open({ kind: "trip", id: r.id })}
          className="font-semibold text-primary hover:underline"
        >
          {r.id}
        </button>
      ),
    },
    {
      key: "driver",
      label: "Driver",
      render: (r) => (
        <button
          onClick={() => open({ kind: "driver", id: r.driver })}
          className="hover:underline"
        >
          {r.driver}
        </button>
      ),
    },
    {
      key: "truck",
      label: "Truck",
      render: (r) => (
        <button
          onClick={() => open({ kind: "truck", id: r.truck })}
          className="text-xs font-medium text-primary hover:underline"
        >
          {r.truck}
        </button>
      ),
    },
    {
      key: "route",
      label: "Route",
      render: (r) => {
        const route = getRouteFor(r.origin, r.destination);
        return route ? (
          <button
            onClick={() => open({ kind: "route", id: route.id })}
            className="text-xs text-primary hover:underline"
          >
            {r.origin} → {r.destination}
          </button>
        ) : (
          <span className="text-xs text-muted-foreground">
            {r.origin} → {r.destination}
          </span>
        );
      },
    },
    {
      key: "customer",
      label: "Client",
      render: (r) => {
        const cid = clientIdFor(r.customer);
        return cid ? (
          <button
            onClick={() => open({ kind: "client", id: cid })}
            className="hover:underline"
          >
            {r.customer}
          </button>
        ) : (
          r.customer
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
            r.status === "Delivered"
              ? "bg-success/15 text-success"
              : r.status === "Delayed"
                ? "bg-danger/15 text-danger"
                : r.status === "In Transit"
                  ? "bg-info/15 text-info"
                  : r.status === "Scheduled"
                    ? "bg-warning/15 text-warning"
                    : "bg-purple/15 text-purple",
          )}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: "expenses",
      label: "Expenses",
      render: (r) => (
        <span className="text-xs text-muted-foreground">
          {money(expenseForTrip(r))}
        </span>
      ),
    },
    {
      key: "revenue",
      label: "Revenue",
      render: (r) => (
        <span className="text-xs font-semibold text-foreground">
          {money(r.revenue)}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      render: (r) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
            r.paymentStatus === "Paid"
              ? "bg-success/15 text-success"
              : "bg-warning/15 text-warning",
          )}
        >
          {r.paymentStatus}
        </span>
      ),
    },
  ];

  return (
    <>
      <Header
        title="Revenue"
        subtitle="Track and analyse revenue generated from trips."
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
                {ranges.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="h-9 w-[140px] border-border bg-elevated/60 text-xs">
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={paymentFilter}
              onValueChange={setPaymentFilter}
            >
              <SelectTrigger className="h-9 w-[140px] border-border bg-elevated/60 text-xs">
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-border bg-elevated/60 text-xs"
              onClick={handleExport}
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
              onChange={(e) => setCustomStart(e.target.value)}
              className="h-9 w-auto bg-background/40 text-xs"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <Input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="h-9 w-auto bg-background/40 text-xs"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <KPICard
            label="Total Revenue"
            value={totalTrips ? money(totalRevenue) : "—"}
            icon={Banknote}
            tone="success"
            footnote={totalTrips ? range.label : "No trips in this period"}
          />
          <KPICard
            label="Total Trips"
            value={totalTrips}
            icon={RouteIcon}
            tone="info"
            footnote={range.label}
          />
          <KPICard
            label="Avg Revenue / Trip"
            value={totalTrips ? money(avgRevenue) : "—"}
            icon={TrendingUp}
            tone="purple"
            footnote={totalTrips ? `${totalTrips} trips` : "No trips"}
          />
          <KPICard
            label="Paid Revenue"
            value={totalTrips ? money(paidRevenue) : "—"}
            icon={Banknote}
            tone="success"
            footnote={
              totalTrips
                ? `${filtered.filter((t) => t.paymentStatus === "Paid").length} trips`
                : "—"
            }
          />
          <KPICard
            label="Pending Revenue"
            value={totalTrips ? money(pendingRevenue) : "—"}
            icon={Clock}
            tone="warning"
            footnote={
              totalTrips
                ? `${filtered.filter((t) => t.paymentStatus === "Pending").length} trips`
                : "—"
            }
          />
          <KPICard
            label="Collection Rate"
            value={totalTrips ? `${collectionRate.toFixed(1)}%` : "—"}
            icon={Percent}
            tone="info"
            footnote={totalTrips ? "Paid / Total" : "—"}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
          <SectionCard
            title="Revenue Over Time"
            action={
              <Select value={agg} onValueChange={(value) => setAgg(value as AggKey)}>
                <SelectTrigger className="h-8 w-[120px] border-border bg-elevated/60 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            }
          >
            {trendData.length ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: axisColour, fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: axisColour, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={compactMoney} width={64} />
                    <Tooltip
                      cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                      contentStyle={{
                        background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.98)",
                        border: `1px solid ${gridStroke}`,
                        borderRadius: 10,
                        fontSize: 12,
                      }}
                      formatter={(value: number) => [money(value), "Revenue"]}
                    />
                    <Bar dataKey="revenue" fill="var(--color-primary, #2563eb)" radius={[4, 4, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="No revenue data for this period."
                detail="No trips fall within the selected date range. Adjust the date range or filters to see revenue trends."
              />
            )}
          </SectionCard>

          <SectionCard title="Revenue by Client">
            {clientData.length ? (
              <div className="space-y-4">
                {clientData.map((c) => {
                  const pct = totalRevenue ? (c.revenue / totalRevenue) * 100 : 0;
                  return (
                    <div key={c.name}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">
                          {c.name}
                        </span>
                        <span className="text-muted-foreground">
                          {compactMoney(c.revenue)} · {pct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-background/70">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Banknote}
                title="No client revenue in this period."
                detail="Client revenue is aggregated from trips. No trips match the current filters."
              />
            )}
          </SectionCard>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by trip ID, truck, driver, client, route…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-elevated/60 pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="h-9 w-[150px] border-border bg-elevated/60 text-xs">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clientNames.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={truckFilter} onValueChange={setTruckFilter}>
              <SelectTrigger className="h-9 w-[120px] border-border bg-elevated/60 text-xs">
                <SelectValue placeholder="All Trucks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trucks</SelectItem>
                {trucks.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={driverFilter} onValueChange={setDriverFilter}>
              <SelectTrigger className="h-9 w-[150px] border-border bg-elevated/60 text-xs">
                <SelectValue placeholder="All Drivers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Drivers</SelectItem>
                {drivers.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          title="Trips Revenue"
          columns={cols}
          rows={filtered}
          searchKeys={[]}
          pageSize={10}
          pageSizeOptions={[10, 25, 50]}
          hideToolbar
        />
      </main>
    </>
  );
}

function EmptyState({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof TrendingUp;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-border/50 bg-background/20 px-6 text-center">
      <Icon className="h-9 w-9 text-muted-foreground/50" />
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}
