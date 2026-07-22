import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

import { SectionHeading } from "@/components/common/SectionHeading";

const COMPARISON = [
  {
    point: "Role specialization",
    single:
      "One model handles searching, reading, writing, and evaluating in a single pass — every step competes for the same context and attention.",
    multi:
      "Each agent has one job and a focused prompt scoped to it, so the Writer Agent isn't also trying to judge its own output.",
  },
  {
    point: "Context management",
    single:
      "Source material, drafting, and self-review all share one context window, which gets crowded fast on longer research topics.",
    multi:
      "Context is scoped per agent — the Critic Agent reviews the finished report without needing the full browsing history that produced it.",
  },
  {
    point: "Failure isolation",
    single:
      "A weak step (e.g. poor source selection) is invisible — it's buried inside one model's single output.",
    multi:
      "Each agent's output — search_result, scraped_content, report — is inspectable on its own, so a weak step is traceable to a specific stage.",
  },
  {
    point: "Built-in evaluation",
    single:
      "The model that wrote the answer is the only judge of whether it's good.",
    multi:
      "The Critic Agent is a separate pass with a separate objective: evaluate, not produce — closer to an editorial review than self-grading.",
  },
];

export function WhyMultiAgent() {
  return (
    <section className="py-24">
      <div className="container flex flex-col gap-14">
        <SectionHeading
          eyebrow="Why multi-agent"
          title="Specialized agents outperform one generalist pass"
          description="A single model asked to search, read, write, and critique at once is doing four jobs with one set of instructions. MARS splits that into a pipeline where each stage does one thing well."
        />

        <div className="mx-auto flex w-full max-w-4xl flex-col gap-px overflow-hidden rounded-xl border border-border bg-border">
          <div className="hidden bg-surface text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid md:grid-cols-[1fr_1.4fr_1.4fr]">
            <div className="p-4" />
            <div className="flex items-center gap-2 p-4">
              <X className="h-3.5 w-3.5 text-destructive" />
              Single-model pass
            </div>
            <div className="flex items-center gap-2 p-4 text-primary">
              <Check className="h-3.5 w-3.5" />
              MARS pipeline
            </div>
          </div>

          {COMPARISON.map((row, index) => (
            <motion.div
              key={row.point}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-col gap-3 bg-surface p-4 md:grid md:grid-cols-[1fr_1.4fr_1.4fr] md:gap-0 md:p-0"
            >
              <div className="font-display text-sm font-medium text-foreground md:p-4">
                {row.point}
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground md:p-4">
                <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive md:hidden" />
                {row.single}
              </div>
              <div className="flex items-start gap-2 text-sm text-foreground/90 md:p-4">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary md:hidden" />
                {row.multi}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
