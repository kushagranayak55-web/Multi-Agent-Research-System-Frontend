import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CriticPanel } from "@/features/report/CriticPanel";
import { ReportSection } from "@/features/report/ReportSection";
import { ResearchExecutionView } from "@/features/research/ResearchExecutionView";
import { TopicInput } from "@/features/research/TopicInput";
import { WorkspaceEmptyState } from "@/features/research/WorkspaceEmptyState";
import { useResearchStore } from "@/store/researchStore";

export function WorkspacePage() {
  const { run, isSlowConnection, startResearch, cancelResearch, reset } =
    useResearchStore();
  const isRunning = run.status === "running";
  const hasStarted = run.status !== "idle";

  return (
    <div className="container flex flex-col gap-10 py-14 sm:py-20">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Research Workspace
        </span>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {hasStarted ? run.topic : "Start a new research run"}
          </h1>
          {hasStarted && (
            <div className="flex items-center gap-2">
              {isRunning && (
                <Button variant="ghost" size="sm" onClick={cancelResearch}>
                  <XCircle className="h-3.5 w-3.5" />
                  Cancel
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={reset}
                disabled={isRunning}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                New topic
              </Button>
            </div>
          )}
        </div>
      </div>

      {!hasStarted && (
        <TopicInput onSubmit={startResearch} isRunning={isRunning} />
      )}

      {isRunning && isSlowConnection && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
          This is taking longer than usual — the backend may be waking up
          from an idle state. Research will continue automatically.
        </div>
      )}

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WorkspaceEmptyState />
          </motion.div>
        ) : (
          <motion.div
            key="execution"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-10"
          >
            <ResearchExecutionView run={run} />

            {run.status === "failed" && (
              <div className="flex flex-col items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive">
                {run.error}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startResearch(run.topic)}
                >
                  Retry
                </Button>
              </div>
            )}

            {run.status === "completed" && run.result && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-8"
              >
                <ReportSection topic={run.topic} result={run.result} />
                <CriticPanel critic={run.result.critic} />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
