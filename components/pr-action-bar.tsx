"use client"

import { useState } from "react"
import {
  GitPullRequest,
  Loader2,
  X,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  FileText,
} from "lucide-react"

type PrResult =
  | {
      mode: "created"
      url: string
      number: number
      branch: string
      title: string
      count: number
    }
  | {
      mode: "preview"
      branch: string
      title: string
      body: string
      count: number
      message: string
    }

export function PrActionBar({
  selectedIds,
  onClear,
}: {
  selectedIds: string[]
  onClear: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PrResult | null>(null)

  const count = selectedIds.length

  async function createPr() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/create-pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Не удалось создать pull request")
        return
      }
      setResult(data as PrResult)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Sticky action bar */}
      {count > 0 && (
        <div className="sticky bottom-4 z-20 mx-auto flex w-full max-w-2xl items-center gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GitPullRequest className="size-5" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-semibold text-card-foreground">
              Выбрано правок: {count}
            </span>
            <button
              onClick={onClear}
              className="w-fit text-[11px] text-muted-foreground hover:text-card-foreground hover:underline"
            >
              Сбросить выбор
            </button>
          </div>
          <button
            onClick={createPr}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <GitPullRequest className="size-4" aria-hidden="true" />
            )}
            Создать pull request
          </button>
        </div>
      )}

      {/* Result / error dialog */}
      {(result || error) && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Результат создания pull request"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => {
              setResult(null)
              setError(null)
            }}
            aria-hidden="true"
          />
          <div className="relative flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {error ? (
                  <AlertCircle
                    className="size-5 text-critical"
                    aria-hidden="true"
                  />
                ) : (
                  <CheckCircle2
                    className="size-5 text-success"
                    aria-hidden="true"
                  />
                )}
                <h2 className="text-base font-semibold text-card-foreground">
                  {error
                    ? "Не удалось создать PR"
                    : result?.mode === "created"
                      ? "Pull request создан"
                      : "PR сформирован (предпросмотр)"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setResult(null)
                  setError(null)
                }}
                aria-label="Закрыть"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-card-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {error && (
              <p className="rounded-md bg-critical-soft px-3 py-2 text-sm leading-relaxed text-critical">
                {error}
              </p>
            )}

            {result?.mode === "created" && (
              <div className="flex flex-col gap-3">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {result.title}
                </p>
                <div className="flex flex-col gap-1 rounded-md bg-muted/60 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">
                    Ветка:{" "}
                    <code className="font-mono text-card-foreground">
                      {result.branch}
                    </code>
                  </span>
                  <span className="text-muted-foreground">
                    Правок в PR:{" "}
                    <span className="font-semibold text-card-foreground">
                      {result.count}
                    </span>
                  </span>
                </div>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Открыть PR #{result.number}
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </div>
            )}

            {result?.mode === "preview" && (
              <div className="flex flex-col gap-3">
                <p className="flex items-start gap-2 rounded-md bg-info-soft px-3 py-2 text-xs leading-relaxed text-info">
                  <AlertCircle
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  {result.message}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                  <FileText className="size-4" aria-hidden="true" />
                  {result.title}
                </div>
                <pre className="max-h-64 overflow-auto rounded-md border border-border bg-muted/60 p-3 text-[11px] leading-relaxed text-card-foreground">
                  <code className="font-mono">{result.body}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
