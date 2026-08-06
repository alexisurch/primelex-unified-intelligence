/*
# Fleet & Operations Summary Views and Computed Functions

## Summary
Creates database views that compute the summary metrics the UI needs:
truck health, maintenance spend, fuel summaries, incident summaries,
driver performance, fleet manager performance, route statistics,
and client statistics. Also creates a fleet KPIs function.

## New Objects
1. truck_health_summary VIEW — per-truck computed health metrics
2. truck_maintenance_summary VIEW — per-truck maintenance aggregates
3. truck_fuel_summary VIEW — per-truck fuel aggregates
4. truck_incident_summary VIEW — per-truck incident aggregates
5. truck_profile VIEW — enriched truck record with joined driver/fleet manager names
6. driver_performance VIEW — per-driver computed performance metrics
7. fleet_manager_performance VIEW — per-manager computed KPIs
8. route_statistics VIEW — per-route historical statistics
9. client_statistics VIEW — per-client operational statistics
10. fleet_kpis FUNCTION — organisation-level fleet KPI counts
*/

-- ═══════════════════════════════════════════════════════════════
-- TRUCK HEALTH SUMMARY
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW truck_health_summary AS
SELECT
  t.id,
  t.organization_id,
  t.truck_number,
  t.engine_health,
  COALESCE(m.maintenance_count, 0) AS maintenance_count,
  COALESCE(m.total_maintenance_cost, 0) AS total_maintenance_cost,
  COALESCE(m.avg_repair_cost, 0) AS avg_repair_cost,
  COALESCE(m.avg_downtime_hours, 0) AS avg_downtime_hours,
  COALESCE(m.mtbr_days, 0) AS mtbr_days,
  COALESCE(i.incident_count, 0) AS incident_count,
  CASE
    WHEN t.engine_health >= 80 THEN 'Good'
    WHEN t.engine_health >= 50 THEN 'Fair'
    ELSE 'Poor'
  END AS health_label
FROM trucks t
LEFT JOIN (
  SELECT
    truck_id,
    COUNT(*) AS maintenance_count,
    SUM(cost) AS total_maintenance_cost,
    AVG(cost) AS avg_repair_cost,
    AVG(EXTRACT(EPOCH FROM (COALESCE(service_date, due_date) - created_at)) / 3600) AS avg_downtime_hours,
    CASE
      WHEN COUNT(*) > 1 THEN EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) / 86400 / COUNT(*)
      ELSE 0
    END AS mtbr_days
  FROM truck_maintenance
  GROUP BY truck_id
) m ON m.truck_id = t.id
LEFT JOIN (
  SELECT truck_id, COUNT(*) AS incident_count
  FROM incidents
  GROUP BY truck_id
) i ON i.truck_id = t.id
WHERE t.archived = false;

-- ═══════════════════════════════════════════════════════════════
-- TRUCK MAINTENANCE SUMMARY
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW truck_maintenance_summary AS
SELECT
  truck_id,
  COUNT(*) AS total_records,
  COUNT(*) FILTER (WHERE status = 'Scheduled') AS scheduled,
  COUNT(*) FILTER (WHERE status = 'In Workshop') AS in_workshop,
  COUNT(*) FILTER (WHERE status = 'Completed') AS completed,
  COUNT(*) FILTER (WHERE status = 'Overdue') AS overdue,
  SUM(cost) AS total_cost,
  AVG(cost) AS avg_cost,
  MAX(service_date) AS last_service
FROM truck_maintenance
GROUP BY truck_id;

-- ═══════════════════════════════════════════════════════════════
-- TRUCK FUEL SUMMARY
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW truck_fuel_summary AS
SELECT
  truck_id,
  COUNT(*) AS total_transactions,
  SUM(quantity) AS total_fuel_l,
  SUM(total_amount) AS total_fuel_cost,
  AVG(unit_price) AS avg_unit_price,
  SUM(quantity) FILTER (WHERE transaction_date >= date_trunc('week', now())) AS weekly_fuel_l,
  SUM(total_amount) FILTER (WHERE transaction_date >= date_trunc('week', now())) AS weekly_fuel_cost,
  SUM(quantity) FILTER (WHERE transaction_date >= CURRENT_DATE) AS daily_fuel_l,
  SUM(total_amount) FILTER (WHERE transaction_date >= CURRENT_DATE) AS daily_fuel_cost
FROM truck_fuel
GROUP BY truck_id;

-- ═══════════════════════════════════════════════════════════════
-- TRUCK INCIDENT SUMMARY
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW truck_incident_summary AS
SELECT
  truck_id,
  COUNT(*) AS total_incidents,
  COUNT(*) FILTER (WHERE severity IN ('High', 'Critical')) AS critical_incidents,
  COUNT(*) FILTER (WHERE status = 'Open') AS open_incidents,
  COUNT(*) FILTER (WHERE status = 'Investigating') AS investigating,
  COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved,
  SUM(est_financial_impact) AS total_financial_impact,
  SUM(est_delay_min) AS total_delay_minutes
FROM incidents
WHERE truck_id IS NOT NULL
GROUP BY truck_id;

-- ═══════════════════════════════════════════════════════════════
-- TRUCK PROFILE (enriched with joins)
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW truck_profile AS
SELECT
  t.*,
  d.name AS driver_name,
  d.driver_number AS driver_number,
  d.license_number AS driver_license,
  d.license_expiry AS driver_license_expiry,
  d.phone AS driver_phone,
  d.safety_score AS driver_safety_score,
  fm.name AS fleet_manager_name,
  fm.employee_id AS fleet_manager_employee_id,
  r.name AS route_name,
  r.route_number AS route_number,
  COALESCE(tr.total_trips, 0) AS total_trips,
  COALESCE(tr.total_distance, 0) AS total_distance,
  COALESCE(fs.total_fuel_l, 0) AS total_fuel_l,
  COALESCE(fs.total_fuel_cost, 0) AS total_fuel_cost,
  COALESCE(ms.total_cost, 0) AS maintenance_spend,
  COALESCE(ms.total_records, 0) AS maintenance_records,
  COALESCE(inc.total_incidents, 0) AS total_incidents
FROM trucks t
LEFT JOIN drivers d ON d.id = t.driver_id
LEFT JOIN fleet_managers fm ON fm.id = t.fleet_manager_id
LEFT JOIN routes r ON r.id = t.route_id
LEFT JOIN (
  SELECT truck_id, COUNT(*) AS total_trips, SUM(distance_km) AS total_distance
  FROM trips GROUP BY truck_id
) tr ON tr.truck_id = t.id
LEFT JOIN truck_fuel_summary fs ON fs.truck_id = t.id
LEFT JOIN truck_maintenance_summary ms ON ms.truck_id = t.id
LEFT JOIN truck_incident_summary inc ON inc.truck_id = t.id;

-- ═══════════════════════════════════════════════════════════════
-- DRIVER PERFORMANCE
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW driver_performance AS
SELECT
  d.*,
  t.truck_number AS truck_number,
  t.plate AS truck_plate,
  COALESCE(tr.completed_trips, 0) AS completed_trips,
  COALESCE(tr.active_trips, 0) AS active_trips,
  COALESCE(tr.total_distance, 0) AS total_distance,
  COALESCE(fs.total_fuel_l, 0) AS total_fuel_l,
  COALESCE(fs.total_fuel_cost, 0) AS total_fuel_cost,
  COALESCE(inc.total_incidents, 0) AS total_incidents,
  COALESCE(inc.critical_incidents, 0) AS critical_incidents
FROM drivers d
LEFT JOIN trucks t ON t.id = d.truck_id
LEFT JOIN (
  SELECT driver_id,
    COUNT(*) FILTER (WHERE status = 'Delivered') AS completed_trips,
    COUNT(*) FILTER (WHERE status IN ('In Transit', 'Scheduled', 'Delayed')) AS active_trips,
    SUM(distance_km) AS total_distance
  FROM trips GROUP BY driver_id
) tr ON tr.driver_id = d.id
LEFT JOIN (
  SELECT
    tf.driver_id,
    SUM(quantity) AS total_fuel_l,
    SUM(total_amount) AS total_fuel_cost
  FROM truck_fuel tf WHERE tf.driver_id IS NOT NULL
  GROUP BY tf.driver_id
) fs ON fs.driver_id = d.id
LEFT JOIN (
  SELECT driver_id,
    COUNT(*) AS total_incidents,
    COUNT(*) FILTER (WHERE severity IN ('High', 'Critical')) AS critical_incidents
  FROM incidents WHERE driver_id IS NOT NULL
  GROUP BY driver_id
) inc ON inc.driver_id = d.id
WHERE d.archived = false;

-- ═══════════════════════════════════════════════════════════════
-- FLEET MANAGER PERFORMANCE
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW fleet_manager_performance AS
SELECT
  fm.*,
  COALESCE(ass.assigned_trucks, 0) AS assigned_trucks,
  COALESCE(ass.assigned_drivers, 0) AS assigned_drivers,
  COALESCE(tr.active_trips, 0) AS active_trips,
  COALESCE(tr.completed_trips, 0) AS completed_trips,
  COALESCE(tr.delayed_trips, 0) AS delayed_trips,
  COALESCE(tr.total_distance, 0) AS total_distance,
  COALESCE(fs.total_fuel_l, 0) AS total_fuel_l,
  COALESCE(fs.total_fuel_cost, 0) AS total_fuel_cost,
  COALESCE(ms.upcoming, 0) AS upcoming_maintenance,
  COALESCE(ms.overdue, 0) AS overdue_maintenance,
  COALESCE(inc.open_incidents, 0) AS open_incidents
FROM fleet_managers fm
LEFT JOIN (
  SELECT fleet_manager_id,
    COUNT(DISTINCT truck_id) AS assigned_trucks,
    COUNT(DISTINCT driver_id) AS assigned_drivers
  FROM truck_assignments WHERE status = 'Active'
  GROUP BY fleet_manager_id
) ass ON ass.fleet_manager_id = fm.id
LEFT JOIN (
  SELECT fleet_manager_id,
    COUNT(*) FILTER (WHERE status IN ('In Transit', 'Scheduled')) AS active_trips,
    COUNT(*) FILTER (WHERE status = 'Delivered') AS completed_trips,
    COUNT(*) FILTER (WHERE status = 'Delayed') AS delayed_trips,
    SUM(distance_km) AS total_distance
  FROM trips WHERE fleet_manager_id IS NOT NULL
  GROUP BY fleet_manager_id
) tr ON tr.fleet_manager_id = fm.id
LEFT JOIN (
  SELECT
    ta.fleet_manager_id,
    SUM(tf.quantity) AS total_fuel_l,
    SUM(tf.total_amount) AS total_fuel_cost
  FROM truck_fuel tf
  JOIN truck_assignments ta ON ta.truck_id = tf.truck_id AND ta.status = 'Active'
  WHERE ta.fleet_manager_id IS NOT NULL
  GROUP BY ta.fleet_manager_id
) fs ON fs.fleet_manager_id = fm.id
LEFT JOIN (
  SELECT
    ta.fleet_manager_id,
    COUNT(*) FILTER (WHERE tm.status = 'Scheduled') AS upcoming,
    COUNT(*) FILTER (WHERE tm.status = 'Overdue') AS overdue
  FROM truck_maintenance tm
  JOIN truck_assignments ta ON ta.truck_id = tm.truck_id AND ta.status = 'Active'
  WHERE ta.fleet_manager_id IS NOT NULL
  GROUP BY ta.fleet_manager_id
) ms ON ms.fleet_manager_id = fm.id
LEFT JOIN (
  SELECT
    ta.fleet_manager_id,
    COUNT(*) AS open_incidents
  FROM incidents inc
  JOIN truck_assignments ta ON ta.truck_id = inc.truck_id AND ta.status = 'Active'
  WHERE inc.status = 'Open' AND ta.fleet_manager_id IS NOT NULL
  GROUP BY ta.fleet_manager_id
) inc ON inc.fleet_manager_id = fm.id
WHERE fm.archived = false;

-- ═══════════════════════════════════════════════════════════════
-- ROUTE STATISTICS
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW route_statistics AS
SELECT
  r.*,
  COALESCE(tr.active_trips, 0) AS active_trips,
  COALESCE(tr.completed_trips, 0) AS completed_trips,
  COALESCE(tr.total_distance, 0) AS total_distance,
  COALESCE(tr.total_fuel_l, 0) AS total_fuel_l,
  COALESCE(tr.total_fuel_cost, 0) AS total_fuel_cost,
  COALESCE(tr.avg_fuel_l, 0) AS avg_fuel_per_trip,
  COALESCE(tr.avg_duration_min, 0) AS avg_duration_min,
  COALESCE(tr.delay_count, 0) AS delay_count,
  COALESCE(cl.client_count, 0) AS clients_served,
  COALESCE(inc.incident_count, 0) AS total_incidents
FROM routes r
LEFT JOIN (
  SELECT route_id,
    COUNT(*) FILTER (WHERE status IN ('In Transit', 'Scheduled')) AS active_trips,
    COUNT(*) FILTER (WHERE status = 'Delivered') AS completed_trips,
    SUM(distance_km) AS total_distance,
    SUM(fuel_assigned_l) AS total_fuel_l,
    SUM(fuel_cost) AS total_fuel_cost,
    AVG(fuel_assigned_l) AS avg_fuel_l,
    AVG(EXTRACT(EPOCH FROM (COALESCE(actual_arrival, eta) - departure_time)) / 60)::integer AS avg_duration_min,
    COUNT(*) FILTER (WHERE status = 'Delayed') AS delay_count
  FROM trips WHERE route_id IS NOT NULL
  GROUP BY route_id
) tr ON tr.route_id = r.id
LEFT JOIN (
  SELECT route_id, COUNT(DISTINCT client_id) AS client_count
  FROM trips WHERE route_id IS NOT NULL AND client_id IS NOT NULL
  GROUP BY route_id
) cl ON cl.route_id = r.id
LEFT JOIN (
  SELECT
    t.route_id,
    COUNT(*) AS incident_count
  FROM incidents inc
  JOIN trips t ON t.id = inc.trip_id
  WHERE t.route_id IS NOT NULL
  GROUP BY t.route_id
) inc ON inc.route_id = r.id
WHERE r.archived = false;

-- ═══════════════════════════════════════════════════════════════
-- CLIENT STATISTICS
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW client_statistics AS
SELECT
  c.*,
  COALESCE(tr.total_trips, 0) AS total_trips,
  COALESCE(tr.active_trips, 0) AS active_trips,
  COALESCE(tr.completed_trips, 0) AS completed_trips,
  COALESCE(tr.delayed_trips, 0) AS delayed_trips,
  COALESCE(tr.total_distance, 0) AS total_distance,
  COALESCE(tr.total_revenue, 0) AS total_revenue,
  COALESCE(inc.total_incidents, 0) AS total_incidents
FROM clients c
LEFT JOIN (
  SELECT client_id,
    COUNT(*) AS total_trips,
    COUNT(*) FILTER (WHERE status IN ('In Transit', 'Scheduled')) AS active_trips,
    COUNT(*) FILTER (WHERE status = 'Delivered') AS completed_trips,
    COUNT(*) FILTER (WHERE status = 'Delayed') AS delayed_trips,
    SUM(distance_km) AS total_distance,
    SUM(revenue) AS total_revenue
  FROM trips WHERE client_id IS NOT NULL
  GROUP BY client_id
) tr ON tr.client_id = c.id
LEFT JOIN (
  SELECT client_id,
    COUNT(*) AS total_incidents
  FROM incidents WHERE client_id IS NOT NULL
  GROUP BY client_id
) inc ON inc.client_id = c.id
WHERE c.archived = false;

-- ═══════════════════════════════════════════════════════════════
-- FLEET KPIS FUNCTION
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION fleet_kpis(p_org_id uuid)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_fleet', COUNT(*),
    'available', COUNT(*) FILTER (WHERE status = 'Idle'),
    'on_trip', COUNT(*) FILTER (WHERE status = 'On The Road'),
    'maintenance', COUNT(*) FILTER (WHERE status = 'Maintenance'),
    'out_of_service', COUNT(*) FILTER (WHERE status = 'Offline'),
    'idle_trucks', COUNT(*) FILTER (WHERE status = 'Idle' AND driver_id IS NULL),
    'awaiting_assignment', COUNT(*) FILTER (WHERE driver_id IS NULL AND status = 'Idle'),
    'gps_online', COUNT(*) FILTER (WHERE gps_status = 'Online'),
    'archived', COUNT(*) FILTER (WHERE archived = true)
  ) INTO result
  FROM trucks WHERE organization_id = p_org_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;