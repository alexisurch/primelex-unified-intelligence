import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export function DocumentUploadDialog({ open, onOpenChange, entityType }: { open: boolean; onOpenChange: (v: boolean) => void; entityType: string }) {
  const [title, setTitle] = useState("");
  const [expiry, setExpiry] = useState("");
  const [summary, setSummary] = useState("");
  const [fileName, setFileName] = useState("");

  const submit = () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    toast.success(`Document "${title}" uploaded`);
    setTitle(""); setExpiry(""); setSummary(""); setFileName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="col-span-2">
            <Label className="text-[11px] uppercase text-muted-foreground">Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" placeholder="Document title" />
          </div>
          <div>
            <Label className="text-[11px] uppercase text-muted-foreground">Expiry Date (Optional)</Label>
            <Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-[11px] uppercase text-muted-foreground">File</Label>
            <div className="mt-1">
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                className="block w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-primary/20 file:px-3 file:py-1.5 file:text-primary"
              />
              {fileName && <div className="mt-1 text-[11px] text-muted-foreground">Selected: {fileName}</div>}
            </div>
          </div>
          <div className="col-span-2">
            <Label className="text-[11px] uppercase text-muted-foreground">Summary (Optional)</Label>
            <Textarea rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} className="mt-1" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-primary text-primary-foreground">Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditProfileDialog({ open, onOpenChange, fields }: { open: boolean; onOpenChange: (v: boolean) => void; fields: Array<{ key: string; label: string; value: string }> }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const submit = () => {
    toast.success("Profile updated successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-2">
          {fields.map((f) => (
            <div key={f.key}>
              <Label className="text-[11px] uppercase text-muted-foreground">{f.label}</Label>
              <Input
                defaultValue={f.value}
                onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="mt-1"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-primary text-primary-foreground">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
