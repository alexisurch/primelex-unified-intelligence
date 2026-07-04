import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

export function GlassCard({ className, children, hover = true, ...rest }: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div className={cn("glass-card p-5", hover && "glass-card-hover", className)} {...rest}>
      {children}
    </div>
  );
}

export function SectionCard({ title, action, children, className }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <GlassCard className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
        {action}
      </div>
      <div className="flex-1">{children}</div>
    </GlassCard>
  );
}

type Tone = "info" | "success" | "warning" | "danger" | "purple";

const toneMap: Record<Tone, { icon: string; bg: string }> = {
  info:    { icon: "text-info",    bg: "bg-info/15" },
  success: { icon: "text-success", bg: "bg-success/15" },
  warning: { icon: "text-warning", bg: "bg-warning/15" },
  danger:  { icon: "text-danger",  bg: "bg-danger/15" },
  purple:  { icon: "text-purple",  bg: "bg-purple/15" },
};

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: Tone;
  delta?: { value: string; direction: "up" | "down"; label?: string };
  footnote?: string;
}

export function KPICard({ label, value, icon: Icon, tone = "info", delta, footnote }: KPICardProps) {
  const t = toneMap[tone];
  return (
    <GlassCard className="min-h-[130px]">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
          <span className="mt-2 text-[26px] font-semibold leading-none tracking-tight text-foreground">{value}</span>
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", t.bg)}>
          <Icon className={cn("h-[22px] w-[22px]", t.icon)} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs">
        {delta && (
          <>
            {delta.direction === "up" ? (
              <TrendingUp className="h-3.5 w-3.5 text-success" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-danger" />
            )}
            <span className={cn("font-semibold", delta.direction === "up" ? "text-success" : "text-danger")}>{delta.value}</span>
            <span className="text-muted-foreground">{delta.label ?? "vs last week"}</span>
          </>
        )}
        {!delta && footnote && <span className="text-muted-foreground">{footnote}</span>}
      </div>
    </GlassCard>
  );
}

export function StatusDot({ tone = "success" as Tone, className }: { tone?: Tone; className?: string }) {
  const map: Record<Tone, string> = {
    info: "bg-info", success: "bg-success", warning: "bg-warning", danger: "bg-danger", purple: "bg-purple",
  };
  return <span className={cn("inline-block h-2 w-2 rounded-full", map[tone], className)} />;
}

export function Pill({ tone = "info" as Tone, children }: { tone?: Tone; children: React.ReactNode }) {
  const t = toneMap[tone];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium", t.bg, t.icon)}>
      <StatusDot tone={tone} />
      {children}
    </span>
  );
}
