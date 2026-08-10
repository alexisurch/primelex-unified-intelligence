import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { suppliers as seedSuppliers, type Supplier } from "./mock-data";

interface SuppliersState {
  suppliers: Supplier[];
  addSupplier: (data: Omit<Supplier, "id" | "createdAt">) => Supplier;
  getSupplier: (id: string) => Supplier | undefined;
  getSupplierByName: (name: string) => Supplier | undefined;
}

const Ctx = createContext<SuppliersState | null>(null);

function nextId(existing: Supplier[]): string {
  const max = existing.reduce((m, s) => {
    const n = parseInt(s.id.replace(/\D/g, ""), 10);
    return isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return `SUP-${String(max + 1).padStart(3, "0")}`;
}

export function SuppliersProvider({ children }: { children: ReactNode }) {
  const [extra, setExtra] = useState<Supplier[]>([]);

  const allSuppliers = useMemo<Supplier[]>(() => [...seedSuppliers, ...extra], [extra]);

  const addSupplier = useCallback((data: Omit<Supplier, "id" | "createdAt">): Supplier => {
    const supplier: Supplier = {
      ...data,
      id: nextId([...seedSuppliers, ...extra]),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setExtra((prev) => [...prev, supplier]);
    return supplier;
  }, [extra]);

  const getSupplier = useCallback((id: string) => allSuppliers.find((s) => s.id === id), [allSuppliers]);
  const getSupplierByName = useCallback((name: string) => allSuppliers.find((s) => s.name.toLowerCase() === name.toLowerCase()), [allSuppliers]);

  const value = useMemo(() => ({ suppliers: allSuppliers, addSupplier, getSupplier, getSupplierByName }), [allSuppliers, addSupplier, getSupplier, getSupplierByName]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSuppliers() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSuppliers must be used inside SuppliersProvider");
  return ctx;
}
