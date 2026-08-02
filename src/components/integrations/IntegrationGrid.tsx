import { IntegrationCard, type Integration } from "@/components/integrations/IntegrationCard";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ListFilter as Filter } from "lucide-react";

interface IntegrationGridProps {
  integrations: Integration[];
  onConnect?: (id: string) => void;
  onDisconnect?: (id: string) => void;
  onConfigure?: (id: string) => void;
}

const statusFilters = [
  { value: "all", label: "All Statuses" },
  { value: "connected", label: "Connected" },
  { value: "disconnected", label: "Disconnected" },
  { value: "syncing", label: "Syncing" },
  { value: "error", label: "Error" },
  { value: "configuration_required", label: "Configuration Required" },
];

export function IntegrationGrid({
  integrations,
  onConnect,
  onDisconnect,
  onConfigure,
}: IntegrationGridProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return integrations.filter((i) => {
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        i.name.toLowerCase().includes(s) ||
        i.category.toLowerCase().includes(s) ||
        i.description.toLowerCase().includes(s)
      );
    });
  }, [integrations, search, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Search + filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search integrations by name, category or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-elevated/60"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-48 text-xs bg-elevated/60">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            onConfigure={onConfigure}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No integrations match your search.
          </p>
        </div>
      )}
    </div>
  );
}
