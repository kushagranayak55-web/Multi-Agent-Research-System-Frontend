import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type {
  CriticEvaluation,
  ResearchApiResponse,
  ResearchResult,
} from "@/services/types/research.types";

/**
 * Best-effort parse of the Critic Agent's free-text `feedback` field
 * into structured score / strengths / areas-to-improve / verdict.
 *
 * The current backend returns this as a single string, not
 * structured JSON. Rather than block the frontend on a backend
 * change, this mapper looks for common patterns (a leading number
 * as score, "Strengths" / "Areas to Improve" / "Verdict" headers)
 * and degrades gracefully to putting the whole string in `verdict`
 * if it doesn't recognize the shape.
 *
 * TODO(backend): once the Critic Agent returns structured JSON
 * (e.g. { score, strengths: string[], areas_to_improve: string[],
 * verdict }), delete this parser and map the fields directly —
 * this function's contract (return type) won't need to change.
 */
function parseCriticFeedback(feedback: string): CriticEvaluation {
  const scoreMatch = feedback.match(/(\d{1,3})\s*\/\s*100|score[:\s]+(\d{1,3})/i);
  const rawScore = scoreMatch ? Number(scoreMatch[1] ?? scoreMatch[2]) : null;

  const extractListSection = (label: string): string[] => {
    const pattern = new RegExp(
      `${label}[:\\s]*\\n?([\\s\\S]*?)(?=\\n\\s*\\n|$)`,
      "i"
    );
    const match = feedback.match(pattern);
    if (!match) return [];

    return match[1]
      .split("\n")
      .map((line) => line.replace(/^[-*•\d.\s]+/, "").trim())
      .filter(Boolean);
  };

  const verdictMatch = feedback.match(/verdict[:\s]*([\s\S]*?)(?=\n\s*\n|$)/i);

  const strengths = extractListSection("strengths");
  const areasToImprove = extractListSection("areas to improve");

  const hasStructure = strengths.length > 0 || areasToImprove.length > 0 || verdictMatch;

  return {
    score: rawScore !== null && rawScore >= 0 && rawScore <= 100 ? rawScore : null,
    strengths,
    areasToImprove,
    verdict: verdictMatch ? verdictMatch[1].trim() : hasStructure ? null : feedback.trim(),
  };
}

function mapResponseToResult(data: ResearchApiResponse): ResearchResult {
  // Backend's revision_count starts at 1 after the first draft, so
  // subtract 1 to get "number of revisions beyond the first draft."
  const rawRevisionCount = data.revision_count ?? 1;
  const revisionCount = Math.max(0, rawRevisionCount - 1);

  return {
    searchResult: data.search_result,
    scrapedContent: data.scraped_content,
    report: data.report,
    critic: parseCriticFeedback(data.feedback ?? ""),
    revisionCount,
  };
}

/**
 * Runs the full Search -> Reader -> Writer -> Critic pipeline for a
 * topic. The current backend is synchronous, so this resolves once
 * with the complete result — the workspace store is responsible for
 * staging the agent-by-agent UI reveal around this single call (see
 * store/researchStore.ts).
 *
 * Retries once on transient network/5xx failure — a research run is
 * expensive enough client-side that silently failing on one Render
 * cold-start blip would be a bad experience.
 */
export async function runResearch(
  topic: string,
  signal?: AbortSignal
): Promise<ResearchResult> {
  const data = await apiClient<ResearchApiResponse>(ENDPOINTS.runResearch, {
    method: "POST",
    body: JSON.stringify({ topic }),
    retries: 1,
    signal,
  });

  return mapResponseToResult(data);
}
