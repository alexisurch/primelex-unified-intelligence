import { createFileRoute, useParams } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { SectionCard, Pill } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBranding } from "@/lib/branding";
import { updateTenant } from "@/lib/tenants";
import { toast } from "sonner";
import { useRef, useState } from "react";
import {
  Building2, Upload, Palette, Globe, Mail, Phone, MapPin, Save, RotateCcw, Image as ImageIcon,
} from "lucide-react";

export const Route = createFileRoute("/organisation/$orgSlug/_workspace/organisation")({
  component: Organisation,
});

function Organisation() {
  const branding = useBranding();
  const { orgSlug } = useParams({ from: "/organisation/$orgSlug/_workspace/organisation" });
  const [form, setForm] = useState({
    companyName: branding.companyName,
    companyShort: branding.companyShort,
    industry: branding.industry,
    businessEmail: branding.businessEmail,
    phone: branding.phone,
    primaryColor: branding.primaryColor,
    secondaryColor: branding.secondaryColor,
    adminName: branding.adminName,
    adminEmail: branding.adminEmail,
    region: branding.region,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const save = () => {
    updateTenant(orgSlug, form);
    branding.update(form);
    toast.success("Organisation profile updated");
  };

  const onLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) {
      toast.error("Logo must be under 500KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateTenant(orgSlug, { logoDataUrl: dataUrl });
      branding.update({ logoDataUrl: dataUrl });
      toast.success("Logo updated");
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Header title="Organisation" subtitle="Company profile, branding and general configuration" />
      <div className="space-y-6 p-8">
        {/* Company Profile Card */}
        <SectionCard title="Company Profile" action={<Pill tone="success">Active</Pill>}>
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* Logo */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-elevated/60">
                {branding.logoDataUrl ? (
                  <img src={branding.logoDataUrl} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={onLogoUpload} />
              <Button size="sm" variant="outline" className="border-border bg-elevated/60" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-1.5 h-3.5 w-3.5" />Replace Logo
              </Button>
            </div>

            {/* Info */}
            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Company Name</Label>
                <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="bg-elevated/60" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Short Name</Label>
                <Input value={form.companyShort} onChange={(e) => setForm({ ...form, companyShort: e.target.value })} className="bg-elevated/60" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Industry</Label>
                <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="bg-elevated/60" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Business Email</Label>
                <Input value={form.businessEmail} onChange={(e) => setForm({ ...form, businessEmail: e.target.value })} className="bg-elevated/60" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-elevated/60" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Workspace Slug</Label>
                <Input value={orgSlug} readOnly className="bg-elevated/60 font-mono text-muted-foreground" />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Branding */}
        <SectionCard title="Brand Identity" action={
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={save}>
            <Save className="mr-1.5 h-3.5 w-3.5" />Save Changes
          </Button>
        }>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5"><Palette className="h-3 w-3" />Primary Brand Colour</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="h-9 w-12 rounded border border-border bg-elevated/60 cursor-pointer" />
                <Input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="bg-elevated/60 font-mono" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5"><Palette className="h-3 w-3" />Secondary Brand Colour</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className="h-9 w-12 rounded border border-border bg-elevated/60 cursor-pointer" />
                <Input value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className="bg-elevated/60 font-mono" />
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 rounded-lg border border-border/60 bg-background/30 p-4">
            <div className="text-xs text-muted-foreground">Preview:</div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: form.primaryColor }}>
                <ImageIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold">{form.companyName}</span>
            </div>
            <div className="ml-4 flex gap-2">
              <span className="rounded-md px-3 py-1 text-xs font-medium text-white" style={{ background: form.primaryColor }}>Primary Button</span>
              <span className="rounded-md px-3 py-1 text-xs font-medium text-white" style={{ background: form.secondaryColor }}>Secondary Button</span>
            </div>
          </div>
        </SectionCard>

        {/* General Settings */}
        <SectionCard title="General Settings">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5"><Globe className="h-3 w-3" />Workspace URL</Label>
              <Input value={`/organisation/${orgSlug}/login`} readOnly className="bg-elevated/60 font-mono text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5"><Mail className="h-3 w-3" />Admin Email</Label>
              <Input value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} className="bg-elevated/60" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5"><Phone className="h-3 w-3" />Support Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-elevated/60" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5"><MapPin className="h-3 w-3" />Region</Label>
              <Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="bg-elevated/60" />
            </div>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
