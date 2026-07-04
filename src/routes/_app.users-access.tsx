import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { KPICard, Pill, SectionCard } from "@/components/shared/Cards";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { UserCog, Users, ShieldCheck, Activity, UserPlus } from "lucide-react";

export const Route = createFileRoute("/_app/users-access")({
  component: UsersAccess,
});

interface User { id: string; name: string; email: string; role: string; department: string; status: "Active" | "Invited" | "Suspended"; lastActive: string }
const users: User[] = [
  { id: "U-001", name: "Adeleke Oladipo", email: "adeleke@primelex.com", role: "CEO / Admin", department: "Executive", status: "Active", lastActive: "Just now" },
  { id: "U-002", name: "Bola Adeyemi", email: "bola@primelex.com", role: "Operations Manager", department: "Operations", status: "Active", lastActive: "5 min ago" },
  { id: "U-003", name: "Chinedu Okonkwo", email: "chinedu@primelex.com", role: "Fleet Supervisor", department: "Fleet", status: "Active", lastActive: "1 hr ago" },
  { id: "U-004", name: "Aisha Bello", email: "aisha@primelex.com", role: "Compliance Officer", department: "Compliance", status: "Active", lastActive: "2 hr ago" },
  { id: "U-005", name: "Kelechi Obi", email: "kelechi@primelex.com", role: "Dispatch Coordinator", department: "Dispatch", status: "Active", lastActive: "3 hr ago" },
  { id: "U-006", name: "Musa Ibrahim", email: "musa@primelex.com", role: "Maintenance Lead", department: "Maintenance", status: "Active", lastActive: "Yesterday" },
  { id: "U-007", name: "Ngozi Umeh", email: "ngozi@primelex.com", role: "Finance Analyst", department: "Finance", status: "Invited", lastActive: "—" },
  { id: "U-008", name: "Femi Johnson", email: "femi@primelex.com", role: "Driver Manager", department: "HR", status: "Suspended", lastActive: "10 days ago" },
];

const statusTone = { Active: "success", Invited: "warning", Suspended: "danger" } as const;

function UsersAccess() {
  const cols: Column<User>[] = [
    { key: "id", label: "User ID", render: (r) => <span className="font-semibold text-primary">{r.id}</span> },
    { key: "name", label: "Name", render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-purple" />
        <div><div className="text-sm font-medium">{r.name}</div><div className="text-[11px] text-muted-foreground">{r.email}</div></div>
      </div>
    )},
    { key: "role", label: "Role" },
    { key: "department", label: "Department", render: (r) => <Pill tone="info">{r.department}</Pill> },
    { key: "lastActive", label: "Last Active" },
    { key: "status", label: "Status", render: (r) => <Pill tone={statusTone[r.status]}>{r.status}</Pill> },
  ];
  return (
    <>
      <Header title="Users & Access" subtitle="Manage users, roles, permissions and audit trails" showExport={false} />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard label="Total Users" value="42" icon={Users} tone="info" delta={{ value: "3", direction: "up" }} />
          <KPICard label="Active" value="38" icon={ShieldCheck} tone="success" />
          <KPICard label="Roles Defined" value="12" icon={UserCog} tone="purple" />
          <KPICard label="Audit Events (24h)" value="1.2k" icon={Activity} tone="warning" />
        </div>
        <SectionCard title="User Directory" action={<Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30"><UserPlus className="mr-1.5 h-3.5 w-3.5"/>Invite User</Button>}>
          <DataTable columns={cols} rows={users} searchKeys={["name","email","role","department"]} pageSize={8} />
        </SectionCard>
      </div>
    </>
  );
}
