import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { trips as seedTrips, type Trip, type PaymentStatus } from "./mock-data";

interface TripsState {
  trips: Trip[];
  getTrip: (id: string) => Trip | undefined;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
}

const Ctx = createContext<TripsState | null>(null);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(seedTrips);

  const getTrip = useCallback((id: string) => trips.find((t) => t.id === id), [trips]);

  const updatePaymentStatus = useCallback((id: string, status: PaymentStatus) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, paymentStatus: status } : t)));
  }, []);

  const value = useMemo<TripsState>(() => ({ trips, getTrip, updatePaymentStatus }), [trips, getTrip, updatePaymentStatus]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTrips() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTrips must be used inside TripsProvider");
  return ctx;
}
