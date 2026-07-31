import {
  Palette,
  Ruler,
  Type,
  Square,
  Sparkles,
  FileCode2,
  ArrowRight,
  ChevronDown,
  Lightbulb,
  Boxes,
  Component,
} from "lucide-react"
import type {
  DesignViolation,
  ComponentRecommendation,
} from "@/lib/audit-data"
import { SeverityBadge } from "@/components/severity-badge"

const categoryConfig = {
  color: { label: "Цвет", icon: Palette },
  spacing: { label: "Отступы", icon: Ruler },
  typography: { label: "Типографика", icon: Type },
  radius: { label: "Скругления", icon: Square },
  shadow: { label: "Тени", icon: Sparkles },
} as const

function Recommendation({ text }: { text: string }) {
  return (
    <div className="mt-2 flex items-start gap-2 rounded-md bg-success-soft/70 px-2.5 py-2">
      <Lightbulb
        className="mt-0.5 size-3.5 shrink-0 text-success"
        aria-hidden="true"
      />
      <p className="text-xs leading-relaxed text-card-foreground">
        <span className="font-semibold text-success">Рекомендация: </span>
        {text}
      </p>
    </div>
  )
}

function CollapsibleSection({
  icon: Icon,
  title,
  description,
  count,
  defaultOpen,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  title: string
  description: string
  count: number
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-border bg-card/50"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-card [&::-webkit-details-marker]:hidden">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Icon className="size-5" aria-hidden={true} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-2">
            <span className="text-sm font-semibold text-card-foreground">
              {title}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
              {count}
            </span>
          </span>
          <span className="text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </span>
        </span>
        <ChevronDown
          className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="px-3 pb-3">{children}</div>
    </details>
  )
}

export function DesignTab({
  violations,
  recommendations,
}: {
  violations: DesignViolation[]
  recommendations: ComponentRecommendation[]
}) {
  return (
    <div className="flex flex-col gap-3">
      <CollapsibleSection
        icon={Boxes}
        title="Хардкод-значения вне эталонной дизайн-системы"
        description={`Найдено ${violations.length} значений, заданных напрямую вместо токенов.`}
        count={violations.length}
        defaultOpen
      >
        <ul className="flex flex-col gap-2">
          {violations.map((v) => {
            const cat = categoryConfig[v.category]
            const Icon = cat.icon
            return (
              <li
                key={v.id}
                className="group/item rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
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

                <Recommendation text={v.recommendation} />
              </li>
            )
          })}
        </ul>
      </CollapsibleSection>

      <CollapsibleSection
        icon={Component}
        title="Рекомендации по замене кастомных компонентов"
        description={`Найдено ${recommendations.length} кастомных компонентов с аналогом в дизайн-системе.`}
        count={recommendations.length}
      >
        <ul className="flex flex-col gap-2">
          {recommendations.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <Component className="size-4" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {r.id}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Компонент
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 truncate font-mono text-sm text-card-foreground">
                    <FileCode2
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {r.file}
                    <span className="text-muted-foreground">:{r.line}</span>
                  </span>
                </div>
                <SeverityBadge severity={r.severity} />
              </div>

              <div className="mt-2 overflow-x-auto rounded-md border border-border bg-muted/60 px-2.5 py-2">
                <code className="font-mono text-xs text-card-foreground">
                  {r.snippet}
                </code>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-critical-soft px-2 py-1 font-mono font-medium text-critical">
                  {r.custom}
                </span>
                <ArrowRight
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="rounded-md bg-success-soft px-2 py-1 font-mono font-medium text-success">
                  {r.replacement}
                </span>
              </div>

              <Recommendation text={r.recommendation} />
            </li>
          ))}
        </ul>
      </CollapsibleSection>
    </div>
  )
}
