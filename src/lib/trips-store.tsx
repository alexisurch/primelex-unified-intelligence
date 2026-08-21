import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  trips as seedTrips,
  trucks as seedTrucks,
  type Trip,
  type TripStatus,
  type PaymentStatus,
  type Priority,
} from "./mock-data";

export interface RouteUpdate {
  id: string;
  date: string;
  previousRoute: string | null;
  newRoute: string;
}

export interface TripWithRoute extends Trip {
  routeStops?: string[];
  routeUpdates?: RouteUpdate[];
}

interface TripsState {
  trips: TripWithRoute[];
  trucks: typeof seedTrucks;
  dispatch: (input: { truckId: string; driverName: string; clientName: string }) => TripWithRoute;
  updateRoute: (tripId: string, stops: string[]) => void;
  updateStatus: (tripId: string, status: TripStatus) => void;
  isTruckAvailable: (truckId: string) => boolean;
  getTrip: (tripId: string) => TripWithRoute | undefined;
}

const Ctx = createContext<TripsState | null>(null);

let tripCounter = 0;
function generateTripId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  tripCounter += 1;
  return `${year}-${month}-${String(tripCounter).padStart(4, "0")}`;
}

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<TripWithRoute[]>(() => seedTrips.map((t) => ({ ...t })));
  const [truckOverrides, setTruckOverrides] = useState<Map<string, string>>(new Map());

  const dispatch = useCallback((input: { truckId: string; driverName: string; clientName: string }): TripWithRoute => {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const id = generateTripId();
    const distance = 0;
    const newTrip: TripWithRoute = {
      id,
      customer: input.clientName,
      origin: "",
      destination: "",
      driver: input.driverName,
      truck: input.truckId,
      status: "Dispatched" as TripStatus,
      progress: 0,
      eta: "—",
      stops: 0,
      distance,
      priority: "Medium" as Priority,
      date,
      revenue: distance * 4500,
      paymentStatus: "Pending" as PaymentStatus,
      routeStops: undefined,
      routeUpdates: [],
    };
    setTrips((prev) => [newTrip, ...prev]);
    setTruckOverrides((prev) => new Map(prev).set(input.truckId, "Dispatched"));
    return newTrip;
  }, []);

  const updateRoute = useCallback((tripId: string, stops: string[]) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const cleanStops = stops.filter((s) => s.trim());
        const previousRoute = t.routeStops && t.routeStops.length > 0 ? t.routeStops.join(" → ") : null;
        const newRoute = cleanStops.join(" → ");
        const distance = cleanStops.length >= 2 ? Math.max(50, cleanStops.length * 180) : t.distance;
        const update: RouteUpdate = {
          id: `RU-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          previousRoute,
          newRoute,
        };
        return {
          ...t,
          routeStops: cleanStops,
          origin: cleanStops[0] ?? "",
          destination: cleanStops[cleanStops.length - 1] ?? "",
          stops: Math.max(0, cleanStops.length - 2),
          distance,
          revenue: distance * 4500,
          routeUpdates: [...(t.routeUpdates ?? []), update],
        };
      }),
    );
  }, []);

  const updateStatus = useCallback((tripId: string, status: TripStatus) => {
    setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, status } : t)));
  }, []);

  const isTruckAvailable = useCallback(
    (truckId: string) => {
      const override = truckOverrides.get(truckId);
      if (override) return false;
      const truck = seedTrucks.find((t) => t.id === truckId);
      if (!truck) return false;
      return truck.status !== "Maintenance" && truck.status !== "Offline";
    },
    [truckOverrides],
  );

  const getTrip = useCallback((tripId: string) => trips.find((t) => t.id === tripId), [trips]);

  const value = useMemo<TripsState>(
    () => ({ trips, trucks: seedTrucks, dispatch, updateRoute, updateStatus, isTruckAvailable, getTrip }),
    [trips, dispatch, updateRoute, updateStatus, isTruckAvailable, getTrip],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTrips() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTrips must be used inside TripsProvider");
  return ctx;
}

export function formatRouteDisplay(stops?: string[], fallback?: string): string {
  if (stops && stops.length > 0) {
    if (stops.length <= 4) return stops.join(" → ");
    return `${stops[0]} → ${stops[1]} → +${stops.length - 3} stops → ${stops[stops.length - 1]}`;
  }
  return fallback ?? "Route Pending";
}

export function isRoutePending(t: TripWithRoute): boolean {
  return !t.routeStops || t.routeStops.length === 0;
}
