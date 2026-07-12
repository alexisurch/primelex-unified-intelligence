import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { History, Search, ListFilter as Filter, RefreshCw, Download } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { KPICard, SectionCard, Pill } from "@/components/shared/Cards";
import { fetchAuditTrail, type DbAuditEntry } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/audit-trail")({
  component: AuditTrailPage,
});

const ACTION_TONE: Record<string, "success" | "info" | "warning" | "danger" | "purple"> = {
  Created: "success",
  Updated: "info",
  "Status Changed": "warning",
  Deleted: "danger",
  Assigned: "info",
  Resolved: "success",
  Escalated: "danger",
};

const MODULES = ["All Modules", "Trips", "Fleet", "Drivers", "Incidents", "Fuel Intelligence", "Maintenance", "Routes", "Clients", "Documents", "Action Center", "Operations"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function AuditRow({ entry }: { entry: DbAuditEntry }) {
  const [expanded, setExpanded] = useState(false);
  const tone = ACTION_TONE[entry.action] ?? "info";
  const hasDetails = !!(entry.field_name || entry.previous_value || entry.new_value || entry.notes);

  return (
    <tr
      className={cn("border-b border-border/30 transition-colors hover:bg-white/[0.02]", expanded && "bg-white/[0.02]")}
      onClick={() => hasDetails && setExpanded((v) => !v)}
    >
      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {formatDate(entry.created_at)}
      </td>
      <td className="px-4 py-3">
        <Pill tone={tone}>{entry.action}</Pill>
      </td>
      <td className="px-4 py-3 text-sm font-medium text-foreground">
        {entry.entity_label || entry.entity_id}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{entry.module}</td>
      <td className="px-4 py-3 text-xs">
        <span className="font-medium text-foreground">{entry.changed_by}</span>
        <span className="ml-1 text-muted-foreground">· {entry.changed_by_role}</span>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {entry.field_name ? (
          <span>
            <span className="font-medium text-foreground/70">{entry.field_name}</span>
            {entry.previous_value && (
              <><span className="mx-1 text-danger line-through">{entry.previous_value}</span><span className="mx-1">→</span></>
            )}
            {entry.new_value && (
              <span className="text-success">{entry.new_value}</span>
            )}
          </span>
        ) : entry.notes ? (
          <span className="line-clamp-1">{entry.notes}</span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>
    </tr>
  );
}

function AuditTrailPage() {
  const [entries, setEntries] = useState<DbAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All Modules");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const mod = moduleFilter === "All Modules" ? undefined : moduleFilter;
      const data = await fetchAuditTrail(undefined, undefined, mod, 500);
      setEntries(data);
    } finally {
      setLoading(false);
    }
  }, [moduleFilter]);

  useEffect(() => { void load(); }, [load]);

  const filtered = entries.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      e.action.toLowerCase().includes(s) ||
      e.entity_label.toLowerCase().includes(s) ||
      e.changed_by.toLowerCase().includes(s) ||
      e.module.toLowerCase().includes(s) ||
      (e.field_name?.toLowerCase().includes(s) ?? false)
    );
  });

  const byAction: Record<string, number> = {};
  const byModule: Record<string, number> = {};
  entries.forEach((e) => {
    byAction[e.action] = (byAction[e.action] ?? 0) + 1;
    byModule[e.module] = (byModule[e.module] ?? 0) + 1;
  });
  const topAction = Object.entries(byAction).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const topModule = Object.entries(byModule).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return (
    <>
      <Header title="Audit Trail" subtitle="Complete searchable record of every operational change." showExport={false} />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPICard label="Total Events" value={entries.length} icon={History} tone="info" footnote="All time" />
          <KPICard label="Showing" value={filtered.length} icon={Filter} tone="success" footnote="After filters" />
          <KPICard label="Top Action" value={topAction} icon={RefreshCw} tone="warning" footnote={`${byAction[topAction] ?? 0} events`} />
          <KPICard label="Top Module" value={topModule} icon={History} tone="purple" footnote={`${byModule[topModule] ?? 0} events`} />
        </div>

        <SectionCard
          title="Event Log"
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search events…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 rounded-md border border-border/60 bg-elevated/60 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                />
              </div>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="h-8 rounded-md border border-border/60 bg-elevated/60 px-2 text-xs text-foreground focus:outline-none"
              >
                {MODULES.map((m) => <option key={m}>{m}</option>)}
              </select>
              <button
                type="button"
                onClick={() => void load()}
                className="flex h-8 items-center gap-1.5 rounded-md border border-border/60 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>
          }
        >
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading audit trail…</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {search ? "No matching events." : "No audit events yet. Events are recorded automatically as you use the system."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/40">
                    {["Date & Time", "Action", "Entity", "Module", "Changed By", "Change Detail"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => <AuditRow key={e.id} entry={e} />)}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
}
