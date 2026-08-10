import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Route as RouteIcon, Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getOrganisationBySlug } from "@/lib/organisations-store";
import { useBranding } from "@/lib/branding";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$organisation/login")({
  component: WorkspaceLogin,
});

function WorkspaceLogin() {
  const { organisation } = useParams({ from: "/$organisation/login" });
  const navigate = useNavigate();
  const branding = useBranding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const org = getOrganisationBySlug(organisation);
  const primaryColor = org?.primaryColor ?? "var(--primary)";
  const logoDataUrl = org?.logoDataUrl ?? null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) {
      toast.error("We couldn't find that organisation workspace");
      return;
    }
    if (!email || !password) {
      toast.error("Enter your work email and password");
      return;
    }
    branding.update({
      companyName: org.companyName,
      companyShort: org.companyShort,
      logoDataUrl: org.logoDataUrl,
      primaryColor: org.primaryColor,
      secondaryColor: org.secondaryColor,
      workspaceSlug: org.slug,
    });
    toast.success(`Welcome back to ${org.companyName}`);
    navigate({ to: "/dashboard" });
  };

  if (!org) {
    return <WorkspaceNotFound slug={organisation} />;
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      {/* Left: organisation brand panel */}
      <div
        className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #0f172a 60%, #020617 100%)` }}
      >
        <div className="relative z-10 flex items-center gap-3">
          {logoDataUrl ? (
            <img src={logoDataUrl} alt={org.companyShort} className="h-11 w-11 rounded-xl object-cover ring-2 ring-white/20" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-2 ring-white/20 backdrop-blur">
              <RouteIcon className="h-6 w-6 text-white" />
            </div>
          )}
          <div>
            <div className="text-sm font-bold tracking-wide text-white">{org.companyShort}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Logistics Platform</div>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="text-sm text-white/60">Welcome to</div>
          <h1 className="text-4xl font-semibold leading-tight text-white">{org.companyName}</h1>
          <p className="max-w-md text-sm text-white/70">
            Logistics Platform. Sign in to continue.
          </p>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} {org.companyName}. Powered by MUVD LOGISTICS.
        </div>
      </div>

      {/* Right: workspace login panel */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden">
            <div className="flex items-center gap-3">
              {logoDataUrl ? (
                <img src={logoDataUrl} alt={org.companyShort} className="h-10 w-10 rounded-lg object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: primaryColor }}>
                  <RouteIcon className="h-5 w-5 text-white" />
                </div>
              )}
              <div className="leading-tight">
                <div className="text-sm font-bold">{org.companyName}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Logistics Platform</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground">Sign in to your workspace</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Continue to <span className="font-medium text-foreground">{typeof window !== "undefined" ? window.location.origin : "yourdomain.com"}/{org.slug}/login</span>
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot Password?</button>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            </div>
            <Button type="submit" className="w-full" style={{ background: primaryColor }}>
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="space-y-3 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <Building2 className="h-3.5 w-3.5" />
              Administrator login
            </Link>
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceNotFound({ slug }: { slug: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className={cn("max-w-md text-center")}>
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-elevated/60">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Workspace not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find an organisation workspace for{" "}
          <span className="font-mono text-foreground">{slug}</span>. Check the link your
          administrator gave you, or contact your organisation administrator.
        </p>
        <div className="mt-6 flex flex-col items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to MUVD LOGISTICS
          </Link>
          <Link to="/login" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Administrator login
          </Link>
        </div>
      </div>
    </div>
  );
}
