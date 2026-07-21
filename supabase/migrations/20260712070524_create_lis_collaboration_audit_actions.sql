/*
# LIS Operational Collaboration, Audit Trail & Action Center

## Summary
This migration creates the three core tables that transform LIS from a dashboard into
a full operational system:

1. **operational_comments** — Threaded collaboration on any entity (trips, trucks, drivers,
   incidents, maintenance, clients, routes, fuel reviews). Supports @mentions, file attachments,
   and reply threading. Forms the permanent operational history.

2. **audit_trail** — Every operational change automatically creates an immutable audit record
   tracking who changed what, when, the previous value, and the new value.

3. **action_items** — Aggregated operational actions requiring attention, grouped by priority
   (High / Medium / Low). Drives the Action Center module.

## New Tables

### operational_comments
- `id` — UUID primary key
- `entity_type` — Which module this comment belongs to (trip, truck, driver, incident, etc.)
- `entity_id` — The ID of the specific record being commented on
- `parent_id` — NULL for top-level comments, set for replies (self-referencing FK)
- `author_name` — Display name of the user who wrote the comment
- `author_role` — Their role (Fleet Manager, Driver, Operations etc.)
- `author_initials` — 2-letter initials for avatar display
- `body` — The comment text (supports @mentions inline)
- `mentions` — JSONB array of mentioned user names
- `attachments` — JSONB array of {name, url, type, size} objects
- `created_at` — When the comment was created

### audit_trail
- `id` — UUID primary key
- `entity_type` — Module/entity type that was changed
- `entity_id` — ID of the changed record
- `entity_label` — Human-readable label (e.g. "Trip TRP-001")
- `action` — What happened (Created, Updated, Status Changed, etc.)
- `field_name` — Which field was changed (NULL for creates/deletes)
- `previous_value` — Value before the change (NULL for creates)
- `new_value` — Value after the change (NULL for deletes)
- `changed_by` — Name of the user who made the change
- `changed_by_role` — Their role at time of change
- `module` — Application module (Trips, Fleet, Incidents, etc.)
- `notes` — Optional context/reason for the change
- `created_at` — Timestamp of the change

### action_items
- `id` — UUID primary key
- `title` — Short action description
- `detail` — Full explanation of what needs to be done
- `priority` — High | Medium | Low
- `category` — Type of action (Maintenance Due, Incident, License Expiry, etc.)
- `entity_type` — Related entity type
- `entity_id` — Related entity ID
- `entity_label` — Human-readable entity label
- `due_date` — When this action must be completed (NULL if no hard deadline)
- `status` — open | in_progress | resolved | dismissed
- `assigned_to` — Who is responsible for this action
- `module` — Which module this action came from
- `auto_generated` — Whether this was system-generated vs manually created
- `created_at` / `resolved_at` — Lifecycle timestamps

## Security
- RLS enabled on all three tables.
- All policies are TO anon, authenticated (no sign-in screen in this app).
- All data is intentionally shared/organizational — no per-user row isolation needed.

## Notes
- Indexes on entity_type + entity_id for fast profile panel lookups
- Indexes on audit_trail module and changed_by for searchable logs
- action_items indexed by priority and status for Action Center views
*/

-- ============================================================
-- 1. operational_comments
-- ============================================================
CREATE TABLE IF NOT EXISTS operational_comments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type  text NOT NULL,
  entity_id    text NOT NULL,
  parent_id    uuid REFERENCES operational_comments(id) ON DELETE CASCADE,
  author_name  text NOT NULL DEFAULT 'Operations Team',
  author_role  text NOT NULL DEFAULT 'Fleet Manager',
  author_initials text NOT NULL DEFAULT 'OT',
  body         text NOT NULL,
  mentions     jsonb NOT NULL DEFAULT '[]',
  attachments  jsonb NOT NULL DEFAULT '[]',
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE operational_comments ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_comments_entity
  ON operational_comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent
  ON operational_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created
  ON operational_comments(created_at DESC);

DROP POLICY IF EXISTS "anon_select_comments" ON operational_comments;
CREATE POLICY "anon_select_comments" ON operational_comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_comments" ON operational_comments;
CREATE POLICY "anon_insert_comments" ON operational_comments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_comments" ON operational_comments;
CREATE POLICY "anon_update_comments" ON operational_comments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_comments" ON operational_comments;
CREATE POLICY "anon_delete_comments" ON operational_comments FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 2. audit_trail
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_trail (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type      text NOT NULL,
  entity_id        text NOT NULL,
  entity_label     text NOT NULL DEFAULT '',
  action           text NOT NULL,
  field_name       text,
  previous_value   text,
  new_value        text,
  changed_by       text NOT NULL DEFAULT 'System',
  changed_by_role  text NOT NULL DEFAULT 'System',
  module           text NOT NULL DEFAULT 'Operations',
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_audit_entity
  ON audit_trail(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_module
  ON audit_trail(module);
CREATE INDEX IF NOT EXISTS idx_audit_changed_by
  ON audit_trail(changed_by);
CREATE INDEX IF NOT EXISTS idx_audit_created
  ON audit_trail(created_at DESC);

DROP POLICY IF EXISTS "anon_select_audit" ON audit_trail;
CREATE POLICY "anon_select_audit" ON audit_trail FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_audit" ON audit_trail;
CREATE POLICY "anon_insert_audit" ON audit_trail FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Audit trail is immutable — no update/delete policies intentionally.

-- ============================================================
-- 3. action_items
-- ============================================================
CREATE TABLE IF NOT EXISTS action_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  detail          text NOT NULL DEFAULT '',
  priority        text NOT NULL DEFAULT 'Medium'
                  CHECK (priority IN ('High', 'Medium', 'Low')),
  category        text NOT NULL DEFAULT 'General',
  entity_type     text,
  entity_id       text,
  entity_label    text,
  due_date        date,
  status          text NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open', 'in_progress', 'resolved', 'dismissed')),
  assigned_to     text NOT NULL DEFAULT 'Operations Team',
  module          text NOT NULL DEFAULT 'Operations',
  auto_generated  boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  resolved_at     timestamptz
);

ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_actions_priority_status
  ON action_items(priority, status);
CREATE INDEX IF NOT EXISTS idx_actions_entity
  ON action_items(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_actions_due_date
  ON action_items(due_date);
CREATE INDEX IF NOT EXISTS idx_actions_created
  ON action_items(created_at DESC);

DROP POLICY IF EXISTS "anon_select_actions" ON action_items;
CREATE POLICY "anon_select_actions" ON action_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_actions" ON action_items;
CREATE POLICY "anon_insert_actions" ON action_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_actions" ON action_items;
CREATE POLICY "anon_update_actions" ON action_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_actions" ON action_items;
CREATE POLICY "anon_delete_actions" ON action_items FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 4. Seed initial action items from existing operational data
-- ============================================================
INSERT INTO action_items (title, detail, priority, category, entity_type, entity_id, entity_label, due_date, assigned_to, module, auto_generated)
VALUES
  ('Driver license expiring', 'Driver Tunde A. license expires in 7 days. Renewal must be initiated immediately.', 'High', 'License Expiry', 'driver', 'DRV-004', 'Tunde Adeyemi', CURRENT_DATE + 7, 'Compliance Team', 'Fleet', true),
  ('Insurance expiring', 'Insurance for GGE 543RT expires in 5 days. Vehicle must be grounded if not renewed.', 'High', 'Insurance Expiry', 'truck', 'TRK-1005', 'GGE 543RT', CURRENT_DATE + 5, 'Finance Team', 'Fleet', true),
  ('Fuel cost variance', 'Fuel cost increased 8.4% vs last week. Investigation required.', 'High', 'Fuel Review', 'fuel', NULL, 'Fleet-wide', CURRENT_DATE + 1, 'Fleet Manager', 'Fuel Intelligence', true),
  ('Delivery delayed', 'Trip TRP-7382 to ABC Stores is delayed beyond SLA window.', 'High', 'Delayed Trip', 'trip', 'TRP-7382', 'Trip TRP-7382', CURRENT_DATE, 'Operations Team', 'Trips', true),
  ('Maintenance due', 'Truck KJA 89XY is due for scheduled maintenance in 3 days.', 'Medium', 'Maintenance Due', 'truck', 'TRK-1002', 'KJA 89XY', CURRENT_DATE + 3, 'Maintenance Team', 'Maintenance', true),
  ('On-time delivery below target', '11 deliveries delayed this week. Target is < 5% delay rate.', 'Medium', 'KPI Below Target', 'kpi', NULL, 'Delivery KPI', CURRENT_DATE + 2, 'Operations Lead', 'Operations', true),
  ('10 vehicles due for service', 'Scheduled maintenance overdue or due within 7 days for 10 vehicles.', 'Medium', 'Maintenance Due', 'maintenance', NULL, 'Fleet Maintenance', CURRENT_DATE + 7, 'Maintenance Supervisor', 'Maintenance', true),
  ('Document compliance review', '5 documents and permits expiring within 7 days.', 'Low', 'Document Expiry', 'document', NULL, 'Fleet Documents', CURRENT_DATE + 7, 'Compliance Officer', 'Documents', true),
  ('Compliance score review', 'Overall compliance score is 94%. Review expiring permits to reach 95% target.', 'Low', 'Compliance', 'compliance', NULL, 'Fleet Compliance', CURRENT_DATE + 14, 'Compliance Officer', 'Documents', true)
ON CONFLICT DO NOTHING;
