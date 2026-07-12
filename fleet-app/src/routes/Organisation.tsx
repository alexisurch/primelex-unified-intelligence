import { useRef, type ChangeEvent } from "react";
import {
  Building2,
  Palette,
  Settings,
  Upload,
  Save,
  RotateCcw,
  Globe,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { SectionCard, GlassCard } from "@/components/shared/Cards";
import { useBranding } from "@/lib/branding";
import { useProfileDrawer } from "@/lib/profile-drawer";

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

function FieldShell({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}

function TextInput(props: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const { id, value, onChange, placeholder, type = "text" } = props;
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-md border border-border bg-elevated/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function Organisation() {
  const { branding, update, reset } = useBranding();
  const { open: openProfile } = useProfileDrawer();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      update({ logoDataUrl: String(reader.result) });
      toast.success("Logo uploaded");
    };
    reader.onerror = () => toast.error("Failed to read file");
    reader.readAsDataURL(file);
  }

  function handleSave() {
    toast.success("Organisation settings saved", {
      description: `${branding.companyName} · ${branding.workspaceSlug}`,
    });
  }

  function handleReset() {
    reset();
    toast.success("Organisation settings reset to defaults");
  }

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Organisation"
        subtitle="Company profile, brand identity and general workspace settings."
        showExport={false}
      />

      {/* Organisation profile card — clicking opens the right-side slide-out */}
      <GlassCard hover={true} className="cursor-pointer border-primary/20">
        <button
          type="button"
          onClick={() => openProfile({ kind: "organisation", id: "org" })}
          className="flex w-full items-center gap-4 text-left"
          aria-label="Open organisation profile"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-white/[0.02]">
            {branding.logoDataUrl ? (
              <img
                src={branding.logoDataUrl}
                alt="Company logo"
                className="h-full w-full object-contain"
              />
            ) : (
              <Building2 className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-base font-semibold text-foreground">{branding.companyName}</span>
            <span className="text-sm text-muted-foreground">{branding.industry}</span>
            <span className="text-xs text-muted-foreground">{branding.businessEmail}</span>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2} />
        </button>
      </GlassCard>

      {/* Company Profile */}
      <SectionCard
        title="Company Profile"
        action={
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" strokeWidth={2} />
            Profile
          </span>
        }
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[160px_minmax(0,1fr)]">
          {/* Logo upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-white/[0.02]">
              {branding.logoDataUrl ? (
                <img
                  src={branding.logoDataUrl}
                  alt="Company logo"
                  className="h-full w-full object-contain"
                />
              ) : (
                <Building2
                  className="h-10 w-10 text-muted-foreground"
                  strokeWidth={1.5}
                />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border/60 px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
            >
              <Upload className="h-3.5 w-3.5" strokeWidth={2} />
              Upload logo
            </button>
            <p className="text-center text-xs text-muted-foreground">
              PNG or SVG, up to 2MB.
            </p>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldShell label="Company Name" htmlFor="company-name">
              <TextInput
                id="company-name"
                value={branding.companyName}
                onChange={(v) => update({ companyName: v })}
                placeholder="PrimeLex Logistics"
              />
            </FieldShell>
            <FieldShell label="Short Name" htmlFor="company-short">
              <TextInput
                id="company-short"
                value={branding.companyShort}
                onChange={(v) => update({ companyShort: v })}
                placeholder="PRIMELEX"
              />
            </FieldShell>
            <FieldShell label="Industry" htmlFor="industry">
              <TextInput
                id="industry"
                value={branding.industry}
                onChange={(v) => update({ industry: v })}
                placeholder="Logistics & Transportation"
              />
            </FieldShell>
            <FieldShell label="Business Email" htmlFor="business-email">
              <TextInput
                id="business-email"
                type="email"
                value={branding.businessEmail}
                onChange={(v) => update({ businessEmail: v })}
                placeholder="operations@primelex.com"
              />
            </FieldShell>
            <FieldShell label="Phone" htmlFor="company-phone">
              <TextInput
                id="company-phone"
                value={branding.phone}
                onChange={(v) => update({ phone: v })}
                placeholder="+1 (555) 018-2200"
              />
            </FieldShell>
            <FieldShell
              label="Workspace Slug"
              htmlFor="workspace-slug"
              hint="Used in your workspace URL."
            >
              <TextInput
                id="workspace-slug"
                value={branding.workspaceSlug}
                onChange={(v) => update({ workspaceSlug: v })}
                placeholder="primelex"
              />
            </FieldShell>
          </div>
        </div>
      </SectionCard>

      {/* Brand Identity */}
      <SectionCard
        title="Brand Identity"
        action={
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Palette className="h-3.5 w-3.5" strokeWidth={2} />
            Colors
          </span>
        }
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Color pickers */}
          <div className="flex flex-col gap-4">
            <ColorPicker
              id="primary-color"
              label="Primary Color"
              value={branding.primaryColor}
              onChange={(v) => update({ primaryColor: v })}
            />
            <ColorPicker
              id="secondary-color"
              label="Secondary Color"
              value={branding.secondaryColor}
              onChange={(v) => update({ secondaryColor: v })}
            />
          </div>

          {/* Live preview */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Live Preview
            </span>
            <div
              className="flex flex-col gap-4 rounded-xl border border-border/60 p-5"
              style={{
                background: `linear-gradient(135deg, ${branding.primaryColor}22, ${branding.secondaryColor}22)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  <Building2 className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {branding.companyName || "Your Company"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {branding.industry || "Industry"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex h-8 items-center rounded-md px-3 text-xs font-semibold text-white"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Primary Button
                </span>
                <span
                  className="inline-flex h-8 items-center rounded-md px-3 text-xs font-semibold text-white"
                  style={{ backgroundColor: branding.secondaryColor }}
                >
                  Secondary Button
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: branding.primaryColor }}
                />
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: branding.secondaryColor }}
                />
                <span className="text-xs text-muted-foreground">
                  {branding.primaryColor} · {branding.secondaryColor}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* General Settings */}
      <SectionCard
        title="General Settings"
        action={
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Settings className="h-3.5 w-3.5" strokeWidth={2} />
            Workspace
          </span>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldShell
            label="Workspace URL"
            htmlFor="workspace-url"
            hint={`https://${branding.workspaceSlug || "workspace"}.primelex.app`}
          >
            <div className="relative">
              <Globe
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={2}
              />
              <input
                id="workspace-url"
                type="text"
                value={`${branding.workspaceSlug || "workspace"}.primelex.app`}
                readOnly
                className="h-10 w-full rounded-md border border-border bg-elevated/40 pl-9 pr-3 text-sm text-muted-foreground"
              />
            </div>
          </FieldShell>
          <FieldShell label="Admin Email" htmlFor="admin-email">
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={2}
              />
              <input
                id="admin-email"
                type="email"
                value={branding.adminEmail}
                onChange={(e) => update({ adminEmail: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </FieldShell>
          <FieldShell label="Support Phone" htmlFor="support-phone">
            <div className="relative">
              <Phone
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={2}
              />
              <input
                id="support-phone"
                type="tel"
                value={branding.phone}
                onChange={(e) => update({ phone: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </FieldShell>
          <FieldShell label="Region" htmlFor="region">
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={2}
              />
              <input
                id="region"
                type="text"
                defaultValue="West Africa (WAT)"
                className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </FieldShell>
        </div>
      </SectionCard>

      {/* Save / Reset actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border/60 px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={2} />
          Reset
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Save className="h-4 w-4" strokeWidth={2} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Color picker sub-component                                          */
/* ------------------------------------------------------------------ */

function ColorPicker({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 shrink-0 cursor-pointer rounded-md border border-border/60 bg-transparent p-1"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-32 rounded-md border border-border bg-elevated/60 px-3 text-sm uppercase text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <span
          className="h-10 flex-1 rounded-md border border-border/60"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  );
}

export default Organisation;
