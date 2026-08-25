import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { trips as seedTrips, type Trip, type PaymentStatus, type TripStatus } from "./mock-data";

interface AddTripInput {
  truck: string;
  driver: string;
  customer: string;
}

interface UpdateRouteInput {
  origin: string;
  destination: string;
  stops: string[];
}

interface TripsState {
  trips: Trip[];
  getTrip: (id: string) => Trip | undefined;
  addTrip: (input: AddTripInput) => Trip;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  updateTripStatus: (id: string, status: TripStatus) => void;
  updateTripRoute: (id: string, route: UpdateRouteInput) => void;
  updateTripDriver: (id: string, driver: string) => void;
  dispatchedTruckIds: string[];
  generateTripId: () => string;
}

const Ctx = createContext<TripsState | null>(null);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(seedTrips);

  const generateTripId = useCallback(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const prefix = `${yyyy}-${mm}-`;
    const sameMonth = trips.filter((t) => t.id.startsWith(prefix));
    let maxSeq = 0;
    for (const t of sameMonth) {
      const seqStr = t.id.slice(prefix.length);
      const seq = parseInt(seqStr, 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
    return `${prefix}${String(maxSeq + 1).padStart(4, "0")}`;
  }, [trips]);

  const addTrip = useCallback((input: AddTripInput): Trip => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const prefix = `${yyyy}-${mm}-`;
    setTrips((prev) => {
      const sameMonth = prev.filter((t) => t.id.startsWith(prefix));
      let maxSeq = 0;
      for (const t of sameMonth) {
        const seqStr = t.id.slice(prefix.length);
        const seq = parseInt(seqStr, 10);
        if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
      }
      const id = `${prefix}${String(maxSeq + 1).padStart(4, "0")}`;
      const newTrip: Trip = {
        id,
        customer: input.customer,
        origin: "",
        destination: "",
        driver: input.driver,
        truck: input.truck,
        status: "Dispatched",
        progress: 0,
        eta: "—",
        stops: 0,
        distance: 0,
        priority: "Medium",
        date: now.toISOString().split("T")[0],
        revenue: 0,
        paymentStatus: "Pending",
        routeStops: [],
      };
      return [newTrip, ...prev];
    });
    const id = `${prefix}${String(
      Math.max(0, ...trips.filter((t) => t.id.startsWith(prefix)).map((t) => parseInt(t.id.slice(prefix.length), 10) || 0)) + 1
    ).padStart(4, "0")}`;
    return {
      id,
      customer: input.customer,
      origin: "",
      destination: "",
      driver: input.driver,
      truck: input.truck,
      status: "Dispatched" as TripStatus,
      progress: 0,
      eta: "—",
      stops: 0,
      distance: 0,
      priority: "Medium" as const,
      date: now.toISOString().split("T")[0],
      revenue: 0,
      paymentStatus: "Pending" as PaymentStatus,
      routeStops: [],
    };
  }, [trips]);

  const updatePaymentStatus = useCallback((id: string, status: PaymentStatus) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, paymentStatus: status } : t)));
  }, []);

  const updateTripStatus = useCallback((id: string, status: TripStatus) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const updateTripRoute = useCallback((id: string, route: UpdateRouteInput) => {
    setTrips((prev) => prev.map((t) =>
      t.id === id
        ? { ...t, origin: route.origin, destination: route.destination, routeStops: route.stops, stops: route.stops.length }
        : t
    ));
  }, []);

  const updateTripDriver = useCallback((id: string, driver: string) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, driver } : t)));
  }, []);

  const dispatchedTruckIds = useMemo(() => {
    return trips
      .filter((t) => t.status === "Dispatched" || t.status === "In Transit" || t.status === "Delayed")
      .map((t) => t.truck);
  }, [trips]);

  const value = useMemo<TripsState>(
    () => ({ trips, getTrip: (id) => trips.find((t) => t.id === id), addTrip, updatePaymentStatus, updateTripStatus, updateTripRoute, updateTripDriver, dispatchedTruckIds, generateTripId }),
    [trips, addTrip, updatePaymentStatus, updateTripStatus, updateTripRoute, updateTripDriver, dispatchedTruckIds, generateTripId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTrips() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTrips must be used inside TripsProvider");
  return ctx;
}
