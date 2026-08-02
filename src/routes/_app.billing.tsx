import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard, SectionCard, Pill } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CreditCard, Truck, Wallet, CalendarClock, Receipt, FileText, Download, Pencil, Search, ListFilter as Filter } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/billing")({
  component: BillingPage,
});

/* ------------------------------------------------------------------ */
/* Invoice data                                                        */
/* ------------------------------------------------------------------ */

interface Invoice {
  id: string;
  period: string;
  issueDate: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
  paymentDate: string;
}

const invoices: Invoice[] = [
  { id: "INV-1008", period: "1 Jul – 31 Jul, 2026", issueDate: "31 Jul, 2026", amount: "₦720,000", status: "Paid", paymentDate: "31 Jul, 2026" },
  { id: "INV-1007", period: "1 Jun – 30 Jun, 2026", issueDate: "30 Jun, 2026", amount: "₦690,000", status: "Paid", paymentDate: "30 Jun, 2026" },
  { id: "INV-1006", period: "1 May – 31 May, 2026", issueDate: "31 May, 2026", amount: "₦645,000", status: "Paid", paymentDate: "31 May, 2026" },
  { id: "INV-1005", period: "1 Apr – 30 Apr, 2026", issueDate: "30 Apr, 2026", amount: "₦615,000", status: "Paid", paymentDate: "30 Apr, 2026" },
  { id: "INV-1004", period: "1 Mar – 31 Mar, 2026", issueDate: "31 Mar, 2026", amount: "₦580,000", status: "Paid", paymentDate: "31 Mar, 2026" },
];

const statusTone: Record<Invoice["status"], "success" | "warning" | "danger"> = {
  Paid: "success",
  Pending: "warning",
  Overdue: "danger",
};

/* ------------------------------------------------------------------ */
/* Trend data                                                          */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function SubscriptionOverviewCard() {
  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left — plan details */}
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Subscription Overview
            </div>
            <div className="mt-1 flex items-center gap-3">
              <span className="text-[22px] font-semibold text-foreground">Professional Plan</span>
              <Pill tone="success">Active</Pill>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-4">
              <PlanDetail label="Billing Cycle" value="30 Days" />
              <PlanDetail label="Price per Active Truck" value="₦5,000" />
              <PlanDetail label="Next Billing Date" value="31 Aug, 2026" />
              <PlanDetail label="Auto Renewal" value="Enabled" valueClass="text-success font-semibold" />
            </div>
          </div>
        </div>

        {/* Right — estimated invoice */}
        <div className="shrink-0 rounded-xl border border-border/50 bg-background/30 p-5 text-right">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Estimated Next Invoice
          </div>
          <div className="mt-1.5 text-[32px] font-bold leading-none text-foreground">₦740,000</div>
          <div className="mt-1 text-[12px] text-muted-foreground">148 Active Trucks × ₦5,000</div>
          <Button variant="outline" size="sm" className="mt-3 border-border bg-elevated/60 text-xs">
            <Receipt className="mr-1.5 h-3.5 w-3.5" />
            View Invoice Preview
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

function PlanDetail({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className={cn("text-[13px] font-semibold text-foreground", valueClass)}>{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4 summary metric cards                                              */
/* ------------------------------------------------------------------ */

function SummaryMetrics() {
  const cards = [
    { label: "Current Active Trucks", value: "148", sub: "Billable this cycle", icon: Truck, color: "text-info", bg: "bg-info/15" },
    { label: "Current Monthly Cost", value: "₦740,000", sub: "Before tax", icon: Wallet, color: "text-success", bg: "bg-success/15" },
    { label: "Billing Cycle", value: "30 Days", sub: "Renewed every 30 days", icon: CalendarClock, color: "text-purple", bg: "bg-purple/15" },
    { label: "Next Invoice Date", value: "31 Aug, 2026", sub: "In 8 days", icon: Receipt, color: "text-warning", bg: "bg-warning/15" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((c) => (
        <GlassCard key={c.label} className="p-5" hover={false}>
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", c.bg)}>
              <c.icon className={cn("h-5 w-5", c.color)} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</div>
              <div className="mt-0.5 text-[18px] font-semibold leading-tight text-foreground">{c.value}</div>
              <div className="text-[11px] text-muted-foreground">{c.sub}</div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Usage breakdown + Billing Trend (side by side)                      */
/* ------------------------------------------------------------------ */

function UsageBreakdown() {
  const rows = [
    { label: "Total Registered Trucks", value: 173, icon: Truck },
    { label: "Active Trucks (Billable)", value: 148, icon: Truck, highlight: true },
    { label: "Inactive Trucks", value: 18, icon: Truck },
    { label: "Out of Service Trucks", value: 7, icon: Truck },
    { label: "Price per Active Truck", value: "₦5,000", icon: CreditCard, isPrice: true },
  ];
  return (
    <SectionCard title="Usage Breakdown">
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between rounded-lg border border-border/40 bg-background/20 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <r.icon className="h-4 w-4 text-muted-foreground" />
              <span className={cn("text-[13px]", r.highlight ? "font-semibold text-foreground" : "text-muted-foreground")}>{r.label}</span>
            </div>
            <span className={cn("text-[13px] font-semibold", r.highlight ? "text-foreground" : "text-muted-foreground")}>
              {typeof r.value === "number" ? r.value : r.value}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <span className="text-[13px] font-semibold text-primary">Estimated Monthly Total</span>
          <span className="text-[15px] font-bold text-primary">₦740,000</span>
        </div>
      </div>
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/* Invoice History Table                                               */
/* ------------------------------------------------------------------ */

function InvoiceHistory() {
  const [search, setSearch] = useState("");

  const cols: Column<Invoice>[] = [
    { key: "id", label: "Invoice ID", render: (r) => <span className="text-[13px] font-semibold text-foreground">{r.id}</span> },
    { key: "period", label: "Billing Period", render: (r) => <span className="text-[13px] text-muted-foreground">{r.period}</span> },
    { key: "issueDate", label: "Issue Date", render: (r) => <span className="text-[13px] text-muted-foreground">{r.issueDate}</span> },
    { key: "amount", label: "Amount", render: (r) => <span className="text-[13px] font-semibold">{r.amount}</span> },
    {
      key: "status",
      label: "Status",
      render: (r) => <Pill tone={statusTone[r.status]}>{r.status}</Pill>,
    },
    { key: "paymentDate", label: "Payment Date", render: (r) => <span className="text-[13px] text-muted-foreground">{r.paymentDate}</span> },
    {
      key: "download",
      label: "Download",
      render: () => (
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-[12px] text-muted-foreground hover:text-primary">
          <FileText className="h-3.5 w-3.5" /> PDF
        </Button>
      ),
    },
  ];

  const filtered = search
    ? invoices.filter((i) => i.id.toLowerCase().includes(search.toLowerCase()) || i.period.toLowerCase().includes(search.toLowerCase()))
    : invoices;

  return (
    <SectionCard
      title="Invoice History"
      action={
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-48 pl-8 text-xs bg-elevated/60"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 border-border bg-elevated/60 text-xs">
            <Filter className="mr-1.5 h-3 w-3" />Filter
          </Button>
          <Button variant="outline" size="sm" className="h-8 border-border bg-elevated/60 text-xs">
            <Download className="mr-1.5 h-3 w-3" />Export
          </Button>
        </div>
      }
    >
      <DataTable columns={cols} rows={filtered} searchKeys={[]} pageSize={5} hideToolbar />
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/* Right sidebar                                                       */
/* ------------------------------------------------------------------ */

function PaymentMethod() {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard className="p-5" hover={false}>
      <h3 className="mb-4 text-[15px] font-semibold text-foreground">Payment Method</h3>
      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-12 items-center justify-center rounded-md bg-[#1a1f71] text-[10px] font-bold text-white">
            VISA
          </div>
          <div>
            <div className="text-[13px] font-semibold text-foreground">•••• 4281</div>
            <div className="text-[11px] text-muted-foreground">Expires 05/28</div>
          </div>
        </div>
        <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-medium text-success">Primary</span>
      </div>
      <Button
        variant="outline"
        className="mt-4 w-full border-border bg-elevated/60 text-sm"
        onClick={() => setOpen(true)}
      >
        <Pencil className="mr-2 h-3.5 w-3.5" />
        Update Payment Method
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Payment Method</DialogTitle>
            <DialogDescription>
              Enter new card details to replace your current payment method.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Cardholder Name</label>
              <Input placeholder="Name on card" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Card Number</label>
              <Input placeholder="0000 0000 0000 0000" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-muted-foreground">Expiry</label>
                <Input placeholder="MM/YY" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-muted-foreground">CVV</label>
                <Input placeholder="123" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { setOpen(false); toast.success("Payment method updated successfully"); }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
}

interface SettingRow { id: string; label: string; value: string; valueClass?: string; isSwitch?: boolean; defaultOn?: boolean }

function SubscriptionSettings() {
  const rows: SettingRow[] = [
    { id: "plan", label: "Plan", value: "Professional Plan" },
    { id: "cycle", label: "Billing Cycle", value: "30 Days" },
    { id: "currency", label: "Currency", value: "NGN" },
    { id: "renewal", label: "Auto Renewal", value: "Enabled", valueClass: "text-success font-semibold", isSwitch: true, defaultOn: true },
    { id: "vat", label: "Tax (VAT)", value: "Applied (7.5%)" },
  ];

  return (
    <GlassCard className="p-5" hover={false}>
      <h3 className="mb-4 text-[15px] font-semibold text-foreground">Subscription Settings</h3>
      <div className="flex flex-col divide-y divide-border/40">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <span className="text-[13px] text-muted-foreground">{r.label}</span>
            {r.isSwitch ? (
              <div className="flex items-center gap-2">
                <span className={cn("text-[13px]", r.valueClass)}>{r.value}</span>
                <Switch defaultChecked={r.defaultOn} className="data-[state=checked]:bg-primary scale-75" />
              </div>
            ) : (
              <span className={cn("text-[13px] font-semibold text-foreground", r.valueClass)}>{r.value}</span>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

/* ------------------------------------------------------------------ */
/* Page layout                                                         */
/* ------------------------------------------------------------------ */

function BillingPage() {
  return (
    <>
      <Header
        title="Billing & Subscription"
        subtitle="Manage your organisation's subscription, billing cycle, payment methods and view invoices and billing history."
        showDate={false}
      />
      <div className="p-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-6">
            <SubscriptionOverviewCard />
            <SummaryMetrics />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <UsageBreakdown />
              <SubscriptionSettings />
            </div>
            <InvoiceHistory />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <PaymentMethod />
          </div>
        </div>
      </div>
    </>
  );
}
