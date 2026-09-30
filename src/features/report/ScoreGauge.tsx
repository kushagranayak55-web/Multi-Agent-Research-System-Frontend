import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  maxScore?: number; // defaults to 10 to match the Critic Agent's "Score: X/10" output
}

function scoreColor(ratio: number): string {
  if (ratio >= 0.8) return "hsl(var(--success))";
  if (ratio >= 0.5) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
}

export function ScoreGauge({ score, maxScore = 10 }: ScoreGaugeProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(maxScore, Math.max(0, score));
  const ratio = maxScore > 0 ? clamped / maxScore : 0;
  const offset = circumference - ratio * circumference;
  const color = scoreColor(ratio);

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="10"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-semibold" style={{ color }}>
          {clamped}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          / {maxScore}
        </span>
      </div>
    </div>
  );
}
