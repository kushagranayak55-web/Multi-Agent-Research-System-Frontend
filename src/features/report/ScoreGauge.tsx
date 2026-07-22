import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
}

function scoreColor(score: number): string {
  if (score >= 80) return "hsl(var(--success))";
  if (score >= 50) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, score));
  const offset = circumference - (clamped / 100) * circumference;
  const color = scoreColor(clamped);

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
          {Math.round(clamped)}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          / 100
        </span>
      </div>
    </div>
  );
}
