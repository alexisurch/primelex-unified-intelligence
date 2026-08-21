import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, ArrowUp, ArrowDown, X } from "lucide-react";
import { useTrips, type TripWithRoute } from "@/lib/trips-store";

const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Enugu", "Kaduna", "Benin", "Warri", "Jos", "Onitsha", "Sokoto", "Calabar", "Maiduguri"];

interface RouteEditorDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  trip: TripWithRoute | null;
}

export function RouteEditorDialog({ open, onOpenChange, trip }: RouteEditorDialogProps) {
  const { updateRoute } = useTrips();
  const [origin, setOrigin] = useState("");
  const [stops, setStops] = useState<string[]>([]);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    if (trip?.routeStops && trip.routeStops.length >= 2) {
      setOrigin(trip.routeStops[0]);
      setDestination(trip.routeStops[trip.routeStops.length - 1]);
      setStops(trip.routeStops.slice(1, -1));
    } else {
      setOrigin(""); setStops([]); setDestination("");
    }
  }, [trip, open]);

  function addStop() { setStops((prev) => [...prev, ""]); }
  function removeStop(idx: number) { setStops((prev) => prev.filter((_, i) => i !== idx)); }
  function moveStop(idx: number, dir: "up" | "down") {
    setStops((prev) => {
      const next = [...prev];
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }
  function updateStop(idx: number, val: string) {
    setStops((prev) => prev.map((s, i) => (i === idx ? val : s)));
  }

  function handleSave() {
    if (!trip) return;
    if (!origin) { toast.error("Please select an origin."); return; }
    if (!destination) { toast.error("Please select a destination."); return; }
    const fullRoute = [origin, ...stops.filter((s) => s.trim()), destination];
    updateRoute(trip.id, fullRoute);
    toast.success(`Route updated for trip ${trip.id}`);
    onOpenChange(false);
  }

  if (!trip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{trip.routeStops && trip.routeStops.length > 0 ? "Update Route" : "Add Route"} · {trip.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-[11px] uppercase text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Origin *</Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger className="mt-1 bg-elevated/60"><SelectValue placeholder="Select origin" /></SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {stops.length > 0 && (
            <div className="space-y-2">
              <Label className="text-[11px] uppercase text-muted-foreground">Stops</Label>
              {stops.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-muted-foreground w-12">Stop {idx + 1}</span>
                  <Select value={stop} onValueChange={(v) => updateStop(idx, v)}>
                    <SelectTrigger className="bg-elevated/60 flex-1"><SelectValue placeholder="Select stop" /></SelectTrigger>
                    <SelectContent>
                      {CITIES.filter((c) => c !== origin && c !== destination && !stops.includes(c)).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-0.5">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" disabled={idx === 0} onClick={() => moveStop(idx, "up")}><ArrowUp className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" disabled={idx === stops.length - 1} onClick={() => moveStop(idx, "down")}><ArrowDown className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-danger" onClick={() => removeStop(idx)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" size="sm" className="w-full border-dashed" onClick={addStop}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Stop</Button>

          <div>
            <Label className="text-[11px] uppercase text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Destination *</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="mt-1 bg-elevated/60"><SelectValue placeholder="Select destination" /></SelectTrigger>
              <SelectContent>
                {CITIES.filter((c) => c !== origin).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {(origin || destination || stops.some((s) => s)) && (
            <div className="rounded-lg border border-border/60 bg-elevated/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Route Preview</div>
              <div className="flex flex-wrap items-center gap-1 text-xs font-medium">
                {origin && <span>{origin}</span>}
                {stops.filter((s) => s).map((s, i) => <span key={i} className="flex items-center gap-1"><span className="text-muted-foreground">→</span>{s}</span>)}
                {destination && <span className="flex items-center gap-1"><span className="text-muted-foreground">→</span>{destination}</span>}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground">Save Route</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
