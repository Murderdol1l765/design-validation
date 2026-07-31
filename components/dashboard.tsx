"use client"

import { useState } from "react"
import {
  Palette,
  Accessibility,
  GitBranch,
  FolderSearch,
  ShieldAlert,
  Clock,
} from "lucide-react"
import {
  meta,
  designViolations,
  a11yViolations,
  type Severity,
} from "@/lib/audit-data"
import { ScoreRing } from "@/components/score-ring"
import { DesignTab } from "@/components/design-tab"
import { A11yTab } from "@/components/a11y-tab"

type TabKey = "design" | "a11y"

function countBy(list: { severity: Severity }[], sev: Severity) {
  return list.filter((v) => v.severity === sev).length
}

export function Dashboard() {
  const [tab, setTab] = useState<TabKey>("design")

  const tabs: { key: TabKey; label: string; icon: typeof Palette; count: number }[] =
    [
      {
        key: "design",
        label: "Соответствие дизайн-системе",
        icon: Palette,
        count: designViolations.length,
      },
      {
        key: "a11y",
        label: "Доступность a11y · W3C",
        icon: Accessibility,
        count: a11yViolations.length,
      },
    ]

  const active = tab === "design" ? designViolations : a11yViolations

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6">
      {/* Header */}
      <header className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              <ShieldAlert className="size-3" aria-hidden="true" />
              Отчёт по анализу проекта
            </span>
            <h1 className="text-xl font-bold tracking-tight text-card-foreground text-balance sm:text-2xl">
              Соответствие дизайн системе и a11y
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-mono">
                <GitBranch className="size-3" aria-hidden="true" />
                {meta.branch}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                #{meta.commit}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3" aria-hidden="true" />
                {meta.scannedAt}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-0.5">
              <ScoreRing
                score={meta.designScore}
                color="var(--color-primary)"
                label="Оценка дизайн-системы"
              />
              <span className="text-[11px] font-medium text-muted-foreground">
                Дизайн-система
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <ScoreRing
                score={meta.a11yScore}
                color="var(--color-accent)"
                label="Оценка доступности"
              />
              <span className="text-[11px] font-medium text-muted-foreground">
                Доступность
              </span>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard
            icon={FolderSearch}
            label="Просканировано файлов"
            value={meta.scannedFiles}
            tone="neutral"
          />
          <StatCard
            icon={ShieldAlert}
            label="Всего нарушений"
            value={designViolations.length + a11yViolations.length}
            tone="neutral"
          />
          <StatCard
            label="Критичных"
            value={
              countBy(designViolations, "critical") +
              countBy(a11yViolations, "critical")
            }
            tone="critical"
          />
          <StatCard
            label="Предупреждений"
            value={
              countBy(designViolations, "warning") +
              countBy(a11yViolations, "warning")
            }
            tone="warning"
          />
        </div>
      </header>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Разделы отчёта"
        className="flex flex-col gap-2 sm:flex-row"
      >
        {tabs.map((t) => {
          const Icon = t.icon
          const selected = tab === t.key
          return (
            <button
              key={t.key}
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={selected}
              aria-controls={`panel-${t.key}`}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors ${
                selected
                  ? "border-primary bg-card shadow-sm"
                  : "border-border bg-card/50 hover:bg-card"
              }`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-md ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span
                  className={`text-[13px] font-semibold ${
                    selected ? "text-card-foreground" : "text-muted-foreground"
                  }`}
                >
                  {t.label}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {t.count} нарушений
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Panel */}
      <section
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
        className="focus:outline-none"
      >
        {tab === "design" ? (
          <DesignTab violations={designViolations} />
        ) : (
          <A11yTab violations={a11yViolations} />
        )}
      </section>

      <p className="sr-only" aria-live="polite">
        Показан раздел: {tab === "design" ? tabs[0].label : tabs[1].label},{" "}
        {active.length} нарушений.
      </p>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon?: typeof Palette
  label: string
  value: number
  tone: "neutral" | "critical" | "warning"
}) {
  const toneClass =
    tone === "critical"
      ? "text-critical"
      : tone === "warning"
        ? "text-warning"
        : "text-card-foreground"

  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-muted/40 px-3 py-2">
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        {Icon ? <Icon className="size-3" aria-hidden="true" /> : null}
        {label}
      </span>
      <span className={`text-xl font-bold tabular-nums ${toneClass}`}>
        {value}
      </span>
    </div>
  )
}
