export type Severity = "critical" | "warning" | "info"

export type DesignViolation = {
  id: string
  file: string
  line: number
  token: string
  category: "color" | "spacing" | "typography" | "radius" | "shadow"
  hardcoded: string
  expected: string
  severity: Severity
  snippet: string
}

export type A11yViolation = {
  id: string
  /** W3C WCAG success criterion, e.g. "1.4.3" */
  criterion: string
  rule: string
  level: "A" | "AA" | "AAA"
  file: string
  line: number
  severity: Severity
  description: string
  element: string
  fix: string
}

export const meta = {
  project: "acme-web-platform",
  branch: "feature/checkout-redesign",
  commit: "a1f9c3d",
  scannedFiles: 342,
  scannedAt: "31 июля 2026, 14:20",
  designScore: 78,
  a11yScore: 64,
}

export const designViolations: DesignViolation[] = [
  {
    id: "DS-001",
    file: "components/checkout/summary-card.tsx",
    line: 42,
    token: "color",
    category: "color",
    hardcoded: "#3b5bdb",
    expected: "var(--color-primary)",
    severity: "critical",
    snippet: 'className="bg-[#3b5bdb] text-white"',
  },
  {
    id: "DS-002",
    file: "components/checkout/summary-card.tsx",
    line: 58,
    token: "spacing",
    category: "spacing",
    hardcoded: "padding: 13px",
    expected: "space-3 (12px)",
    severity: "warning",
    snippet: "style={{ padding: '13px' }}",
  },
  {
    id: "DS-003",
    file: "components/ui/product-tile.tsx",
    line: 17,
    token: "radius",
    category: "radius",
    hardcoded: "border-radius: 7px",
    expected: "var(--radius-md)",
    severity: "info",
    snippet: 'className="rounded-[7px]"',
  },
  {
    id: "DS-004",
    file: "app/(marketing)/hero.tsx",
    line: 90,
    token: "typography",
    category: "typography",
    hardcoded: "font-size: 31px",
    expected: "text-3xl (30px)",
    severity: "warning",
    snippet: 'className="text-[31px] leading-[38px]"',
  },
  {
    id: "DS-005",
    file: "app/(marketing)/hero.tsx",
    line: 94,
    token: "color",
    category: "color",
    hardcoded: "rgb(17, 24, 39)",
    expected: "var(--color-foreground)",
    severity: "critical",
    snippet: "style={{ color: 'rgb(17, 24, 39)' }}",
  },
  {
    id: "DS-006",
    file: "components/nav/top-bar.tsx",
    line: 28,
    token: "shadow",
    category: "shadow",
    hardcoded: "0 2px 9px rgba(0,0,0,.14)",
    expected: "shadow-md (token)",
    severity: "info",
    snippet: 'className="shadow-[0_2px_9px_rgba(0,0,0,.14)]"',
  },
  {
    id: "DS-007",
    file: "components/forms/field.tsx",
    line: 63,
    token: "color",
    category: "color",
    hardcoded: "#e11d48",
    expected: "var(--color-critical)",
    severity: "warning",
    snippet: 'const errorColor = "#e11d48"',
  },
  {
    id: "DS-008",
    file: "components/checkout/pay-button.tsx",
    line: 12,
    token: "spacing",
    category: "spacing",
    hardcoded: "margin-top: 22px",
    expected: "space-5 (20px)",
    severity: "info",
    snippet: 'className="mt-[22px]"',
  },
]

export const a11yViolations: A11yViolation[] = [
  {
    id: "A11Y-001",
    criterion: "1.1.1",
    rule: "Non-text Content",
    level: "A",
    file: "components/gallery/thumb.tsx",
    line: 24,
    severity: "critical",
    description: "У изображения отсутствует атрибут alt.",
    element: "<img src={src} />",
    fix: "Добавьте описательный alt или alt=\"\" для декоративных изображений.",
  },
  {
    id: "A11Y-002",
    criterion: "1.4.3",
    rule: "Contrast (Minimum)",
    level: "AA",
    file: "app/(marketing)/hero.tsx",
    line: 102,
    severity: "critical",
    description: "Контраст текста к фону 2.9:1 — ниже минимума 4.5:1.",
    element: "text-zinc-400 on bg-white",
    fix: "Используйте более тёмный токен текста (--color-muted-foreground).",
  },
  {
    id: "A11Y-003",
    criterion: "4.1.2",
    rule: "Name, Role, Value",
    level: "A",
    file: "components/nav/menu-toggle.tsx",
    line: 15,
    severity: "warning",
    description: "Кнопка-иконка без доступного имени (aria-label).",
    element: "<button><MenuIcon /></button>",
    fix: "Добавьте aria-label=\"Открыть меню\" или текст в sr-only.",
  },
  {
    id: "A11Y-004",
    criterion: "2.4.6",
    rule: "Headings and Labels",
    level: "AA",
    file: "components/forms/field.tsx",
    line: 40,
    severity: "warning",
    description: "Поле ввода не связано с <label> через htmlFor/id.",
    element: "<input type=\"email\" />",
    fix: "Свяжите label и input через совпадающие id и htmlFor.",
  },
  {
    id: "A11Y-005",
    criterion: "2.1.1",
    rule: "Keyboard",
    level: "A",
    file: "components/modal/dialog.tsx",
    line: 71,
    severity: "critical",
    description: "Модальное окно не удерживает фокус (focus trap отсутствует).",
    element: "<div role=\"dialog\">",
    fix: "Реализуйте фокус-ловушку и возврат фокуса при закрытии.",
  },
  {
    id: "A11Y-006",
    criterion: "1.3.1",
    rule: "Info and Relationships",
    level: "A",
    file: "components/data/table.tsx",
    line: 33,
    severity: "info",
    description: "Таблица данных без <th scope> для заголовков столбцов.",
    element: "<td>Заголовок</td>",
    fix: "Используйте <th scope=\"col\"> для заголовков столбцов.",
  },
  {
    id: "A11Y-007",
    criterion: "2.4.4",
    rule: "Link Purpose (In Context)",
    level: "A",
    file: "components/footer/links.tsx",
    line: 19,
    severity: "info",
    description: "Ссылка «Подробнее» без контекста назначения.",
    element: "<a href=\"...\">Подробнее</a>",
    fix: "Добавьте контекст или aria-label с назначением ссылки.",
  },
]
