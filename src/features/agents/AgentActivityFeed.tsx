import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { AGENT_PIPELINE } from "@/lib/constants";
import type { AgentId, AgentState, AgentStatus } from "@/services/types/research.types";

interface AgentActivityFeedProps {
  agents: Record<AgentId, AgentState>;
}

interface LogEntry {
  id: string;
  text: string;
  time: string;
}

const AGENT_LABEL: Record<AgentId, string> = Object.fromEntries(
  AGENT_PIPELINE.map((a) => [a.id, a.label])
) as Record<AgentId, string>;

function messageFor(id: AgentId, status: AgentStatus): string | null {
  switch (status) {
    case "running":
      return `${AGENT_LABEL[id]} started.`;
    case "done":
      return `${AGENT_LABEL[id]} finished.`;
    case "failed":
      return `${AGENT_LABEL[id]} failed.`;
    default:
      return null;
  }
}

export function AgentActivityFeed({ agents }: AgentActivityFeedProps) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const previous = useRef<Record<AgentId, AgentStatus> | null>(null);

  useEffect(() => {
    const current = Object.fromEntries(
      AGENT_PIPELINE.map((a) => [a.id, agents[a.id].status])
    ) as Record<AgentId, AgentStatus>;

    if (previous.current) {
      const newEntries: LogEntry[] = [];
      for (const agent of AGENT_PIPELINE) {
        const prevStatus = previous.current[agent.id];
        const nextStatus = current[agent.id];
        if (prevStatus !== nextStatus) {
          const text = messageFor(agent.id, nextStatus);
          if (text) {
            newEntries.push({
              id: `${agent.id}-${nextStatus}-${Date.now()}`,
              text,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
            });
          }
        }
      }
      if (newEntries.length) {
        setEntries((prev) => [...newEntries, ...prev].slice(0, 12));
      }
    }

    previous.current = current;
  }, [agents]);

  if (entries.length === 0) return null;

  return (
    <div className="glass-surface rounded-2xl p-5">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        Activity
      </p>
      <ul className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-baseline gap-3 border-b border-border/60 pb-2 text-sm last:border-0 last:pb-0"
            >
              <span className="font-mono text-[10px] text-muted-foreground">
                {entry.time}
              </span>
              <span className="text-foreground/90">{entry.text}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
