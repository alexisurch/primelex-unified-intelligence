import { Button } from "@/components/ui/button";
import { GlassCard, Pill } from "@/components/shared/Cards";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, ChevronRight, FileText, Upload } from "lucide-react";
import type { ReactNode } from "react";

export type Tone = "success" | "info" | "warning" | "danger" | "purple";

export function initials(name: string) {
  return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function ProfileHeader({
  onBack, icon, title, subtitle, statusTone, statusLabel, actions,
}: {
  onBack?: () => void;
  icon: ReactNode;
  title: string;
  subtitle?: ReactNode;
  statusTone?: Tone;
  statusLabel?: string;
  actions?: ReactNode;
}) {
  return (
    <SheetHeader className="border-b border-border/60 px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button size="icon" variant="ghost" onClick={onBack} className="h-8 w-8 shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">{icon}</div>
          <div>
            <SheetTitle className="text-lg">{title}</SheetTitle>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              {subtitle}
              {statusLabel && statusTone && <Pill tone={statusTone}>{statusLabel}</Pill>}
            </div>
          </div>
        </div>
        {actions && <div className="flex flex-wrap gap-1.5">{actions}</div>}
      </div>
    </SheetHeader>
  );
}

export function ProfileSection({
  title, icon: Icon, action, children,
}: { title: string; icon: React.ElementType; action?: ReactNode; children: ReactNode }) {
  return (
    <GlassCard hover={false}>
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
            <Icon className="h-3.5 w-3.5 text-primary" />
          </div>
          <h4 className="text-[13px] font-semibold">{title}</h4>
        </div>
        {action}
      </div>
      {children}
    </GlassCard>
  );
}

export function InfoGrid({ items }: { items: Array<[string, ReactNode]> }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
      {items.map(([k, v], i) => (
        <div key={`${k}-${i}`}>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
          <div className="mt-0.5 text-sm font-medium text-foreground">{v}</div>
        </div>
      ))}
    </div>
  );
}

export function StatTile({
  label, value, icon: Icon, muted,
}: { label: string; value: string; icon: React.ElementType; muted?: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/30 p-3">
      <div className="flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${muted ? "text-muted-foreground" : "text-primary"}`} />
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
      <div className={`mt-1.5 text-base font-semibold ${muted ? "text-muted-foreground" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

export function TimelineList({ events }: { events: Array<{ time: string; label: string; detail?: string; tone: Tone }> }) {
  const bg: Record<Tone, string> = { success: "bg-success", info: "bg-info", warning: "bg-warning", danger: "bg-danger", purple: "bg-purple" };
  return (
    <ol className="relative space-y-4 border-l border-border/60 pl-6">
      {events.map((ev, i) => (
        <li key={i} className="relative">
          <span className={`absolute -left-[27px] top-1 flex h-3 w-3 rounded-full ring-2 ring-background ${bg[ev.tone]}`} />
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <div className="text-sm font-medium">{ev.label}</div>
              {ev.detail && <div className="mt-0.5 text-xs text-muted-foreground">{ev.detail}</div>}
            </div>
            <div className="whitespace-nowrap text-[11px] text-muted-foreground">{ev.time}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function DocumentsGrid({ docs, onUpload }: { docs: Array<{ name: string; expiry?: string; status?: "Valid" | "Expiring" | "Expired" }>; onUpload?: () => void }) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Attachments related to this record.</p>
        <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30" onClick={onUpload}><Upload className="mr-1.5 h-3.5 w-3.5" />Upload</Button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {docs.map((d) => (
          <div key={d.name} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/30 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/15"><FileText className="h-4 w-4 text-info" /></div>
              <div>
                <div className="text-sm font-medium">{d.name}</div>
                {d.expiry && <div className="text-[11px] text-muted-foreground">Expires {d.expiry}</div>}
              </div>
            </div>
            {d.status && <Pill tone={d.status === "Valid" ? "success" : d.status === "Expiring" ? "warning" : "danger"}>{d.status}</Pill>}
          </div>
        ))}
      </div>
    </>
  );
}

export function LinkRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/30 px-3 py-2 text-sm hover:border-primary/40">
      <span>{label}</span><ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

export function ProfileTabs({
  tabs, defaultValue,
}: { tabs: Array<{ value: string; label: string; content: ReactNode }>; defaultValue: string }) {
  return (
    <Tabs defaultValue={defaultValue} className="px-6 pt-4">
      <TabsList className="h-9 bg-elevated/60 border border-border/60">
        {tabs.map((t) => <TabsTrigger key={t.value} value={t.value} className="text-xs">{t.label}</TabsTrigger>)}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.value} value={t.value} className="mt-5 space-y-5 pb-10">
          {t.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
