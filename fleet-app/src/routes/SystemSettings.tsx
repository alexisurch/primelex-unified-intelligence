import { useState, type ComponentType, type ReactNode } from "react";
import {
  Bell,
  MapPin,
  Palette,
  Sun,
  Moon,
  Monitor,
  Navigation,
  Hand,
  Check,
  type LucideProps,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { GlassCard, SectionCard } from "@/components/shared/Cards";
import { Switch } from "@/components/ui/switch";
import { usePreferences } from "@/lib/preferences";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type SectionId = "notifications" | "tracking" | "appearance";

interface SectionDef {
  id: SectionId;
  label: string;
  icon: ComponentType<LucideProps>;
  description: string;
}

interface NotificationToggle {
  id: string;
  label: string;
  description: string;
  defaultOn: boolean;
}

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const SECTIONS: SectionDef[] = [
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Choose what alerts you receive across the platform.",
  },
  {
    id: "tracking",
    label: "Fleet Tracking",
    icon: MapPin,
    description: "Choose how truck locations are reported.",
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    description: "Customize the look and feel of your workspace.",
  },
];

const NOTIFICATION_TOGGLES: NotificationToggle[] = [
  {
    id: "ntf-incidents",
    label: "Incident alerts",
    description: "Critical and high-severity incidents as they occur.",
    defaultOn: true,
  },
  {
    id: "ntf-maintenance",
    label: "Maintenance reminders",
    description: "Scheduled and overdue service notifications.",
    defaultOn: true,
  },
  {
    id: "ntf-documents",
    label: "Document expiry",
    description: "Licenses, insurance and permits nearing expiry.",
    defaultOn: true,
  },
  {
    id: "ntf-trips",
    label: "Trip status changes",
    description: "Departures, arrivals and delayed trips.",
    defaultOn: false,
  },
  {
    id: "ntf-fuel",
    label: "Fuel theft alerts",
    description: "Anomalous fuel drops detected by GPS trackers.",
    defaultOn: true,
  },
  {
    id: "ntf-weekly",
    label: "Weekly summary email",
    description: "A digest of fleet KPIs every Monday morning.",
    defaultOn: false,
  },
];

const THEME_OPTIONS: {
  value: "dark" | "light" | "system";
  label: string;
  icon: ComponentType<LucideProps>;
  description: string;
}[] = [
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
    description: "Use the dark theme everywhere.",
  },
  {
    value: "light",
    label: "Light",
    icon: Sun,
    description: "Use the light theme everywhere.",
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
    description: "Match your operating system preference.",
  },
];

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="truncate text-xs text-muted-foreground">
          {description}
        </span>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function SectionShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <SectionCard title={title}>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      {children}
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function SystemSettings() {
  const { trackingMode, setTrackingMode, theme, setTheme, resolvedTheme } =
    usePreferences();

  const [active, setActive] = useState<SectionId>("notifications");
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      NOTIFICATION_TOGGLES.map((t) => [t.id, t.defaultOn]),
    ),
  );

  function setToggle(id: string, next: boolean) {
    setToggles((prev) => ({ ...prev, [id]: next }));
  }

  const activeSection = SECTIONS.find((s) => s.id === active)!;

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="System Settings"
        subtitle="Manage notifications, fleet tracking and appearance."
        showExport={false}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* ---------------------------------------------------------- */}
        {/* Left sidebar — section navigation                          */}
        {/* ---------------------------------------------------------- */}
        <nav className="flex flex-col gap-1.5">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === active;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActive(section.id)}
                className={[
                  "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  isActive
                    ? "border-primary/50 bg-primary/10 text-foreground"
                    : "border-border/40 bg-white/[0.02] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">
                    {section.label}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {section.description}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* ---------------------------------------------------------- */}
        {/* Right — active section                                      */}
        {/* ---------------------------------------------------------- */}
        <div className="flex flex-col gap-6">
          {active === "notifications" && (
            <SectionShell
              title="Notifications"
              description="Choose which alerts you receive across the platform."
            >
              <div className="divide-y divide-border/40 rounded-lg border border-border/40 bg-white/[0.02] px-4">
                {NOTIFICATION_TOGGLES.map((toggle) => (
                  <ToggleRow
                    key={toggle.id}
                    label={toggle.label}
                    description={toggle.description}
                    checked={toggles[toggle.id] ?? toggle.defaultOn}
                    onChange={(next) => {
                      setToggle(toggle.id, next);
                      toast.success(
                        `${toggle.label} ${next ? "enabled" : "disabled"}`,
                      );
                    }}
                  />
                ))}
              </div>
            </SectionShell>
          )}

          {active === "tracking" && (
            <SectionShell
              title="Fleet Tracking"
              description="Choose how truck locations are reported and displayed."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Manual */}
                <button
                  type="button"
                  onClick={() => {
                    setTrackingMode("manual");
                    toast.success("Fleet tracking set to Manual");
                  }}
                  className={[
                    "flex flex-col gap-3 rounded-xl border p-5 text-left transition-colors",
                    trackingMode === "manual"
                      ? "border-primary/60 bg-primary/10"
                      : "border-border/40 bg-white/[0.02] hover:bg-white/[0.04]",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/15 text-warning">
                      <Hand className="h-5 w-5" strokeWidth={2} />
                    </span>
                    {trackingMode === "manual" ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </span>
                    ) : null}
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    Manual Tracking
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Drivers self-report their location at each checkpoint. No
                    GPS distances shown.
                  </span>
                </button>

                {/* Automated */}
                <button
                  type="button"
                  onClick={() => {
                    setTrackingMode("automated");
                    toast.success("Fleet tracking set to Automated");
                  }}
                  className={[
                    "flex flex-col gap-3 rounded-xl border p-5 text-left transition-colors",
                    trackingMode === "automated"
                      ? "border-primary/60 bg-primary/10"
                      : "border-border/40 bg-white/[0.02] hover:bg-white/[0.04]",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
                      <Navigation className="h-5 w-5" strokeWidth={2} />
                    </span>
                    {trackingMode === "automated" ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </span>
                    ) : null}
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    Automated Tracking
                  </span>
                  <span className="text-xs text-muted-foreground">
                    GPS devices report live positions. Distances and the live
                    map are shown in the Dispatch Center.
                  </span>
                </button>
              </div>
            </SectionShell>
          )}

          {active === "appearance" && (
            <SectionShell
              title="Appearance"
              description={`Currently using the ${resolvedTheme} theme. Choose a preference below.`}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {THEME_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setTheme(option.value);
                        toast.success(`Theme set to ${option.label}`);
                      }}
                      className={[
                        "flex flex-col gap-3 rounded-xl border p-5 text-left transition-colors",
                        isActive
                          ? "border-primary/60 bg-primary/10"
                          : "border-border/40 bg-white/[0.02] hover:bg-white/[0.04]",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </span>
                        {isActive ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </span>
                        ) : null}
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {option.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SectionShell>
          )}

          {/* Footer summary card */}
          <GlassCard hover={false} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              <activeSection.icon className="h-4 w-4" strokeWidth={2} />
            </span>
            <p className="text-xs text-muted-foreground">
              {activeSection.description} Changes are saved automatically to
              your browser.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;
