import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

import { AGENT_PIPELINE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AgentId, AgentState } from "@/services/types/research.types";

interface ExecutionTimelineProps {
  agents: Record<AgentId, AgentState>;
}

function formatDuration(state: AgentState): string | null {
  if (!state.startedAt || !state.completedAt) return null;
  const seconds = (state.completedAt - state.startedAt) / 1000;
  return `${seconds.toFixed(1)}s`;
}

export function ExecutionTimeline({ agents }: ExecutionTimelineProps) {
  return (
    <div className="glass-surface rounded-2xl p-6">
      <div className="flex items-center justify-between gap-2">
        {AGENT_PIPELINE.map((agent, index) => {
          const state = agents[agent.id];
          const isLast = index === AGENT_PIPELINE.length - 1;
          const duration = formatDuration(state);

          return (
            <div key={agent.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition-colors duration-300",
                    state.status === "idle" &&
                      "border-border text-muted-foreground",
                    state.status === "running" &&
                      "border-primary bg-primary/10 text-primary",
                    state.status === "done" &&
                      "border-success bg-success/10 text-success",
                    state.status === "failed" &&
                      "border-destructive bg-destructive/10 text-destructive"
                  )}
                >
                  {state.status === "done" ? (
                    <Check className="h-4 w-4" />
                  ) : state.status === "failed" ? (
                    <X className="h-4 w-4" />
                  ) : state.status === "running" ? (
                    <motion.span
                      className="h-2 w-2 rounded-full bg-primary"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-medium text-foreground">
                    {agent.label.replace(" Agent", "")}
                  </p>
                  {duration && (
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {duration}
                    </p>
                  )}
                </div>
              </div>

              {!isLast && (
                <div className="mx-2 mb-6 h-px flex-1 bg-border">
                  <motion.div
                    className="h-full bg-success"
                    initial={{ width: "0%" }}
                    animate={{
                      width: state.status === "done" ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
