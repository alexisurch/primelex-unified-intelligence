import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard, SectionCard, Pill } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { monthly } from "@/lib/mock-data";
import { FileText, Download, Clock, Plus, BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export const Route = createFileRoute("/_app/reports")({
  component: Reports,
});

const saved = [
  { id: "R-01", name: "Monthly Fleet Utilization", schedule: "Every Monday", format: "PDF", owner: "Adeleke O." },
  { id: "R-02", name: "Fuel Cost Analysis", schedule: "Weekly", format: "Excel", owner: "Bola A." },
  { id: "R-03", name: "Driver Performance Scorecard", schedule: "Bi-Weekly", format: "PDF", owner: "Chinedu O." },
  { id: "R-04", name: "Incident & Safety Summary", schedule: "Monthly", format: "PDF", owner: "Yakubu D." },
  { id: "R-05", name: "Maintenance Cost Report", schedule: "Monthly", format: "Excel", owner: "Kunle P." },
  { id: "R-06", name: "Delivery KPI Dashboard", schedule: "Daily", format: "CSV", owner: "Ifeanyi N." },
];

function Reports() {
  return (
    <>
      <Header title="Reports" subtitle="Enterprise report builder with scheduled delivery and export" showExport={false} />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
          <SectionCard title="Report Builder" action={<Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30"><Plus className="mr-1.5 h-3.5 w-3.5"/>New Report</Button>}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Data Source</label>
                <select className="mt-1 w-full rounded-md border border-border bg-elevated/60 px-3 py-2 text-sm"><option>Fleet Operations</option><option>Trips & Deliveries</option><option>Fuel Intelligence</option></select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Chart Type</label>
                <select className="mt-1 w-full rounded-md border border-border bg-elevated/60 px-3 py-2 text-sm"><option>Bar</option><option>Line</option><option>Area</option><option>Donut</option></select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Date Range</label>
                <select className="mt-1 w-full rounded-md border border-border bg-elevated/60 px-3 py-2 text-sm"><option>Last 30 days</option><option>Last 90 days</option><option>YTD</option></select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Export Format</label>
                <select className="mt-1 w-full rounded-md border border-border bg-elevated/60 px-3 py-2 text-sm"><option>PDF</option><option>Excel</option><option>CSV</option></select>
              </div>
            </div>
            <div className="mt-4 h-[240px] rounded-lg border border-border/60 bg-background/30 p-3">
              <ResponsiveContainer>
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)"/>
                  <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11}/>
                  <YAxis stroke="var(--muted-foreground)" fontSize={11}/>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}/>
                  <Bar dataKey="revenue" fill="var(--primary)" radius={[6,6,0,0]}/>
                  <Bar dataKey="cost" fill="var(--warning)" radius={[6,6,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
          <SectionCard title="Scheduled Reports">
            <div className="space-y-2">
              {saved.slice(0,5).map((r) => (
                <div key={r.id} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/30 p-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/15"><Clock className="h-4 w-4 text-info"/></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground">{r.schedule} • {r.owner}</div>
                  </div>
                  <Pill tone="info">{r.format}</Pill>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Saved Reports">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {saved.map((r) => (
              <GlassCard key={r.id} className="cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15"><FileText className="h-5 w-5 text-primary"/></div>
                  <Pill tone="info">{r.format}</Pill>
                </div>
                <div className="mt-3 text-sm font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.schedule} • {r.owner}</div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 border-border bg-elevated/60 text-xs"><Download className="mr-1 h-3 w-3"/>Download</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs"><BarChart3 className="mr-1 h-3 w-3"/>View</Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
