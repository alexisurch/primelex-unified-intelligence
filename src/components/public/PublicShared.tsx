import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Route as RouteIcon,
  ChevronDown,
  User,
  Lock,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
} from "lucide-react";
import ctaTruck from "../../assets/cta-truck.png";

export const NAV_LINKS = [
  { label: "Product", to: "/product" as const, dropdown: false },
  { label: "Company", to: "/company" as const, dropdown: false },
  { label: "Pricing", to: "/pricing" as const, dropdown: false },
];

export const FOOTER_COLS = [
  {
    heading: "Solutions",
    links: [
      "Fleet Management",
      "Dispatch Management",
      "Fuel Management",
      "Operations Intelligence",
    ],
  },
  { heading: "Company", links: ["About Us", "Careers", "Partners", "Contact Us"] },
];

export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1280px] px-8">{children}</div>;
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 inline-flex w-fit items-center rounded-full border border-[#1a56db]/55 bg-[#1a56db]/[0.08] px-[14px] py-[6px] text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#60a5fa]">
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const isCenter = align === "center";
  return (
    <div className={isCenter ? "text-center" : "text-left"}>
      {eyebrow && (
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3b82f6]">
          {eyebrow}
        </div>
      )}
      <h2
        className={`text-[2rem] font-bold leading-tight tracking-tight text-white lg:text-[2.25rem] ${
          isCenter ? "" : ""
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 max-w-lg text-[14px] leading-relaxed text-white/50 ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function PrimaryButton({
  to,
  children,
}: {
  to: "/register" | "/login" | "/product" | "/company" | "/pricing";
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-[9px] rounded-lg bg-[#1a56db] px-8 py-[14px] text-[15px] font-semibold text-white shadow-xl shadow-[#1a56db]/25 transition-all hover:bg-[#1d4ed8]"
    >
      <User className="h-[16px] w-[16px]" />
      {children}
    </Link>
  );
}

export function SecondaryButton({
  to,
  children,
}: {
  to: "/register" | "/login" | "/product" | "/company" | "/pricing";
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-[9px] rounded-lg border border-white/25 bg-transparent px-8 py-[14px] text-[15px] font-semibold text-white transition-all hover:border-white/40 hover:bg-white/[0.05]"
    >
      <Lock className="h-[16px] w-[16px]" />
      {children}
    </Link>
  );
}

export function FeatureCard({
  icon: Icon,
  name,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all hover:border-[#3b82f6]/30 hover:bg-white/[0.04]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#1a56db]/25 bg-[#1a56db]/[0.12]">
        <Icon className="h-5 w-5 text-[#3b82f6]" />
      </div>
      <h3 className="text-[15px] font-semibold text-white">{name}</h3>
      <p className="text-[13px] leading-relaxed text-white/50">{description}</p>
    </div>
  );
}

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#060c1a]/95 backdrop-blur-md">
      <div
        className="mx-auto flex max-w-[1280px] items-center px-8"
        style={{ height: "84px" }}
      >
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="relative h-[46px] w-[46px] shrink-0">
            <div
              className="absolute inset-0 bg-[#1a56db]"
              style={{
                clipPath:
                  "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
                borderRadius: "4px",
              }}
            />
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              <RouteIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="leading-[1.15]">
            <div className="text-[18px] font-black tracking-[0.06em] text-white">
              PRIMELEX
            </div>
            <div className="text-[10px] font-medium tracking-[0.24em] text-white/45">
              TECHNOLOGIES
            </div>
          </div>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className="inline-flex items-center gap-[5px] rounded-md px-5 py-2.5 text-[15px] font-medium text-white/75 transition-colors hover:text-white"
            >
              {n.label}
              {n.dropdown && (
                <ChevronDown className="h-[13px] w-[13px] text-white/50" />
              )}
            </Link>
          ))}
        </nav>

        <Link
          to="/login"
          className="hidden shrink-0 items-center gap-2 rounded-lg border border-white/[0.22] bg-transparent px-6 py-3 text-[14.5px] font-semibold text-white transition-all hover:border-white/40 hover:bg-white/[0.05] lg:inline-flex"
        >
          <User className="h-[15px] w-[15px]" />
          Sign In
        </Link>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#07101f]">
      <div className="mx-auto max-w-[1280px] px-8 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-7">
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center bg-[#1a56db]"
                style={{
                  clipPath:
                    "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
                }}
              >
                <RouteIcon className="h-4 w-4 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-[13px] font-bold tracking-wide text-white">
                  PRIMELEX
                </div>
                <div className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/40">
                  TECHNOLOGIES
                </div>
              </div>
            </Link>
            <p className="max-w-[200px] text-[12px] leading-relaxed text-white/45">
              Building intelligent logistics software solutions that help
              businesses operate smarter and achieve more.
            </p>
            <div className="mt-1 flex items-center gap-3">
              {[Linkedin, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.1] text-white/40 transition-colors hover:border-white/25 hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <div className="text-[12px] font-semibold text-white">
                {col.heading}
              </div>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[12px] text-white/45 transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <div className="text-[12px] font-semibold text-white">Support</div>
            <ul className="flex flex-col gap-2.5">
              <li className="text-[12px] text-white/45">hello@primelextech.com</li>
              <li className="text-[12px] text-white/45">+234 800 123 4567</li>
              <li className="text-[12px] text-white/45">
                Mon – Fri: 8:00 AM – 6:00 PM
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05] py-4 text-center text-[11px] text-white/30">
        © 2025 PrimeLex Technologies. All rights reserved.
      </div>
    </footer>
  );
}

export function CTASection() {
  return (
    <section className="px-8 py-14">
      <div className="mx-auto max-w-[1280px]">
        <div
          className="relative isolate flex items-center overflow-hidden rounded-[22px] border border-white/[0.08]"
          style={{
            background:
              "linear-gradient(105deg, #081326 0%, #0b1c3f 45%, #0d2350 72%, #081428 100%)",
            boxShadow:
              "0 24px 70px -24px rgba(0,0,0,0.7), 0 0 50px -14px rgba(26,86,219,0.22), inset 0 1px 0 0 rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 60% 120% at 78% 55%, rgba(29,96,232,0.30) 0%, transparent 62%), radial-gradient(ellipse 55% 100% at 8% 40%, rgba(26,86,219,0.14) 0%, transparent 65%)",
            }}
          />

          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-0 hidden w-[52%] select-none lg:block">
            <img
              src={ctaTruck}
              alt=""
              width={1024}
              height={640}
              loading="lazy"
              draggable={false}
              className="absolute bottom-0 right-[-3%] h-[116%] w-auto max-w-none object-contain"
              style={{
                filter: "brightness(0.6) saturate(0.7) contrast(1.05)",
                maskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 16%, rgba(0,0,0,0.9) 38%, #000 55%), linear-gradient(to top, transparent 0%, rgba(0,0,0,0.6) 10%, #000 26%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 16%, rgba(0,0,0,0.9) 38%, #000 55%), linear-gradient(to top, transparent 0%, rgba(0,0,0,0.6) 10%, #000 26%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
            />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-center px-8 py-10 sm:px-12 lg:w-[62%] lg:px-14 lg:py-11">
            <h2 className="text-[1.6rem] font-bold leading-[1.2] tracking-tight text-white sm:text-[1.75rem]">
              Ready to Modernize Your Logistics Operations?
            </h2>
            <p className="mt-3 max-w-[400px] text-[14px] leading-[1.65] text-white/55">
              Create your organisation and start running your operations
              smarter, faster and more profitably.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-[14px]">
              <PrimaryButton to="/register">Create Organisation</PrimaryButton>
              <SecondaryButton to="/login">
                Administrator Sign In
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PublicPage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#060c1a] text-foreground">
      <PublicHeader />
      {children}
      <PublicFooter />
    </div>
  );
}
