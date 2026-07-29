import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  Building2,
} from "lucide-react";
import {
  getOrganisationByAdminEmail,
  ensureSeedOrganisation,
} from "@/lib/organisations-store";
import { useBranding } from "@/lib/branding";
import { showAppToast } from "@/lib/toast";

interface LoginScreenProps {
  onBack: () => void;
  onGoToRegister: () => void;
  onSignedIn: () => void;
}

export function LoginScreen({ onBack, onGoToRegister, onSignedIn }: LoginScreenProps) {
  const branding = useBranding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showAppToast("Enter your administrator email and password", "error");
      return;
    }
    ensureSeedOrganisation();
    const org = getOrganisationByAdminEmail(email);
    if (!org) {
      showAppToast("No organisation found for this administrator email", "error");
      return;
    }
    branding.update({
      companyName: org.companyName,
      companyShort: org.companyShort,
      logoDataUrl: org.logoDataUrl,
      primaryColor: org.primaryColor,
      secondaryColor: org.secondaryColor,
      workspaceSlug: org.slug,
      adminEmail: org.adminEmail,
      adminName: org.adminName,
    });
    showAppToast(`Welcome back, ${org.adminName.split(" ")[0]}`, "success");
    onSignedIn();
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      {/* Left: brand panel */}
      <div
        className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between"
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, #0f172a 60%, #020617 100%)",
        }}
      >
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-2 ring-white/20 backdrop-blur">
            <RouteIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide text-white">PrimeLex Technologies</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">
              Logistics Intelligence System
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-semibold leading-tight text-white">
            Manage your organisation, users and logistics operations.
          </h1>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: ShieldCheck, label: "Enterprise-grade" },
              { icon: Sparkles, label: "AI insights" },
              { icon: Building2, label: "Multi-tenant" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur"
              >
                <f.icon className="h-4 w-4 text-white" />
                <span className="text-[11px] font-medium text-white/80">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} PrimeLex Technologies. All rights reserved.
        </div>
      </div>

      {/* Right: admin login panel */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </button>

          <div className="lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <RouteIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold">PrimeLex Technologies</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Logistics Intelligence System
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground">Administrator Login</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage your organisation, users, and logistics operations.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Administrator Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white shadow transition-colors hover:bg-primary/90"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Don't have an organisation yet?
              </span>
            </div>
          </div>

          <button
            onClick={onGoToRegister}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-card/60 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
          >
            Create Organisation
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
