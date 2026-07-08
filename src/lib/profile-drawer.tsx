import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TruckProfile } from "@/components/profiles/TruckProfile";
import { DriverProfile } from "@/components/profiles/DriverProfile";
import { TripProfile } from "@/components/profiles/TripProfile";
import { ClientProfile } from "@/components/profiles/ClientProfile";
import { IncidentProfile } from "@/components/profiles/IncidentProfile";
import { FleetManagerProfile } from "@/components/profiles/FleetManagerProfile";
import { RouteProfile } from "@/components/profiles/RouteProfile";

export type ProfileKind = "truck" | "driver" | "trip" | "client" | "incident" | "fleet-manager" | "route";
export interface ProfileTarget { kind: ProfileKind; id: string }

interface ProfileDrawerState {
  open: (t: ProfileTarget) => void;
  close: () => void;
  current: ProfileTarget | null;
}

const Ctx = createContext<ProfileDrawerState | null>(null);

export function ProfileDrawerProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<ProfileTarget[]>([]);
  const current = stack[stack.length - 1] ?? null;

  const open = useCallback((t: ProfileTarget) => {
    setStack((s) => [...s, t]);
  }, []);
  const close = useCallback(() => setStack([]), []);
  const back = useCallback(() => setStack((s) => s.slice(0, -1)), []);

  const value = useMemo<ProfileDrawerState>(() => ({ open, close, current }), [open, close, current]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <Sheet open={!!current} onOpenChange={(o) => { if (!o) close(); }}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-3xl overflow-y-auto scrollbar-thin border-l border-border bg-background/95 backdrop-blur p-0"
        >
          {current?.kind === "truck" && <TruckProfile id={current.id} onOpen={open} onBack={stack.length > 1 ? back : undefined} />}
          {current?.kind === "driver" && <DriverProfile id={current.id} onOpen={open} onBack={stack.length > 1 ? back : undefined} />}
          {current?.kind === "trip" && <TripProfile id={current.id} onOpen={open} onBack={stack.length > 1 ? back : undefined} />}
          {current?.kind === "client" && <ClientProfile id={current.id} onOpen={open} onBack={stack.length > 1 ? back : undefined} />}
          {current?.kind === "incident" && <IncidentProfile id={current.id} onOpen={open} onBack={stack.length > 1 ? back : undefined} />}
        </SheetContent>
      </Sheet>
    </Ctx.Provider>
  );
}

export function useProfileDrawer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProfileDrawer must be used inside ProfileDrawerProvider");
  return ctx;
}

/** Convenience button-like wrapper that opens a profile on click. */
export function ProfileLink({
  kind, id, className, children,
}: { kind: ProfileKind; id: string; className?: string; children: ReactNode }) {
  const { open } = useProfileDrawer();
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); open({ kind, id }); }}
      className={className ?? "text-primary hover:underline text-left"}
    >
      {children}
    </button>
  );
}
