/**
 * Live data layer.
 *
 * Fetches the tenant's real Fleet / Drivers / Operations records through the
 * TanStack server functions and hydrates the shared in-memory collections that
 * every existing screen already reads from (`@/lib/mock-data`). This keeps the
 * approved UI completely untouched while the data becomes fully backend driven.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as mock from "@/lib/mock-data";
import { useMyOrganisations } from "./use-tenant";
import {
  listTrucks,
  listDrivers,
  listFleetManagers,
  listMaintenanceRecords,
  listFuelRecords,
  listIncidents,
  listTruckDocuments,
  listDriverDocuments,
} from "./fleet.functions";
import { listTrips, listClients, listRoutes } from "./operations.functions";

type Row = Record<string, any>;

/* ------------------------------------------------------------------ */
/* Active organisation                                                 */
/* ------------------------------------------------------------------ */

const OrgCtx = createContext<{ organizationId: string | null; ready: boolean }>({
  organizationId: null,
  ready: false,
});

export function useActiveOrganisation() {
  return useContext(OrgCtx);
}

/** Organisation id of the signed-in user's primary organisation. */
export function useActiveOrganisationId() {
  return useActiveOrganisation().organizationId;
}

/* ------------------------------------------------------------------ */
/* Mapping helpers                                                     */
/* ------------------------------------------------------------------ */

function replace<T>(target: T[], next: T[]) {
  target.length = 0;
  target.push(...next);
}

function shortDate(value: unknown): string {
  if (!value) return "";
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? String(value) : d.toISOString().slice(0, 10);
}

function etaLabel(value: unknown): string {
  if (!value) return "—";
  const target = new Date(String(value)).getTime();
  if (Number.isNaN(target)) return String(value);
  const diff = Math.max(0, target - Date.now());
  const hours = Math.floor(diff / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  return `${hours}h ${mins}m`;
}

function docStatus(expiry: unknown): mock.DocumentRow["status"] {
  if (!expiry) return "Valid";
  const d = new Date(String(expiry)).getTime();
  if (Number.isNaN(d)) return "Valid";
  const days = (d - Date.now()) / 86_400_000;
  if (days < 0) return "Expired";
  if (days <= 30) return "Expiring";
  return "Valid";
}

function hydrate(data: {
  trucks: Row[];
  drivers: Row[];
  fleetManagers: Row[];
  trips: Row[];
  clients: Row[];
  routes: Row[];
  incidents: Row[];
  maintenance: Row[];
  fuel: Row[];
  truckDocs: Row[];
  driverDocs: Row[];
}) {
  const truckNumberById = new Map<string, string>();
  data.trucks.forEach((t) => truckNumberById.set(String(t.id), String(t.truck_number)));
  const driverNameById = new Map<string, string>();
  const driverNumberById = new Map<string, string>();
  data.drivers.forEach((d) => {
    driverNameById.set(String(d.id), String(d.name));
    driverNumberById.set(String(d.id), String(d.driver_number));
  });
  const clientNameById = new Map<string, string>();
  data.clients.forEach((c) => clientNameById.set(String(c.id), String(c.name)));
  const routeNumberById = new Map<string, string>();
  data.routes.forEach((r) => routeNumberById.set(String(r.id), String(r.route_number)));
  const tripNumberById = new Map<string, string>();
  data.trips.forEach((t) => tripNumberById.set(String(t.id), String(t.trip_number)));

  /* Trucks */
  replace<mock.Truck>(
    mock.trucks,
    data.trucks.map((t) => ({
      id: String(t.truck_number),
      plate: String(t.plate ?? ""),
      model: String(t.model ?? ""),
      driver: String(t.driver_name ?? "Unassigned"),
      status: (t.status ?? "Idle") as mock.TruckStatus,
      fuel: Number(t.fuel_level ?? 0),
      odometer: Number(t.odometer_km ?? 0),
      location: String(t.location ?? ""),
      route: String(t.route_number ?? ""),
      engineHealth: Number(t.engine_health ?? 0),
      gps: (t.gps_status ?? "Offline") as "Online" | "Offline",
      lastService: shortDate(t.last_service_date),
      trackingNumber: String(t.tracking_number ?? ""),
    })),
  );

  /* Drivers */
  replace<mock.Driver>(
    mock.drivers,
    data.drivers.map((d) => ({
      id: String(d.driver_number),
      name: String(d.name ?? ""),
      license: String(d.license_number ?? ""),
      licenseExpiry: shortDate(d.license_expiry),
      medicalExpiry: shortDate(d.medical_expiry),
      score: Number(d.safety_score ?? 0),
      risk: (d.risk_level ?? "Low") as mock.Driver["risk"],
      status: (d.status ?? "Active") as mock.Driver["status"],
      violations: Number(d.violations ?? 0),
      trainings: Number(d.trainings ?? 0),
      truck: String(d.truck_number ?? (d.truck_id ? truckNumberById.get(String(d.truck_id)) : "") ?? ""),
    })),
  );

  /* Fleet managers */
  const trucksByManager = new Map<string, string[]>();
  data.trucks.forEach((t) => {
    if (!t.fleet_manager_id) return;
    const key = String(t.fleet_manager_id);
    const list = trucksByManager.get(key) ?? [];
    list.push(String(t.truck_number));
    trucksByManager.set(key, list);
  });
  replace<mock.FleetManager>(
    mock.fleetManagers,
    data.fleetManagers.map((m) => ({
      id: String(m.employee_id),
      name: String(m.name ?? ""),
      employeeId: String(m.employee_id ?? ""),
      role: String(m.role ?? "Fleet Manager"),
      department: String(m.department ?? ""),
      phone: String(m.phone ?? ""),
      email: String(m.email ?? ""),
      photo: m.photo ?? undefined,
      status: (m.status === "Inactive" ? "Suspended" : m.status ?? "Active") as mock.FleetManager["status"],
      dateJoined: shortDate(m.date_joined),
      assignedTruckIds: trucksByManager.get(String(m.id)) ?? [],
    })),
  );

  /* Clients */
  replace<mock.Client>(
    mock.clients,
    data.clients.map((c) => ({
      id: String(c.client_number ?? c.id),
      name: String(c.name ?? ""),
      contact: String(c.contact_name ?? ""),
      phone: String(c.phone ?? ""),
      email: String(c.email ?? ""),
      address: String(c.address ?? ""),
      industry: String(c.industry ?? ""),
      since: shortDate(c.created_at),
      status: (c.status ?? "Active") as mock.Client["status"],
    })),
  );

  /* Routes */
  replace<mock.RouteEntity>(
    mock.routes,
    data.routes.map((r) => ({
      id: String(r.route_number ?? r.id),
      name: String(r.name ?? ""),
      origin: String(r.origin ?? ""),
      destination: String(r.destination ?? ""),
      distanceKm: Number(r.distance_km ?? 0),
      createdAt: shortDate(r.created_at),
    })),
  );

  /* Trips */
  replace<mock.Trip>(
    mock.trips,
    data.trips.map((t) => ({
      id: String(t.trip_number),
      customer: String(t.clients?.name ?? clientNameById.get(String(t.client_id)) ?? ""),
      origin: String(t.origin ?? ""),
      destination: String(t.destination ?? ""),
      driver: String(t.drivers?.name ?? driverNameById.get(String(t.driver_id)) ?? "Unassigned"),
      truck: String(t.trucks?.truck_number ?? truckNumberById.get(String(t.truck_id)) ?? ""),
      status: (t.status ?? "Scheduled") as mock.TripStatus,
      progress: Number(t.progress ?? 0),
      eta: etaLabel(t.eta),
      stops: Number(t.stops ?? 1),
      distance: Number(t.distance_km ?? 0),
      priority: (t.priority ?? "Medium") as mock.Priority,
    })),
  );

  /* Incidents */
  replace<mock.Incident>(
    mock.incidents,
    data.incidents.map((r) => ({
      id: String(r.incident_number),
      type: (r.type ?? "Other") as mock.IncidentType,
      driver: String(r.drivers?.name ?? driverNameById.get(String(r.driver_id)) ?? ""),
      truck: String(r.trucks?.truck_number ?? truckNumberById.get(String(r.truck_id)) ?? ""),
      trip: r.trip_id ? tripNumberById.get(String(r.trip_id)) : undefined,
      client: r.client_id ? clientNameById.get(String(r.client_id)) : undefined,
      severity: (r.severity ?? "Low") as mock.Incident["severity"],
      status: (r.status ?? "Open") as mock.Incident["status"],
      date: shortDate(r.incident_date),
      location: String(r.location ?? ""),
      rootCause: String(r.root_cause ?? ""),
      description: String(r.description ?? ""),
      reportedBy: String(r.reported_by_name ?? "Operations"),
      investigator: String(r.investigator ?? ""),
      correctiveActions: String(r.corrective_actions ?? ""),
      estDelayMin: Number(r.est_delay_min ?? 0),
      estFinancialImpact: Number(r.est_financial_impact ?? 0),
      photos: (r.photos ?? []) as string[],
      documents: (r.documents ?? []) as string[],
    })),
  );

  /* Maintenance */
  replace<mock.MaintenanceRecord>(
    mock.maintenanceRecords,
    data.maintenance.map((m, i) => ({
      id: `MNT-${800 + i}`,
      truck: String(m.trucks?.truck_number ?? truckNumberById.get(String(m.truck_id)) ?? ""),
      service: String(m.service ?? ""),
      type: (m.type ?? "Routine") as mock.MaintenanceRecord["type"],
      dueDate: shortDate(m.due_date),
      priority: (m.priority ?? "Medium") as mock.MaintenanceRecord["priority"],
      cost: Number(m.cost ?? 0),
      status: (m.status ?? "Scheduled") as mock.MaintenanceRecord["status"],
      performedBy: String(m.performed_by ?? ""),
      workDone: String(m.work_done ?? ""),
      nextService: m.next_service_date ? `Next: ${shortDate(m.next_service_date)}` : "",
      date: shortDate(m.service_date ?? m.created_at),
    })),
  );

  /* Fuel */
  replace<mock.FuelTransaction>(
    mock.fuelTransactions,
    data.fuel.map((f, i) => ({
      id: `FA-2026-${1240 + i}`,
      date: shortDate(f.transaction_date),
      type: (f.transaction_type === "Purchase" ? "Purchase" : "Issue") as mock.FuelTransaction["type"],
      truck: String(f.trucks?.truck_number ?? truckNumberById.get(String(f.truck_id)) ?? ""),
      driver: String(f.drivers?.name ?? driverNameById.get(String(f.driver_id)) ?? ""),
      fuelType: (f.fuel_type === "Petrol" ? "Petrol" : "Diesel") as mock.FuelTransaction["fuelType"],
      quantity: Number(f.quantity ?? 0),
      unitPrice: Number(f.unit_price ?? 0),
      amount: Number(f.total_amount ?? Number(f.quantity ?? 0) * Number(f.unit_price ?? 0)),
      location: String(f.location ?? ""),
      recordedBy: "Operations",
      trip: f.trip_id ? tripNumberById.get(String(f.trip_id)) : undefined,
      status: (f.status === "Pending" ? "Pending" : "Issued") as mock.FuelTransaction["status"],
      assignmentType: (f.assignment_type === "General Use" ? "General Use" : "Trip") as mock.FuelTransaction["assignmentType"],
      note: f.note ?? undefined,
    })),
  );

  /* Documents (truck + driver registries combined) */
  replace<mock.DocumentRow>(mock.documents, [
    ...data.truckDocs.map((d) => ({
      id: String(d.id).slice(0, 8).toUpperCase(),
      name: String(d.name ?? ""),
      type: String(d.document_type ?? ""),
      owner: String(truckNumberById.get(String(d.truck_id)) ?? ""),
      expiry: d.expiry_date ? shortDate(d.expiry_date) : undefined,
      status: docStatus(d.expiry_date),
      version: String(d.version ?? "v1.0"),
    })),
    ...data.driverDocs.map((d) => ({
      id: String(d.id).slice(0, 8).toUpperCase(),
      name: String(d.name ?? ""),
      type: String(d.document_type ?? ""),
      owner: String(driverNameById.get(String(d.driver_id)) ?? ""),
      expiry: d.expiry_date ? shortDate(d.expiry_date) : undefined,
      status: docStatus(d.expiry_date),
      version: String(d.version ?? "v1.0"),
    })),
  ]);

  /* Trip fuel history (per delivered trip snapshots) */
  replace<mock.TripFuelSnapshot>(
    mock.tripFuelHistory,
    data.trips
      .filter((t) => Number(t.fuel_assigned_l ?? 0) > 0 && Number(t.distance_km ?? 0) > 0)
      .map((t) => {
        const assignedFuelL = Number(t.fuel_assigned_l ?? 0);
        const distanceKm = Number(t.distance_km ?? 0);
        return {
          tripId: String(t.trip_number),
          assignedFuelL,
          fuelCostNGN: Number(t.fuel_cost ?? 0),
          distanceKm,
          litersPerKm: Math.round((assignedFuelL / distanceKm) * 1000) / 1000,
          routeId: t.route_id ? routeNumberById.get(String(t.route_id)) : undefined,
        };
      }),
  );
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export function FleetDataProvider({ children }: { children: ReactNode }) {
  const orgs = useMyOrganisations();
  const organizationId = useMemo(() => {
    const list = (orgs.data ?? []) as Row[];
    if (!list.length) return null;
    return String(list[0]?.organization_id ?? list[0]?.id ?? "") || null;
  }, [orgs.data]);

  const fetchTrucks = useServerFn(listTrucks);
  const fetchDrivers = useServerFn(listDrivers);
  const fetchManagers = useServerFn(listFleetManagers);
  const fetchTrips = useServerFn(listTrips);
  const fetchClients = useServerFn(listClients);
  const fetchRoutes = useServerFn(listRoutes);
  const fetchIncidents = useServerFn(listIncidents);
  const fetchMaintenance = useServerFn(listMaintenanceRecords);
  const fetchFuel = useServerFn(listFuelRecords);
  const fetchTruckDocs = useServerFn(listTruckDocuments);
  const fetchDriverDocs = useServerFn(listDriverDocuments);

  const query = useQuery({
    queryKey: ["fleet-live-data", organizationId],
    enabled: Boolean(organizationId),
    queryFn: async () => {
      const data = { organizationId: organizationId! };
      const [
        trucks,
        drivers,
        fleetManagers,
        trips,
        clients,
        routes,
        incidents,
        maintenance,
        fuel,
        truckDocs,
        driverDocs,
      ] = await Promise.all([
        fetchTrucks({ data }),
        fetchDrivers({ data }),
        fetchManagers({ data }),
        fetchTrips({ data }),
        fetchClients({ data }),
        fetchRoutes({ data }),
        fetchIncidents({ data }),
        fetchMaintenance({ data }),
        fetchFuel({ data }),
        fetchTruckDocs({ data }),
        fetchDriverDocs({ data }),
      ]);
      return {
        trucks: trucks as Row[],
        drivers: drivers as Row[],
        fleetManagers: fleetManagers as Row[],
        trips: trips as Row[],
        clients: clients as Row[],
        routes: routes as Row[],
        incidents: incidents as Row[],
        maintenance: maintenance as Row[],
        fuel: fuel as Row[],
        truckDocs: truckDocs as Row[],
        driverDocs: driverDocs as Row[],
      };
    },
  });

  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!query.data) return;
    hydrate(query.data);
    setVersion((v) => v + 1);
  }, [query.data]);

  const value = useMemo(
    () => ({ organizationId, ready: version > 0 }),
    [organizationId, version],
  );

  return <OrgCtx.Provider value={value}>{children}</OrgCtx.Provider>;
}
