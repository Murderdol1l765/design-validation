"use client"

import { Check } from "lucide-react"

export function FixCheckbox({
  id,
  checked,
  onChange,
  label,
}: {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <label
      htmlFor={`fix-${id}`}
      className="flex shrink-0 cursor-pointer items-center gap-1.5 select-none"
    >
      <span className="relative flex size-5 items-center justify-center">
        <input
          id={`fix-${id}`}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={label}
          className="peer size-5 cursor-pointer appearance-none rounded-md border border-border bg-card transition-colors checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
        <Check
          className="pointer-events-none absolute size-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100"
          aria-hidden="true"
          strokeWidth={3}
        />
      </span>
      <span className="text-[11px] font-medium text-muted-foreground peer-checked:text-primary">
        В PR
      </span>
    </label>
  )
}
