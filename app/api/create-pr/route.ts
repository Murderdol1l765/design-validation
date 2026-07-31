import { NextResponse } from "next/server"
import {
  designViolations,
  componentRecommendations,
  a11yViolations,
} from "@/lib/audit-data"

type SelectedFix = {
  id: string
  title: string
  file: string
  line: number
  problem: string
  recommendation: string
}

function collectFixes(ids: string[]): SelectedFix[] {
  const set = new Set(ids)
  const fixes: SelectedFix[] = []

  for (const v of designViolations) {
    if (set.has(v.id)) {
      fixes.push({
        id: v.id,
        title: `Хардкод: ${v.token}`,
        file: v.file,
        line: v.line,
        problem: `${v.hardcoded} → ${v.expected}`,
        recommendation: v.recommendation,
      })
    }
  }
  for (const r of componentRecommendations) {
    if (set.has(r.id)) {
      fixes.push({
        id: r.id,
        title: `Компонент: ${r.custom} → ${r.replacement}`,
        file: r.file,
        line: r.line,
        problem: `${r.custom} → ${r.replacement}`,
        recommendation: r.recommendation,
      })
    }
  }
  for (const a of a11yViolations) {
    if (set.has(a.id)) {
      fixes.push({
        id: a.id,
        title: `a11y ${a.criterion}: ${a.rule}`,
        file: a.file,
        line: a.line,
        problem: a.description,
        recommendation: a.fix,
      })
    }
  }
  return fixes
}

function buildMarkdown(fixes: SelectedFix[]): string {
  const lines = [
    "# Правки по результатам аудита",
    "",
    `Выбрано правок: **${fixes.length}**`,
    "",
    ...fixes.map(
      (f) =>
        `- [ ] **${f.id}** — ${f.title}\n  - Файл: \`${f.file}:${f.line}\`\n  - Проблема: ${f.problem}\n  - Рекомендация: ${f.recommendation}`,
    ),
    "",
  ]
  return lines.join("\n")
}

async function gh(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })
}

export async function POST(request: Request) {
  let body: { ids?: string[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 })
  }

  const ids = Array.isArray(body.ids) ? body.ids : []
  if (ids.length === 0) {
    return NextResponse.json(
      { error: "Не выбрано ни одной правки" },
      { status: 400 },
    )
  }

  const fixes = collectFixes(ids)
  const markdown = buildMarkdown(fixes)
  const branch = `v0/audit-fixes-${Date.now()}`
  const title = `Аудит: ${fixes.length} правк(и) дизайн-системы и a11y`
  const prBody = `Автоматически сформированный PR по результатам аудита интерфейса.\n\n${markdown}`

  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER ?? "Murderdol1l765"
  const repo = process.env.GITHUB_REPO ?? "design-validation"
  const base = process.env.GITHUB_BASE_BRANCH ?? "main"

  // Без токена — возвращаем предпросмотр готового PR.
  if (!token) {
    return NextResponse.json({
      mode: "preview",
      branch,
      title,
      body: prBody,
      count: fixes.length,
      message:
        "PR сформирован в режиме предпросмотра. Добавьте переменную окружения GITHUB_TOKEN, чтобы создавать реальные pull request'ы.",
    })
  }

  try {
    // 1. Получаем SHA базовой ветки.
    const refRes = await gh(token, `/repos/${owner}/${repo}/git/ref/heads/${base}`)
    if (!refRes.ok) {
      const detail = await refRes.text()
      return NextResponse.json(
        { error: `Не удалось получить ветку ${base}: ${detail}` },
        { status: 502 },
      )
    }
    const refData = (await refRes.json()) as { object: { sha: string } }
    const baseSha = refData.object.sha

    // 2. Создаём новую ветку.
    const branchRes = await gh(token, `/repos/${owner}/${repo}/git/refs`, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }),
    })
    if (!branchRes.ok) {
      const detail = await branchRes.text()
      return NextResponse.json(
        { error: `Не удалось создать ветку: ${detail}` },
        { status: 502 },
      )
    }

    // 3. Коммитим файл с чек-листом правок.
    const path = `audit/fixes-${Date.now()}.md`
    const contentRes = await gh(
      token,
      `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
      {
        method: "PUT",
        body: JSON.stringify({
          message: title,
          content: Buffer.from(markdown, "utf-8").toString("base64"),
          branch,
        }),
      },
    )
    if (!contentRes.ok) {
      const detail = await contentRes.text()
      return NextResponse.json(
        { error: `Не удалось создать коммит: ${detail}` },
        { status: 502 },
      )
    }

    // 4. Открываем PR.
    const prRes = await gh(token, `/repos/${owner}/${repo}/pulls`, {
      method: "POST",
      body: JSON.stringify({ title, head: branch, base, body: prBody }),
    })
    if (!prRes.ok) {
      const detail = await prRes.text()
      return NextResponse.json(
        { error: `Не удалось открыть PR: ${detail}` },
        { status: 502 },
      )
    }
    const prData = (await prRes.json()) as { html_url: string; number: number }

    return NextResponse.json({
      mode: "created",
      url: prData.html_url,
      number: prData.number,
      branch,
      title,
      count: fixes.length,
    })
  } catch (err) {
    return NextResponse.json(
      { error: `Ошибка обращения к GitHub: ${(err as Error).message}` },
      { status: 500 },
    )
  }
}
