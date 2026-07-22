import { AGENT_PIPELINE } from "@/lib/constants";
import type { AgentId } from "@/services/types/research.types";

export const AGENT_ORDER: AgentId[] = AGENT_PIPELINE.map((a) => a.id) as AgentId[];

export interface GraphNode {
  id: AgentId;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: AgentId;
  to: AgentId;
}

/**
 * Coordinates on a 480x320 viewBox. Matches the product's signature
 * mark exactly: Search on top, Reader and Writer on the middle row,
 * Critic at the bottom.
 */
export const GRAPH_NODES: GraphNode[] = [
  { id: "search", label: "Search", x: 240, y: 44 },
  { id: "reader", label: "Reader", x: 96, y: 168 },
  { id: "writer", label: "Writer", x: 384, y: 168 },
  { id: "critic", label: "Critic", x: 240, y: 284 },
];

/**
 * Edges encode the real handoff order of the pipeline, not just
 * decoration: Search feeds both Reader and Writer context, Reader
 * hands its extraction to Writer, and both Reader and Writer inform
 * the Critic's review.
 */
export const GRAPH_EDGES: GraphEdge[] = [
  { from: "search", to: "reader" },
  { from: "search", to: "writer" },
  { from: "reader", to: "writer" },
  { from: "reader", to: "critic" },
  { from: "writer", to: "critic" },
];

export function getNode(id: AgentId): GraphNode {
  const node = GRAPH_NODES.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown agent id: ${id}`);
  return node;
}
