/**
 * DashboardShowcase — a STATIC marketing image frame for the LIS product
 * screenshot, styled like the premium product frames used by Stripe / Linear /
 * Vercel. It renders the supplied dashboard screenshot as a plain <img> and
 * never mounts any live dashboard component.
 *
 * The screenshot asset is imported from the project's assets so Vite bundles
 * it with a stable hashed URL.
 */
import dashboardImg from "../../../fleet-app/src/assets/ChatGPT_Image_Jul_23,_2026,_06_26_39_PM.6.png";

export function DashboardShowcase() {
  return (
    <div className="relative flex items-center justify-end lg:h-[620px]">
      {/* Soft blue glow behind the frame */}
      <div
        className="pointer-events-none absolute right-[-40px] top-1/2 h-[85%] w-[92%] -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 65% 60% at 60% 50%, oklch(0.50 0.22 258 / 0.28) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      {/* Premium product frame */}
      <div
        className="relative w-full overflow-hidden rounded-[24px] border border-blue-500/25 bg-[oklch(0.13_0.025_258)]"
        style={{
          boxShadow:
            "0 0 0 1px oklch(1 0 0 / 0.04), 0 60px 120px -24px oklch(0 0 0 / 0.8), 0 20px 50px -12px oklch(0 0 0 / 0.55), 0 0 80px -20px oklch(0.50 0.22 258 / 0.35)",
          transform: "perspective(1600px) rotateY(-4deg) rotateX(1.2deg)",
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
