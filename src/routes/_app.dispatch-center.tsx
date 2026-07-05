import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, SectionCard, Pill } from "@/components/shared/Cards";
import { AIInsight, InteractiveMap } from "@/components/shared/Insights";
import { trips, trucks } from "@/lib/mock-data";
import { usePreferences } from "@/lib/preferences";
import { Radio, Truck, Clock, CheckCircle2, GripVertical, Zap, MapPin } from "lucide-react";


export const Route = createFileRoute("/_app/dispatch-center")({
  component: DispatchCenter,
});

function DispatchCenter() {
  const pending = trips.filter((t) => t.status === "Scheduled").slice(0, 6);
  const available = trucks.filter((t) => t.status === "Idle").slice(0, 6);

  return (
    <>
      <Header title="Dispatch Center" subtitle="Operational command center for real-time truck assignment" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Pending Requests" value="14" icon={Radio} tone="warning" />
          <KPICard label="Available Trucks" value="12" icon={Truck} tone="success" />
          <KPICard label="Avg Assign Time" value="4.2m" icon={Clock} tone="info" delta={{ value: "12%", direction: "up" }} />
          <KPICard label="Assigned Today" value="87" icon={CheckCircle2} tone="purple" />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
          <SectionCard title="Live Dispatch Map">
            <InteractiveMap height={420} label="Real-time nearby trucks" />
          </SectionCard>

          <SectionCard title="Trip Requests" action={<Pill tone="warning">{pending.length} pending</Pill>}>
            <div className="space-y-2.5">
              {pending.map((t) => (
                <div key={t.id} className="cursor-grab rounded-lg border border-border/60 bg-background/30 p-3 transition-all hover:border-primary/40">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-primary">{t.id}</span>
                    <Pill tone={t.priority === "Critical" ? "danger" : t.priority === "High" ? "warning" : "info"}>{t.priority}</Pill>
                  </div>
                  <div className="mt-2 text-sm font-medium">{t.customer}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{t.origin} → {t.destination}</div>
                  <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                    <span>{t.distance} km</span><span>ETA {t.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="space-y-4">
            <SectionCard title="Available Trucks">
              <div className="space-y-2">
                {available.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/30 p-2.5 transition-all hover:border-success/40">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/15"><Truck className="h-4 w-4 text-success" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold">{t.id}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{t.driver} • {t.fuel}% fuel</div>
                    </div>
                    <button className="rounded-md bg-primary/20 px-2 py-1 text-[10px] font-semibold text-primary hover:bg-primary/30">Assign</button>
                  </div>
                ))}
              </div>
            </SectionCard>
            <AIInsight insights={[
              { label: "Recommended: TRK-1012 for TRP-7305", detail: "Closest available truck, 96% capacity match" },
              { label: "Reassign TRP-7311 for on-time delivery", detail: "Predicted delay of 42 min under current route" },
            ]}/>
          </div>
        </div>

        <SectionCard title="Assignment Timeline">
          <div className="space-y-2">
            {trips.slice(0, 6).map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-white/[0.03]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15"><Zap className="h-4 w-4 text-primary" /></div>
                <div className="flex-1">
                  <div className="text-sm">Assigned <span className="font-medium text-primary">{t.id}</span> to <span className="font-medium">{t.driver}</span> ({t.truck})</div>
                  <div className="text-xs text-muted-foreground">{t.customer} • {t.origin} → {t.destination}</div>
                </div>
                <div className="text-xs text-muted-foreground">{t.eta} ago</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
