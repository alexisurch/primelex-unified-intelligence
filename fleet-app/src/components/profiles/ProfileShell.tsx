import {
  type ReactNode,
  type ComponentType,
} from "react";
import {
  type LucideProps,
  FileText,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Tone system                                                          */
/* ------------------------------------------------------------------ */

export type Tone = "info" | "success" | "warning" | "danger" | "purple";

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

const toneBgSolid: Record<Tone, string> = {
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  purple: "bg-purple",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

/**
 * Extract initials from a full name, e.g. "Chinedu Okafor" -> "CO".
 * Falls back to the first two characters of the trimmed string when the
 * name has a single token.
 */
export function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ------------------------------------------------------------------ */
/* ProfileHeader                                                        */
/* ------------------------------------------------------------------ */

export interface ProfileHeaderProps {
  icon: ComponentType<LucideProps>;
  title: string;
  subtitle: string;
  tone?: Tone;
  badge?: ReactNode;
}

export function ProfileHeader({
  icon: Icon,
  title,
  subtitle,
  tone = "info",
  badge,
}: ProfileHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          toneBg15[tone],
          toneText[tone],
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-lg font-semibold text-foreground">
            {title}
          </h2>
          {badge ? <span className="shrink-0">{badge}</span> : null}
        </div>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ProfileSection                                                       */
/* ------------------------------------------------------------------ */

export interface ProfileSectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function ProfileSection({
  title,
  children,
  action,
}: ProfileSectionProps) {
  return (
    <section className="rounded-2xl border border-border/60 bg-white/[0.02] p-5">
      <div className="mb-4 flex items-center justify-between">
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
/* ProfileTabs                                                          */
/* ------------------------------------------------------------------ */

export interface ProfileTab {
  label: string;
  value: string;
}

export interface ProfileTabsProps {
  tabs: ProfileTab[];
  defaultValue?: string;
  children: ReactNode;
}

export function ProfileTabs({
  tabs,
  defaultValue,
  children,
}: ProfileTabsProps) {
  const value = defaultValue ?? tabs[0]?.value ?? "";
  return (
    <Tabs defaultValue={value} className="w-full">
      <TabsList className="flex w-full flex-wrap justify-start gap-1">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}

/* Re-export Radix TabsContent so consumers can render tab panels without
   importing the ui package separately. */
export { TabsContent as ProfileTabContent };

/* ------------------------------------------------------------------ */
/* InfoGrid                                                             */
/* ------------------------------------------------------------------ */

export interface InfoItem {
  label: string;
  value: ReactNode;
}

export interface InfoGridProps {
  items: InfoItem[];
}

export function InfoGrid({ items }: InfoGridProps) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map((item, idx) => (
        <div key={`${item.label}-${idx}`} className="flex flex-col gap-1">
          <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {item.label}
          </dt>
          <dd className="text-sm font-medium text-foreground">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* StatTile                                                             */
/* ------------------------------------------------------------------ */

export interface StatTileProps {
  label: string;
  value: ReactNode;
  icon: ComponentType<LucideProps>;
  tone?: Tone;
}

export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "info",
}: StatTileProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            toneBg15[tone],
            toneText[tone],
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
      <div className="text-xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TimelineList                                                         */
/* ------------------------------------------------------------------ */

export interface TimelineItem {
  time: string;
  title: string;
  detail?: ReactNode;
  tone?: Tone;
}

export interface TimelineListProps {
  items: TimelineItem[];
}

export function TimelineList({ items }: TimelineListProps) {
  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No records to display.
      </p>
    );
  }
  return (
    <ol className="relative flex flex-col gap-5 pl-6">
      {/* vertical line */}
      <span
        className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-border/60"
        aria-hidden="true"
      />
      {items.map((item, idx) => {
        const tone = item.tone ?? "info";
        return (
          <li key={`${item.title}-${idx}`} className="relative">
            <span
              className={cn(
                "absolute -left-6 top-1 h-3.5 w-3.5 rounded-full ring-4 ring-background",
                toneBgSolid[tone],
              )}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-foreground">
                  {item.title}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.time}
                </span>
              </div>
              {item.detail ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* DocumentsGrid                                                        */
/* ------------------------------------------------------------------ */

export interface DocumentCardItem {
  type: string;
  owner: string;
  expiry: string;
  status: string;
}

export interface DocumentsGridProps {
  docs: DocumentCardItem[];
}

function docStatusTone(status: string): Tone {
  switch (status) {
    case "Valid":
      return "success";
    case "Expiring Soon":
      return "warning";
    case "Expired":
      return "danger";
    default:
      return "info";
  }
}

export function DocumentsGrid({ docs }: DocumentsGridProps) {
  if (docs.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No documents on file.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {docs.map((doc, idx) => {
        const tone = docStatusTone(doc.status);
        return (
          <div
            key={`${doc.type}-${idx}`}
            className="flex flex-col gap-3 rounded-xl border border-border/60 bg-white/[0.02] p-4"
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  toneBg15[tone],
                  toneText[tone],
                )}
              >
                <FileText className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {doc.type}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {doc.owner}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  toneBg15[tone],
                  toneText[tone],
                )}
              >
                {doc.status}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Expires{" "}
              <span className="font-medium text-foreground">{doc.expiry}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EmptyState (small helper used by list tabs)                         */
/* ------------------------------------------------------------------ */

export interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No records found." }: EmptyStateProps) {
  return (
    <p className="py-8 text-center text-sm text-muted-foreground">{message}</p>
  );
}

export default ProfileHeader;
