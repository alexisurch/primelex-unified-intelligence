import {
  type ComponentType,
} from "react";
import {
  Fuel,
  Wrench,
  AlertTriangle,
  Star,
  ShieldAlert,
  Lightbulb,
  type LucideProps,
} from "lucide-react";
import { GlassCard } from "@/components/shared/Cards";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type RecommendationTone =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "purple";

export type RecommendationIcon =
  | "fuel"
  | "maintenance"
  | "incident"
  | "performance"
  | "compliance"
  | "general";

export interface Recommendation {
  title: string;
  detail: string;
  tone?: RecommendationTone;
  icon?: RecommendationIcon;
}

export interface RecommendationsSectionProps {
  title: string;
  recommendations: Recommendation[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Tone + icon maps                                                     */
/* ------------------------------------------------------------------ */

type Tone = RecommendationTone;

const toneBg15: Record<Tone, string> = {
  info: "bg-info/15",
  success: "bg-success/15",
  warning: "bg-warning/15",
  danger: "bg-danger/15",
  purple: "bg-purple/15",
};

const toneText: Record<Tone, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  purple: "text-purple",
};

const iconMap: Record<RecommendationIcon, ComponentType<LucideProps>> = {
  fuel: Fuel,
  maintenance: Wrench,
  incident: AlertTriangle,
  performance: Star,
  compliance: ShieldAlert,
  general: Lightbulb,
};

/* ------------------------------------------------------------------ */
/* Single recommendation card                                          */
/* ------------------------------------------------------------------ */

interface RecommendationItemProps {
  recommendation: Recommendation;
}

function RecommendationItem({
  recommendation,
}: RecommendationItemProps) {
  const tone: Tone = recommendation.tone ?? "info";
  const Icon = recommendation.icon
    ? iconMap[recommendation.icon]
    : Lightbulb;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4",
        "border-border/60 bg-white/[0.02]",
        "transition-colors hover:bg-white/[0.04]",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            toneBg15[tone],
            toneText[tone],
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold leading-snug text-foreground">
            {recommendation.title}
          </h4>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {recommendation.detail}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

export function RecommendationsSection({
  title,
  recommendations,
  className,
}: RecommendationsSectionProps) {
  return (
    <GlassCard hover={false} className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-foreground">
          {title}
        </h3>
        <span className="text-xs text-muted-foreground">
          {recommendations.length}{" "}
          {recommendations.length === 1
            ? "recommendation"
            : "recommendations"}
        </span>
      </div>

      {recommendations.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No recommendations available.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {recommendations.map((rec, idx) => (
            <RecommendationItem key={`${rec.title}-${idx}`} recommendation={rec} />
          ))}
        </div>
      )}
    </GlassCard>
  );
}

export default RecommendationsSection;
