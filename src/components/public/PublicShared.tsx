import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Route as RouteIcon, User, Lock, Linkedin, Twitter, Facebook, Youtube } from "lucide-react";
import ctaTruck from "../../assets/cta-truck.png";

const NAV_LINKS = [
  { label: "Product", to: "/product" as const, dropdown: false },
  { label: "Company", to: "/company" as const, dropdown: false },
  { label: "Pricing", to: "/pricing" as const, dropdown: false },
];

const FOOTER_COLS = [
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
  return <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12">{children}</div>;
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 inline-flex w-fit items-center rounded-full border border-primary/50 bg-primary/[0.08] px-4 py-[7px] text-[12px] font-semibold uppercase tracking-[0.06em] text-primary">
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
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
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
      className="inline-flex items-center gap-[9px] rounded-[5px] bg-primary px-7 py-[15px] text-[15px] font-semibold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary/90"
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
      className="inline-flex items-center gap-[9px] rounded-[5px] border border-primary/65 bg-white/[0.02] px-7 py-[15px] text-[15px] font-semibold text-white transition-all hover:border-white/40 hover:bg-white/[0.05]"
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
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all hover:border-primary/30 hover:bg-white/[0.04]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/25 bg-primary/[0.12]">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-[15px] font-semibold text-white">{name}</h3>
      <p className="text-[13px] leading-relaxed text-white/50">{description}</p>
    </div>
  );
}

export function PublicHeader() {
  return (
    <header className="absolute top-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex h-[96px] max-w-[1400px] items-center px-9 lg:px-12">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="relative h-[50px] w-[50px] shrink-0">
            <div
              className="absolute inset-0 bg-primary"
              style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            />
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              <RouteIcon className="h-[20px] w-[20px] text-white" />
            </div>
          </div>
          <div className="leading-none">
            <div className="text-[21px] font-black tracking-[0.14em] text-foreground">MUVD LOGISTICS</div>
            <div className="mt-[3px] text-[10px] font-semibold tracking-[0.42em] text-muted-foreground">
              LOGISTICS PLATFORM
            </div>
          </div>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex">
          {NAV_LINKS.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className="inline-flex items-center gap-[5px] rounded-md px-[20px] py-2.5 text-[13px] font-medium text-white transition-colors hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/login"
          className="ml-auto hidden shrink-0 items-center gap-[7px] rounded-lg border border-primary/65 bg-transparent px-5 py-3 text-[13px] font-medium text-foreground transition-all hover:border-white/40 hover:bg-white/[0.04] lg:inline-flex"
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
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1280px] px-8 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-7">
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center bg-primary"
                style={{
                  clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
                }}
              >
                <RouteIcon className="h-4 w-4 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-[13px] font-bold tracking-wide text-white">MUVD LOGISTICS</div>
                <div className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/40">
                  LOGISTICS PLATFORM
                </div>
              </div>
            </Link>
            <p className="max-w-[200px] text-[12px] leading-relaxed text-white/45">
              Building intelligent logistics software solutions that help businesses operate smarter
              and achieve more.
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
              <div className="text-[12px] font-semibold text-white">{col.heading}</div>
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
              <li className="text-[12px] text-white/45">hello@muvdlogistics.com</li>
              <li className="text-[12px] text-white/45">+234 800 123 4567</li>
              <li className="text-[12px] text-white/45">Mon – Fri: 8:00 AM – 6:00 PM</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05] py-4 text-center text-[11px] text-white/30">
        © 2025 MUVD LOGISTICS. All rights reserved.
      </div>
    </footer>
  );
}

export function CTASection() {
  return (
    <section className="mx-6 my-12 lg:mx-auto lg:max-w-7xl">
      <div className="relative min-h-[154px] overflow-hidden rounded-[22px] border border-primary/35 bg-[oklch(0.105_0.034_260)] shadow-[0_34px_100px_-38px_oklch(0_0_0/0.88),0_0_80px_-34px_oklch(0.50_0.22_258/0.5)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,oklch(0.125_0.04_260)_0%,oklch(0.155_0.055_258)_48%,oklch(0.115_0.04_260)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_140%_at_58%_50%,oklch(0.50_0.22_258/0.18),transparent_68%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:repeating-linear-gradient(135deg,white_0_1px,transparent_1px_4px)]" />

        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] lg:block">
          <img
            src={ctaTruck}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-right"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 30%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.105_0.034_260)_0%,transparent_34%,oklch(0.08_0.03_260/0.18)_100%)]" />
        </div>

        <div className="relative z-10 grid min-h-[154px] items-center gap-8 px-8 py-8 md:grid-cols-[minmax(0,1fr)_auto] lg:w-[78%] lg:py-7">
          <div>
            <h2 className="max-w-[560px] text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-foreground md:text-[24px]">
              Ready to Modernize Your Logistics Operations?
            </h2>
            <p className="mt-4 max-w-[390px] text-[14px] leading-[1.55] text-muted-foreground">
              Create your organisation and start running your operations smarter, faster and more
              profitably.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:justify-self-end">
            <PrimaryButton to="/register">Create Organisation</PrimaryButton>
            <SecondaryButton to="/login">Administrator Sign In</SecondaryButton>
          </div>
        </div>

        <div className="relative z-10 mt-0 block lg:hidden">
          <img
            src={ctaTruck}
            alt="Logistics truck"
            className="h-52 w-full object-cover object-right opacity-80"
          />
        </div>
      </div>
    </section>
  );
}

export function PublicBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 70% at 8% 50%, oklch(0.50 0.22 258 / 0.18) 0%, transparent 68%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 50%, oklch(0.50 0.22 258 / 0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </>
  );
}

export function PublicPage({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden text-foreground"
      style={{ background: "oklch(0.105 0.034 260)" }}
    >
      <PublicBackground />
      <div className="relative z-10">
        <PublicHeader />
        {children}
        <PublicFooter />
      </div>
    </div>
  );
}
