import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { drivers, type Driver } from "@/lib/mock-data";
import { Users, ShieldCheck, GraduationCap, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/drivers-compliance")({
  component: DriversCompliance,
});

const riskTone = { Low: "success", Medium: "warning", High: "danger" } as const;
const statusTone = { Active: "success", "On Leave": "info", Suspended: "danger" } as const;

function DriversCompliance() {
  const cols: Column<Driver>[] = [
    { key: "id", label: "Driver ID", render: (r) => <span className="font-semibold text-primary">{r.id}</span> },
    { key: "name", label: "Name" },
    { key: "license", label: "License", render: (r) => <span className="text-xs text-muted-foreground">{r.license}</span> },
    { key: "licenseExpiry", label: "License Expiry" },
    { key: "medicalExpiry", label: "Medical" },
    { key: "score", label: "Score", render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/5">
          <div className={`h-full ${r.score >= 85 ? "bg-success" : r.score >= 70 ? "bg-warning" : "bg-danger"}`} style={{ width: `${r.score}%` }} />
        </div>
        <span className="text-xs">{r.score}</span>
      </div>
    )},
    { key: "risk", label: "Risk", render: (r) => <Pill tone={riskTone[r.risk]}>{r.risk}</Pill> },
    { key: "violations", label: "Violations" },
    { key: "status", label: "Status", render: (r) => <Pill tone={statusTone[r.status]}>{r.status}</Pill> },
  ];
  return (
    <>
      <Header title="Drivers & Compliance" subtitle="Monitor driver performance, licensing and safety compliance" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Total Drivers" value="184" icon={Users} tone="info" delta={{ value: "6", direction: "up" }} />
          <KPICard label="Compliance Rate" value="94.2%" icon={ShieldCheck} tone="success" delta={{ value: "1.4%", direction: "up" }} />
          <KPICard label="Trainings Complete" value="76%" icon={GraduationCap} tone="purple" footnote="Q2 target: 85%" />
          <KPICard label="Active Violations" value="12" icon={AlertTriangle} tone="warning" delta={{ value: "3", direction: "down" }} />
        </div>
        <DataTable title="Driver Directory" columns={cols} rows={drivers} searchKeys={["id","name","license"]} pageSize={10} />
      </div>
    </>
  );
}
