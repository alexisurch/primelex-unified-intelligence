import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app"!</div>
}
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar";
import { usePreferences } from "@/lib/preferences";
import { ProfileDrawerProvider } from "@/lib/profile-drawer";
import { FleetManagersProvider } from "@/lib/fleet-managers-store";
import { SuppliersProvider } from "@/lib/suppliers-store";
import { TripsProvider } from "@/lib/trips-store";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { resolvedTheme } = usePreferences();
  return (
    <FleetManagersProvider>
      <SuppliersProvider>
        <TripsProvider>
        <ProfileDrawerProvider>
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <Sidebar />
          <main
            data-theme={resolvedTheme}
            className="flex-1 overflow-y-auto scrollbar-thin bg-background text-foreground"
          >
            <Outlet />
          </main>
        </div>
        </ProfileDrawerProvider>
        </TripsProvider>
      </SuppliersProvider>
    </FleetManagersProvider>
  );
}
