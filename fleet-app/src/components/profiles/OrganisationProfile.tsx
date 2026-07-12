import { useRef, useState, type ChangeEvent } from "react";
import {
  Building2,
  Upload,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  RotateCcw,
  CalendarDays,
  Clock,
  DollarSign,
  Languages,
  Ruler,
} from "lucide-react";
import { toast } from "sonner";
import { useBranding } from "@/lib/branding";
import { ProfileSection } from "@/components/profiles/ProfileShell";
import { Pill } from "@/components/shared/Cards";

/* ------------------------------------------------------------------ */
/* Small helpers                                                        */
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
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

function TextInput(props: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
}) {
  const { id, value, onChange, placeholder, type = "text", readOnly = false } = props;
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className="h-10 w-full rounded-md border border-border bg-elevated/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
    />
  );
}

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
          className="h-10 w-28 rounded-md border border-border bg-elevated/60 px-3 text-sm uppercase text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <span
          className="h-10 flex-1 rounded-md border border-border/60"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function OrganisationProfile({
  onBack,
}: {
  onBack?: () => void;
}) {
  const { branding, update, reset } = useBranding();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [generalSettings, setGeneralSettings] = useState({
    timezone: "Africa/Lagos (WAT, UTC+1)",
    dateFormat: "DD/MM/YYYY",
    currency: "Nigerian Naira (₦)",
    language: "English (Nigeria)",
    defaultUnits: "Metric (km, L)",
  });

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
      toast.success("Logo updated");
    };
    reader.onerror = () => toast.error("Failed to read file");
    reader.readAsDataURL(file);
  }

  function handleSave() {
    toast.success("Organisation profile saved", {
      description: `${branding.companyName} · ${branding.workspaceSlug}`,
    });
  }

  function handleReset() {
    reset();
    toast.success("Reset to defaults");
  }

  void onBack;

  return (
    <div className="flex flex-col gap-6">
      {/* Company identity header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-white/[0.02]">
          {branding.logoDataUrl ? (
            <img
              src={branding.logoDataUrl}
              alt="Company logo"
              className="h-full w-full object-contain"
            />
          ) : (
            <Building2 className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-foreground">{branding.companyName}</h3>
          <p className="text-sm text-muted-foreground">{branding.industry}</p>
          <Pill tone="success">Active</Pill>
        </div>
      </div>

      {/* Organisation Information */}
      <ProfileSection title="Organisation Information">
        <div className="grid grid-cols-1 gap-4">
          <FieldShell label="Organisation Name" htmlFor="org-name">
            <TextInput
              id="org-name"
              value={branding.companyName}
              onChange={(v) => update({ companyName: v })}
              placeholder="PrimeLex Logistics"
            />
          </FieldShell>
          <FieldShell label="Short Name" htmlFor="org-short">
            <TextInput
              id="org-short"
              value={branding.companyShort}
              onChange={(v) => update({ companyShort: v })}
              placeholder="PRIMELEX"
            />
          </FieldShell>
          <FieldShell label="Industry" htmlFor="org-industry">
            <TextInput
              id="org-industry"
              value={branding.industry}
              onChange={(v) => update({ industry: v })}
              placeholder="Logistics & Transportation"
            />
          </FieldShell>
        </div>
      </ProfileSection>

      {/* Logo */}
      <ProfileSection title="Logo">
        <div className="flex flex-col items-start gap-3">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-white/[0.02]">
            {branding.logoDataUrl ? (
              <img
                src={branding.logoDataUrl}
                alt="Company logo"
                className="h-full w-full object-contain"
              />
            ) : (
              <Building2 className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
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
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border/60 px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
          >
            <Upload className="h-3.5 w-3.5" strokeWidth={2} />
            Replace Logo
          </button>
          <p className="text-xs text-muted-foreground">PNG or SVG, up to 2MB. Updates branding across the platform.</p>
        </div>
      </ProfileSection>

      {/* Branding */}
      <ProfileSection title="Brand Colours">
        <div className="flex flex-col gap-4">
          <ColorPicker
            id="panel-primary-color"
            label="Primary Brand Colour"
            value={branding.primaryColor}
            onChange={(v) => update({ primaryColor: v })}
          />
          <ColorPicker
            id="panel-secondary-color"
            label="Secondary Brand Colour"
            value={branding.secondaryColor}
            onChange={(v) => update({ secondaryColor: v })}
          />
          {/* Live preview */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Palette className="h-3 w-3" strokeWidth={2} />
              Live Preview
            </span>
            <div
              className="flex items-center gap-3 rounded-xl border border-border/60 p-4"
              style={{ background: `linear-gradient(135deg, ${branding.primaryColor}22, ${branding.secondaryColor}22)` }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <Building2 className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{branding.companyName || "Your Company"}</span>
              </div>
              <div className="ml-auto flex gap-2">
                <span className="inline-flex h-7 items-center rounded-md px-2.5 text-xs font-semibold text-white" style={{ backgroundColor: branding.primaryColor }}>
                  Primary
                </span>
                <span className="inline-flex h-7 items-center rounded-md px-2.5 text-xs font-semibold text-white" style={{ backgroundColor: branding.secondaryColor }}>
                  Secondary
                </span>
              </div>
            </div>
          </div>
        </div>
      </ProfileSection>

      {/* Contact Information */}
      <ProfileSection title="Contact Information">
        <div className="grid grid-cols-1 gap-4">
          <FieldShell label="Business Email" htmlFor="org-email">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
              <input
                id="org-email"
                type="email"
                value={branding.businessEmail}
                onChange={(e) => update({ businessEmail: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </FieldShell>
          <FieldShell label="Phone" htmlFor="org-phone">
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
              <input
                id="org-phone"
                type="tel"
                value={branding.phone}
                onChange={(e) => update({ phone: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </FieldShell>
          <FieldShell label="Website" htmlFor="org-website">
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
              <input
                id="org-website"
                type="url"
                defaultValue={`https://www.${branding.workspaceSlug || "primelex"}.ng`}
                className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </FieldShell>
          <FieldShell label="Headquarters" htmlFor="org-hq">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
              <input
                id="org-hq"
                type="text"
                defaultValue="Lagos, Nigeria"
                className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </FieldShell>
        </div>
      </ProfileSection>

      {/* General Settings (moved from System Settings) */}
      <ProfileSection title="General Settings">
        <div className="grid grid-cols-1 gap-4">
          <FieldShell label="Time Zone" htmlFor="org-tz">
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
              <input
                id="org-tz"
                type="text"
                value={generalSettings.timezone}
                onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </FieldShell>
          <FieldShell label="Date Format" htmlFor="org-date-fmt">
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
              <input
                id="org-date-fmt"
                type="text"
                value={generalSettings.dateFormat}
                onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </FieldShell>
          <FieldShell label="Currency" htmlFor="org-currency">
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
              <input
                id="org-currency"
                type="text"
                value={generalSettings.currency}
                onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </FieldShell>
          <FieldShell label="Language" htmlFor="org-lang">
            <div className="relative">
              <Languages className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
              <input
                id="org-lang"
                type="text"
                value={generalSettings.language}
                onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </FieldShell>
          <FieldShell label="Default Units" htmlFor="org-units">
            <div className="relative">
              <Ruler className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
              <input
                id="org-units"
                type="text"
                value={generalSettings.defaultUnits}
                onChange={(e) => setGeneralSettings({ ...generalSettings, defaultUnits: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </FieldShell>
          <FieldShell
            label="Workspace URL"
            htmlFor="org-workspace-url"
            hint={`https://${branding.workspaceSlug || "workspace"}.primelex.app`}
          >
            <FieldShell label="" htmlFor="org-workspace-slug">
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
                <input
                  id="org-workspace-slug"
                  type="text"
                  value={branding.workspaceSlug}
                  onChange={(e) => update({ workspaceSlug: e.target.value })}
                  className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </FieldShell>
          </FieldShell>
          <FieldShell label="Admin Email" htmlFor="org-admin-email">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
              <input
                id="org-admin-email"
                type="email"
                value={branding.adminEmail}
                onChange={(e) => update({ adminEmail: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-elevated/60 pl-9 pr-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </FieldShell>
        </div>
      </ProfileSection>

      {/* Created date */}
      <ProfileSection title="System Information">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="h-3 w-3" strokeWidth={2} />
              Created
            </span>
            <span className="text-foreground">January 12, 2023</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3 w-3" strokeWidth={2} />
              Last Updated
            </span>
            <span className="text-foreground">Today</span>
          </div>
        </div>
      </ProfileSection>

      {/* Save / Reset */}
      <div className="flex items-center justify-end gap-3 pt-2">
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
