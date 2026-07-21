import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import { BrandingProvider } from "@/lib/branding";
import { getTenant } from "@/lib/tenants";
import { Building2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/organisation/$orgSlug")({
  component: OrgLayout,
});

function OrgLayout() {
  const { orgSlug } = useParams({ from: "/organisation/$orgSlug" });
  const tenant = getTenant(orgSlug);

  if (!tenant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Workspace not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The organisation <span className="font-mono font-medium">{orgSlug}</span> does not exist.
          </p>
        </div>
        <Link to="/login" className="rounded-lg border border-border bg-elevated/60 px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40">
          Administrator login
        </Link>
      </div>
    );
  }

  return (
    <BrandingProvider slug={tenant.slug}>
      <Outlet />
    </BrandingProvider>
  );
}
