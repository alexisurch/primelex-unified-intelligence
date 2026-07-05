import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { GlassCard, SectionCard } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { usePreferences, type ThemePreference, type TrackingMode } from "@/lib/preferences";
import {
  Building2, Palette, Bell, ShieldCheck, Database, Activity,
  Satellite, Sun, Moon, MonitorSmartphone, Hand, Zap,
} from "lucide-react";

export const Route = createFileRoute("/_app/system-settings")({
  component: SystemSettings,
});

const sections = [
  { id: "general",       icon: Building2,   name: "General",       desc: "Company profile & branding" },
  { id: "notifications", icon: Bell,        name: "Notifications", desc: "Alerts & communications" },
  { id: "tracking",      icon: Satellite,   name: "Fleet Tracking",desc: "Manual vs Automated GPS" },
  { id: "appearance",    icon: Palette,     name: "Appearance",    desc: "Theme & display" },
  { id: "security",      icon: ShieldCheck, name: "Security",      desc: "MFA, SSO, session policy" },
  { id: "system",        icon: Database,    name: "System",        desc: "Backups, audit & data" },
] as const;

type SectionId = (typeof sections)[number]["id"];

function SystemSettings() {
  const [active, setActive] = useState<SectionId>("general");

  return (
    <>
      <Header title="System Settings" subtitle="Configure organization, tracking, appearance, security and audit" showExport={false} />
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
          {active === "general" && <GeneralSection />}
          {active === "notifications" && <NotificationsSection />}
          {active === "tracking" && <TrackingSection />}
          {active === "appearance" && <AppearanceSection />}
          {active === "security" && <SecuritySection />}
          {active === "system" && <SystemSection />}
        </div>
      </div>
    </>
  );
}

function GeneralSection() {
  return (
    <SectionCard title="Organization">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs text-muted-foreground">Legal Name</label><Input defaultValue="Primelex Logistics Ltd" className="mt-1 border-border bg-elevated/60" /></div>
        <div><label className="text-xs text-muted-foreground">Tax ID</label><Input defaultValue="NG-2024-887432" className="mt-1 border-border bg-elevated/60" /></div>
        <div><label className="text-xs text-muted-foreground">HQ Address</label><Input defaultValue="12 Marina, Lagos" className="mt-1 border-border bg-elevated/60" /></div>
        <div><label className="text-xs text-muted-foreground">Support Email</label><Input defaultValue="ops@primelex.com" className="mt-1 border-border bg-elevated/60" /></div>
      </div>
    </SectionCard>
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

function SecuritySection() {
  return (
    <SectionCard title="Security">
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4"><div className="text-xs text-muted-foreground">MFA Enforcement</div><div className="mt-1 text-lg font-semibold text-success">Required</div></GlassCard>
        <GlassCard className="p-4"><div className="text-xs text-muted-foreground">SSO Provider</div><div className="mt-1 text-lg font-semibold">Okta</div></GlassCard>
        <GlassCard className="p-4"><div className="text-xs text-muted-foreground">Session Timeout</div><div className="mt-1 text-lg font-semibold">30 minutes</div></GlassCard>
        <GlassCard className="p-4"><div className="text-xs text-muted-foreground">Data Encryption</div><div className="mt-1 text-lg font-semibold text-success">AES-256</div></GlassCard>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm" className="border-border bg-elevated/60">Cancel</Button>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
      </div>
    </SectionCard>
  );
}

function SystemSection() {
  return (
    <SectionCard title="System">
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Database className="h-3.5 w-3.5"/>Backups</div><div className="mt-1 text-lg font-semibold">Nightly · 02:00 UTC</div></GlassCard>
        <GlassCard className="p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Activity className="h-3.5 w-3.5"/>Audit Logs</div><div className="mt-1 text-lg font-semibold">Retained 365 days</div></GlassCard>
      </div>
    </SectionCard>
  );
}
