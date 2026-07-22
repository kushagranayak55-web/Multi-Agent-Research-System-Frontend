import { motion } from "framer-motion";

import { SectionHeading } from "@/components/common/SectionHeading";

const STEPS = [
  {
    step: "01",
    title: "You provide a topic",
    detail:
      "One line is enough. No prompt engineering, no follow-up questions — MARS takes it from there.",
  },
  {
    step: "02",
    title: "Research runs autonomously",
    detail:
      "The Search Agent finds sources and the Reader Agent extracts what's relevant, without you watching every query.",
  },
  {
    step: "03",
    title: "Findings are synthesized",
    detail:
      "The Writer Agent turns extracted content into a structured report — organized, not just concatenated.",
  },
  {
    step: "04",
    title: "The report is critiqued",
    detail:
      "The Critic Agent reviews the report on its own merits and returns a score, strengths, and gaps — before you ever see it.",
  },
  {
    step: "05",
    title: "You receive evaluated research",
    detail:
      "Not a raw answer. A report that has already been reviewed, with the review attached.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container flex flex-col gap-14">
        <SectionHeading
          eyebrow="How MARS works"
          title="From a topic to an evaluated report"
          description="Five steps, one continuous run — each agent starts exactly where the previous one finished."
        />

        <div className="relative mx-auto flex max-w-2xl flex-col">
          <div
            aria-hidden
            className="absolute bottom-6 left-[19px] top-6 w-px bg-gradient-to-b from-primary/60 via-border to-transparent"
          />

          {STEPS.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="relative flex gap-6 py-6"
            >
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-xs text-primary">
                {item.step}
              </div>
              <div className="pt-1.5">
                <h3 className="font-display text-lg font-medium">
                  {item.title}
                </h3>
                <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
