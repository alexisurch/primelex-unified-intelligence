import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useBranding } from "@/lib/branding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check, Upload, Route as RouteIcon, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  component: RegisterWizard,
});

const STEPS = [
  { id: 1, label: "Company", description: "Business details" },
  { id: 2, label: "Branding", description: "Logo & colors" },
  { id: 3, label: "Workspace", description: "URL & region" },
  { id: 4, label: "Admin", description: "Owner account" },
] as const;

const COLOR_PRESETS = [
  { name: "Ocean", primary: "#3b82f6", secondary: "#8b5cf6" },
  { name: "Emerald", primary: "#10b981", secondary: "#0ea5e9" },
  { name: "Sunset", primary: "#f97316", secondary: "#ef4444" },
  { name: "Violet", primary: "#8b5cf6", secondary: "#ec4899" },
  { name: "Slate", primary: "#0ea5e9", secondary: "#64748b" },
  { name: "Amber", primary: "#f59e0b", secondary: "#d97706" },
];

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}

function RegisterWizard() {
  const branding = useBranding();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [provisioning, setProvisioning] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    companyShort: "",
    industry: "Logistics & Transportation",
    businessEmail: "",
    phone: "",
    logoDataUrl: null as string | null,
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    workspaceSlug: "",
    adminName: "",
    adminEmail: "",
    password: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((p) => ({ ...p, [k]: v }));

  const fileRef = useRef<HTMLInputElement>(null);

  const canNext = () => {
    if (step === 1) return form.companyName.trim().length > 1 && form.businessEmail.includes("@");
    if (step === 2) return true;
    if (step === 3) return form.workspaceSlug.length > 2;
    if (step === 4) return form.adminName.trim().length > 1 && form.adminEmail.includes("@") && form.password.length >= 6;
    return false;
  };

  const next = () => {
    if (!canNext()) { toast.error("Please complete the required fields"); return; }
    if (step < 4) setStep(step + 1);
    else provision();
  };
  const back = () => step > 1 && setStep(step - 1);

  const onLogoChange = (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Please upload an image");
    const reader = new FileReader();
    reader.onload = () => set("logoDataUrl", reader.result as string);
    reader.readAsDataURL(file);
  };

  // Autofill dependent fields
  useEffect(() => {
    if (form.companyName && !form.workspaceSlug) set("workspaceSlug", slugify(form.companyName));
    if (form.companyName && !form.companyShort) set("companyShort", form.companyName.split(" ")[0].toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.companyName]);

  const provision = () => {
    setProvisioning(true);
    // apply branding
    branding.update({
      companyName: form.companyName,
      companyShort: form.companyShort || form.companyName.split(" ")[0].toUpperCase(),
      industry: form.industry,
      businessEmail: form.businessEmail,
      phone: form.phone,
      logoDataUrl: form.logoDataUrl,
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
      workspaceSlug: form.workspaceSlug,
      adminName: form.adminName,
      adminEmail: form.adminEmail,
    });
    setTimeout(() => {
      toast.success(`Workspace ${form.workspaceSlug}.primelex.app is ready`);
      navigate({ to: "/" });
    }, 4200);
  };

  if (provisioning) return <ProvisioningScreen slug={form.workspaceSlug} companyName={form.companyName} primaryColor={form.primaryColor} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/auth" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RouteIcon className="h-4 w-4" />
            PrimeLex UIS
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-10 flex items-center justify-between gap-2">
          {STEPS.map((s, i) => {
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex flex-1 items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                    done && "border-transparent bg-success text-white",
                    active && "border-primary bg-primary/15 text-primary",
                    !done && !active && "border-border bg-elevated/60 text-muted-foreground",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : s.id}
                </div>
                <div className="min-w-0">
                  <div className={cn("text-xs font-semibold uppercase tracking-wider", active ? "text-foreground" : "text-muted-foreground")}>{s.label}</div>
                  <div className="text-[11px] text-muted-foreground">{s.description}</div>
                </div>
                {i < STEPS.length - 1 && <div className={cn("mx-2 h-px flex-1", done ? "bg-success/60" : "bg-border")} />}
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border/70 bg-elevated/40 p-8 backdrop-blur">
          {step === 1 && <StepCompany form={form} set={set} />}
          {step === 2 && <StepBranding form={form} set={set} onFile={() => fileRef.current?.click()} fileRef={fileRef} onLogoChange={onLogoChange} />}
          {step === 3 && <StepWorkspace form={form} set={set} />}
          {step === 4 && <StepAdmin form={form} set={set} />}

          <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-6">
            <Button variant="ghost" onClick={back} disabled={step === 1}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="text-xs text-muted-foreground">Step {step} of {STEPS.length}</div>
            <Button onClick={next} style={{ background: form.primaryColor }}>
              {step === 4 ? "Create workspace" : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Steps ----------

function StepCompany({ form, set }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Tell us about your company</h2>
        <p className="mt-1 text-sm text-muted-foreground">We'll use this to personalize your UIS workspace.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Company name" required>
          <Input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Acme Logistics Ltd." />
        </Field>
        <Field label="Short name / Ticker">
          <Input value={form.companyShort} onChange={(e) => set("companyShort", e.target.value.toUpperCase())} placeholder="ACME" maxLength={12} />
        </Field>
        <Field label="Industry">
          <Select value={form.industry} onValueChange={(v) => set("industry", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Logistics & Transportation", "Cold Chain", "Petroleum & Gas", "FMCG Distribution", "Manufacturing", "Mining & Heavy Haul", "Retail Delivery"].map((i) => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Business email" required>
          <Input type="email" value={form.businessEmail} onChange={(e) => set("businessEmail", e.target.value)} placeholder="ops@company.com" />
        </Field>
        <Field label="Phone number">
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234 800 000 0000" />
        </Field>
      </div>
    </div>
  );
}

function StepBranding({ form, set, onFile, fileRef, onLogoChange }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Bring your brand</h2>
        <p className="mt-1 text-sm text-muted-foreground">Upload your logo and pick colors — your workspace updates in real-time.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Label>Company logo</Label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onLogoChange(e.target.files[0])}
          />
          <button
            onClick={onFile}
            className="flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-elevated/40 transition-colors hover:border-primary/40"
          >
            {form.logoDataUrl ? (
              <img src={form.logoDataUrl} alt="logo" className="max-h-32 max-w-[80%] object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-5 w-5" />
                <span className="text-xs">Upload PNG, SVG or JPG (max 2MB)</span>
              </div>
            )}
          </button>
        </div>

        <div className="space-y-3">
          <Label>Brand palette</Label>
          <div className="grid grid-cols-3 gap-2">
            {COLOR_PRESETS.map((p) => {
              const active = form.primaryColor === p.primary;
              return (
                <button
                  key={p.name}
                  onClick={() => { set("primaryColor", p.primary); set("secondaryColor", p.secondary); }}
                  className={cn(
                    "flex flex-col gap-2 rounded-lg border p-3 text-left transition-colors",
                    active ? "border-primary bg-primary/10" : "border-border bg-elevated/40 hover:border-primary/40",
                  )}
                >
                  <div className="flex gap-1.5">
                    <span className="h-6 w-6 rounded" style={{ background: p.primary }} />
                    <span className="h-6 w-6 rounded" style={{ background: p.secondary }} />
                  </div>
                  <span className="text-xs font-medium">{p.name}</span>
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Primary">
              <div className="flex items-center gap-2">
                <input type="color" value={form.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent" />
                <Input value={form.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} className="font-mono text-xs" />
              </div>
            </Field>
            <Field label="Secondary">
              <div className="flex items-center gap-2">
                <input type="color" value={form.secondaryColor} onChange={(e) => set("secondaryColor", e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent" />
                <Input value={form.secondaryColor} onChange={(e) => set("secondaryColor", e.target.value)} className="font-mono text-xs" />
              </div>
            </Field>
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div className="rounded-xl border border-border/60 bg-background p-4">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Live preview</div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-elevated/60 p-3">
          {form.logoDataUrl ? (
            <img src={form.logoDataUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})` }}>
              <RouteIcon className="h-5 w-5 text-white" />
            </div>
          )}
          <div className="flex-1">
            <div className="text-sm font-semibold">{form.companyName || "Your Company"}</div>
            <div className="text-[11px] text-muted-foreground">Unified Intelligence System</div>
          </div>
          <button className="rounded-md px-3 py-1.5 text-xs font-medium text-white" style={{ background: form.primaryColor }}>
            Sample button
          </button>
        </div>
      </div>
    </div>
  );
}

function StepWorkspace({ form, set }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Claim your workspace URL</h2>
        <p className="mt-1 text-sm text-muted-foreground">This is where your team will sign in every day.</p>
      </div>
      <Field label="Workspace URL" required>
        <div className="flex items-center overflow-hidden rounded-md border border-border bg-elevated/40 focus-within:border-primary">
          <Input
            value={form.workspaceSlug}
            onChange={(e) => set("workspaceSlug", slugify(e.target.value))}
            className="border-0 bg-transparent focus-visible:ring-0"
            placeholder="acme-logistics"
          />
          <span className="whitespace-nowrap border-l border-border bg-elevated/70 px-3 py-2 text-xs text-muted-foreground">
            .primelex.app
          </span>
        </div>
      </Field>
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Your workspace URL</div>
        <div className="mt-1 font-mono text-sm text-primary">
          https://{form.workspaceSlug || "your-workspace"}.primelex.app
        </div>
      </div>
      <Field label="Region">
        <Select defaultValue="west-africa">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="west-africa">West Africa (Lagos)</SelectItem>
            <SelectItem value="east-africa">East Africa (Nairobi)</SelectItem>
            <SelectItem value="europe">Europe (Frankfurt)</SelectItem>
            <SelectItem value="middle-east">Middle East (Dubai)</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

function StepAdmin({ form, set }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Create your admin account</h2>
        <p className="mt-1 text-sm text-muted-foreground">You'll be the workspace owner. You can invite the rest of your team later.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Full name" required>
          <Input value={form.adminName} onChange={(e) => set("adminName", e.target.value)} placeholder="Jane Doe" />
        </Field>
        <Field label="Job title">
          <Input placeholder="Chief Executive Officer" defaultValue="Chief Executive Officer" />
        </Field>
        <Field label="Work email" required>
          <Input type="email" value={form.adminEmail} onChange={(e) => set("adminEmail", e.target.value)} placeholder="jane@company.com" />
        </Field>
        <Field label="Password" required>
          <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="At least 6 characters" />
        </Field>
      </div>
      <div className="rounded-lg border border-border/60 bg-elevated/40 p-4 text-xs text-muted-foreground">
        By creating an account, you agree to the {form.companyName || "your company"} tenancy agreement and PrimeLex Terms of Service.
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {label} {required && <span className="text-danger">*</span>}
      </Label>
      {children}
    </div>
  );
}

// ---------- Provisioning ----------

function ProvisioningScreen({ slug, companyName, primaryColor }: { slug: string; companyName: string; primaryColor: string }) {
  const stages = [
    "Reserving workspace URL...",
    "Provisioning tenant database...",
    "Configuring fleet modules...",
    "Applying branding & permissions...",
    "Finalizing your dashboard...",
  ];
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setStage((s) => Math.min(s + 1, stages.length - 1)), 800);
    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-elevated/60 p-10 backdrop-blur"
        style={{ boxShadow: `0 0 80px ${primaryColor}20` }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: `linear-gradient(90deg, ${primaryColor}, transparent)` }}
        />
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: primaryColor }}>
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
            <div className="absolute inset-0 animate-ping rounded-2xl" style={{ background: primaryColor, opacity: 0.3 }} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Building {companyName || "your workspace"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">This usually takes under 5 seconds.</p>
          </div>

          <div className="w-full space-y-2 text-left">
            {stages.map((s, i) => {
              const done = stage > i;
              const active = stage === i;
              return (
                <div key={s} className={cn("flex items-center gap-3 rounded-lg border px-3 py-2 text-xs transition-colors", done ? "border-success/30 bg-success/5 text-success" : active ? "border-primary/40 bg-primary/5 text-foreground" : "border-border/60 text-muted-foreground")}>
                  {done ? <CheckCircle2 className="h-4 w-4" /> : active ? <Loader2 className="h-4 w-4 animate-spin" /> : <div className="h-4 w-4 rounded-full border border-border" />}
                  <span>{s}</span>
                </div>
              );
            })}
          </div>

          <div className="w-full rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Workspace URL</div>
            <div className="mt-1 font-mono text-xs text-primary">{slug}.primelex.app</div>
          </div>
        </div>
      </div>
    </div>
  );
}
