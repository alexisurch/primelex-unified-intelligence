import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard } from "@/components/shared/Cards";

export const Route = createFileRoute("/_app/accounts/depreciation")({ component: Depreciation });

function Depreciation() {
  return <><Header title="Depreciation" subtitle="Asset depreciation and fleet cost allocation." /><div className="p-8"><GlassCard className="flex min-h-[320px] items-center justify-center text-center"><div><h2 className="text-lg font-semibold">Depreciation reporting is coming soon</h2><p className="mt-2 text-sm text-muted-foreground">Asset depreciation analysis will be available here.</p></div></GlassCard></div></>;
}
