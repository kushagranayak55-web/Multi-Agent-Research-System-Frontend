/**
 * Route paths as named constants so no component ever hardcodes a
 * string literal for navigation — renaming a route later is a
 * one-line change here instead of a project-wide find/replace.
 */
export const ROUTES = {
  landing: "/",
  workspace: "/research",
} as const;

export const SITE = {
  name: "MARS",
  fullName: "Multi Agent Research System",
  tagline: "Autonomous Research Powered by AI Agents",
  author: "Kushagra Nayak",
} as const;

/**
 * Canonical list + order of agents in the pipeline. Every future
 * component (network graph, status cards, execution timeline,
 * activity feed) should map over this array rather than hardcoding
 * four separate cases — adding a 5th agent later becomes a matter
 * of extending this list and the AgentId union in services/types.
 */
export const AGENT_PIPELINE = [
  {
    id: "search",
    label: "Search Agent",
    description: "Finds the most relevant sources for the topic.",
  },
  {
    id: "reader",
    label: "Reader Agent",
    description: "Reads and extracts substance from each source.",
  },
  {
    id: "writer",
    label: "Writer Agent",
    description: "Synthesizes findings into a structured report.",
  },
  {
    id: "critic",
    label: "Critic Agent",
    description: "Evaluates the report and scores its quality.",
  },
] as const;
