import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getOrganisationByAdminEmail, ensureSeedOrganisation } from "@/lib/organisations-store";
import { useBranding } from "@/lib/branding";
import { PublicBackground } from "../components/public/PublicShared";

export const Route = createFileRoute("/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const branding = useBranding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter your administrator email and password");
      return;
    }
    ensureSeedOrganisation();
    const org = getOrganisationByAdminEmail(email);
    if (!org) {
      toast.error("No organisation found for this administrator email");
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
    toast.success(`Welcome back, ${org.adminName.split(" ")[0]}`);
    navigate({ to: "/dashboard" });
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden text-foreground"
      style={{ background: "oklch(0.105 0.034 260)" }}
    >
      <PublicBackground />
      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left: brand panel */}
      <div
        className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between"
        style={{ background: `linear-gradient(135deg, var(--primary) 0%, #0f172a 60%, #020617 100%)` }}
      >
        <div className="relative z-10 flex items-center gap-3">
          <img src="/muvd-logo.jpeg" alt="MUVD LOGISTICS" className="h-11 w-11 rounded-xl object-cover ring-2 ring-white/20" />
          <div>
            <div className="text-sm font-bold tracking-wide text-white">MUVD LOGISTICS</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Logistics Platform</div>
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
              <div key={f.label} className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur">
                <f.icon className="h-4 w-4 text-white" />
                <span className="text-[11px] font-medium text-white/80">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} MUVD LOGISTICS. All rights reserved.
        </div>
      </div>

      {/* Right: admin login panel */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden">
            <div className="flex items-center gap-3">
              <img src="/muvd-logo.jpeg" alt="MUVD LOGISTICS" className="h-10 w-10 rounded-lg object-cover" />
              <div>
                <div className="text-sm font-bold">MUVD LOGISTICS</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Logistics Platform</div>
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
              <Label htmlFor="email">Administrator Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.com" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot Password?</button>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            </div>
            <Button type="submit" className="w-full">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Don't have an organisation yet?</span>
            </div>
          </div>

          <Link
            to="/register"
            className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-elevated/60 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
          >
            Create Organisation
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
