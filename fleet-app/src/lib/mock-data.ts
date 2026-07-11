// PrimeLex Logistics — Nigerian Fleet Management Dashboard
// Comprehensive mock data for development and prototyping.

export type TruckStatus = "On The Road" | "Idle" | "Maintenance" | "Offline";
export type DriverStatus = "Active" | "On Leave" | "Suspended";
export type TripStatus = "Delivered" | "In Transit" | "Delayed" | "Scheduled";
export type IncidentStatus = "Open" | "Investigating" | "Resolved";
export type IncidentSeverity = "Critical" | "High" | "Medium" | "Low";
export type IncidentType =
  | "Accident"
  | "Fuel Theft"
  | "Cargo Damage"
  | "Mechanical Failure"
  | "Traffic Violation";
export type RiskLevel = "Low" | "Medium" | "High";
export type RouteCondition = "Good" | "Fair" | "Poor";
export type ClientStatus = "Active" | "Inactive";
export type MaintenanceStatus = "Completed" | "Scheduled" | "Overdue";
export type MaintenanceService =
  | "Oil Change"
  | "Brake Service"
  | "Tire Rotation"
  | "Engine Overhaul"
  | "Inspection";
export type MaintenancePriority = "High" | "Medium" | "Low";
export type DocumentType =
  | "Vehicle Registration"
  | "Insurance"
  | "Driver License"
  | "Road Worthiness"
  | "Permit";
export type DocumentStatus = "Valid" | "Expiring Soon" | "Expired";

export interface Truck {
  id: string;
  plate: string;
  model: string;
  capacity: string;
  status: TruckStatus;
  driver: string;
  location: string;
  fuel: number;
  odometer: number;
  engineHealth: number;
  type: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseExpiry: string;
  score: number;
  violations: number;
  tripsCompleted: number;
  status: DriverStatus;
  assignedTruck: string;
}

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  truck: string;
  driver: string;
  distance: number;
  status: TripStatus;
  departureTime: string;
  arrivalTime: string;
  cargo: string;
  clientId: string;
  routeId: string;
}

export interface Incident {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  truckId: string;
  driverId: string;
  routeId: string;
  date: string;
  location: string;
  status: IncidentStatus;
  description: string;
  investigator: string;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  avgDuration: number;
  tripsCount: number;
  riskLevel: RiskLevel;
  condition: RouteCondition;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  totalTrips: number;
  totalSpent: string;
  status: ClientStatus;
  joinDate: string;
}

export interface MaintenanceRecord {
  id: string;
  truck: string;
  service: MaintenanceService;
  date: string;
  status: MaintenanceStatus;
  cost: string;
  performedBy: string;
  priority: MaintenancePriority;
}

export interface DocumentRecord {
  id: string;
  type: DocumentType;
  owner: string;
  expiryDate: string;
  status: DocumentStatus;
  issuedBy: string;
}

export interface BreakdownItem {
  name: string;
  value: number;
  color: string;
}

export interface CostBreakdownItem {
  name: string;
  value: number;
  amount: string;
  color: string;
}

export interface Alert {
  id: string;
  type: "danger" | "warning" | "info";
  icon: "AlertTriangle" | "Wrench" | "IdCard" | "ShieldAlert";
  title: string;
  detail: string;
  time: string;
}

export interface Priority {
  id: string;
  color: "danger" | "warning" | "success";
  icon: "Flame" | "Clock" | "Wrench" | "ShieldCheck";
  title: string;
  detail: string;
  time: string;
}

export interface Kpis {
  totalTrucks: number;
  onTheRoad: number;
  activeDeliveries: number;
  onTimeRate: number;
  utilization: number;
  operatingCost: string;
}

export interface MonthlyPoint {
  m: string;
  revenue: number;
  cost: number;
}

export interface WeeklyPoint {
  day: string;
  trips: number;
  delays: number;
}

// ---------------------------------------------------------------------------
// Drivers (defined first so trucks/trips can reference names consistently)
// ---------------------------------------------------------------------------

export const drivers: Driver[] = [
  {
    id: "DRV-001",
    name: "Chinedu Okafor",
    phone: "+234 803 412 8890",
    licenseExpiry: "2026-08-15",
    score: 94,
    violations: 1,
    tripsCompleted: 312,
    status: "Active",
    assignedTruck: "TRK-1000",
  },
  {
    id: "DRV-002",
    name: "Ibrahim Musa",
    phone: "+234 805 778 2211",
    licenseExpiry: "2025-11-02",
    score: 88,
    violations: 2,
    tripsCompleted: 276,
    status: "Active",
    assignedTruck: "TRK-1001",
  },
  {
    id: "DRV-003",
    name: "Emeka Nwosu",
    phone: "+234 802 553 9087",
    licenseExpiry: "2027-03-21",
    score: 91,
    violations: 0,
    tripsCompleted: 298,
    status: "Active",
    assignedTruck: "TRK-1002",
  },
  {
    id: "DRV-004",
    name: "Tunde Balogun",
    phone: "+234 807 119 4456",
    licenseExpiry: "2026-01-09",
    score: 79,
    violations: 4,
    tripsCompleted: 188,
    status: "On Leave",
    assignedTruck: "TRK-1003",
  },
  {
    id: "DRV-005",
    name: "Yusuf Abdullahi",
    phone: "+234 809 665 3321",
    licenseExpiry: "2026-06-30",
    score: 86,
    violations: 2,
    tripsCompleted: 241,
    status: "Active",
    assignedTruck: "TRK-1004",
  },
  {
    id: "DRV-006",
    name: "Babatunde Adebayo",
    phone: "+234 803 884 1276",
    licenseExpiry: "2025-09-14",
    score: 83,
    violations: 3,
    tripsCompleted: 205,
    status: "Active",
    assignedTruck: "TRK-1005",
  },
  {
    id: "DRV-007",
    name: "Samuel Eze",
    phone: "+234 806 220 7741",
    licenseExpiry: "2027-02-18",
    score: 95,
    violations: 0,
    tripsCompleted: 341,
    status: "Active",
    assignedTruck: "TRK-1006",
  },
  {
    id: "DRV-008",
    name: "Olumide Fashanu",
    phone: "+234 802 997 5512",
    licenseExpiry: "2026-05-27",
    score: 72,
    violations: 6,
    tripsCompleted: 142,
    status: "Suspended",
    assignedTruck: "TRK-1007",
  },
  {
    id: "DRV-009",
    name: "Kunle Odunsi",
    phone: "+234 805 332 6698",
    licenseExpiry: "2026-12-03",
    score: 89,
    violations: 1,
    tripsCompleted: 263,
    status: "Active",
    assignedTruck: "TRK-1008",
  },
  {
    id: "DRV-010",
    name: "Nnamdi Obi",
    phone: "+234 807 441 8823",
    licenseExpiry: "2025-10-08",
    score: 81,
    violations: 3,
    tripsCompleted: 197,
    status: "Active",
    assignedTruck: "TRK-1009",
  },
];

// ---------------------------------------------------------------------------
// Trucks
// ---------------------------------------------------------------------------

export const trucks: Truck[] = [
  {
    id: "TRK-1000",
    plate: "LAG-238-XK",
    model: "Mack Anthem 2022",
    capacity: "30 tons",
    status: "On The Road",
    driver: "Chinedu Okafor",
    location: "Lagos",
    fuel: 78,
    odometer: 184250,
    engineHealth: 96,
    type: "Heavy Duty",
  },
  {
    id: "TRK-1001",
    plate: "KAN-512-PR",
    model: "Volvo FH16 2021",
    capacity: "28 tons",
    status: "On The Road",
    driver: "Ibrahim Musa",
    location: "Kano",
    fuel: 64,
    odometer: 221890,
    engineHealth: 88,
    type: "Heavy Duty",
  },
  {
    id: "TRK-1002",
    plate: "PHC-107-XM",
    model: "Mercedes Actros 2023",
    capacity: "32 tons",
    status: "On The Road",
    driver: "Emeka Nwosu",
    location: "Port Harcourt",
    fuel: 91,
    odometer: 98430,
    engineHealth: 99,
    type: "Heavy Duty",
  },
  {
    id: "TRK-1003",
    plate: "IBD-664-QZ",
    model: "Scania R450 2020",
    capacity: "25 tons",
    status: "Idle",
    driver: "Tunde Balogun",
    location: "Ibadan",
    fuel: 42,
    odometer: 267540,
    engineHealth: 74,
    type: "Medium Duty",
  },
  {
    id: "TRK-1004",
    plate: "KAD-389-WL",
    model: "MAN TGX 2022",
    capacity: "30 tons",
    status: "On The Road",
    driver: "Yusuf Abdullahi",
    location: "Kaduna",
    fuel: 70,
    odometer: 156780,
    engineHealth: 92,
    type: "Heavy Duty",
  },
  {
    id: "TRK-1005",
    plate: "ENU-221-FG",
    model: "Mack Granite 2021",
    capacity: "26 tons",
    status: "On The Road",
    driver: "Babatunde Adebayo",
    location: "Enugu",
    fuel: 55,
    odometer: 203110,
    engineHealth: 85,
    type: "Medium Duty",
  },
  {
    id: "TRK-1006",
    plate: "LAG-905-VB",
    model: "Volvo FH16 2023",
    capacity: "32 tons",
    status: "On The Road",
    driver: "Samuel Eze",
    location: "Benin City",
    fuel: 83,
    odometer: 71260,
    engineHealth: 98,
    type: "Heavy Duty",
  },
  {
    id: "TRK-1007",
    plate: "ABJ-448-YT",
    model: "Mercedes Actros 2019",
    capacity: "28 tons",
    status: "Maintenance",
    driver: "Olumide Fashanu",
    location: "Abuja",
    fuel: 18,
    odometer: 312870,
    engineHealth: 61,
    type: "Heavy Duty",
  },
  {
    id: "TRK-1008",
    plate: "PHC-776-RS",
    model: "Scania R500 2022",
    capacity: "30 tons",
    status: "On The Road",
    driver: "Kunle Odunsi",
    location: "Port Harcourt",
    fuel: 67,
    odometer: 142930,
    engineHealth: 90,
    type: "Heavy Duty",
  },
  {
    id: "TRK-1009",
    plate: "KAN-330-HJ",
    model: "MAN TGX 2021",
    capacity: "25 tons",
    status: "On The Road",
    driver: "Nnamdi Obi",
    location: "Kano",
    fuel: 49,
    odometer: 198540,
    engineHealth: 82,
    type: "Medium Duty",
  },
  {
    id: "TRK-1010",
    plate: "IBD-119-LP",
    model: "Mack Anthem 2020",
    capacity: "28 tons",
    status: "Maintenance",
    driver: "Unassigned",
    location: "Ibadan",
    fuel: 12,
    odometer: 289600,
    engineHealth: 58,
    type: "Heavy Duty",
  },
  {
    id: "TRK-1011",
    plate: "ABJ-602-KN",
    model: "Volvo FH16 2018",
    capacity: "26 tons",
    status: "Offline",
    driver: "Unassigned",
    location: "Abuja",
    fuel: 0,
    odometer: 341220,
    engineHealth: 44,
    type: "Medium Duty",
  },
];

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export const routes: Route[] = [
  {
    id: "RT-001",
    name: "Lagos - Abuja Highway",
    origin: "Lagos",
    destination: "Abuja",
    distance: 735,
    avgDuration: 11.5,
    tripsCount: 184,
    riskLevel: "Medium",
    condition: "Good",
  },
  {
    id: "RT-002",
    name: "Lagos - Ibadan Expressway",
    origin: "Lagos",
    destination: "Ibadan",
    distance: 128,
    avgDuration: 2.5,
    tripsCount: 312,
    riskLevel: "Low",
    condition: "Good",
  },
  {
    id: "RT-003",
    name: "Lagos - Benin City Route",
    origin: "Lagos",
    destination: "Benin City",
    distance: 320,
    avgDuration: 6.0,
    tripsCount: 156,
    riskLevel: "Medium",
    condition: "Fair",
  },
  {
    id: "RT-004",
    name: "Kano - Abuja Highway",
    origin: "Kano",
    destination: "Abuja",
    distance: 480,
    avgDuration: 8.0,
    tripsCount: 142,
    riskLevel: "Medium",
    condition: "Fair",
  },
  {
    id: "RT-005",
    name: "Port Harcourt - Enugu Road",
    origin: "Port Harcourt",
    destination: "Enugu",
    distance: 245,
    avgDuration: 4.5,
    tripsCount: 98,
    riskLevel: "High",
    condition: "Poor",
  },
  {
    id: "RT-006",
    name: "Port Harcourt - Lagos Coastal",
    origin: "Port Harcourt",
    destination: "Lagos",
    distance: 612,
    avgDuration: 10.0,
    tripsCount: 121,
    riskLevel: "Medium",
    condition: "Fair",
  },
  {
    id: "RT-007",
    name: "Kaduna - Kano Expressway",
    origin: "Kaduna",
    destination: "Kano",
    distance: 235,
    avgDuration: 3.5,
    tripsCount: 167,
    riskLevel: "Low",
    condition: "Good",
  },
  {
    id: "RT-008",
    name: "Abuja - Lokoja - Enugu Corridor",
    origin: "Abuja",
    destination: "Enugu",
    distance: 540,
    avgDuration: 9.0,
    tripsCount: 87,
    riskLevel: "High",
    condition: "Poor",
  },
];

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

export const clients: Client[] = [
  {
    id: "CLT-001",
    name: "Dangote Cement Plc",
    industry: "Manufacturing",
    contactPerson: "Aisha Mohammed",
    email: "logistics@dangotecement.com",
    phone: "+234 700 123 4567",
    totalTrips: 248,
    totalSpent: "₦184.5M",
    status: "Active",
    joinDate: "2021-03-12",
  },
  {
    id: "CLT-002",
    name: "Flutterwave Logistics",
    industry: "Fintech",
    contactPerson: "Olugbenga Agboola",
    email: "ops@flutterwave.com",
    phone: "+234 800 998 1122",
    totalTrips: 156,
    totalSpent: "₦92.3M",
    status: "Active",
    joinDate: "2022-06-04",
  },
  {
    id: "CLT-003",
    name: "Nestoil Limited",
    industry: "Oil & Gas",
    contactPerson: "Ernest Azudialu",
    email: "supply@nestoil.com",
    phone: "+234 805 442 7788",
    totalTrips: 198,
    totalSpent: "₦142.8M",
    status: "Active",
    joinDate: "2020-11-21",
  },
  {
    id: "CLT-004",
    name: "Jumia Nigeria",
    industry: "E-commerce",
    contactPerson: "Juliet Anammah",
    email: "fleet@jumia.com.ng",
    phone: "+234 802 334 5566",
    totalTrips: 312,
    totalSpent: "₦76.9M",
    status: "Active",
    joinDate: "2022-01-18",
  },
  {
    id: "CLT-005",
    name: "Bua Group",
    industry: "Manufacturing",
    contactPerson: "Abdulsamad Rabiu",
    email: "transport@buagroup.com",
    phone: "+234 807 661 2233",
    totalTrips: 134,
    totalSpent: "₦98.2M",
    status: "Active",
    joinDate: "2021-09-30",
  },
  {
    id: "CLT-006",
    name: "Honeywell Flour Mills",
    industry: "FMCG",
    contactPerson: "Olabode Akanji",
    email: "logistics@honeywell.com.ng",
    phone: "+234 809 554 8899",
    totalTrips: 67,
    totalSpent: "₦31.4M",
    status: "Inactive",
    joinDate: "2019-04-15",
  },
];

// ---------------------------------------------------------------------------
// Trips
// ---------------------------------------------------------------------------

export const trips: Trip[] = [
  {
    id: "TRP-001",
    origin: "Lagos",
    destination: "Abuja",
    truck: "TRK-1000",
    driver: "Chinedu Okafor",
    distance: 735,
    status: "In Transit",
    departureTime: "2024-11-18T06:00:00",
    arrivalTime: "2024-11-18T17:30:00",
    cargo: "Cement (30t)",
    clientId: "CLT-001",
    routeId: "RT-001",
  },
  {
    id: "TRP-002",
    origin: "Lagos",
    destination: "Ibadan",
    truck: "TRK-1006",
    driver: "Samuel Eze",
    distance: 128,
    status: "Delivered",
    departureTime: "2024-11-17T08:00:00",
    arrivalTime: "2024-11-17T10:30:00",
    cargo: "Electronics (12t)",
    clientId: "CLT-002",
    routeId: "RT-002",
  },
  {
    id: "TRP-003",
    origin: "Lagos",
    destination: "Benin City",
    truck: "TRK-1002",
    driver: "Emeka Nwosu",
    distance: 320,
    status: "Delivered",
    departureTime: "2024-11-16T05:30:00",
    arrivalTime: "2024-11-16T11:45:00",
    cargo: "Industrial Equipment (20t)",
    clientId: "CLT-003",
    routeId: "RT-003",
  },
  {
    id: "TRP-004",
    origin: "Kano",
    destination: "Abuja",
    truck: "TRK-1001",
    driver: "Ibrahim Musa",
    distance: 480,
    status: "In Transit",
    departureTime: "2024-11-18T04:15:00",
    arrivalTime: "2024-11-18T12:15:00",
    cargo: "Textiles (18t)",
    clientId: "CLT-004",
    routeId: "RT-004",
  },
  {
    id: "TRP-005",
    origin: "Port Harcourt",
    destination: "Enugu",
    truck: "TRK-1005",
    driver: "Babatunde Adebayo",
    distance: 245,
    status: "Delayed",
    departureTime: "2024-11-17T07:00:00",
    arrivalTime: "2024-11-17T13:30:00",
    cargo: "Steel Pipes (22t)",
    clientId: "CLT-003",
    routeId: "RT-005",
  },
  {
    id: "TRP-006",
    origin: "Port Harcourt",
    destination: "Lagos",
    truck: "TRK-1008",
    driver: "Kunle Odunsi",
    distance: 612,
    status: "In Transit",
    departureTime: "2024-11-18T03:00:00",
    arrivalTime: "2024-11-18T13:00:00",
    cargo: "Frozen Foods (16t)",
    clientId: "CLT-004",
    routeId: "RT-006",
  },
  {
    id: "TRP-007",
    origin: "Kaduna",
    destination: "Kano",
    truck: "TRK-1004",
    driver: "Yusuf Abdullahi",
    distance: 235,
    status: "Delivered",
    departureTime: "2024-11-17T09:00:00",
    arrivalTime: "2024-11-17T12:30:00",
    cargo: "Fertilizer (25t)",
    clientId: "CLT-005",
    routeId: "RT-007",
  },
  {
    id: "TRP-008",
    origin: "Abuja",
    destination: "Enugu",
    truck: "TRK-1009",
    driver: "Nnamdi Obi",
    distance: 540,
    status: "Delayed",
    departureTime: "2024-11-16T06:00:00",
    arrivalTime: "2024-11-16T15:00:00",
    cargo: "Construction Materials (24t)",
    clientId: "CLT-001",
    routeId: "RT-008",
  },
  {
    id: "TRP-009",
    origin: "Lagos",
    destination: "Abuja",
    truck: "TRK-1002",
    driver: "Emeka Nwosu",
    distance: 735,
    status: "Scheduled",
    departureTime: "2024-11-20T05:00:00",
    arrivalTime: "2024-11-20T16:30:00",
    cargo: "Cement (28t)",
    clientId: "CLT-005",
    routeId: "RT-001",
  },
  {
    id: "TRP-010",
    origin: "Lagos",
    destination: "Ibadan",
    truck: "TRK-1000",
    driver: "Chinedu Okafor",
    distance: 128,
    status: "Delivered",
    departureTime: "2024-11-15T07:00:00",
    arrivalTime: "2024-11-15T09:20:00",
    cargo: "Consumer Goods (14t)",
    clientId: "CLT-004",
    routeId: "RT-002",
  },
  {
    id: "TRP-011",
    origin: "Lagos",
    destination: "Benin City",
    truck: "TRK-1006",
    driver: "Samuel Eze",
    distance: 320,
    status: "In Transit",
    departureTime: "2024-11-18T05:00:00",
    arrivalTime: "2024-11-18T11:00:00",
    cargo: "Pharmaceuticals (10t)",
    clientId: "CLT-002",
    routeId: "RT-003",
  },
  {
    id: "TRP-012",
    origin: "Kano",
    destination: "Abuja",
    truck: "TRK-1009",
    driver: "Nnamdi Obi",
    distance: 480,
    status: "Scheduled",
    departureTime: "2024-11-21T04:30:00",
    arrivalTime: "2024-11-21T12:30:00",
    cargo: "Grains (26t)",
    clientId: "CLT-005",
    routeId: "RT-004",
  },
  {
    id: "TRP-013",
    origin: "Port Harcourt",
    destination: "Lagos",
    truck: "TRK-1005",
    driver: "Babatunde Adebayo",
    distance: 612,
    status: "Delivered",
    departureTime: "2024-11-14T03:30:00",
    arrivalTime: "2024-11-14T13:45:00",
    cargo: "Crude Equipment (28t)",
    clientId: "CLT-003",
    routeId: "RT-006",
  },
  {
    id: "TRP-014",
    origin: "Kaduna",
    destination: "Kano",
    truck: "TRK-1004",
    driver: "Yusuf Abdullahi",
    distance: 235,
    status: "Scheduled",
    departureTime: "2024-11-22T08:00:00",
    arrivalTime: "2024-11-22T11:30:00",
    cargo: "Agricultural Produce (22t)",
    clientId: "CLT-001",
    routeId: "RT-007",
  },
  {
    id: "TRP-015",
    origin: "Abuja",
    destination: "Enugu",
    truck: "TRK-1001",
    driver: "Ibrahim Musa",
    distance: 540,
    status: "Delivered",
    departureTime: "2024-11-13T05:00:00",
    arrivalTime: "2024-11-13T14:00:00",
    cargo: "Machinery (26t)",
    clientId: "CLT-006",
    routeId: "RT-008",
  },
];

// ---------------------------------------------------------------------------
// Incidents
// ---------------------------------------------------------------------------

export const incidents: Incident[] = [
  {
    id: "INC-001",
    type: "Accident",
    severity: "Critical",
    truckId: "TRK-1005",
    driverId: "DRV-006",
    routeId: "RT-005",
    date: "2024-11-17T10:15:00",
    location: "Port Harcourt - Enugu Road, km 84",
    status: "Investigating",
    description:
      "Truck collided with a stationary vehicle near a construction zone. Front bumper and radiator damaged; no injuries reported. Cargo intact.",
    investigator: "Femi Adesanya",
  },
  {
    id: "INC-002",
    type: "Fuel Theft",
    severity: "High",
    truckId: "TRK-1003",
    driverId: "DRV-004",
    routeId: "RT-002",
    date: "2024-11-15T02:40:00",
    location: "Lagos - Ibadan Expressway, Mowe junction",
    status: "Open",
    description:
      "Approximately 120 litres of diesel siphoned overnight while truck was parked at an unsecured rest stop.",
    investigator: "Chioma Ezeudo",
  },
  {
    id: "INC-003",
    type: "Mechanical Failure",
    severity: "Medium",
    truckId: "TRK-1007",
    driverId: "DRV-008",
    routeId: "RT-001",
    date: "2024-11-12T14:20:00",
    location: "Lagos - Abuja Highway, km 320",
    status: "Resolved",
    description:
      "Brake system failure caused by worn pads. Truck towed to Abuja workshop; full brake overhaul completed.",
    investigator: "Femi Adesanya",
  },
  {
    id: "INC-004",
    type: "Cargo Damage",
    severity: "High",
    truckId: "TRK-1009",
    driverId: "DRV-010",
    routeId: "RT-008",
    date: "2024-11-16T11:05:00",
    location: "Abuja - Lokoja - Enugu Corridor, km 210",
    status: "Investigating",
    description:
      "Rough road conditions caused 3 crates of pharmaceuticals to shift and break. Estimated cargo loss of ₦4.2M.",
    investigator: "Chioma Ezeudo",
  },
  {
    id: "INC-005",
    type: "Traffic Violation",
    severity: "Low",
    truckId: "TRK-1001",
    driverId: "DRV-002",
    routeId: "RT-004",
    date: "2024-11-10T16:45:00",
    location: "Kano - Abuja Highway, Zaria checkpoint",
    status: "Resolved",
    description:
      "Driver issued a citation for exceeding the speed limit by 12 km/h. Fine of ₦25,000 paid; driver retrained.",
    investigator: "Tunde Bakare",
  },
  {
    id: "INC-006",
    type: "Fuel Theft",
    severity: "Medium",
    truckId: "TRK-1011",
    driverId: "DRV-010",
    routeId: "RT-006",
    date: "2024-11-08T03:10:00",
    location: "Port Harcourt - Lagos Coastal, Ore lay-by",
    status: "Open",
    description:
      "Fuel tank tampered with during overnight parking. Estimated 80 litres lost; no suspect identified yet.",
    investigator: "Chioma Ezeudo",
  },
  {
    id: "INC-007",
    type: "Accident",
    severity: "High",
    truckId: "TRK-1002",
    driverId: "DRV-003",
    routeId: "RT-003",
    date: "2024-11-05T09:30:00",
    location: "Lagos - Benin City Route, km 156",
    status: "Resolved",
    description:
      "Minor sideswipe with a passing trailer. Side mirror and fender replaced; no injuries or cargo damage.",
    investigator: "Femi Adesanya",
  },
  {
    id: "INC-008",
    type: "Mechanical Failure",
    severity: "Medium",
    truckId: "TRK-1010",
    driverId: "DRV-004",
    routeId: "RT-007",
    date: "2024-11-03T18:50:00",
    location: "Kaduna - Kano Expressway, km 88",
    status: "Resolved",
    description:
      "Engine overheating due to a coolant leak. Radiator hose replaced on-site; truck continued to destination.",
    investigator: "Tunde Bakare",
  },
];

// ---------------------------------------------------------------------------
// Maintenance Records
// ---------------------------------------------------------------------------

export const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: "MNT-001",
    truck: "TRK-1007",
    service: "Engine Overhaul",
    date: "2024-11-15",
    status: "Completed",
    cost: "₦2.8M",
    performedBy: "Abuja Central Workshop",
    priority: "High",
  },
  {
    id: "MNT-002",
    truck: "TRK-1010",
    service: "Brake Service",
    date: "2024-11-19",
    status: "Scheduled",
    cost: "₦420,000",
    performedBy: "Ibadan Service Centre",
    priority: "High",
  },
  {
    id: "MNT-003",
    truck: "TRK-1003",
    service: "Oil Change",
    date: "2024-11-20",
    status: "Scheduled",
    cost: "₦85,000",
    performedBy: "Ibadan Service Centre",
    priority: "Medium",
  },
  {
    id: "MNT-004",
    truck: "TRK-1011",
    service: "Inspection",
    date: "2024-10-28",
    status: "Overdue",
    cost: "₦120,000",
    performedBy: "Abuja Central Workshop",
    priority: "High",
  },
  {
    id: "MNT-005",
    truck: "TRK-1000",
    service: "Tire Rotation",
    date: "2024-11-12",
    status: "Completed",
    cost: "₦64,000",
    performedBy: "Lagos Main Depot",
    priority: "Low",
  },
  {
    id: "MNT-006",
    truck: "TRK-1004",
    service: "Oil Change",
    date: "2024-11-22",
    status: "Scheduled",
    cost: "₦78,000",
    performedBy: "Kaduna Outpost",
    priority: "Medium",
  },
  {
    id: "MNT-007",
    truck: "TRK-1005",
    service: "Brake Service",
    date: "2024-11-18",
    status: "Completed",
    cost: "₦390,000",
    performedBy: "Enugu Workshop",
    priority: "High",
  },
  {
    id: "MNT-008",
    truck: "TRK-1002",
    service: "Inspection",
    date: "2024-11-25",
    status: "Scheduled",
    cost: "₦110,000",
    performedBy: "Port Harcourt Depot",
    priority: "Low",
  },
];

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export const documents: DocumentRecord[] = [
  {
    id: "DOC-001",
    type: "Vehicle Registration",
    owner: "LAG-238-XK",
    expiryDate: "2025-08-15",
    status: "Valid",
    issuedBy: "FRSC Lagos",
  },
  {
    id: "DOC-002",
    type: "Insurance",
    owner: "ABJ-448-YT",
    expiryDate: "2024-12-01",
    status: "Expiring Soon",
    issuedBy: "AXA Mansard Insurance",
  },
  {
    id: "DOC-003",
    type: "Driver License",
    owner: "Tunde Balogun",
    expiryDate: "2026-01-09",
    status: "Valid",
    issuedBy: "FRSC Oyo",
  },
  {
    id: "DOC-004",
    type: "Road Worthiness",
    owner: "KAN-512-PR",
    expiryDate: "2024-10-30",
    status: "Expired",
    issuedBy: "VI Kano",
  },
  {
    id: "DOC-005",
    type: "Permit",
    owner: "PHC-107-XM",
    expiryDate: "2025-06-21",
    status: "Valid",
    issuedBy: "NURTW Rivers",
  },
  {
    id: "DOC-006",
    type: "Vehicle Registration",
    owner: "IBD-119-LP",
    expiryDate: "2024-12-28",
    status: "Expiring Soon",
    issuedBy: "FRSC Oyo",
  },
  {
    id: "DOC-007",
    type: "Insurance",
    owner: "LAG-905-VB",
    expiryDate: "2025-03-14",
    status: "Valid",
    issuedBy: "Leadway Assurance",
  },
  {
    id: "DOC-008",
    type: "Driver License",
    owner: "Olumide Fashanu",
    expiryDate: "2026-05-27",
    status: "Valid",
    issuedBy: "FRSC FCT",
  },
];

// ---------------------------------------------------------------------------
// Chart Data
// ---------------------------------------------------------------------------

export const fleetBreakdown: BreakdownItem[] = [
  { name: "On The Road", value: 98, color: "success" },
  { name: "Idle", value: 15, color: "warning" },
  { name: "Maintenance", value: 10, color: "danger" },
  { name: "Offline", value: 5, color: "muted" },
];

export const costBreakdown: CostBreakdownItem[] = [
  { name: "Fuel", value: 45, amount: "₦640M", color: "success" },
  { name: "Maintenance", value: 20, amount: "₦284M", color: "warning" },
  { name: "Salaries", value: 25, amount: "₦355M", color: "danger" },
  { name: "Other", value: 10, amount: "₦142M", color: "muted" },
];

// ---------------------------------------------------------------------------
// Alerts & Priorities
// ---------------------------------------------------------------------------

export const alerts: Alert[] = [
  {
    id: "ALT-001",
    type: "danger",
    icon: "AlertTriangle",
    title: "Critical incident on RT-005",
    detail:
      "TRK-1005 involved in an accident near Port Harcourt - Enugu Road. Investigator dispatched.",
    time: "12 min ago",
  },
  {
    id: "ALT-002",
    type: "warning",
    icon: "Wrench",
    title: "TRK-1011 inspection overdue",
    detail:
      "Road worthiness inspection for TRK-1011 expired on Oct 30. Truck currently Offline.",
    time: "1 hr ago",
  },
  {
    id: "ALT-003",
    type: "danger",
    icon: "ShieldAlert",
    title: "Fuel theft reported",
    detail:
      "120 litres of diesel siphoned from TRK-1003 at Mowe junction overnight.",
    time: "3 hrs ago",
  },
  {
    id: "ALT-004",
    type: "warning",
    icon: "IdCard",
    title: "Driver license expiring",
    detail:
      "Ibrahim Musa's (DRV-002) driver license expires Nov 2, 2025. Renewal pending.",
    time: "5 hrs ago",
  },
  {
    id: "ALT-005",
    type: "info",
    icon: "Wrench",
    title: "Scheduled maintenance",
    detail:
      "TRK-1010 brake service scheduled for Nov 19 at Ibadan Service Centre.",
    time: "Yesterday",
  },
];

export const priorities: Priority[] = [
  {
    id: "PRI-001",
    color: "danger",
    icon: "Flame",
    title: "Resolve INC-001 accident investigation",
    detail:
      "Critical accident on RT-005 awaiting investigator report. Deadline: today.",
    time: "Due today",
  },
  {
    id: "PRI-002",
    color: "warning",
    icon: "Clock",
    title: "Renew TRK-1011 road worthiness",
    detail:
      "Inspection expired Oct 30. Truck cannot return to service until renewed.",
    time: "Overdue 18 days",
  },
  {
    id: "PRI-003",
    color: "warning",
    icon: "Wrench",
    title: "Complete TRK-1010 brake service",
    detail:
      "Scheduled for Nov 19 at Ibadan Service Centre. Parts already dispatched.",
    time: "In 1 day",
  },
  {
    id: "PRI-004",
    color: "success",
    icon: "ShieldCheck",
    title: "Approve 4 new driver licenses",
    detail:
      "Onboarding verification complete for 4 new drivers awaiting final approval.",
    time: "This week",
  },
];

// ---------------------------------------------------------------------------
// KPIs
// ---------------------------------------------------------------------------

export const kpis: Kpis = {
  totalTrucks: 128,
  onTheRoad: 98,
  activeDeliveries: 142,
  onTimeRate: 92.3,
  utilization: 81.7,
  operatingCost: "₦1.42B",
};

// ---------------------------------------------------------------------------
// Time-series chart data
// ---------------------------------------------------------------------------

export const monthly: MonthlyPoint[] = [
  { m: "Jan", revenue: 118, cost: 92 },
  { m: "Feb", revenue: 124, cost: 95 },
  { m: "Mar", revenue: 132, cost: 98 },
  { m: "Apr", revenue: 128, cost: 101 },
  { m: "May", revenue: 141, cost: 104 },
  { m: "Jun", revenue: 138, cost: 107 },
  { m: "Jul", revenue: 146, cost: 109 },
  { m: "Aug", revenue: 152, cost: 112 },
  { m: "Sep", revenue: 149, cost: 115 },
  { m: "Oct", revenue: 158, cost: 118 },
  { m: "Nov", revenue: 164, cost: 121 },
  { m: "Dec", revenue: 171, cost: 124 },
];

export const weekly: WeeklyPoint[] = [
  { day: "Mon", trips: 28, delays: 3 },
  { day: "Tue", trips: 32, delays: 2 },
  { day: "Wed", trips: 35, delays: 4 },
  { day: "Thu", trips: 30, delays: 5 },
  { day: "Fri", trips: 38, delays: 6 },
  { day: "Sat", trips: 22, delays: 1 },
  { day: "Sun", trips: 14, delays: 0 },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns the route object matching the given routeId, or undefined if not found.
 */
export function getRouteFor(routeId: string): Route | undefined {
  return routes.find((r) => r.id === routeId);
}

/**
 * Returns all incidents associated with the given routeId.
 */
export function getIncidentsForRoute(routeId: string): Incident[] {
  return incidents.filter((i) => i.routeId === routeId);
}
