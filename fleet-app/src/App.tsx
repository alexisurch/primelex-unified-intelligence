import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Overview } from "@/routes/Overview";
import { ActionCenter } from "@/routes/ActionCenter";
import { FleetOperations } from "@/routes/FleetOperations";
import { DispatchCenter } from "@/routes/DispatchCenter";
import { TripsDeliveries } from "@/routes/TripsDeliveries";
import { RouteIntelligence } from "@/routes/RouteIntelligence";
import { Maintenance } from "@/routes/Maintenance";
import { FuelIntelligence } from "@/routes/FuelIntelligence";
import { Incidents } from "@/routes/Incidents";
import { Documents } from "@/routes/Documents";
import { KPIScorecard } from "@/routes/KPIScorecard";
import { Reports } from "@/routes/Reports";
import { UsersAccess } from "@/routes/UsersAccess";
import { Organisation } from "@/routes/Organisation";
import { SystemSettings } from "@/routes/SystemSettings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Overview />} />
          <Route path="action-center" element={<ActionCenter />} />
          <Route path="fleet-operations" element={<FleetOperations />} />
          <Route path="dispatch-center" element={<DispatchCenter />} />
          <Route path="trips-deliveries" element={<TripsDeliveries />} />
          <Route path="route-intelligence" element={<RouteIntelligence />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="fuel-intelligence" element={<FuelIntelligence />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="documents" element={<Documents />} />
          <Route path="kpi-scorecard" element={<KPIScorecard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users-access" element={<UsersAccess />} />
          <Route path="organisation" element={<Organisation />} />
          <Route path="system-settings" element={<SystemSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
