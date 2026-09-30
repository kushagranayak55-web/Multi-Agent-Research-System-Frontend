/**
 * Raw shape returned by the FastAPI `run_research_pipeline` endpoint
 * today. Kept as its own type — separate from the client-side
 * `ResearchState` below — so a backend response-shape change only
 * touches this file and the one mapper function that consumes it.
 */
export interface ResearchApiResponse {
  search_result: string;
  scraped_content: string;
  report: string;
  feedback: string;
  /**
   * How many times the Writer Agent produced a draft. 1 means the
   * first draft was accepted as-is; 2+ means the LangGraph pipeline
   * routed the report back to the Writer after Critic feedback.
   * Optional so older backend responses without this field still parse.
   */
  revision_count?: number;
}

/**
 * Stable identifiers for each agent in the pipeline. This is the
 * single union every agent-aware component keys off. Adding a 5th
 * agent later means extending this union, AGENT_PIPELINE in
 * lib/constants.ts, and the mapper in researchService — nothing
 * else in the component tree hardcodes agent names.
 */
export type AgentId = "search" | "reader" | "writer" | "critic";

export type AgentStatus = "idle" | "running" | "done" | "failed";

export interface AgentState {
  id: AgentId;
  status: AgentStatus;
  /** Set once the agent completes; null while idle/running. */
  startedAt: number | null;
  completedAt: number | null;
}

/**
 * Parsed, presentation-ready research report. `report` is the raw
 * markdown/text the Writer Agent produced; the rest are parsed out
 * of `feedback` by the critic mapper once that format is finalized
 * with the backend. Kept optional/nullable now so the UI layer can
 * render partial data as soon as it's available.
 */
export interface CriticEvaluation {
  score: number | null;
  strengths: string[];
  areasToImprove: string[];
  verdict: string | null;
}

export interface ResearchResult {
  searchResult: string;
  scrapedContent: string;
  report: string;
  critic: CriticEvaluation;
  /** Number of times the report was revised after Critic feedback (0 = accepted on first draft). */
  revisionCount: number;
}

/**
 * Full client-side state for one research run — what the workspace
 * store holds. Distinct from ResearchApiResponse because the UI
 * needs to track per-agent progress that the (currently synchronous)
 * backend doesn't report yet; simulatedProgress lets the frontend
 * stage the reveal realistically without lying about real data once
 * it arrives.
 */
export interface ResearchRun {
  topic: string;
  status: "idle" | "running" | "completed" | "failed";
  agents: Record<AgentId, AgentState>;
  result: ResearchResult | null;
  error: string | null;
}

export class ApiError extends Error {
  status: number | null;
  cause?: unknown;

  constructor(message: string, status: number | null = null, cause?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.cause = cause;
  }
}
