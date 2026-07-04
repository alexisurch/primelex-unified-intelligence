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

export interface Incident {
  id: string;
  type: "Accident" | "Near Miss" | "Claim" | "Violation";
  driver: string;
  truck: string;
  severity: "Low" | "Moderate" | "High" | "Critical";
  status: "Open" | "Investigating" | "Resolved";
  date: string;
  location: string;
  rootCause: string;
}

export interface DocumentRow {
  id: string;
  name: string;
  type: "License" | "Insurance" | "Registration" | "Permit";
  owner: string;
  expiry: string;
  status: "Valid" | "Expiring" | "Expired";
  version: string;
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

export const incidents: Incident[] = Array.from({ length: 14 }, (_, i) => {
  const types: Incident["type"][] = ["Accident","Near Miss","Claim","Violation","Near Miss"];
  const sev: Incident["severity"][] = ["Low","Moderate","High","Critical","Moderate"];
  const st: Incident["status"][] = ["Open","Investigating","Resolved","Resolved","Investigating"];
  return {
    id: `INC-${900 + i}`,
    type: pick(types, i),
    driver: pick(driverNames, i),
    truck: `TRK-${1000 + (i % 32)}`,
    severity: pick(sev, i),
    status: pick(st, i),
    date: `2026-0${(i % 6) + 1}-${String((i % 27) + 1).padStart(2,"0")}`,
    location: pick(cities, i),
    rootCause: pick(["Speeding","Fatigue","Weather","Mechanical","Human Error","Route Deviation"], i),
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
