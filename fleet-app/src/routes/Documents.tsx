import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import {
  KPICard,
  Pill,
  DataTable,
  type Column,
  type Tone,
} from "@/components/shared/Cards";
import {
  documents,
  type DocumentRecord,
  type DocumentStatus,
} from "@/lib/mock-data";

/* ------------------------------------------------------------------ */
/* Tone maps                                                           */
/* ------------------------------------------------------------------ */

const STATUS_TONE: Record<DocumentStatus, Tone> = {
  Valid: "success",
  "Expiring Soon": "warning",
  Expired: "danger",
};

/* ------------------------------------------------------------------ */
/* KPI computations                                                    */
/* ------------------------------------------------------------------ */

const valid = documents.filter((d) => d.status === "Valid").length;
const expiringSoon = documents.filter(
  (d) => d.status === "Expiring Soon",
).length;
const expired = documents.filter((d) => d.status === "Expired").length;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function Documents() {
  const rows = documents as unknown as Record<string, unknown>[];

  const columns: Column<Record<string, unknown>>[] = [
    { key: "id", label: "ID" },
    { key: "type", label: "Type" },
    { key: "owner", label: "Owner" },
    { key: "expiryDate", label: "Expiry Date" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const d = row as unknown as DocumentRecord;
        return <Pill tone={STATUS_TONE[d.status]}>{d.status}</Pill>;
      },
    },
    { key: "issuedBy", label: "Issued By" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Documents"
        subtitle="Vehicle registrations, licences, insurance and permits."
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          icon={FileText}
          label="Total Documents"
          value={documents.length}
          tone="info"
        />
        <KPICard
          icon={CheckCircle2}
          label="Valid"
          value={valid}
          tone="success"
        />
        <KPICard
          icon={Clock}
          label="Expiring Soon"
          value={expiringSoon}
          tone="warning"
        />
        <KPICard
          icon={XCircle}
          label="Expired"
          value={expired}
          tone="danger"
        />
      </div>

      {/* Documents table */}
      <DataTable
        columns={columns}
        rows={rows}
        searchKeys={["id", "type", "owner", "status", "issuedBy"]}
      />
    </div>
  );
}

export default Documents;
