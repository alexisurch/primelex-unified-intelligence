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
  type: "License" | "Insurance" | "Registration" | "Permit";
  owner: string;
  expiry: string;
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
