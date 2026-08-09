import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard } from "@/components/shared/Cards";

export const Route = createFileRoute("/_app/accounts/revenue")({ component: Revenue });

function Revenue() {
  return <><Header title="Revenue" subtitle="Revenue tracking and performance analysis." /><div className="p-8"><GlassCard className="flex min-h-[320px] items-center justify-center text-center"><div><h2 className="text-lg font-semibold">Revenue reporting is coming soon</h2><p className="mt-2 text-sm text-muted-foreground">Detailed revenue analysis will be available here.</p></div></GlassCard></div></>;
}
