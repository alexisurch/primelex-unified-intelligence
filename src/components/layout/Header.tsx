import { Bell, Calendar, ChevronDown, Moon, Sun, Settings as SettingsIcon, LogOut, UserCircle } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
import { useBranding } from "@/lib/branding";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showDate?: boolean;
  showExport?: boolean;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, showDate = true, actions }: HeaderProps) {
  const { resolvedTheme, toggleTheme } = usePreferences();
  const { adminName, logoDataUrl, primaryColor } = useBranding();
  const navigate = useNavigate();
  const isDark = resolvedTheme === "dark";

  const handleLogout = () => {
    navigate({ to: "/auth" });
  };

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
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-elevated/60 text-foreground hover:border-primary/40"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-elevated/60 hover:border-primary/40">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">8</span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Account menu"
                className="flex items-center gap-3 rounded-lg border border-border bg-elevated/60 px-2 py-1.5 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {logoDataUrl ? (
                  <img src={logoDataUrl} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/30" />
                ) : (
                  <div
                    className="h-8 w-8 rounded-full ring-2 ring-primary/30"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6)` }}
                  />
                )}
                <div className="pr-1 text-right">
                  <div className="text-xs font-semibold leading-tight">{adminName}</div>
                  <div className="text-[10px] leading-tight text-muted-foreground">Chief Executive Officer</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span className="text-sm font-semibold">{adminName}</span>
                <span className="text-[11px] font-normal text-muted-foreground">Administrator</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/users-access" className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Account & Access
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/system-settings" className="cursor-pointer">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-danger focus:text-danger">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {actions && (
        <div className="flex items-center justify-end gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
