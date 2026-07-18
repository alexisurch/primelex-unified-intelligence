import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_TENANT_SLUG } from "@/lib/tenants";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: `/organisation/${DEFAULT_TENANT_SLUG}/login` });
  },
  component: () => null,
});
