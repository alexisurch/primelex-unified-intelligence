/*
# Operations Core Schema — Clients, Routes, Trips

## Summary
Creates the complete operational backend: clients, client contacts, routes,
trips, trip timeline, trip documents, trip costs, and trip delays.
Links clients, routes, trips, drivers, fleet managers, and trucks together.
Every table is organisation-scoped with RLS using current_org_ids().
Every table has audit triggers via audit_row_change().

## New Tables
1. clients — client/company records with industry, contact, status
2. client_contacts — additional contacts per client
3. routes — route definitions with origin, destination, distance
4. trips — trip records linking client, route, truck, driver, fleet manager
5. trip_timeline — immutable timeline events per trip (status changes, ETA updates)
6. trip_documents — documents attached to trips (waybills, invoices, delivery notes)
7. trip_costs — financial breakdown per trip (fuel, revenue, expenses, margin)
8. trip_delays — delay records with reason, duration, impact

## Enums
- client_status: Active, Prospect, Inactive
- trip_status: Scheduled, In Transit, Delivered, Delayed, Cancelled
- trip_priority: Low, Medium, High, Critical
- tracking_mode_enum: GPS, Manual
- timeline_event_type: Status Change, ETA Update, Assignment Change, Departure, Arrival, Delay, Note, Document Upload
- trip_document_type: Waybill, Invoice, Delivery Note, Proof of Delivery, Other
*/

-- ═══════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════

DO $$ BEGIN
  CREATE TYPE client_status AS ENUM ('Active', 'Prospect', 'Inactive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE trip_status AS ENUM ('Scheduled', 'In Transit', 'Delivered', 'Delayed', 'Cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE trip_priority AS ENUM ('Low', 'Medium', 'High', 'Critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tracking_mode_enum AS ENUM ('GPS', 'Manual');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE timeline_event_type AS ENUM ('Status Change', 'ETA Update', 'Assignment Change', 'Departure', 'Arrival', 'Delay', 'Note', 'Document Upload');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE trip_document_type AS ENUM ('Waybill', 'Invoice', 'Delivery Note', 'Proof of Delivery', 'Other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ═══════════════════════════════════════════════════════════════
-- CLIENTS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_number text,
  name text NOT NULL,
  contact_name text,
  phone text,
  email text,
  address text,
  industry text,
  status client_status NOT NULL DEFAULT 'Active',
  archived boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clients_org ON clients(organization_id);
CREATE INDEX IF NOT EXISTS idx_clients_org_status ON clients(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_org_name ON clients(organization_id, name);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_clients" ON clients;
CREATE POLICY "select_own_clients" ON clients FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_clients" ON clients;
CREATE POLICY "insert_own_clients" ON clients FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_clients" ON clients;
CREATE POLICY "update_own_clients" ON clients FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_clients" ON clients;
CREATE POLICY "delete_own_clients" ON clients FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- CLIENT CONTACTS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS client_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text,
  phone text,
  email text,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cc_org ON client_contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_cc_client ON client_contacts(client_id);

ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_client_contacts" ON client_contacts;
CREATE POLICY "select_own_client_contacts" ON client_contacts FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_client_contacts" ON client_contacts;
CREATE POLICY "insert_own_client_contacts" ON client_contacts FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_client_contacts" ON client_contacts;
CREATE POLICY "update_own_client_contacts" ON client_contacts FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_client_contacts" ON client_contacts;
CREATE POLICY "delete_own_client_contacts" ON client_contacts FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- ROUTES
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  route_number text,
  name text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  distance_km numeric(10,2),
  estimated_duration_min integer,
  road_type text,
  terrain text,
  fuel_estimate_l numeric(10,2),
  toll_cost numeric(10,2) DEFAULT 0,
  status text DEFAULT 'Active',
  archived boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_routes_org ON routes(organization_id);
CREATE INDEX IF NOT EXISTS idx_routes_name ON routes(name);
CREATE INDEX IF NOT EXISTS idx_routes_org_dest ON routes(organization_id, origin, destination);
CREATE UNIQUE INDEX IF NOT EXISTS idx_routes_org_name ON routes(organization_id, name);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_routes" ON routes;
CREATE POLICY "select_own_routes" ON routes FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_routes" ON routes;
CREATE POLICY "insert_own_routes" ON routes FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_routes" ON routes;
CREATE POLICY "update_own_routes" ON routes FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_routes" ON routes;
CREATE POLICY "delete_own_routes" ON routes FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- TRIPS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  trip_number text,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  route_id uuid REFERENCES routes(id) ON DELETE SET NULL,
  truck_id uuid REFERENCES trucks(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
  fleet_manager_id uuid REFERENCES fleet_managers(id) ON DELETE SET NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  status trip_status NOT NULL DEFAULT 'Scheduled',
  priority trip_priority DEFAULT 'Medium',
  progress numeric(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  distance_km numeric(10,2) DEFAULT 0,
  stops integer DEFAULT 0,
  cargo_description text,
  cargo_weight_kg numeric(10,2),
  eta timestamptz,
  actual_arrival timestamptz,
  departure_time timestamptz,
  delivery_time timestamptz,
  receiver_name text,
  proof_of_delivery text,
  delivery_notes text,
  tracking_mode tracking_mode_enum DEFAULT 'GPS',
  fuel_assigned_l numeric(10,2) DEFAULT 0,
  fuel_cost numeric(12,2) DEFAULT 0,
  other_expenses numeric(12,2) DEFAULT 0,
  revenue numeric(12,2) DEFAULT 0,
  estimated_margin numeric(12,2) GENERATED ALWAYS AS (revenue - fuel_cost - other_expenses) STORED,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trips_org ON trips(organization_id);
CREATE INDEX IF NOT EXISTS idx_trips_org_status ON trips(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_trips_client ON trips(client_id);
CREATE INDEX IF NOT EXISTS idx_trips_route ON trips(route_id);
CREATE INDEX IF NOT EXISTS idx_trips_truck ON trips(truck_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver ON trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_eta ON trips(eta);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_trips" ON trips;
CREATE POLICY "select_own_trips" ON trips FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_trips" ON trips;
CREATE POLICY "insert_own_trips" ON trips FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_trips" ON trips;
CREATE POLICY "update_own_trips" ON trips FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_trips" ON trips;
CREATE POLICY "delete_own_trips" ON trips FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- TRIP TIMELINE (immutable event log)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS trip_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  event_type timeline_event_type NOT NULL,
  description text,
  old_value text,
  new_value text,
  metadata jsonb,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tl_org ON trip_timeline(organization_id);
CREATE INDEX IF NOT EXISTS idx_tl_trip ON trip_timeline(trip_id);
CREATE INDEX IF NOT EXISTS idx_tl_created ON trip_timeline(created_at DESC);

ALTER TABLE trip_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_trip_timeline" ON trip_timeline;
CREATE POLICY "select_own_trip_timeline" ON trip_timeline FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_trip_timeline" ON trip_timeline;
CREATE POLICY "insert_own_trip_timeline" ON trip_timeline FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_trip_timeline" ON trip_timeline;
CREATE POLICY "update_own_trip_timeline" ON trip_timeline FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_trip_timeline" ON trip_timeline;
CREATE POLICY "delete_own_trip_timeline" ON trip_timeline FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- TRIP DOCUMENTS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS trip_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name text NOT NULL,
  document_type trip_document_type NOT NULL DEFAULT 'Other',
  file_path text,
  file_size bigint,
  mime_type text,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tdoc_org ON trip_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_tdoc_trip ON trip_documents(trip_id);

ALTER TABLE trip_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_trip_docs" ON trip_documents;
CREATE POLICY "select_own_trip_docs" ON trip_documents FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_trip_docs" ON trip_documents;
CREATE POLICY "insert_own_trip_docs" ON trip_documents FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_trip_docs" ON trip_documents;
CREATE POLICY "update_own_trip_docs" ON trip_documents FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_trip_docs" ON trip_documents;
CREATE POLICY "delete_own_trip_docs" ON trip_documents FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- TRIP COSTS (detailed financial breakdown)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS trip_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  cost_type text NOT NULL,
  description text,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  incurred_date timestamptz DEFAULT now(),
  recorded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tc_org ON trip_costs(organization_id);
CREATE INDEX IF NOT EXISTS idx_tc_trip ON trip_costs(trip_id);

ALTER TABLE trip_costs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_trip_costs" ON trip_costs;
CREATE POLICY "select_own_trip_costs" ON trip_costs FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_trip_costs" ON trip_costs;
CREATE POLICY "insert_own_trip_costs" ON trip_costs FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_trip_costs" ON trip_costs;
CREATE POLICY "update_own_trip_costs" ON trip_costs FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_trip_costs" ON trip_costs;
CREATE POLICY "delete_own_trip_costs" ON trip_costs FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- TRIP DELAYS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS trip_delays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  reason text NOT NULL,
  delay_minutes integer NOT NULL DEFAULT 0,
  impact text,
  reported_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tdel_org ON trip_delays(organization_id);
CREATE INDEX IF NOT EXISTS idx_tdel_trip ON trip_delays(trip_id);

ALTER TABLE trip_delays ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_trip_delays" ON trip_delays;
CREATE POLICY "select_own_trip_delays" ON trip_delays FOR SELECT
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "insert_own_trip_delays" ON trip_delays;
CREATE POLICY "insert_own_trip_delays" ON trip_delays FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "update_own_trip_delays" ON trip_delays;
CREATE POLICY "update_own_trip_delays" ON trip_delays FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()))
  WITH CHECK (organization_id IN (SELECT current_org_ids()));

DROP POLICY IF EXISTS "delete_own_trip_delays" ON trip_delays;
CREATE POLICY "delete_own_trip_delays" ON trip_delays FOR DELETE
  TO authenticated USING (organization_id IN (SELECT current_org_ids()));

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS: updated_at + audit_row_change
-- ═══════════════════════════════════════════════════════════════

DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'clients', 'client_contacts', 'routes', 'trips',
    'trip_timeline', 'trip_documents', 'trip_costs', 'trip_delays'
  ])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %I;', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t);

    EXECUTE format('DROP TRIGGER IF EXISTS audit_change ON %I;', t);
    EXECUTE format('CREATE TRIGGER audit_change AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION audit_row_change();', t);
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- AUTO-GENERATE NUMBERS
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION generate_client_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num integer;
BEGIN
  IF NEW.client_number IS NULL OR NEW.client_number = '' THEN
    SELECT COALESCE(MAX(
      CAST(
        CASE
          WHEN client_number ~ '^CLT-[0-9]+$'
            THEN substring(client_number FROM 5)
          ELSE '0'
        END AS integer
      )
    ), 1000) + 1 INTO next_num
    FROM clients WHERE organization_id = NEW.organization_id;

    NEW.client_number := 'CLT-' || next_num;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gen_client_number ON clients;
CREATE TRIGGER trg_gen_client_number
  BEFORE INSERT ON clients
  FOR EACH ROW EXECUTE FUNCTION generate_client_number();

CREATE OR REPLACE FUNCTION generate_route_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num integer;
BEGIN
  IF NEW.route_number IS NULL OR NEW.route_number = '' THEN
    SELECT COALESCE(MAX(
      CAST(
        CASE
          WHEN route_number ~ '^RT-[0-9]+$'
            THEN substring(route_number FROM 5)
          ELSE '0'
        END AS integer
      )
    ), 200) + 1 INTO next_num
    FROM routes WHERE organization_id = NEW.organization_id;

    NEW.route_number := 'RT-' || next_num;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gen_route_number ON routes;
CREATE TRIGGER trg_gen_route_number
  BEFORE INSERT ON routes
  FOR EACH ROW EXECUTE FUNCTION generate_route_number();

CREATE OR REPLACE FUNCTION generate_trip_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num integer;
BEGIN
  IF NEW.trip_number IS NULL OR NEW.trip_number = '' THEN
    SELECT COALESCE(MAX(
      CAST(
        CASE
          WHEN trip_number ~ '^TRP-[0-9]+$'
            THEN substring(trip_number FROM 5)
          ELSE '0'
        END AS integer
      )
    ), 1000) + 1 INTO next_num
    FROM trips WHERE organization_id = NEW.organization_id;

    NEW.trip_number := 'TRP-' || next_num;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gen_trip_number ON trips;
CREATE TRIGGER trg_gen_trip_number
  BEFORE INSERT ON trips
  FOR EACH ROW EXECUTE FUNCTION generate_trip_number();

-- ═══════════════════════════════════════════════════════════════
-- AUTO-CREATE TRIP TIMELINE ON STATUS/ETA CHANGE
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION log_trip_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO trip_timeline (organization_id, trip_id, event_type, description, new_value, created_by)
    VALUES (NEW.organization_id, NEW.id, 'Status Change'::timeline_event_type, 'Trip created', NEW.status::text, NEW.created_by);
  ELSIF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO trip_timeline (organization_id, trip_id, event_type, description, old_value, new_value)
    VALUES (NEW.organization_id, NEW.id, 'Status Change'::timeline_event_type,
      'Status changed from ' || OLD.status::text || ' to ' || NEW.status::text,
      OLD.status::text, NEW.status::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_trip_status_log ON trips;
CREATE TRIGGER trg_trip_status_log
  AFTER INSERT OR UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION log_trip_status_change();

CREATE OR REPLACE FUNCTION log_trip_eta_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.eta IS DISTINCT FROM OLD.eta THEN
    INSERT INTO trip_timeline (organization_id, trip_id, event_type, description, old_value, new_value)
    VALUES (NEW.organization_id, NEW.id, 'ETA Update'::timeline_event_type,
      'ETA updated', OLD.eta::text, NEW.eta::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_trip_eta_log ON trips;
CREATE TRIGGER trg_trip_eta_log
  AFTER UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION log_trip_eta_change();

-- ═══════════════════════════════════════════════════════════════
-- AUTO-UPDATE TRUCK STATUS ON TRIP STATUS CHANGE
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION sync_truck_status_from_trip()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.truck_id IS NOT NULL AND NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'In Transit'::trip_status THEN
      UPDATE trucks SET status = 'On The Road'::truck_status, updated_at = now() WHERE id = NEW.truck_id;
    ELSIF NEW.status = 'Delivered'::trip_status OR NEW.status = 'Cancelled'::trip_status THEN
      UPDATE trucks SET status = 'Idle'::truck_status, updated_at = now() WHERE id = NEW.truck_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_truck_trip ON trips;
CREATE TRIGGER trg_sync_truck_trip
  AFTER UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION sync_truck_status_from_trip();

-- ═══════════════════════════════════════════════════════════════
-- LINK incidents/truck_fuel to trips/clients via FK (deferred)
-- ═══════════════════════════════════════════════════════════════

DO $$ BEGIN
  ALTER TABLE incidents ADD CONSTRAINT fk_incidents_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE incidents ADD CONSTRAINT fk_incidents_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE truck_fuel ADD CONSTRAINT fk_truck_fuel_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE trucks ADD CONSTRAINT fk_trucks_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;