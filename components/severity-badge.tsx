import type { Severity } from "@/lib/audit-data"

const config: Record<Severity, { label: string; className: string }> = {
  critical: {
    label: "Критично",
    className: "bg-critical-soft text-critical",
  },
  warning: {
    label: "Предупреждение",
    className: "bg-warning-soft text-warning",
  },
  info: {
    label: "Инфо",
    className: "bg-info-soft text-info",
  },
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const { label, className } = config[severity]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  )
}
