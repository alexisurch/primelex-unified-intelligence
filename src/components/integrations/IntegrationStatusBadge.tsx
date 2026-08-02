import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/shared/Cards";
import { Loader as Loader2, CircleAlert as AlertCircle, CircleCheck as CheckCircle2, Plug } from "lucide-react";

export type IntegrationStatus =
  | "disconnected"
  | "connected"
  | "syncing"
  | "error"
  | "configuration_required";

interface IntegrationStatusBadgeProps {
  status: IntegrationStatus;
}

const config: Record<
  IntegrationStatus,
  { label: string; tone: "info" | "success" | "warning" | "danger" | "purple"; icon?: typeof AlertCircle }
> = {
  disconnected: { label: "Disconnected", tone: "info" },
  connected: { label: "Connected", tone: "success", icon: CheckCircle2 },
  syncing: { label: "Syncing", tone: "info", icon: Loader2 },
  error: { label: "Error", tone: "danger", icon: AlertCircle },
  configuration_required: { label: "Configuration Required", tone: "warning" },
};

export function IntegrationStatusBadge({ status }: IntegrationStatusBadgeProps) {
  const { label, tone, icon: Icon } = config[status];
  const textTone = {
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
    purple: "text-purple",
  }[tone];
  const bgTone = {
    info: "bg-info/15",
    success: "bg-success/15",
    warning: "bg-warning/15",
    danger: "bg-danger/15",
    purple: "bg-purple/15",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        bgTone,
        textTone,
      )}
    >
      {Icon ? (
        <Icon className={cn("h-3 w-3", status === "syncing" && "animate-spin")} />
      ) : (
        <StatusDot tone={tone} />
      )}
      {label}
    </span>
  );
}

export function IntegrationActionButton({ icon: Icon, label }: { icon: typeof Plug; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
