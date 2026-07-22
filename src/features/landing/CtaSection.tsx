import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/15 blur-[130px]"
      />

      <div className="container flex flex-col items-center gap-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Give the agents a topic. Watch them work.
        </motion.h2>
        <p className="max-w-md text-muted-foreground">
          No account, no setup. Enter a topic and the pipeline starts
          immediately.
        </p>
        <Button asChild size="lg">
          <Link to={ROUTES.workspace}>
            Enter Research Workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
