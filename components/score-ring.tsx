type ScoreRingProps = {
  score: number
  size?: number
  stroke?: number
  color: string
  label: string
}

export function ScoreRing({
  score,
  size = 84,
  stroke = 8,
  color,
  label,
}: ScoreRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${score} из 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-bold tabular-nums text-card-foreground">
          {score}
        </span>
        <span className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
          из 100
        </span>
      </div>
    </div>
  )
}
