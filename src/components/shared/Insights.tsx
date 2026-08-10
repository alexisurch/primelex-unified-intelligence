import { GlassCard } from "./Cards";
import { Sparkles, Satellite, MapPinOff, Lightbulb, Fuel, Wrench, TriangleAlert as AlertTriangle, Star, ShieldAlert } from "lucide-react";
import { usePreferences } from "@/lib/preferences";

export interface Recommendation {
  title: string;
  detail: string;
  tone?: "info" | "success" | "warning" | "danger" | "purple";
  icon?: "fuel" | "maintenance" | "incident" | "performance" | "compliance" | "general";
}

const recIconMap: Record<string, typeof Lightbulb> = {
  fuel: Fuel, maintenance: Wrench, incident: AlertTriangle,
  performance: Star, compliance: ShieldAlert, general: Lightbulb,
};

export function RecommendationsSection({ title, recommendations }: { title: string; recommendations: Recommendation[] }) {
  if (recommendations.length === 0) return null;
  return (
    <GlassCard hover={false} className="border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-purple/10">
      <div className="flex items-center gap-2 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
          <Lightbulb className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold">{title}</h3>
          <p className="text-[11px] text-muted-foreground">Generated from operational data</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {recommendations.map((r, idx) => {
          const Icon = r.icon ? recIconMap[r.icon] ?? Lightbulb : Lightbulb;
          const tone = r.tone ?? "info";
          const bg = { info: "bg-info/15", success: "bg-success/15", warning: "bg-warning/15", danger: "bg-danger/15", purple: "bg-purple/15" }[tone];
          const text = { info: "text-info", success: "text-success", warning: "text-warning", danger: "text-danger", purple: "text-purple" }[tone];
          return (
            <div key={idx} className="rounded-lg border border-border/60 bg-background/30 p-3">
              <div className="flex items-center gap-2">
                <div className={"flex h-7 w-7 items-center justify-center rounded-lg " + bg}>
                  <Icon className={"h-3.5 w-3.5 " + text} />
                </div>
                <div className="text-[13px] font-medium text-foreground">{r.title}</div>
              </div>
              <div className="mt-1.5 text-xs text-muted-foreground">{r.detail}</div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}


export function AIInsight({ title, insights }: { title?: string; insights: { label: string; detail: string; tone?: "info" | "success" | "warning" | "danger" | "purple" }[] }) {
  return (
    <GlassCard className="border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-purple/10">
      <div className="flex items-center gap-2 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold">{title ?? "AI Recommendations"}</h3>
          <p className="text-[11px] text-muted-foreground">Powered by MUVD LOGISTICS</p>
        </div>
      </div>
      <div className="space-y-3">
        {insights.map((i, idx) => (
          <div key={idx} className="rounded-lg border border-border/60 bg-background/30 p-3">
            <div className="text-[13px] font-medium text-foreground">{i.label}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{i.detail}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export function InteractiveMap({ height = 320, label = "Live Fleet Map" }: { height?: number; label?: string }) {
  const { trackingMode } = usePreferences();
  if (trackingMode === "manual") {
    return <ManualTrackingPlaceholder height={height} />;
  }
  return (

    <div
      className="relative overflow-hidden rounded-xl border border-border/60 bg-[radial-gradient(ellipse_at_center,theme(colors.primary/15%),transparent_60%)]"
      style={{ height }}
    >
      {/* Grid */}
      <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(1 0 0 / 0.06)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Route lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 300" preserveAspectRatio="none">
        <path d="M 40 240 C 150 180, 260 220, 380 130 S 540 60, 580 40" stroke="var(--info)" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
        <path d="M 60 60 C 180 100, 300 80, 420 200 S 540 260, 560 260" stroke="var(--success)" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
        <path d="M 100 200 L 300 150 L 500 180" stroke="var(--warning)" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
      </svg>
      {/* Pins */}
      {[
        { x: 15, y: 20, tone: "success" }, { x: 30, y: 60, tone: "info" }, { x: 55, y: 40, tone: "warning" },
        { x: 70, y: 70, tone: "success" }, { x: 82, y: 25, tone: "danger" }, { x: 45, y: 80, tone: "info" },
        { x: 88, y: 55, tone: "purple" },
      ].map((p, i) => (
        <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <span className={`absolute inset-0 -m-2 animate-ping rounded-full bg-${p.tone}/40`} />
          <span className={`relative flex h-3 w-3 rounded-full bg-${p.tone} ring-2 ring-background`} />
        </div>
      ))}
      <div className="absolute bottom-3 left-3 rounded-lg border border-border bg-background/70 px-3 py-1.5 text-[11px] font-medium backdrop-blur">
        {label}
      </div>
      <div className="absolute right-3 top-3 flex gap-1">
        {["Traffic","Routes","Clusters"].map((t) => (
          <button key={t} className="rounded-md border border-border bg-background/70 px-2 py-1 text-[10px] font-medium backdrop-blur hover:border-primary/40">{t}</button>
        ))}
      </div>
    </div>
  );
}

export function ManualTrackingPlaceholder({ height = 320 }: { height?: number }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-[radial-gradient(ellipse_at_center,theme(colors.primary/10%),transparent_60%)] px-6 text-center"
      style={{ height }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="manualgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(0.6 0 0 / 0.15)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#manualgrid)" />
      </svg>
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-elevated/70 shadow-lg">
        <MapPinOff className="h-6 w-6 text-muted-foreground" />
        <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 ring-2 ring-background">
          <Satellite className="h-3 w-3 text-primary" />
        </span>
      </div>
      <h4 className="relative mt-4 text-[15px] font-semibold text-foreground">Live Fleet Map Unavailable</h4>
      <p className="relative mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground">
        Your organization is currently using <span className="font-medium text-foreground">Manual Tracking</span>.
        Live vehicle locations require an integrated GPS tracking provider.
      </p>
      <div className="relative mt-4 flex flex-wrap items-center justify-center gap-2">
        <button className="rounded-md border border-primary/40 bg-primary/15 px-3 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/25">
          Learn About GPS Integration
        </button>
        <span className="rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Tracking Source · Manual
        </span>
      </div>
    </div>
  );
}

