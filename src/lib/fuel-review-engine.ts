// Intelligent Fuel Review Engine — priority hierarchy for variance detection.
import { tripFuelHistory, trucks, trips, type TripFuelSnapshot } from "./mock-data";

export type BaselineSource = "truck+route" | "truck" | "class" | "learning";
export type FuelStatus = "Normal" | "Review Fuel Usage" | "Critical Fuel Review" | "Learning Baseline";

export interface FuelReviewConfig {
  minHistoryTrips: number; // required historical trips before enabling variance analysis
  normalPct: number;       // ±within → Normal
  reviewPct: number;       // between normal and review → Review
}

export const defaultFuelReviewConfig: FuelReviewConfig = {
  minHistoryTrips: 3,
  normalPct: 3,
  reviewPct: 7,
};

export interface FuelReviewResult {
  baselineLitersPerKm: number | null;
  source: BaselineSource;
  variancePct: number | null;
  status: FuelStatus;
  message: string;
}

function truckClassOf(truckId: string): string {
  const t = trucks.find((x) => x.id === truckId);
  return t?.model.split(" ")[0] ?? "Generic";
}

function averageLpk(rows: TripFuelSnapshot[]) {
  if (!rows.length) return null;
  return rows.reduce((s, r) => s + r.litersPerKm, 0) / rows.length;
}

export function reviewFuel(
  input: { truckId: string; routeId?: string; litersPerKm: number },
  history: TripFuelSnapshot[] = tripFuelHistory,
  config: FuelReviewConfig = defaultFuelReviewConfig,
): FuelReviewResult {
  const { truckId, routeId, litersPerKm } = input;

  // Priority 1: Truck + Route
  const truckRoute = history.filter((h) => routeId && h.routeId === routeId && tripsBelongToTruck(h.tripId, truckId));
  if (truckRoute.length >= config.minHistoryTrips) {
    const base = averageLpk(truckRoute)!;
    return classify(base, "truck+route", litersPerKm, config);
  }

  // Priority 2: Truck overall
  const truckOnly = history.filter((h) => tripsBelongToTruck(h.tripId, truckId));
  if (truckOnly.length >= config.minHistoryTrips) {
    const base = averageLpk(truckOnly)!;
    return classify(base, "truck", litersPerKm, config);
  }

  // Priority 3: Class average
  const klass = truckClassOf(truckId);
  const classRows = history.filter((h) => {
    const trip = trips.find((t) => t.id === h.tripId);
    if (!trip) return false;
    return truckClassOf(trip.truck) === klass;
  });
  if (classRows.length >= config.minHistoryTrips) {
    const base = averageLpk(classRows)!;
    return classify(base, "class", litersPerKm, config);
  }

  // Priority 4: Learning
  return {
    baselineLitersPerKm: null,
    source: "learning",
    variancePct: null,
    status: "Learning Baseline",
    message: "Not enough history yet — recording data to build a baseline.",
  };
}

function tripsBelongToTruck(tripId: string, truckId: string) {
  const trip = trips.find((t) => t.id === tripId);
  return trip?.truck === truckId;
}

function classify(base: number, source: BaselineSource, actual: number, cfg: FuelReviewConfig): FuelReviewResult {
  const variance = ((actual - base) / base) * 100;
  const abs = Math.abs(variance);
  let status: FuelStatus = "Normal";
  if (abs > cfg.reviewPct) status = "Critical Fuel Review";
  else if (abs > cfg.normalPct) status = "Review Fuel Usage";
  return {
    baselineLitersPerKm: Math.round(base * 1000) / 1000,
    source,
    variancePct: Math.round(variance * 10) / 10,
    status,
    message: `Baseline ${source} · ${base.toFixed(2)} L/km · variance ${variance.toFixed(1)}%`,
  };
}
