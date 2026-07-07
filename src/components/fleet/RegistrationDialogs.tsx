import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Truck as TruckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function TruckRegistrationDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ plate: "", model: "", type: "Box Truck", capacity: "", year: "", vin: "", driver: "" });

  const submit = () => {
    if (!form.plate || !form.model) { toast.error("Registration and model are required"); return; }
    toast.success(`Truck ${form.plate} registered to fleet`);
    setOpen(false);
    setForm({ plate: "", model: "", type: "Box Truck", capacity: "", year: "", vin: "", driver: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="mr-1.5 h-4 w-4" />Add New Truck</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><TruckIcon className="h-5 w-5 text-primary" />Register New Truck</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Field label="Registration Number *"><Input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="KJA 123 AB" /></Field>
          <Field label="Make / Model *"><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Volvo FH16" /></Field>
          <Field label="Vehicle Type">
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Box Truck">Box Truck</SelectItem>
                <SelectItem value="Rigid Truck">Rigid Truck</SelectItem>
                <SelectItem value="Articulated Tractor">Articulated Tractor</SelectItem>
                <SelectItem value="Tipper">Tipper</SelectItem>
                <SelectItem value="Flatbed">Flatbed</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Capacity (kg)"><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="20000" /></Field>
          <Field label="Year"><Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" /></Field>
          <Field label="VIN / Chassis"><Input value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value })} placeholder="WVWZZZ..." /></Field>
          <Field label="Initial Driver" className="col-span-2"><Input value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} placeholder="Optional — assign later" /></Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-primary text-primary-foreground">Register Truck</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DriverRegistrationDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", license: "", licenseClass: "Class C", expiry: "", truck: "" });

  const submit = () => {
    if (!form.name || !form.license) { toast.error("Name and licence are required"); return; }
    toast.success(`Driver ${form.name} added`);
    setOpen(false);
    setForm({ name: "", phone: "", license: "", licenseClass: "Class C", expiry: "", truck: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="mr-1.5 h-4 w-4" />Add Driver</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Register New Driver</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Field label="Full Name *"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234 803 000 0000" /></Field>
          <Field label="Licence Number *"><Input value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} placeholder="NG-123456" /></Field>
          <Field label="Licence Class">
            <Select value={form.licenseClass} onValueChange={(v) => setForm({ ...form, licenseClass: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Class C">Class C</SelectItem>
                <SelectItem value="Class D">Class D</SelectItem>
                <SelectItem value="Class E">Class E</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Licence Expiry"><Input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} /></Field>
          <Field label="Assigned Truck"><Input value={form.truck} onChange={(e) => setForm({ ...form, truck: e.target.value })} placeholder="Optional — TRK-1000" /></Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-primary text-primary-foreground">Add Driver</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
