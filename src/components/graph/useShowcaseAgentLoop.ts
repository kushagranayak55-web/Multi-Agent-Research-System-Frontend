import { useEffect, useState } from "react";

import { AGENT_ORDER } from "@/components/graph/graph-layout";
import type { AgentId, AgentStatus } from "@/services/types/research.types";
import type { AgentStatusMap } from "@/components/graph/AgentNetworkGraph";

const STEP_MS = 1500;
const PAUSE_AFTER_COMPLETE_MS = 1800;

function statusesForStep(step: number): AgentStatusMap {
  return AGENT_ORDER.reduce((acc, id, index) => {
    let status: AgentStatus = "idle";
    if (index < step) status = "done";
    if (index === step) status = "running";
    acc[id] = status;
    return acc;
  }, {} as Record<AgentId, AgentStatus>);
}

/**
 * Drives a continuous demo loop through the four agents for contexts
 * where there's no real research run yet (the landing page). Not
 * used by the workspace — that graph is driven directly by
 * researchStore's real agent state.
 */
export function useShowcaseAgentLoop(): AgentStatusMap {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let cancelled = false;

    function tick(current: number) {
      const delay = current > AGENT_ORDER.length ? PAUSE_AFTER_COMPLETE_MS : STEP_MS;

      const timer = setTimeout(() => {
        if (cancelled) return;
        setStep((prev) => (prev >= AGENT_ORDER.length ? 0 : prev + 1));
      }, delay);

      return timer;
    }

    const timer = tick(step);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [step]);

  return statusesForStep(step);
}
