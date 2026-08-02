/**
 * DashboardShowcase — a STATIC marketing image frame for the LIS product
 * screenshot. Never mounts any live dashboard component.
 */
import dashboardImg from "../../../fleet-app/src/assets/DEPARTMENTS_(3) copy.png";

export function DashboardShowcase() {
  return (
    <div className="relative flex items-start justify-end lg:h-[700px]">
      {/* Blue glow behind the frame */}
      <div
        className="pointer-events-none absolute right-[-60px] top-[8%] h-[90%] w-[100%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 58% 48%, oklch(0.50 0.22 258 / 0.38) 0%, transparent 70%)",
          filter: "blur(56px)",
        }}
      />

      {/* Premium product frame */}
      <div
        className="relative mt-[-30px] w-[105%] overflow-hidden rounded-[28px] border-2 border-blue-500/40 bg-[oklch(0.13_0.025_258)]"
        style={{
          boxShadow:
            "0 0 0 1px oklch(1 0 0 / 0.05), 0 70px 140px -28px oklch(0 0 0 / 0.85), 0 24px 60px -14px oklch(0 0 0 / 0.6), 0 0 100px -20px oklch(0.50 0.22 258 / 0.55)",
          transform: "perspective(1600px) rotateY(-3deg) rotateX(0.8deg) rotate(2deg)",
          transformOrigin: "right center",
        }}
      >
        <img
          src={dashboardImg}
          alt="PrimeLex Logistics Intelligence System dashboard"
          className="block w-full select-none"
          draggable={false}
          loading="eager"
        />
      </div>
    </div>
  );
}
