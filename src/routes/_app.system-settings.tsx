import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard, SectionCard } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Building2, Palette, Bell, ShieldCheck, Database, Activity } from "lucide-react";

export const Route = createFileRoute("/_app/system-settings")({
  component: SystemSettings,
});

const sections = [
  { icon: Building2, name: "Organization", desc: "Company profile & branding" },
  { icon: Palette, name: "Theme", desc: "Appearance & display" },
  { icon: Bell, name: "Notifications", desc: "Alerts & communications" },
  { icon: ShieldCheck, name: "Security", desc: "MFA, SSO, session policy" },
  { icon: Database, name: "Backups", desc: "Data retention & backup" },
  { icon: Activity, name: "Audit Logs", desc: "System activity trail" },
];

function SystemSettings() {
  return (
    <>
      <Header title="System Settings" subtitle="Configure organization, security, notifications and audit" showExport={false} />
      <div className="grid grid-cols-1 gap-6 p-8 xl:grid-cols-[280px_1fr]">
        <div className="space-y-1">
          {sections.map((s, i) => (
            <button key={s.name} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${i === 0 ? "bg-primary/15 text-white" : "text-muted-foreground hover:bg-white/[0.04] hover:text-white"}`}>
              <s.icon className={`h-4 w-4 ${i === 0 ? "text-primary" : ""}`} />
              <div className="flex-1"><div className="font-medium">{s.name}</div><div className="text-[11px] text-muted-foreground">{s.desc}</div></div>
            </button>
          ))}
        </div>
        <div className="space-y-6">
          <SectionCard title="Organization">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-muted-foreground">Legal Name</label><Input defaultValue="Primelex Logistics Ltd" className="mt-1 border-border bg-elevated/60" /></div>
              <div><label className="text-xs text-muted-foreground">Tax ID</label><Input defaultValue="NG-2024-887432" className="mt-1 border-border bg-elevated/60" /></div>
              <div><label className="text-xs text-muted-foreground">HQ Address</label><Input defaultValue="12 Marina, Lagos" className="mt-1 border-border bg-elevated/60" /></div>
              <div><label className="text-xs text-muted-foreground">Support Email</label><Input defaultValue="ops@primelex.com" className="mt-1 border-border bg-elevated/60" /></div>
            </div>
          </SectionCard>
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
        </div>
      </div>
    </>
  );
}
