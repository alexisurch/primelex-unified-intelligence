// Central mock data for the entire PrimeLex Logistics UIS.
// Every page pulls from here so the platform feels internally consistent.

export type TruckStatus = "On The Road" | "Idle" | "Maintenance" | "Offline";
export type Priority = "Critical" | "High" | "Medium" | "Low";
export type TripStatus = "In Transit" | "Delivered" | "Delayed" | "Scheduled" | "Cancelled";

export interface Truck {
  id: string;
  plate: string;
  model: string;
  driver: string;
  status: TruckStatus;
  fuel: number;
  odometer: number;
  location: string;
  route: string;
  engineHealth: number;
  gps: "Online" | "Offline";
  lastService: string;
  trackingNumber: string;
}

export interface Trip {
  id: string;
  customer: string;
  origin: string;
  destination: string;
  driver: string;
  truck: string;
  status: TripStatus;
  progress: number;
  eta: string;
  stops: number;
  distance: number;
  priority: Priority;
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  licenseExpiry: string;
  medicalExpiry: string;
  score: number;
  risk: "Low" | "Medium" | "High";
  status: "Active" | "On Leave" | "Suspended";
  violations: number;
  trainings: number;
  truck: string;
}

export type IncidentType = "Accident" | "Cargo Damage" | "Vehicle Breakdown" | "Theft" | "Driver Misconduct" | "Delivery Issue" | "Other";

export interface Incident {
  id: string;
  type: IncidentType;
  driver: string;
  truck: string;
  trip?: string;
  client?: string;
  severity: "Low" | "Moderate" | "High" | "Critical";
  status: "Open" | "Investigating" | "Resolved";
  date: string;
  location: string;
  rootCause: string;
  description: string;
  reportedBy: string;
  investigator: string;
  correctiveActions: string;
  estDelayMin: number;
  estFinancialImpact: number;
  photos: string[];
  documents: string[];
}

export interface DocumentRow {
  id: string;
  name: string;
  type: string;
  owner: string;
  expiry?: string;
  status: "Valid" | "Expiring" | "Expired";
  version: string;
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  industry: string;
  since: string;
  status: "Active" | "Prospect" | "Inactive";
}

export interface FleetManager {
  id: string;
  name: string;
  employeeId: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  photo?: string;
  status: "Active" | "On Leave" | "Suspended";
  dateJoined: string;
  assignedTruckIds: string[];
}

export interface RouteEntity {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  createdAt: string;
}

const cities = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Enugu", "Kaduna", "Benin", "Warri", "Jos"];
const customers = ["ABC Stores", "Dangote Cement", "Chi Ltd", "Konga", "Jumia", "MTN Nigeria", "Nestlé NG", "Shoprite", "SPAR", "Unilever"];
const driverNames = ["Adeleke O.", "Tunde A.", "Chinedu E.", "Aisha B.", "Ifeanyi N.", "Musa I.", "Kelechi O.", "Bola A.", "Ngozi U.", "Yakubu D.", "Femi J.", "Chidi M.", "Emeka R.", "Sade K.", "Halima Y."];
const models = ["MAN TGS 26.440", "Volvo FH16", "Scania R500", "Mercedes Actros", "DAF XF 480", "Iveco Stralis"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }

export const trucks: Truck[] = Array.from({ length: 32 }, (_, i) => {
  const statuses: TruckStatus[] = ["On The Road","On The Road","On The Road","On The Road","On The Road","Idle","Idle","Maintenance","Offline"];
  return {
    id: `TRK-${1000 + i}`,
    plate: `${pick(["KJA","GGE","LSD","ABJ","LND"], i)} ${100 + i * 7}${pick(["XY","RT","ZK"], i)}`,
    model: pick(models, i),
    driver: pick(driverNames, i),
    status: pick(statuses, i),
    fuel: 10 + ((i * 13) % 90),
    odometer: 42000 + i * 1873,
    location: `${pick(cities, i)} → ${pick(cities, i + 3)}`,
    route: `RT-${200 + i}`,
    engineHealth: 60 + ((i * 7) % 40),
    gps: i % 11 === 0 ? "Offline" : "Online",
    lastService: `2026-0${(i % 6) + 1}-1${i % 9}`,
    trackingNumber: `TRK-GPS-${20000 + i * 41}`,
  };
});

export const trips: Trip[] = Array.from({ length: 24 }, (_, i) => {
  const statuses: TripStatus[] = ["In Transit","In Transit","In Transit","Delivered","Delivered","Delayed","Scheduled"];
  const priorities: Priority[] = ["Critical","High","High","Medium","Medium","Low"];
  return {
    id: `TRP-${7300 + i}`,
    customer: pick(customers, i),
    origin: pick(cities, i),
    destination: pick(cities, i + 2),
    driver: pick(driverNames, i),
    truck: `TRK-${1000 + (i % 32)}`,
    status: pick(statuses, i),
    progress: (i * 17) % 100,
    eta: `${(i % 8) + 1}h ${(i * 11) % 60}m`,
    stops: (i % 4) + 1,
    distance: 120 + i * 37,
    priority: pick(priorities, i),
  };
});

export const drivers: Driver[] = Array.from({ length: 20 }, (_, i) => {
  const risks: Driver["risk"][] = ["Low","Low","Low","Medium","Medium","High"];
  const status: Driver["status"][] = ["Active","Active","Active","Active","On Leave","Suspended"];
  return {
    id: `DRV-${500 + i}`,
    name: pick(driverNames, i),
    license: `NG-${100000 + i * 137}`,
    licenseExpiry: `2026-${String((i % 12) + 1).padStart(2,"0")}-${String((i % 27) + 1).padStart(2,"0")}`,
    medicalExpiry: `2027-${String((i % 12) + 1).padStart(2,"0")}-1${i % 9}`,
    score: 60 + ((i * 11) % 40),
    risk: pick(risks, i),
    status: pick(status, i),
    violations: i % 5,
    trainings: 3 + (i % 6),
    truck: `TRK-${1000 + (i % 32)}`,
  };
});

export const clients: Client[] = customers.map((name, i) => ({
  id: `CLI-${300 + i}`,
  name,
  contact: pick(["A. Okafor","B. Musa","C. Adeyemi","D. Ibrahim","E. Nwosu"], i),
  phone: `+234 80${(3000000 + i * 91827).toString().slice(0, 7)}`,
  email: `contact@${name.toLowerCase().replace(/[^a-z]/g, "")}.ng`,
  address: `${(i + 1) * 12} ${pick(["Warehouse Rd, Ikeja","Marina, Lagos Island","Wuse II, Abuja","GRA, Port Harcourt","Bompai, Kano"], i)}`,
  industry: pick(["Retail","Manufacturing","FMCG","E-commerce","Telecom","Food & Beverage"], i),
  since: `20${20 + (i % 5)}-0${(i % 9) + 1}-1${i % 9}`,
  status: (i % 9 === 8 ? "Inactive" : i % 7 === 6 ? "Prospect" : "Active"),
}));

const incidentTypes: IncidentType[] = ["Accident","Cargo Damage","Vehicle Breakdown","Theft","Driver Misconduct","Delivery Issue","Other"];

export const incidents: Incident[] = Array.from({ length: 14 }, (_, i) => {
  const sev: Incident["severity"][] = ["Low","Moderate","High","Critical","Moderate"];
  const st: Incident["status"][] = ["Open","Investigating","Resolved","Resolved","Investigating"];
  const trip = trips[i % trips.length];
  return {
    id: `INC-${900 + i}`,
    type: pick(incidentTypes, i),
    driver: pick(driverNames, i),
    truck: `TRK-${1000 + (i % 32)}`,
    trip: trip.id,
    client: trip.customer,
    severity: pick(sev, i),
    status: pick(st, i),
    date: `2026-0${(i % 6) + 1}-${String((i % 27) + 1).padStart(2,"0")}`,
    location: pick(cities, i),
    rootCause: pick(["Speeding","Fatigue","Weather","Mechanical","Human Error","Route Deviation"], i),
    description: "Incident reported by driver. Full account pending investigation.",
    reportedBy: pick(["A. Bello","M. Yusuf","C. Okoro","S. Adeyemi","N. Ibrahim"], i),
    investigator: pick(["J. Adeniyi","K. Mohammed","O. Balogun"], i),
    correctiveActions: "Corrective action plan in progress.",
    estDelayMin: 30 + (i * 17) % 240,
    estFinancialImpact: (i + 1) * 125000,
    photos: [],
    documents: [],
  };
});

export const documents: DocumentRow[] = Array.from({ length: 18 }, (_, i) => {
  const types: DocumentRow["type"][] = ["License","Insurance","Registration","Permit"];
  const statuses: DocumentRow["status"][] = ["Valid","Valid","Valid","Expiring","Expiring","Expired"];
  return {
    id: `DOC-${400 + i}`,
    name: `${pick(types, i)} — ${pick(["Fleet A","Fleet B","Driver Pool","North Region","South Region"], i)}`,
    type: pick(types, i),
    owner: i % 2 === 0 ? pick(driverNames, i) : `TRK-${1000 + (i % 32)}`,
    expiry: `2026-${String((i % 12) + 1).padStart(2,"0")}-${String((i % 27) + 1).padStart(2,"0")}`,
    status: pick(statuses, i),
    version: `v1.${i}`,
  };
});

export const alerts = [
  { id: 1, type: "danger", title: "Delivery delayed", detail: "Trip TRP-7382 to ABC Stores", time: "10 min ago", icon: "AlertTriangle" as const },
  { id: 2, type: "warning", title: "Maintenance due", detail: "Truck KJA 89XY due in 3 days", time: "25 min ago", icon: "Wrench" as const },
  { id: 3, type: "info", title: "License expiring", detail: "Driver Tunde A. license expires in 7 days", time: "1 hr ago", icon: "IdCard" as const },
  { id: 4, type: "purple", title: "Insurance expiring", detail: "Insurance for GGE 543RT expires in 5 days", time: "3 hr ago", icon: "ShieldAlert" as const },
];

export const priorities = [
  { id: 1, color: "danger", title: "Reduce Fuel Cost", detail: "Fuel cost increased by 8.4% vs last week", time: "10 min ago", icon: "Flame" as const },
  { id: 2, color: "warning", title: "Improve On-Time Delivery", detail: "11 deliveries delayed this week", time: "25 min ago", icon: "Clock" as const },
  { id: 3, color: "success", title: "Maintenance Due", detail: "10 vehicles due for service", time: "1 hr ago", icon: "Wrench" as const },
  { id: 4, color: "info", title: "Compliance", detail: "5 documents/permits expiring in the next 7 days", time: "3 hr ago", icon: "ShieldCheck" as const },
];

// Chart series
export const weekly = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i) => ({
  day: d,
  onTime: 80 + ((i * 7) % 15),
  delayed: 5 + ((i * 3) % 12),
  fuel: 40 + ((i * 11) % 30),
  trips: 30 + ((i * 5) % 25),
}));

export const monthly = Array.from({ length: 12 }, (_, i) => ({
  m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  cost: 900 + ((i * 73) % 400),
  revenue: 1400 + ((i * 91) % 500),
  fuel: 300 + ((i * 41) % 200),
}));

export const fleetBreakdown = [
  { name: "On The Road", value: 98, color: "var(--success)" },
  { name: "Idle", value: 12, color: "var(--warning)" },
  { name: "In Maintenance", value: 10, color: "var(--danger)" },
  { name: "Offline", value: 8, color: "var(--muted-foreground)" },
];

export const costBreakdown = [
  { name: "Fuel", value: 45, amount: "₦639M", color: "var(--info)" },
  { name: "Maintenance", value: 20, amount: "₦284M", color: "var(--success)" },
  { name: "Driver Cost", value: 16, amount: "₦227M", color: "var(--warning)" },
  { name: "Tolls", value: 11, amount: "₦156M", color: "var(--purple)" },
  { name: "Others", value: 8, amount: "₦114M", color: "var(--muted-foreground)" },
];

export const kpis = {
  totalTrucks: 128,
  onTheRoad: 98,
  activeDeliveries: 142,
  onTimeRate: 92.3,
  utilization: 81.7,
  operatingCost: "₦62.6M",
};

// ---- Maintenance records ----
export interface MaintenanceRecord {
  id: string;
  truck: string;
  service: string;
  type: "Routine" | "Safety" | "Diagnostic" | "Repair";
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  cost: number;
  status: "Scheduled" | "In Workshop" | "Completed" | "Overdue";
  performedBy: string;
  workDone: string;
  nextService: string;
  date: string;
}

const workshops = ["AutoCare Workshop","Brake Masters","PrimeLEX Workshop","TechAuto Services"];
const services = [
  { name: "Oil Change", type: "Routine" as const, interval: "10,000 km" },
  { name: "Brake Inspection", type: "Safety" as const, interval: "15,000 km" },
  { name: "Tire Rotation", type: "Routine" as const, interval: "20,000 km" },
  { name: "Engine Diagnostics", type: "Diagnostic" as const, interval: "30,000 km" },
  { name: "Transmission Check", type: "Diagnostic" as const, interval: "25,000 km" },
  { name: "Air Filter Replacement", type: "Routine" as const, interval: "20,000 km" },
  { name: "Full Service", type: "Routine" as const, interval: "40,000 km" },
];

export const maintenanceRecords: MaintenanceRecord[] = Array.from({ length: 22 }, (_, i) => {
  const s = services[i % services.length];
  const statuses: MaintenanceRecord["status"][] = ["Scheduled","Scheduled","Scheduled","In Workshop","Completed","Completed","Overdue"];
  const status = statuses[i % statuses.length];
  return {
    id: `MNT-${800 + i}`,
    truck: trucks[i % trucks.length].id,
    service: s.name,
    type: s.type,
    dueDate: `2026-05-${String((i % 27) + 1).padStart(2,"0")}`,
    priority: (["Medium","High","Medium","Low","High"] as const)[i % 5],
    cost: 45000 + (i * 21000) % 300000,
    status,
    performedBy: pick(workshops, i),
    workDone: status === "Completed" ? `Completed ${s.name.toLowerCase()}. Checked levels. All OK.` : "",
    nextService: `Next: Aug ${((i % 27) + 1)}, 2026, ${s.interval}`,
    date: `2026-05-${String((i % 13) + 1).padStart(2,"0")}`,
  };
});

// ---- Fuel transactions ----
export interface FuelTransaction {
  id: string;
  date: string;
  type: "Issue" | "Purchase";
  truck: string;
  driver: string;
  fuelType: "Diesel" | "Petrol";
  quantity: number;
  unitPrice: number;
  amount: number;
  location: string;
  recordedBy: string;
  trip?: string;
  status: "Issued" | "Pending";
  assignmentType?: "Trip" | "General Use";
  note?: string;
}

export const fuelTransactions: FuelTransaction[] = Array.from({ length: 24 }, (_, i) => {
  const qty = 100 + ((i * 37) % 300);
  const price = 950 + ((i * 7) % 40);
  const truck = trucks[i % trucks.length];
  return {
    id: `FA-2026-${1240 + i}`,
    date: `2026-05-${String(20 - (i % 20)).padStart(2,"0")} ${String(6 + (i % 12)).padStart(2,"0")}:${String((i * 11) % 60).padStart(2,"0")} AM`,
    type: i % 6 === 0 ? "Purchase" : "Issue",
    truck: truck.id,
    driver: truck.driver,
    fuelType: i % 4 === 0 ? "Petrol" : "Diesel",
    quantity: qty,
    unitPrice: price,
    amount: qty * price,
    location: pick(["Lagos Depot","Port Harcourt Depot","NNPC Filling Station","Total Kaduna","Oando Abuja"], i),
    recordedBy: "John Admin",
    trip: trips[i % trips.length].id,
    status: i % 8 === 3 ? "Pending" : "Issued",
    assignmentType: i % 3 === 0 ? "General Use" : "Trip",
  };
});

// ---- Fleet Managers ----
const managerSeed: Array<Omit<FleetManager, "assignedTruckIds">> = [
  { id: "FM-101", name: "Bola Adeyemi",   employeeId: "EMP-1021", role: "Fleet Manager", department: "Operations", phone: "+234 803 555 0110", email: "bola.a@primelex.com", status: "Active", dateJoined: "2023-04-11" },
  { id: "FM-102", name: "Chinedu Okonkwo", employeeId: "EMP-1044", role: "Fleet Manager", department: "Operations", phone: "+234 803 555 0221", email: "chinedu.o@primelex.com", status: "Active", dateJoined: "2022-11-02" },
  { id: "FM-103", name: "Aisha Bello",     employeeId: "EMP-1065", role: "Fleet Manager", department: "Operations", phone: "+234 803 555 0332", email: "aisha.b@primelex.com", status: "Active", dateJoined: "2024-02-19" },
  { id: "FM-104", name: "Musa Ibrahim",    employeeId: "EMP-1088", role: "Fleet Manager", department: "Operations", phone: "+234 803 555 0443", email: "musa.i@primelex.com", status: "Active", dateJoined: "2023-08-25" },
];

// Default round-robin assignment of trucks to managers (used as seed baseline).
export const fleetManagers: FleetManager[] = managerSeed.map((m, i) => ({
  ...m,
  assignedTruckIds: trucks.filter((_, ti) => ti % managerSeed.length === i).map((t) => t.id),
}));

export function getFleetManagerForTruck(truckId: string, managers: FleetManager[] = fleetManagers) {
  return managers.find((m) => m.assignedTruckIds.includes(truckId));
}

// ---- Routes ----
function routeKey(origin: string, destination: string) { return `${origin}__${destination}`; }
const routeMap = new Map<string, RouteEntity>();
trips.forEach((t) => {
  const key = routeKey(t.origin, t.destination);
  if (!routeMap.has(key)) {
    routeMap.set(key, {
      id: `RTE-${400 + routeMap.size}`,
      name: `${t.origin} → ${t.destination}`,
      origin: t.origin,
      destination: t.destination,
      distanceKm: t.distance,
      createdAt: "2025-06-01",
    });
  }
});
export const routes: RouteEntity[] = Array.from(routeMap.values());
export function getRouteFor(origin: string, destination: string) {
  return routeMap.get(routeKey(origin, destination));
}
export function getRouteById(id: string) { return routes.find((r) => r.id === id); }

// ---- Trip historical fuel snapshots (permanent per trip) ----
export interface TripFuelSnapshot { tripId: string; assignedFuelL: number; fuelCostNGN: number; distanceKm: number; litersPerKm: number; routeId?: string; }
export const tripFuelHistory: TripFuelSnapshot[] = trips
  .filter((t) => t.status === "Delivered")
  .map((t) => {
    const litersPerKm = 0.30 + ((parseInt(t.id.slice(-2), 10) % 9) * 0.008); // synthetic variance
    const assignedFuelL = Math.round(t.distance * litersPerKm);
    const price = 970 + ((parseInt(t.id.slice(-2), 10) % 4) * 8);
    return {
      tripId: t.id,
      assignedFuelL,
      fuelCostNGN: assignedFuelL * price,
      distanceKm: t.distance,
      litersPerKm: Math.round(litersPerKm * 1000) / 1000,
      routeId: getRouteFor(t.origin, t.destination)?.id,
    };
  });

// ---- Fuel KPI helpers ----
export function getFleetAvgLkm(): number {
  const totalFuel = tripFuelHistory.reduce((s, h) => s + h.assignedFuelL, 0);
  const totalDist = tripFuelHistory.reduce((s, h) => s + h.distanceKm, 0);
  return totalDist ? totalFuel / totalDist : 0;
}
export function getTruckAvgLkm(truckId: string): number {
  const truckTrips = trips.filter((t) => t.truck === truckId);
  const snapshots = tripFuelHistory.filter((h) => truckTrips.some((t) => t.id === h.tripId));
  const totalFuel = snapshots.reduce((s, h) => s + h.assignedFuelL, 0);
  const totalDist = snapshots.reduce((s, h) => s + h.distanceKm, 0);
  return totalDist ? totalFuel / totalDist : 0;
}
export function getDriverAvgLkm(driverName: string): number {
  const driverTrips = trips.filter((t) => t.driver === driverName);
  const snapshots = tripFuelHistory.filter((h) => driverTrips.some((t) => t.id === h.tripId));
  const totalFuel = snapshots.reduce((s, h) => s + h.assignedFuelL, 0);
  const totalDist = snapshots.reduce((s, h) => s + h.distanceKm, 0);
  return totalDist ? totalFuel / totalDist : 0;
}
export function getRouteAvgLkm(routeId: string): number {
  const routeFuel = tripFuelHistory.filter((h) => h.routeId === routeId);
  const totalFuel = routeFuel.reduce((s, h) => s + h.assignedFuelL, 0);
  const totalDist = routeFuel.reduce((s, h) => s + h.distanceKm, 0);
  return totalDist ? totalFuel / totalDist : 0;
}
export function getFleetManagerAvgLkm(managerTruckIds: string[]): number {
  const managerTrips = trips.filter((t) => managerTruckIds.includes(t.truck));
  const snapshots = tripFuelHistory.filter((h) => managerTrips.some((t) => t.id === h.tripId));
  const totalFuel = snapshots.reduce((s, h) => s + h.assignedFuelL, 0);
  const totalDist = snapshots.reduce((s, h) => s + h.distanceKm, 0);
  return totalDist ? totalFuel / totalDist : 0;
}

// ---- Maintenance intelligence helpers ----
export function getTruckHealthScore(truckId: string): number {
  const truckMaint = maintenanceRecords.filter((m) => m.truck === truckId);
  const truckIncidents = incidents.filter((i) => i.truck === truckId);
  const completedMaint = truckMaint.filter((m) => m.status === "Completed");
  const downtimeHours = completedMaint.length * 18;
  const repairCost = completedMaint.reduce((s, m) => s + m.cost, 0);
  let score = 100;
  score -= Math.min(truckMaint.length * 3, 20);
  score -= Math.min(downtimeHours / 100, 15);
  score -= Math.min(repairCost / 100000, 20);
  score -= Math.min(truckIncidents.length * 8, 25);
  return Math.max(0, Math.round(score));
}
export function getAvgDowntime(truckId?: string): number {
  const records = truckId ? maintenanceRecords.filter((m) => m.truck === truckId) : maintenanceRecords;
  const completed = records.filter((m) => m.status === "Completed");
  return completed.length ? 18 : 0;
}
export function getAvgRepairCost(truckId?: string): number {
  const records = truckId ? maintenanceRecords.filter((m) => m.truck === truckId) : maintenanceRecords;
  const completed = records.filter((m) => m.status === "Completed");
  return completed.length ? Math.round(completed.reduce((s, m) => s + m.cost, 0) / completed.length) : 0;
}
export function getMTBR(truckId: string): number {
  const records = maintenanceRecords
    .filter((m) => m.truck === truckId && m.status === "Completed")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  if (records.length < 2) return 0;
  const totalDays = (new Date(records[records.length - 1].date).getTime() - new Date(records[0].date).getTime()) / 86400000;
  return Math.round(totalDays / (records.length - 1));
}
export function getMaintenanceSpend(truckId?: string): number {
  const records = truckId ? maintenanceRecords.filter((m) => m.truck === truckId) : maintenanceRecords;
  return records.filter((m) => m.status === "Completed").reduce((s, m) => s + m.cost, 0);
}

// ---- Route intelligence helpers ----
export function getPreferredTrucks(routeId: string, limit = 5): string[] {
  const rt = getRouteById(routeId);
  if (!rt) return [];
  const routeTrips = trips.filter((t) => t.origin === rt.origin && t.destination === rt.destination);
  const counts: Record<string, number> = {};
  routeTrips.forEach((t) => { counts[t.truck] = (counts[t.truck] ?? 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([id]) => id);
}
export function getPreferredDrivers(routeId: string, limit = 5): string[] {
  const rt = getRouteById(routeId);
  if (!rt) return [];
  const routeTrips = trips.filter((t) => t.origin === rt.origin && t.destination === rt.destination);
  const counts: Record<string, number> = {};
  routeTrips.forEach((t) => { counts[t.driver] = (counts[t.driver] ?? 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([name]) => name);
}
export function getRouteHealthScore(routeId: string): number {
  const rt = getRouteById(routeId);
  if (!rt) return 0;
  const routeTrips = trips.filter((t) => t.origin === rt.origin && t.destination === rt.destination);
  const routeIncidents = incidents.filter((i) => {
    const tp = trips.find((t) => t.id === i.trip);
    return tp && tp.origin === rt.origin && tp.destination === rt.destination;
  });
  const routeFuel = tripFuelHistory.filter((h) => h.routeId === routeId);
  const routeMaint = maintenanceRecords.filter((m) => routeTrips.some((t) => t.truck === m.truck));
  const completedTrips = routeTrips.filter((t) => t.status === "Delivered");
  const onTimeRate = completedTrips.length ? 0.92 : 0.5;
  let score = 100;
  const avgLpk = routeFuel.length ? routeFuel.reduce((s, h) => s + h.litersPerKm, 0) / routeFuel.length : 0.35;
  if (avgLpk > 0.4) score -= 15;
  else if (avgLpk > 0.35) score -= 8;
  score -= Math.min(routeIncidents.length * 10, 30);
  score -= Math.min(routeMaint.length * 3, 15);
  if (onTimeRate > 0.9) score += 5;
  else score -= 10;
  return Math.max(0, Math.min(100, Math.round(score)));
}
export function getRouteMaintenanceSummary(routeId: string) {
  const rt = getRouteById(routeId);
  if (!rt) return { totalEvents: 0, totalSpend: 0, downtimeHours: 0 };
  const routeTrips = trips.filter((t) => t.origin === rt.origin && t.destination === rt.destination);
  const routeMaint = maintenanceRecords.filter((m) => routeTrips.some((t) => t.truck === m.truck));
  const completed = routeMaint.filter((m) => m.status === "Completed");
  return { totalEvents: routeMaint.length, totalSpend: completed.reduce((s, m) => s + m.cost, 0), downtimeHours: completed.length * 18 };
}
export function getRouteFuelSummary(routeId: string) {
  const routeFuel = tripFuelHistory.filter((h) => h.routeId === routeId);
  const totalFuel = routeFuel.reduce((s, h) => s + h.assignedFuelL, 0);
  const totalDist = routeFuel.reduce((s, h) => s + h.distanceKm, 0);
  return { totalFuel, avgFuelPerTrip: routeFuel.length ? Math.round(totalFuel / routeFuel.length) : 0, avgLkm: totalDist ? totalFuel / totalDist : 0 };
}

// ---- CSV export helper ----
export function exportCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
