import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill, SectionCard } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { documents as rawDocuments, trucks, drivers, exportCSV, type DocumentRow } from "@/lib/mock-data";
import { FileText, ShieldCheck, TriangleAlert as AlertTriangle, Upload, Download, Search, ListFilter as Filter, History, Eye, Trash2, FileImage, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/documents")({
  component: Documents,
});

const stTone = { Valid: "success", Expiring: "warning", Expired: "danger" } as const;
const ALL_STATUSES = ["Valid", "Expiring", "Expired"] as const;
const ALL_TYPES = ["Registration", "Insurance", "Licence", "Permit", "Contract", "Invoice", "Certificate", "Report"];

function fileTypeIcon(type: string) {
  if (["Registration", "Insurance", "Permit", "Contract", "Invoice", "Certificate", "Report"].includes(type)) return FileText;
  if (["DOC", "DOCX"].includes(type)) return FileText;
  if (["XLS", "XLSX"].includes(type)) return FileSpreadsheet;
  if (["JPG", "PNG", "GIF", "WEBP"].includes(type)) return FileImage;
  return FileText;
}

function Documents() {
  const [docs, setDocs] = useState<DocumentRow[]>(rawDocuments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [drawerDoc, setDrawerDoc] = useState<DocumentRow | null>(null);

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (typeFilter !== "all" && d.type !== typeFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return d.id.toLowerCase().includes(s) || d.name.toLowerCase().includes(s) || d.owner.toLowerCase().includes(s);
    });
  }, [docs, search, statusFilter, typeFilter]);

  function handleExport() {
    exportCSV(
      "documents.csv",
      ["Doc ID", "Name", "Type", "Owner", "Expiry", "Version", "Status"],
      filtered.map((d) => [d.id, d.name, d.type, d.owner, d.expiry ?? "", d.version, d.status]),
    );
    toast.success("Exported documents to CSV");
  }

  function handleUpload(newDoc: DocumentRow) {
    setDocs((prev) => [newDoc, ...prev]);
    setUploadOpen(false);
    toast.success(`Document "${newDoc.name}" uploaded`);
  }

  function handleDelete(id: string) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    toast.success("Document deleted");
  }

  function handleDownload(doc: DocumentRow) {
    toast.success(`Downloading "${doc.name}"…`);
  }

  const cols: Column<DocumentRow>[] = [
    { key: "id", label: "Doc ID", render: (r) => (
      <button onClick={() => setDrawerDoc(r)} className="font-semibold text-primary hover:underline">{r.id}</button>
    )},
    { key: "name", label: "Document", render: (r) => {
      const Icon = fileTypeIcon(r.type);
      return (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-elevated/60"><Icon className="h-4 w-4 text-muted-foreground" /></div>
          <span className="text-sm font-medium">{r.name}</span>
        </div>
      );
    }},
    { key: "type", label: "Type", render: (r) => <Pill tone="info">{r.type}</Pill> },
    { key: "owner", label: "Owner" },
    { key: "expiry", label: "Expiry", render: (r) => r.expiry ?? "—" },
    { key: "version", label: "Version" },
    { key: "status", label: "Status", render: (r) => <Pill tone={stTone[r.status]}>{r.status}</Pill> },
    { key: "id", label: "Actions", render: (r) => (
      <div className="flex gap-1">
        <button onClick={() => setDrawerDoc(r)} className="rounded p-1 hover:bg-white/5" title="View"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
        <button onClick={() => handleDownload(r)} className="rounded p-1 hover:bg-white/5" title="Download"><Download className="h-3.5 w-3.5 text-muted-foreground" /></button>
        <button onClick={() => handleDelete(r.id)} className="rounded p-1 hover:bg-white/5" title="Delete"><Trash2 className="h-3.5 w-3.5 text-muted-foreground" /></button>
      </div>
    )},
  ];

  return (
    <>
      <Header title="Documents" subtitle="Central document vault with expiry tracking and approval workflows" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Total Documents" value={String(docs.length)} icon={FileText} tone="info" />
          <KPICard label="Valid" value={String(docs.filter(d => d.status === "Valid").length)} icon={ShieldCheck} tone="success" footnote="90.2% of total" />
          <KPICard label="Expiring Soon" value={String(docs.filter(d => d.status === "Expiring").length)} icon={AlertTriangle} tone="warning" footnote="Next 30 days" />
          <KPICard label="Expired" value={String(docs.filter(d => d.status === "Expired").length)} icon={AlertTriangle} tone="danger" footnote="Action required" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search documents…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-elevated/60" />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 w-36 text-xs bg-elevated/60"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {ALL_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-36 text-xs bg-elevated/60"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-border bg-elevated/60" onClick={handleExport}>
              <Download className="mr-1.5 h-3.5 w-3.5" />Export CSV
            </Button>
            <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} onUpload={handleUpload} />
          </div>
        </div>

        <DataTable title="Document Vault" columns={cols} rows={filtered} searchKeys={[]} pageSize={10} />
      </div>

      <DocumentDrawer doc={drawerDoc} onClose={() => setDrawerDoc(null)} />
    </>
  );
}

function UploadDialog({ open, onOpenChange, onUpload }: { open: boolean; onOpenChange: (v: boolean) => void; onUpload: (doc: DocumentRow) => void }) {
  const [title, setTitle] = useState("");
  const [driver, setDriver] = useState("");
  const [truck, setTruck] = useState("");
  const [expiry, setExpiry] = useState("");
  const [summary, setSummary] = useState("");
  const [fileName, setFileName] = useState("");

  const driverOptions = drivers.map((d) => ({ value: d.id, label: d.name }));
  const truckOptions = trucks.map((t) => ({ value: t.id, label: `${t.id} · ${t.plate}` }));

  const submit = () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    const newDoc: DocumentRow = {
      id: `DOC-${500 + Math.floor(Math.random() * 1000)}`,
      name: title,
      type: fileName ? (fileName.split(".").pop()?.toUpperCase() ?? "Document") : "Document",
      owner: driver || truck || "Operations",
      expiry: expiry || undefined,
      status: expiry ? (new Date(expiry) < new Date(Date.now() + 30 * 86400000) ? "Expiring" : "Valid") : "Valid",
      version: "v1.0",
    };
    onUpload(newDoc);
    setTitle(""); setDriver(""); setTruck(""); setExpiry(""); setSummary(""); setFileName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Upload className="mr-1.5 h-3.5 w-3.5" />Upload</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="col-span-2"><Label className="text-[11px] uppercase text-muted-foreground">Title *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" placeholder="Document title" /></div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Driver (Optional)</Label>
            <Select value={driver} onValueChange={setDriver}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select driver" /></SelectTrigger>
              <SelectContent>{driverOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Truck (Optional)</Label>
            <Select value={truck} onValueChange={setTruck}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select truck" /></SelectTrigger>
              <SelectContent>{truckOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">Expiry Date (Optional)</Label><Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="mt-1" /></div>
          <div><Label className="text-[11px] uppercase text-muted-foreground">File</Label>
            <div className="mt-1">
              <input type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} className="block w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-primary/20 file:px-3 file:py-1.5 file:text-primary" />
              {fileName && <div className="mt-1 text-[11px] text-muted-foreground">Selected: {fileName}</div>}
            </div>
          </div>
          <div className="col-span-2"><Label className="text-[11px] uppercase text-muted-foreground">Summary (Optional)</Label><Textarea rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} className="mt-1" /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={submit} className="bg-primary text-primary-foreground">Upload</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DocumentDrawer({ doc, onClose }: { doc: DocumentRow | null; onClose: () => void }) {
  return (
    <Sheet open={!!doc} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
        {doc && (
          <>
            <SheetHeader><SheetTitle>{doc.name}</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="flex h-48 items-center justify-center rounded-xl border border-border/60 bg-elevated/40">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  {(() => { const Icon = fileTypeIcon(doc.type); return <Icon className="h-12 w-12" />; })()}
                  <span className="text-xs">{doc.type} Preview</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <DetailRow label="Title" value={doc.name} />
                <DetailRow label="Document ID" value={doc.id} />
                <DetailRow label="Type" value={doc.type} />
                <DetailRow label="Version" value={doc.version} />
                <DetailRow label="Owner" value={doc.owner} />
                <DetailRow label="Status" value={<Pill tone={stTone[doc.status]}>{doc.status}</Pill>} />
                <DetailRow label="Expiry Date" value={doc.expiry ?? "—"} />
                <DetailRow label="File Type" value={doc.type} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="border-border" onClick={() => toast.success(`Downloading "${doc.name}"…`)}><Download className="mr-1.5 h-3.5 w-3.5" />Download</Button>
                <Button variant="outline" size="sm" className="border-border"><History className="mr-1.5 h-3.5 w-3.5" />History</Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}
