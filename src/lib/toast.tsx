import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ToastKind = "success" | "error" | "info";

interface ToastEntry {
  id: number;
  kind: ToastKind;
  message: string;
}

let listeners: Array<(toasts: ToastEntry[]) => void> = [];
let toasts: ToastEntry[] = [];
let counter = 0;

function emit() {
  for (const l of listeners) l(toasts);
}

export function showAppToast(message: string, kind: ToastKind = "info") {
  const id = ++counter;
  toasts = [...toasts, { id, kind, message }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 4000);
}

export function AppToaster() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const l = () => setTick((n) => n + 1);
    listeners.push(l);
    return () => {
      listeners = listeners.filter((x) => x !== l);
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            "pointer-events-auto flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur " +
            (t.kind === "success"
              ? "border-success/30 bg-success/10 text-success"
              : t.kind === "error"
                ? "border-error/30 bg-error/10 text-error"
                : "border-primary/30 bg-primary/10 text-primary")
          }
        >
          {t.message}
        </div>
      ))}
    </div>,
    document.body,
  );
}
