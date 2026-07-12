import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { SectionCard } from "@/components/shared/Cards";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { usePreferences, type ThemePreference, type TrackingMode } from "@/lib/preferences";
import {
  Bell, Palette, Satellite, Sun, Moon, MonitorSmartphone, Hand, Zap,
} from "lucide-react";

export const Route = createFileRoute("/_app/system-settings")({
  component: SystemSettings,
});

const sections = [
  { id: "notifications", icon: Bell,      name: "Notifications", desc: "Alerts & communications" },
  { id: "tracking",      icon: Satellite, name: "Fleet Tracking", desc: "Manual vs Automated GPS" },
  { id: "appearance",    icon: Palette,   name: "Appearance",    desc: "Theme & display" },
] as const;

type SectionId = (typeof sections)[number]["id"];

function SystemSettings() {
  const [active, setActive] = useState<SectionId>("notifications");

  return (
    <>
      <Header title="System Settings" subtitle="Configure tracking, notifications and appearance" showExport={false} />
      <div className="grid grid-cols-1 gap-6 p-8 xl:grid-cols-[280px_1fr]">
        <div className="space-y-1">
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  isActive
                    ? "bg-primary/15 text-foreground"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                )}
              >
                <s.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                <div className="flex-1">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground">{s.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          {active === "notifications" && <NotificationsSection />}
          {active === "tracking" && <TrackingSection />}
          {active === "appearance" && <AppearanceSection />}
        </div>
      </div>
    </>
  );
}

function NotificationsSection() {
  return (
    <SectionCard title="Notifications">
      {[
        { label: "Delivery delays", desc: "Alert when a delivery is at risk", on: true },
        { label: "Maintenance due", desc: "Notify 7 days before service", on: true },
        { label: "Document expiry", desc: "License / insurance expiry warnings", on: true },
        { label: "Fuel anomalies", desc: "Trigger on unusual consumption", on: false },
      ].map((n) => (
        <div key={n.label} className="flex items-center justify-between border-t border-border/60 py-3 first:border-0 first:pt-0">
          <div><div className="text-sm font-medium">{n.label}</div><div className="text-xs text-muted-foreground">{n.desc}</div></div>
          <Switch defaultChecked={n.on}/>
        </div>
      ))}
    </SectionCard>
  );
}

function TrackingSection() {
  const { trackingMode, setTrackingMode } = usePreferences();

  const options: { id: TrackingMode; icon: typeof Hand; name: string; desc: string }[] = [
    { id: "manual",    icon: Hand, name: "Manual Tracking",    desc: "Operations staff manually update trip progress, truck status, and last known location. Suitable for fleets without GPS integration." },
    { id: "automated", icon: Zap,  name: "Automated Tracking", desc: "Live truck locations are synchronized automatically from an integrated GPS provider." },
  ];

  return (
    <SectionCard title="Fleet Tracking Mode">
      <p className="pb-4 text-xs text-muted-foreground">
        Choose how vehicle locations and trip progress are updated across the platform. This setting affects every module that depends on GPS.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {options.map((o) => {
          const active = trackingMode === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setTrackingMode(o.id)}
              className={cn(
                "group flex flex-col items-start rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-primary/50 bg-primary/10 shadow-[inset_0_0_0_1px_oklch(0.62_0.19_258/0.25)]"
                  : "border-border/60 bg-background/30 hover:border-primary/30",
              )}
            >
              <div className="flex w-full items-center justify-between">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", active ? "bg-primary/25 text-primary" : "bg-elevated/70 text-muted-foreground")}>
                  <o.icon className="h-4 w-4" />
                </div>
                <span className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                  active ? "border-primary bg-primary" : "border-border",
                )}>
                  {active && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
                </span>
              </div>
              <div className="mt-3 text-sm font-semibold text-foreground">{o.name}</div>
              <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{o.desc}</div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 rounded-lg border border-border/60 bg-background/30 p-3 text-[11px] text-muted-foreground">
        <span className="font-medium text-foreground">Current mode:</span>{" "}
        {trackingMode === "manual"
          ? "Live maps are hidden. Trucks and trips show last known location and manual updates."
          : "Live maps, ETA calculations and nearest-truck recommendations are enabled across the platform."}
      </div>
    </SectionCard>
  );
}

function AppearanceSection() {
  const { theme, setTheme, resolvedTheme } = usePreferences();
  const options: { id: ThemePreference; icon: typeof Sun; name: string; desc: string }[] = [
    { id: "dark",   icon: Moon,               name: "Dark",           desc: "Default PrimeLex enterprise theme." },
    { id: "light",  icon: Sun,                name: "Light",          desc: "High-contrast light interface." },
    { id: "system", icon: MonitorSmartphone,  name: "System Default", desc: "Match your operating system preference." },
  ];

  return (
    <SectionCard title="Appearance">
      <p className="pb-4 text-xs text-muted-foreground">
        Choose a theme for the main workspace. The sidebar always uses the PrimeLex brand dark palette.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {options.map((o) => {
          const active = theme === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setTheme(o.id)}
              className={cn(
                "flex flex-col items-start rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-primary/50 bg-primary/10"
                  : "border-border/60 bg-background/30 hover:border-primary/30",
              )}
            >
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", active ? "bg-primary/25 text-primary" : "bg-elevated/70 text-muted-foreground")}>
                <o.icon className="h-4 w-4" />
              </div>
              <div className="mt-3 text-sm font-semibold text-foreground">{o.name}</div>
              <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{o.desc}</div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 text-[11px] text-muted-foreground">
        Active theme: <span className="font-medium text-foreground capitalize">{resolvedTheme}</span>
      </div>
    </SectionCard>
  );
}
