import {
  Palette,
  Ruler,
  Type,
  Square,
  Sparkles,
  FileCode2,
  ArrowRight,
} from "lucide-react"
import type { DesignViolation } from "@/lib/audit-data"
import { SeverityBadge } from "@/components/severity-badge"

const categoryConfig = {
  color: { label: "Цвет", icon: Palette },
  spacing: { label: "Отступы", icon: Ruler },
  typography: { label: "Типографика", icon: Type },
  radius: { label: "Скругления", icon: Square },
  shadow: { label: "Тени", icon: Sparkles },
} as const

export function DesignTab({ violations }: { violations: DesignViolation[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-semibold text-card-foreground">
          Хардкод-значения вне эталонной дизайн-системы
        </h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Найдено {violations.length} значений, заданных напрямую вместо токенов
          дизайн-системы. Для каждого указан файл, строка и рекомендуемый токен.
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {violations.map((v) => {
          const cat = categoryConfig[v.category]
          const Icon = cat.icon
          return (
            <li
              key={v.id}
              className="group rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {v.id}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {cat.label}
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 truncate font-mono text-sm text-card-foreground">
                    <FileCode2
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {v.file}
                    <span className="text-muted-foreground">:{v.line}</span>
                  </span>
                </div>
                <SeverityBadge severity={v.severity} />
              </div>

              <div className="mt-2 overflow-x-auto rounded-md border border-border bg-muted/60 px-2.5 py-2">
                <code className="font-mono text-xs text-card-foreground">
                  {v.snippet}
                </code>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-critical-soft px-2 py-1 font-mono font-medium text-critical">
                  {v.hardcoded}
                </span>
                <ArrowRight
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="rounded-md bg-success-soft px-2 py-1 font-mono font-medium text-success">
                  {v.expected}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
