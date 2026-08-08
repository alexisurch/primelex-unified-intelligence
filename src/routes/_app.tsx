import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar";
import { usePreferences } from "@/lib/preferences";
import { ProfileDrawerProvider } from "@/lib/profile-drawer";
import { FleetManagersProvider } from "@/lib/fleet-managers-store";
import { FleetDataProvider } from "@/lib/backend/live-data";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { resolvedTheme } = usePreferences();
  return (
    <FleetDataProvider>
    <FleetManagersProvider>
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
    </FleetManagersProvider>
    </FleetDataProvider>
  );
}
