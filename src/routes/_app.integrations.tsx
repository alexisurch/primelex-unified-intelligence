import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard, SectionCard, Pill } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Plus, Settings2, MoveVertical as MoreVertical, Truck, RefreshCw, Search, Download, ListFilter as Filter, CalendarDays, Wifi } from "lucide-react";

export const Route = createFileRoute("/_app/integrations")({
  component: IntegrationsPage,
});

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type ProviderStatus = "connected" | "not_connected";

interface Provider {
  id: string;
  name: string;
  subtitle: string;
  status: ProviderStatus;
  vehiclesConnected: number;
  lastSync: string;
  logoType: "hcl" | "novatrack" | "telematics";
}

interface LogRow {
  id: string;
  timestamp: string;
  provider: string;
  providerType: "hcl" | "novatrack" | "telematics";
  action: string;
  result: "Success" | "Failed";
  duration: string;
  performedBy: string;
  status: "Success" | "Failed";
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const initialProviders: Provider[] = [
  {
    id: "hcl",
    name: "HCL",
    subtitle: "GPS Fleet Tracking",
    status: "connected",
    vehiclesConnected: 148,
    lastSync: "2 minutes ago",
    logoType: "hcl",
  },
  {
    id: "novatrack",
    name: "Novatrack",
    subtitle: "Fleet Tracking Platform",
    status: "connected",
    vehiclesConnected: 24,
    lastSync: "5 mins ago",
    logoType: "novatrack",
  },
  {
    id: "telematics",
    name: "Telematics",
    subtitle: "Fleet Monitoring",
    status: "not_connected",
    vehiclesConnected: 0,
    lastSync: "—",
    logoType: "telematics",
  },
];

const logRows: LogRow[] = [
  { id: "l1", timestamp: "May 27, 2026 10:42:15", provider: "HCL", providerType: "hcl", action: "Vehicle data synchronized", result: "Success", duration: "12.4 sec", performedBy: "System", status: "Success" },
  { id: "l2", timestamp: "May 27, 2026 10:31:08", provider: "Novatrack", providerType: "novatrack", action: "Trip data synchronized", result: "Success", duration: "8.7 sec", performedBy: "System", status: "Success" },
  { id: "l3", timestamp: "May 27, 2026 10:12:33", provider: "HCL", providerType: "hcl", action: "Driver locations updated", result: "Success", duration: "9.1 sec", performedBy: "System", status: "Success" },
  { id: "l4", timestamp: "May 27, 2026 09:54:21", provider: "Telematics", providerType: "telematics", action: "Authentication failed", result: "Failed", duration: "—", performedBy: "System", status: "Failed" },
  { id: "l5", timestamp: "May 27, 2026 09:41:10", provider: "Novatrack", providerType: "novatrack", action: "Vehicle status updated", result: "Success", duration: "7.3 sec", performedBy: "System", status: "Success" },
  { id: "l6", timestamp: "May 27, 2026 09:30:45", provider: "HCL", providerType: "hcl", action: "Fuel level synchronized", result: "Success", duration: "11.2 sec", performedBy: "System", status: "Success" },
  { id: "l7", timestamp: "May 27, 2026 09:22:18", provider: "Novatrack", providerType: "novatrack", action: "Geofence events updated", result: "Success", duration: "6.5 sec", performedBy: "System", status: "Success" },
  { id: "l8", timestamp: "May 27, 2026 09:12:07", provider: "Telematics", providerType: "telematics", action: "Connection established", result: "Success", duration: "3.2 sec", performedBy: "System", status: "Success" },
];

/* ------------------------------------------------------------------ */
/* Provider Logo                                                        */
/* ------------------------------------------------------------------ */

function ProviderLogo({ type, size = "lg" }: { type: Provider["logoType"]; size?: "sm" | "lg" }) {
  const s = size === "lg" ? "h-16 w-16" : "h-6 w-6";
  if (type === "hcl") {
    return (
      <div className={cn("flex items-center justify-center rounded-lg bg-[#003087]", s)}>
        <span className={cn("font-black text-white", size === "lg" ? "text-[18px]" : "text-[10px]")}>HCL</span>
      </div>
    );
  }
  if (type === "novatrack") {
    return (
      <div className={cn("flex items-center justify-center rounded-lg bg-[#0a8a5e]", s)}>
        <span className={cn("font-black italic text-white", size === "lg" ? "text-[15px]" : "text-[8px]")}>N</span>
      </div>
    );
  }
  return (
    <div className={cn("flex items-center justify-center rounded-lg bg-[#1e3a5f]", s)}>
      <Wifi className={cn("text-[#4db8ff]", size === "lg" ? "h-8 w-8" : "h-3.5 w-3.5")} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Provider Card                                                        */
/* ------------------------------------------------------------------ */

function ProviderCard({
  provider,
  onConnect,
  onConfigure,
}: {
  provider: Provider;
  onConnect: (id: string) => void;
  onConfigure: (id: string) => void;
}) {
  const isConnected = provider.status === "connected";
  return (
    <GlassCard className="flex flex-col gap-4 p-5" hover={false}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <ProviderLogo type={provider.logoType} size="lg" />
          <div>
            <div className="text-[15px] font-semibold text-foreground">{provider.name}</div>
            <div className="text-[12px] text-muted-foreground">{provider.subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[11px] font-medium",
              isConnected
                ? "bg-success/15 text-success"
                : "bg-white/[0.06] text-muted-foreground",
            )}
          >
            {isConnected && <span className="h-1.5 w-1.5 rounded-full bg-success" />}
            {isConnected ? "Connected" : "Not Connected"}
          </span>
          <button className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Truck className="h-3.5 w-3.5" />
          {isConnected ? (
            <span><span className="font-medium text-foreground">{provider.vehiclesConnected} Vehicles</span> Connected</span>
          ) : (
            <span>No vehicles connected</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5" />
          {isConnected ? (
            <span>Last sync: <span className="text-foreground">{provider.lastSync}</span></span>
          ) : (
            <span>Connect to start syncing data</span>
          )}
        </div>
      </div>

      {isConnected ? (
        <Button
          variant="outline"
          className="w-full border-primary/50 text-primary hover:bg-primary/10"
          onClick={() => onConfigure(provider.id)}
        >
          <Settings2 className="mr-2 h-4 w-4" />
          Configure
        </Button>
      ) : (
        <Button
          className="w-full bg-primary text-white hover:bg-primary/90"
          onClick={() => onConnect(provider.id)}
        >
          Connect
        </Button>
      )}
    </GlassCard>
  );
}

/* ------------------------------------------------------------------ */
/* Integration Logs Table                                              */
/* ------------------------------------------------------------------ */

function ProviderLogoBadge({ type }: { type: LogRow["providerType"] }) {
  return (
    <div className="inline-flex">
      <ProviderLogo type={type} size="sm" />
    </div>
  );
}

function IntegrationLogs() {
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return logRows.filter((r) => {
      if (providerFilter !== "all" && r.provider.toLowerCase() !== providerFilter) return false;
      if (statusFilter !== "all" && r.status.toLowerCase() !== statusFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return r.action.toLowerCase().includes(s) || r.provider.toLowerCase().includes(s);
    });
  }, [search, providerFilter, statusFilter]);

  const cols: Column<LogRow>[] = [
    { key: "timestamp", label: "Timestamp", render: (r) => <span className="text-[12px] text-muted-foreground">{r.timestamp}</span> },
    {
      key: "provider",
      label: "Provider",
      render: (r) => (
        <div className="flex items-center gap-2">
          <ProviderLogoBadge type={r.providerType} />
        </div>
      ),
    },
    { key: "action", label: "Action", render: (r) => <span className="text-[13px]">{r.action}</span> },
    {
      key: "result",
      label: "Result",
      render: (r) => (
        <span className={cn("text-[13px] font-medium", r.result === "Success" ? "text-success" : "text-danger")}>
          {r.result}
        </span>
      ),
    },
    { key: "duration", label: "Duration", render: (r) => <span className="text-[13px] text-muted-foreground">{r.duration}</span> },
    { key: "performedBy", label: "Performed By", render: (r) => <span className="text-[13px] text-muted-foreground">{r.performedBy}</span> },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
          r.status === "Success" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
        )}>
          <span className={cn("h-1.5 w-1.5 rounded-full", r.status === "Success" ? "bg-success" : "bg-danger")} />
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <SectionCard title="Integration Logs">
      <div className="flex flex-wrap items-center gap-3 pb-4">
        <div className="relative min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-elevated/60 text-sm"
          />
        </div>
        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="h-9 w-36 text-xs bg-elevated/60"><SelectValue placeholder="All Providers" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="hcl">HCL</SelectItem>
            <SelectItem value="novatrack">Novatrack</SelectItem>
            <SelectItem value="telematics">Telematics</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-32 text-xs bg-elevated/60"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>May 20 - May 27, 2026</span>
        </div>
        <Button variant="outline" size="sm" className="border-border bg-elevated/60 text-xs">
          <Download className="mr-1.5 h-3.5 w-3.5" />Export CSV
        </Button>
      </div>
      <DataTable columns={cols} rows={filtered} searchKeys={[]} pageSize={8} hideToolbar />
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function IntegrationsPage() {
  const [providers, setProviders] = useState<Provider[]>(initialProviders);

  function handleConnect(id: string) {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "connected", vehiclesConnected: 0, lastSync: "Just now" }
          : p,
      ),
    );
  }

  function handleConfigure(_id: string) {
    // UI only
  }

  return (
    <>
      <Header
        title="Connected Systems"
        subtitle="Connect GPS tracking providers and external systems to automatically synchronize vehicles, trips, locations and operational data into LIS."
        actions={
          <Button className="bg-primary text-white hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Connect System
          </Button>
        }
      />
      <div className="space-y-6 p-8">
        {/* Connected Providers */}
        <div>
          <h3 className="mb-4 text-[15px] font-semibold text-foreground">Connected Providers</h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {providers.map((p) => (
              <ProviderCard
                key={p.id}
                provider={p}
                onConnect={handleConnect}
                onConfigure={handleConfigure}
              />
            ))}
          </div>
        </div>

        {/* Integration Logs */}
        <IntegrationLogs />
      </div>
    </>
  );
}
