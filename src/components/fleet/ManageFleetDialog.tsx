import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo, useState } from "react";
import { trucks } from "@/lib/mock-data";
import { useFleetManagers } from "@/lib/fleet-managers-store";
import { ArrowRight, ArrowLeft, Truck as TruckIcon } from "lucide-react";
import { toast } from "sonner";

export function ManageFleetDialog({ managerId, open, onOpenChange }: { managerId: string | null; open: boolean; onOpenChange: (b: boolean) => void }) {
  const { managers, assignTrucks, getManager } = useFleetManagers();
  const manager = managerId ? getManager(managerId) : null;

  const [assigned, setAssigned] = useState<string[]>([]);
  const [availSel, setAvailSel] = useState<Set<string>>(new Set());
  const [assSel, setAssSel] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (manager) setAssigned(manager.assignedTruckIds);
    setAvailSel(new Set()); setAssSel(new Set());
  }, [manager, open]);

  // Available = trucks not assigned to any other manager, and not already in `assigned`
  const otherAssigned = useMemo(() => {
    const s = new Set<string>();
    managers.forEach((m) => { if (m.id !== managerId) m.assignedTruckIds.forEach((id) => s.add(id)); });
    return s;
  }, [managers, managerId]);

  const available = useMemo(
    () => trucks.filter((t) => !assigned.includes(t.id) && !otherAssigned.has(t.id)),
    [assigned, otherAssigned],
  );
  const assignedList = useMemo(() => trucks.filter((t) => assigned.includes(t.id)), [assigned]);

  if (!manager) return null;

  const moveRight = () => {
    setAssigned((cur) => Array.from(new Set([...cur, ...Array.from(availSel)])));
    setAvailSel(new Set());
  };
  const moveLeft = () => {
    setAssigned((cur) => cur.filter((id) => !assSel.has(id)));
    setAssSel(new Set());
  };

  const save = () => {
    assignTrucks(manager.id, assigned);
    toast.success(`Fleet updated for ${manager.name}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Fleet — {manager.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 py-2">
          <TruckList label={`Available Trucks (${available.length})`} rows={available} selected={availSel} onToggle={(id) => toggle(availSel, id, setAvailSel)} />
          <div className="flex flex-col justify-center gap-2">
            <Button size="icon" variant="outline" onClick={moveRight} disabled={!availSel.size}><ArrowRight className="h-4 w-4" /></Button>
            <Button size="icon" variant="outline" onClick={moveLeft} disabled={!assSel.size}><ArrowLeft className="h-4 w-4" /></Button>
          </div>
          <TruckList label={`Assigned Trucks (${assignedList.length})`} rows={assignedList} selected={assSel} onToggle={(id) => toggle(assSel, id, setAssSel)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save}>Save Assignment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function toggle(set: Set<string>, id: string, apply: (s: Set<string>) => void) {
  const next = new Set(set);
  if (next.has(id)) next.delete(id); else next.add(id);
  apply(next);
}

function TruckList({ label, rows, selected, onToggle }: { label: string; rows: typeof trucks; selected: Set<string>; onToggle: (id: string) => void }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/30">
      <div className="border-b border-border/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <ScrollArea className="h-72">
        <div className="p-2 space-y-1">
          {rows.length === 0 && <div className="p-6 text-center text-xs text-muted-foreground">No trucks.</div>}
          {rows.map((t) => (
            <label key={t.id} className={`flex items-center gap-3 rounded-lg border p-2 text-sm cursor-pointer ${selected.has(t.id) ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/40"}`}>
              <Checkbox checked={selected.has(t.id)} onCheckedChange={() => onToggle(t.id)} />
              <TruckIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold">{t.id} · {t.plate}</div>
                <div className="text-[10px] text-muted-foreground truncate">{t.model} · {t.driver}</div>
              </div>
            </label>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
