import { Route as RouteIcon, Truck, Radio, Package, Fuel, Wrench, ShieldCheck, FileText, Users, Building2, TriangleAlert as AlertTriangle, Search, Maximize2, Bell, ChevronRight } from "lucide-react";

const NAV = [
  { icon: RouteIcon, label: "Overview", active: true },
  { icon: Truck, label: "Fleet Operations" },
  { icon: Radio, label: "Dispatch Center" },
  { icon: Package, label: "Trips & Deliveries" },
  { icon: Fuel, label: "Fuel Intelligence" },
  { icon: Wrench, label: "Maintenance" },
  { icon: ShieldCheck, label: "Safety & Incidents" },
  { icon: FileText, label: "Reports" },
  { icon: FileText, label: "Documents" },
  { icon: Users, label: "Users & Access" },
  { icon: Building2, label: "Organisation" },
];

export function DashboardPreview() {
  return (
    <div
      className="select-none overflow-hidden rounded-[14px] border border-white/[0.14] text-[6px] leading-none"
      style={{
        background: "oklch(0.15 0.026 258)",
        boxShadow:
          "0 0 0 1px oklch(1 0 0 / 0.05), 0 48px 100px -20px oklch(0 0 0 / 0.75), 0 12px 40px -8px oklch(0 0 0 / 0.5)",
        fontSize: "6px",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center justify-between px-[10px] py-[5px]"
        style={{ background: "oklch(0.13 0.022 258)", borderBottom: "1px solid oklch(1 0 0 / 0.06)" }}
      >
        <div className="flex items-center gap-[4px]">
          <div className="h-[5px] w-[5px] rounded-full bg-[#ff5f57]" />
          <div className="h-[5px] w-[5px] rounded-full bg-[#febc2e]" />
          <div className="h-[5px] w-[5px] rounded-full bg-[#28c840]" />
        </div>
        {/* Search bar */}
        <div
          className="flex items-center gap-[3px] rounded-[4px] px-[6px] py-[2.5px]"
          style={{ background: "oklch(0.22 0.03 258)", border: "1px solid oklch(1 0 0 / 0.08)", width: 90 }}
        >
          <Search className="shrink-0 text-white/30" style={{ width: 4.5, height: 4.5 }} />
          <span style={{ fontSize: 4.5, color: "oklch(1 0 0 / 0.25)" }}>Search anything...</span>
        </div>
        {/* Chrome right */}
        <div className="flex items-center gap-[5px]">
          <Maximize2 className="text-white/30" style={{ width: 5, height: 5 }} />
          <Bell className="text-white/30" style={{ width: 5, height: 5 }} />
          <div
            className="flex items-center gap-[3px] rounded-[3px] px-[3px] py-[2px]"
            style={{ background: "oklch(0.22 0.03 258)" }}
          >
            <div className="h-[7px] w-[7px] rounded-full bg-blue-400" />
            <div>
              <div style={{ fontSize: 4.5, color: "oklch(1 0 0 / 0.85)", fontWeight: 600 }}>John Doe</div>
              <div style={{ fontSize: 3.5, color: "oklch(1 0 0 / 0.4)" }}>Operations Manager</div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex" style={{ minHeight: 280 }}>
        {/* Sidebar */}
        <div
          className="flex shrink-0 flex-col py-[8px]"
          style={{
            width: 72,
            background: "oklch(0.13 0.022 258)",
            borderRight: "1px solid oklch(1 0 0 / 0.06)",
          }}
        >
          {/* Logo */}
          <div className="mb-[8px] flex items-center gap-[3px] px-[6px]">
            <div
              className="flex shrink-0 items-center justify-center bg-blue-500"
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
              }}
            >
              <RouteIcon style={{ width: 5, height: 5, color: "white" }} />
            </div>
            <span style={{ fontSize: 5, fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>LIS</span>
          </div>

          {/* Nav items */}
          <div className="flex flex-col gap-[1.5px] px-[4px]">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-[3px] rounded-[3px] px-[4px] py-[3px]"
                style={{
                  background: item.active
                    ? "oklch(0.48 0.18 258 / 0.22)"
                    : "transparent",
                  color: item.active ? "#60a5fa" : "oklch(1 0 0 / 0.45)",
                }}
              >
                <item.icon style={{ width: 4.5, height: 4.5, flexShrink: 0 }} />
                <span style={{ fontSize: 4.5, fontWeight: item.active ? 600 : 400 }}>
                  {item.label}
                </span>
                {item.active && (
                  <ChevronRight style={{ width: 3.5, height: 3.5, marginLeft: "auto", opacity: 0.5 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col p-[8px]" style={{ background: "oklch(0.15 0.026 258)" }}>
          {/* Page title */}
          <div style={{ fontSize: 9, fontWeight: 700, color: "white", marginBottom: 6 }}>Overview</div>

          {/* KPI Cards row */}
          <div className="mb-[5px] grid grid-cols-4 gap-[4px]">
            {[
              { label: "Total Trucks", value: "142", sub: "+12 vs last month", subColor: "#60a5fa" },
              { label: "Active Trips", value: "78", sub: "+6 vs yesterday", subColor: "#34d399" },
              { label: "Total Drivers", value: "156", sub: "+9 vs last month", subColor: "#60a5fa" },
              { label: "Incidents", value: "12", sub: "+3 vs yesterday", subColor: "#f87171", warn: true },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-[4px] p-[5px]"
                style={{
                  background: "oklch(0.2 0.03 258)",
                  border: "1px solid oklch(1 0 0 / 0.07)",
                }}
              >
                <div style={{ fontSize: 4, color: "oklch(1 0 0 / 0.45)", marginBottom: 2 }}>{kpi.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "white", lineHeight: 1 }}>{kpi.value}</div>
                <div style={{ fontSize: 3.5, color: kpi.subColor, marginTop: 2 }}>{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Lower row: Fleet Status + Delivery Performance */}
          <div className="mb-[4px] grid grid-cols-[100px_1fr] gap-[4px]">
            {/* Fleet Status donut */}
            <div
              className="rounded-[4px] p-[5px]"
              style={{ background: "oklch(0.2 0.03 258)", border: "1px solid oklch(1 0 0 / 0.07)" }}
            >
              <div style={{ fontSize: 5, fontWeight: 600, color: "white", marginBottom: 4 }}>Fleet Status</div>
              <div className="flex items-center gap-[4px]">
                {/* Donut SVG */}
                <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
                  <circle cx="18" cy="18" r="13" fill="none" stroke="oklch(1 0 0 / 0.06)" strokeWidth="5" />
                  {/* On Trip 55% = 198deg */}
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#3b82f6" strokeWidth="5"
                    strokeDasharray="81.68 148.33" strokeLinecap="round" transform="rotate(-90 18 18)" />
                  {/* Available 24% */}
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#22c55e" strokeWidth="5"
                    strokeDasharray="35.63 194.38" strokeLinecap="round"
                    transform={`rotate(${-90 + 55 * 3.6} 18 18)`} />
                  {/* Maintenance 13% */}
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#f59e0b" strokeWidth="5"
                    strokeDasharray="19.32 210.69" strokeLinecap="round"
                    transform={`rotate(${-90 + 79 * 3.6} 18 18)`} />
                  {/* Out of Service 8% */}
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#ef4444" strokeWidth="5"
                    strokeDasharray="11.89 218.12" strokeLinecap="round"
                    transform={`rotate(${-90 + 92 * 3.6} 18 18)`} />
                  <text x="18" y="17" textAnchor="middle" style={{ fontSize: 6, fontWeight: 700, fill: "white" }}>142</text>
                  <text x="18" y="22" textAnchor="middle" style={{ fontSize: 3.5, fill: "oklch(1 0 0 / 0.45)" }}>Total</text>
                </svg>
                <div className="flex flex-col gap-[2px]">
                  {[
                    { color: "#3b82f6", label: "On Trip", v: "78 (55%)" },
                    { color: "#22c55e", label: "Available", v: "34 (24%)" },
                    { color: "#f59e0b", label: "In Maintenance", v: "18 (13%)" },
                    { color: "#ef4444", label: "Out of Service", v: "12 (8%)" },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-[2px]">
                      <div className="h-[3px] w-[3px] rounded-full" style={{ background: l.color }} />
                      <span style={{ fontSize: 3.5, color: "oklch(1 0 0 / 0.55)" }}>
                        {l.label}
                      </span>
                      <span style={{ fontSize: 3.5, color: "oklch(1 0 0 / 0.35)", marginLeft: "auto" }}>
                        {l.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Performance */}
            <div
              className="rounded-[4px] p-[5px]"
              style={{ background: "oklch(0.2 0.03 258)", border: "1px solid oklch(1 0 0 / 0.07)" }}
            >
              <div className="flex items-start justify-between">
                <div style={{ fontSize: 5, fontWeight: 600, color: "white" }}>Delivery Performance</div>
                <span style={{ fontSize: 3.5, color: "oklch(1 0 0 / 0.35)" }}>This Month</span>
              </div>
              <div className="mt-[2px] flex items-baseline gap-[3px]">
                <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>92.6%</span>
                <span style={{ fontSize: 4.5, color: "#34d399" }}>↑ 8.4%</span>
              </div>
              {/* Sparkline */}
              <svg width="100%" height="30" viewBox="0 0 160 30" preserveAspectRatio="none" style={{ marginTop: 3 }}>
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,22 C20,20 40,18 60,14 C80,10 100,12 120,8 C140,4 155,6 160,5" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                <path d="M0,22 C20,20 40,18 60,14 C80,10 100,12 120,8 C140,4 155,6 160,5 L160,30 L0,30 Z" fill="url(#sparkGrad)" />
                {/* x-axis labels */}
                {["01", "07", "14", "21", "28"].map((d, i) => (
                  <text key={d} x={i * 39} y="29" style={{ fontSize: 3.5, fill: "oklch(1 0 0 / 0.3)" }}>{d}</text>
                ))}
              </svg>
            </div>
          </div>

          {/* Bottom row: Alerts + Top Priority */}
          <div className="grid grid-cols-2 gap-[4px]">
            {/* Alerts */}
            <div
              className="rounded-[4px] p-[5px]"
              style={{ background: "oklch(0.2 0.03 258)", border: "1px solid oklch(1 0 0 / 0.07)" }}
            >
              <div className="mb-[3px] flex items-center justify-between">
                <span style={{ fontSize: 5, fontWeight: 600, color: "white" }}>Alerts</span>
                <span style={{ fontSize: 4, color: "#60a5fa" }}>View all</span>
              </div>
              {[
                { label: "Maintenance overdue", time: "10m ago", color: "#ef4444" },
                { label: "High fuel consumption", time: "25m ago", color: "#f59e0b" },
                { label: "Driver license expiring", time: "1h ago", color: "#f59e0b" },
              ].map((a) => (
                <div
                  key={a.label}
                  className="flex items-center justify-between rounded-[3px] px-[3px] py-[2.5px]"
                  style={{ borderLeft: `2px solid ${a.color}`, marginBottom: 2, paddingLeft: 4, background: "oklch(1 0 0 / 0.02)" }}
                >
                  <div className="flex items-center gap-[2px]">
                    <AlertTriangle style={{ width: 4, height: 4, color: a.color }} />
                    <span style={{ fontSize: 4, color: "oklch(1 0 0 / 0.75)" }}>{a.label}</span>
                  </div>
                  <span style={{ fontSize: 3.5, color: "oklch(1 0 0 / 0.35)" }}>{a.time}</span>
                </div>
              ))}
            </div>

            {/* Top Priority */}
            <div
              className="rounded-[4px] p-[5px]"
              style={{ background: "oklch(0.2 0.03 258)", border: "1px solid oklch(1 0 0 / 0.07)" }}
            >
              <div className="mb-[3px] flex items-center justify-between">
                <span style={{ fontSize: 5, fontWeight: 600, color: "white" }}>Top Priority</span>
                <span style={{ fontSize: 4, color: "#60a5fa" }}>View all</span>
              </div>
              {[
                { label: "TRK-102 Maintenance overdue", badge: "High", badgeColor: "#ef4444" },
                { label: "Insurance expiring", badge: "Medium", badgeColor: "#f59e0b" },
                { label: "Incident needs review", badge: "Medium", badgeColor: "#f59e0b" },
              ].map((p) => (
                <div
                  key={p.label}
                  className="flex items-center justify-between rounded-[3px] px-[3px] py-[2.5px]"
                  style={{ marginBottom: 2, background: "oklch(1 0 0 / 0.02)" }}
                >
                  <div className="flex items-center gap-[2px]">
                    <div className="h-[4px] w-[4px] rounded-sm" style={{ background: "oklch(1 0 0 / 0.1)" }} />
                    <span style={{ fontSize: 4, color: "oklch(1 0 0 / 0.7)" }}>{p.label}</span>
                  </div>
                  <span
                    className="rounded-[2px] px-[3px] py-[1px]"
                    style={{ fontSize: 3.5, color: p.badgeColor, background: `${p.badgeColor}22` }}
                  >
                    {p.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
