import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Route as RouteIcon, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter your administrator email and password");
      return;
    }
    toast.success("Signed in", { description: "Redirecting to your organisation workspace…" });
    // Future: resolve the administrator's organisation and redirect.
    // For now, administrators reach their workspace via /{organisation}/login.
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="border-b border-border/60 px-8 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <RouteIcon className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-wide">PrimeLex Technologies</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Logistics Intelligence System</div>
            </div>
          </Link>
          <Link to="/register" className="text-xs font-medium text-primary hover:underline">
            Create organisation
          </Link>
        </div>
      </header>

      {/* Form */}
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Administrator Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage your organisation, users, and logistics operations.
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Administrator Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-password">Password</Label>
              <button type="button" className="text-xs text-primary hover:underline">Forgot Password</button>
            </div>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">New to PrimeLex?</span>
          </div>
        </div>

        <div className="space-y-3 text-center">
          <p className="text-xs text-muted-foreground">Don't have an organisation yet?</p>
          <Link
            to="/register"
            className="inline-flex w-full items-center justify-center rounded-md border border-border bg-elevated/60 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
          >
            Create Organisation
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Enterprise-grade security · SSO & MFA ready
        </div>
      </div>
    </div>
  );
}
