import { AlertTriangle, Bell, FileText, Lock, Search, Truck, Users } from "lucide-react";

const sideItems = [
  "Overview",
  "Fleet Operations",
  "Dispatch Center",
  "Trips & Deliveries",
  "Fuel Intelligence",
  "Maintenance",
  "Safety & Incidents",
  "Reports",
  "Documents",
  "Users & Access",
  "Organisation",
];
const statCards = [
  ["Total Trucks", "142", "+12 vs last month", Truck],
  ["Active Trips", "78", "+6 vs yesterday", Users],
  ["Total Drivers", "156", "+9 vs last month", Users],
  ["Incidents", "12", "-3 vs yesterday", AlertTriangle],
] as const;

export function DashboardShowcase() {
  return (
    <div className="relative flex justify-center lg:justify-end">
      <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse_70%_60%_at_58%_52%,oklch(0.54_0.22_258/0.42),transparent_70%)] blur-3xl" />
      <div className="relative w-full max-w-[690px] overflow-hidden rounded-[18px] border border-primary/45 bg-[oklch(0.095_0.027_260)] p-4 shadow-[0_40px_120px_oklch(0_0_0/0.75),0_0_80px_oklch(0.55_0.22_258/0.25)] [transform:perspective(1500px)_rotateY(-5deg)_rotateX(1deg)_rotate(2deg)] lg:mr-[-8px]">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2 text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary">
              ⬢
            </span>
            <span className="font-bold">LIS</span>
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <div className="hidden h-7 w-36 items-center gap-2 rounded-md bg-white/[0.035] px-3 text-[10px] md:flex">
              <Search className="h-3 w-3" />
              Search anything...
            </div>
            <Bell className="h-4 w-4" />
            <FileText className="h-4 w-4" />
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-200 to-primary" />
            <div className="hidden text-[9px] text-white md:block">
              <b>John Doe</b>
              <br />
              <span className="text-white/45">Operations Manager</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[112px_1fr] gap-4">
          <aside className="space-y-1.5 border-r border-white/8 pr-2 text-[9px] text-white/70">
            {sideItems.map((item, i) => (
              <div
                key={item}
                className={`rounded-md px-2 py-1.5 ${i === 0 ? "bg-primary/25 text-white" : ""}`}
              >
                {item}
              </div>
            ))}
          </aside>
          <main className="min-w-0">
            <h3 className="mb-3 text-[16px] font-semibold text-white">Overview</h3>
            <div className="grid grid-cols-4 gap-2.5">
              {statCards.map(([label, value, meta, Icon], idx) => (
                <div key={label} className="rounded-lg bg-white/[0.045] p-3">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] text-white/75">{label}</span>
                    <Icon className={`h-4 w-4 ${idx === 3 ? "text-amber-400" : "text-primary"}`} />
                  </div>
                  <div className="mt-3 text-2xl font-bold text-white">{value}</div>
                  <div
                    className={`mt-2 text-[9px] ${idx === 3 ? "text-red-400" : "text-emerald-400"}`}
                  >
                    {meta}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Panel title="Fleet Status">
                <div className="flex items-center gap-5">
                  <div className="grid h-28 w-28 place-items-center rounded-full bg-[conic-gradient(#1479ff_0_55%,#48d6ad_55%_79%,#9b87f5_79%_92%,#20b6e8_92%)]">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-[oklch(0.105_0.027_260)] text-center text-white">
                      <span className="text-2xl font-bold">142</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-[10px] text-white/75">
                    <p>
                      ● On Trip&nbsp;&nbsp; <b>78 (55%)</b>
                    </p>
                    <p>
                      ● Available&nbsp;&nbsp; <b>34 (24%)</b>
                    </p>
                    <p>
                      ● In Maintenance&nbsp;&nbsp; <b>18 (13%)</b>
                    </p>
                    <p>
                      ● Out of Service&nbsp;&nbsp; <b>12 (8%)</b>
                    </p>
                  </div>
                </div>
              </Panel>
              <Panel title="Delivery Performance">
                <div className="text-3xl font-bold text-white">
                  92.6% <span className="text-sm text-emerald-400">+8.4%</span>
                </div>
                <svg viewBox="0 0 260 90" className="mt-4 h-[90px] w-full">
                  <path
                    d="M0 60 C20 28 30 48 45 53 S75 37 90 54 S120 74 140 42 S170 23 190 63 S220 57 260 39"
                    fill="none"
                    stroke="#1479ff"
                    strokeWidth="3"
                  />
                  <g stroke="rgba(255,255,255,.08)">
                    <path d="M0 20H260M0 55H260M0 88H260" />
                  </g>
                </svg>
              </Panel>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Panel title="Alerts">
                <List
                  rows={["Maintenance overdue", "High fuel consumption", "Driver license expiring"]}
                />
              </Panel>
              <Panel title="Top Priority">
                <List
                  rows={[
                    "TRK-102 Maintenance overdue",
                    "Insurance expiring",
                    "Incident needs review",
                  ]}
                  lock
                />
              </Panel>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg bg-white/[0.04] p-3">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-[13px] font-semibold text-white">{title}</h4>
        <span className="text-[9px] text-primary">View all</span>
      </div>
      {children}
    </section>
  );
}
function List({ rows, lock }: { rows: string[]; lock?: boolean }) {
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div
          key={r}
          className="flex items-center justify-between border-t border-white/7 pt-2 text-[10px] text-white/80"
        >
          <span className="flex items-center gap-2">
            {lock ? (
              <Lock className="h-3 w-3 text-amber-400" />
            ) : (
              <AlertTriangle className="h-3 w-3 text-red-400" />
            )}
            {r}
          </span>
          <span className="text-white/45">{i ? "25m ago" : "10m ago"}</span>
        </div>
      ))}
    </div>
  );
}
