import { Link } from "@tanstack/react-router";
import { ChevronDown, User } from "lucide-react";

const NAV_LINKS = [
  { label: "Product", dropdown: true },
  { label: "Solutions", dropdown: true },
  { label: "Resources", dropdown: true },
  { label: "Company", dropdown: false },
  { label: "Pricing", dropdown: false },
];

export function PublicHeader() {
  return (
    <header className="absolute top-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex h-[92px] max-w-[1400px] items-center px-6 sm:px-10 lg:px-12">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img src="/muvd-logo.jpeg" alt="MUVD LOGISTICS" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
          <div className="leading-none">
            <div className="text-[21px] font-black tracking-[0.16em] text-white">MUVD LOGISTICS</div>
            <div className="mt-1 text-[10px] font-semibold tracking-[0.43em] text-white/70">
              LOGISTICS PLATFORM
            </div>
          </div>
        </Link>

        <nav className="ml-auto hidden items-center gap-8 lg:flex xl:gap-10">
          {NAV_LINKS.map((n) => (
            <button
              key={n.label}
              className="inline-flex items-center gap-1.5 rounded-md py-2 text-[13px] font-medium text-white transition-colors hover:text-primary"
            >
              {n.label}
              {n.dropdown && <ChevronDown className="h-3.5 w-3.5 opacity-80" />}
            </button>
          ))}
        </nav>

        <Link
          to="/login"
          className="ml-8 hidden shrink-0 items-center gap-2 rounded-md border border-primary/70 bg-white/[0.02] px-5 py-3 text-[13px] font-medium text-white shadow-[0_0_28px_oklch(0.55_0.22_258/0.14)] transition-all hover:bg-primary/10 lg:inline-flex"
        >
          <User className="h-4 w-4" />
          Sign In
        </Link>
      </div>
    </header>
  );
}
