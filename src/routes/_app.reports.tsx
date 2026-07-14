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
              <div className="flex h-64 items-center justify-center rounded-xl border border-border/60 bg-elevated/40">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <FileText className="h-12 w-12" />
                  <span className="text-xs">Report preview — {readerReport.format}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-muted-foreground">Report ID: </span><span className="font-medium">{readerReport.id}</span></div>
                <div><span className="text-muted-foreground">Format: </span><span className="font-medium">{readerReport.format}</span></div>
                <div><span className="text-muted-foreground">Owner: </span><span className="font-medium">{readerReport.owner}</span></div>
                <div><span className="text-muted-foreground">Schedule: </span><span className="font-medium">{readerReport.schedule}</span></div>
                <div><span className="text-muted-foreground">Size: </span><span className="font-medium">{readerReport.size}</span></div>
                <div><span className="text-muted-foreground">Generated: </span><span className="font-medium">{readerReport.date}</span></div>
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
