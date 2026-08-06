import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { writeAuditEvent } from "./platform.server";
import {
  createTruckSchema,
  updateTruckSchema,
  truckQuerySchema,
  truckIdSchema,
  updateTruckStatusSchema,
  createDriverSchema,
  updateDriverSchema,
  driverQuerySchema,
  createFleetManagerSchema,
  updateFleetManagerSchema,
  fleetManagerQuerySchema,
  assignDriverSchema,
  unassignDriverSchema,
  assignFleetManagerTrucksSchema,
  createTruckDocumentSchema,
  createDriverDocumentSchema,
  documentQuerySchema,
  deleteDocumentSchema,
  createMaintenanceSchema,
  updateMaintenanceSchema,
  maintenanceQuerySchema,
  createFuelSchema,
  fuelQuerySchema,
  createIncidentSchema,
  updateIncidentSchema,
  incidentQuerySchema,
} from "./fleet-schemas";
import {
  readTrucks,
  readTruck,
  createTruck,
  updateTruck,
  updateTruckStatus,
  deleteTruck,
  readFleetKpis,
  readDrivers,
  readDriver,
  createDriver,
  updateDriver,
  readFleetManagers,
  readFleetManager,
  createFleetManager,
  updateFleetManager,
  assignDriverToTruck,
  unassignDriverFromTruck,
  assignFleetManagerTrucks,
  readFleetManagerTrucks,
  readTruckDocuments,
  createTruckDocument,
  readDriverDocuments,
  createDriverDocument,
  deleteDocument,
  readMaintenanceRecords,
  createMaintenance,
  updateMaintenance,
  readFuelRecords,
  createFuel,
  readIncidents,
  createIncident,
  updateIncident,
  readTruckHistory,
  readDriverHistory,
  readTruckHealthSummary,
  readTruckMaintenanceSummary,
  readTruckFuelSummary,
  readTruckIncidentSummary,
  readTruckUtilisation,
} from "./fleet.server";

/* ============================ TRUCKS ============================ */

export const listTrucks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckQuerySchema.parse(input))
  .handler(async ({ data, context }) => readTrucks(context.supabase, data));

export const getTruck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) => readTruck(context.supabase, data));

export const addTruck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createTruckSchema.parse(input))
  .handler(async ({ data, context }) => {
    const truck = await createTruck(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: "truck",
      entityId: truck.id,
      entityLabel: truck.plate,
      action: "created",
      notes: `Truck ${truck.truck_number} registered`,
    });
    return truck;
  });

export const editTruck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateTruckSchema.parse(input))
  .handler(async ({ data, context }) => {
    const truck = await updateTruck(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: "truck",
      entityId: truck.id,
      entityLabel: truck.plate,
      action: "updated",
    });
    return truck;
  });

export const changeTruckStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateTruckStatusSchema.parse(input))
  .handler(async ({ data, context }) => {
    const truck = await updateTruckStatus(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: "truck",
      entityId: truck.id,
      entityLabel: truck.plate,
      action: "status_changed",
      fieldName: "status",
      newValue: data.status,
    });
    return truck;
  });

export const removeTruck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) => {
    const result = await deleteTruck(context.supabase, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: "truck",
      entityId: data.id,
      action: "deleted",
    });
    return result;
  });

export const getFleetKpis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    truckIdSchema.pick({ organizationId: true }).parse(input),
  )
  .handler(async ({ data, context }) =>
    readFleetKpis(context.supabase, data.organizationId),
  );

export const getTruckHealthSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readTruckHealthSummary(context.supabase, data.organizationId, data.id),
  );

export const getTruckMaintenanceSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readTruckMaintenanceSummary(context.supabase, data.organizationId, data.id),
  );

export const getTruckFuelSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readTruckFuelSummary(context.supabase, data.organizationId, data.id),
  );

export const getTruckIncidentSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readTruckIncidentSummary(context.supabase, data.organizationId, data.id),
  );

export const getTruckHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readTruckHistory(context.supabase, data.organizationId, data.id),
  );

export const getTruckUtilisation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readTruckUtilisation(context.supabase, data.organizationId, data.id),
  );

/* ============================ DRIVERS ============================ */

export const listDrivers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => driverQuerySchema.parse(input))
  .handler(async ({ data, context }) => readDrivers(context.supabase, data));

export const getDriver = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readDriver(context.supabase, { organizationId: data.organizationId, id: data.id }),
  );

export const addDriver = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createDriverSchema.parse(input))
  .handler(async ({ data, context }) => {
    const driver = await createDriver(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: "driver",
      entityId: driver.id,
      entityLabel: driver.name,
      action: "created",
    });
    return driver;
  });

export const editDriver = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateDriverSchema.parse(input))
  .handler(async ({ data, context }) => {
    const driver = await updateDriver(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: "driver",
      entityId: driver.id,
      entityLabel: driver.name,
      action: "updated",
    });
    return driver;
  });

export const getDriverHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readDriverHistory(context.supabase, data.organizationId, data.id),
  );

/* ====================== FLEET MANAGERS ====================== */

export const listFleetManagers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => fleetManagerQuerySchema.parse(input))
  .handler(async ({ data, context }) => readFleetManagers(context.supabase, data));

export const getFleetManager = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readFleetManager(context.supabase, {
      organizationId: data.organizationId,
      id: data.id,
    }),
  );

export const addFleetManager = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createFleetManagerSchema.parse(input))
  .handler(async ({ data, context }) => {
    const fm = await createFleetManager(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: "fleet_manager",
      entityId: fm.id,
      entityLabel: fm.name,
      action: "created",
    });
    return fm;
  });

export const editFleetManager = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateFleetManagerSchema.parse(input))
  .handler(async ({ data, context }) => {
    const fm = await updateFleetManager(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: "fleet_manager",
      entityId: fm.id,
      entityLabel: fm.name,
      action: "updated",
    });
    return fm;
  });

export const getFleetManagerTrucks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => truckIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readFleetManagerTrucks(context.supabase, data.organizationId, data.id),
  );

/* ====================== ASSIGNMENTS ====================== */

export const assignDriver = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => assignDriverSchema.parse(input))
  .handler(async ({ data, context }) => {
    const assignment = await assignDriverToTruck(
      context.supabase,
      context.userId,
      data,
    );
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: "truck_assignment",
      entityId: assignment.id,
      action: "created",
      notes: `Driver assigned to truck`,
    });
    return assignment;
  });

export const unassignDriver = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => unassignDriverSchema.parse(input))
  .handler(async ({ data, context }) => {
    const result = await unassignDriverFromTruck(context.supabase, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: "truck_assignment",
      entityId: data.truckId,
      action: "deleted",
    });
    return result;
  });

export const assignFleetManagerTrucksFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    assignFleetManagerTrucksSchema.parse(input),
  )
  .handler(async ({ data, context }) => {
    const result = await assignFleetManagerTrucks(
      context.supabase,
      context.userId,
      data,
    );
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: "fleet_manager_assignment",
      entityId: data.fleetManagerId,
      action: "updated",
      notes: `Assigned ${data.truckIds.length} trucks`,
    });
    return result;
  });

/* ====================== DOCUMENTS ====================== */

export const listTruckDocuments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => documentQuerySchema.parse(input))
  .handler(async ({ data, context }) =>
    readTruckDocuments(context.supabase, data),
  );

export const uploadTruckDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createTruckDocumentSchema.parse(input))
  .handler(async ({ data, context }) => {
    const doc = await createTruckDocument(
      context.supabase,
      context.userId,
      data,
    );
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: "truck_document",
      entityId: doc.id,
      entityLabel: data.name,
      action: "created",
    });
    return doc;
  });

export const listDriverDocuments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => documentQuerySchema.parse(input))
  .handler(async ({ data, context }) =>
    readDriverDocuments(context.supabase, data),
  );

export const uploadDriverDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createDriverDocumentSchema.parse(input))
  .handler(async ({ data, context }) => {
    const doc = await createDriverDocument(
      context.supabase,
      context.userId,
      data,
    );
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: "driver_document",
      entityId: doc.id,
      entityLabel: data.name,
      action: "created",
    });
    return doc;
  });

export const removeDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => deleteDocumentSchema.parse(input))
  .handler(async ({ data, context }) => {
    const result = await deleteDocument(context.supabase, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fleet",
      entityType: `${data.kind}_document`,
      entityId: data.id,
      action: "deleted",
    });
    return result;
  });

/* ====================== MAINTENANCE ====================== */

export const listMaintenanceRecords = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => maintenanceQuerySchema.parse(input))
  .handler(async ({ data, context }) =>
    readMaintenanceRecords(context.supabase, data),
  );

export const addMaintenanceRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createMaintenanceSchema.parse(input))
  .handler(async ({ data, context }) => {
    const rec = await createMaintenance(
      context.supabase,
      context.userId,
      data,
    );
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "maintenance",
      entityType: "truck_maintenance",
      entityId: rec.id,
      entityLabel: data.service,
      action: "created",
    });
    return rec;
  });

export const editMaintenanceRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateMaintenanceSchema.parse(input))
  .handler(async ({ data, context }) => {
    const rec = await updateMaintenance(
      context.supabase,
      context.userId,
      data,
    );
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "maintenance",
      entityType: "truck_maintenance",
      entityId: rec.id,
      action: "updated",
    });
    return rec;
  });

/* ====================== FUEL ====================== */

export const listFuelRecords = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => fuelQuerySchema.parse(input))
  .handler(async ({ data, context }) =>
    readFuelRecords(context.supabase, data),
  );

export const addFuelRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createFuelSchema.parse(input))
  .handler(async ({ data, context }) => {
    const rec = await createFuel(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "fuel",
      entityType: "truck_fuel",
      entityId: rec.id,
      action: "created",
    });
    return rec;
  });

/* ====================== INCIDENTS ====================== */

export const listIncidents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => incidentQuerySchema.parse(input))
  .handler(async ({ data, context }) =>
    readIncidents(context.supabase, data),
  );

export const addIncident = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createIncidentSchema.parse(input))
  .handler(async ({ data, context }) => {
    const rec = await createIncident(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "safety",
      entityType: "incident",
      entityId: rec.id,
      entityLabel: rec.incident_number,
      action: "created",
    });
    return rec;
  });

export const editIncident = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateIncidentSchema.parse(input))
  .handler(async ({ data, context }) => {
    const rec = await updateIncident(context.supabase, context.userId, data);
    await writeAuditEvent(context.supabase, context.userId, {
      organizationId: data.organizationId,
      module: "safety",
      entityType: "incident",
      entityId: rec.id,
      action: "updated",
    });
    return rec;
  });
