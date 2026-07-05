import { GlassCard } from "./Cards";
import { Sparkles, Satellite, MapPinOff } from "lucide-react";
import { usePreferences } from "@/lib/preferences";


export function AIInsight({ title, insights }: { title?: string; insights: { label: string; detail: string; tone?: "info" | "success" | "warning" | "danger" | "purple" }[] }) {
  return (
    <GlassCard className="border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-purple/10">
      <div className="flex items-center gap-2 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold">{title ?? "AI Recommendations"}</h3>
          <p className="text-[11px] text-muted-foreground">Powered by PrimeLex Intelligence</p>
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
