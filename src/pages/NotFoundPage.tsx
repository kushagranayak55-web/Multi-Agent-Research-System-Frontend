import { Link } from "react-router-dom";

import { AgentNetworkGraph } from "@/components/graph/AgentNetworkGraph";
import { AGENT_ORDER } from "@/components/graph/graph-layout";
import type { AgentStatusMap } from "@/components/graph/AgentNetworkGraph";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

const FAILED_STATUSES: AgentStatusMap = AGENT_ORDER.reduce((acc, id) => {
  acc[id] = "failed";
  return acc;
}, {} as AgentStatusMap);

export function NotFoundPage() {
  return (
    <div className="container flex min-h-[75vh] flex-col items-center justify-center gap-8 text-center">
      <div className="w-full max-w-sm opacity-70">
        <AgentNetworkGraph statuses={FAILED_STATUSES} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-wider text-destructive">
          404
        </p>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          This route doesn't exist in the pipeline
        </h1>
        <p className="text-sm text-muted-foreground">
          The page you're looking for isn't part of MARS.
        </p>
      </div>
      <Button asChild>
        <Link to={ROUTES.landing}>Return home</Link>
      </Button>
    </div>
  );
}
