import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fleetManagers as seedFleetManagers, type FleetManager } from "./mock-data";

const STORAGE_KEY = "primelex.fleetManagerAssignments";

interface AssignmentsState {
  managers: FleetManager[];
  assignTrucks: (managerId: string, truckIds: string[]) => void;
  getManagerForTruck: (truckId: string) => FleetManager | undefined;
  getManager: (id: string) => FleetManager | undefined;
}

const Ctx = createContext<AssignmentsState | null>(null);

function readOverrides(): Record<string, string[]> | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}

export function FleetManagersProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, string[]> | null>(null);

  useEffect(() => { setOverrides(readOverrides()); }, []);

  const managers = useMemo<FleetManager[]>(() => {
    if (!overrides) return seedFleetManagers;
    return seedFleetManagers.map((m) => overrides[m.id] ? { ...m, assignedTruckIds: overrides[m.id] } : m);
  }, [overrides]);

  const assignTrucks = useCallback((managerId: string, truckIds: string[]) => {
    setOverrides((prev) => {
      // Strip these trucks from every other manager to enforce single assignment.
      const base: Record<string, string[]> = {};
      managers.forEach((m) => {
        base[m.id] = (prev?.[m.id] ?? m.assignedTruckIds).filter((id) => !truckIds.includes(id));
      });
      base[managerId] = truckIds;
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(base)); } catch { /* noop */ }
      return base;
    });
  }, [managers]);

  const getManagerForTruck = useCallback((truckId: string) => managers.find((m) => m.assignedTruckIds.includes(truckId)), [managers]);
  const getManager = useCallback((id: string) => managers.find((m) => m.id === id), [managers]);

  const value = useMemo(() => ({ managers, assignTrucks, getManagerForTruck, getManager }), [managers, assignTrucks, getManagerForTruck, getManager]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFleetManagers() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFleetManagers must be used inside FleetManagersProvider");
  return ctx;
}
