import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { writeAuditEvent } from "./platform.server";
import { truckIdSchema } from "./fleet-schemas";
import {
  createClientSchema,
  updateClientSchema,
  clientQuerySchema,
  createClientContactSchema,
  deleteClientContactSchema,
  createRouteSchema,
  updateRouteSchema,
  routeQuerySchema,
  createTripSchema,
  updateTripSchema,
  tripQuerySchema,
  updateTripStatusSchema,
  updateTripETASchema,
  createTripDocumentSchema,
  tripDocumentQuerySchema,
  createTripCostSchema,
  tripCostQuerySchema,
  createTripDelaySchema,
  tripDelayQuerySchema,
  tripTimelineQuerySchema,
} from "./operations-schemas";
import {
  readClients,
  readClient,
  createClient,
  updateClient,
  readClientContacts,
  createClientContact,
  deleteClientContact,
  readRoutes,
  readRoute,
  createRoute,
  updateRoute,
  readTrips,
  readTrip,
  createTrip,
  updateTrip,
  updateTripStatus,
  updateTripETA,
  readTripTimeline,
  readTripDocuments,
  createTripDocument,
  deleteTripDocument,
  readTripCosts,
  createTripCost,
  readTripDelays,
  createTripDelay,
  readTripsByTruck,
  readTripsByDriver,
  readTripsByClient,
  readTripsByRoute,
  readTripsByFleetManager,
} from "./operations.server";

/* ============================ CLIENTS ============================ */

export const listClients = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => clientQuerySchema.parse(input))
  .handler(async ({ data, context }) => readClients(context.supabase, data));

export const getClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readClient(context.supabase, data.organizationId, data.id),
  );

export const addClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createClientSchema.parse(input))
  .handler(async ({ data, context }) => {
    const client = await createClient(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "client",
      entityId: client.id,
      entityLabel: client.name,
      action: "created",
    });
    return client;
  });

export const editClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateClientSchema.parse(input))
  .handler(async ({ data, context }) => {
    const client = await updateClient(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "client",
      entityId: client.id,
      entityLabel: client.name,
      action: "updated",
    });
    return client;
  });

/* ====================== CLIENT CONTACTS ====================== */

export const listClientContacts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readClientContacts(context.supabase, data.organizationId, data.id),
  );

export const addClientContact = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createClientContactSchema.parse(input))
  .handler(async ({ data, context }) => {
    const contact = await createClientContact(
      context.supabase,
      context.userId,
      data,
    );
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "client_contact",
      entityId: contact.id,
      entityLabel: data.name,
      action: "created",
    });
    return contact;
  });

export const removeClientContact = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => deleteClientContactSchema.parse(input))
  .handler(async ({ data, context }) => {
    const result = await deleteClientContact(context.supabase, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "client_contact",
      entityId: data.id,
      action: "deleted",
    });
    return result;
  });

/* ============================ ROUTES ============================ */

export const listRoutes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => routeQuerySchema.parse(input))
  .handler(async ({ data, context }) => readRoutes(context.supabase, data));

export const getRoute = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readRoute(context.supabase, data.organizationId, data.id),
  );

export const addRoute = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createRouteSchema.parse(input))
  .handler(async ({ data, context }) => {
    const route = await createRoute(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "route",
      entityId: route.id,
      entityLabel: route.name,
      action: "created",
    });
    return route;
  });

export const editRoute = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateRouteSchema.parse(input))
  .handler(async ({ data, context }) => {
    const route = await updateRoute(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "route",
      entityId: route.id,
      entityLabel: route.name,
      action: "updated",
    });
    return route;
  });

/* ============================ TRIPS ============================ */

export const listTrips = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => tripQuerySchema.parse(input))
  .handler(async ({ data, context }) => readTrips(context.supabase, data));

export const getTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readTrip(context.supabase, data.organizationId, data.id),
  );

export const addTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createTripSchema.parse(input))
  .handler(async ({ data, context }) => {
    const trip = await createTrip(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "trip",
      entityId: trip.id,
      entityLabel: trip.trip_number,
      action: "created",
    });
    return trip;
  });

export const editTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateTripSchema.parse(input))
  .handler(async ({ data, context }) => {
    const trip = await updateTrip(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "trip",
      entityId: trip.id,
      entityLabel: trip.trip_number,
      action: "updated",
    });
    return trip;
  });

export const changeTripStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateTripStatusSchema.parse(input))
  .handler(async ({ data, context }) => {
    const trip = await updateTripStatus(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "trip",
      entityId: trip.id,
      action: "status_changed",
      fieldName: "status",
      newValue: data.status,
    });
    return trip;
  });

export const changeTripETA = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateTripETASchema.parse(input))
  .handler(async ({ data, context }) => {
    const trip = await updateTripETA(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "trip",
      entityId: trip.id,
      action: "updated",
      fieldName: "eta",
      newValue: data.eta,
    });
    return trip;
  });

/* ====================== TRIP TIMELINE ====================== */

export const getTripTimeline = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => tripTimelineQuerySchema.parse(input))
  .handler(async ({ data, context }) =>
    readTripTimeline(context.supabase, data),
  );

/* ====================== TRIP DOCUMENTS ====================== */

export const listTripDocuments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => tripDocumentQuerySchema.parse(input))
  .handler(async ({ data, context }) =>
    readTripDocuments(context.supabase, data),
  );

export const uploadTripDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createTripDocumentSchema.parse(input))
  .handler(async ({ data, context }) => {
    const doc = await createTripDocument(
      context.supabase,
      context.userId,
      data,
    );
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "trip_document",
      entityId: doc.id,
      entityLabel: data.name,
      action: "created",
    });
    return doc;
  });

export const removeTripDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    tripDocumentQuerySchema
      .extend({ id: truckIdSchema.shape.id })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const result = await deleteTripDocument(
      context.supabase,
      data.organizationId,
      data.id,
    );
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "trip_document",
      entityId: data.id,
      action: "deleted",
    });
    return result;
  });

/* ====================== TRIP COSTS ====================== */

export const listTripCosts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => tripCostQuerySchema.parse(input))
  .handler(async ({ data, context }) => readTripCosts(context.supabase, data));

export const addTripCost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createTripCostSchema.parse(input))
  .handler(async ({ data, context }) => {
    const cost = await createTripCost(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "trip_cost",
      entityId: cost.id,
      entityLabel: data.costType,
      action: "created",
    });
    return cost;
  });

/* ====================== TRIP DELAYS ====================== */

export const listTripDelays = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => tripDelayQuerySchema.parse(input))
  .handler(async ({ data, context }) =>
    readTripDelays(context.supabase, data),
  );

export const addTripDelay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createTripDelaySchema.parse(input))
  .handler(async ({ data, context }) => {
    const delay = await createTripDelay(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "operations",
      entityType: "trip_delay",
      entityId: delay.id,
      action: "created",
    });
    return delay;
  });

/* ====================== TRIPS BY RELATIONSHIP ====================== */

export const getTripsByTruck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readTripsByTruck(context.supabase, data.organizationId, data.id),
  );

export const getTripsByDriver = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readTripsByDriver(context.supabase, data.organizationId, data.id),
  );

export const getTripsByClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readTripsByClient(context.supabase, data.organizationId, data.id),
  );

export const getTripsByRoute = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readTripsByRoute(context.supabase, data.organizationId, data.id),
  );

export const getTripsByFleetManager = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readTripsByFleetManager(context.supabase, data.organizationId, data.id),
  );
