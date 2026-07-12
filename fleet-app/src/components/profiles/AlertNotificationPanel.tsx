import { type ComponentType } from "react";
import {
  AlertTriangle,
  Wrench,
  IdCard,
  ShieldAlert,
  Flame,
  Clock,
  ShieldCheck,
  Bell,
  CalendarDays,
  User,
  Truck,
  Route as RouteIcon,
  Package,
  Building2,
  type LucideProps,
} from "lucide-react";
import { Pill, type Tone } from "@/components/shared/Cards";
import { ProfileSection } from "@/components/profiles/ProfileShell";
import { alerts, priorities, type Alert, type Priority } from "@/lib/mock-data";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface NotificationRecord {
  id: string;
  kind: "alert" | "priority";
  icon: ComponentType<LucideProps>;
  iconTone: Tone;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  time: string;
  status: string;
  description: string;
  relatedTruck?: string;
  relatedDriver?: string;
  relatedRoute?: string;
  relatedTrip?: string;
  relatedClient?: string;
  assignedUser: string;
  aiReview?: string;
  recommendedActions?: string[];
  timeline?: { time: string; event: string }[];
}

/* ------------------------------------------------------------------ */
/* Icon maps                                                           */
/* ------------------------------------------------------------------ */

const ALERT_ICONS: Record<Alert["icon"], ComponentType<LucideProps>> = {
  AlertTriangle,
  Wrench,
  IdCard,
  ShieldAlert,
};

const PRIORITY_ICONS: Record<Priority["icon"], ComponentType<LucideProps>> = {
  Flame,
  Clock,
  Wrench,
  ShieldCheck,
};

const ALERT_TONE: Record<Alert["type"], Tone> = {
  danger: "danger",
  warning: "warning",
  info: "info",
};

/* ------------------------------------------------------------------ */
/* Registry — maps notification ids to full records                    */
/* ------------------------------------------------------------------ */

const NOTIFICATION_REGISTRY = new Map<string, NotificationRecord>();

alerts.forEach((a) => {
  NOTIFICATION_REGISTRY.set(a.id, {
    id: a.id,
    kind: "alert",
    icon: ALERT_ICONS[a.icon],
    iconTone: ALERT_TONE[a.type],
    title: a.title,
    category: "Alert",
    priority: a.type === "danger" ? "High" : a.type === "warning" ? "Medium" : "Low",
    time: a.time,
    status: "Open",
    description: a.detail,
    relatedTruck: a.id === "ALT-001" ? "TRK-1003" : a.id === "ALT-002" ? "TRK-1007" : undefined,
    relatedDriver: a.id === "ALT-003" ? "DRV-004" : undefined,
    assignedUser: "Operations Team",
    aiReview: `This ${a.type === "danger" ? "critical" : "non-critical"} alert was automatically detected by the monitoring system. Immediate review is recommended to prevent escalation.`,
    recommendedActions: [
      "Review the related asset and confirm the current status.",
      "Notify the responsible fleet manager.",
      "Document the resolution steps in the incident log.",
    ],
    timeline: [
      { time: a.time, event: "Alert triggered by automated monitoring." },
      { time: "Pending", event: "Assigned to Operations Team." },
    ],
  });
});

priorities.forEach((p) => {
  NOTIFICATION_REGISTRY.set(p.id, {
    id: p.id,
    kind: "priority",
    icon: PRIORITY_ICONS[p.icon],
    iconTone: p.color,
    title: p.title,
    category: "Priority",
    priority: p.color === "danger" ? "High" : p.color === "warning" ? "Medium" : "Low",
    time: p.time,
    status: "Pending",
    description: p.detail,
    relatedTruck: p.id === "PRI-001" ? "TRK-1001" : p.id === "PRI-002" ? "TRK-1005" : undefined,
    assignedUser: "Fleet Manager",
    aiReview: `This priority item requires management attention. The operational impact is ${p.color === "danger" ? "high" : p.color === "warning" ? "moderate" : "low"} based on current fleet conditions.`,
    recommendedActions: [
      "Review the associated fleet assets immediately.",
      "Coordinate with the responsible team lead.",
      "Update priority status once action is taken.",
    ],
    timeline: [
      { time: p.time, event: "Priority item raised by fleet operations." },
      { time: "Pending", event: "Awaiting management review." },
    ],
  });
});

export function getNotificationRecord(id: string): NotificationRecord | null {
  return NOTIFICATION_REGISTRY.get(id) ?? null;
}

/* ------------------------------------------------------------------ */
/* Tone helpers                                                         */
/* ------------------------------------------------------------------ */

const PRIORITY_TONE: Record<"High" | "Medium" | "Low", Tone> = {
  High: "danger",
  Medium: "warning",
  Low: "success",
};

const toneBg15: Record<Tone, string> = {
  info: "bg-info/15",
  success: "bg-success/15",
  warning: "bg-warning/15",
  danger: "bg-danger/15",
  purple: "bg-purple/15",
};
const toneText: Record<Tone, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  purple: "text-purple",
};

/* ------------------------------------------------------------------ */
/* Panel component                                                     */
/* ------------------------------------------------------------------ */

interface DetailRowProps {
  icon: ComponentType<LucideProps>;
  label: string;
  value: string;
}
function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" strokeWidth={2} />
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function AlertNotificationPanel({
  id,
  onOpen,
}: {
  id: string;
  onOpen: (t: { kind: "truck" | "driver" | "incident" | "route" | "trip" | "client" | "fleet-manager"; id: string }) => void;
}) {
  const record = getNotificationRecord(id);

  if (!record) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Notification not found.
      </div>
    );
  }

  const Icon = record.icon;

  return (
    <div className="flex flex-col gap-6">
      {/* Header with icon and title */}
      <div className="flex items-start gap-4">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${toneBg15[record.iconTone]} ${toneText[record.iconTone]}`}>
          <Icon className="h-6 w-6" strokeWidth={2} />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-foreground">{record.title}</h3>
          <p className="text-sm text-muted-foreground">{record.description}</p>
        </div>
      </div>

      {/* Core details grid */}
      <ProfileSection title="Details">
        <div className="grid grid-cols-2 gap-4">
          <DetailRow icon={Bell} label="Category" value={record.category} />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Priority</span>
            <Pill tone={PRIORITY_TONE[record.priority]}>{record.priority}</Pill>
          </div>
          <DetailRow icon={CalendarDays} label="Date & Time" value={record.time} />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</span>
            <Pill tone={record.status === "Open" ? "danger" : record.status === "Resolved" ? "success" : "warning"}>
              {record.status}
            </Pill>
          </div>
          <DetailRow icon={User} label="Assigned User" value={record.assignedUser} />
        </div>
      </ProfileSection>

      {/* Related entities */}
      {(record.relatedTruck || record.relatedDriver || record.relatedRoute || record.relatedTrip || record.relatedClient) && (
        <ProfileSection title="Related Records">
          <div className="flex flex-col gap-2">
            {record.relatedTruck && (
              <button
                type="button"
                onClick={() => onOpen({ kind: "truck", id: record.relatedTruck! })}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-white/[0.04]"
              >
                <Truck className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                <span className="text-sm font-medium text-primary">Truck {record.relatedTruck}</span>
                <span className="ml-auto text-xs text-muted-foreground">Open profile</span>
              </button>
            )}
            {record.relatedDriver && (
              <button
                type="button"
                onClick={() => onOpen({ kind: "driver", id: record.relatedDriver! })}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-white/[0.04]"
              >
                <User className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                <span className="text-sm font-medium text-primary">Driver {record.relatedDriver}</span>
                <span className="ml-auto text-xs text-muted-foreground">Open profile</span>
              </button>
            )}
            {record.relatedRoute && (
              <button
                type="button"
                onClick={() => onOpen({ kind: "route", id: record.relatedRoute! })}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-white/[0.04]"
              >
                <RouteIcon className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                <span className="text-sm font-medium text-primary">Route {record.relatedRoute}</span>
                <span className="ml-auto text-xs text-muted-foreground">Open profile</span>
              </button>
            )}
            {record.relatedTrip && (
              <button
                type="button"
                onClick={() => onOpen({ kind: "trip", id: record.relatedTrip! })}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-white/[0.04]"
              >
                <Package className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                <span className="text-sm font-medium text-primary">Trip {record.relatedTrip}</span>
                <span className="ml-auto text-xs text-muted-foreground">Open profile</span>
              </button>
            )}
            {record.relatedClient && (
              <button
                type="button"
                onClick={() => onOpen({ kind: "client", id: record.relatedClient! })}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-white/[0.04]"
              >
                <Building2 className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                <span className="text-sm font-medium text-primary">Client {record.relatedClient}</span>
                <span className="ml-auto text-xs text-muted-foreground">Open profile</span>
              </button>
            )}
          </div>
        </ProfileSection>
      )}

      {/* AI Operational Review */}
      {record.aiReview && (
        <ProfileSection title="AI Operational Review">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm leading-relaxed text-foreground">{record.aiReview}</p>
          </div>
        </ProfileSection>
      )}

      {/* Recommended Actions */}
      {record.recommendedActions && record.recommendedActions.length > 0 && (
        <ProfileSection title="Recommended Actions">
          <ul className="flex flex-col gap-2">
            {record.recommendedActions.map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-foreground">{action}</span>
              </li>
            ))}
          </ul>
        </ProfileSection>
      )}

      {/* Timeline */}
      {record.timeline && record.timeline.length > 0 && (
        <ProfileSection title="Timeline">
          <div className="flex flex-col gap-0">
            {record.timeline.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  {i < record.timeline!.length - 1 && (
                    <span className="w-px flex-1 bg-border/60 my-1" style={{ minHeight: "24px" }} />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 pb-3">
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                  <span className="text-sm text-foreground">{item.event}</span>
                </div>
              </div>
            ))}
          </div>
        </ProfileSection>
      )}

      {/* Attachments placeholder */}
      <ProfileSection title="Attachments">
        <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
          No attachments yet. This section is ready for file uploads in a future update.
        </div>
      </ProfileSection>
    </div>
  );
}
