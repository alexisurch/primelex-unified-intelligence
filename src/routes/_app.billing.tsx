import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard, SectionCard, Pill } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CreditCard, Truck, Wallet, CalendarClock, Receipt, FileText, Download, Pencil, CircleCheck as CheckCircle2, TrendingUp, TrendingDown, LifeBuoy, Search, ListFilter as Filter } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useState } from "react";

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

const trendData = [
  { month: "Feb '26", amount: 580000 },
  { month: "Mar '26", amount: 615000 },
  { month: "Apr '26", amount: 645000 },
  { month: "May '26", amount: 690000 },
  { month: "Jun '26", amount: 720000 },
  { month: "Jul '26", amount: 740000 },
];

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
              <PlanDetail label="Billing Cycle" value="Monthly" />
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
    { label: "Billing Cycle", value: "Monthly", sub: "1st – Last day of month", icon: CalendarClock, color: "text-purple", bg: "bg-purple/15" },
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

function BillingTrend() {
  return (
    <SectionCard title="Billing Trend (Last 6 Months)">
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v: number) => `₦${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip
              formatter={(v: number) => [`₦${v.toLocaleString()}`, "Amount"]}
              contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
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
      <Button variant="outline" className="mt-4 w-full border-border bg-elevated/60 text-sm">
        <Pencil className="mr-2 h-3.5 w-3.5" />
        Update Payment Method
      </Button>
    </GlassCard>
  );
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  tone: "success" | "info" | "warning" | "purple";
  iconBg: string;
  icon: typeof CheckCircle2;
}

function BillingActivity() {
  const items: ActivityItem[] = [
    { id: "a1", title: "Payment successful", description: "₦720,000 paid via Visa •••• 4281", timestamp: "Today, 10:42 AM", tone: "success", iconBg: "bg-success/15", icon: CheckCircle2 },
    { id: "a2", title: "Invoice generated", description: "INV-1008 for ₦720,000", timestamp: "31 Jul, 2026 11:59 PM", tone: "info", iconBg: "bg-info/15", icon: FileText },
    { id: "a3", title: "Active trucks increased", description: "138 → 148 active trucks", timestamp: "20 Jul, 2026 09:15 AM", tone: "warning", iconBg: "bg-warning/15", icon: Truck },
    { id: "a4", title: "Payment method updated", description: "Visa •••• 4281 set as primary", timestamp: "5 Jul, 2026 02:30 PM", tone: "purple", iconBg: "bg-purple/15", icon: CreditCard },
  ];

  const toneText: Record<ActivityItem["tone"], string> = {
    success: "text-success",
    info: "text-info",
    warning: "text-warning",
    purple: "text-purple",
  };

  return (
    <GlassCard className="p-5" hover={false}>
      <h3 className="mb-4 text-[15px] font-semibold text-foreground">Billing Activity</h3>
      <div className="flex flex-col">
        {items.map((item, i) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", item.iconBg)}>
                <item.icon className={cn("h-4 w-4", toneText[item.tone])} />
              </div>
              {i < items.length - 1 && (
                <span className="my-1 w-px flex-1 bg-border/60" style={{ minHeight: 20 }} />
              )}
            </div>
            <div className="flex flex-col gap-0.5 pb-4">
              <span className="text-[11px] text-muted-foreground">{item.timestamp}</span>
              <span className="text-[13px] font-semibold text-foreground">{item.title}</span>
              <span className="text-[12px] text-muted-foreground">{item.description}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

interface SettingRow { id: string; label: string; value: string; valueClass?: string; isSwitch?: boolean; defaultOn?: boolean }

function SubscriptionSettings() {
  const rows: SettingRow[] = [
    { id: "plan", label: "Plan", value: "Professional Plan" },
    { id: "cycle", label: "Billing Cycle", value: "Monthly" },
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

function NeedHelp() {
  return (
    <GlassCard className="p-5" hover={false}>
      <h3 className="mb-2 text-[15px] font-semibold text-foreground">Need Help?</h3>
      <p className="mb-4 text-[12px] leading-relaxed text-muted-foreground">
        Our billing team is here to help you with any billing or payment related questions.
      </p>
      <Button variant="outline" className="w-full border-border bg-elevated/60 text-sm">
        <LifeBuoy className="mr-2 h-4 w-4" />
        Contact Billing Support
      </Button>
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
        actions={
          <Button variant="outline" className="border-border bg-elevated/60">
            <CreditCard className="mr-2 h-4 w-4" />
            Manage Payment Method
          </Button>
        }
      />
      <div className="p-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-6">
            <SubscriptionOverviewCard />
            <SummaryMetrics />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <UsageBreakdown />
              <BillingTrend />
            </div>
            <InvoiceHistory />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <PaymentMethod />
            <BillingActivity />
            <SubscriptionSettings />
            <NeedHelp />
          </div>
        </div>
      </div>
    </>
  );
}
