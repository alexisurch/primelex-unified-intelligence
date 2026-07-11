import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type FleetManagerStatus = "active" | "off-duty" | "on-leave";

export interface FleetManager {
  id: string;
  name: string;
  email: string;
  department: string;
  status: FleetManagerStatus;
  phone: string;
  assignedTrucks: string[];
}

export type NewFleetManager = Omit<FleetManager, "id" | "assignedTrucks"> &
  Partial<Pick<FleetManager, "assignedTrucks">>;

export type FleetManagerUpdate = Partial<Omit<FleetManager, "id">>;

interface FleetManagersContextValue {
  managers: FleetManager[];
  addManager: (manager: NewFleetManager) => FleetManager;
  updateManager: (id: string, patch: FleetManagerUpdate) => void;
  removeManager: (id: string) => void;
  getManagerForTruck: (truckId: string) => FleetManager | undefined;
  assignTruckToManager: (truckId: string, managerId: string) => void;
}

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

const DEFAULT_MANAGERS: FleetManager[] = [
  {
    id: "fm-001",
    name: "Alex Morgan",
    email: "alex.morgan@primelex.com",
    department: "Northern Region",
    status: "active",
    phone: "+1 (555) 018-2201",
    assignedTrucks: ["TRK-101", "TRK-104"],
  },
  {
    id: "fm-002",
    name: "Priya Shah",
    email: "priya.shah@primelex.com",
    department: "Southern Region",
    status: "active",
    phone: "+1 (555) 018-2202",
    assignedTrucks: ["TRK-108", "TRK-112"],
  },
  {
    id: "fm-003",
    name: "Diego Reyes",
    email: "diego.reyes@primelex.com",
    department: "Central Region",
    status: "off-duty",
    phone: "+1 (555) 018-2203",
    assignedTrucks: [],
  },
];

/* ------------------------------------------------------------------ */
/* ID generation (no external dependency required)                    */
/* ------------------------------------------------------------------ */

function generateManagerId(): string {
  const n = Math.floor(Math.random() * 1_000_000);
  return `fm-${n.toString().padStart(3, "0")}`;
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

const FleetManagersContext = createContext<FleetManagersContextValue | null>(
  null,
);

export function useFleetManagers(): FleetManagersContextValue {
  const ctx = useContext(FleetManagersContext);
  if (!ctx) {
    throw new Error(
      "useFleetManagers must be used within a <FleetManagersProvider>.",
    );
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export interface FleetManagersProviderProps {
  children: ReactNode;
  /** Optional override for the initial manager list (useful for tests). */
  initialManagers?: FleetManager[];
}

export function FleetManagersProvider({
  children,
  initialManagers,
}: FleetManagersProviderProps) {
  const [managers, setManagers] = useState<FleetManager[]>(
    () => initialManagers ?? DEFAULT_MANAGERS,
  );

  const addManager = useCallback((manager: NewFleetManager) => {
    const created: FleetManager = {
      id: generateManagerId(),
      name: manager.name,
      email: manager.email,
      department: manager.department,
      status: manager.status,
      phone: manager.phone,
      assignedTrucks: manager.assignedTrucks ?? [],
    };
    setManagers((prev) => [...prev, created]);
    return created;
  }, []);

  const updateManager = useCallback(
    (id: string, patch: FleetManagerUpdate) => {
      setManagers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      );
    },
    [],
  );

  const removeManager = useCallback((id: string) => {
    setManagers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const getManagerForTruck = useCallback(
    (truckId: string) =>
      managers.find((m) => m.assignedTrucks.includes(truckId)),
    [managers],
  );

  const assignTruckToManager = useCallback(
    (truckId: string, managerId: string) => {
      setManagers((prev) =>
        prev.map((m) => {
          // Remove the truck from any other manager first.
          const withoutTruck = m.assignedTrucks.filter((t) => t !== truckId);
          // Add it to the target manager (if not already present).
          if (m.id === managerId) {
            return {
              ...m,
              assignedTrucks: withoutTruck.includes(truckId)
                ? withoutTruck
                : [...withoutTruck, truckId],
            };
          }
          return { ...m, assignedTrucks: withoutTruck };
        }),
      );
    },
    [],
  );

  const value = useMemo<FleetManagersContextValue>(
    () => ({
      managers,
      addManager,
      updateManager,
      removeManager,
      getManagerForTruck,
      assignTruckToManager,
    }),
    [
      managers,
      addManager,
      updateManager,
      removeManager,
      getManagerForTruck,
      assignTruckToManager,
    ],
  );

  return (
    <FleetManagersContext.Provider value={value}>
      {children}
    </FleetManagersContext.Provider>
  );
}

export default FleetManagersProvider;
