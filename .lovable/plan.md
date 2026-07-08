# PrimeLex UIS — Phase 3 Enhancement Plan

Feature-only enhancement. No visual redesign. All new profiles reuse the existing right-side slide-out `ProfileShell` pattern used by Truck and Driver profiles.

## 1. Data Model (extend `src/lib/mock-data.ts`)

New collections + relationships (mock, in-memory, persisted to `localStorage`):

- **FleetManager**: `id, name, employeeId, role, department, phone, email, photo, status, dateJoined, assignedTruckIds[]`.
- **Route**: `id, name, origin, destination, distanceKm, createdAt`. Derived stats computed from trips.
- **Trip** — extend with permanent historical fields: `routeId, fleetManagerId, assignedFuelL, fuelCostNGN, distanceKm, litersPerKm` (frozen once trip is `Completed`).
- **Truck** — add `fleetManagerId` (nullable).
- **Incident / Maintenance / FuelTransaction** — add `fleetManagerId` and `routeId` (derived from linked trip/truck).

Seed 4–6 Fleet Managers, split existing trucks across them, and back-derive routes from existing trip origin→destination pairs.

## 2. New Stores (`src/lib/`)

- `fleet-managers-store.tsx` — CRUD + `assignTrucks(managerId, truckIds)` that propagates to trucks and derives drivers/trips/fuel/incidents/maintenance by selector.
- `routes-store.tsx` — `upsertRouteFor(origin, destination)`; selectors for trucks/drivers/clients/incidents/fuel and performance aggregates.
- `fuel-review-engine.ts` — Pure function `reviewFuel(trip, history, config)` implementing the priority hierarchy (Truck+Route → Truck → Class → Learning) with min-history threshold (default 3) and thresholds ±3% Normal / 3–7% Review / >7% Critical. Returns `{ baseline, source, variancePct, status, alert? }`.

All stores mounted in `_app.tsx` alongside existing providers.

## 3. New Profiles (`src/components/profiles/`)

Both follow the existing `ProfileShell` + `ProfileTabs` primitives — identical header, tabs, section, table styling as Truck/Driver profiles.

### `FleetManagerProfile.tsx`
Tabs: Overview, KPIs, Assigned Fleet, Drivers, Active Trips, Routes, Fuel, Maintenance, Incidents, Timeline. Every truck / driver / trip / route / incident row uses `ProfileLink` to open its own profile.

### `RouteProfile.tsx`
Tabs: Overview (clickable Total Incidents → filtered incidents view), Performance Summary, Trucks, Drivers, Clients, Timeline (completed trips). All cross-entity rows clickable.

Register both in `src/lib/profile-drawer.tsx` (`kind: "fleet-manager" | "route"`).

## 4. Cross-App Fleet Manager References

Wherever a manager could sensibly appear, add a clickable `ProfileLink kind="fleet-manager"`:

- Truck Profile (Overview: "Fleet Manager" row)
- Driver Profile (Overview)
- Trip Profile (Overview)
- Incident Profile (Details)
- Maintenance table (new column)
- Fuel Transactions table (new column)
- Dispatch selected-truck panel
- Fleet Operations overview table (new column)

## 5. Users & Access — Fleet Assignment

Extend `_app.users-access.tsx`:

- Filter row for role "Fleet Manager" (existing seed shows these as users).
- Row action `Manage Fleet` → opens `ManageFleetDialog` (new): dual-list `Available Trucks` ↔ `Assigned Trucks` with Assign / Remove / Save. Save calls `assignTrucks()` on the store; all downstream profiles update via selector.
- Clicking a Fleet Manager name opens the FleetManagerProfile drawer.

## 6. Fuel Intelligence Engine wiring

- On trip completion (mock: when user assigns fuel + marks delivered), snapshot `assignedFuelL / fuelCostNGN / distanceKm / litersPerKm` on the Trip record (immutable).
- Run `reviewFuel()`; if alert, push into `fuel-store.alerts[]`.
- Surface alerts on: Executive Dashboard (existing alerts card), Fuel Intelligence Alerts tab, Fleet Manager Profile → Fuel, Truck Profile → Fuel section, Trip Profile → Fuel tab. Show `Learning Baseline` pill when below min-history.
- Truck Profile Trip History adds columns: Distance, Fuel Assigned, L/km.

## 7. Dispatch Center — Tracking Mode

Read `usePreferences().trackingMode`. Manual: hide live markers/route/movement and show the existing "Manual Tracking" placeholder card already in the codebase. Automated: keep current map, markers, ETA, nearest-truck recommendations. Single conditional block wrapping the map surface — no other layout changes.

## 8. Navigation

`src/components/layout/Sidebar.tsx`:

- Remove `Drivers & Compliance` and `Integrations` entries.
- Add `Route Intelligence` → new route `src/routes/_app.route-intelligence.tsx` (list of Route cards + table; row click opens Route Profile).
- Drivers list already exists as a tab inside Fleet Operations; delete `_app.drivers-compliance.tsx` file and its route from `routeTree.gen` (auto-regenerated).

## 9. Files

Create:
- `src/lib/fleet-managers-store.tsx`
- `src/lib/routes-store.tsx`
- `src/lib/fuel-review-engine.ts`
- `src/components/profiles/FleetManagerProfile.tsx`
- `src/components/profiles/RouteProfile.tsx`
- `src/components/fleet/ManageFleetDialog.tsx`
- `src/routes/_app.route-intelligence.tsx`

Edit:
- `src/lib/mock-data.ts` (new entities + seed + trip fuel snapshot fields)
- `src/lib/profile-drawer.tsx` (register new kinds)
- `src/routes/_app.tsx` (mount new providers)
- `src/routes/_app.users-access.tsx` (Manage Fleet action, profile links)
- `src/routes/_app.fleet-operations.tsx` (Fleet Manager column + link)
- `src/routes/_app.trips-deliveries.tsx` (Fleet Manager + Route columns clickable)
- `src/routes/_app.dispatch-center.tsx` (tracking-mode gate)
- `src/routes/_app.fuel-intelligence.tsx` (alerts tab, Learning Baseline pill, snapshot on assign)
- `src/routes/_app.maintenance.tsx` (Fleet Manager column)
- `src/routes/_app.safety-incidents.tsx` (Fleet Manager + Route columns)
- `src/routes/_app.index.tsx` (alerts feed uses fuel alerts)
- `src/components/profiles/TruckProfile.tsx`, `DriverProfile.tsx`, `TripProfile.tsx`, `IncidentProfile.tsx` (Fleet Manager + Route rows/columns; trip history fuel columns)
- `src/components/layout/Sidebar.tsx` (nav changes)

Delete:
- `src/routes/_app.drivers-compliance.tsx`
- `src/routes/_app.integrations.tsx`

## 10. Out of Scope

No changes to header, theme, colors, card styling, or any page not listed. No backend. Automated tracking behavior unchanged apart from the manual-mode gate.

## Build Order

1. Data model + stores + fuel engine.
2. Fleet Manager + Route profiles registered in drawer.
3. Users & Access Manage Fleet dialog.
4. Route Intelligence route + sidebar nav updates (remove tabs, add tab).
5. Cross-app Fleet Manager / Route link wiring on existing tables and profiles.
6. Dispatch tracking-mode gate.
7. Fuel snapshot on assignment + review engine alerts wiring.
