import { Link } from "@tanstack/react-router";
import { ChevronDown, Route as RouteIcon, User } from "lucide-react";

const NAV_LINKS = [
  { label: "Product", dropdown: true },
  { label: "Solutions", dropdown: true },
  { label: "Resources", dropdown: true },
  { label: "Company", dropdown: false },
  { label: "Pricing", dropdown: false },
];


export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[oklch(0.16_0.028_260)] backdrop-blur-md">
      <div className="mx-auto flex h-[84px] max-w-[1400px] items-center px-10">
        {/* Logo — left */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="relative h-[42px] w-[42px] shrink-0">
            <div
              className="absolute inset-0 bg-primary"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              <RouteIcon className="h-[18px] w-[18px] text-white" />
            </div>
          </div>
          <div className="leading-none">
            <div className="text-[17px] font-black tracking-[0.06em] text-white">PRIMELEX</div>
            <div className="mt-[3px] text-[8.5px] font-semibold tracking-[0.26em] text-white/50">
              TECHNOLOGIES
            </div>
          </div>
        </Link>

        {/* Nav — perfectly centred */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex">
          {NAV_LINKS.map((n) => (
            <button
              key={n.label}
              className="inline-flex items-center gap-[5px] rounded-md px-[20px] py-2.5 text-[14.5px] font-medium text-white/70 transition-colors hover:text-white"
            >
              {n.label}
              {n.dropdown && (
                <ChevronDown className="h-[13px] w-[13px] opacity-60" />
              )}
            </button>
          ))}
        </nav>

        {/* Sign In — right */}
        <Link
          to="/login"
          className="ml-auto hidden shrink-0 items-center gap-[7px] rounded-lg border border-white/25 bg-transparent px-5 py-2.5 text-[14px] font-medium text-white transition-all hover:border-white/40 hover:bg-white/[0.05] lg:inline-flex"
        >
          <User className="h-[15px] w-[15px]" />
          Sign In
        </Link>
      </div>
    </header>
  );
}
