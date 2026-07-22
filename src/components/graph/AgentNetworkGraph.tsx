import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { AgentId, AgentStatus } from "@/services/types/research.types";
import { GRAPH_EDGES, GRAPH_NODES } from "@/components/graph/graph-layout";

export type AgentStatusMap = Record<AgentId, AgentStatus>;

interface AgentNetworkGraphProps {
  statuses: AgentStatusMap;
  className?: string;
  /** Renders a soft ambient glow behind the graph. Off by default so callers control their own background. */
  ambient?: boolean;
}

const STATUS_VAR: Record<AgentStatus, string> = {
  idle: "var(--agent-idle)",
  running: "var(--agent-running)",
  done: "var(--agent-done)",
  failed: "var(--agent-failed)",
};

function edgeState(
  statuses: AgentStatusMap,
  from: AgentId,
  to: AgentId
): "flowing" | "complete" | "idle" {
  const a = statuses[from];
  const b = statuses[to];
  if (a === "done" && b === "done") return "complete";
  if ((a === "done" || a === "running") && b === "running") return "flowing";
  return "idle";
}

export function AgentNetworkGraph({
  statuses,
  className,
  ambient = false,
}: AgentNetworkGraphProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {ambient && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--primary) / 0.18), transparent 70%)",
          }}
        />
      )}

      <svg
        viewBox="0 0 480 320"
        className="h-full w-full"
        role="img"
        aria-label="Agent network graph showing Search, Reader, Writer, and Critic agents and their execution status"
      >
        <defs>
          <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges drawn first so nodes render on top */}
        {GRAPH_EDGES.map((edge) => {
          const from = GRAPH_NODES.find((n) => n.id === edge.from)!;
          const to = GRAPH_NODES.find((n) => n.id === edge.to)!;
          const state = edgeState(statuses, edge.from, edge.to);

          const stroke =
            state === "flowing"
              ? "hsl(var(--primary))"
              : state === "complete"
                ? "hsl(var(--agent-done) / 0.6)"
                : "hsl(var(--border))";

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={stroke}
                strokeWidth={state === "flowing" ? 2 : 1.5}
                strokeOpacity={state === "idle" ? 0.4 : 0.9}
              />
              {state === "flowing" && (
                <motion.line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  strokeDasharray="4 10"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -28 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {GRAPH_NODES.map((node) => {
          const status = statuses[node.id];
          const color = STATUS_VAR[status];
          const isRunning = status === "running";
          const labelBelow = node.id === "search";
          const labelAbove = node.id === "critic";

          return (
            <g key={node.id}>
              {isRunning && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.9 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              <motion.circle
                cx={node.x}
                cy={node.y}
                r={12}
                fill={color}
                filter={status === "idle" ? undefined : "url(#node-glow)"}
                animate={
                  isRunning
                    ? { opacity: [1, 0.6, 1] }
                    : { opacity: 1 }
                }
                transition={
                  isRunning
                    ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.4 }
                }
              />

              <text
                x={node.x}
                y={labelBelow ? node.y + 30 : labelAbove ? node.y - 24 : node.y}
                dy={labelBelow || labelAbove ? 0 : 5}
                textAnchor="middle"
                className="select-none font-display text-[13px] font-medium fill-foreground"
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={
                  (labelBelow ? node.y + 30 : labelAbove ? node.y - 24 : node.y) +
                  16
                }
                textAnchor="middle"
                className="select-none font-mono text-[9px] uppercase tracking-wider fill-muted-foreground"
              >
                {status === "idle"
                  ? "Waiting"
                  : status === "running"
                    ? "Running"
                    : status === "done"
                      ? "Complete"
                      : "Failed"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
