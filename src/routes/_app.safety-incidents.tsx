import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill, SectionCard } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { AIInsight } from "@/components/shared/Insights";
import { incidents, type Incident } from "@/lib/mock-data";
import { ShieldAlert, AlertOctagon, FileWarning, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_app/safety-incidents")({
  component: SafetyIncidents,
});

const sevTone = { Low: "info", Moderate: "warning", High: "danger", Critical: "purple" } as const;
const stTone = { Open: "danger", Investigating: "warning", Resolved: "success" } as const;

function SafetyIncidents() {
  const cols: Column<Incident>[] = [
    { key: "id", label: "Incident", render: (r) => <span className="font-semibold text-primary">{r.id}</span> },
    { key: "type", label: "Type", render: (r) => <Pill tone="info">{r.type}</Pill> },
    { key: "driver", label: "Driver" },
    { key: "truck", label: "Truck" },
    { key: "location", label: "Location" },
    { key: "date", label: "Date" },
    { key: "severity", label: "Severity", render: (r) => <Pill tone={sevTone[r.severity]}>{r.severity}</Pill> },
    { key: "rootCause", label: "Root Cause", render: (r) => <span className="text-xs text-muted-foreground">{r.rootCause}</span> },
    { key: "status", label: "Status", render: (r) => <Pill tone={stTone[r.status]}>{r.status}</Pill> },
  ];
  return (
    <>
      <Header title="Safety & Incidents" subtitle="Track incidents, root causes, corrective actions and safety score" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Safety Score" value="92" icon={ShieldAlert} tone="success" delta={{ value: "2.4", direction: "up" }} />
          <KPICard label="Open Incidents" value="7" icon={AlertOctagon} tone="danger" footnote="3 critical" />
          <KPICard label="Insurance Claims" value="₦42M" icon={FileWarning} tone="warning" delta={{ value: "12%", direction: "down" }} />
          <KPICard label="Near Miss Reports" value="18" icon={TrendingUp} tone="purple" delta={{ value: "4", direction: "up" }} />
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <SectionCard className="xl:col-span-2" title="Incident Register">
            <DataTable columns={cols} rows={incidents} searchKeys={["id","driver","truck","location"]} pageSize={7} />
          </SectionCard>
          <AIInsight title="AI Risk Detection" insights={[
            { label: "TRK-1004 driver fatigue risk", detail: "9 consecutive hours logged, exceeds threshold" },
            { label: "Route Lagos → Ibadan risk score up 18%", detail: "3 near-miss reports in last 14 days" },
            { label: "Retrain 4 drivers on defensive driving", detail: "Based on incident patterns and severity" },
          ]}/>
        </div>
      </div>
    </>
  );
}
