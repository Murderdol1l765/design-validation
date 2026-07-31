import { FileCode2, Wrench, ExternalLink } from "lucide-react"
import type { A11yViolation } from "@/lib/audit-data"
import { SeverityBadge } from "@/components/severity-badge"

const levelClass: Record<A11yViolation["level"], string> = {
  A: "bg-info-soft text-info",
  AA: "bg-primary-soft text-primary",
  AAA: "bg-accent-soft text-accent",
}

export function A11yTab({ violations }: { violations: A11yViolation[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-card-foreground">
          Нарушения доступности (WCAG 2.1 / W3C)
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Найдено {violations.length} нарушений требований W3C. Каждое привязано к
          критерию успеха WCAG с указанием уровня соответствия.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {violations.map((v) => (
          <li
            key={v.id}
            className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/50"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex flex-col items-center rounded-md bg-accent-soft px-3 py-1.5 text-accent">
                <span className="font-mono text-sm font-bold leading-none">
                  {v.criterion}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  WCAG
                </span>
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-accent">
                    {v.id}
                  </span>
                  <span className="font-semibold text-card-foreground">
                    {v.rule}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${levelClass[v.level]}`}
                  >
                    Уровень {v.level}
                  </span>
                </div>
                <span className="flex items-center gap-1.5 truncate font-mono text-xs text-muted-foreground">
                  <FileCode2 className="size-3.5 shrink-0" aria-hidden="true" />
                  {v.file}:{v.line}
                </span>
              </div>
              <SeverityBadge severity={v.severity} />
            </div>

            <p className="mt-3 text-sm leading-relaxed text-card-foreground">
              {v.description}
            </p>

            <div className="mt-3 overflow-x-auto rounded-md border border-border bg-muted/60 p-3">
              <code className="font-mono text-xs text-card-foreground">
                {v.element}
              </code>
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-md bg-success-soft/70 p-3">
              <Wrench
                className="mt-0.5 size-4 shrink-0 text-success"
                aria-hidden="true"
              />
              <p className="text-xs leading-relaxed text-card-foreground">
                <span className="font-semibold text-success">Как исправить: </span>
                {v.fix}
              </p>
            </div>

            <a
              href={`https://www.w3.org/WAI/WCAG21/Understanding/`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              Документация W3C по критерию {v.criterion}
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
