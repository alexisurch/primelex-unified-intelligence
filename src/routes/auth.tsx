import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useBranding } from "@/lib/branding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ShieldCheck, Route as RouteIcon, Sparkles, Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthLanding,
});

function AuthLanding() {
  const { companyName, companyShort, logoDataUrl, primaryColor, adminEmail, workspaceSlug } = useBranding();
  const navigate = useNavigate();
  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState("••••••••");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter your email and password");
      return;
    }
    toast.success(`Welcome back to ${companyName}`);
    navigate({ to: "/" });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      {/* Left: brand panel */}
      <div
        className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #0f172a 60%, #020617 100%)` }}
      >
        <div className="relative z-10 flex items-center gap-3">
          {logoDataUrl ? (
            <img src={logoDataUrl} alt="" className="h-11 w-11 rounded-xl object-cover ring-2 ring-white/20" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-2 ring-white/20 backdrop-blur">
              <RouteIcon className="h-6 w-6 text-white" />
            </div>
          )}
          <div>
            <div className="text-sm font-bold tracking-wide text-white">{companyShort}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Unified Intelligence System</div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-semibold leading-tight text-white">
            Command every truck, driver and route from one intelligent console.
          </h1>
          <p className="max-w-md text-sm text-white/70">
            {companyName} UIS unifies dispatch, fuel intelligence, compliance, and executive reporting into a single decision-grade platform.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: ShieldCheck, label: "Enterprise-grade" },
              { icon: Sparkles, label: "AI insights" },
              { icon: Building2, label: "Multi-tenant" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur">
                <f.icon className="h-4 w-4 text-white" />
                <span className="text-[11px] font-medium text-white/80">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © 2026 {companyName}. All rights reserved.
        </div>
      </div>

      {/* Right: auth panel */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: primaryColor }}>
                <RouteIcon className="h-5 w-5 text-white" />
              </div>
              <div className="text-lg font-bold">{companyShort}</div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground">Sign in to your workspace</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Continue to <span className="font-medium text-foreground">{workspaceSlug}.primelex.app</span>
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
                <button type="button" className="text-xs text-primary hover:underline">Forgot?</button>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" style={{ background: primaryColor }}>
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">New to UIS?</span>
            </div>
          </div>

          <Link
            to="/register"
            className="flex w-full items-center justify-center rounded-md border border-border bg-elevated/60 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
          >
            Create a company account
          </Link>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
