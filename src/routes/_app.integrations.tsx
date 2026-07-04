import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard, SectionCard, Pill } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { Plug, Database, Cloud, Mail, Webhook, Key, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_app/integrations")({
  component: Integrations,
});

const integrations = [
  { name: "SAP ERP", desc: "Enterprise resource planning sync", icon: Database, tone: "info", status: "Connected", lastSync: "2 min ago" },
  { name: "Salesforce CRM", desc: "Customer & order data", icon: Cloud, tone: "success", status: "Connected", lastSync: "12 min ago" },
  { name: "Fleetmatics GPS", desc: "Real-time telematics feed", icon: Plug, tone: "success", status: "Connected", lastSync: "Real-time" },
  { name: "Total Fuel Network", desc: "Fuel card transactions", icon: Database, tone: "warning", status: "Syncing", lastSync: "Now" },
  { name: "SendGrid Email", desc: "Transactional email delivery", icon: Mail, tone: "success", status: "Connected", lastSync: "5 min ago" },
  { name: "Slack Webhooks", desc: "Alert notifications", icon: Webhook, tone: "info", status: "Connected", lastSync: "1 hr ago" },
  { name: "Google Maps API", desc: "Routing & geocoding", icon: Cloud, tone: "success", status: "Connected", lastSync: "Real-time" },
  { name: "AWS S3", desc: "Document archive", icon: Database, tone: "danger", status: "Error", lastSync: "3 hr ago" },
];

const apiKeys = [
  { label: "Production API", key: "plx_live_••••••••••••7f2a", scope: "Full access", created: "Jan 12, 2026" },
  { label: "Dispatch Webhook", key: "plx_hook_••••••••••••4c9b", scope: "Dispatch only", created: "Feb 03, 2026" },
  { label: "Read-only Reporting", key: "plx_read_••••••••••••e18d", scope: "Read only", created: "Mar 22, 2026" },
];

function Integrations() {
  return (
    <>
      <Header title="Integrations" subtitle="Connected systems, sync status, API keys and webhooks" showExport={false} />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((it) => (
            <GlassCard key={it.name}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-${it.tone}/15`}>
                    <it.icon className={`h-5 w-5 text-${it.tone}`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{it.name}</div>
                    <div className="text-xs text-muted-foreground">{it.desc}</div>
                  </div>
                </div>
                <Pill tone={it.status === "Connected" ? "success" : it.status === "Syncing" ? "warning" : "danger"}>{it.status}</Pill>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-xs text-muted-foreground">Last sync: {it.lastSync}</span>
                <Button size="sm" variant="ghost" className="h-7 text-xs"><RefreshCw className="mr-1 h-3 w-3"/>Sync</Button>
              </div>
            </GlassCard>
          ))}
        </div>

        <SectionCard title="API Keys" action={<Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30"><Key className="mr-1.5 h-3.5 w-3.5"/>Generate Key</Button>}>
          <div className="divide-y divide-border/60">
            {apiKeys.map((k) => (
              <div key={k.label} className="flex items-center gap-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15"><Key className="h-4 w-4 text-primary"/></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{k.label}</div>
                  <div className="font-mono text-xs text-muted-foreground">{k.key}</div>
                </div>
                <Pill tone="info">{k.scope}</Pill>
                <span className="text-xs text-muted-foreground">Created {k.created}</span>
                <Button size="sm" variant="ghost" className="text-xs">Revoke</Button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
