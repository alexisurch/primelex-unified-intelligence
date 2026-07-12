import { useState, useEffect, useCallback } from "react";
import { History, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchAuditTrail, type DbAuditEntry } from "@/lib/supabase";

const ACTION_TONE: Record<string, string> = {
  Created: "text-success",
  Updated: "text-info",
  "Status Changed": "text-warning",
  Deleted: "text-danger",
  Assigned: "text-primary",
  Resolved: "text-success",
  Escalated: "text-danger",
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface AuditRowProps {
  entry: DbAuditEntry;
}
function AuditRow({ entry }: AuditRowProps) {
  const [expanded, setExpanded] = useState(false);
  const actionColor =
    ACTION_TONE[entry.action] ?? "text-muted-foreground";
  const hasDetails = entry.field_name || entry.previous_value || entry.new_value || entry.notes;

  return (
    <div className="group rounded-lg border border-border/40 bg-white/[0.015] transition-colors hover:bg-white/[0.03]">
      <button
        type="button"
        className="flex w-full items-start gap-3 px-3 py-2.5 text-left"
        onClick={() => hasDetails && setExpanded((v) => !v)}
      >
        {/* Timeline dot */}
        <div className="mt-1 flex h-5 w-5 shrink-0 flex-col items-center">
          <span className={cn("h-2 w-2 rounded-full bg-current", actionColor)} />
        </div>

        <div className="flex flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-semibold", actionColor)}>
              {entry.action}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs font-medium text-foreground">
              {entry.entity_label || entry.entity_id}
            </span>
            <span className="ml-auto text-[10px] text-muted-foreground">
              {relativeTime(entry.created_at)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground/80">{entry.changed_by}</span>
            <span>·</span>
            <span>{entry.changed_by_role}</span>
            <span>·</span>
            <span>{entry.module}</span>
          </div>
          {entry.field_name && !expanded && (
            <span className="text-[11px] text-muted-foreground">
              Changed <span className="font-medium text-foreground/70">{entry.field_name}</span>
            </span>
          )}
        </div>

        {hasDetails && (
          <ChevronDown
            className={cn(
              "mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        )}
      </button>

      {expanded && hasDetails && (
        <div className="border-t border-border/40 px-3 pb-3 pt-2">
          <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            {entry.field_name && (
              <div>
                <span className="text-muted-foreground">Field: </span>
                <span className="font-medium text-foreground">{entry.field_name}</span>
              </div>
            )}
            {entry.previous_value && (
              <div>
                <span className="text-muted-foreground">Before: </span>
                <span className="font-medium text-danger line-through">{entry.previous_value}</span>
              </div>
            )}
            {entry.new_value && (
              <div>
                <span className="text-muted-foreground">After: </span>
                <span className="font-medium text-success">{entry.new_value}</span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Time: </span>
              <span className="font-medium text-foreground">{formatDate(entry.created_at)}</span>
            </div>
            {entry.notes && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Note: </span>
                <span className="text-foreground">{entry.notes}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AuditTrailPanel                                                     */
/* ------------------------------------------------------------------ */

export interface AuditTrailPanelProps {
  entityType?: string;
  entityId?: string;
  module?: string;
  className?: string;
  limit?: number;
}

export function AuditTrailPanel({
  entityType,
  entityId,
  module,
  className,
  limit = 50,
}: AuditTrailPanelProps) {
  const [entries, setEntries] = useState<DbAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAuditTrail(entityType, entityId, module, limit);
      setEntries(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, module, limit]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = entries.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      e.action.toLowerCase().includes(s) ||
      e.entity_label.toLowerCase().includes(s) ||
      e.changed_by.toLowerCase().includes(s) ||
      e.module.toLowerCase().includes(s) ||
      (e.field_name?.toLowerCase().includes(s) ?? false) ||
      (e.notes?.toLowerCase().includes(s) ?? false)
    );
  });

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-muted-foreground" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Audit Trail
        </span>
        {entries.length > 0 && (
          <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-muted-foreground">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {entries.length > 3 && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search audit events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-white/[0.03] py-2 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      )}

      {loading ? (
        <div className="py-4 text-center text-xs text-muted-foreground">
          Loading audit history…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/50 py-6 text-center text-xs text-muted-foreground">
          {search ? "No matching audit events." : "No audit history yet."}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {filtered.map((e) => (
            <AuditRow key={e.id} entry={e} />
          ))}
        </div>
      )}
    </div>
  );
}
