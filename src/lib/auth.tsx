/**
 * Frontend-only mock authentication for workspace login flows.
 * No real credential validation — any non-empty email/password signs in.
 * Session persists in localStorage; swap with Supabase Auth when ready.
 */

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export interface Session {
  orgSlug: string;
  email: string;
  name: string;
  signedInAt: string;
}

interface AuthCtx {
  session: Session | null;
  signIn: (orgSlug: string, email: string, name?: string) => void;
  signOut: () => void;
  getSessionForOrg: (orgSlug: string) => Session | null;
}

const AuthContext = createContext<AuthCtx | null>(null);
const STORAGE_KEY = "primelex.session";

function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Session;
  } catch { /* noop */ }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => loadSession());

  const signIn = useCallback((orgSlug: string, email: string, name?: string) => {
    const s: Session = {
      orgSlug,
      email,
      name: name ?? email.split("@")[0]?.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? "User",
      signedInAt: new Date().toISOString(),
    };
    setSession(s);
    if (typeof window !== "undefined") {
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* noop */ }
    }
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    if (typeof window !== "undefined") {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    }
  }, []);

  const getSessionForOrg = useCallback((orgSlug: string): Session | null => {
    if (session && session.orgSlug === orgSlug) return session;
    return null;
  }, [session]);

  const value = useMemo<AuthCtx>(() => ({ session, signIn, signOut, getSessionForOrg }), [session, signIn, signOut, getSessionForOrg]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
