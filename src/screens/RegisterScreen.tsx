import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Route as RouteIcon,
  Sparkles,
  CircleCheck as CheckCircle2,
  Loader as Loader2,
  Link2,
  Copy,
} from "lucide-react";
import { saveOrganisation, type OrganisationRecord } from "@/lib/organisations-store";
import { useBranding } from "@/lib/branding";
import { showAppToast } from "@/lib/toast";

interface RegisterForm {
  companyName: string;
  companyShort: string;
  industry: string;
  businessEmail: string;
  phone: string;
  logoDataUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  workspaceSlug: string;
  adminName: string;
  adminEmail: string;
  password: string;
}

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

const INDUSTRIES = [
  "Logistics & Transportation",
  "Cold Chain",
  "Petroleum & Gas",
  "FMCG Distribution",
  "Manufacturing",
  "Mining & Heavy Haul",
  "Retail Delivery",
];

const REGIONS = [
  { value: "west-africa", label: "West Africa (Lagos)" },
  { value: "east-africa", label: "East Africa (Nairobi)" },
  { value: "europe", label: "Europe (Frankfurt)" },
  { value: "middle-east", label: "Middle East (Dubai)" },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

interface RegisterScreenProps {
  onBack: () => void;
  onGoToLogin: () => void;
}

export function RegisterScreen({ onBack, onGoToLogin }: RegisterScreenProps) {
  const branding = useBranding();
  const [step, setStep] = useState(1);
  const [provisioning, setProvisioning] = useState(false);
  const [provisionedSlug, setProvisionedSlug] = useState<string | null>(null);

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

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const fileRef = useRef<HTMLInputElement>(null);

  const canNext = () => {
    if (step === 1) return form.companyName.trim().length > 1 && form.businessEmail.includes("@");
    if (step === 2) return true;
    if (step === 3) return form.workspaceSlug.length > 2;
    if (step === 4)
      return (
        form.adminName.trim().length > 1 &&
        form.adminEmail.includes("@") &&
        form.password.length >= 6
      );
    return false;
  };

  const next = () => {
    if (!canNext()) {
      showAppToast("Please complete the required fields", "error");
      return;
    }
    if (step < 4) setStep(step + 1);
    else provision();
  };
  const back = () => step > 1 && setStep(step - 1);

  const onLogoChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showAppToast("Please upload an image", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("logoDataUrl", reader.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (form.companyName && !form.workspaceSlug) set("workspaceSlug", slugify(form.companyName));
    if (form.companyName && !form.companyShort)
      set("companyShort", form.companyName.split(" ")[0].toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.companyName]);

  const provision = () => {
    setProvisioning(true);
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
    const org: OrganisationRecord = {
      slug: form.workspaceSlug,
      companyName: form.companyName,
      companyShort: form.companyShort || form.companyName.split(" ")[0].toUpperCase(),
      industry: form.industry,
      logoDataUrl: form.logoDataUrl,
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
      adminName: form.adminName,
      adminEmail: form.adminEmail,
      createdAt: new Date().toISOString(),
    };
    saveOrganisation(org);
    setTimeout(() => {
      showAppToast(`Workspace is ready — sign in as ${form.adminEmail}`, "success");
      setProvisioning(false);
      setProvisionedSlug(form.workspaceSlug);
    }, 4200);
  };

  if (provisioning)
    return (
      <ProvisioningScreen
        slug={form.workspaceSlug}
        companyName={form.companyName}
        primaryColor={form.primaryColor}
      />
    );
  if (provisionedSlug)
    return (
      <WorkspaceReadyScreen
        slug={provisionedSlug}
        companyName={form.companyName}
        primaryColor={form.primaryColor}
        onContinue={onGoToLogin}
      />
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RouteIcon className="h-4 w-4" />
            PrimeLex LIS
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
                  className={
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors " +
                    (done
                      ? "border-transparent bg-success text-white"
                      : active
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-card/60 text-muted-foreground")
                  }
                >
                  {done ? <Check className="h-4 w-4" /> : s.id}
                </div>
                <div className="min-w-0">
                  <div
                    className={
                      "text-xs font-semibold uppercase tracking-wider " +
                      (active ? "text-foreground" : "text-muted-foreground")
                    }
                  >
                    {s.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{s.description}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={"mx-2 h-px flex-1 " + (done ? "bg-success/60" : "bg-border")} />
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/40 p-8 backdrop-blur">
          {step === 1 && <StepCompany form={form} set={set} />}
          {step === 2 && (
            <StepBranding
              form={form}
              set={set}
              onFile={() => fileRef.current?.click()}
              fileRef={fileRef}
              onLogoChange={onLogoChange}
            />
          )}
          {step === 3 && <StepWorkspace form={form} set={set} />}
          {step === 4 && <StepAdmin form={form} set={set} />}

          <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-6">
            <button
              onClick={back}
              disabled={step === 1}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </button>
            <div className="text-xs text-muted-foreground">
              Step {step} of {STEPS.length}
            </div>
            <button
              onClick={next}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: form.primaryColor }}
            >
              {step === 4 ? "Create workspace" : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Field primitives ─────────────────────────────────────────────────────── */

function LabelText({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-xs font-medium">
      {label} {required && <span className="text-error">*</span>}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring " +
        className
      }
    />
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <LabelText label={label} required={required} />
      {children}
    </div>
  );
}

/* ── Steps ─────────────────────────────────────────────────────────────────── */

function StepCompany({
  form,
  set,
}: {
  form: RegisterForm;
  set: <K extends keyof RegisterForm>(k: K, v: RegisterForm[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Tell us about your company</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We'll use this to personalize your LIS workspace.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Company name" required>
          <TextInput
            value={form.companyName}
            onChange={(v) => set("companyName", v)}
            placeholder="Acme Logistics Ltd."
          />
        </Field>
        <Field label="Short name / Ticker">
          <TextInput
            value={form.companyShort}
            onChange={(v) => set("companyShort", v.toUpperCase())}
            placeholder="ACME"
            maxLength={12}
          />
        </Field>
        <Field label="Industry">
          <NativeSelect
            value={form.industry}
            onChange={(v) => set("industry", v)}
            options={INDUSTRIES}
          />
        </Field>
        <Field label="Business email" required>
          <TextInput
            type="email"
            value={form.businessEmail}
            onChange={(v) => set("businessEmail", v)}
            placeholder="ops@company.com"
          />
        </Field>
        <Field label="Phone number">
          <TextInput
            value={form.phone}
            onChange={(v) => set("phone", v)}
            placeholder="+234 800 000 0000"
          />
        </Field>
      </div>
    </div>
  );
}

function StepBranding({
  form,
  set,
  onFile,
  fileRef,
  onLogoChange,
}: {
  form: RegisterForm;
  set: <K extends keyof RegisterForm>(k: K, v: RegisterForm[K]) => void;
  onFile: () => void;
  fileRef: React.RefObject<HTMLInputElement>;
  onLogoChange: (f: File) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Bring your brand</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your logo and pick colors — your workspace updates in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <LabelText label="Company logo" />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onLogoChange(e.target.files[0])}
          />
          <button
            onClick={onFile}
            className="flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/40 transition-colors hover:border-primary/40"
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
          <LabelText label="Brand palette" />
          <div className="grid grid-cols-3 gap-2">
            {COLOR_PRESETS.map((p) => {
              const active = form.primaryColor === p.primary;
              return (
                <button
                  key={p.name}
                  onClick={() => {
                    set("primaryColor", p.primary);
                    set("secondaryColor", p.secondary);
                  }}
                  className={
                    "flex flex-col gap-2 rounded-lg border p-3 text-left transition-colors " +
                    (active
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card/40 hover:border-primary/40")
                  }
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
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => set("primaryColor", e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent"
                />
                <TextInput
                  value={form.primaryColor}
                  onChange={(v) => set("primaryColor", v)}
                  className="font-mono text-xs"
                />
              </div>
            </Field>
            <Field label="Secondary">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.secondaryColor}
                  onChange={(e) => set("secondaryColor", e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent"
                />
                <TextInput
                  value={form.secondaryColor}
                  onChange={(v) => set("secondaryColor", v)}
                  className="font-mono text-xs"
                />
              </div>
            </Field>
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div className="rounded-xl border border-border/60 bg-background p-4">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          Live preview
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card/60 p-3">
          {form.logoDataUrl ? (
            <img src={form.logoDataUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})`,
              }}
            >
              <RouteIcon className="h-5 w-5 text-white" />
            </div>
          )}
          <div className="flex-1">
            <div className="text-sm font-semibold">{form.companyName || "Your Company"}</div>
            <div className="text-[11px] text-muted-foreground">Logistics Intelligence System</div>
          </div>
          <button
            className="rounded-md px-3 py-1.5 text-xs font-medium text-white"
            style={{ background: form.primaryColor }}
          >
            Sample button
          </button>
        </div>
      </div>
    </div>
  );
}

function StepWorkspace({ form, set }: { form: RegisterForm; set: <K extends keyof RegisterForm>(k: K, v: RegisterForm[K]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Claim your workspace URL</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This is where your team will sign in every day.
        </p>
      </div>
      <Field label="Workspace name" required>
        <TextInput
          value={form.workspaceSlug}
          onChange={(v) => set("workspaceSlug", slugify(v))}
          placeholder="acme-logistics"
        />
        <p className="text-xs text-muted-foreground">
          This becomes part of your workspace sign-in address.
        </p>
      </Field>
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Your workspace sign-in address
        </div>
        <div className="mt-1 break-all font-mono text-sm text-primary">
          {typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com"}/
          {form.workspaceSlug || "your-workspace"}/login
        </div>
      </div>
      <Field label="Region">
        <NativeSelect
          value="west-africa"
          onChange={() => {}}
          options={REGIONS.map((r) => ({ value: r.value, label: r.label }))}
        />
      </Field>
    </div>
  );
}

function StepAdmin({ form, set }: { form: RegisterForm; set: <K extends keyof RegisterForm>(k: K, v: RegisterForm[K]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Create your admin account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You'll be the workspace owner. You can invite the rest of your team later.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Full name" required>
          <TextInput
            value={form.adminName}
            onChange={(v) => set("adminName", v)}
            placeholder="Jane Doe"
          />
        </Field>
        <Field label="Job title">
          <TextInput value="Chief Executive Officer" onChange={() => {}} />
        </Field>
        <Field label="Work email" required>
          <TextInput
            type="email"
            value={form.adminEmail}
            onChange={(v) => set("adminEmail", v)}
            placeholder="jane@company.com"
          />
        </Field>
        <Field label="Password" required>
          <TextInput
            type="password"
            value={form.password}
            onChange={(v) => set("password", v)}
            placeholder="At least 6 characters"
          />
        </Field>
      </div>
      <div className="rounded-lg border border-border/60 bg-card/40 p-4 text-xs text-muted-foreground">
        By creating an account, you agree to the{" "}
        {form.companyName || "your company"} tenancy agreement and PrimeLex Terms of Service.
      </div>
    </div>
  );
}

/* ── Native select (no Radix dependency) ──────────────────────────────────── */

function NativeSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[] | string[];
}) {
  const opts = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
    >
      {opts.map((o) => (
        <option key={o.value} value={o.value} className="bg-background text-foreground">
          {o.label}
        </option>
      ))}
    </select>
  );
}

/* ── Provisioning ──────────────────────────────────────────────────────────── */

function ProvisioningScreen({
  slug,
  companyName,
  primaryColor,
}: {
  slug: string;
  companyName: string;
  primaryColor: string;
}) {
  const stages = [
    "Reserving workspace URL...",
    "Provisioning tenant database...",
    "Configuring fleet modules...",
    "Applying branding & permissions...",
    "Finalizing your dashboard...",
  ];
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setStage((s) => Math.min(s + 1, stages.length - 1)),
      800,
    );
    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card/60 p-10 backdrop-blur"
        style={{ boxShadow: `0 0 80px ${primaryColor}20` }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: `linear-gradient(90deg, ${primaryColor}, transparent)` }}
        />
        <div className="flex flex-col items-center gap-6 text-center">
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: primaryColor }}
          >
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
            <div
              className="absolute inset-0 animate-ping rounded-2xl"
              style={{ background: primaryColor, opacity: 0.3 }}
            />
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
                <div
                  key={s}
                  className={
                    "flex items-center gap-3 rounded-lg border px-3 py-2 text-xs transition-colors " +
                    (done
                      ? "border-success/30 bg-success/5 text-success"
                      : active
                        ? "border-primary/40 bg-primary/5 text-foreground"
                        : "border-border/60 text-muted-foreground")
                  }
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-border" />
                  )}
                  <span>{s}</span>
                </div>
              );
            })}
          </div>

          <div className="w-full rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Workspace sign-in address
            </div>
            <div className="mt-1 break-all font-mono text-xs text-primary">
              {typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com"}/
              {slug}/login
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceReadyScreen({
  slug,
  companyName,
  primaryColor,
  onContinue,
}: {
  slug: string;
  companyName: string;
  primaryColor: string;
  onContinue: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const workspaceUrl = `${window.location.origin}/${slug}/login`;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(workspaceUrl);
      setCopied(true);
      showAppToast("Workspace link copied", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showAppToast("Couldn't copy — select and copy manually", "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card/60 p-10 backdrop-blur">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{companyName} is ready</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your Logistics Intelligence System workspace is live.
            </p>
          </div>

          <div className="w-full space-y-3 text-left">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Share this link with your employees
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
              <Link2 className="h-4 w-4 shrink-0 text-primary" />
              <span className="flex-1 truncate font-mono text-sm text-foreground">
                {workspaceUrl}
              </span>
              <button
                onClick={copyUrl}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              This is the dedicated sign-in address for {companyName}. Employees use it to access
              your workspace — no searching required.
            </p>
          </div>

          <button
            onClick={onContinue}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: primaryColor }}
          >
            Continue to Administrator Login
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
