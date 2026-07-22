import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { AgentNetworkGraph } from "@/components/graph/AgentNetworkGraph";
import { useShowcaseAgentLoop } from "@/components/graph/useShowcaseAgentLoop";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export function Hero() {
  const statuses = useShowcaseAgentLoop();

  return (
    <section className="relative overflow-hidden">
      {/* Decorative grid pattern lives in its own layer. It must NOT
          share a paint layer with real content: mask-image (used by
          .bg-grid to fade the pattern toward the edges) masks the
          entire element it's applied to, including all descendants —
          so putting this class directly on a section that also
          contains the heading/graph would fade out the real content
          along with the pattern. */}
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
      />

      <div className="container grid gap-16 pb-24 pt-20 lg:grid-cols-2 lg:items-center lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Four agents. One pipeline.
          </span>

          <h1 className="text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Autonomous research,
            <br />
            powered by AI agents.
          </h1>

          <p className="max-w-md text-balance text-lg text-muted-foreground">
            Give MARS a topic. A Search Agent finds sources, a Reader Agent
            extracts substance, a Writer Agent drafts the report, and a
            Critic Agent evaluates the result — autonomously, in sequence.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button asChild size="lg">
              <Link to={ROUTES.workspace}>
                Enter Research Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              See how the pipeline works
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative"
        >
          <div className="glass-surface rounded-2xl p-6 sm:p-10">
            <AgentNetworkGraph statuses={statuses} ambient />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
