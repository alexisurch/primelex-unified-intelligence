import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { z } from "zod";
import type {
  createClientSchema, updateClientSchema, clientQuerySchema,
  createClientContactSchema, deleteClientContactSchema,
  createRouteSchema, updateRouteSchema, routeQuerySchema,
  createTripSchema, updateTripSchema, tripQuerySchema,
  updateTripStatusSchema, updateTripETASchema,
  createTripDocSchema, tripDocQuerySchema,
  createTripCostSchema, tripCostQuerySchema,
  createTripDelaySchema, tripDelayQuerySchema, tripTimelineQuerySchema,
} from "./operations-schemas";

type Client = SupabaseClient<Database>;

function fail(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}
function unwrap<T>(data: T | null, error: { message: string } | null): T {
  fail(error);
  if (!data) throw new Error("Record not found");
  return data;
}

/* ============================ CLIENTS ============================ */

export async function readClients(supabase: Client, input: z.infer<typeof clientQuerySchema>) {
  let query = supabase.from("client_statistics").select("*")
    .eq("organization_id", input.organizationId).eq("archived", input.archived ?? false)
    .order("name").limit(input.limit ?? 200);
  if (input.status) query = query.eq("status", input.status);
  const { data, error } = await query;
  fail(error);
  if (input.search) {
    const q = input.search.toLowerCase();
    return (data ?? []).filter((c: Record<string, unknown>) =>
      String(c.client_number ?? "").toLowerCase().includes(q) ||
      String(c.name ?? "").toLowerCase().includes(q) ||
      String(c.contact_name ?? "").toLowerCase().includes(q) ||
      String(c.email ?? "").toLowerCase().includes(q)
    );
  }
  return data ?? [];
}

export async function readClient(supabase: Client, organizationId: string, id: string) {
  const { data, error } = await supabase.from("client_statistics").select("*")
    .eq("id", id).eq("organization_id", organizationId).maybeSingle();
  return unwrap(data, error);
}

export async function createClient(supabase: Client, actorId: string, input: z.infer<typeof createClientSchema>) {
  const { data, error } = await supabase.from("clients").insert({
    organization_id: input.organizationId, name: input.name, contact_name: input.contactName,
    phone: input.phone, email: input.email, address: input.address, industry: input.industry,
    status: input.status ?? "Active", created_by: actorId,
  }).select("*").single();
  return unwrap(data, error);
}

export async function updateClient(supabase: Client, _actorId: string, input: z.infer<typeof updateClientSchema>) {
  const u: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const map: Record<string, string> = {
    name: "name", contactName: "contact_name", phone: "phone", email: "email",
    address: "address", industry: "industry", status: "status", archived: "archived",
  };
  for (const [k, col] of Object.entries(map)) {
    if (input[k as keyof typeof input] !== undefined) u[col] = input[k as keyof typeof input];
  }
  const { data, error } = await supabase.from("clients").update(u)
    .eq("id", input.id).eq("organization_id", input.organizationId).select("*").single();
  return unwrap(data, error);
}

/* ====================== CLIENT CONTACTS ====================== */

export async function readClientContacts(supabase: Client, organizationId: string, clientId: string) {
  const { data, error } = await supabase.from("client_contacts").select("*")
    .eq("organization_id", organizationId).eq("client_id", clientId).order("created_at");
  fail(error);
  return data ?? [];
}

export async function createClientContact(supabase: Client, _actorId: string, input: z.infer<typeof createClientContactSchema>) {
  const { data, error } = await supabase.from("client_contacts").insert({
    organization_id: input.organizationId, client_id: input.clientId, name: input.name,
    role: input.role, phone: input.phone, email: input.email, is_primary: input.isPrimary ?? false,
  }).select("*").single();
  return unwrap(data, error);
}

export async function deleteClientContact(supabase: Client, input: z.infer<typeof deleteClientContactSchema>) {
  const { error } = await supabase.from("client_contacts").delete()
    .eq("id", input.id).eq("organization_id", input.organizationId);
  fail(error);
  return { ok: true };
}

/* ============================ ROUTES ============================ */

export async function readRoutes(supabase: Client, input: z.infer<typeof routeQuerySchema>) {
  let query = supabase.from("route_statistics").select("*")
    .eq("organization_id", input.organizationId).eq("archived", input.archived ?? false)
    .order("name").limit(input.limit ?? 200);
  const { data, error } = await query;
  fail(error);
  if (input.search) {
    const q = input.search.toLowerCase();
    return (data ?? []).filter((r: Record<string, unknown>) =>
      String(r.route_number ?? "").toLowerCase().includes(q) ||
      String(r.name ?? "").toLowerCase().includes(q) ||
      String(r.origin ?? "").toLowerCase().includes(q) ||
      String(r.destination ?? "").toLowerCase().includes(q)
    );
  }
  return data ?? [];
}

export async function readRoute(supabase: Client, organizationId: string, id: string) {
  const { data, error } = await supabase.from("route_statistics").select("*")
    .eq("id", id).eq("organization_id", organizationId).maybeSingle();
  return unwrap(data, error);
}

export async function createRoute(supabase: Client, actorId: string, input: z.infer<typeof createRouteSchema>) {
  const { data, error } = await supabase.from("routes").insert({
    organization_id: input.organizationId, name: input.name, origin: input.origin,
    destination: input.destination, distance_km: input.distanceKm,
    estimated_duration_min: input.estimatedDurationMin, road_type: input.roadType,
    terrain: input.terrain, fuel_estimate_l: input.fuelEstimateL, toll_cost: input.tollCost ?? 0,
    created_by: actorId,
  }).select("*").single();
  return unwrap(data, error);
}

export async function updateRoute(supabase: Client, _actorId: string, input: z.infer<typeof updateRouteSchema>) {
  const u: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const map: Record<string, string> = {
    name: "name", origin: "origin", destination: "destination", distanceKm: "distance_km",
    estimatedDurationMin: "estimated_duration_min", roadType: "road_type", terrain: "terrain",
    fuelEstimateL: "fuel_estimate_l", tollCost: "toll_cost", archived: "archived",
  };
  for (const [k, col] of Object.entries(map)) {
    if (input[k as keyof typeof input] !== undefined) u[col] = input[k as keyof typeof input];
  }
  const { data, error } = await supabase.from("routes").update(u)
    .eq("id", input.id).eq("organization_id", input.organizationId).select("*").single();
  return unwrap(data, error);
}

export async function findOrCreateRoute(
  supabase: Client, actorId: string, organizationId: string,
  origin: string, destination: string, distanceKm?: number,
) {
  const { data: existing } = await supabase.from("routes").select("*")
    .eq("organization_id", organizationId).eq("origin", origin).eq("destination", destination)
    .eq("archived", false).maybeSingle();
  if (existing) return existing;
  const name = `${origin} → ${destination}`;
  const { data, error } = await supabase.from("routes").insert({
    organization_id: organizationId, name, origin, destination, distance_km: distanceKm, created_by: actorId,
  }).select("*").single();
  return unwrap(data, error);
}

/* ============================ TRIPS ============================ */

export async function readTrips(supabase: Client, input: z.infer<typeof tripQuerySchema>) {
  let query = supabase.from("trips").select(
    "*, clients!inner(name), routes!left(name, route_number), trucks!left(truck_number, plate), drivers!left(name, driver_number)",
  ).eq("organization_id", input.organizationId)
    .order("created_at", { ascending: false }).limit(input.limit ?? 200);
  if (input.status) query = query.eq("status", input.status);
  if (input.clientId) query = query.eq("client_id", input.clientId);
  if (input.truckId) query = query.eq("truck_id", input.truckId);
  if (input.driverId) query = query.eq("driver_id", input.driverId);
  if (input.routeId) query = query.eq("route_id", input.routeId);
  const { data, error } = await query;
  fail(error);
  if (input.search) {
    const q = input.search.toLowerCase();
    return (data ?? []).filter((t: Record<string, unknown>) =>
      String(t.trip_number ?? "").toLowerCase().includes(q) ||
      String(t.origin ?? "").toLowerCase().includes(q) ||
      String(t.destination ?? "").toLowerCase().includes(q) ||
      String((t.clients as Record<string, unknown> | null)?.name ?? "").toLowerCase().includes(q) ||
      String((t.drivers as Record<string, unknown> | null)?.name ?? "").toLowerCase().includes(q) ||
      String((t.trucks as Record<string, unknown> | null)?.truck_number ?? "").toLowerCase().includes(q)
    );
  }
  return data ?? [];
}

export async function readTrip(supabase: Client, organizationId: string, id: string) {
  const { data, error } = await supabase.from("trips").select(
    "*, clients!left(name, contact_name, phone, email), routes!left(name, route_number, origin, destination, distance_km), trucks!left(truck_number, plate, model), drivers!left(name, driver_number, license_number), fleet_managers!left(name, employee_id)",
  ).eq("id", id).eq("organization_id", organizationId).maybeSingle();
  return unwrap(data, error);
}

export async function createTrip(supabase: Client, actorId: string, input: z.infer<typeof createTripSchema>) {
  let routeId = input.routeId ?? null;
  if (!routeId && input.origin && input.destination) {
    const route = await findOrCreateRoute(supabase, actorId, input.organizationId, input.origin, input.destination, input.distanceKm);
    routeId = route.id;
  }
  const { data, error } = await supabase.from("trips").insert({
    organization_id: input.organizationId, client_id: input.clientId ?? null, route_id: routeId,
    truck_id: input.truckId ?? null, driver_id: input.driverId ?? null,
    fleet_manager_id: input.fleetManagerId ?? null, origin: input.origin, destination: input.destination,
    status: input.status ?? "Scheduled", priority: input.priority ?? "Medium",
    progress: input.progress ?? 0, distance_km: input.distanceKm ?? 0, stops: input.stops ?? 0,
    cargo_description: input.cargoDescription, cargo_weight_kg: input.cargoWeightKg,
    eta: input.eta, departure_time: input.departureTime, tracking_mode: input.trackingMode ?? "manual",
    fuel_assigned_l: input.fuelAssignedL ?? 0, fuel_cost: input.fuelCost ?? 0,
    other_expenses: input.otherExpenses ?? 0, revenue: input.revenue ?? 0, created_by: actorId,
  }).select("*").single();
  return unwrap(data, error);
}

export async function updateTrip(supabase: Client, _actorId: string, input: z.infer<typeof updateTripSchema>) {
  const u: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const map: Record<string, string> = {
    clientId: "client_id", routeId: "route_id", truckId: "truck_id", driverId: "driver_id",
    fleetManagerId: "fleet_manager_id", origin: "origin", destination: "destination",
    status: "status", priority: "priority", progress: "progress", distanceKm: "distance_km",
    stops: "stops", cargoDescription: "cargo_description", cargoWeightKg: "cargo_weight_kg",
    eta: "eta", actualArrival: "actual_arrival", departureTime: "departure_time",
    deliveryTime: "delivery_time", receiverName: "receiver_name",
    proofOfDelivery: "proof_of_delivery", deliveryNotes: "delivery_notes",
    trackingMode: "tracking_mode", fuelAssignedL: "fuel_assigned_l", fuelCost: "fuel_cost",
    otherExpenses: "other_expenses", revenue: "revenue",
  };
  for (const [k, col] of Object.entries(map)) {
    if (input[k as keyof typeof input] !== undefined) u[col] = input[k as keyof typeof input];
  }
  const { data, error } = await supabase.from("trips").update(u)
    .eq("id", input.id).eq("organization_id", input.organizationId).select("*").single();
  return unwrap(data, error);
}

export async function updateTripStatus(supabase: Client, _actorId: string, input: z.infer<typeof updateTripStatusSchema>) {
  const { data, error } = await supabase.from("trips")
    .update({ status: input.status, updated_at: new Date().toISOString() })
    .eq("id", input.id).eq("organization_id", input.organizationId).select("*").single();
  return unwrap(data, error);
}

export async function updateTripETA(supabase: Client, _actorId: string, input: z.infer<typeof updateTripETASchema>) {
  const { data, error } = await supabase.from("trips")
    .update({ eta: input.eta, updated_at: new Date().toISOString() })
    .eq("id", input.id).eq("organization_id", input.organizationId).select("*").single();
  return unwrap(data, error);
}

/* ====================== TRIP TIMELINE ====================== */

export async function readTripTimeline(supabase: Client, input: z.infer<typeof tripTimelineQuerySchema>) {
  const { data, error } = await supabase.from("trip_timeline").select("*")
    .eq("organization_id", input.organizationId).eq("trip_id", input.tripId)
    .order("created_at", { ascending: false }).limit(input.limit ?? 50);
  fail(error);
  return data ?? [];
}

/* ====================== TRIP DOCUMENTS ====================== */

export async function readTripDocuments(supabase: Client, input: z.infer<typeof tripDocQuerySchema>) {
  const { data, error } = await supabase.from("trip_documents").select("*")
    .eq("organization_id", input.organizationId).eq("trip_id", input.tripId)
    .order("created_at", { ascending: false });
  fail(error);
  return data ?? [];
}

export async function createTripDocument(supabase: Client, actorId: string, input: z.infer<typeof createTripDocSchema>) {
  const { data, error } = await supabase.from("trip_documents").insert({
    organization_id: input.organizationId, trip_id: input.tripId, name: input.name,
    document_type: input.documentType ?? "Other", file_path: input.filePath,
    file_size: input.fileSize, mime_type: input.mimeType, uploaded_by: actorId,
  }).select("*").single();
  return unwrap(data, error);
}

export async function deleteTripDocument(supabase: Client, organizationId: string, id: string) {
  const { error } = await supabase.from("trip_documents").delete()
    .eq("id", id).eq("organization_id", organizationId);
  fail(error);
  return { ok: true };
}

/* ====================== TRIP COSTS ====================== */

export async function readTripCosts(supabase: Client, input: z.infer<typeof tripCostQuerySchema>) {
  const { data, error } = await supabase.from("trip_costs").select("*")
    .eq("organization_id", input.organizationId).eq("trip_id", input.tripId)
    .order("incurred_date", { ascending: false });
  fail(error);
  return data ?? [];
}

export async function createTripCost(supabase: Client, actorId: string, input: z.infer<typeof createTripCostSchema>) {
  const { data, error } = await supabase.from("trip_costs").insert({
    organization_id: input.organizationId, trip_id: input.tripId, cost_type: input.costType,
    description: input.description, amount: input.amount, recorded_by: actorId,
  }).select("*").single();
  return unwrap(data, error);
}

/* ====================== TRIP DELAYS ====================== */

export async function readTripDelays(supabase: Client, input: z.infer<typeof tripDelayQuerySchema>) {
  const { data, error } = await supabase.from("trip_delays").select("*")
    .eq("organization_id", input.organizationId).eq("trip_id", input.tripId)
    .order("created_at", { ascending: false });
  fail(error);
  return data ?? [];
}

export async function createTripDelay(supabase: Client, actorId: string, input: z.infer<typeof createTripDelaySchema>) {
  const { data, error } = await supabase.from("trip_delays").insert({
    organization_id: input.organizationId, trip_id: input.tripId, reason: input.reason,
    delay_minutes: input.delayMinutes, impact: input.impact, reported_by: actorId,
  }).select("*").single();
  return unwrap(data, error);
}

/* ====================== TRIPS BY RELATIONSHIP ====================== */

export async function readTripsByTruck(supabase: Client, organizationId: string, truckId: string, limit = 50) {
  const { data, error } = await supabase.from("trips").select("*, clients!left(name)")
    .eq("organization_id", organizationId).eq("truck_id", truckId)
    .order("created_at", { ascending: false }).limit(limit);
  fail(error);
  return data ?? [];
}

export async function readTripsByDriver(supabase: Client, organizationId: string, driverId: string, limit = 50) {
  const { data, error } = await supabase.from("trips").select("*, clients!left(name)")
    .eq("organization_id", organizationId).eq("driver_id", driverId)
    .order("created_at", { ascending: false }).limit(limit);
  fail(error);
  return data ?? [];
}

export async function readTripsByClient(supabase: Client, organizationId: string, clientId: string, limit = 50) {
  const { data, error } = await supabase.from("trips").select("*, trucks!left(truck_number, plate), drivers!left(name)")
    .eq("organization_id", organizationId).eq("client_id", clientId)
    .order("created_at", { ascending: false }).limit(limit);
  fail(error);
  return data ?? [];
}

export async function readTripsByRoute(supabase: Client, organizationId: string, routeId: string, limit = 50) {
  const { data, error } = await supabase.from("trips").select("*, trucks!left(truck_number), drivers!left(name), clients!left(name)")
    .eq("organization_id", organizationId).eq("route_id", routeId)
    .order("created_at", { ascending: false }).limit(limit);
  fail(error);
  return data ?? [];
}

export async function readTripsByFleetManager(supabase: Client, organizationId: string, fleetManagerId: string, limit = 50) {
  const { data, error } = await supabase.from("trips").select("*, trucks!left(truck_number), clients!left(name)")
    .eq("organization_id", organizationId).eq("fleet_manager_id", fleetManagerId)
    .order("created_at", { ascending: false }).limit(limit);
  fail(error);
  return data ?? [];
}
