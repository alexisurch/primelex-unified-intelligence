import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Download,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  FileJson,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface HeaderProps {
  /** Primary page title shown on the left. */
  title: string;
  /** Secondary description shown beneath the title. */
  subtitle: string;
  /** Whether to render the Export button (top-right). Defaults to true. */
  showExport?: boolean;
}

/** Dropdown option for the export menu. */
interface ExportOption {
  label: string;
  icon: React.ComponentType<LucideProps>;
  /** Called when the option is clicked. */
  onSelect: () => void;
}

/* ------------------------------------------------------------------ */
/* Export dropdown                                                     */
/* ------------------------------------------------------------------ */

/**
 * Self-contained export dropdown rendered as a popover anchored to its
 * trigger button. Closes on outside-click or Escape.
 */
function ExportDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const options: ExportOption[] = [
    {
      label: "Export as CSV",
      icon: FileSpreadsheet,
      onSelect: () => {
        setOpen(false);
      },
    },
    {
      label: "Export as PDF",
      icon: FileText,
      onSelect: () => {
        setOpen(false);
      },
    },
    {
      label: "Export as JSON",
      icon: FileJson,
      onSelect: () => {
        setOpen(false);
      },
    },
  ];

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="gap-1.5"
      >
        <Download className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-150",
            open && "rotate-180",
          )}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg"
        >
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.label}
                type="button"
                role="menuitem"
                onClick={option.onSelect}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground transition-colors",
                  "hover:bg-white/[0.04] focus:bg-white/[0.04] focus:outline-none",
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} aria-hidden="true" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

/**
 * Sticky top header bar.
 *
 * - Renders the page title/subtitle on the left.
 * - A centered search bar (hidden on mobile).
 * - A notification bell, export dropdown, and user avatar on the right.
 * - Uses `bg-background/80` with `backdrop-blur` for a translucent effect
 *   over scrolling content.
 */
export function Header({ title, subtitle, showExport = true }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur",
        "sm:px-6",
      )}
    >
      {/* ---------------------------------------------------------- */}
      {/* Title block (left)                                          */}
      {/* ---------------------------------------------------------- */}
      <div className="flex min-w-0 flex-col gap-0.5">
        <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
          {title}
        </h1>
        <p className="truncate text-xs text-muted-foreground sm:text-sm">
          {subtitle}
        </p>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Search bar (center, hidden on mobile)                       */}
      {/* ---------------------------------------------------------- */}
      <div className="hidden flex-1 justify-center px-4 md:flex">
        <div className="relative w-full max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={2}
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search fleet, drivers, trips…"
            className="h-9 pl-9 pr-3"
            aria-label="Search"
          />
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Actions (right)                                             */}
      {/* ---------------------------------------------------------- */}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className={cn(
            "relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors",
            "hover:bg-white/[0.04] hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
          {/* Unread indicator dot */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" aria-hidden="true" />
        </button>

        {/* Export */}
        {showExport && <ExportDropdown />}

        {/* User avatar */}
        <button
          type="button"
          aria-label="User menu"
          className={cn(
            "flex items-center gap-2 rounded-full p-0.5 transition-colors",
            "hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
        >
          <Avatar className="h-9 w-9 border border-border/60">
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
              AM
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}

export default Header;
