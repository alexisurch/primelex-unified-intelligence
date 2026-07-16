import { useState } from "react";
import { Bell, Moon, Sun, Settings as SettingsIcon, LogOut, CircleUser as UserCircle, CheckCheck, TriangleAlert as AlertTriangle, Wrench, IdCard, ShieldAlert, Flame, Clock, ShieldCheck } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { alerts, priorities } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showDate?: boolean;
  showExport?: boolean;
  actions?: React.ReactNode;
}

interface NotificationItem {
  id: number;
  kind: "alert" | "priority";
  type: string;
  title: string;
  detail: string;
  time: string;
  icon: typeof Bell;
  route: string;
}

const ALERT_ICONS: Record<string, typeof Bell> = {
  AlertTriangle, Wrench, IdCard, ShieldAlert,
};
const PRIORITY_ICONS: Record<string, typeof Bell> = {
  Flame, Clock, Wrench, ShieldCheck,
};

const TONE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  danger:  { bg: "bg-red-500/10",    text: "text-red-600 dark:text-red-400",    dot: "bg-red-500" },
  warning: { bg: "bg-amber-500/10",  text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  info:    { bg: "bg-blue-500/10",   text: "text-blue-600 dark:text-blue-400",   dot: "bg-blue-500" },
  success: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  purple:  { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", dot: "bg-violet-500" },
};

const NOTIFICATIONS: NotificationItem[] = [
  ...alerts.map((a) => ({
    id: a.id,
    kind: "alert" as const,
    type: a.type,
    title: a.title,
    detail: a.detail,
    time: a.time,
    icon: ALERT_ICONS[a.icon] ?? Bell,
    route: "/action-center",
  })),
  ...priorities.map((p) => ({
    id: p.id + 100,
    kind: "priority" as const,
    type: p.color,
    title: p.title,
    detail: p.detail,
    time: p.time,
    icon: PRIORITY_ICONS[p.icon] ?? Bell,
    route: "/action-center",
  })),
];

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { resolvedTheme, toggleTheme } = usePreferences();
  const { adminName, logoDataUrl, primaryColor } = useBranding();
  const navigate = useNavigate();
  const isDark = resolvedTheme === "dark";

  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = NOTIFICATIONS.length - readIds.size;
  const handleLogout = () => navigate({ to: "/auth" });
  const markAllRead = () => setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));
  const markRead = (id: number) => setReadIds((prev) => new Set(prev).add(id));

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

          {/* Notifications */}
          <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger asChild>
              <button
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-elevated/60 hover:border-primary/40"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-[380px] p-0"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-bold text-destructive">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <ScrollArea className="max-h-[400px]">
                <div className="flex flex-col">
                  {NOTIFICATIONS.map((n) => {
                    const tone = TONE_STYLES[n.type] ?? TONE_STYLES.info;
                    const isUnread = !readIds.has(n.id);
                    const Icon = n.icon;
                    return (
                      <Link
                        key={n.id}
                        to={n.route}
                        onClick={() => markRead(n.id)}
                        className={cn(
                          "flex items-start gap-3 border-b border-border/40 px-4 py-3 transition-colors hover:bg-elevated/60",
                          isUnread && "bg-primary/[0.04]",
                        )}
                      >
                        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", tone.bg, tone.text)}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium text-foreground">{n.title}</span>
                            {isUnread && <span className={cn("h-2 w-2 shrink-0 rounded-full", tone.dot)} />}
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{n.detail}</p>
                          <span className="mt-1 text-[10px] text-muted-foreground/70">{n.time}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="border-t border-border/60 px-4 py-2.5">
                <Link
                  to="/action-center"
                  onClick={() => setNotifOpen(false)}
                  className="block text-center text-xs font-medium text-primary hover:underline"
                >
                  View all in Action Center
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          {/* Account menu */}
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
