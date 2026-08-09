import { cn } from "@/lib/utils";
import { Search, ListFilter as Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "./Cards";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  title?: string;
  columns: Column<T>[];
  rows: T[];
  searchKeys?: (keyof T)[];
  pageSize?: number;
  pageSizeOptions?: number[];
  actions?: ReactNode;
  hideToolbar?: boolean;
}

export function DataTable<T extends { id: string }>({
  title, columns, rows, searchKeys, pageSize: initialPageSize = 8, pageSizeOptions, actions, hideToolbar,
}: DataTableProps<T>) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    setPage(1);
  }, [rows, pageSize]);

  const filtered = useMemo(() => {
    if (!q || !searchKeys) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) => searchKeys.some((k) => String(r[k]).toLowerCase().includes(needle)));
  }, [q, rows, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <GlassCard hover={false} className="p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
        {title && <h3 className="text-[15px] font-semibold">{title}</h3>}
        <div className="ml-auto flex items-center gap-2">
          {!hideToolbar && (
            <>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(1); }}
                  placeholder="Search…"
                  className="h-9 w-56 border-border bg-elevated/60 pl-8 text-xs"
                />
              </div>
              <Button variant="outline" size="sm" className="h-9 border-border bg-elevated/60"><Filter className="mr-1.5 h-3.5 w-3.5"/>Filter</Button>
              <Button variant="outline" size="sm" className="h-9 border-border bg-elevated/60"><Download className="mr-1.5 h-3.5 w-3.5"/>Export</Button>
            </>
          )}
          {actions}
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-elevated/70 backdrop-blur">
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className={cn("px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", c.className)}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} className="border-t border-border/60 transition-colors hover:bg-white/[0.03]">
                {columns.map((c) => (
                  <td key={String(c.key)} className={cn("px-5 py-3.5 text-[13px] text-foreground", c.className)}>
                    {c.render ? c.render(row) : String(row[c.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center text-sm text-muted-foreground">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-3 text-xs text-muted-foreground">
        <span>Showing {pageRows.length} of {filtered.length}</span>
        <div className="flex items-center gap-3">
          {pageSizeOptions && <label className="flex items-center gap-2">Rows per page<Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}><SelectTrigger className="h-7 w-[82px] border-border bg-elevated/60 text-[11px]"><SelectValue /></SelectTrigger><SelectContent>{pageSizeOptions.map((size) => <SelectItem key={size} value={String(size)}>{size} / page</SelectItem>)}</SelectContent></Select></label>}
          <div className="flex items-center gap-1">
          <Button size="icon" variant="outline" className="h-7 w-7 border-border bg-elevated/60" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="px-2 tabular-nums">{page} / {totalPages}</span>
            <Button size="icon" variant="outline" className="h-7 w-7 border-border bg-elevated/60" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
