import { motion } from "framer-motion";

import { AgentNetworkGraph } from "@/components/graph/AgentNetworkGraph";
import { AGENT_ORDER } from "@/components/graph/graph-layout";
import type { AgentStatusMap } from "@/components/graph/AgentNetworkGraph";

const IDLE_STATUSES: AgentStatusMap = AGENT_ORDER.reduce((acc, id) => {
  acc[id] = "idle";
  return acc;
}, {} as AgentStatusMap);

export function WorkspaceEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-surface rounded-2xl p-8 sm:p-12"
    >
      <div className="mx-auto max-w-sm">
        <AgentNetworkGraph statuses={IDLE_STATUSES} ambient />
      </div>
      <p className="mx-auto mt-4 max-w-sm text-center text-sm text-muted-foreground">
        The pipeline is idle. Enter a topic above and the Search Agent
        starts immediately.
      </p>
    </motion.div>
  );
}
