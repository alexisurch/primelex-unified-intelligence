import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/Cards";
import {
  IntegrationStatusBadge,
  type IntegrationStatus,
} from "@/components/integrations/IntegrationStatusBadge";
import {
  Plug,
  PlugZap,
  Settings2,
  RefreshCw,
  CircleAlert as AlertCircle,
  type LucideIcon,
} from "lucide-react";

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: IntegrationStatus;
  logoColor: string;
  logoText: string;
  apiStatus: string;
  lastSync: string;
  syncInfo: string;
  syncedRecords: string;
  errorMessage?: string;
}

interface IntegrationCardProps {
  integration: Integration;
  onConnect?: (id: string) => void;
  onDisconnect?: (id: string) => void;
  onConfigure?: (id: string) => void;
}

export function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  onConfigure,
}: IntegrationCardProps) {
  const {
    id,
    name,
    description,
    category,
    status,
    logoColor,
    logoText,
    apiStatus,
    lastSync,
    syncInfo,
    syncedRecords,
    errorMessage,
  } = integration;

  const isConnected = status === "connected" || status === "syncing";
  const isSyncing = status === "syncing";

  return (
    <GlassCard className="flex flex-col gap-5 p-5" hover={false}>
      {/* Provider header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[15px] font-bold text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${logoColor}, ${logoColor}99)` }}
          >
            {logoText}
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-foreground">{name}</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {category}
            </div>
          </div>
        </div>
        <IntegrationStatusBadge status={status} />
      </div>

      {/* Description */}
      <p className="text-[13px] leading-relaxed text-muted-foreground">{description}</p>

      {/* Sync / API details */}
      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/50 bg-background/30 p-4">
        <DetailItem label="API Status" value={apiStatus} />
        <DetailItem label="Last Synchronized" value={lastSync} />
        <DetailItem label="Sync Info" value={syncInfo} />
        <DetailItem label="Synced Records" value={syncedRecords} />
      </div>

      {/* Error banner */}
      {status === "error" && errorMessage && (
        <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <span className="text-[12px] leading-relaxed text-danger">{errorMessage}</span>
        </div>
      )}

      {/* Configuration required banner */}
      {status === "configuration_required" && (
        <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2.5">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <span className="text-[12px] leading-relaxed text-warning">
            API credentials and sync preferences must be configured before activation.
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto flex items-center gap-2 pt-1">
        {status === "disconnected" && (
          <ActionButton
            icon={PlugZap}
            label="Connect"
            variant="primary"
            onClick={() => onConnect?.(id)}
          />
        )}
        {isConnected && (
          <ActionButton
            icon={Plug}
            label="Disconnect"
            variant="outline"
            onClick={() => onDisconnect?.(id)}
          />
        )}
        {(isConnected || status === "configuration_required") && (
          <ActionButton
            icon={Settings2}
            label="Configure"
            variant="outline"
            onClick={() => onConfigure?.(id)}
          />
        )}
        {isConnected && (
          <ActionButton
            icon={RefreshCw}
            label={isSyncing ? "Syncing…" : "Sync Now"}
            variant="ghost"
            disabled={isSyncing}
            onClick={() => onConfigure?.(id)}
          />
        )}
      </div>
    </GlassCard>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-[13px] font-medium text-foreground">{value}</span>
    </div>
  );
}

type ButtonVariant = "primary" | "outline" | "ghost";

function ActionButton({
  icon: Icon,
  label,
  variant,
  disabled,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  variant: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold transition-all disabled:opacity-50",
        variant === "primary" &&
          "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90",
        variant === "outline" &&
          "border border-border/60 bg-elevated/60 text-foreground hover:border-primary/40 hover:bg-white/[0.04]",
        variant === "ghost" &&
          "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", label === "Syncing…" && "animate-spin")} />
      {label}
    </button>
  );
}
