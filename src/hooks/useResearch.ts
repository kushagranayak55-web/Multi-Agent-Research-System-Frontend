import { useResearchStore } from "@/store/researchStore";

/**
 * Thin re-export rather than a re-implementation. Components should
 * import `useResearch` (not `useResearchStore` directly) so that if
 * the store is ever split (e.g. separate stores per agent) or swapped
 * for a different state library, only this hook's internals change —
 * no consuming component does.
 */
export function useResearch() {
  return useResearchStore();
}
