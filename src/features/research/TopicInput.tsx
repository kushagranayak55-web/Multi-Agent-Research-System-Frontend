import { FormEvent, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EXAMPLE_TOPICS = [
  "The economic impact of remote work",
  "Advances in solid-state battery technology",
  "How CRISPR gene editing works",
  "The rise of small modular nuclear reactors",
];

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isRunning: boolean;
}

export function TopicInput({ onSubmit, isRunning }: TopicInputProps) {
  const [topic, setTopic] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!topic.trim() || isRunning) return;
    onSubmit(topic);
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col gap-3 rounded-xl border border-border bg-surface p-2 transition-colors sm:flex-row sm:items-center",
          "focus-within:border-primary/60"
        )}
      >
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a research topic — e.g. “the future of quantum computing”"
          disabled={isRunning}
          className="h-12 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-60"
        />
        <Button
          type="submit"
          size="lg"
          disabled={isRunning || !topic.trim()}
          className="sm:w-auto"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Researching
            </>
          ) : (
            <>
              Start Research
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {EXAMPLE_TOPICS.map((example) => (
          <button
            key={example}
            type="button"
            disabled={isRunning}
            onClick={() => setTopic(example)}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-50"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
