import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard, SectionCard, Pill } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, X, Printer, Sparkles } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/organisation/$orgSlug/_workspace/reports")({
  component: Reports,
});

type ReportId = "R-01" | "R-02" | "R-03" | "R-04" | "R-05" | "R-06";

interface ReportMeta {
  id: ReportId;
  name: string;
  schedule: string;
  format: string;
  owner: string;
  size: string;
  date: string;
  period: string;
  summary: string;
}

const reports: ReportMeta[] = [
  { id: "R-01", name: "Monthly Fleet Utilization", schedule: "Every Monday", format: "PDF", owner: "Adeleke O.", size: "2.4 MB", date: "2026-07-08", period: "Jun 08 – Jul 08, 2026", summary: "Fleet utilization averaged 81.7% across 128 vehicles. On-the-road volume held steady while idle time dropped 3% week-over-week. Four trucks remain offline pending diagnostics." },
  { id: "R-02", name: "Fuel Cost Analysis", schedule: "Weekly", format: "Excel", owner: "Bola A.", size: "1.8 MB", date: "2026-07-10", period: "Jul 04 – Jul 10, 2026", summary: "Fuel spend rose 8.4% versus the prior week, driven by three high-consumption routes. Diesel accounts for 78% of volume. Recommended rerouting on the Lagos–Kano corridor to recover ₦4.2M." },
  { id: "R-03", name: "Driver Performance Scorecard", schedule: "Bi-Weekly", format: "PDF", owner: "Chinedu O.", size: "3.1 MB", date: "2026-07-05", period: "Jun 21 – Jul 05, 2026", summary: "Average driver score is 78/100. Three drivers flagged high-risk due to repeated violations. Twelve drivers completed additional training. Overall incident rate down 12%." },
  { id: "R-04", name: "Incident & Safety Summary", schedule: "Monthly", format: "PDF", owner: "Yakubu D.", size: "2.0 MB", date: "2026-07-01", period: "Jun 01 – Jul 01, 2026", summary: "14 incidents recorded this month — 4 open, 3 under investigation, 7 resolved. Critical incidents down 25%. Estimated financial impact ₦2.6M. Root causes dominated by fatigue and mechanical faults." },
  { id: "R-05", name: "Maintenance Cost Report", schedule: "Monthly", format: "Excel", owner: "Kunle P.", size: "1.5 MB", date: "2026-07-01", period: "Jun 01 – Jul 01, 2026", summary: "22 service events completed or scheduled. Total maintenance spend ₦3.9M. Two overdue items escalated. Routine servicing accounts for 64% of work orders." },
  { id: "R-06", name: "Delivery KPI Dashboard", schedule: "Daily", format: "CSV", owner: "Ifeanyi N.", size: "0.4 MB", date: "2026-07-14", period: "Jul 08 – Jul 14, 2026", summary: "On-time delivery at 89.2%, below the 95% target. 11 delayed trips this week. Average delay 47 minutes. Lagos–Ibadan corridor is the primary contributor to slippage." },
];

function Reports() {
  const [readerReport, setReaderReport] = useState<ReportMeta | null>(null);

  function handleDownload(r: ReportMeta, format: string) {
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
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setReaderReport(r)}><Eye className="mr-1.5 h-3.5 w-3.5" />View</Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </SectionCard>
      </div>

      {readerReport && (
        <ReportReader
          report={readerReport}
          onClose={() => setReaderReport(null)}
          onDownload={(fmt) => handleDownload(readerReport, fmt)}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Report reader dialog                                                */
/* ------------------------------------------------------------------ */

interface ReportSection {
  heading: string;
  body: string[];
}

interface ReportData {
  intro: string;
  sections: ReportSection[];
  keyFindings: string[];
  recommendations: string[];
  conclusion: string;
}

function ReportReader({ report, onClose, onDownload }: {
  report: ReportMeta;
  onClose: () => void;
  onDownload: (fmt: string) => void;
}) {
  const data = getReportData(report.id);

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden p-0 gap-0">
        <DialogHeader className="flex-row shrink-0 items-center justify-between border-b border-border/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15"><FileText className="h-5 w-5 text-primary" /></div>
            <div>
              <DialogTitle className="text-base">{report.name}</DialogTitle>
              <div className="text-xs text-muted-foreground">{report.period} • {report.owner}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 border-border" onClick={() => toast.info("Sending to printer…")}><Printer className="mr-1.5 h-3.5 w-3.5" />Print</Button>
            <Button size="sm" variant="outline" className="h-8 border-border" onClick={() => onDownload("PDF")}><Download className="mr-1.5 h-3.5 w-3.5" />PDF</Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-lg border border-border/60 bg-elevated/40 px-4 py-2.5 text-xs text-muted-foreground">
            <span>Report ID: <span className="font-medium text-foreground">{report.id}</span></span>
            <span>Period: <span className="font-medium text-foreground">{report.period}</span></span>
            <span>Format: <span className="font-medium text-foreground">{report.format}</span></span>
            <span>Generated: <span className="font-medium text-foreground">{report.date}</span></span>
          </div>

          {/* AI-generated badge */}
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> AI-Generated Report
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl font-bold tracking-tight">{report.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{report.period}</p>
          </div>

          {/* Intro */}
          <p className="text-sm leading-relaxed text-foreground/90">{data.intro}</p>

          {/* Sections */}
          {data.sections.map((s, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">{s.heading}</h3>
              {s.body.map((p, j) => (
                <p key={j} className="text-sm leading-relaxed text-foreground/80">{p}</p>
              ))}
            </div>
          ))}

          {/* Key findings */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Key Findings</h3>
            <ul className="space-y-1.5">
              {data.keyFindings.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Recommendations</h3>
            <ul className="space-y-1.5">
              {data.recommendations.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Conclusion */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Conclusion</h3>
            <p className="text-sm leading-relaxed text-foreground/80">{data.conclusion}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border/60 pt-4">
            <div className="text-xs text-muted-foreground">
              Prepared by <span className="font-medium text-foreground">{report.owner}</span> • PrimeLex Logistics UIS
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-border" onClick={() => onDownload("PDF")}><Download className="mr-1.5 h-3.5 w-3.5" />PDF</Button>
              <Button size="sm" variant="outline" className="border-border" onClick={() => onDownload("DOC")}><Download className="mr-1.5 h-3.5 w-3.5" />DOC</Button>
              <Button size="sm" variant="outline" className="border-border" onClick={() => onDownload("CSV")}><Download className="mr-1.5 h-3.5 w-3.5" />CSV</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Written report content per report type                              */
/* ------------------------------------------------------------------ */

function getReportData(id: ReportId): ReportData {
  switch (id) {
    case "R-01": return fleetUtilizationReport();
    case "R-02": return fuelCostReport();
    case "R-03": return driverScorecardReport();
    case "R-04": return incidentSafetyReport();
    case "R-05": return maintenanceCostReport();
    case "R-06": return deliveryKpiReport();
  }
}

function fleetUtilizationReport(): ReportData {
  return {
    intro: "This report presents a comprehensive analysis of fleet utilization across the PrimeLex Logistics network for the period of June 8 through July 8, 2026. The analysis covers 128 active vehicles deployed across ten operational corridors spanning Lagos, Abuja, Port Harcourt, Kano, Ibadan, Enugu, Kaduna, Benin, Warri, and Jos. The objective is to evaluate deployment efficiency, identify underutilized assets, and recommend corrective actions to maximise return on fleet investment.",
    sections: [
      {
        heading: "Overall Utilisation Performance",
        body: [
          "The fleet achieved an average utilisation rate of 81.7% during the reporting period, representing a 2.1 percentage point improvement over the previous month. Of the 128 vehicles in the fleet, 98 (76.6%) were actively on the road during the snapshot window, 12 (9.4%) were idle, 10 (7.8%) were in maintenance, and 8 (6.3%) were offline pending diagnostics or parts.",
          "Utilisation peaked at 88.4% during the mid-period week (June 22–28), coinciding with heightened demand from FMCG and retail clients. The lowest utilisation was recorded in the final week at 74.2%, attributed to a scheduled maintenance cycle for twelve vehicles and a public holiday reducing trip volume.",
        ],
      },
      {
        heading: "Route-Level Analysis",
        body: [
          "The Lagos–Ibadan corridor recorded the highest utilisation at 94.1%, with vehicles averaging 11.2 trips per week. The Lagos–Kano corridor followed at 89.7%, though fuel consumption on this route was disproportionately high relative to revenue generated (see Fuel Cost Analysis report for detail). The Port Harcourt–Warri corridor showed the weakest performance at 61.3% utilisation, with three vehicles sitting idle for more than 72 consecutive hours on multiple occasions.",
          "Cross-regional routes (Lagos–Kano, Abuja–Kaduna) demonstrated strong demand but suffered from scheduling inefficiencies, with vehicles frequently waiting 4–6 hours between legs for return cargo. This deadhead time reduced effective utilisation by an estimated 8 percentage points on affected routes.",
        ],
      },
      {
        heading: "Idle and Offline Asset Review",
        body: [
          "Twelve vehicles were classified as idle for more than 48 hours during the period. Of these, seven were concentrated in the Port Harcourt and Benin depots, suggesting a regional demand mismatch. Three idle vehicles were newly registered and awaiting driver assignment. The remaining two were held as reserve capacity for high-priority client commitments that did not materialise.",
          "Eight vehicles remained offline for the entire reporting period. Four are pending engine diagnostic completion at the PrimeLEX Workshop, two await spare parts shipment from the manufacturer (expected delivery July 15), and two were involved in incidents requiring bodywork repair.",
        ],
      },
    ],
    keyFindings: [
      "Fleet utilisation improved to 81.7%, up 2.1 points from the prior month, driven primarily by stronger FMCG and retail demand.",
      "The Lagos–Ibadan corridor is the top performer at 94.1% utilisation, while Port Harcourt–Warri lags at 61.3%.",
      "Deadhead time on cross-regional routes is reducing effective utilisation by an estimated 8 percentage points.",
      "Eight vehicles remain offline, with four pending diagnostics and two awaiting spare parts delivery.",
      "Seven of twelve idle vehicles are concentrated in the Port Harcourt and Benin depots, indicating a regional demand mismatch.",
    ],
    recommendations: [
      "Redeploy three idle vehicles from the Port Harcourt depot to the Lagos depot to address the demand mismatch and recover an estimated 6 percentage points of utilisation.",
      "Implement a return-cargo matching system for cross-regional routes to reduce deadhead time, targeting a 50% reduction in empty-leg hours within four weeks.",
      "Prioritise completion of engine diagnostics for the four offline vehicles and establish a parts-delivery SLA with the manufacturer to reduce offline downtime.",
      "Conduct a demand review for the Port Harcourt–Warri corridor to determine whether capacity should be permanently reallocated or if new client acquisition is viable.",
      "Schedule the two incident-damaged vehicles for bodywork repair within the next ten days to return them to active service.",
    ],
    conclusion: "The fleet is performing above target with a clear upward trajectory in utilisation. However, the concentration of idle assets in specific regions and the persistent offline backlog represent recoverable capacity. By redeploying underutilised vehicles, addressing deadhead inefficiencies on long-haul routes, and accelerating the return of offline vehicles, the fleet can realistically reach 86–88% utilisation within the next reporting cycle. This would translate to approximately ₦3.5M in recovered revenue per month.",
  };
}

function fuelCostReport(): ReportData {
  return {
    intro: "This report analyses fuel expenditure across the PrimeLex Logistics fleet for the week of July 4–10, 2026. The analysis examines 24 fuel transactions totalling ₦639 million, identifies cost drivers and anomalies, and recommends corrective actions to bring fuel spend back within the established budget envelope. The report draws on transaction-level data, route-level consumption patterns, and vehicle-specific efficiency metrics.",
    sections: [
      {
        heading: "Weekly Spend Overview",
        body: [
          "Total fuel spend for the reporting week was ₦639 million, representing an 8.4% increase over the previous week's ₦589.6 million. This exceeds the weekly budget of ₦580 million by 10.2%. Diesel accounted for 78% of total volume (4,680 litres) with petrol making up the remaining 22% (1,320 litres). The average unit price across all transactions was ₦968 per litre, a marginal 1.2% increase attributed to local market fluctuations.",
          "The spend increase is not attributable to price inflation but rather to a 7.1% increase in total volume dispensed. This indicates that vehicles are consuming more fuel per kilometre, pointing to efficiency degradation rather than market-driven cost pressure.",
        ],
      },
      {
        heading: "Route and Vehicle Cost Drivers",
        body: [
          "Three routes were identified as primary contributors to the cost overrun. The Lagos–Kano corridor alone accounted for 34% of weekly fuel spend, with an average consumption rate of 48 litres per 100 km — 19% above the fleet benchmark of 40 L/100 km. The Abuja–Kaduna and Lagos–Port Harcourt routes followed, with consumption rates of 44 L/100 km and 43 L/100 km respectively.",
          "At the vehicle level, eight trucks were flagged for consumption exceeding the fleet average by more than 15%. Truck TRK-1001 (KJA 100XY) recorded the highest deviation at 52 L/100 km, a 30% overshoot. This vehicle has been flagged in two prior reports without corrective action. Trucks TRK-1005 and TRK-1008 also showed sustained overconsumption over the past three weeks.",
          "Fuel issued for 'General Use' rather than trip-specific assignment accounted for 33% of total volume. This category lacks route-level traceability and represents a blind spot in cost attribution. Several transactions in this category were recorded without an associated trip ID, making it impossible to validate whether the fuel was consumed operationally.",
        ],
      },
      {
        heading: "Efficiency and Compliance Observations",
        body: [
          "Cross-referencing fuel transactions with trip records reveals that 15% of fuel issues do not have a matching trip in the system. While some of these may be legitimate pre-trip fuelling, the volume suggests a data quality issue that should be resolved to enable accurate cost-per-kilometre calculations.",
          "Three transactions were flagged as 'Pending' status, meaning they were issued but not yet reconciled against a completed trip. Two of these are more than 72 hours old and require follow-up to confirm the fuel was used for its intended purpose.",
        ],
      },
    ],
    keyFindings: [
      "Fuel spend rose 8.4% week-over-week to ₦639M, exceeding the weekly budget by 10.2%.",
      "The increase is volume-driven (up 7.1%), not price-driven — vehicles are consuming more fuel per kilometre.",
      "The Lagos–Kano corridor accounts for 34% of weekly spend with consumption 19% above the fleet benchmark.",
      "Eight trucks are consuming more than 15% above the fleet average, with TRK-1001 at 30% overshoot.",
      "33% of fuel was issued as 'General Use' without trip-level traceability, creating a cost attribution blind spot.",
      "15% of fuel issues have no matching trip record, indicating a data quality gap.",
    ],
    recommendations: [
      "Reroute Lagos–Kano corridor trips via the Abuja–Kaduna–Kano expressway, which offers a 6% shorter distance and lower gradient, projected to reduce consumption by 8–12% and recover approximately ₦4.2M per week.",
      "Initiate immediate mechanical inspection of the eight flagged trucks, prioritising TRK-1001, TRK-1005, and TRK-1008. Prior reports have flagged these vehicles without follow-through.",
      "Mandate trip-specific fuel assignment for all issues, phasing out the 'General Use' category within two weeks. Exceptions should require managerial approval and a written justification.",
      "Reconcile the three 'Pending' transactions within 48 hours and implement an automated alert for any fuel issue unreconciled beyond 72 hours.",
      "Establish a weekly fuel efficiency review meeting with the Fleet Manager and Maintenance Supervisor to monitor the eight flagged vehicles and track consumption recovery.",
    ],
    conclusion: "The fuel cost overrun is significant but entirely addressable. The root cause is consumption inefficiency concentrated in specific vehicles and routes, not market price volatility. By rerouting the Lagos–Kano corridor, inspecting the eight flagged trucks, and enforcing trip-level fuel attribution, the fleet can recover an estimated ₦4.2M per week and return to budget within two reporting cycles. The data quality gaps around 'General Use' assignments and unreconciled transactions must be closed to ensure ongoing visibility.",
  };
}

function driverScorecardReport(): ReportData {
  return {
    intro: "This bi-weekly scorecard evaluates the performance of all 20 active drivers in the PrimeLex Logistics fleet for the period of June 21 through July 5, 2026. The assessment uses a composite scoring methodology incorporating safety record, on-time delivery performance, fuel efficiency, compliance adherence, and training completion. The report identifies high performers for recognition and at-risk drivers requiring intervention.",
    sections: [
      {
        heading: "Aggregate Performance",
        body: [
          "The fleet-wide average driver score was 78 out of 100, a 3-point improvement over the previous scoring period. Fifteen drivers (75%) scored above 70, placing them in the Low Risk category. Two drivers (10%) scored between 50 and 70 (Medium Risk), and three drivers (15%) scored below 50 (High Risk). No drivers scored below 30, which would trigger automatic suspension under current policy.",
          "The overall incident rate attributed to driver behaviour decreased by 12% compared to the prior period, from 8 incidents to 7. This correlates with the twelve drivers who completed additional defensive driving and fatigue management training during the period.",
        ],
      },
      {
        heading: "Top Performers",
        body: [
          "Adeleke O. (DRV-500) achieved the highest score of 94, with zero violations, a 98% on-time delivery rate, and fuel consumption 8% below the fleet average. Adeleke has maintained a score above 90 for four consecutive scoring periods and is recommended for the quarterly Safe Driver recognition programme.",
          "Tunde A. (DRV-501) and Chinedu E. (DRV-502) followed with scores of 91 and 89 respectively. Both drivers completed all assigned trainings and recorded no at-fault incidents during the period. Tunde's fuel efficiency on the Lagos–Ibadan corridor was particularly noteworthy at 36 L/100 km, 10% below the route average.",
        ],
      },
      {
        heading: "At-Risk Drivers",
        body: [
          "Three drivers were flagged as High Risk. Musa I. (DRV-505) scored 44 with three violations (speeding, route deviation, and a missed pre-trip inspection) and was involved in one cargo damage incident. Halima Y. (DRV-514) scored 47 with two violations and a pattern of late deliveries on the Abuja–Kaduna route. Yakubu D. (DRV-509) scored 49 with repeated fuel overconsumption and one speeding violation.",
          "Musa I. has now been flagged as High Risk for three consecutive scoring periods. Under the company's progressive intervention policy, a formal performance improvement plan (PIP) is required. The previous two periods resulted in verbal and written warnings without measurable improvement.",
        ],
      },
      {
        heading: "Training and Development",
        body: [
          "Twelve drivers completed additional training during the period: eight completed defensive driving modules and four completed fatigue management workshops. Drivers who completed training showed an average score improvement of 6.2 points compared to their pre-training baselines, supporting the correlation between training investment and performance outcomes.",
          "Five drivers have not completed any training in the current quarter. These drivers should be enrolled in the next available session to maintain compliance with the company's quarterly training requirement.",
        ],
      },
    ],
    keyFindings: [
      "Average driver score improved to 78/100, up 3 points from the prior period.",
      "15 of 20 drivers are classified Low Risk; 3 drivers remain High Risk with repeated flagging.",
      "Adeleke O. is the top performer at 94/100 with zero violations and best-in-class fuel efficiency.",
      "The incident rate dropped 12%, correlating with 12 drivers completing additional training.",
      "Musa I. has been High Risk for three consecutive periods and requires a formal PIP.",
      "Trained drivers improved their scores by an average of 6.2 points, validating training ROI.",
    ],
    recommendations: [
      "Issue a formal Performance Improvement Plan for Musa I. within five business days, including mandatory retraining, weekly check-ins, and a 30-day review checkpoint. Failure to improve above 60 should result in suspension.",
      "Enrol the five drivers with no current-quarter training into the next available defensive driving and fatigue management sessions.",
      "Nominate Adeleke O. for the quarterly Safe Driver recognition programme and consider assigning him as a mentor for at-risk drivers.",
      "Investigate the Abuja–Kaduna route conditions contributing to Halima Y.'s pattern of late deliveries — the issue may be route-specific rather than driver-specific.",
      "Schedule a fuel efficiency coaching session for Yakubu D. in conjunction with the mechanical inspection recommended for his assigned truck (TRK-1009).",
    ],
    conclusion: "The driver pool is trending positively, with the majority performing well and the training programme showing measurable returns. However, the three persistently High Risk drivers — particularly Musa I., who has failed to improve despite two prior interventions — represent a safety and operational risk that can no longer be addressed with incremental warnings. Decisive action through a formal PIP, combined with continued training investment for the broader pool, will sustain the upward performance trajectory and further reduce incident rates.",
  };
}

function incidentSafetyReport(): ReportData {
  return {
    intro: "This monthly report summarises all safety incidents recorded across the PrimeLex Logistics fleet for the period of June 1 through July 1, 2026. Fourteen incidents were logged during this period, spanning vehicle accidents, cargo damage, mechanical breakdowns, and driver misconduct. The report categorises incidents by type, severity, root cause, and resolution status, and provides a financial impact assessment alongside corrective action recommendations.",
    sections: [
      {
        heading: "Incident Volume and Severity",
        body: [
          "Fourteen incidents were recorded during the month, a 17.6% decrease from the seventeen incidents logged in May. Of the fourteen, two were classified as Critical, four as High, five as Moderate, and three as Low severity. Critically, the number of Critical incidents dropped by 25% (from 4 to 2), indicating that while overall volume decreased modestly, the most dangerous events are declining at a faster rate.",
          "By resolution status, four incidents remain Open, three are under Investigation, and seven have been Resolved. The resolution rate of 50% is below the company target of 70% within 30 days. Two of the open incidents are more than 20 days old and require escalation.",
        ],
      },
      {
        heading: "Incident Type Breakdown",
        body: [
          "Vehicle breakdowns were the most common incident type, accounting for 5 of the 14 events (36%). Cargo damage followed with 3 incidents (21%), then accidents and driver misconduct with 2 each (14% each). Theft and delivery issues accounted for 1 incident each. The predominance of mechanical breakdowns aligns with the maintenance backlog identified in the Maintenance Cost Report, suggesting a systemic link between deferred maintenance and roadside failures.",
          "The two Critical incidents were both accidents occurring on the Lagos–Kano corridor during adverse weather conditions. Neither resulted in injury, but both caused significant cargo loss and vehicle damage, with a combined estimated financial impact of ₦950,000.",
        ],
      },
      {
        heading: "Root Cause Analysis",
        body: [
          "Fatigue was identified as the leading root cause, contributing to 5 incidents (36%), particularly among drivers on long-haul routes exceeding 8 hours without a mandated rest break. Mechanical faults were the second most common cause at 4 incidents (29%), all linked to vehicles with overdue maintenance schedules. Weather conditions, human error, and route deviation each contributed to 1–2 incidents.",
          "The correlation between fatigue and long-haul routes suggests that current scheduling practices do not adequately account for mandatory rest periods. Three of the five fatigue-related incidents involved drivers who had been on duty for more than 10 hours at the time of the event.",
        ],
      },
      {
        heading: "Financial Impact",
        body: [
          "The total estimated financial impact across all fourteen incidents was ₦2.6 million. This includes cargo loss, vehicle repair costs, third-party damages, and estimated revenue loss from trip delays. The two Critical accidents accounted for ₦950,000 (37%) of the total. Cargo damage incidents contributed ₦680,000, and mechanical breakdowns added ₦520,000 in towing and repair costs.",
          "The remaining ₦450,000 was distributed across the lower-severity incidents. While the total impact represents a 15% decrease from May's ₦3.1M, the per-incident cost has risen due to the higher proportion of Critical events relative to Low-severity ones.",
        ],
      },
    ],
    keyFindings: [
      "Total incidents decreased 17.6% to 14, with Critical incidents down 25% — the most dangerous events are declining fastest.",
      "Vehicle breakdowns are the most common type (36%), linked to the maintenance backlog identified in the Maintenance Cost Report.",
      "Fatigue is the leading root cause (36%), with three incidents involving drivers on duty for 10+ hours.",
      "The resolution rate of 50% is below the 70% target; two open incidents are over 20 days old.",
      "Total financial impact was ₦2.6M, down 15% from May, though per-incident cost has risen.",
      "The two Critical accidents both occurred on the Lagos–Kano corridor during adverse weather.",
    ],
    recommendations: [
      "Enforce mandatory rest breaks for all long-haul routes exceeding 8 hours, using the telematics system to monitor compliance and alert dispatchers when a driver approaches the limit.",
      "Prioritise maintenance for the four vehicles whose overdue service schedules contributed to roadside breakdowns — this addresses the root cause of the largest incident category.",
      "Escalate the two open incidents older than 20 days to the Safety Committee for expedited resolution and assign a dedicated investigator.",
      "Introduce a weather-based dispatch protocol for the Lagos–Kano corridor, with mandatory speed reduction and increased following distance during adverse conditions.",
      "Conduct a fatigue management refresher for all long-haul drivers, building on the training programme that showed positive results in the Driver Performance Scorecard.",
    ],
    conclusion: "Safety performance is improving, with both overall incident volume and the most severe events trending downward. However, the persistence of fatigue-related incidents and the clear link between deferred maintenance and roadside breakdowns indicate that the gains are fragile. The ₦2.6M in financial impact is recoverable through proactive scheduling enforcement, maintenance prioritisation, and weather-aware dispatch protocols. Closing the resolution rate gap from 50% to the 70% target will also reduce the carry-over of open incidents into subsequent periods.",
  };
}

function maintenanceCostReport(): ReportData {
  return {
    intro: "This report provides a detailed analysis of maintenance expenditure and work order activity for the PrimeLex Logistics fleet during June 1–July 1, 2026. Twenty-two service events were recorded across the period, encompassing routine servicing, safety inspections, diagnostic work, and repairs. The report evaluates cost distribution, workshop performance, overdue items, and the relationship between maintenance timeliness and operational availability.",
    sections: [
      {
        heading: "Maintenance Spend Summary",
        body: [
          "Total maintenance expenditure for the period was ₦3.9 million, a 5.2% increase over the previous month's ₦3.7M. The increase is attributable to two unscheduled repair events for vehicles that experienced roadside breakdowns — incidents that could have been prevented through timely routine servicing. Routine maintenance accounted for 64% of total spend (₦2.5M), safety inspections 18% (₦702,000), diagnostics 11% (₦429,000), and repairs 7% (₦273,000).",
          "The average cost per service event was ₦177,273. Routine services averaged ₦112,000 per event, while unscheduled repairs averaged ₦365,000 — more than three times the cost of preventive maintenance. This cost differential reinforces the financial case for proactive servicing.",
        ],
      },
      {
        heading: "Work Order Status",
        body: [
          "Of the 22 work orders, 10 were Completed, 7 Scheduled, 3 In Workshop, and 2 Overdue. The completion rate of 45% is consistent with the mid-month reporting window, as several scheduled services are planned for the latter half of the period. However, the two overdue items represent vehicles that have exceeded their service interval by more than 500 km and are at elevated risk of mechanical failure.",
          "The two overdue vehicles are TRK-1003 (LSD 107ZK) and TRK-1011 (ABJ 177RT). TRK-1003 is overdue for brake inspection — a safety-critical service — and should be grounded until the inspection is completed. TRK-1011 is overdue for an oil change, which is lower risk but should still be addressed within the week.",
        ],
      },
      {
        heading: "Workshop Performance",
        body: [
          "Four workshops were utilised during the period. The PrimeLEX Workshop handled 55% of work orders and achieved the fastest average turnaround time of 1.8 days for routine services. AutoCare Workshop processed 25% of orders with a 2.4-day average turnaround. Brake Masters and TechAuto Services each handled 10% of orders, with turnaround times of 3.1 and 3.6 days respectively.",
          "The PrimeLEX Workshop's superior performance is partly due to its capacity for concurrent servicing and its stock of common spare parts. External workshops experienced delays primarily due to parts availability, with an average wait time of 1.2 days for non-stocked components.",
        ],
      },
      {
        heading: "Maintenance and Operational Impact",
        body: [
          "Cross-referencing maintenance records with the incident log reveals that two of the five vehicle breakdown incidents reported in the Safety Summary involved vehicles with overdue or recently lapsed service schedules. This direct correlation between deferred maintenance and roadside failures resulted in an estimated ₦520,000 in avoidable repair and towing costs — costs that would have been prevented by a ₦224,000 routine service.",
          "The ten vehicles currently in the Scheduled or In Workshop status represent 7.8% of the fleet and are temporarily unavailable for deployment, contributing to the idle capacity noted in the Fleet Utilisation report.",
        ],
      },
    ],
    keyFindings: [
      "Total maintenance spend was ₦3.9M, up 5.2%, with two unscheduled repairs driving the increase.",
      "Routine maintenance accounts for 64% of spend; unscheduled repairs cost 3x more than preventive services.",
      "Two work orders are overdue, including TRK-1003 which is overdue for a safety-critical brake inspection.",
      "The PrimeLEX Workshop outperforms external providers with a 1.8-day average turnaround versus 3.1–3.6 days.",
      "Two of five roadside breakdowns involved vehicles with lapsed service schedules, causing ₦520K in avoidable costs.",
      "A ₦224K routine service would have prevented the ₦520K in breakdown-related costs — a 2.3x cost avoidance ratio.",
    ],
    recommendations: [
      "Ground TRK-1003 immediately and complete the overdue brake inspection at the PrimeLEX Workshop within 48 hours. No vehicle with an overdue safety-critical service should remain in operation.",
      "Implement an automated service interval alert that triggers at 80% of the km-based threshold, giving the scheduling team a 2,000 km window to book the service before it becomes overdue.",
      "Increase the proportion of work routed through the PrimeLEX Workshop from 55% to 70% for routine services to leverage its faster turnaround and parts availability.",
      "Establish a minimum spare parts stock at the PrimeLEX Workshop for the top ten most frequently replaced components to eliminate the 1.2-day wait for external parts.",
      "Conduct a cost-benefit analysis of bringing one additional workshop bay online internally, given that the cost avoidance ratio of preventive maintenance is 2.3x.",
    ],
    conclusion: "The maintenance programme is functioning adequately but is leaking value through overdue services and the resulting unscheduled breakdowns. The 2.3x cost avoidance ratio between preventive and reactive maintenance is clear evidence that investing in timely servicing pays for itself. Grounding the safety-critical overdue vehicle, implementing proactive service alerts, and consolidating work at the PrimeLEX Workshop will reduce both maintenance costs and the operational disruption caused by avoidable roadside failures.",
  };
}

function deliveryKpiReport(): ReportData {
  return {
    intro: "This report presents the daily delivery performance analysis for the PrimeLex Logistics fleet covering July 8–14, 2026. The report evaluates on-time delivery rates, delay patterns, route-specific performance, and customer impact. With 142 active deliveries during the week, the analysis identifies the primary contributors to slippage against the 95% on-time target and recommends corrective actions to recover performance.",
    sections: [
      {
        heading: "On-Time Delivery Performance",
        body: [
          "The fleet achieved an on-time delivery rate of 89.2% during the reporting week, falling short of the 95% target by 5.8 percentage points. Of the 142 active deliveries, 126 were completed on time, 11 were delayed, and 5 were cancelled or rescheduled. The on-time rate represents a 2.1 percentage point decline from the prior week's 91.3%, continuing a three-week downward trend.",
          "The eleven delayed trips averaged 47 minutes of slippage, with the longest delay reaching 2 hours and 18 minutes on trip TRP-7382 to ABC Stores. Six of the eleven delays were under 45 minutes, suggesting that modest scheduling adjustments could recover most of the gap. However, the five delays exceeding one hour indicate structural issues beyond simple scheduling inefficiency.",
        ],
      },
      {
        heading: "Route and Corridor Analysis",
        body: [
          "The Lagos–Ibadan corridor was the primary contributor to delivery slippage, accounting for 7 of the 11 delayed trips (64%). The corridor's on-time rate of 78.4% is significantly below the fleet average and well under target. Contributing factors include persistent traffic congestion on the Lagos–Ibadan Expressway, particularly during morning peak hours (7:00–10:00 AM), and a high concentration of time-sensitive retail deliveries with narrow delivery windows.",
          "The Lagos–Kano corridor accounted for 2 delays, both related to the adverse weather conditions and fatigue-related incidents documented in the Safety Summary. The Abuja–Kaduna and Port Harcourt–Warri corridors each contributed 1 delay, linked to a mechanical breakdown and a scheduling conflict respectively.",
        ],
      },
      {
        heading: "Customer Impact Assessment",
        body: [
          "Three clients were affected by multiple delays during the week. ABC Stores received 3 delayed deliveries, Konga received 2, and Shoprite received 2. ABC Stores has now experienced delays in three consecutive reporting weeks and has formally raised a service level concern. This account represents ₦4.2M in monthly revenue and is at elevated churn risk if performance does not improve.",
          "The remaining 4 delays were distributed across individual clients with no recurring pattern. No client experienced a delay exceeding the 3-hour threshold that would trigger contractual penalty clauses during this period.",
        ],
      },
      {
        heading: "Delay Root Causes",
        body: [
          "Traffic congestion was the primary delay driver, accounting for 6 of 11 delays (55%), all on the Lagos–Ibadan corridor. Mechanical issues contributed 2 delays, weather conditions 2, and a scheduling error 1. The concentration of traffic-related delays on a single corridor suggests that route timing and scheduling adjustments could yield significant improvement without requiring additional resources.",
        ],
      },
    ],
    keyFindings: [
      "On-time delivery rate was 89.2%, missing the 95% target by 5.8 points and declining for a third consecutive week.",
      "11 trips were delayed with an average slippage of 47 minutes; 5 delays exceeded one hour.",
      "The Lagos–Ibadan corridor caused 64% of all delays, with a 78.4% on-time rate versus the fleet's 89.2%.",
      "Traffic congestion on the Lagos–Ibadan Expressway during morning peak is the single largest delay driver (55%).",
      "ABC Stores has been delayed in three consecutive weeks and has raised a formal service concern — the account is at churn risk.",
      "No contractual penalty thresholds were breached, but the trend is moving in that direction.",
    ],
    recommendations: [
      "Adjust Lagos–Ibadan departure times to depart before 6:30 AM or after 10:30 AM, avoiding the morning peak congestion window that caused 6 of the 11 delays.",
      "Assign a dedicated account manager to ABC Stores within 48 hours, conduct a service review meeting, and provide a written commitment to improved delivery times with weekly performance reporting.",
      "Reroute Lagos–Ibadan deliveries via the Lagos–Ibadan Expressway's alternative exit at Ogere to bypass the Ibadan toll-gate bottleneck, projected to reduce average transit time by 12–18 minutes.",
      "Implement a real-time delay alert system that notifies the customer and the operations team when a trip is projected to arrive more than 15 minutes past the delivery window.",
      "Review the scheduling of time-sensitive retail deliveries on the Lagos–Ibadan corridor to ensure delivery windows account for known traffic patterns rather than ideal-condition transit times.",
    ],
    conclusion: "The delivery performance decline is concentrated on a single corridor and driven primarily by traffic congestion — a factor that is predictable and manageable through scheduling adjustments. The risk to the ABC Stores account elevates the urgency of corrective action. By shifting departure times, utilising the alternative Ogere exit, and engaging ABC Stores proactively, the fleet can realistically recover to 93–94% within two weeks and reach the 95% target within the month. The real-time delay alert system will also improve customer communication and reduce the perception of poor service even when minor delays occur.",
  };
}
