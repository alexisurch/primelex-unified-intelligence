import {
  CalendarClock,
  FileText,
  FileSpreadsheet,
  FileJson,
  Download,
  Eye,
  BarChart3,
  Truck,
  Fuel,
  ShieldCheck,
  Wrench,
  Wallet,
  Users,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";
import { Header } from "@/components/layout/Header";
import { GlassCard, SectionCard, Pill } from "@/components/shared/Cards";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type ReportFormat = "PDF" | "CSV" | "XLSX";

interface ScheduledReport {
  id: string;
  name: string;
  schedule: string;
  owner: string;
  format: ReportFormat;
  icon: ComponentType<LucideProps>;
}

interface SavedReport {
  id: string;
  name: string;
  description: string;
  generatedOn: string;
  format: ReportFormat;
  size: string;
}

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const formatTone: Record<ReportFormat, "info" | "success" | "purple"> = {
  PDF: "danger" as never,
  CSV: "success",
  XLSX: "info",
};

const formatIcon: Record<ReportFormat, ComponentType<LucideProps>> = {
  PDF: FileText,
  CSV: FileSpreadsheet,
  XLSX: FileJson,
};

const scheduledReports: ScheduledReport[] = [
  {
    id: "SCH-001",
    name: "Weekly Fleet Performance",
    schedule: "Every Monday · 07:00",
    owner: "Alex Morgan",
    format: "PDF",
    icon: Truck,
  },
  {
    id: "SCH-002",
    name: "Monthly Fuel Consumption",
    schedule: "1st of month · 08:00",
    owner: "Priya Shah",
    format: "XLSX",
    icon: Fuel,
  },
  {
    id: "SCH-003",
    name: "Quarterly Safety Audit",
    schedule: "Quarterly · 09:00",
    owner: "Diego Reyes",
    format: "PDF",
    icon: ShieldCheck,
  },
  {
    id: "SCH-004",
    name: "Daily Maintenance Log",
    schedule: "Daily · 18:00",
    owner: "Alex Morgan",
    format: "CSV",
    icon: Wrench,
  },
  {
    id: "SCH-005",
    name: "Monthly Cost Breakdown",
    schedule: "1st of month · 08:30",
    owner: "Priya Shah",
    format: "XLSX",
    icon: Wallet,
  },
  {
    id: "SCH-006",
    name: "Weekly Driver Activity",
    schedule: "Every Friday · 17:00",
    owner: "Diego Reyes",
    format: "PDF",
    icon: Users,
  },
];

const savedReports: SavedReport[] = [
  {
    id: "RPT-001",
    name: "Fleet Performance — Nov 2024",
    description: "Utilization, on-time rate and trip volume by route.",
    generatedOn: "Nov 18, 2024",
    format: "PDF",
    size: "1.8 MB",
  },
  {
    id: "RPT-002",
    name: "Fuel Consumption — Oct 2024",
    description: "Per-truck fuel spend and efficiency trends.",
    generatedOn: "Nov 02, 2024",
    format: "XLSX",
    size: "642 KB",
  },
  {
    id: "RPT-003",
    name: "Safety Audit — Q3 2024",
    description: "Incident counts, severity and resolution times.",
    generatedOn: "Oct 15, 2024",
    format: "PDF",
    size: "3.1 MB",
  },
  {
    id: "RPT-004",
    name: "Maintenance Log — Nov W3",
    description: "Completed, scheduled and overdue services.",
    generatedOn: "Nov 17, 2024",
    format: "CSV",
    size: "128 KB",
  },
  {
    id: "RPT-005",
    name: "Cost Breakdown — Oct 2024",
    description: "Fuel, maintenance, salaries and overhead.",
    generatedOn: "Nov 01, 2024",
    format: "XLSX",
    size: "518 KB",
  },
  {
    id: "RPT-006",
    name: "Driver Activity — Nov W2",
    description: "Trips, scores, violations and hours per driver.",
    generatedOn: "Nov 12, 2024",
    format: "PDF",
    size: "2.4 MB",
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function Reports() {
  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Reports"
        subtitle="Scheduled and saved fleet reports — download or view anytime."
      />

      {/* Scheduled Reports */}
      <SectionCard
        title="Scheduled Reports"
        action={
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" strokeWidth={2} />
            {scheduledReports.length} active schedules
          </span>
        }
      >
        <ul className="flex flex-col divide-y divide-border/40 rounded-lg border border-border/40 bg-white/[0.02]">
          {scheduledReports.map((report) => {
            const Icon = report.icon;
            return (
              <li
                key={report.id}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/[0.03]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {report.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {report.schedule} · {report.owner}
                  </span>
                </div>
                <Pill tone={formatTone[report.format]}>{report.format}</Pill>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      {/* Saved Reports */}
      <SectionCard
        title="Saved Reports"
        action={
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5" strokeWidth={2} />
            {savedReports.length} reports available
          </span>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedReports.map((report) => {
            const FormatIcon = formatIcon[report.format];
            return (
              <GlassCard key={report.id} className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <FormatIcon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <Pill tone={formatTone[report.format]}>{report.format}</Pill>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">
                    {report.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {report.description}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{report.generatedOn}</span>
                  <span>{report.size}</span>
                </div>

                <div className="mt-auto flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-border/60 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                  >
                    <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                    View
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-primary text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Download className="h-3.5 w-3.5" strokeWidth={2} />
                    Download
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

export default Reports;
