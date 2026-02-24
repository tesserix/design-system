import * as React from "react"

import { cn } from "../../lib/utils"

export interface FilterBuilderField {
  id: string
  label: string
  type?: "text" | "number" | "select"
  options?: { label: string; value: string }[]
}

export interface FilterBuilderRule {
  id: string
  fieldId: string
  operator: "equals" | "contains" | "not_equals" | "gt" | "lt"
  value: string
}

export interface FilterBuilderValue {
  combinator: "AND" | "OR"
  rules: FilterBuilderRule[]
}

export interface FilterBuilderProps extends React.HTMLAttributes<HTMLDivElement> {
  fields: FilterBuilderField[]
  value?: FilterBuilderValue
  onValueChange?: (value: FilterBuilderValue) => void
}

const defaultValue: FilterBuilderValue = {
  combinator: "AND",
  rules: [],
}

const createRule = (fieldId: string): FilterBuilderRule => ({
  id: Math.random().toString(36).slice(2, 10),
  fieldId,
  operator: "equals",
  value: "",
})

const FilterBuilder = React.forwardRef<HTMLDivElement, FilterBuilderProps>(
  ({ className, fields, value, onValueChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<FilterBuilderValue>(value ?? defaultValue)

    React.useEffect(() => {
      if (value) setInternalValue(value)
    }, [value])

    const emit = (next: FilterBuilderValue) => {
      setInternalValue(next)
      onValueChange?.(next)
    }

    const updateRule = (ruleId: string, updates: Partial<FilterBuilderRule>) => {
      emit({
        ...internalValue,
        rules: internalValue.rules.map((rule) =>
          rule.id === ruleId ? { ...rule, ...updates } : rule
        ),
      })
    }

    const removeRule = (ruleId: string) => {
      emit({ ...internalValue, rules: internalValue.rules.filter((rule) => rule.id !== ruleId) })
    }

    const firstField = fields[0]?.id ?? ""

    return (
      <div ref={ref} className={cn("space-y-3 rounded-xl border p-4", className)} {...props}>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-medium" htmlFor="combinator">
            Match
          </label>
          <select
            id="combinator"
            value={internalValue.combinator}
            onChange={(event) =>
              emit({ ...internalValue, combinator: event.target.value as "AND" | "OR" })
            }
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="AND">All rules (AND)</option>
            <option value="OR">Any rule (OR)</option>
          </select>
        </div>

        {internalValue.rules.map((rule) => {
          const selectedField = fields.find((field) => field.id === rule.fieldId)
          return (
            <div key={rule.id} className="grid grid-cols-1 gap-2 rounded-md border p-3 md:grid-cols-[1fr_auto_1fr_auto]">
              <select
                value={rule.fieldId}
                onChange={(event) => updateRule(rule.id, { fieldId: event.target.value })}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                aria-label="Field"
              >
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.label}
                  </option>
                ))}
              </select>

              <select
                value={rule.operator}
                onChange={(event) =>
                  updateRule(rule.id, {
                    operator: event.target.value as FilterBuilderRule["operator"],
                  })
                }
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                aria-label="Operator"
              >
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="not_equals">Not equals</option>
                <option value="gt">Greater than</option>
                <option value="lt">Less than</option>
              </select>

              {selectedField?.type === "select" ? (
                <select
                  value={rule.value}
                  onChange={(event) => updateRule(rule.id, { value: event.target.value })}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                  aria-label="Value"
                >
                  <option value="">Select value</option>
                  {(selectedField.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={selectedField?.type === "number" ? "number" : "text"}
                  value={rule.value}
                  onChange={(event) => updateRule(rule.id, { value: event.target.value })}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                  placeholder="Value"
                  aria-label="Value"
                />
              )}

              <button
                type="button"
                onClick={() => removeRule(rule.id)}
                className="rounded-md border px-3 text-sm"
              >
                Remove
              </button>
            </div>
          )
        })}

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
            onClick={() => emit({ ...internalValue, rules: [...internalValue.rules, createRule(firstField)] })}
            disabled={!firstField}
          >
            Add Rule
          </button>
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-sm"
            onClick={() => emit({ ...internalValue, rules: [] })}
          >
            Clear
          </button>
        </div>
      </div>
    )
  }
)
FilterBuilder.displayName = "FilterBuilder"

export { FilterBuilder }
