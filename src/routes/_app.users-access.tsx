import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill, SectionCard } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { UserCog, Users, ShieldCheck, Activity, UserPlus, Settings2 } from "lucide-react";
import { useState } from "react";
import { useFleetManagers } from "@/lib/fleet-managers-store";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { ManageFleetDialog } from "@/components/fleet/ManageFleetDialog";

export const Route = createFileRoute("/_app/users-access")({
  component: UsersAccess,
});

interface UserRow { id: string; name: string; email: string; role: string; department: string; status: "Active" | "Invited" | "Suspended"; lastActive: string; fleetManagerId?: string }

const staticUsers: UserRow[] = [
  { id: "U-001", name: "Adeleke Oladipo", email: "adeleke@primelex.com", role: "CEO / Admin", department: "Executive", status: "Active", lastActive: "Just now" },
  { id: "U-005", name: "Kelechi Obi", email: "kelechi@primelex.com", role: "Dispatch Coordinator", department: "Dispatch", status: "Active", lastActive: "3 hr ago" },
  { id: "U-007", name: "Ngozi Umeh", email: "ngozi@primelex.com", role: "Finance Analyst", department: "Finance", status: "Invited", lastActive: "—" },
  { id: "U-008", name: "Femi Johnson", email: "femi@primelex.com", role: "Driver Manager", department: "HR", status: "Suspended", lastActive: "10 days ago" },
];

const statusTone = { Active: "success", Invited: "warning", Suspended: "danger" } as const;

function UsersAccess() {
  const { managers } = useFleetManagers();
  const { open } = useProfileDrawer();
  const [manageId, setManageId] = useState<string | null>(null);

  const fmUsers: UserRow[] = managers.map((m, i) => ({
    id: `U-1${String(i + 10).padStart(2, "0")}`,
    name: m.name,
    email: m.email,
    role: "Fleet Manager",
    department: m.department,
    status: m.status === "Active" ? "Active" : m.status === "On Leave" ? "Invited" : "Suspended",
    lastActive: i === 0 ? "5 min ago" : i === 1 ? "1 hr ago" : "2 hr ago",
    fleetManagerId: m.id,
  }));

  const users = [...staticUsers, ...fmUsers];

  const cols: Column<UserRow>[] = [
    { key: "id", label: "User ID", render: (r) => <span className="font-semibold text-primary">{r.id}</span> },
    { key: "name", label: "Name", render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-purple" />
        <div>
          {r.fleetManagerId ? (
            <button onClick={() => open({ kind: "fleet-manager", id: r.fleetManagerId! })} className="text-sm font-medium text-primary hover:underline">{r.name}</button>
          ) : (
            <div className="text-sm font-medium">{r.name}</div>
          )}
          <div className="text-[11px] text-muted-foreground">{r.email}</div>
        </div>
      </div>
    )},
    { key: "role", label: "Role" },
    { key: "department", label: "Department", render: (r) => <Pill tone="info">{r.department}</Pill> },
    { key: "lastActive", label: "Last Active" },
    { key: "status", label: "Status", render: (r) => <Pill tone={statusTone[r.status]}>{r.status}</Pill> },
    { key: "actions" as never, label: "Actions", render: (r) => r.fleetManagerId ? (
      <Button size="sm" variant="outline" className="h-7 border-border" onClick={() => setManageId(r.fleetManagerId!)}>
        <Settings2 className="mr-1 h-3 w-3" /> Manage Fleet
      </Button>
    ) : null },
  ];

  return (
    <>
      <Header title="Users & Access" subtitle="Manage users, roles, permissions and audit trails" showExport={false} />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Total Users" value={String(users.length)} icon={Users} tone="info" delta={{ value: "3", direction: "up" }} />
          <KPICard label="Active" value={String(users.filter((u) => u.status === "Active").length)} icon={ShieldCheck} tone="success" />
          <KPICard label="Fleet Managers" value={String(managers.length)} icon={UserCog} tone="purple" />
          <KPICard label="Audit Events (24h)" value="1.2k" icon={Activity} tone="warning" />
        </div>
        <SectionCard title="User Directory" action={<Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30"><UserPlus className="mr-1.5 h-3.5 w-3.5"/>Invite User</Button>}>
          <DataTable columns={cols} rows={users} searchKeys={["name","email","role","department"]} pageSize={10} />
        </SectionCard>
      </div>
      <ManageFleetDialog managerId={manageId} open={!!manageId} onOpenChange={(o) => { if (!o) setManageId(null); }} />
    </>
  );
}
