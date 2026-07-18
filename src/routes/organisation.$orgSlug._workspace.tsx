import { createFileRoute, Outlet, useParams, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar";
import { usePreferences } from "@/lib/preferences";
import { ProfileDrawerProvider } from "@/lib/profile-drawer";
import { FleetManagersProvider } from "@/lib/fleet-managers-store";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/organisation/$orgSlug/_workspace")({
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  const { resolvedTheme } = usePreferences();
  const { orgSlug } = useParams({ from: "/organisation/$orgSlug/_workspace" });
  const { getSessionForOrg } = useAuth();
  const navigate = useNavigate();

  const hasSession = getSessionForOrg(orgSlug);

  useEffect(() => {
    if (!hasSession) {
      navigate({ to: `/organisation/${orgSlug}/login` });
    }
  }, [hasSession, orgSlug, navigate]);

  if (!hasSession) return null;

  return (
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
  );
}
