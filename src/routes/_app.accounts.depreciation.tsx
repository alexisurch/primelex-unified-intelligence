import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { SectionCard } from "@/components/shared/Cards";

export const Route = createFileRoute("/_app/accounts/depreciation")({ component: DepreciationPage });

function DepreciationPage() {
  return (
    <>
      <Header title="Depreciation" subtitle="Fleet asset depreciation and allocation." />
      <div className="p-8">
        <SectionCard title="Depreciation">
          <div className="rounded-xl border border-border/60 bg-background/30 px-6 py-12 text-center">
            <p className="text-sm font-medium text-foreground">Depreciation schedules are not configured yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">No depreciation values are included until an approved schedule is available.</p>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
