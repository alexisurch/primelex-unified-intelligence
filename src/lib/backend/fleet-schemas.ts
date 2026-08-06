import { z } from "zod";

const uuid = z.string().uuid();

export const truckStatusEnum = z.enum(["On The Road", "Idle", "Maintenance", "Offline"]);
export const driverStatusEnum = z.enum(["Active", "On Leave", "Suspended"]);
export const driverRiskEnum = z.enum(["Low", "Medium", "High"]);
export const fmStatusEnum = z.enum(["Active", "On Leave", "Inactive"]);
export const maintTypeEnum = z.enum(["Routine", "Safety", "Diagnostic", "Repair"]);
export const maintStatusEnum = z.enum(["Scheduled", "In Workshop", "Completed", "Overdue"]);
export const incidentTypeEnum = z.enum(["Accident", "Cargo Damage", "Vehicle Breakdown", "Theft", "Driver Misconduct", "Delivery Issue", "Other"]);
export const incidentSevEnum = z.enum(["Low", "Moderate", "High", "Critical"]);
export const incidentStatusEnum = z.enum(["Open", "Investigating", "Resolved"]);
export const vehicleTypeEnum = z.enum(["Box Truck", "Rigid Truck", "Articulated Tractor", "Tipper", "Flatbed"]);
export const licenseClassEnum = z.enum(["Class C", "Class D", "Class E"]);
export const fuelTypeEnum = z.enum(["Diesel", "Petrol", "CNG"]);
export const fuelStatusEnum = z.enum(["Pending", "Approved", "Rejected"]);
export const assignStatusEnum = z.enum(["Active", "Completed", "Cancelled"]);

/* Trucks */
export const createTruckSchema = z.object({
  organizationId: uuid, plate: z.string().min(1).max(40), model: z.string().min(1).max(120),
  manufacturer: z.string().max(120).optional(), vehicleType: vehicleTypeEnum.optional(),
  capacityKg: z.number().min(0).max(99999999).optional(), year: z.number().int().min(1900).max(2100).optional(),
  vin: z.string().max(120).optional(), trackingNumber: z.string().max(120).optional(),
  driverId: uuid.nullable().optional(), fleetManagerId: uuid.nullable().optional(),
  status: truckStatusEnum.optional(), fuelLevel: z.number().min(0).max(100).optional(),
  odometerKm: z.number().min(0).optional(), location: z.string().max(255).optional(),
  engineHealth: z.number().min(0).max(100).optional(), gpsStatus: z.enum(["Online", "Offline"]).optional(),
  lastServiceDate: z.string().max(32).optional(), trackingSource: z.string().max(64).optional(),
});
export type CreateTruckInput = z.infer<typeof createTruckSchema>;

export const updateTruckSchema = z.object({
  id: uuid, organizationId: uuid,
  plate: z.string().min(1).max(40).optional(), model: z.string().min(1).max(120).optional(),
  manufacturer: z.string().max(120).optional().nullable(), vehicleType: vehicleTypeEnum.optional().nullable(),
  capacityKg: z.number().min(0).max(99999999).optional().nullable(), year: z.number().int().min(1900).max(2100).optional().nullable(),
  vin: z.string().max(120).optional().nullable(), trackingNumber: z.string().max(120).optional().nullable(),
  status: truckStatusEnum.optional(), fuelLevel: z.number().min(0).max(100).optional(),
  odometerKm: z.number().min(0).optional(), location: z.string().max(255).optional().nullable(),
  engineHealth: z.number().min(0).max(100).optional(), gpsStatus: z.enum(["Online", "Offline"]).optional(),
  lastServiceDate: z.string().max(32).optional().nullable(), trackingSource: z.string().max(64).optional().nullable(),
  archived: z.boolean().optional(),
});
export type UpdateTruckInput = z.infer<typeof updateTruckSchema>;

export const truckQuerySchema = z.object({
  organizationId: uuid, search: z.string().max(120).optional(),
  status: truckStatusEnum.optional(), driverId: uuid.optional(),
  archived: z.boolean().optional(), limit: z.number().int().min(1).max(500).optional(),
  offset: z.number().int().min(0).optional(),
});
export type TruckQueryInput = z.infer<typeof truckQuerySchema>;

export const truckIdSchema = z.object({ organizationId: uuid, id: uuid });

export const updateTruckStatusSchema = z.object({ id: uuid, organizationId: uuid, status: truckStatusEnum });
export type UpdateTruckStatusInput = z.infer<typeof updateTruckStatusSchema>;

/* Drivers */
export const createDriverSchema = z.object({
  organizationId: uuid, name: z.string().min(1).max(120),
  phone: z.string().max(40).optional(), email: z.string().email().max(255).optional(),
  address: z.string().max(500).optional(), emergencyContact: z.string().max(120).optional(),
  licenseNumber: z.string().min(1).max(80), licenseClass: licenseClassEnum.optional(),
  licenseExpiry: z.string().max(32).optional(), medicalExpiry: z.string().max(32).optional(),
  safetyScore: z.number().min(0).max(100).optional(), riskLevel: driverRiskEnum.optional(),
  status: driverStatusEnum.optional(), truckId: uuid.nullable().optional(),
  fleetManagerId: uuid.nullable().optional(), violations: z.number().int().min(0).optional(),
  trainings: z.number().int().min(0).optional(),
});
export type CreateDriverInput = z.infer<typeof createDriverSchema>;

export const updateDriverSchema = z.object({
  id: uuid, organizationId: uuid,
  name: z.string().min(1).max(120).optional(), phone: z.string().max(40).optional().nullable(),
  email: z.string().email().max(255).optional().nullable(), address: z.string().max(500).optional().nullable(),
  emergencyContact: z.string().max(120).optional().nullable(), licenseNumber: z.string().min(1).max(80).optional(),
  licenseClass: licenseClassEnum.optional().nullable(), licenseExpiry: z.string().max(32).optional().nullable(),
  medicalExpiry: z.string().max(32).optional().nullable(), safetyScore: z.number().min(0).max(100).optional(),
  riskLevel: driverRiskEnum.optional(), status: driverStatusEnum.optional(),
  truckId: uuid.nullable().optional(), fleetManagerId: uuid.nullable().optional(),
  violations: z.number().int().min(0).optional(), trainings: z.number().int().min(0).optional(),
  archived: z.boolean().optional(),
});
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;

export const driverQuerySchema = z.object({
  organizationId: uuid, search: z.string().max(120).optional(),
  status: driverStatusEnum.optional(), truckId: uuid.optional(),
  archived: z.boolean().optional(), limit: z.number().int().min(1).max(500).optional(),
  offset: z.number().int().min(0).optional(),
});
export type DriverQueryInput = z.infer<typeof driverQuerySchema>;

/* Fleet Managers */
export const createFleetManagerSchema = z.object({
  organizationId: uuid, name: z.string().min(1).max(120), employeeId: z.string().min(1).max(60),
  role: z.string().max(120).optional(), department: z.string().max(120).optional(),
  phone: z.string().max(40).optional(), email: z.string().email().max(255).optional(),
  photo: z.string().max(2048).optional(), status: fmStatusEnum.optional(),
  dateJoined: z.string().max(32).optional(), userId: uuid.nullable().optional(),
});
export type CreateFleetManagerInput = z.infer<typeof createFleetManagerSchema>;

export const updateFleetManagerSchema = z.object({
  id: uuid, organizationId: uuid,
  name: z.string().min(1).max(120).optional(), employeeId: z.string().min(1).max(60).optional(),
  role: z.string().max(120).optional().nullable(), department: z.string().max(120).optional().nullable(),
  phone: z.string().max(40).optional().nullable(), email: z.string().email().max(255).optional().nullable(),
  photo: z.string().max(2048).optional().nullable(), status: fmStatusEnum.optional(),
  dateJoined: z.string().max(32).optional().nullable(), archived: z.boolean().optional(),
});
export type UpdateFleetManagerInput = z.infer<typeof updateFleetManagerSchema>;

export const fmQuerySchema = z.object({
  organizationId: uuid, search: z.string().max(120).optional(),
  status: fmStatusEnum.optional(), archived: z.boolean().optional(),
  limit: z.number().int().min(1).max(500).optional(),
});
export type FMQueryInput = z.infer<typeof fmQuerySchema>;

/* Assignments */
export const assignDriverSchema = z.object({
  organizationId: uuid, truckId: uuid, driverId: uuid, fleetManagerId: uuid.nullable().optional(),
});
export type AssignDriverInput = z.infer<typeof assignDriverSchema>;

export const unassignDriverSchema = z.object({ organizationId: uuid, truckId: uuid });
export type UnassignDriverInput = z.infer<typeof unassignDriverSchema>;

export const assignFmTrucksSchema = z.object({
  organizationId: uuid, fleetManagerId: uuid, truckIds: z.array(uuid),
});
export type AssignFMTrucksInput = z.infer<typeof assignFmTrucksSchema>;

/* Documents */
export const createTruckDocSchema = z.object({
  organizationId: uuid, truckId: uuid, name: z.string().min(1).max(255),
  documentType: z.string().max(120), filePath: z.string().max(1024).optional(),
  fileSize: z.number().int().min(0).optional(), mimeType: z.string().max(128).optional(),
  expiryDate: z.string().max(32).optional(), version: z.string().max(32).optional(),
});
export type CreateTruckDocInput = z.infer<typeof createTruckDocSchema>;

export const createDriverDocSchema = z.object({
  organizationId: uuid, driverId: uuid, name: z.string().min(1).max(255),
  documentType: z.string().max(120), filePath: z.string().max(1024).optional(),
  fileSize: z.number().int().min(0).optional(), mimeType: z.string().max(128).optional(),
  expiryDate: z.string().max(32).optional(), version: z.string().max(32).optional(),
});
export type CreateDriverDocInput = z.infer<typeof createDriverDocSchema>;

export const docQuerySchema = z.object({
  organizationId: uuid, truckId: uuid.optional(), driverId: uuid.optional(),
  limit: z.number().int().min(1).max(500).optional(),
});
export type DocQueryInput = z.infer<typeof docQuerySchema>;

export const deleteDocSchema = z.object({ organizationId: uuid, id: uuid, kind: z.enum(["truck", "driver"]) });

/* Maintenance */
export const createMaintSchema = z.object({
  organizationId: uuid, truckId: uuid, service: z.string().min(1).max(255),
  type: maintTypeEnum.optional(), priority: z.string().max(40).optional(),
  cost: z.number().min(0).optional(), status: maintStatusEnum.optional(),
  performedBy: z.string().max(120).optional(), workDone: z.string().max(2000).optional(),
  dueDate: z.string().max(32).optional(), serviceDate: z.string().max(32).optional(),
  nextServiceDate: z.string().max(32).optional(),
});
export type CreateMaintInput = z.infer<typeof createMaintSchema>;

export const updateMaintSchema = z.object({
  id: uuid, organizationId: uuid,
  service: z.string().min(1).max(255).optional(), type: maintTypeEnum.optional(),
  priority: z.string().max(40).optional().nullable(), cost: z.number().min(0).optional(),
  status: maintStatusEnum.optional(), performedBy: z.string().max(120).optional().nullable(),
  workDone: z.string().max(2000).optional().nullable(), dueDate: z.string().max(32).optional().nullable(),
  serviceDate: z.string().max(32).optional().nullable(), nextServiceDate: z.string().max(32).optional().nullable(),
});
export type UpdateMaintInput = z.infer<typeof updateMaintSchema>;

export const maintQuerySchema = z.object({
  organizationId: uuid, truckId: uuid.optional(), status: maintStatusEnum.optional(),
  limit: z.number().int().min(1).max(500).optional(),
});
export type MaintQueryInput = z.infer<typeof maintQuerySchema>;

/* Fuel */
export const createFuelSchema = z.object({
  organizationId: uuid, truckId: uuid, driverId: uuid.nullable().optional(),
  tripId: uuid.nullable().optional(), fuelType: fuelTypeEnum.optional(),
  quantity: z.number().min(0), unitPrice: z.number().min(0),
  location: z.string().max(255).optional(), transactionType: z.string().max(60).optional(),
  assignmentType: z.string().max(60).optional(), status: fuelStatusEnum.optional(),
  note: z.string().max(1000).optional(), transactionDate: z.string().max(32).optional(),
});
export type CreateFuelInput = z.infer<typeof createFuelSchema>;

export const fuelQuerySchema = z.object({
  organizationId: uuid, truckId: uuid.optional(), driverId: uuid.optional(),
  limit: z.number().int().min(1).max(500).optional(),
});
export type FuelQueryInput = z.infer<typeof fuelQuerySchema>;

/* Incidents */
export const createIncidentSchema = z.object({
  organizationId: uuid, type: incidentTypeEnum,
  driverId: uuid.nullable().optional(), truckId: uuid.nullable().optional(),
  tripId: uuid.nullable().optional(), clientId: uuid.nullable().optional(),
  severity: incidentSevEnum.optional(), status: incidentStatusEnum.optional(),
  incidentDate: z.string().max(32).optional(), location: z.string().max(255).optional(),
  rootCause: z.string().max(2000).optional(), description: z.string().max(5000).optional(),
  investigator: z.string().max(120).optional(), correctiveActions: z.string().max(5000).optional(),
  estDelayMin: z.number().int().min(0).optional(), estFinancialImpact: z.number().min(0).optional(),
  photos: z.array(z.string().max(2048)).max(20).optional(),
  documents: z.array(z.string().max(2048)).max(20).optional(),
});
export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;

export const updateIncidentSchema = z.object({
  id: uuid, organizationId: uuid,
  type: incidentTypeEnum.optional(), severity: incidentSevEnum.optional(),
  status: incidentStatusEnum.optional(), location: z.string().max(255).optional().nullable(),
  rootCause: z.string().max(2000).optional().nullable(), description: z.string().max(5000).optional().nullable(),
  investigator: z.string().max(120).optional().nullable(), correctiveActions: z.string().max(5000).optional().nullable(),
  estDelayMin: z.number().int().min(0).optional(), estFinancialImpact: z.number().min(0).optional(),
});
export type UpdateIncidentInput = z.infer<typeof updateIncidentSchema>;

export const incidentQuerySchema = z.object({
  organizationId: uuid, truckId: uuid.optional(), driverId: uuid.optional(),
  status: incidentStatusEnum.optional(), limit: z.number().int().min(1).max(500).optional(),
});
export type IncidentQueryInput = z.infer<typeof incidentQuerySchema>;
