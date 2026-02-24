import * as React from "react"

import { cn } from "../../lib/utils"

export interface FilterOption {
  id: string
  label: string
}

export interface FilterSection {
  id: string
  label: string
  options: FilterOption[]
}

export interface FilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  sections: FilterSection[]
  value?: Record<string, string[]>
  onValueChange?: (value: Record<string, string[]>) => void
  onApply?: (value: Record<string, string[]>) => void
  onReset?: () => void
}

const FilterPanel = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  ({ className, sections, value, onValueChange, onApply, onReset, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<Record<string, string[]>>(value ?? {})

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value)
      }
    }, [value])

    const toggle = (sectionId: string, optionId: string) => {
      const sectionValues = internalValue[sectionId] ?? []
      const nextValues = sectionValues.includes(optionId)
        ? sectionValues.filter((id) => id !== optionId)
        : [...sectionValues, optionId]

      const next = { ...internalValue, [sectionId]: nextValues }
      setInternalValue(next)
      onValueChange?.(next)
    }

    return (
      <div ref={ref} className={cn("space-y-4 rounded-xl border p-4", className)} {...props}>
        {sections.map((section) => (
          <fieldset key={section.id} className="space-y-2">
            <legend className="text-sm font-semibold">{section.label}</legend>
            {section.options.map((option) => {
              const checked = (internalValue[section.id] ?? []).includes(option.id)
              return (
                <label key={option.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={checked} onChange={() => toggle(section.id, option.id)} />
                  <span>{option.label}</span>
                </label>
              )
            })}
          </fieldset>
        ))}

        <div className="flex gap-2">
          <button type="button" className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground" onClick={() => onApply?.(internalValue)}>
            Apply
          </button>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm"
            onClick={() => {
              setInternalValue({})
              onReset?.()
            }}
          >
            Reset
          </button>
        </div>
      </div>
    )
  }
)
FilterPanel.displayName = "FilterPanel"

export { FilterPanel }
