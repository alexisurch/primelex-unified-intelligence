import { Bell, ChevronDown, Moon, Sun, Settings as SettingsIcon, LogOut, CircleUser as UserCircle, ArrowRight, TriangleAlert as AlertTriangle, Wrench, IdCard, ShieldAlert } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { alerts } from "@/lib/mock-data";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const alertIconMap: Record<string, typeof Bell> = {
  AlertTriangle,
  Wrench,
  IdCard,
  ShieldAlert,
};

const alertToneMap: Record<string, string> = {
  danger: "text-danger",
  warning: "text-warning",
  info: "text-info",
  purple: "text-purple",
};

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  /** @deprecated date filter removed */
  showDate?: boolean;
  /** @deprecated export dropdown removed */
  showExport?: boolean;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { resolvedTheme, toggleTheme } = usePreferences();
  const { adminName, logoDataUrl, primaryColor } = useBranding();
  const navigate = useNavigate();
  const isDark = resolvedTheme === "dark";
  const [activeAlert, setActiveAlert] = useState<(typeof alerts)[number] | null>(null);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      /* ignore — still return to the sign-in screen */
    }
    navigate({ to: "/login" });
  };

  return (
    <div className="flex flex-col gap-4 border-b border-border/60 bg-background/60 px-8 py-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-elevated/60 text-foreground hover:border-primary/40"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Popover>
            <PopoverTrigger asChild>
              <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-elevated/60 hover:border-primary/40">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">{alerts.length}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="border-b border-border/60 px-4 py-3">
                <div className="text-sm font-semibold text-foreground">Notifications</div>
                <div className="text-[11px] text-muted-foreground">Recent {alerts.length} alerts</div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {alerts.map((a) => {
                  const Icon = alertIconMap[a.icon] ?? Bell;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setActiveAlert(a)}
                      className="flex w-full items-start gap-3 border-b border-border/30 px-4 py-3 text-left transition-colors last:border-0 hover:bg-white/[0.03]"
                    >
                      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${alertToneMap[a.type] ?? "text-muted-foreground"}`} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-foreground">{a.title}</div>
                        <div className="truncate text-xs text-muted-foreground">{a.detail}</div>
                        <div className="mt-0.5 text-[10px] text-muted-foreground">{a.time}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => navigate({ to: "/action-center" })}
                className="flex w-full items-center justify-center gap-1.5 border-t border-border/60 px-4 py-3 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
              >
                Show more <ArrowRight className="h-3 w-3" />
              </button>
            </PopoverContent>
          </Popover>

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

      <Sheet open={!!activeAlert} onOpenChange={(o) => { if (!o) setActiveAlert(null); }}>
        <SheetContent side="right" className="w-full overflow-y-auto border-l border-border bg-background/95 p-0 backdrop-blur sm:max-w-md">
          {activeAlert && (
            <div className="space-y-5 px-6 py-8">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Notification</div>
                <h2 className="mt-1 text-xl font-semibold text-foreground">{activeAlert.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{activeAlert.detail}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{activeAlert.time}</span>
              </div>
              <button
                type="button"
                onClick={() => { setActiveAlert(null); navigate({ to: "/action-center" }); }}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                View in Action Center <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
