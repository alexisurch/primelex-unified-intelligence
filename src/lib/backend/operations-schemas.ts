import { z } from "zod";

const uuid = z.string().uuid();

export const clientStatusEnum = z.enum(["Active", "Prospect", "Inactive"]);
export const tripStatusEnum = z.enum(["Scheduled", "In Transit", "Delivered", "Delayed", "Cancelled"]);
export const tripPriorityEnum = z.enum(["Low", "Medium", "High", "Critical"]);
export const trackingModeEnum = z.enum(["manual", "automated"]);
export const tripDocTypeEnum = z.enum(["Waybill", "Invoice", "Delivery Note", "Proof of Delivery", "Other"]);

/* Clients */
export const createClientSchema = z.object({
  organizationId: uuid, name: z.string().min(1).max(200),
  contactName: z.string().max(120).optional(), phone: z.string().max(40).optional(),
  email: z.string().email().max(255).optional(), address: z.string().max(500).optional(),
  industry: z.string().max(120).optional(), status: clientStatusEnum.optional(),
});
export type CreateClientInput = z.infer<typeof createClientSchema>;

export const updateClientSchema = z.object({
  id: uuid, organizationId: uuid,
  name: z.string().min(1).max(200).optional(), contactName: z.string().max(120).optional().nullable(),
  phone: z.string().max(40).optional().nullable(), email: z.string().email().max(255).optional().nullable(),
  address: z.string().max(500).optional().nullable(), industry: z.string().max(120).optional().nullable(),
  status: clientStatusEnum.optional(), archived: z.boolean().optional(),
});
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

export const clientQuerySchema = z.object({
  organizationId: uuid, search: z.string().max(120).optional(),
  status: clientStatusEnum.optional(), archived: z.boolean().optional(),
  limit: z.number().int().min(1).max(500).optional(),
});
export type ClientQueryInput = z.infer<typeof clientQuerySchema>;

/* Client Contacts */
export const createClientContactSchema = z.object({
  organizationId: uuid, clientId: uuid, name: z.string().min(1).max(120),
  role: z.string().max(120).optional(), phone: z.string().max(40).optional(),
  email: z.string().email().max(255).optional(), isPrimary: z.boolean().optional(),
});
export type CreateClientContactInput = z.infer<typeof createClientContactSchema>;

export const deleteClientContactSchema = z.object({ organizationId: uuid, id: uuid });

/* Routes */
export const createRouteSchema = z.object({
  organizationId: uuid, name: z.string().min(1).max(200),
  origin: z.string().min(1).max(200), destination: z.string().min(1).max(200),
  distanceKm: z.number().min(0).optional(), estimatedDurationMin: z.number().int().min(0).optional(),
  roadType: z.string().max(60).optional(), terrain: z.string().max(60).optional(),
  fuelEstimateL: z.number().min(0).optional(), tollCost: z.number().min(0).optional(),
});
export type CreateRouteInput = z.infer<typeof createRouteSchema>;

export const updateRouteSchema = z.object({
  id: uuid, organizationId: uuid,
  name: z.string().min(1).max(200).optional(), origin: z.string().min(1).max(200).optional(),
  destination: z.string().min(1).max(200).optional(), distanceKm: z.number().min(0).optional(),
  estimatedDurationMin: z.number().int().min(0).optional().nullable(), roadType: z.string().max(60).optional().nullable(),
  terrain: z.string().max(60).optional().nullable(), fuelEstimateL: z.number().min(0).optional().nullable(),
  tollCost: z.number().min(0).optional().nullable(), archived: z.boolean().optional(),
});
export type UpdateRouteInput = z.infer<typeof updateRouteSchema>;

export const routeQuerySchema = z.object({
  organizationId: uuid, search: z.string().max(120).optional(),
  archived: z.boolean().optional(), limit: z.number().int().min(1).max(500).optional(),
});
export type RouteQueryInput = z.infer<typeof routeQuerySchema>;

/* Trips */
export const createTripSchema = z.object({
  organizationId: uuid, clientId: uuid.nullable().optional(), routeId: uuid.nullable().optional(),
  truckId: uuid.nullable().optional(), driverId: uuid.nullable().optional(),
  fleetManagerId: uuid.nullable().optional(), origin: z.string().min(1).max(200),
  destination: z.string().min(1).max(200), status: tripStatusEnum.optional(),
  priority: tripPriorityEnum.optional(), progress: z.number().min(0).max(100).optional(),
  distanceKm: z.number().min(0).optional(), stops: z.number().int().min(0).optional(),
  cargoDescription: z.string().max(1000).optional(), cargoWeightKg: z.number().min(0).optional(),
  eta: z.string().max(32).optional(), departureTime: z.string().max(32).optional(),
  trackingMode: trackingModeEnum.optional(), fuelAssignedL: z.number().min(0).optional(),
  fuelCost: z.number().min(0).optional(), otherExpenses: z.number().min(0).optional(),
  revenue: z.number().min(0).optional(),
});
export type CreateTripInput = z.infer<typeof createTripSchema>;

export const updateTripSchema = z.object({
  id: uuid, organizationId: uuid,
  clientId: uuid.nullable().optional(), routeId: uuid.nullable().optional(),
  truckId: uuid.nullable().optional(), driverId: uuid.nullable().optional(),
  fleetManagerId: uuid.nullable().optional(), origin: z.string().min(1).max(200).optional(),
  destination: z.string().min(1).max(200).optional(), status: tripStatusEnum.optional(),
  priority: tripPriorityEnum.optional(), progress: z.number().min(0).max(100).optional(),
  distanceKm: z.number().min(0).optional(), stops: z.number().int().min(0).optional(),
  cargoDescription: z.string().max(1000).optional().nullable(), cargoWeightKg: z.number().min(0).optional().nullable(),
  eta: z.string().max(32).optional().nullable(), actualArrival: z.string().max(32).optional().nullable(),
  departureTime: z.string().max(32).optional().nullable(), deliveryTime: z.string().max(32).optional().nullable(),
  receiverName: z.string().max(120).optional().nullable(), proofOfDelivery: z.string().max(2048).optional().nullable(),
  deliveryNotes: z.string().max(2000).optional().nullable(), trackingMode: trackingModeEnum.optional(),
  fuelAssignedL: z.number().min(0).optional(), fuelCost: z.number().min(0).optional(),
  otherExpenses: z.number().min(0).optional(), revenue: z.number().min(0).optional(),
});
export type UpdateTripInput = z.infer<typeof updateTripSchema>;

export const tripQuerySchema = z.object({
  organizationId: uuid, search: z.string().max(120).optional(),
  status: tripStatusEnum.optional(), clientId: uuid.optional(), truckId: uuid.optional(),
  driverId: uuid.optional(), routeId: uuid.optional(),
  limit: z.number().int().min(1).max(500).optional(), offset: z.number().int().min(0).optional(),
});
export type TripQueryInput = z.infer<typeof tripQuerySchema>;

export const updateTripStatusSchema = z.object({ id: uuid, organizationId: uuid, status: tripStatusEnum });
export type UpdateTripStatusInput = z.infer<typeof updateTripStatusSchema>;

export const updateTripETASchema = z.object({ id: uuid, organizationId: uuid, eta: z.string().min(1).max(32) });
export type UpdateTripETAInput = z.infer<typeof updateTripETASchema>;

/* Trip Documents */
export const createTripDocSchema = z.object({
  organizationId: uuid, tripId: uuid, name: z.string().min(1).max(255),
  documentType: tripDocTypeEnum.optional(), filePath: z.string().max(1024).optional(),
  fileSize: z.number().int().min(0).optional(), mimeType: z.string().max(128).optional(),
});
export type CreateTripDocInput = z.infer<typeof createTripDocSchema>;

export const tripDocQuerySchema = z.object({ organizationId: uuid, tripId: uuid });
export type TripDocQueryInput = z.infer<typeof tripDocQuerySchema>;

/* Trip Costs */
export const createTripCostSchema = z.object({
  organizationId: uuid, tripId: uuid, costType: z.string().min(1).max(120),
  description: z.string().max(500).optional(), amount: z.number().min(0),
});
export type CreateTripCostInput = z.infer<typeof createTripCostSchema>;

export const tripCostQuerySchema = z.object({ organizationId: uuid, tripId: uuid });
export type TripCostQueryInput = z.infer<typeof tripCostQuerySchema>;

/* Trip Delays */
export const createTripDelaySchema = z.object({
  organizationId: uuid, tripId: uuid, reason: z.string().min(1).max(500),
  delayMinutes: z.number().int().min(0), impact: z.string().max(500).optional(),
});
export type CreateTripDelayInput = z.infer<typeof createTripDelaySchema>;

export const tripDelayQuerySchema = z.object({ organizationId: uuid, tripId: uuid });
export type TripDelayQueryInput = z.infer<typeof tripDelayQuerySchema>;

/* Trip Timeline */
export const tripTimelineQuerySchema = z.object({
  organizationId: uuid, tripId: uuid, limit: z.number().int().min(1).max(200).optional(),
});
export type TripTimelineQueryInput = z.infer<typeof tripTimelineQuerySchema>;
