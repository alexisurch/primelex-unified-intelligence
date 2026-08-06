import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getOrganisationContext, listMyOrganisations } from "./organisations.functions";

/** Live Supabase session for the current browser tab. */
export function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null as User | null, loading };
}

/** Organisations the signed-in user belongs to. */
export function useMyOrganisations(enabled = true) {
  const fetchOrgs = useServerFn(listMyOrganisations);
  return useQuery({
    queryKey: ["my-organisations"],
    queryFn: () => fetchOrgs({}),
    enabled,
  });
}

/** Tenant context (organisation, branding, settings, roles, permissions). */
export function useOrganisationContext(organizationId: string | null | undefined) {
  const fetchContext = useServerFn(getOrganisationContext);
  return useQuery({
    queryKey: ["organisation-context", organizationId],
    queryFn: () => fetchContext({ data: { organizationId: organizationId! } }),
    enabled: Boolean(organizationId),
  });
}

/** Permission helper mirroring the database `has_permission` function. */
export function makePermissionChecker(permissions: string[] | undefined) {
  const set = new Set(permissions ?? []);
  return {
    can: (key: string) => set.has(key),
    canAny: (keys: string[]) => keys.some((key) => set.has(key)),
    canAll: (keys: string[]) => keys.every((key) => set.has(key)),
  };
}

export async function signOutEverywhere() {
  await supabase.auth.signOut();
}
