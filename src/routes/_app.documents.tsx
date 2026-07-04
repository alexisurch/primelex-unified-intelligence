import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill, SectionCard } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { documents, type DocumentRow } from "@/lib/mock-data";
import { FileText, ShieldCheck, AlertTriangle, Upload, Download, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/documents")({
  component: Documents,
});

const stTone = { Valid: "success", Expiring: "warning", Expired: "danger" } as const;

function Documents() {
  const cols: Column<DocumentRow>[] = [
    { key: "id", label: "Doc ID", render: (r) => <span className="font-semibold text-primary">{r.id}</span> },
    { key: "name", label: "Document" },
    { key: "type", label: "Type", render: (r) => <Pill tone="info">{r.type}</Pill> },
    { key: "owner", label: "Owner" },
    { key: "expiry", label: "Expiry" },
    { key: "version", label: "Version" },
    { key: "status", label: "Status", render: (r) => <Pill tone={stTone[r.status]}>{r.status}</Pill> },
    { key: "id", label: "Actions", render: () => (
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" className="h-7 w-7"><Download className="h-3.5 w-3.5"/></Button>
        <Button size="icon" variant="ghost" className="h-7 w-7"><History className="h-3.5 w-3.5"/></Button>
      </div>
    )},
  ];
  return (
    <>
      <Header title="Documents" subtitle="Central document vault with expiry tracking and approval workflows" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Total Documents" value="428" icon={FileText} tone="info" />
          <KPICard label="Valid" value="386" icon={ShieldCheck} tone="success" footnote="90.2% of total" />
          <KPICard label="Expiring Soon" value="28" icon={AlertTriangle} tone="warning" footnote="Next 30 days" />
          <KPICard label="Expired" value="14" icon={AlertTriangle} tone="danger" footnote="Action required" />
        </div>
        <SectionCard title="Document Vault" action={<Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30"><Upload className="mr-1.5 h-3.5 w-3.5"/>Upload</Button>}>
          <DataTable columns={cols} rows={documents} searchKeys={["id","name","owner"]} pageSize={9} />
        </SectionCard>
      </div>
    </>
  );
}
