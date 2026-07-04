import { Bell, Calendar, ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showDate?: boolean;
  showExport?: boolean;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, showDate = true, showExport = true, actions }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/60 bg-background/60 px-8 py-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {showDate && (
            <button className="flex items-center gap-2 rounded-lg border border-border bg-elevated/60 px-3 py-2 text-xs text-foreground hover:border-primary/40">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">May 14, 2026</span>
              <span className="text-muted-foreground">vs May 7, 2026</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-elevated/60 hover:border-primary/40">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">8</span>
          </button>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-elevated/60 px-2 py-1.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple ring-2 ring-primary/30" />
            <div className="pr-2 text-right">
              <div className="text-xs font-semibold leading-tight">Adeleke Oladipo</div>
              <div className="text-[10px] leading-tight text-muted-foreground">Chief Executive Officer</div>
            </div>
          </div>
        </div>
      </div>

      {(showExport || actions) && (
        <div className="flex items-center justify-end gap-2">
          {actions}
          {showExport && (
            <Button size="sm" variant="outline" className="border-border bg-elevated/60 hover:border-primary/40">
              <Download className="mr-2 h-3.5 w-3.5" /> Export Report
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
