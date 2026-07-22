import { AgentNetworkGraph } from "@/components/graph/AgentNetworkGraph";
import { AgentActivityFeed } from "@/features/agents/AgentActivityFeed";
import { AgentStatusCard } from "@/features/agents/AgentStatusCard";
import { ExecutionTimeline } from "@/features/agents/ExecutionTimeline";
import { AGENT_PIPELINE } from "@/lib/constants";
import type { ResearchRun } from "@/services/types/research.types";

interface ResearchExecutionViewProps {
  run: ResearchRun;
}

export function ResearchExecutionView({ run }: ResearchExecutionViewProps) {
  const statuses = Object.fromEntries(
    AGENT_PIPELINE.map((a) => [a.id, run.agents[a.id].status])
  ) as Record<(typeof AGENT_PIPELINE)[number]["id"], (typeof run.agents)[keyof typeof run.agents]["status"]>;

  return (
    <div className="flex flex-col gap-8">
      <div className="glass-surface rounded-2xl p-6 sm:p-10">
        <div className="mx-auto max-w-lg">
          <AgentNetworkGraph statuses={statuses} ambient />
        </div>
      </div>

      <ExecutionTimeline agents={run.agents} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AGENT_PIPELINE.map((agent) => (
          <AgentStatusCard
            key={agent.id}
            label={agent.label}
            description={agent.description}
            status={run.agents[agent.id].status}
          />
        ))}
      </div>

      <AgentActivityFeed agents={run.agents} />
    </div>
  );
}
