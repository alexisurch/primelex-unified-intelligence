import {
  useState,
  useMemo,
  type ReactNode,
  type ComponentType,
} from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Shared tone system                                                  */
/* ------------------------------------------------------------------ */

export type Tone = "info" | "success" | "warning" | "danger" | "purple";

/** Background tint utilities per tone (15% opacity). */
const toneBg15: Record<Tone, string> = {
  info: "bg-info/15",
  success: "bg-success/15",
  warning: "bg-warning/15",
  danger: "bg-danger/15",
  purple: "bg-purple/15",
};

/** Solid text color utilities per tone. */
const toneText: Record<Tone, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  purple: "text-purple",
};

/** Solid background utilities per tone (for dots / fills). */
const toneBgSolid: Record<Tone, string> = {
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  purple: "bg-purple",
};

/* ------------------------------------------------------------------ */
/* GlassCard                                                           */
/* ------------------------------------------------------------------ */

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Enable hover lift / border highlight. Defaults to true. */
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-white/[0.02] backdrop-blur p-5",
        "transition-all duration-200",
        hover &&
          "hover:bg-white/[0.04] hover:border-primary/40 hover:shadow-lg hover:shadow-black/20",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SectionCard                                                         */
/* ------------------------------------------------------------------ */

export interface SectionCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/60 bg-white/[0.02] p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-wide text-foreground">
          {title}
        </h3>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* KPICard                                                             */
/* ------------------------------------------------------------------ */

export interface KPIDelta {
  /** Numeric or string value of the change, e.g. "+12" or "-3.4". */
  value: string | number;
  direction: "up" | "down";
  /** Optional label describing the delta, e.g. "vs last week". */
  label?: string;
}

export interface KPICardProps {
  /** Lucide icon component rendered inside a colored circle. */
  icon: ComponentType<LucideProps>;
  label: string;
  value: string | number;
  tone?: Tone;
  delta?: KPIDelta;
  footnote?: string;
  className?: string;
}

export function KPICard({
  icon: Icon,
  label,
  value,
  tone = "info",
  delta,
  footnote,
  className,
}: KPICardProps) {
  return (
    <GlassCard hover className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            toneBg15[tone],
            toneText[tone],
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>

      <div className="text-2xl font-semibold text-foreground">{value}</div>

      {delta ? (
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              delta.direction === "up" ? "text-success" : "text-danger",
            )}
          >
            {delta.direction === "up" ? (
              <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
            ) : (
              <ArrowDown className="h-3 w-3" strokeWidth={2.5} />
            )}
            {delta.value}
          </span>
          {delta.label ? (
            <span className="text-muted-foreground">{delta.label}</span>
          ) : null}
        </div>
      ) : null}

      {footnote ? (
        <div className="text-xs text-muted-foreground">{footnote}</div>
      ) : null}
    </GlassCard>
  );
}

/* ------------------------------------------------------------------ */
/* Pill                                                                */
/* ------------------------------------------------------------------ */

export interface PillProps {
  tone?: Tone | "neutral";
  children: ReactNode;
  className?: string;
}

const pillToneBg: Record<NonNullable<PillProps["tone"]>, string> = {
  ...toneBg15,
  neutral: "bg-muted",
};

const pillToneText: Record<NonNullable<PillProps["tone"]>, string> = {
  ...toneText,
  neutral: "text-muted-foreground",
};

export function Pill({ tone = "neutral", children, className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        pillToneBg[tone],
        pillToneText[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* StatusDot                                                           */
/* ------------------------------------------------------------------ */

export interface StatusDotProps {
  tone: Tone;
  className?: string;
}

export function StatusDot({ tone, className }: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        toneBgSolid[tone],
        className,
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* DataTable                                                           */
/* ------------------------------------------------------------------ */

export interface Column<T> {
  /** Key on the row object used for default cell rendering. */
  key: string;
  /** Header label. */
  label: string;
  /** Optional custom cell renderer. Receives the full row. */
  render?: (row: T) => ReactNode;
  /** Optional className applied to every cell in this column. */
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  /** Row keys to include in search filtering. */
  searchKeys?: string[];
  pageSize?: number;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  searchKeys = [],
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || searchKeys.length === 0) return rows;
    return rows.filter((row) =>
      searchKeys.some((key) => {
        const val = row[key];
        return val != null && String(val).toLowerCase().includes(q);
      }),
    );
  }, [rows, query, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function goTo(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }

  /** Build a compact list of page numbers with ellipses. */
  const pageNumbers: (number | "…")[] = useMemo(() => {
    const max = totalPages;
    if (max <= 7) return Array.from({ length: max }, (_, i) => i + 1);
    const pages = new Set<number>([1, max, currentPage]);
    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < max) pages.add(currentPage + 1);
    const sorted = Array.from(pages).sort((a, b) => a - b);
    const result: (number | "…")[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
      result.push(sorted[i]);
    }
    return result;
  }, [currentPage, totalPages]);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-white/[0.02] overflow-hidden",
        className,
      )}
    >
      {/* Search bar */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-elevated/60 px-4 py-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search…"
            className={cn(
              "w-full rounded-lg border border-border/60 bg-background/30 py-1.5 pl-9 pr-3 text-sm text-foreground",
              "placeholder:text-muted-foreground",
              "focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary",
            )}
          />
        </div>
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "row" : "rows"}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-elevated/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                    col.className,
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No results found.
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border/40 transition-colors hover:bg-white/[0.03]"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-4 py-3 text-foreground", col.className)}
                    >
                      {col.render
                        ? col.render(row)
                        : (row[col.key] as ReactNode) ?? null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-border/60 bg-elevated/60 px-4 py-3">
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 text-muted-foreground",
                "transition-colors hover:bg-white/[0.04] hover:text-foreground",
                "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {pageNumbers.map((p, idx) =>
              p === "…" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1.5 text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => goTo(p)}
                  className={cn(
                    "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs font-medium",
                    p === currentPage
                      ? "border-primary/50 bg-primary/20 text-foreground"
                      : "border-border/60 text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                  )}
                >
                  {p}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 text-muted-foreground",
                "transition-colors hover:bg-white/[0.04] hover:text-foreground",
                "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
              )}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default DataTable;
