import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { z } from "zod";
import type {
  createTruckSchema, updateTruckSchema, truckQuerySchema, truckIdSchema,
  updateTruckStatusSchema, createDriverSchema, updateDriverSchema, driverQuerySchema,
  createFleetManagerSchema, updateFleetManagerSchema, fmQuerySchema,
  assignDriverSchema, unassignDriverSchema, assignFmTrucksSchema,
  createTruckDocSchema, createDriverDocSchema, docQuerySchema, deleteDocSchema,
  createMaintSchema, updateMaintSchema, maintQuerySchema,
  createFuelSchema, fuelQuerySchema,
  createIncidentSchema, updateIncidentSchema, incidentQuerySchema,
} from "./fleet-schemas";

type Client = SupabaseClient<Database>;

function fail(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}
function unwrap<T>(data: T | null, error: { message: string } | null): T {
  fail(error);
  if (!data) throw new Error("Record not found");
  return data;
}

/* ============================ TRUCKS ============================ */

export async function readTrucks(supabase: Client, input: z.infer<typeof truckQuerySchema>) {
  let query = supabase
    .from("truck_profile")
    .select("*")
    .eq("organization_id", input.organizationId)
    .eq("archived", input.archived ?? false)
    .order("truck_number")
    .limit(input.limit ?? 200);
  if (input.offset) query = query.range(input.offset, input.offset + (input.limit ?? 200) - 1);
  if (input.status) query = query.eq("status", input.status);
  if (input.driverId) query = query.eq("driver_id", input.driverId);
  const { data, error } = await query;
  fail(error);
  if (input.search) {
    const q = input.search.toLowerCase();
    return (data ?? []).filter((t: Record<string, unknown>) =>
      String(t.truck_number ?? "").toLowerCase().includes(q) ||
      String(t.plate ?? "").toLowerCase().includes(q) ||
      String(t.tracking_number ?? "").toLowerCase().includes(q) ||
      String(t.model ?? "").toLowerCase().includes(q) ||
      String(t.driver_name ?? "").toLowerCase().includes(q)
    );
  }
  return data ?? [];
}

export async function readTruck(supabase: Client, input: z.infer<typeof truckIdSchema>) {
  const { data, error } = await supabase
    .from("truck_profile").select("*")
    .eq("id", input.id).eq("organization_id", input.organizationId).maybeSingle();
  return unwrap(data, error);
}

export async function createTruck(supabase: Client, actorId: string, input: z.infer<typeof createTruckSchema>) {
  const { data, error } = await supabase.from("trucks").insert({
    organization_id: input.organizationId, plate: input.plate, model: input.model,
    manufacturer: input.manufacturer, vehicle_type: input.vehicleType, capacity_kg: input.capacityKg,
    year: input.year, vin: input.vin, tracking_number: input.trackingNumber,
    driver_id: input.driverId ?? null, fleet_manager_id: input.fleetManagerId ?? null,
    status: input.status ?? "Idle", fuel_level: input.fuelLevel ?? 0,
    odometer_km: input.odometerKm ?? 0, location: input.location,
    engine_health: input.engineHealth ?? 100, gps_status: input.gpsStatus ?? "Offline",
    last_service_date: input.lastServiceDate, tracking_source: input.trackingSource ?? "GPS",
    created_by: actorId,
  } as never).select("*").single();
  return unwrap(data, error);
}

export async function updateTruck(supabase: Client, _actorId: string, input: z.infer<typeof updateTruckSchema>) {
  const u: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const map: Record<string, string> = {
    plate: "plate", model: "model", manufacturer: "manufacturer", vehicleType: "vehicle_type",
    capacityKg: "capacity_kg", year: "year", vin: "vin", trackingNumber: "tracking_number",
    status: "status", fuelLevel: "fuel_level", odometerKm: "odometer_km", location: "location",
    engineHealth: "engine_health", gpsStatus: "gps_status", lastServiceDate: "last_service_date",
    trackingSource: "tracking_source", archived: "archived",
  };
  for (const [k, col] of Object.entries(map)) {
    if (input[k as keyof typeof input] !== undefined) u[col] = input[k as keyof typeof input];
  }
  const { data, error } = await supabase.from("trucks").update(u as never)
    .eq("id", input.id).eq("organization_id", input.organizationId).select("*").single();
  return unwrap(data, error);
}

export async function updateTruckStatus(supabase: Client, _actorId: string, input: z.infer<typeof updateTruckStatusSchema>) {
  const { data, error } = await supabase.from("trucks")
    .update({ status: input.status, updated_at: new Date().toISOString() })
    .eq("id", input.id).eq("organization_id", input.organizationId).select("*").single();
  return unwrap(data, error);
}

export async function deleteTruck(supabase: Client, input: z.infer<typeof truckIdSchema>) {
  const { error } = await supabase.from("trucks").delete()
    .eq("id", input.id).eq("organization_id", input.organizationId);
  fail(error);
  return { ok: true };
}

export async function readFleetKpis(supabase: Client, organizationId: string) {
  const { data, error } = await supabase.rpc("fleet_kpis", { p_org_id: organizationId });
  fail(error);
  return data;
}

/* ============================ DRIVERS ============================ */

export async function readDrivers(supabase: Client, input: z.infer<typeof driverQuerySchema>) {
  let query = supabase.from("driver_performance").select("*")
    .eq("organization_id", input.organizationId).eq("archived", input.archived ?? false)
    .order("driver_number").limit(input.limit ?? 200);
  if (input.status) query = query.eq("status", input.status);
  if (input.truckId) query = query.eq("truck_id", input.truckId);
  const { data, error } = await query;
  fail(error);
  if (input.search) {
    const q = input.search.toLowerCase();
    return (data ?? []).filter((d: Record<string, unknown>) =>
      String(d.driver_number ?? "").toLowerCase().includes(q) ||
      String(d.name ?? "").toLowerCase().includes(q) ||
      String(d.license_number ?? "").toLowerCase().includes(q)
    );
  }
  return data ?? [];
}

export async function readDriver(supabase: Client, organizationId: string, id: string) {
  const { data, error } = await supabase.from("driver_performance").select("*")
    .eq("id", id).eq("organization_id", organizationId).maybeSingle();
  return unwrap(data, error);
}

export async function createDriver(supabase: Client, actorId: string, input: z.infer<typeof createDriverSchema>) {
  const { data, error } = await supabase.from("drivers").insert({
    organization_id: input.organizationId, name: input.name, phone: input.phone,
    email: input.email, address: input.address, emergency_contact: input.emergencyContact,
    license_number: input.licenseNumber, license_class: input.licenseClass,
    license_expiry: input.licenseExpiry, medical_expiry: input.medicalExpiry,
    safety_score: input.safetyScore ?? 100, risk_level: input.riskLevel ?? "Low",
    status: input.status ?? "Active", truck_id: input.truckId ?? null,
    fleet_manager_id: input.fleetManagerId ?? null, violations: input.violations ?? 0,
    trainings: input.trainings ?? 0, created_by: actorId,
  } as never).select("*").single();
  return unwrap(data, error);
}

export async function updateDriver(supabase: Client, _actorId: string, input: z.infer<typeof updateDriverSchema>) {
  const u: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const map: Record<string, string> = {
    name: "name", phone: "phone", email: "email", address: "address",
    emergencyContact: "emergency_contact", licenseNumber: "license_number",
    licenseClass: "license_class", licenseExpiry: "license_expiry",
    medicalExpiry: "medical_expiry", safetyScore: "safety_score", riskLevel: "risk_level",
    status: "status", truckId: "truck_id", fleetManagerId: "fleet_manager_id",
    violations: "violations", trainings: "trainings", archived: "archived",
  };
  for (const [k, col] of Object.entries(map)) {
    if (input[k as keyof typeof input] !== undefined) u[col] = input[k as keyof typeof input];
  }
  const { data, error } = await supabase.from("drivers").update(u as never)
    .eq("id", input.id).eq("organization_id", input.organizationId).select("*").single();
  return unwrap(data, error);
}

/* ====================== FLEET MANAGERS ====================== */

export async function readFleetManagers(supabase: Client, input: z.infer<typeof fmQuerySchema>) {
  let query = supabase.from("fleet_manager_performance").select("*")
    .eq("organization_id", input.organizationId).eq("archived", input.archived ?? false)
    .order("name").limit(input.limit ?? 200);
  if (input.status) query = query.eq("status", input.status);
  const { data, error } = await query;
  fail(error);
  if (input.search) {
    const q = input.search.toLowerCase();
    return (data ?? []).filter((m: Record<string, unknown>) =>
      String(m.name ?? "").toLowerCase().includes(q) ||
      String(m.employee_id ?? "").toLowerCase().includes(q) ||
      String(m.email ?? "").toLowerCase().includes(q)
    );
  }
  return data ?? [];
}

export async function readFleetManager(supabase: Client, organizationId: string, id: string) {
  const { data, error } = await supabase.from("fleet_manager_performance").select("*")
    .eq("id", id).eq("organization_id", organizationId).maybeSingle();
  return unwrap(data, error);
}

export async function createFleetManager(supabase: Client, actorId: string, input: z.infer<typeof createFleetManagerSchema>) {
  const { data, error } = await supabase.from("fleet_managers").insert({
    organization_id: input.organizationId, name: input.name, employee_id: input.employeeId,
    role: input.role ?? "Fleet Manager", department: input.department, phone: input.phone,
    email: input.email, photo: input.photo, status: input.status ?? "Active",
    date_joined: input.dateJoined ?? new Date().toISOString().slice(0, 10),
    user_id: input.userId ?? null, created_by: actorId,
  } as never).select("*").single();
  return unwrap(data, error);
}

export async function updateFleetManager(supabase: Client, _actorId: string, input: z.infer<typeof updateFleetManagerSchema>) {
  const u: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const map: Record<string, string> = {
    name: "name", employeeId: "employee_id", role: "role", department: "department",
    phone: "phone", email: "email", photo: "photo", status: "status",
    dateJoined: "date_joined", archived: "archived",
  };
  for (const [k, col] of Object.entries(map)) {
    if (input[k as keyof typeof input] !== undefined) u[col] = input[k as keyof typeof input];
  }
  const { data, error } = await supabase.from("fleet_managers").update(u as never)
    .eq("id", input.id).eq("organization_id", input.organizationId).select("*").single();
  return unwrap(data, error);
}

/* ====================== ASSIGNMENTS ====================== */

export async function assignDriverToTruck(supabase: Client, actorId: string, input: z.infer<typeof assignDriverSchema>) {
  await supabase.from("truck_assignments").update({ status: "Completed", updated_at: new Date().toISOString() })
    .eq("truck_id", input.truckId).eq("organization_id", input.organizationId).eq("status", "Active");
  await supabase.from("truck_assignments").update({ status: "Completed", updated_at: new Date().toISOString() })
    .eq("driver_id", input.driverId).eq("organization_id", input.organizationId).eq("status", "Active");
  const { data, error } = await supabase.from("truck_assignments").insert({
    organization_id: input.organizationId, truck_id: input.truckId, driver_id: input.driverId,
    fleet_manager_id: input.fleetManagerId ?? null, status: "Active", assigned_by: actorId,
  } as never).select("*").single();
  return unwrap(data, error);
}

export async function unassignDriverFromTruck(supabase: Client, input: z.infer<typeof unassignDriverSchema>) {
  const { error } = await supabase.from("truck_assignments")
    .update({ status: "Completed", updated_at: new Date().toISOString() })
    .eq("truck_id", input.truckId).eq("organization_id", input.organizationId).eq("status", "Active");
  fail(error);
  return { ok: true };
}

export async function assignFleetManagerTrucks(supabase: Client, actorId: string, input: z.infer<typeof assignFmTrucksSchema>) {
  await supabase.from("fleet_manager_assignments").update({ status: "Completed", updated_at: new Date().toISOString() })
    .eq("fleet_manager_id", input.fleetManagerId).eq("organization_id", input.organizationId).eq("status", "Active");
  if (input.truckIds.length > 0) {
    await supabase.from("fleet_manager_assignments").update({ status: "Completed", updated_at: new Date().toISOString() })
      .in("truck_id", input.truckIds).neq("fleet_manager_id", input.fleetManagerId)
      .eq("organization_id", input.organizationId).eq("status", "Active");
    const rows = input.truckIds.map((truckId) => ({
      organization_id: input.organizationId, fleet_manager_id: input.fleetManagerId,
      truck_id: truckId, status: "Active" as const, assigned_by: actorId,
    }));
    const { error } = await supabase.from("fleet_manager_assignments").insert(rows);
    fail(error);
    await supabase.from("trucks").update({ fleet_manager_id: input.fleetManagerId, updated_at: new Date().toISOString() })
      .in("id", input.truckIds).eq("organization_id", input.organizationId);
  }
  return { ok: true };
}

export async function readFleetManagerTrucks(supabase: Client, organizationId: string, fleetManagerId: string) {
  const { data, error } = await supabase.from("fleet_manager_assignments")
    .select("truck_id, trucks!inner(truck_number, plate, model, status, driver_id)")
    .eq("organization_id", organizationId).eq("fleet_manager_id", fleetManagerId).eq("status", "Active");
  fail(error);
  return data ?? [];
}

/* ====================== DOCUMENTS ====================== */

export async function readTruckDocuments(supabase: Client, input: z.infer<typeof docQuerySchema>) {
  let query = supabase.from("truck_documents").select("*")
    .eq("organization_id", input.organizationId).order("created_at", { ascending: false }).limit(input.limit ?? 200);
  if (input.truckId) query = query.eq("truck_id", input.truckId);
  const { data, error } = await query;
  fail(error);
  return data ?? [];
}

export async function createTruckDocument(supabase: Client, actorId: string, input: z.infer<typeof createTruckDocSchema>) {
  const { data, error } = await supabase.from("truck_documents").insert({
    organization_id: input.organizationId, truck_id: input.truckId, name: input.name,
    document_type: input.documentType, file_path: input.filePath, file_size: input.fileSize,
    mime_type: input.mimeType, expiry_date: input.expiryDate, version: input.version ?? "1.0",
    uploaded_by: actorId,
  } as never).select("*").single();
  return unwrap(data, error);
}

export async function readDriverDocuments(supabase: Client, input: z.infer<typeof docQuerySchema>) {
  let query = supabase.from("driver_documents").select("*")
    .eq("organization_id", input.organizationId).order("created_at", { ascending: false }).limit(input.limit ?? 200);
  if (input.driverId) query = query.eq("driver_id", input.driverId);
  const { data, error } = await query;
  fail(error);
  return data ?? [];
}

export async function createDriverDocument(supabase: Client, actorId: string, input: z.infer<typeof createDriverDocSchema>) {
  const { data, error } = await supabase.from("driver_documents").insert({
    organization_id: input.organizationId, driver_id: input.driverId, name: input.name,
    document_type: input.documentType, file_path: input.filePath, file_size: input.fileSize,
    mime_type: input.mimeType, expiry_date: input.expiryDate, version: input.version ?? "1.0",
    uploaded_by: actorId,
  } as never).select("*").single();
  return unwrap(data, error);
}

export async function deleteDocument(supabase: Client, input: z.infer<typeof deleteDocSchema>) {
  const table = input.kind === "truck" ? "truck_documents" : "driver_documents";
  const { error } = await supabase.from(table).delete().eq("id", input.id).eq("organization_id", input.organizationId);
  fail(error);
  return { ok: true };
}

/* ====================== MAINTENANCE ====================== */

export async function readMaintenanceRecords(supabase: Client, input: z.infer<typeof maintQuerySchema>) {
  let query = supabase.from("truck_maintenance").select("*")
    .eq("organization_id", input.organizationId).order("created_at", { ascending: false }).limit(input.limit ?? 200);
  if (input.truckId) query = query.eq("truck_id", input.truckId);
  if (input.status) query = query.eq("status", input.status);
  const { data, error } = await query;
  fail(error);
  return data ?? [];
}

export async function createMaintenance(supabase: Client, actorId: string, input: z.infer<typeof createMaintSchema>) {
  const { data, error } = await supabase.from("truck_maintenance").insert({
    organization_id: input.organizationId, truck_id: input.truckId, service: input.service,
    type: input.type ?? "Routine", priority: input.priority, cost: input.cost ?? 0,
    status: input.status ?? "Scheduled", performed_by: input.performedBy, work_done: input.workDone,
    due_date: input.dueDate, service_date: input.serviceDate, next_service_date: input.nextServiceDate,
    created_by: actorId,
  } as never).select("*").single();
  return unwrap(data, error);
}

export async function updateMaintenance(supabase: Client, _actorId: string, input: z.infer<typeof updateMaintSchema>) {
  const u: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const map: Record<string, string> = {
    service: "service", type: "type", priority: "priority", cost: "cost", status: "status",
    performedBy: "performed_by", workDone: "work_done", dueDate: "due_date",
    serviceDate: "service_date", nextServiceDate: "next_service_date",
  };
  for (const [k, col] of Object.entries(map)) {
    if (input[k as keyof typeof input] !== undefined) u[col] = input[k as keyof typeof input];
  }
  const { data, error } = await supabase.from("truck_maintenance").update(u as never)
    .eq("id", input.id).eq("organization_id", input.organizationId).select("*").single();
  return unwrap(data, error);
}

/* ====================== FUEL ====================== */

export async function readFuelRecords(supabase: Client, input: z.infer<typeof fuelQuerySchema>) {
  let query = supabase.from("truck_fuel").select("*")
    .eq("organization_id", input.organizationId).order("transaction_date", { ascending: false }).limit(input.limit ?? 200);
  if (input.truckId) query = query.eq("truck_id", input.truckId);
  if (input.driverId) query = query.eq("driver_id", input.driverId);
  const { data, error } = await query;
  fail(error);
  return data ?? [];
}

export async function createFuel(supabase: Client, actorId: string, input: z.infer<typeof createFuelSchema>) {
  const { data, error } = await supabase.from("truck_fuel").insert({
    organization_id: input.organizationId, truck_id: input.truckId, driver_id: input.driverId ?? null,
    trip_id: input.tripId ?? null, fuel_type: input.fuelType ?? "Diesel", quantity: input.quantity,
    unit_price: input.unitPrice, location: input.location, transaction_type: input.transactionType,
    assignment_type: input.assignmentType, status: input.status ?? "Approved", note: input.note,
    recorded_by: actorId, transaction_date: input.transactionDate ?? new Date().toISOString(),
  } as never).select("*").single();
  return unwrap(data, error);
}

/* ====================== INCIDENTS ====================== */

export async function readIncidents(supabase: Client, input: z.infer<typeof incidentQuerySchema>) {
  let query = supabase.from("incidents").select("*")
    .eq("organization_id", input.organizationId).order("incident_date", { ascending: false }).limit(input.limit ?? 200);
  if (input.truckId) query = query.eq("truck_id", input.truckId);
  if (input.driverId) query = query.eq("driver_id", input.driverId);
  if (input.status) query = query.eq("status", input.status);
  const { data, error } = await query;
  fail(error);
  return data ?? [];
}

export async function createIncident(supabase: Client, actorId: string, input: z.infer<typeof createIncidentSchema>) {
  const { data, error } = await supabase.from("incidents").insert({
    organization_id: input.organizationId, type: input.type, driver_id: input.driverId ?? null,
    truck_id: input.truckId ?? null, trip_id: input.tripId ?? null, client_id: input.clientId ?? null,
    severity: input.severity ?? "Low", status: input.status ?? "Open",
    incident_date: input.incidentDate ?? new Date().toISOString(), location: input.location,
    root_cause: input.rootCause, description: input.description, reported_by: actorId,
    investigator: input.investigator, corrective_actions: input.correctiveActions,
    est_delay_min: input.estDelayMin ?? 0, est_financial_impact: input.estFinancialImpact ?? 0,
    photos: input.photos ?? [], documents: input.documents ?? [],
  } as never).select("*").single();
  return unwrap(data, error);
}

export async function updateIncident(supabase: Client, _actorId: string, input: z.infer<typeof updateIncidentSchema>) {
  const u: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const map: Record<string, string> = {
    type: "type", severity: "severity", status: "status", location: "location",
    rootCause: "root_cause", description: "description", investigator: "investigator",
    correctiveActions: "corrective_actions", estDelayMin: "est_delay_min",
    estFinancialImpact: "est_financial_impact",
  };
  for (const [k, col] of Object.entries(map)) {
    if (input[k as keyof typeof input] !== undefined) u[col] = input[k as keyof typeof input];
  }
  const { data, error } = await supabase.from("incidents").update(u as never)
    .eq("id", input.id).eq("organization_id", input.organizationId).select("*").single();
  return unwrap(data, error);
}

/* ====================== HISTORY ====================== */

export async function readTruckHistory(supabase: Client, organizationId: string, truckId: string, limit = 50) {
  const { data, error } = await supabase.from("truck_history").select("*")
    .eq("organization_id", organizationId).eq("truck_id", truckId)
    .order("created_at", { ascending: false }).limit(limit);
  fail(error);
  return data ?? [];
}

export async function readDriverHistory(supabase: Client, organizationId: string, driverId: string, limit = 50) {
  const { data, error } = await supabase.from("driver_history").select("*")
    .eq("organization_id", organizationId).eq("driver_id", driverId)
    .order("created_at", { ascending: false }).limit(limit);
  fail(error);
  return data ?? [];
}

/* ====================== SUMMARY VIEWS ====================== */

export async function readTruckHealthSummary(supabase: Client, organizationId: string, truckId: string) {
  const { data, error } = await supabase.from("truck_health_summary").select("*")
    .eq("organization_id", organizationId).eq("id", truckId).maybeSingle();
  fail(error);
  return data;
}

export async function readTruckMaintenanceSummary(supabase: Client, _orgId: string, truckId: string) {
  const { data, error } = await supabase.from("truck_maintenance_summary").select("*")
    .eq("truck_id", truckId).maybeSingle();
  fail(error);
  return data;
}

export async function readTruckFuelSummary(supabase: Client, _orgId: string, truckId: string) {
  const { data, error } = await supabase.from("truck_fuel_summary").select("*")
    .eq("truck_id", truckId).maybeSingle();
  fail(error);
  return data;
}

export async function readTruckIncidentSummary(supabase: Client, _orgId: string, truckId: string) {
  const { data, error } = await supabase.from("truck_incident_summary").select("*")
    .eq("truck_id", truckId).maybeSingle();
  fail(error);
  return data;
}

/* ====================== UTILISATION ====================== */

export async function readTruckUtilisation(supabase: Client, organizationId: string, truckId: string, limit = 30) {
  const { data, error } = await supabase.from("truck_utilisation").select("*")
    .eq("organization_id", organizationId).eq("truck_id", truckId)
    .order("snapshot_date", { ascending: false }).limit(limit);
  fail(error);
  return data ?? [];
}
