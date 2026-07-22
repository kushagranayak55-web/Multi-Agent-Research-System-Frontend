import { CheckCircle2, MinusCircle, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ScoreGauge } from "@/features/report/ScoreGauge";
import type { CriticEvaluation } from "@/services/types/research.types";

interface CriticPanelProps {
  critic: CriticEvaluation;
}

export function CriticPanel({ critic }: CriticPanelProps) {
  const hasAnyStructure =
    critic.score !== null ||
    critic.strengths.length > 0 ||
    critic.areasToImprove.length > 0 ||
    critic.verdict !== null;

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-border pb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-raised text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              Critic Agent evaluation
            </p>
            <h2 className="font-display text-lg font-semibold">
              Independent review of the report
            </h2>
          </div>
        </div>

        {!hasAnyStructure ? (
          <p className="text-sm text-muted-foreground">
            The Critic Agent did not return an evaluation for this run.
          </p>
        ) : (
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            {critic.score !== null && (
              <div className="flex shrink-0 flex-col items-center gap-2 sm:mx-auto sm:w-32">
                <ScoreGauge score={critic.score} />
                <span className="text-xs text-muted-foreground">
                  Quality score
                </span>
              </div>
            )}

            <div className="flex flex-1 flex-col gap-6">
              {critic.strengths.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-success">
                    Strengths
                  </p>
                  <ul className="flex flex-col gap-2">
                    {critic.strengths.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {critic.areasToImprove.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-warning">
                    Areas to improve
                  </p>
                  <ul className="flex flex-col gap-2">
                    {critic.areasToImprove.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                        <MinusCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {critic.verdict && (
                <div className="rounded-lg border border-border bg-surface-raised p-4">
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Verdict
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-foreground/90">
                    {critic.verdict}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
