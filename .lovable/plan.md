# PrimeLex UIS — Phase 2 Enhancement Plan

Scope is large; grouping into 5 shippable workstreams. All existing approved UI outside the three redesigned pages stays untouched.

## 1. Unified Profile System (foundation for everything else)

Create a single global "profile drawer" mechanism so clicking any Truck, Driver, Trip, Client, or Incident anywhere in the app opens the same right-side slide-out panel with consistent styling.

New files:
- `src/lib/profile-drawer.tsx` — React Context + provider exposing `openProfile({ type, id })`, backed by a single `<Sheet side="right">` mounted in `_app.tsx`. Supports `truck | driver | trip | client | incident`.
- `src/components/profiles/TruckProfile.tsx` — extracted from current Fleet Ops Sheet.
- `src/components/profiles/DriverProfile.tsx` — extracted from current Fleet Ops Sheet.
- `src/components/profiles/TripProfile.tsx` — new (see §2).
- `src/components/profiles/ClientProfile.tsx` — new (see §3).
- `src/components/profiles/IncidentProfile.tsx` — new (see §4).
- `src/components/profiles/ProfileShell.tsx` — shared header/section/tab primitives so all five profiles look identical (avatar/logo, title, status pill, tabbed body, scroll area).

Wiring: mount `<ProfileDrawerProvider>` inside `_app.tsx`. Replace ad-hoc Sheet in Fleet Operations with `openProfile()` calls. Add click handlers to Trip IDs, Client names, Truck IDs, Driver names, Incident IDs across: Fleet Ops, Dispatch, Trips & Deliveries, Fuel, Maintenance, Safety, Reports, Executive Overview.

## 2. Trip Profile

`TripProfile.tsx` with tabs: Overview, Timeline, Route, Fuel, Delivery, Financials, Documents. Data derived from existing `trips` mock + trip-store (when populated in manual mode). Timeline auto-generated from trip status transitions + fuel assignment + incidents.

## 3. Client Profile

Extend `mock-data.ts` with a `clients` collection (name, contact, industry, since, status) derived from unique customers already in `trips`. `ClientProfile.tsx` tabs: Company, KPIs, Active Deliveries, Trip History, Documents, Timeline. KPIs computed from trip list.

## 4. Incident Management Overhaul

- Extend `Incident` in `mock-data.ts` with fields: `type, severity, dateTime, location, description, photos, documents, reportedBy, investigator, status, correctiveActions, affectedTruck, affectedDriver, affectedTrip, affectedClient, estDelayMin, estFinancialImpact`.
- New `src/lib/incidents-store.tsx` — Context that owns the incident list and exposes `reportIncident()`. Trip/Truck/Driver/Client profiles read incidents via selectors keyed off IDs so there is a single source of truth (no duplication).
- `IncidentProfile.tsx` tabs: Details, Photos, Documents, Timeline, Investigation, Corrective Actions, Operational Impact.
- Redesign `_app.safety-incidents.tsx`: keep KPIs + table styling, add "Report Incident" button opening a modal with the full incident form; clicking a row opens `IncidentProfile`.

## 5. Redesigned Pages (match attached mockups)

### Dispatch Center (`_app.dispatch-center.tsx`)
Rebuild to match the dark-map mockup: two-column layout — left rail with "Where do you need a truck?" form (pickup, date/time, truck type, Find button) + "Available Trucks Near This Location" list of truck cards with distance chips; right side large dark map with distance pins + "Selected Truck" detail panel (image, Truck Details / Current Status / Availability columns, View Live Location / View Full Truck Profile / Dispatch This Truck actions). Selecting a truck card populates the detail panel; Dispatch button creates a trip via trip-store. Map remains a stylized `InteractiveMap` since we have no real GPS.

### Maintenance (`_app.maintenance.tsx`)
Rebuild per mockup: 6 KPI cards row (Upcoming, Overdue, In Workshop, Cost MTD, Avg Downtime, Compliance), "Log Maintenance" primary button, `Upcoming Maintenance` table + right-side "Maintenance by Status" donut + Cost line chart + "Cost Breakdown" bar list, `Maintenance Records` table with filters/Export. New `LogMaintenanceDialog` writes into a new `src/lib/maintenance-store.tsx`. Records link to Truck Profile (opens via profile drawer). Remove calendar/parts sections.

### Fuel Intelligence (`_app.fuel-intelligence.tsx`)
Rebuild per mockup: 6 KPI row (Total Fuel Cost MTD, Fuel Issued MTD, Avg Cost/L, Fuel Efficiency, Transactions, Variance), tab bar (Overview / Fuel Assignments / Fuel Transactions / Fuel Usage / Fuel Analysis / Alerts), Overview shows Fuel Trend dual-line, Fuel by Type donut, Top Fuel Consumers list, Fuel Assignments table, Fuel Variance chart, Recent Fuel Transactions table with filters, and right-side "Quick Assign Fuel" panel (Driver/Truck/Fuel Type/Quantity/Assignment Type/Note → Assign Fuel button). New `src/lib/fuel-store.tsx` records assignments; on assign, updates Truck/Driver/Trip profiles by reference.

## 6. Trips & Deliveries

- Remove "Progress" and "Stops" columns from the table.
- Remove the map view section entirely.
- Trip ID cell now calls `openProfile({ type: 'trip', id })`.

## 7. Fleet & Drivers

- Add `Add New Truck` button in Fleet tab → `TruckRegistrationDialog` (form: plate, make/model, type, capacity, year, VIN, initial driver). On submit, prepends to trucks list via a new `src/lib/fleet-store.tsx` (wraps mock trucks with add/update).
- Add `Add Driver` button in Drivers tab → `DriverRegistrationDialog` (name, phone, license #, license class, expiry, assigned truck).
- Both dialogs also support edit mode (opened from profile).

## Data & State

Add lightweight Context stores so all modules read/write the same records:
- `fleet-store` (trucks + add/update)
- `drivers-store` (drivers + add/update)
- `clients-store` (derived + add)
- `trips-store` (already planned earlier — extend)
- `incidents-store` (new)
- `maintenance-store` (new)
- `fuel-store` (new)

All initialized from `mock-data.ts` and persisted to `localStorage` for demo continuity. Providers mounted once in `_app.tsx` under `PreferencesProvider`.

## Out of Scope
- No changes to sidebar, header, theme, colors, spacing, or any page not listed.
- No backend/Supabase; all state is client-side.
- Automated (GPS) tracking mode behavior stays as-is.

## Deliverable Order
1. Profile drawer + Truck/Driver profile extraction (no visual change).
2. Trip + Client + Incident profiles and global click wiring.
3. Trips & Deliveries cleanup + Fleet/Driver Add dialogs.
4. Safety & Incidents master record + Report modal.
5. Dispatch Center redesign.
6. Maintenance redesign + Log dialog.
7. Fuel Intelligence redesign + Quick Assign.

This is a large multi-file build; I'll execute it in the order above in one turn, batching parallel file writes.
