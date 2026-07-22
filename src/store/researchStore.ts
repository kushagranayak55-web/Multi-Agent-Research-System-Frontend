import { create } from "zustand";

import { AGENT_PIPELINE } from "@/lib/constants";
import { runResearch } from "@/services/api/researchService";
import type {
  AgentId,
  AgentState,
  ResearchRun,
} from "@/services/types/research.types";
import { ApiError } from "@/services/types/research.types";

const AGENT_IDS = AGENT_PIPELINE.map((a) => a.id) as AgentId[];

/**
 * Approximate on-screen duration (ms) for each agent's "running"
 * state. The backend today is a single synchronous call — these
 * durations exist purely to pace the UI reveal so the pipeline
 * *feels* like four sequential specialists working, instead of a
 * spinner followed by everything appearing at once.
 *
 * If the real response arrives before the staged sequence finishes,
 * `startResearch` fast-forwards straight to the completed state —
 * the simulation never blocks or delays real data, it only fills
 * the waiting time honestly. If a v2 backend starts reporting real
 * per-agent progress (see researchService TODO), this whole staging
 * block is what gets deleted in favor of live events.
 */
const STAGE_DURATIONS_MS: Record<AgentId, number> = {
  search: 2200,
  reader: 3200,
  writer: 3600,
  critic: 2400,
};

/**
 * Render's free tier spins down idle instances; a cold start can
 * take 30-60s to answer the first request. Past this threshold we
 * surface an explicit "backend is waking up" message instead of
 * letting the UI look stuck.
 */
const SLOW_CONNECTION_THRESHOLD_MS = 8000;

function createIdleAgents(): Record<AgentId, AgentState> {
  return AGENT_IDS.reduce((acc, id) => {
    acc[id] = { id, status: "idle", startedAt: null, completedAt: null };
    return acc;
  }, {} as Record<AgentId, AgentState>);
}

function createInitialRun(): ResearchRun {
  return {
    topic: "",
    status: "idle",
    agents: createIdleAgents(),
    result: null,
    error: null,
  };
}

interface ResearchStore {
  run: ResearchRun;
  isSlowConnection: boolean;
  startResearch: (topic: string) => Promise<void>;
  cancelResearch: () => void;
  reset: () => void;
}

let stageTimers: ReturnType<typeof setTimeout>[] = [];
let slowConnectionTimer: ReturnType<typeof setTimeout> | null = null;
let abortController: AbortController | null = null;

function clearStageTimers() {
  stageTimers.forEach(clearTimeout);
  stageTimers = [];
}

function clearSlowConnectionTimer() {
  if (slowConnectionTimer) clearTimeout(slowConnectionTimer);
  slowConnectionTimer = null;
}

export const useResearchStore = create<ResearchStore>((set, get) => ({
  run: createInitialRun(),
  isSlowConnection: false,

  startResearch: async (topic: string) => {
    clearStageTimers();
    clearSlowConnectionTimer();
    abortController?.abort("superseded");

    const trimmedTopic = topic.trim();
    if (!trimmedTopic) return;

    set({
      run: {
        ...createInitialRun(),
        topic: trimmedTopic,
        status: "running",
      },
      isSlowConnection: false,
    });

    const setAgentStatus = (id: AgentId, status: AgentState["status"]) => {
      const now = Date.now();
      set((state) => ({
        run: {
          ...state.run,
          agents: {
            ...state.run.agents,
            [id]: {
              ...state.run.agents[id],
              status,
              startedAt:
                status === "running" ? now : state.run.agents[id].startedAt,
              completedAt:
                status === "done" || status === "failed"
                  ? now
                  : state.run.agents[id].completedAt,
            },
          },
        },
      }));
    };

    // Stage the sequential "running" feel: agent[n] starts running
    // as soon as agent[n-1] finishes its allotted time.
    let elapsed = 0;
    setAgentStatus(AGENT_IDS[0], "running");

    AGENT_IDS.forEach((id, index) => {
      elapsed += STAGE_DURATIONS_MS[id];
      const nextId = AGENT_IDS[index + 1];

      stageTimers.push(
        setTimeout(() => {
          // Guard: if the run has already been reset/completed via
          // the real API response, don't resurrect a stale timer.
          if (get().run.status !== "running") return;

          setAgentStatus(id, "done");
          if (nextId) setAgentStatus(nextId, "running");
        }, elapsed)
      );
    });

    abortController = new AbortController();
    slowConnectionTimer = setTimeout(() => {
      if (get().run.status === "running") set({ isSlowConnection: true });
    }, SLOW_CONNECTION_THRESHOLD_MS);

    try {
      const result = await runResearch(trimmedTopic, abortController.signal);

      // Real data won — cancel the staged reveal and jump straight
      // to a fully completed pipeline.
      clearStageTimers();
      clearSlowConnectionTimer();

      set((state) => ({
        isSlowConnection: false,
        run: {
          ...state.run,
          status: "completed",
          result,
          agents: AGENT_IDS.reduce((acc, id) => {
            acc[id] = {
              id,
              status: "done",
              startedAt: state.run.agents[id].startedAt ?? Date.now(),
              completedAt: Date.now(),
            };
            return acc;
          }, {} as Record<AgentId, AgentState>),
        },
      }));
    } catch (error) {
      clearStageTimers();
      clearSlowConnectionTimer();

      // A run cancelled by the user, or superseded by a newer
      // startResearch call, has already updated state itself —
      // don't let this stale catch block overwrite it.
      const reason = abortController?.signal.reason;
      if (reason === "superseded" || reason === "cancelled") {
        return;
      }

      const message =
        error instanceof ApiError
          ? error.message
          : "Something went wrong while running the research pipeline.";

      set((state) => {
        // Mark whichever agent was actively running as failed;
        // leave earlier "done" agents as they were.
        const runningId = AGENT_IDS.find(
          (id) => state.run.agents[id].status === "running"
        );

        return {
          isSlowConnection: false,
          run: {
            ...state.run,
            status: "failed",
            error: message,
            agents: runningId
              ? {
                  ...state.run.agents,
                  [runningId]: {
                    ...state.run.agents[runningId],
                    status: "failed",
                    completedAt: Date.now(),
                  },
                }
              : state.run.agents,
          },
        };
      });
    }
  },

  cancelResearch: () => {
    abortController?.abort("cancelled");
    clearStageTimers();
    clearSlowConnectionTimer();
    set({ run: createInitialRun(), isSlowConnection: false });
  },

  reset: () => {
    abortController?.abort("superseded");
    clearStageTimers();
    clearSlowConnectionTimer();
    set({ run: createInitialRun(), isSlowConnection: false });
  },
}));
