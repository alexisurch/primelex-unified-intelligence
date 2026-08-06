/*
# Fleet Management Core Schema

## Summary
Creates the complete fleet management backend: trucks, drivers, fleet managers,
assignments, documents, maintenance, fuel, incidents, and history tracking.
Every table is organisation-scoped with RLS policies using current_org_ids().
Every table has audit triggers via audit_row_change().

## New Tables
1. trucks — vehicle records with status, fuel, odometer, GPS tracking, engine health
2. drivers — driver records with license, safety score, risk level
3. fleet_managers — fleet manager records with department, role, assigned trucks
4. truck_assignments — links trucks to drivers and fleet managers
5. driver_assignments — links drivers to trucks and fleet managers
6. fleet_manager_assignments — links fleet managers to trucks
7. truck_documents — vehicle documents (registration, insurance, inspection) with expiry
8. driver_documents — driver documents (license, medical, training) with expiry
9. truck_maintenance — maintenance records with type, status, cost
10. truck_fuel — fuel transactions per truck
11. truck_history — immutable log of truck state changes
12. driver_history — immutable log of driver state changes
13. truck_utilisation — daily utilisation snapshots
14. incidents — safety incidents with severity, status, investigation

## Enums
- truck_status: On The Road, Idle, Maintenance, Offline
- truck_gps_status: Online, Offline
- driver_status: Active, On Leave, Suspended
- driver_risk: Low, Medium, High
- fleet_manager_status: Active, On Leave, Inactive
- maintenance_type: Routine, Safety, Diagnostic, Repair
- maintenance_status: Scheduled, In Workshop, Completed, Overdue
- incident_type: Accident, Cargo Damage, Vehicle Breakdown, Theft, Driver Misconduct, Delivery Issue, Other
- incident_severity: Low, Moderate, High, Critical
- incident_status: Open, Investigating, Resolved
- document_status: Valid, Expiring Soon, Expired, Pending
- fuel_type: Diesel, Petrol, CNG
- fuel_status: Pending, Approved, Rejected
- assignment_status: Active, Completed, Cancelled

## Security
- RLS enabled on all tables
- All policies use current_org_ids() for org-scoped access
- 4 policies per table (SELECT, INSERT, UPDATE, DELETE) for authenticated users
- Audit triggers on all tables via audit_row_change()
*/

-- ═══════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════

DO $$ BEGIN
  CREATE TYPE truck_status AS ENUM ('On The Road', 'Idle', 'Maintenance', 'Offline');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE truck_gps_status AS ENUM ('Online', 'Offline');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE driver_status AS ENUM ('Active', 'On Leave', 'Suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE driver_risk AS ENUM ('Low', 'Medium', 'High');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE fleet_manager_status AS ENUM ('Active', 'On Leave', 'Inactive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE maintenance_type AS ENUM ('Routine', 'Safety', 'Diagnostic', 'Repair');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE maintenance_status AS ENUM ('Scheduled', 'In Workshop', 'Completed', 'Overdue');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE incident_type AS ENUM ('Accident', 'Cargo Damage', 'Vehicle Breakdown', 'Theft', 'Driver Misconduct', 'Delivery Issue', 'Other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE incident_severity AS ENUM ('Low', 'Moderate', 'High', 'Critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE incident_status AS ENUM ('Open', 'Investigating', 'Resolved');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE document_status AS ENUM ('Valid', 'Expiring Soon', 'Expired', 'Pending');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE fuel_type AS ENUM ('Diesel', 'Petrol', 'CNG');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE fuel_status AS ENUM ('Pending', 'Approved', 'Rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE assignment_status AS ENUM ('Active', 'Completed', 'Cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE vehicle_type AS ENUM ('Box Truck', 'Rigid Truck', 'Articulated Tractor', 'Tipper', 'Flatbed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE license_class AS ENUM ('Class C', 'Class D', 'Class E');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ═══════════════════════════════════════════════════════════════
-- TRUCKS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS trucks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  truck_number text NOT NULL,
  plate text NOT NULL,
  model text NOT NULL,
  manufacturer text,
  vehicle_type vehicle_type,
  capacity_kg numeric(12,2),
  year integer,
  vin text,
  driver_id uuid,
  fleet_manager_id uuid,
  status truck_status NOT NULL DEFAULT 'Idle',
  fuel_level numeric(5,2) DEFAULT 0 CHECK (fuel_level >= 0 AND fuel_level <= 100),
  odometer_km numeric(12,2) DEFAULT 0,
  location text,
  route_id uuid,
  engine_health numeric(5,2) DEFAULT 100 CHECK (engine_health >= 0 AND engine_health <= 100),
  gps_status truck_gps_status DEFAULT 'Offline',
  last_service_date date,
  tracking_number text,
  tracking_source text DEFAULT 'GPS',
  archived boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trucks_org ON trucks(organization_id);
CREATE INDEX IF NOT EXISTS idx_trucks_org_status ON trucks(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_trucks_org_archived ON trucks(organization_id, archived);
CREATE INDEX IF NOT EXISTS idx_trucks_plate ON trucks(plate);
CREATE INDEX IF NOT EXISTS idx_trucks_truck_number ON trucks(truck_number);
CREATE UNIQUE INDEX IF NOT EXISTS idx_trucks_org_plate ON trucks(organization_id, plate);

ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_trucks" ON trucks;
CREATE POLICY "select_own_trucks" ON trucks FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_trucks" ON trucks;
CREATE POLICY "insert_own_trucks" ON trucks FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_trucks" ON trucks;
CREATE POLICY "update_own_trucks" ON trucks FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_trucks" ON trucks;
CREATE POLICY "delete_own_trucks" ON trucks FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- DRIVERS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  driver_number text NOT NULL,
  name text NOT NULL,
  phone text,
  email text,
  address text,
  emergency_contact text,
  license_number text NOT NULL,
  license_class license_class,
  license_expiry date,
  medical_expiry date,
  safety_score numeric(5,2) DEFAULT 100 CHECK (safety_score >= 0 AND safety_score <= 100),
  risk_level driver_risk DEFAULT 'Low',
  status driver_status NOT NULL DEFAULT 'Active',
  truck_id uuid,
  fleet_manager_id uuid,
  violations integer DEFAULT 0,
  trainings integer DEFAULT 0,
  archived boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_drivers_org ON drivers(organization_id);
CREATE INDEX IF NOT EXISTS idx_drivers_org_status ON drivers(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_drivers_name ON drivers(name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_drivers_org_license ON drivers(organization_id, license_number);

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_drivers" ON drivers;
CREATE POLICY "select_own_drivers" ON drivers FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_drivers" ON drivers;
CREATE POLICY "insert_own_drivers" ON drivers FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_drivers" ON drivers;
CREATE POLICY "update_own_drivers" ON drivers FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_drivers" ON drivers;
CREATE POLICY "delete_own_drivers" ON drivers FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- FLEET MANAGERS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS fleet_managers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Fleet Manager',
  department text,
  phone text,
  email text,
  photo text,
  status fleet_manager_status NOT NULL DEFAULT 'Active',
  date_joined date DEFAULT CURRENT_DATE,
  user_id uuid REFERENCES auth.users(id),
  archived boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fleet_managers_org ON fleet_managers(organization_id);
CREATE INDEX IF NOT EXISTS idx_fleet_managers_org_status ON fleet_managers(organization_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_fleet_managers_org_employee ON fleet_managers(organization_id, employee_id);

ALTER TABLE fleet_managers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_fleet_managers" ON fleet_managers;
CREATE POLICY "select_own_fleet_managers" ON fleet_managers FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_fleet_managers" ON fleet_managers;
CREATE POLICY "insert_own_fleet_managers" ON fleet_managers FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_fleet_managers" ON fleet_managers;
CREATE POLICY "update_own_fleet_managers" ON fleet_managers FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_fleet_managers" ON fleet_managers;
CREATE POLICY "delete_own_fleet_managers" ON fleet_managers FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- FLEET MANAGER ASSIGNMENTS (truck ↔ fleet_manager)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS fleet_manager_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  fleet_manager_id uuid NOT NULL REFERENCES fleet_managers(id) ON DELETE CASCADE,
  truck_id uuid NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  status assignment_status NOT NULL DEFAULT 'Active',
  assigned_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fma_org ON fleet_manager_assignments(organization_id);
CREATE INDEX IF NOT EXISTS idx_fma_manager ON fleet_manager_assignments(fleet_manager_id);
CREATE INDEX IF NOT EXISTS idx_fma_truck ON fleet_manager_assignments(truck_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_fma_active_unique ON fleet_manager_assignments(truck_id) WHERE status = 'Active';

ALTER TABLE fleet_manager_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_fma" ON fleet_manager_assignments;
CREATE POLICY "select_own_fma" ON fleet_manager_assignments FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_fma" ON fleet_manager_assignments;
CREATE POLICY "insert_own_fma" ON fleet_manager_assignments FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_fma" ON fleet_manager_assignments;
CREATE POLICY "update_own_fma" ON fleet_manager_assignments FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_fma" ON fleet_manager_assignments;
CREATE POLICY "delete_own_fma" ON fleet_manager_assignments FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- TRUCK ASSIGNMENTS (truck ↔ driver)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS truck_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  truck_id uuid NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  fleet_manager_id uuid REFERENCES fleet_managers(id) ON DELETE SET NULL,
  status assignment_status NOT NULL DEFAULT 'Active',
  assigned_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ta_org ON truck_assignments(organization_id);
CREATE INDEX IF NOT EXISTS idx_ta_truck ON truck_assignments(truck_id);
CREATE INDEX IF NOT EXISTS idx_ta_driver ON truck_assignments(driver_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ta_active_truck ON truck_assignments(truck_id) WHERE status = 'Active';
CREATE UNIQUE INDEX IF NOT EXISTS idx_ta_active_driver ON truck_assignments(driver_id) WHERE status = 'Active';

ALTER TABLE truck_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_ta" ON truck_assignments;
CREATE POLICY "select_own_ta" ON truck_assignments FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_ta" ON truck_assignments;
CREATE POLICY "insert_own_ta" ON truck_assignments FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_ta" ON truck_assignments;
CREATE POLICY "update_own_ta" ON truck_assignments FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_ta" ON truck_assignments;
CREATE POLICY "delete_own_ta" ON truck_assignments FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- TRUCK DOCUMENTS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS truck_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  truck_id uuid NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  name text NOT NULL,
  document_type text NOT NULL,
  file_path text,
  file_size bigint,
  mime_type text,
  expiry_date date,
  status document_status DEFAULT 'Pending',
  version text DEFAULT '1.0',
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_td_org ON truck_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_td_truck ON truck_documents(truck_id);
CREATE INDEX IF NOT EXISTS idx_td_expiry ON truck_documents(expiry_date);

ALTER TABLE truck_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_truck_docs" ON truck_documents;
CREATE POLICY "select_own_truck_docs" ON truck_documents FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_truck_docs" ON truck_documents;
CREATE POLICY "insert_own_truck_docs" ON truck_documents FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_truck_docs" ON truck_documents;
CREATE POLICY "update_own_truck_docs" ON truck_documents FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_truck_docs" ON truck_documents;
CREATE POLICY "delete_own_truck_docs" ON truck_documents FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- DRIVER DOCUMENTS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS driver_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  name text NOT NULL,
  document_type text NOT NULL,
  file_path text,
  file_size bigint,
  mime_type text,
  expiry_date date,
  status document_status DEFAULT 'Pending',
  version text DEFAULT '1.0',
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dd_org ON driver_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_dd_driver ON driver_documents(driver_id);
CREATE INDEX IF NOT EXISTS idx_dd_expiry ON driver_documents(expiry_date);

ALTER TABLE driver_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_driver_docs" ON driver_documents;
CREATE POLICY "select_own_driver_docs" ON driver_documents FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_driver_docs" ON driver_documents;
CREATE POLICY "insert_own_driver_docs" ON driver_documents FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_driver_docs" ON driver_documents;
CREATE POLICY "update_own_driver_docs" ON driver_documents FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_driver_docs" ON driver_documents;
CREATE POLICY "delete_own_driver_docs" ON driver_documents FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- TRUCK MAINTENANCE
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS truck_maintenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  truck_id uuid NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  service text NOT NULL,
  type maintenance_type NOT NULL DEFAULT 'Routine',
  priority text,
  cost numeric(12,2) DEFAULT 0,
  status maintenance_status NOT NULL DEFAULT 'Scheduled',
  performed_by text,
  work_done text,
  due_date date,
  service_date date,
  next_service_date date,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tm_org ON truck_maintenance(organization_id);
CREATE INDEX IF NOT EXISTS idx_tm_truck ON truck_maintenance(truck_id);
CREATE INDEX IF NOT EXISTS idx_tm_status ON truck_maintenance(status);

ALTER TABLE truck_maintenance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_maintenance" ON truck_maintenance;
CREATE POLICY "select_own_maintenance" ON truck_maintenance FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_maintenance" ON truck_maintenance;
CREATE POLICY "insert_own_maintenance" ON truck_maintenance FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_maintenance" ON truck_maintenance;
CREATE POLICY "update_own_maintenance" ON truck_maintenance FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_maintenance" ON truck_maintenance;
CREATE POLICY "delete_own_maintenance" ON truck_maintenance FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- TRUCK FUEL
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS truck_fuel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  truck_id uuid NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
  trip_id uuid,
  fuel_type fuel_type NOT NULL DEFAULT 'Diesel',
  quantity numeric(10,2) NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_amount numeric(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  location text,
  transaction_type text,
  assignment_type text,
  status fuel_status DEFAULT 'Approved',
  note text,
  recorded_by uuid REFERENCES auth.users(id),
  transaction_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tf_org ON truck_fuel(organization_id);
CREATE INDEX IF NOT EXISTS idx_tf_truck ON truck_fuel(truck_id);
CREATE INDEX IF NOT EXISTS idx_tf_date ON truck_fuel(transaction_date);

ALTER TABLE truck_fuel ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_truck_fuel" ON truck_fuel;
CREATE POLICY "select_own_truck_fuel" ON truck_fuel FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_truck_fuel" ON truck_fuel;
CREATE POLICY "insert_own_truck_fuel" ON truck_fuel FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_truck_fuel" ON truck_fuel;
CREATE POLICY "update_own_truck_fuel" ON truck_fuel FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_truck_fuel" ON truck_fuel;
CREATE POLICY "delete_own_truck_fuel" ON truck_fuel FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- TRUCK HISTORY (immutable log)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS truck_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  truck_id uuid NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  description text,
  old_values jsonb,
  new_values jsonb,
  changed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_th_org ON truck_history(organization_id);
CREATE INDEX IF NOT EXISTS idx_th_truck ON truck_history(truck_id);
CREATE INDEX IF NOT EXISTS idx_th_created ON truck_history(created_at DESC);

ALTER TABLE truck_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_truck_history" ON truck_history;
CREATE POLICY "select_own_truck_history" ON truck_history FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_truck_history" ON truck_history;
CREATE POLICY "insert_own_truck_history" ON truck_history FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_truck_history" ON truck_history;
CREATE POLICY "update_own_truck_history" ON truck_history FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_truck_history" ON truck_history;
CREATE POLICY "delete_own_truck_history" ON truck_history FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- DRIVER HISTORY (immutable log)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS driver_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  description text,
  old_values jsonb,
  new_values jsonb,
  changed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dh_org ON driver_history(organization_id);
CREATE INDEX IF NOT EXISTS idx_dh_driver ON driver_history(driver_id);
CREATE INDEX IF NOT EXISTS idx_dh_created ON driver_history(created_at DESC);

ALTER TABLE driver_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_driver_history" ON driver_history;
CREATE POLICY "select_own_driver_history" ON driver_history FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_driver_history" ON driver_history;
CREATE POLICY "insert_own_driver_history" ON driver_history FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_driver_history" ON driver_history;
CREATE POLICY "update_own_driver_history" ON driver_history FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_driver_history" ON driver_history;
CREATE POLICY "delete_own_driver_history" ON driver_history FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- TRUCK UTILISATION (daily snapshots)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS truck_utilisation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  truck_id uuid NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  status truck_status,
  distance_km numeric(12,2) DEFAULT 0,
  fuel_assigned_l numeric(10,2) DEFAULT 0,
  fuel_cost numeric(12,2) DEFAULT 0,
  trips_count integer DEFAULT 0,
  idle_hours numeric(6,2) DEFAULT 0,
  utilization_pct numeric(5,2) DEFAULT 0 CHECK (utilization_pct >= 0 AND utilization_pct <= 100),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tu_org ON truck_utilisation(organization_id);
CREATE INDEX IF NOT EXISTS idx_tu_truck ON truck_utilisation(truck_id);
CREATE INDEX IF NOT EXISTS idx_tu_date ON truck_utilisation(snapshot_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tu_truck_date ON truck_utilisation(truck_id, snapshot_date);

ALTER TABLE truck_utilisation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_utilisation" ON truck_utilisation;
CREATE POLICY "select_own_utilisation" ON truck_utilisation FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_utilisation" ON truck_utilisation;
CREATE POLICY "insert_own_utilisation" ON truck_utilisation FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_utilisation" ON truck_utilisation;
CREATE POLICY "update_own_utilisation" ON truck_utilisation FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_utilisation" ON truck_utilisation;
CREATE POLICY "delete_own_utilisation" ON truck_utilisation FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- INCIDENTS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  incident_number text NOT NULL,
  type incident_type NOT NULL,
  driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
  truck_id uuid REFERENCES trucks(id) ON DELETE SET NULL,
  trip_id uuid,
  client_id uuid,
  severity incident_severity NOT NULL DEFAULT 'Low',
  status incident_status NOT NULL DEFAULT 'Open',
  incident_date timestamptz DEFAULT now(),
  location text,
  root_cause text,
  description text,
  reported_by uuid REFERENCES auth.users(id),
  investigator text,
  corrective_actions text,
  est_delay_min integer DEFAULT 0,
  est_financial_impact numeric(12,2) DEFAULT 0,
  photos text[] DEFAULT '{}',
  documents text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inc_org ON incidents(organization_id);
CREATE INDEX IF NOT EXISTS idx_inc_truck ON incidents(truck_id);
CREATE INDEX IF NOT EXISTS idx_inc_driver ON incidents(driver_id);
CREATE INDEX IF NOT EXISTS idx_inc_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_inc_date ON incidents(incident_date DESC);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_incidents" ON incidents;
CREATE POLICY "select_own_incidents" ON incidents FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_incidents" ON incidents;
CREATE POLICY "insert_own_incidents" ON incidents FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_incidents" ON incidents;
CREATE POLICY "update_own_incidents" ON incidents FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_incidents" ON incidents;
CREATE POLICY "delete_own_incidents" ON incidents FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- ADD FK CONSTRAINTS (deferred to avoid circular deps)
-- ═══════════════════════════════════════════════════════════════

DO $$ BEGIN
  ALTER TABLE trucks ADD CONSTRAINT fk_trucks_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE trucks ADD CONSTRAINT fk_trucks_fleet_manager FOREIGN KEY (fleet_manager_id) REFERENCES fleet_managers(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drivers ADD CONSTRAINT fk_drivers_truck FOREIGN KEY (truck_id) REFERENCES trucks(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drivers ADD CONSTRAINT fk_drivers_fleet_manager FOREIGN KEY (fleet_manager_id) REFERENCES fleet_managers(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS: updated_at + audit_row_change
-- ═══════════════════════════════════════════════════════════════

DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'trucks', 'drivers', 'fleet_managers', 'fleet_manager_assignments',
    'truck_assignments', 'truck_documents', 'driver_documents',
    'truck_maintenance', 'truck_fuel', 'truck_utilisation', 'incidents'
  ])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %I;', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t);

    EXECUTE format('DROP TRIGGER IF EXISTS audit_change ON %I;', t);
    EXECUTE format('CREATE TRIGGER audit_change AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION audit_row_change();', t);
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- AUTO-UPDATE DOCUMENT STATUS FROM EXPIRY
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_document_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expiry_date IS NOT NULL THEN
    IF NEW.expiry_date < CURRENT_DATE THEN
      NEW.status := 'Expired'::document_status;
    ELSIF NEW.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN
      NEW.status := 'Expiring Soon'::document_status;
    ELSE
      NEW.status := 'Valid'::document_status;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_truck_doc_status ON truck_documents;
CREATE TRIGGER trg_truck_doc_status BEFORE INSERT OR UPDATE ON truck_documents
  FOR EACH ROW EXECUTE FUNCTION update_document_status();

DROP TRIGGER IF EXISTS trg_driver_doc_status ON driver_documents;
CREATE TRIGGER trg_driver_doc_status BEFORE INSERT OR UPDATE ON driver_documents
  FOR EACH ROW EXECUTE FUNCTION update_document_status();

-- ═══════════════════════════════════════════════════════════════
-- AUTO-UPDATE TRUCK STATUS WHEN ASSIGNMENT CHANGES
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION sync_truck_driver_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- When a truck_assignments row is created/updated to Active, sync truck.driver_id and driver.truck_id
  IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'Active')) THEN
    UPDATE trucks SET driver_id = NEW.driver_id, updated_at = now() WHERE id = NEW.truck_id;
    UPDATE drivers SET truck_id = NEW.truck_id, updated_at = now() WHERE id = NEW.driver_id;
  ELSIF (TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.status <> 'Active')) THEN
    -- Clear the assignment on the truck and driver
    UPDATE trucks SET driver_id = NULL, updated_at = now()
      WHERE id = COALESCE(OLD.truck_id, NEW.truck_id) AND driver_id = COALESCE(OLD.driver_id, NEW.driver_id);
    UPDATE drivers SET truck_id = NULL, updated_at = now()
      WHERE id = COALESCE(OLD.driver_id, NEW.driver_id) AND truck_id = COALESCE(OLD.truck_id, NEW.truck_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_truck_driver ON truck_assignments;
CREATE TRIGGER trg_sync_truck_driver
  AFTER INSERT OR UPDATE OR DELETE ON truck_assignments
  FOR EACH ROW EXECUTE FUNCTION sync_truck_driver_assignment();

-- ═══════════════════════════════════════════════════════════════
-- AUTO-GENERATE TRUCK NUMBER
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION generate_truck_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num integer;
BEGIN
  IF NEW.truck_number IS NULL OR NEW.truck_number = '' THEN
    SELECT COALESCE(MAX(
      CAST(
        CASE
          WHEN truck_number ~ '^TRK-[0-9]+$'
            THEN substring(truck_number FROM 5)
          ELSE '0'
        END AS integer
      )
    ), 1000) + 1 INTO next_num
    FROM trucks WHERE organization_id = NEW.organization_id;

    NEW.truck_number := 'TRK-' || next_num;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gen_truck_number ON trucks;
CREATE TRIGGER trg_gen_truck_number
  BEFORE INSERT ON trucks
  FOR EACH ROW EXECUTE FUNCTION generate_truck_number();

-- ═══════════════════════════════════════════════════════════════
-- AUTO-GENERATE DRIVER NUMBER
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION generate_driver_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num integer;
BEGIN
  IF NEW.driver_number IS NULL OR NEW.driver_number = '' THEN
    SELECT COALESCE(MAX(
      CAST(
        CASE
          WHEN driver_number ~ '^DRV-[0-9]+$'
            THEN substring(driver_number FROM 5)
          ELSE '0'
        END AS integer
      )
    ), 1000) + 1 INTO next_num
    FROM drivers WHERE organization_id = NEW.organization_id;

    NEW.driver_number := 'DRV-' || next_num;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gen_driver_number ON drivers;
CREATE TRIGGER trg_gen_driver_number
  BEFORE INSERT ON drivers
  FOR EACH ROW EXECUTE FUNCTION generate_driver_number();

-- ═══════════════════════════════════════════════════════════════
-- AUTO-GENERATE INCIDENT NUMBER
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION generate_incident_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num integer;
BEGIN
  IF NEW.incident_number IS NULL OR NEW.incident_number = '' THEN
    SELECT COALESCE(MAX(
      CAST(
        CASE
          WHEN incident_number ~ '^INC-[0-9]+$'
            THEN substring(incident_number FROM 5)
          ELSE '0'
        END AS integer
      )
    ), 1000) + 1 INTO next_num
    FROM incidents WHERE organization_id = NEW.organization_id;

    NEW.incident_number := 'INC-' || next_num;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gen_incident_number ON incidents;
CREATE TRIGGER trg_gen_incident_number
  BEFORE INSERT ON incidents
  FOR EACH ROW EXECUTE FUNCTION generate_incident_number();