import { motion } from "framer-motion";
import { BookOpenText, PenSquare, Search, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/common/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";

interface AgentProfile {
  id: string;
  icon: LucideIcon;
  name: string;
  role: string;
  description: string;
  input: string;
  output: string;
}

const AGENTS: AgentProfile[] = [
  {
    id: "search",
    icon: Search,
    name: "Search Agent",
    role: "Finds the sources worth reading",
    description:
      "Takes the topic and queries the web for the most relevant, credible sources — the same first step a human researcher takes, run without the manual searching.",
    input: "topic",
    output: "search_result",
  },
  {
    id: "reader",
    icon: BookOpenText,
    name: "Reader Agent",
    role: "Extracts substance from sources",
    description:
      "Reads through what the Search Agent found and pulls out the content that actually matters, discarding navigation, ads, and boilerplate.",
    input: "search_result",
    output: "scraped_content",
  },
  {
    id: "writer",
    icon: PenSquare,
    name: "Writer Agent",
    role: "Synthesizes the report",
    description:
      "Turns extracted source content into a structured, coherent report — organizing findings the way a human analyst would write them up.",
    input: "scraped_content",
    output: "report",
  },
  {
    id: "critic",
    icon: ShieldCheck,
    name: "Critic Agent",
    role: "Evaluates the result",
    description:
      "Reviews the finished report for quality, gaps, and accuracy, then returns a score and specific feedback — a second opinion built into the pipeline.",
    input: "report",
    output: "feedback",
  },
];

export function AgentShowcase() {
  return (
    <section className="py-24">
      <div className="container flex flex-col gap-14">
        <SectionHeading
          eyebrow="The pipeline"
          title="Four specialists. One handoff at a time."
          description="Each agent has exactly one job, and passes its output directly into the next agent's input — nothing is done twice, nothing is skipped."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-raised text-primary">
                    <agent.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold">
                      {agent.name}
                    </h3>
                    <p className="mt-1 text-sm text-primary">{agent.role}</p>
                  </div>
                  <p className="flex-1 text-sm text-muted-foreground">
                    {agent.description}
                  </p>
                  <div className="flex items-center gap-1.5 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
                    <code className="rounded bg-surface-raised px-1.5 py-0.5">
                      {agent.input}
                    </code>
                    <span aria-hidden>→</span>
                    <code className="rounded bg-surface-raised px-1.5 py-0.5 text-foreground">
                      {agent.output}
                    </code>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
