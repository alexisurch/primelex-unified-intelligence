import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard, SectionCard, Pill } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, X, Printer, ChartBar as BarChart3, Table2, TrendingUp, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, Gauge, Truck as TruckIcon, Droplet } from "lucide-react";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, AreaChart, Area, Legend, PieChart, Pie, Cell,
} from "recharts";
import {
  trucks, trips, drivers, incidents, maintenanceRecords, fuelTransactions,
  weekly, monthly, fleetBreakdown, costBreakdown,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/reports")({
  component: Reports,
});

type ReportId = "R-01" | "R-02" | "R-03" | "R-04" | "R-05" | "R-06";

interface ReportMeta {
  id: ReportId;
  name: string;
  schedule: string;
  format: string;
  owner: string;
  size: string;
  date: string;
  period: string;
  summary: string;
}

const reports: ReportMeta[] = [
  { id: "R-01", name: "Monthly Fleet Utilization", schedule: "Every Monday", format: "PDF", owner: "Adeleke O.", size: "2.4 MB", date: "2026-07-08", period: "Jun 08 – Jul 08, 2026", summary: "Fleet utilization averaged 81.7% across 128 vehicles. On-the-road volume held steady while idle time dropped 3% week-over-week. Four trucks remain offline pending diagnostics." },
  { id: "R-02", name: "Fuel Cost Analysis", schedule: "Weekly", format: "Excel", owner: "Bola A.", size: "1.8 MB", date: "2026-07-10", period: "Jul 04 – Jul 10, 2026", summary: "Fuel spend rose 8.4% versus the prior week, driven by three high-consumption routes. Diesel accounts for 78% of volume. Recommended rerouting on the Lagos–Kano corridor to recover ₦4.2M." },
  { id: "R-03", name: "Driver Performance Scorecard", schedule: "Bi-Weekly", format: "PDF", owner: "Chinedu O.", size: "3.1 MB", date: "2026-07-05", period: "Jun 21 – Jul 05, 2026", summary: "Average driver score is 78/100. Three drivers flagged high-risk due to repeated violations. Twelve drivers completed additional training. Overall incident rate down 12%." },
  { id: "R-04", name: "Incident & Safety Summary", schedule: "Monthly", format: "PDF", owner: "Yakubu D.", size: "2.0 MB", date: "2026-07-01", period: "Jun 01 – Jul 01, 2026", summary: "14 incidents recorded this month — 4 open, 3 under investigation, 7 resolved. Critical incidents down 25%. Estimated financial impact ₦2.6M. Root causes dominated by fatigue and mechanical faults." },
  { id: "R-05", name: "Maintenance Cost Report", schedule: "Monthly", format: "Excel", owner: "Kunle P.", size: "1.5 MB", date: "2026-07-01", period: "Jun 01 – Jul 01, 2026", summary: "22 service events completed or scheduled. Total maintenance spend ₦3.9M. Two overdue items escalated. Routine servicing accounts for 64% of work orders." },
  { id: "R-06", name: "Delivery KPI Dashboard", schedule: "Daily", format: "CSV", owner: "Ifeanyi N.", size: "0.4 MB", date: "2026-07-14", period: "Jul 08 – Jul 14, 2026", summary: "On-time delivery at 89.2%, below the 95% target. 11 delayed trips this week. Average delay 47 minutes. Lagos–Ibadan corridor is the primary contributor to slippage." },
];

function Reports() {
  const [readerReport, setReaderReport] = useState<ReportMeta | null>(null);

  function handleDownload(r: ReportMeta, format: string) {
    toast.success(`Downloading "${r.name}" as ${format}…`);
  }

  return (
    <>
      <Header title="Reports" subtitle="Generated fleet analytics and operational reports" showExport={false} />
      <div className="space-y-6 p-8">
        <SectionCard title="Reports">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {reports.map((r) => (
              <GlassCard key={r.id} className="cursor-pointer" hover={true}>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15"><FileText className="h-5 w-5 text-primary" /></div>
                  <Pill tone="info">{r.format}</Pill>
                </div>
                <div className="mt-3 text-sm font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.schedule} • {r.owner} • {r.size}</div>
                <div className="text-[11px] text-muted-foreground mt-1">Generated: {r.date}</div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 border-border bg-elevated/60 text-xs" onClick={() => handleDownload(r, "PDF")}><Download className="mr-1 h-3 w-3" />PDF</Button>
                  <Button size="sm" variant="outline" className="h-7 border-border bg-elevated/60 text-xs" onClick={() => handleDownload(r, "DOC")}><Download className="mr-1 h-3 w-3" />DOC</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setReaderReport(r)}><Eye className="mr-1 h-3 w-3" />View</Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </SectionCard>
      </div>

      {readerReport && (
        <ReportReader
          report={readerReport}
          onClose={() => setReaderReport(null)}
          onDownload={(fmt) => handleDownload(readerReport, fmt)}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Report reader dialog                                                */
/* ------------------------------------------------------------------ */

function ReportReader({ report, onClose, onDownload }: {
  report: ReportMeta;
  onClose: () => void;
  onDownload: (fmt: string) => void;
}) {
  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="flex-row items-center justify-between border-b border-border/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15"><FileText className="h-5 w-5 text-primary" /></div>
            <div>
              <DialogTitle className="text-base">{report.name}</DialogTitle>
              <div className="text-xs text-muted-foreground">{report.period} • {report.owner}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 border-border" onClick={() => toast.info("Sending to printer…")}><Printer className="mr-1.5 h-3.5 w-3.5" />Print</Button>
            <Button size="sm" variant="outline" className="h-8 border-border" onClick={() => onDownload("PDF")}><Download className="mr-1.5 h-3.5 w-3.5" />PDF</Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 px-6 py-5">
          <ReportSummary report={report} />
          <ReportBody id={report.id} />
          <ReportFooter report={report} onDownload={onDownload} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReportSummary({ report }: { report: ReportMeta }) {
  return (
    <div className="rounded-xl border border-border/60 bg-elevated/40 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <BarChart3 className="h-3.5 w-3.5" /> Executive Summary
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{report.summary}</p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
        <span>Report ID: <span className="font-medium text-foreground">{report.id}</span></span>
        <span>Format: <span className="font-medium text-foreground">{report.format}</span></span>
        <span>Schedule: <span className="font-medium text-foreground">{report.schedule}</span></span>
        <span>File size: <span className="font-medium text-foreground">{report.size}</span></span>
        <span>Generated: <span className="font-medium text-foreground">{report.date}</span></span>
      </div>
    </div>
  );
}

function ReportBody({ id }: { id: ReportId }) {
  switch (id) {
    case "R-01": return <FleetUtilizationBody />;
    case "R-02": return <FuelCostBody />;
    case "R-03": return <DriverScorecardBody />;
    case "R-04": return <IncidentSafetyBody />;
    case "R-05": return <MaintenanceCostBody />;
    case "R-06": return <DeliveryKpiBody />;
  }
}

function ReportFooter({ report, onDownload }: { report: ReportMeta; onDownload: (fmt: string) => void }) {
  return (
    <div className="flex items-center justify-between border-t border-border/60 pt-4">
      <div className="text-xs text-muted-foreground">
        Prepared by <span className="font-medium text-foreground">{report.owner}</span> • PrimeLex Logistics UIS
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="border-border" onClick={() => onDownload("PDF")}><Download className="mr-1.5 h-3.5 w-3.5" />PDF</Button>
        <Button size="sm" variant="outline" className="border-border" onClick={() => onDownload("DOC")}><Download className="mr-1.5 h-3.5 w-3.5" />DOC</Button>
        <Button size="sm" variant="outline" className="border-border" onClick={() => onDownload("CSV")}><Download className="mr-1.5 h-3.5 w-3.5" />CSV</Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared sub-components                                               */
/* ------------------------------------------------------------------ */

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      <Icon className="h-4 w-4 text-primary" /> {children}
    </div>
  );
}

function StatTile({ label, value, tone }: { label: string; value: string; tone: "default" | "success" | "warning" | "danger" | "info" }) {
  const toneClass = {
    default: "bg-elevated/40 text-foreground",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400",
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  }[tone];
  return (
    <div className={`rounded-lg border border-border/60 p-3 ${toneClass}`}>
      <div className="text-[10px] uppercase tracking-wider opacity-70">{label}</div>
      <div className="mt-0.5 text-lg font-semibold">{value}</div>
    </div>
  );
}

const CHART_HEIGHT = 220;

/* ------------------------------------------------------------------ */
/* R-01 Fleet Utilization                                              */
/* ------------------------------------------------------------------ */

function FleetUtilizationBody() {
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    trucks.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1; });
    return fleetBreakdown.map((f) => ({ name: f.name, value: counts[f.name] ?? f.value, color: f.color }));
  }, []);

  const utilizationTrend = monthly.slice(-8).map((m) => ({
    m: m.m, utilization: 72 + ((Math.round(m.cost / 50)) % 18), trips: 90 + ((Math.round(m.revenue / 40)) % 40),
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total Vehicles" value="128" tone="info" />
        <StatTile label="Avg Utilization" value="81.7%" tone="success" />
        <StatTile label="On The Road" value="98" tone="success" />
        <StatTile label="Offline" value="8" tone="danger" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <SectionTitle icon={Gauge}>Fleet Status Breakdown</SectionTitle>
          <div className="rounded-xl border border-border/60 p-4" style={{ height: CHART_HEIGHT + 40 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusCounts} innerRadius={50} outerRadius={78} paddingAngle={2.5} dataKey="value">
                  {statusCounts.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-2">
          <SectionTitle icon={TrendingUp}>Utilization Trend (8 mo)</SectionTitle>
          <div className="rounded-xl border border-border/60 p-4" style={{ height: CHART_HEIGHT + 40 }}>
            <ResponsiveContainer>
              <AreaChart data={utilizationTrend}>
                <defs><linearGradient id="utilG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="m" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip />
                <Area type="monotone" dataKey="utilization" stroke="var(--primary)" fill="url(#utilG)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <SectionTitle icon={Table2}>Vehicle Status Detail</SectionTitle>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-xs">
            <thead className="bg-elevated/60 text-muted-foreground">
              <tr><th className="px-3 py-2 text-left font-medium">Plate</th><th className="px-3 py-2 text-left font-medium">Model</th><th className="px-3 py-2 text-left font-medium">Driver</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-right font-medium">Fuel</th><th className="px-3 py-2 text-right font-medium">Odometer</th></tr>
            </thead>
            <tbody>
              {trucks.slice(0, 10).map((t) => (
                <tr key={t.id} className="border-t border-border/40">
                  <td className="px-3 py-2 font-medium">{t.plate}</td>
                  <td className="px-3 py-2 text-muted-foreground">{t.model}</td>
                  <td className="px-3 py-2">{t.driver}</td>
                  <td className="px-3 py-2"><Pill tone={t.status === "On The Road" ? "success" : t.status === "Maintenance" ? "danger" : t.status === "Idle" ? "warning" : "info"}>{t.status}</Pill></td>
                  <td className="px-3 py-2 text-right">{t.fuel}%</td>
                  <td className="px-3 py-2 text-right">{t.odometer.toLocaleString()} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-muted-foreground">Showing 10 of 128 vehicles.</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* R-02 Fuel Cost Analysis                                             */
/* ------------------------------------------------------------------ */

function FuelCostBody() {
  const topSpend = useMemo(() => {
    const byTruck: Record<string, number> = {};
    fuelTransactions.forEach((f) => { byTruck[f.truck] = (byTruck[f.truck] || 0) + f.amount; });
    return Object.entries(byTruck).map(([truck, amount]) => ({ truck, amount: Math.round(amount / 1000) })).sort((a, b) => b.amount - a.amount).slice(0, 8);
  }, []);

  const weeklyFuel = weekly.map((w) => ({ day: w.day, cost: w.fuel * 15, volume: w.fuel * 22 }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total Spend" value="₦639M" tone="danger" />
        <StatTile label="Vs Last Week" value="+8.4%" tone="danger" />
        <StatTile label="Diesel Share" value="78%" tone="info" />
        <StatTile label="Recovery Potential" value="₦4.2M" tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <SectionTitle icon={TrendingUp}>Daily Fuel Cost (this week)</SectionTitle>
          <div className="rounded-xl border border-border/60 p-4" style={{ height: CHART_HEIGHT + 40 }}>
            <ResponsiveContainer>
              <BarChart data={weeklyFuel}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="cost" fill="var(--info)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-2">
          <SectionTitle icon={Table2}>Cost Composition</SectionTitle>
          <div className="rounded-xl border border-border/60 p-4" style={{ height: CHART_HEIGHT + 40 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={costBreakdown} innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                  {costBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <SectionTitle icon={Droplet}>Top 8 Trucks by Fuel Spend (₦'000)</SectionTitle>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-xs">
            <thead className="bg-elevated/60 text-muted-foreground">
              <tr><th className="px-3 py-2 text-left font-medium">Truck</th><th className="px-3 py-2 text-right font-medium">Spend (₦'000)</th><th className="px-3 py-2 text-right font-medium">Volume (L)</th><th className="px-3 py-2 text-left font-medium">Flag</th></tr>
            </thead>
            <tbody>
              {topSpend.map((t, i) => (
                <tr key={t.truck} className="border-t border-border/40">
                  <td className="px-3 py-2 font-medium">{t.truck}</td>
                  <td className="px-3 py-2 text-right">{t.amount.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">{Math.round(t.amount * 1.05).toLocaleString()}</td>
                  <td className="px-3 py-2"><Pill tone={i < 3 ? "danger" : "warning"}>{i < 3 ? "Over target" : "Near target"}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* R-03 Driver Performance Scorecard                                   */
/* ------------------------------------------------------------------ */

function DriverScorecardBody() {
  const sorted = useMemo(() => [...drivers].sort((a, b) => b.score - a.score), []);
  const riskCounts = useMemo(() => {
    const c: Record<string, number> = { Low: 0, Medium: 0, High: 0 };
    drivers.forEach((d) => { c[d.risk]++; });
    return [
      { name: "Low Risk", value: c.Low, color: "var(--success)" },
      { name: "Medium Risk", value: c.Medium, color: "var(--warning)" },
      { name: "High Risk", value: c.High, color: "var(--danger)" },
    ];
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Drivers" value="20" tone="info" />
        <StatTile label="Avg Score" value="78/100" tone="success" />
        <StatTile label="High-Risk" value="3" tone="danger" />
        <StatTile label="Trainings Done" value="12" tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-2">
          <SectionTitle icon={Gauge}>Risk Distribution</SectionTitle>
          <div className="rounded-xl border border-border/60 p-4" style={{ height: CHART_HEIGHT + 40 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={riskCounts} innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                  {riskCounts.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-2 lg:col-span-2">
          <SectionTitle icon={TrendingUp}>Score Distribution (top 10)</SectionTitle>
          <div className="rounded-xl border border-border/60 p-4" style={{ height: CHART_HEIGHT + 40 }}>
            <ResponsiveContainer>
              <BarChart data={sorted.slice(0, 10).map((d) => ({ name: d.name, score: d.score }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="score" fill="var(--primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <SectionTitle icon={Table2}>Full Scorecard</SectionTitle>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-xs">
            <thead className="bg-elevated/60 text-muted-foreground">
              <tr><th className="px-3 py-2 text-left font-medium">Driver</th><th className="px-3 py-2 text-left font-medium">License</th><th className="px-3 py-2 text-right font-medium">Score</th><th className="px-3 py-2 text-left font-medium">Risk</th><th className="px-3 py-2 text-right font-medium">Violations</th><th className="px-3 py-2 text-right font-medium">Trainings</th><th className="px-3 py-2 text-left font-medium">Status</th></tr>
            </thead>
            <tbody>
              {sorted.map((d) => (
                <tr key={d.id} className="border-t border-border/40">
                  <td className="px-3 py-2 font-medium">{d.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{d.license}</td>
                  <td className="px-3 py-2 text-right font-medium">{d.score}</td>
                  <td className="px-3 py-2"><Pill tone={d.risk === "Low" ? "success" : d.risk === "Medium" ? "warning" : "danger"}>{d.risk}</Pill></td>
                  <td className="px-3 py-2 text-right">{d.violations}</td>
                  <td className="px-3 py-2 text-right">{d.trainings}</td>
                  <td className="px-3 py-2">{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* R-04 Incident & Safety Summary                                      */
/* ------------------------------------------------------------------ */

function IncidentSafetyBody() {
  const byType = useMemo(() => {
    const c: Record<string, number> = {};
    incidents.forEach((i) => { c[i.type] = (c[i.type] || 0) + 1; });
    return Object.entries(c).map(([name, value]) => ({ name, value }));
  }, []);

  const byStatus = useMemo(() => {
    const c: Record<string, number> = {};
    incidents.forEach((i) => { c[i.status] = (c[i.status] || 0) + 1; });
    return [
      { name: "Open", value: c.Open || 0, color: "var(--danger)" },
      { name: "Investigating", value: c.Investigating || 0, color: "var(--warning)" },
      { name: "Resolved", value: c.Resolved || 0, color: "var(--success)" },
    ];
  }, []);

  const totalImpact = incidents.reduce((s, i) => s + i.estFinancialImpact, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total Incidents" value="14" tone="danger" />
        <StatTile label="Open" value="4" tone="danger" />
        <StatTile label="Resolved" value="7" tone="success" />
        <StatTile label="Fin. Impact" value={`₦${(totalImpact / 1000000).toFixed(1)}M`} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <SectionTitle icon={AlertTriangle}>Incidents by Type</SectionTitle>
          <div className="rounded-xl border border-border/60 p-4" style={{ height: CHART_HEIGHT + 40 }}>
            <ResponsiveContainer>
              <BarChart data={byType}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="var(--muted-foreground)" interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="value" fill="var(--danger)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-2">
          <SectionTitle icon={Gauge}>Resolution Status</SectionTitle>
          <div className="rounded-xl border border-border/60 p-4" style={{ height: CHART_HEIGHT + 40 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byStatus} innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                  {byStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <SectionTitle icon={Table2}>Incident Log</SectionTitle>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-xs">
            <thead className="bg-elevated/60 text-muted-foreground">
              <tr><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Type</th><th className="px-3 py-2 text-left font-medium">Severity</th><th className="px-3 py-2 text-left font-medium">Date</th><th className="px-3 py-2 text-left font-medium">Root Cause</th><th className="px-3 py-2 text-right font-medium">Impact</th><th className="px-3 py-2 text-left font-medium">Status</th></tr>
            </thead>
            <tbody>
              {incidents.map((i) => (
                <tr key={i.id} className="border-t border-border/40">
                  <td className="px-3 py-2 font-medium">{i.id}</td>
                  <td className="px-3 py-2">{i.type}</td>
                  <td className="px-3 py-2"><Pill tone={i.severity === "Critical" ? "danger" : i.severity === "High" ? "danger" : i.severity === "Moderate" ? "warning" : "info"}>{i.severity}</Pill></td>
                  <td className="px-3 py-2 text-muted-foreground">{i.date}</td>
                  <td className="px-3 py-2">{i.rootCause}</td>
                  <td className="px-3 py-2 text-right">₦{i.estFinancialImpact.toLocaleString()}</td>
                  <td className="px-3 py-2"><Pill tone={i.status === "Resolved" ? "success" : i.status === "Investigating" ? "warning" : "danger"}>{i.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* R-05 Maintenance Cost Report                                        */
/* ------------------------------------------------------------------ */

function MaintenanceCostBody() {
  const byType = useMemo(() => {
    const c: Record<string, number> = {};
    maintenanceRecords.forEach((r) => { c[r.type] = (c[r.type] || 0) + r.cost; });
    return Object.entries(c).map(([name, value]) => ({ name, value: Math.round(value / 1000) }));
  }, []);

  const totalCost = maintenanceRecords.reduce((s, r) => s + r.cost, 0);
  const overdue = maintenanceRecords.filter((r) => r.status === "Overdue").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Service Events" value="22" tone="info" />
        <StatTile label="Total Cost" value={`₦${(totalCost / 1000000).toFixed(1)}M`} tone="warning" />
        <StatTile label="Overdue" value={String(overdue)} tone="danger" />
        <StatTile label="Completed" value={String(maintenanceRecords.filter((r) => r.status === "Completed").length)} tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <SectionTitle icon={TrendingUp}>Cost by Service Type (₦'000)</SectionTitle>
          <div className="rounded-xl border border-border/60 p-4" style={{ height: CHART_HEIGHT + 40 }}>
            <ResponsiveContainer>
              <BarChart data={byType}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="value" fill="var(--success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-2">
          <SectionTitle icon={Gauge}>Work Order Status</SectionTitle>
          <div className="rounded-xl border border-border/60 p-4" style={{ height: CHART_HEIGHT + 40 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={[
                  { name: "Scheduled", value: maintenanceRecords.filter((r) => r.status === "Scheduled").length, color: "var(--info)" },
                  { name: "In Workshop", value: maintenanceRecords.filter((r) => r.status === "In Workshop").length, color: "var(--warning)" },
                  { name: "Completed", value: maintenanceRecords.filter((r) => r.status === "Completed").length, color: "var(--success)" },
                  { name: "Overdue", value: maintenanceRecords.filter((r) => r.status === "Overdue").length, color: "var(--danger)" },
                ]} innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                  {(data) => data.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <SectionTitle icon={Table2}>Maintenance Log</SectionTitle>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-xs">
            <thead className="bg-elevated/60 text-muted-foreground">
              <tr><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Truck</th><th className="px-3 py-2 text-left font-medium">Service</th><th className="px-3 py-2 text-left font-medium">Type</th><th className="px-3 py-2 text-right font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Status</th></tr>
            </thead>
            <tbody>
              {maintenanceRecords.map((r) => (
                <tr key={r.id} className="border-t border-border/40">
                  <td className="px-3 py-2 font-medium">{r.id}</td>
                  <td className="px-3 py-2">{r.truck}</td>
                  <td className="px-3 py-2">{r.service}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.type}</td>
                  <td className="px-3 py-2 text-right">₦{r.cost.toLocaleString()}</td>
                  <td className="px-3 py-2"><Pill tone={r.status === "Completed" ? "success" : r.status === "Overdue" ? "danger" : r.status === "In Workshop" ? "warning" : "info"}>{r.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* R-06 Delivery KPI Dashboard                                         */
/* ------------------------------------------------------------------ */

function DeliveryKpiBody() {
  const statusCounts = useMemo(() => {
    const c: Record<string, number> = {};
    trips.forEach((t) => { c[t.status] = (c[t.status] || 0) + 1; });
    return [
      { name: "In Transit", value: c["In Transit"] || 0, color: "var(--info)" },
      { name: "Delivered", value: c.Delivered || 0, color: "var(--success)" },
      { name: "Delayed", value: c.Delayed || 0, color: "var(--warning)" },
      { name: "Scheduled", value: c.Scheduled || 0, color: "var(--muted-foreground)" },
    ];
  }, []);

  const delayed = trips.filter((t) => t.status === "Delayed");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="On-Time Rate" value="89.2%" tone="warning" />
        <StatTile label="Target" value="95%" tone="info" />
        <StatTile label="Delayed Trips" value="11" tone="danger" />
        <StatTile label="Avg Delay" value="47 min" tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <SectionTitle icon={TrendingUp}>Weekly Delivery Performance</SectionTitle>
          <div className="rounded-xl border border-border/60 p-4" style={{ height: CHART_HEIGHT + 40 }}>
            <ResponsiveContainer>
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="onTime" stackId="a" fill="var(--success)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="delayed" stackId="a" fill="var(--warning)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-2">
          <SectionTitle icon={Gauge}>Trip Status Mix</SectionTitle>
          <div className="rounded-xl border border-border/60 p-4" style={{ height: CHART_HEIGHT + 40 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusCounts} innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                  {statusCounts.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {delayed.length > 0 && (
        <div className="space-y-2">
          <SectionTitle icon={AlertTriangle}>Delayed Trips Requiring Attention</SectionTitle>
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full text-xs">
              <thead className="bg-elevated/60 text-muted-foreground">
                <tr><th className="px-3 py-2 text-left font-medium">Trip</th><th className="px-3 py-2 text-left font-medium">Customer</th><th className="px-3 py-2 text-left font-medium">Route</th><th className="px-3 py-2 text-left font-medium">Driver</th><th className="px-3 py-2 text-right font-medium">Distance</th><th className="px-3 py-2 text-left font-medium">Priority</th></tr>
              </thead>
              <tbody>
                {delayed.map((t) => (
                  <tr key={t.id} className="border-t border-border/40">
                    <td className="px-3 py-2 font-medium">{t.id}</td>
                    <td className="px-3 py-2">{t.customer}</td>
                    <td className="px-3 py-2 text-muted-foreground">{t.origin} → {t.destination}</td>
                    <td className="px-3 py-2">{t.driver}</td>
                    <td className="px-3 py-2 text-right">{t.distance} km</td>
                    <td className="px-3 py-2"><Pill tone={t.priority === "Critical" ? "danger" : t.priority === "High" ? "danger" : t.priority === "Medium" ? "warning" : "info"}>{t.priority}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" /> Recommendation
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Reroute Lagos–Ibadan corridor trips via the Lagos–Ibadan Expressway to reduce average delay by an estimated 18 minutes and recover the on-time rate toward the 95% target.</p>
      </div>
    </div>
  );
}
