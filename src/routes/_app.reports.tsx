import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard, SectionCard, Pill } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports")({
  component: Reports,
});

const reports = [
  { id: "R-01", name: "Monthly Fleet Utilization", schedule: "Every Monday", format: "PDF", owner: "Adeleke O.", size: "2.4 MB", date: "2026-07-08" },
  { id: "R-02", name: "Fuel Cost Analysis", schedule: "Weekly", format: "Excel", owner: "Bola A.", size: "1.8 MB", date: "2026-07-10" },
  { id: "R-03", name: "Driver Performance Scorecard", schedule: "Bi-Weekly", format: "PDF", owner: "Chinedu O.", size: "3.1 MB", date: "2026-07-05" },
  { id: "R-04", name: "Incident & Safety Summary", schedule: "Monthly", format: "PDF", owner: "Yakubu D.", size: "2.0 MB", date: "2026-07-01" },
  { id: "R-05", name: "Maintenance Cost Report", schedule: "Monthly", format: "Excel", owner: "Kunle P.", size: "1.5 MB", date: "2026-07-01" },
  { id: "R-06", name: "Delivery KPI Dashboard", schedule: "Daily", format: "CSV", owner: "Ifeanyi N.", size: "0.4 MB", date: "2026-07-14" },
];

function Reports() {
  const [readerReport, setReaderReport] = useState<typeof reports[number] | null>(null);

  function handleDownload(r: typeof reports[number], format: string) {
    toast.success(`Downloading "${r.name}" as ${format}…`);
  }

  return (
    <>
      <Header title="Reports" subtitle="Generated fleet analytics and operational reports" showExport={false} />
      <div className="space-y-6 p-8">
        <SectionCard title="Reports">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {reports.map((r) => (
              <GlassCard key={r.id} className="cursor-pointer" hover={true}>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15"><FileText className="h-5 w-5 text-primary" /></div>
                  <Pill tone="info">{r.format}</Pill>
                </div>
                <div className="mt-3 text-sm font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.schedule} • {r.owner} • {r.size}</div>
                <div className="text-[11px] text-muted-foreground mt-1">Generated: {r.date}</div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 border-border bg-elevated/60 text-xs" onClick={() => handleDownload(r, "PDF")}><Download className="mr-1 h-3 w-3" />PDF</Button>
                  <Button size="sm" variant="outline" className="h-7 border-border bg-elevated/60 text-xs" onClick={() => handleDownload(r, "DOC")}><Download className="mr-1 h-3 w-3" />DOC</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setReaderReport(r)}><Eye className="mr-1 h-3 w-3" />View</Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </SectionCard>
      </div>

      <Dialog open={!!readerReport} onOpenChange={(o) => { if (!o) setReaderReport(null); }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{readerReport?.name}</DialogTitle></DialogHeader>
          {readerReport && (
            <div className="space-y-4 pt-2">
              <div className="prose-invert max-h-[55vh] space-y-4 overflow-y-auto rounded-xl border border-border/60 bg-elevated/30 p-6 text-sm leading-relaxed text-muted-foreground">
                <h2 className="text-lg font-semibold text-foreground">Executive Summary</h2>
                <p>
                  This report covers the reporting period from {readerReport.date} for <strong className="text-foreground">{readerReport.name}</strong>.
                  The data presented herein is compiled from operational records maintained by the MUVD LOGISTICS platform and
                  reflects all activity logged through {readerReport.owner}'s fleet operations.
                </p>
                <h3 className="text-base font-semibold text-foreground">Key Findings</h3>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Fleet utilization remained within expected operational parameters during the reporting period.</li>
                  <li>Fuel efficiency metrics showed stable performance across the active truck fleet with minor variances on long-haul routes.</li>
                  <li>On-time delivery rate was maintained above the organisational benchmark of 90%.</li>
                  <li>Maintenance schedules were adhered to with no critical breakdowns reported during this cycle.</li>
                  <li>Driver performance scores remained consistent with prior reporting periods.</li>
                </ul>
                <h3 className="text-base font-semibold text-foreground">Operational Highlights</h3>
                <p>
                  During this period, the fleet operated across primary corridors connecting Lagos, Abuja, Port Harcourt,
                  and Kano. A total of 142 active deliveries were tracked through the dispatch system, with real-time
                  GPS telemetry providing coverage for 97% of active routes. Two minor incidents were logged and
                  resolved without impact to service level agreements.
                </p>
                <h3 className="text-base font-semibold text-foreground">Recommendations</h3>
                <ol className="list-decimal space-y-2 pl-5">
                  <li>Continue current maintenance cadence — no adjustments needed for the next cycle.</li>
                  <li>Review fuel procurement strategy for the western corridor to capture cost savings.</li>
                  <li>Schedule refresher training for drivers scoring below the fleet average.</li>
                  <li>Evaluate route optimisation opportunities on the Lagos–Kano axis.</li>
                </ol>
                <h3 className="text-base font-semibold text-foreground">Methodology</h3>
                <p>
                  Data was collected automatically through the MUVD LOGISTICS platform's integrated telemetry, dispatch, and
                  fuel management modules. All figures are verified against source logs and cross-referenced with
                  driver-subplied trip reports. The full data set is available for audit upon request.
                </p>
                <div className="border-t border-border/40 pt-4 text-xs text-muted-foreground">
                  Report ID: {readerReport.id} · Generated by {readerReport.owner} on {readerReport.date} ·
                  Format: {readerReport.format} · Size: {readerReport.size}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="border-border" onClick={() => handleDownload(readerReport, "PDF")}><Download className="mr-1.5 h-3.5 w-3.5" />Download PDF</Button>
                <Button size="sm" variant="outline" className="border-border" onClick={() => handleDownload(readerReport, "DOC")}><Download className="mr-1.5 h-3.5 w-3.5" />Download DOC</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
