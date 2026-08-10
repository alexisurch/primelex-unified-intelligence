import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Account created. Welcome to MUVD LOGISTICS.");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <div
        className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between"
        style={{ background: "linear-gradient(135deg, #3b82f6 0%, #0f172a 60%, #020617 100%)" }}
      >
        <div className="relative z-10 flex items-center gap-3">
          <img src="/muvd-logo.jpeg" alt="MUVD LOGISTICS" className="h-11 w-11 rounded-xl object-cover ring-2 ring-white/20" />
          <div>
            <div className="text-sm font-bold tracking-wide text-white">MUVD LOGISTICS</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Logistics Platform</div>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="text-sm text-white/60">Get started</div>
          <h1 className="text-4xl font-semibold leading-tight text-white">Run a smarter fleet with MUVD LOGISTICS.</h1>
          <p className="max-w-md text-sm text-white/70">
            Operations, finance, dispatch, fuel, maintenance and analytics — unified in one platform.
          </p>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} MUVD LOGISTICS.
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden">
            <div className="flex items-center gap-3">
              <img src="/muvd-logo.jpeg" alt="MUVD LOGISTICS" className="h-10 w-10 rounded-lg object-cover" />
              <div className="leading-tight">
                <div className="text-sm font-bold">MUVD LOGISTICS</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Logistics Platform</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground">Create your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start managing your fleet with MUVD LOGISTICS.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company name</Label>
              <Input id="company" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your company" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" />
            </div>
            <Button type="submit" className="w-full">
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="space-y-3 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
              Already have an account? Sign in
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
