import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TruckProfile } from "@/components/profiles/TruckProfile";
import { DriverProfile } from "@/components/profiles/DriverProfile";
import { ClientProfile } from "@/components/profiles/ClientProfile";
import { FleetManagerProfile } from "@/components/profiles/FleetManagerProfile";
import { IncidentProfile } from "@/components/profiles/IncidentProfile";
import { TripProfile } from "@/components/profiles/TripProfile";
import { RouteProfile } from "@/components/profiles/RouteProfile";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ProfileTargetKind =
  | "truck"
  | "driver"
  | "client"
  | "fleet-manager"
  | "incident"
  | "trip"
  | "route";

export interface ProfileTarget {
  kind: ProfileTargetKind;
  id: string;
}

interface ProfileDrawerContextValue {
  open: (target: ProfileTarget) => void;
  close: () => void;
  current: ProfileTarget | null;
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

const ProfileDrawerContext = createContext<ProfileDrawerContextValue | null>(
  null,
);

export function useProfileDrawer(): ProfileDrawerContextValue {
  const ctx = useContext(ProfileDrawerContext);
  if (!ctx) {
    throw new Error(
      "useProfileDrawer must be used within a <ProfileDrawerProvider>.",
    );
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Drawer content (right-side slide-in panel)                          */
/* ------------------------------------------------------------------ */

const KIND_LABELS: Record<ProfileTargetKind, string> = {
  truck: "Truck",
  driver: "Driver",
  client: "Client",
  "fleet-manager": "Fleet Manager",
  incident: "Incident",
  trip: "Trip",
  route: "Route",
};

/**
 * Renders the appropriate profile component based on the target kind.
 * Each profile receives `onOpen` (to open nested profiles) and `onBack`
 * (to close the drawer).
 */
function ProfileBody({
  target,
  onOpen,
  onBack,
}: {
  target: ProfileTarget;
  onOpen: (t: ProfileTarget) => void;
  onBack?: () => void;
}) {
  switch (target.kind) {
    case "truck":
      return <TruckProfile id={target.id} onOpen={onOpen} onBack={onBack} />;
    case "driver":
      return <DriverProfile id={target.id} onOpen={onOpen} onBack={onBack} />;
    case "client":
      return <ClientProfile id={target.id} onOpen={onOpen} onBack={onBack} />;
    case "fleet-manager":
      return (
        <FleetManagerProfile id={target.id} onOpen={onOpen} onBack={onBack} />
      );
    case "incident":
      return <IncidentProfile id={target.id} onOpen={onOpen} onBack={onBack} />;
    case "trip":
      return <TripProfile id={target.id} onOpen={onOpen} onBack={onBack} />;
    case "route":
      return <RouteProfile id={target.id} onOpen={onOpen} onBack={onBack} />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export interface ProfileDrawerProviderProps {
  children: ReactNode;
}

export function ProfileDrawerProvider({
  children,
}: ProfileDrawerProviderProps) {
  const [current, setCurrent] = useState<ProfileTarget | null>(null);

  const open = useCallback((target: ProfileTarget) => {
    setCurrent(target);
  }, []);

  const close = useCallback(() => {
    setCurrent(null);
  }, []);

  const value = useMemo<ProfileDrawerContextValue>(
    () => ({ open, close, current }),
    [open, close, current],
  );

  return (
    <ProfileDrawerContext.Provider value={value}>
      {children}
      <Dialog
        open={current !== null}
        onOpenChange={(next) => {
          if (!next) close();
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogContent
            /**
             * Right-side slide-in drawer:
             * - anchored to the right edge, full viewport height
             * - max width 2xl, scrolls vertically when content overflows
             * - custom enter/exit animation sliding from the right
             *
             * The base DialogContent applies centered-modal transforms; we
             * override positioning here and rely on the slide utilities.
             */
            className={cn(
              "fixed right-0 top-0 z-50 h-screen w-full max-w-2xl translate-x-0 translate-y-0",
              "grid grid-rows-[auto_1fr] gap-0 border-l border-border bg-popover p-0 shadow-2xl",
              "rounded-none",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
              "duration-300",
            )}
            /**
             * Radix traps focus inside the dialog by default. The default
             * DialogContent renders a close button in the top-right; for a
             * right-side drawer we render our own header instead, so we
             * suppress the default close affordance by not relying on it.
             */
          >
            {/* Visually-hidden accessible title/description (Drawer header
                is rendered visibly below). */}
            <DialogTitle className="sr-only">
              {current ? `${KIND_LABELS[current.kind]} profile` : "Profile"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Profile details panel
            </DialogDescription>

            {/* Visible header */}
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {current ? KIND_LABELS[current.kind] : ""}
                </p>
                <p className="text-base font-semibold text-foreground">
                  {current ? `${KIND_LABELS[current.kind]} #${current.id}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close panel"
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground",
                  "transition-colors hover:bg-white/[0.04] hover:text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto px-6 py-6">
              {current ? (
                <ProfileBody
                  target={current}
                  onOpen={open}
                  onBack={close}
                />
              ) : null}
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </ProfileDrawerContext.Provider>
  );
}

export default ProfileDrawerProvider;
