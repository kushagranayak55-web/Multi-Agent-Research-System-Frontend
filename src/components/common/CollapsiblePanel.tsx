import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CollapsiblePanelProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  content: string;
  defaultOpen?: boolean;
}

export function CollapsiblePanel({
  icon: Icon,
  title,
  subtitle,
  content,
  defaultOpen = false,
}: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="font-display text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <CardContent className="border-t border-border pt-4">
          <p className="max-h-[420px] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
            {content}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
