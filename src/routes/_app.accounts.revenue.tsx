import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { SectionCard } from "@/components/shared/Cards";

export const Route = createFileRoute("/_app/accounts/revenue")({ component: RevenuePage });

function RevenuePage() {
  return (
    <>
      <Header title="Revenue" subtitle="Revenue reporting and income analysis." />
      <div className="p-8">
        <SectionCard title="Revenue">
          <div className="rounded-xl border border-border/60 bg-background/30 px-6 py-12 text-center">
            <p className="text-sm font-medium text-foreground">Revenue reporting is not configured yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">Connect approved revenue records before reporting income.</p>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
