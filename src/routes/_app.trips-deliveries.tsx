import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { KPICard } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { clients, getRouteFor, exportCSV, type Trip, type PaymentStatus } from "@/lib/mock-data";
import { useTrips } from "@/lib/trips-store";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Route as RouteIcon, Package, Clock, TriangleAlert as AlertTriangle, Download, Search, ListFilter as Filter } from "lucide-react";

export const Route = createFileRoute("/_app/trips-deliveries")({
  component: TripsDeliveries,
});

const tone = { "In Transit": "info", "Delivered": "success", "Delayed": "danger", "Scheduled": "warning", "Cancelled": "purple" } as const;
const ALL_STATUSES = ["In Transit", "Delivered", "Delayed", "Scheduled", "Cancelled"] as const;
const ALL_PAYMENTS: PaymentStatus[] = ["Paid", "Pending"];

const naira = (n: number) => "₦" + n.toLocaleString("en-NG", { maximumFractionDigits: 0 });

interface ConfirmState {
  trip: Trip;
  newStatus: PaymentStatus;
  previousStatus: PaymentStatus;
}

function TripsDeliveries() {
  const { open } = useProfileDrawer();
  const { trips, updatePaymentStatus } = useTrips();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const filtered = useMemo(() => {
    return trips.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (paymentFilter !== "all" && t.paymentStatus !== paymentFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return t.id.toLowerCase().includes(s) || t.customer.toLowerCase().includes(s) || t.driver.toLowerCase().includes(s) || t.truck.toLowerCase().includes(s) || t.origin.toLowerCase().includes(s) || t.destination.toLowerCase().includes(s);
    });
  }, [trips, search, statusFilter, paymentFilter]);

  function handleStatusChange(tripId: string, newStatus: string) {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;
    // paymentStatus handled by handlePaymentChange; this is trip status
    // (existing behavior kept)
    toast.success(`Trip ${tripId} status updated to ${newStatus}`);
    if (newStatus === "On Trip") {
      toast.info("Route dialog would open here to create/attach route");
    }
  }

  function handlePaymentChange(tripId: string, newStatus: PaymentStatus) {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;
    if (trip.paymentStatus === newStatus) return;
    // Any payment status change requires confirmation
    setConfirm({ trip, newStatus, previousStatus: trip.paymentStatus });
  }

  function confirmPaymentChange() {
    if (!confirm) return;
    updatePaymentStatus(confirm.trip.id, confirm.newStatus);
    if (confirm.newStatus === "Paid") {
      toast.success(`Payment confirmed for ${confirm.trip.id}`);
    } else {
      toast.success(`Payment status for ${confirm.trip.id} changed to ${confirm.newStatus}`);
    }
    setConfirm(null);
  }

  function cancelPaymentChange() {
    setConfirm(null);
  }

  function handleExport() {
    exportCSV(
      "trips-deliveries.csv",
      ["Trip ID", "Customer", "Origin", "Destination", "Driver", "Truck", "Status", "ETA", "Distance", "Revenue", "Payment Status"],
      filtered.map((t) => [t.id, t.customer, t.origin, t.destination, t.driver, t.truck, t.status, t.eta, `${t.distance} km`, naira(t.revenue), t.paymentStatus]),
    );
    toast.success("Exported trips to CSV");
  }

  const clientIdFor = (name: string) => clients.find((c) => c.name === name)?.id;

  const cols: Column<Trip>[] = [
    { key: "id", label: "Trip ID", render: (r) => (
      <button onClick={() => open({ kind: "trip", id: r.id })} className="font-semibold text-primary hover:underline">{r.id}</button>
    )},
    { key: "customer", label: "Customer", render: (r) => {
      const cid = clientIdFor(r.customer);
      return cid ? <button onClick={() => open({ kind: "client", id: cid })} className="hover:underline">{r.customer}</button> : r.customer;
    }},
    { key: "origin", label: "Route", render: (r) => {
      const route = getRouteFor(r.origin, r.destination);
      return route ? (
        <button onClick={() => open({ kind: "route", id: route.id })} className="text-xs text-primary hover:underline">{r.origin} → {r.destination}</button>
      ) : (
        <span className="text-xs text-muted-foreground">{r.origin} → {r.destination}</span>
      );
    }},
    { key: "driver", label: "Driver", render: (r) => (
      <button onClick={() => open({ kind: "driver", id: r.driver })} className="hover:underline">{r.driver}</button>
    )},
    { key: "truck", label: "Truck", render: (r) => (
      <button onClick={() => open({ kind: "truck", id: r.truck })} className="text-primary hover:underline text-xs font-medium">{r.truck}</button>
    )},
    { key: "status", label: "Status", render: (r) => (
      <Select value={r.status} onValueChange={(v) => handleStatusChange(r.id, v)}>
        <SelectTrigger className="h-7 w-32 text-xs border-border/60 bg-elevated/60"><SelectValue /></SelectTrigger>
        <SelectContent>
          {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
    )},
    { key: "eta", label: "ETA" },
    { key: "distance", label: "Distance", render: (r) => <span className="text-xs">{r.distance} km</span> },
    { key: "revenue", label: "Revenue", render: (r) => <span className="text-xs font-semibold text-foreground">{naira(r.revenue)}</span> },
    { key: "paymentStatus", label: "Payment Status", render: (r) => (
      <Select value={r.paymentStatus} onValueChange={(v) => handlePaymentChange(r.id, v as PaymentStatus)}>
        <SelectTrigger className="h-7 w-28 text-xs border-border/60 bg-elevated/60">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ALL_PAYMENTS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </SelectContent>
      </Select>
    )},
  ];

  const isPendingToPaid = confirm?.previousStatus === "Pending" && confirm?.newStatus === "Paid";
  const isPaidToPending = confirm?.previousStatus === "Paid" && confirm?.newStatus === "Pending";

  return (
    <>
      <Header title="Trips & Deliveries" subtitle="Track every trip from dispatch to proof of delivery" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Active Trips" value="142" icon={RouteIcon} tone="info" delta={{ value: "12", direction: "up" }} />
          <KPICard label="Delivered Today" value="112" icon={Package} tone="success" delta={{ value: "8%", direction: "up" }} />
          <KPICard label="On-Time Rate" value="92.3%" icon={Clock} tone="purple" delta={{ value: "3.2%", direction: "down" }} />
          <KPICard label="Delayed" value="11" icon={AlertTriangle} tone="danger" footnote="4 critical" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by trip ID, customer, driver, truck, route…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-elevated/60"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-40 text-xs bg-elevated/60"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="h-9 w-44 text-xs bg-elevated/60"><SelectValue placeholder="All Payment Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Statuses</SelectItem>
                  {ALL_PAYMENTS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-border bg-elevated/60" onClick={handleExport}>
            <Download className="mr-1.5 h-3.5 w-3.5" />Export CSV
          </Button>
        </div>

        <DataTable title="Trips" columns={cols} rows={filtered} searchKeys={[]} pageSize={10} hideToolbar />
      </div>

      <Dialog open={!!confirm} onOpenChange={(o) => { if (!o) cancelPaymentChange(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isPendingToPaid ? "Mark Payment as Paid?" : "Change Payment Status?"}
            </DialogTitle>
            <DialogDescription>
              {isPendingToPaid ? (
                <>You are about to mark this trip as Paid.</>
              ) : isPaidToPending ? (
                <>You are about to change the payment status for this trip from <strong>Paid</strong> to <strong>Pending</strong>.</>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          {confirm && (
            <div className="space-y-2 rounded-lg border border-border/60 bg-elevated/30 px-4 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trip</span>
                <span className="font-medium">{confirm.trip.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium">{confirm.trip.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-semibold text-foreground">{naira(confirm.trip.revenue)}</span>
              </div>
            </div>
          )}

          {isPendingToPaid && (
            <p className="text-sm text-muted-foreground">
              Please confirm that payment for this trip has been received.
            </p>
          )}
          {isPaidToPending && (
            <p className="text-sm text-muted-foreground">
              Are you sure you want to continue?
            </p>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={cancelPaymentChange}>Cancel</Button>
            <Button onClick={confirmPaymentChange}>
              {isPendingToPaid ? "Confirm Payment" : "Confirm Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
