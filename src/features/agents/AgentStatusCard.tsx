import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Loader2, XCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AgentStatus } from "@/services/types/research.types";

interface AgentStatusCardProps {
  label: string;
  description: string;
  status: AgentStatus;
}

const STATUS_CONFIG: Record<
  AgentStatus,
  { icon: typeof CircleDashed; text: string; className: string }
> = {
  idle: { icon: CircleDashed, text: "Waiting", className: "text-muted-foreground" },
  running: { icon: Loader2, text: "Running", className: "text-primary" },
  done: { icon: CheckCircle2, text: "Complete", className: "text-success" },
  failed: { icon: XCircle, text: "Failed", className: "text-destructive" },
};

export function AgentStatusCard({ label, description, status }: AgentStatusCardProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        "transition-colors duration-300",
        status === "running" && "border-primary/50"
      )}
    >
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-semibold">{label}</span>
          <motion.span
            animate={status === "running" ? { rotate: 360 } : { rotate: 0 }}
            transition={
              status === "running"
                ? { duration: 1.1, repeat: Infinity, ease: "linear" }
                : { duration: 0.2 }
            }
            className={config.className}
          >
            <Icon className="h-4 w-4" />
          </motion.span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <span className={cn("font-mono text-[11px] uppercase tracking-wider", config.className)}>
          {config.text}
        </span>
      </CardContent>
    </Card>
  );
}
