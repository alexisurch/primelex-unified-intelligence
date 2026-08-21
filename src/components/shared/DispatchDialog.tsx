import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Truck as TruckIcon, CircleUser as UserCircle2, Building2 } from "lucide-react";
import { trucks, drivers, clients } from "@/lib/mock-data";
import { useTrips } from "@/lib/trips-store";

interface DispatchDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  preselectedTruckId?: string;
}

export function DispatchDialog({ open, onOpenChange, preselectedTruckId }: DispatchDialogProps) {
  const { dispatch, isTruckAvailable } = useTrips();
  const [truckId, setTruckId] = useState(preselectedTruckId ?? "");
  const [driverName, setDriverName] = useState("");
  const [clientName, setClientName] = useState("");

  const availableTrucks = trucks.filter((t) => isTruckAvailable(t.id));
  const activeDrivers = drivers.filter((d) => d.status === "Active");

  function handleSubmit() {
    if (!truckId) { toast.error("Please select a truck."); return; }
    if (!driverName) { toast.error("Please select a driver."); return; }
    if (!clientName || clientName === "none") { toast.error("Please select a client."); return; }
    const trip = dispatch({ truckId, driverName, clientName });
    const truck = trucks.find((t) => t.id === truckId);
    toast.success(`Truck successfully dispatched. Trip ${trip.id} has been created.`);
    setTruckId(""); setDriverName(""); setClientName("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Dispatch Truck</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-[11px] uppercase text-muted-foreground flex items-center gap-1.5"><TruckIcon className="h-3 w-3" /> Truck *</Label>
            <Select value={truckId} onValueChange={(v) => { setTruckId(v); const t = trucks.find((x) => x.id === v); if (t) setDriverName(t.driver); }}>
              <SelectTrigger className="mt-1 bg-elevated/60"><SelectValue placeholder="Select available truck" /></SelectTrigger>
              <SelectContent>
                {availableTrucks.length === 0 && <SelectItem value="_none" disabled>No trucks available</SelectItem>}
                {availableTrucks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.id} · {t.plate} · {t.model.split(" ")[0]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11px] uppercase text-muted-foreground flex items-center gap-1.5"><UserCircle2 className="h-3 w-3" /> Driver *</Label>
            <Select value={driverName} onValueChange={setDriverName}>
              <SelectTrigger className="mt-1 bg-elevated/60"><SelectValue placeholder="Select driver" /></SelectTrigger>
              <SelectContent>
                {activeDrivers.map((d) => (
                  <SelectItem key={d.id} value={d.name}>{d.name} · {d.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11px] uppercase text-muted-foreground flex items-center gap-1.5"><Building2 className="h-3 w-3" /> Client *</Label>
            <Select value={clientName} onValueChange={setClientName}>
              <SelectTrigger className="mt-1 bg-elevated/60"><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No client selected</SelectItem>
                {clients.filter((c) => c.status === "Active").map((c) => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-[11px] text-muted-foreground">Route can be added after dispatch. The trip will be created with status "Dispatched".</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">Dispatch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
