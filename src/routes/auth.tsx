import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { listTenants, DEFAULT_TENANT_SLUG } from "@/lib/tenants";
import { ArrowRight, Search, Building2, Route as RouteIcon, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth")({
  component: AuthPortal,
});

function AuthPortal() {
  const navigate = useNavigate();
  const tenants = listTenants();
  const [query, setQuery] = useState("");

  const matches = tenants.filter(
    (t) =>
      t.slug.includes(query.toLowerCase()) ||
      t.companyName.toLowerCase().includes(query.toLowerCase()),
  );

  const goTo = (slug: string) => navigate({ to: `/organisation/${slug}/login` });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="border-b border-border/60 px-8 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <RouteIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide">PrimeLex Tech</span>
          </div>
          <Link to="/register" className="text-xs font-medium text-primary hover:underline">
            Create a company account
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-foreground">Find your workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your organisation name or slug to sign in to your Logistics Intelligence System workspace.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && matches[0]) goTo(matches[0].slug);
            }}
            placeholder="Search organisations…"
            className="w-full rounded-lg border border-border bg-elevated/40 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary/60"
          />
        </div>

        {/* Tenant list */}
        <div className="space-y-2">
          {matches.map((t) => (
            <button
              key={t.slug}
              onClick={() => goTo(t.slug)}
              className="flex w-full items-center gap-4 rounded-xl border border-border bg-elevated/40 px-5 py-4 text-left transition-all hover:border-primary/40 hover:bg-elevated/60"
            >
              {t.logoDataUrl ? (
                <img src={t.logoDataUrl} alt="" className="h-11 w-11 rounded-xl object-cover" />
              ) : (
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})` }}
                >
                  <Building2 className="h-5 w-5 text-white" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground">{t.companyName}</div>
                <div className="font-mono text-xs text-muted-foreground">/organisation/{t.slug}/login</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
          {matches.length === 0 && (
            <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center">
              <p className="text-sm text-muted-foreground">No organisation matches "{query}".</p>
              <Link to="/register" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                <Sparkles className="h-3.5 w-3.5" /> Create a new workspace
              </Link>
            </div>
          )}
        </div>

        {/* Quick access */}
        <div className="mt-10 text-center text-xs text-muted-foreground">
          Default workspace:
          <button
            onClick={() => goTo(DEFAULT_TENANT_SLUG)}
            className="ml-1.5 font-medium text-primary hover:underline"
          >
            PrimeLex Logistics
          </button>
        </div>
      </div>
    </div>
  );
}
