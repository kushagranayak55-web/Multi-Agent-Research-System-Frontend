/**
 * Backend route paths, named. When v2 adds a job-based/streaming
 * endpoint (e.g. GET /research/:id/status), it gets added here and
 * nowhere else needs to know the literal string.
 */
export const ENDPOINTS = {
  runResearch: "/research",
} as const;
