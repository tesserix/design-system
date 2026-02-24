import * as React from "react"

import { cn } from "../../lib/utils"

export interface PropertyPanelField {
  id: string
  label: string
  type?: "text" | "number" | "select"
  editable?: boolean
  options?: { label: string; value: string }[]
}

export interface PropertyPanelSection {
  id: string
  title: string
  fields: PropertyPanelField[]
}

export interface PropertyPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  sections: PropertyPanelSection[]
  value: Record<string, string>
  onValueChange?: (nextValue: Record<string, string>) => void
  onSave?: (nextValue: Record<string, string>) => void
  onCancel?: () => void
}

const PropertyPanel = React.forwardRef<HTMLDivElement, PropertyPanelProps>(
  ({
    className,
    title = "Properties",
    sections,
    value,
    onValueChange,
    onSave,
    onCancel,
    ...props
  }, ref) => {
    const [draft, setDraft] = React.useState(value)

    React.useEffect(() => {
      setDraft(value)
    }, [value])

    const updateField = (fieldId: string, fieldValue: string) => {
      const next = { ...draft, [fieldId]: fieldValue }
      setDraft(next)
      onValueChange?.(next)
    }

    return (
      <aside ref={ref} className={cn("w-full space-y-4 rounded-xl border bg-card p-4", className)} {...props}>
        <h2 className="text-base font-semibold">{title}</h2>

        {sections.map((section) => (
          <section key={section.id} className="space-y-3 rounded-lg border p-3">
            <h3 className="text-sm font-semibold">{section.title}</h3>
            {section.fields.map((field) => {
              const fieldValue = draft[field.id] ?? ""
              return (
                <label key={field.id} className="block space-y-1 text-sm">
                  <span className="text-muted-foreground">{field.label}</span>
                  {field.editable ? (
                    field.type === "select" ? (
                      <select
                        value={fieldValue}
                        onChange={(event) => updateField(field.id, event.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                      >
                        <option value="">Select</option>
                        {(field.options ?? []).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : "text"}
                        value={fieldValue}
                        onChange={(event) => updateField(field.id, event.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                      />
                    )
                  ) : (
                    <div className="rounded-md border border-dashed bg-muted/30 px-2 py-1.5 text-sm">{fieldValue || "-"}</div>
                  )}
                </label>
              )
            })}
          </section>
        ))}

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
            onClick={() => onSave?.(draft)}
          >
            Save
          </button>
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-sm"
            onClick={() => {
              setDraft(value)
              onCancel?.()
            }}
          >
            Cancel
          </button>
        </div>
      </aside>
    )
  }
)
PropertyPanel.displayName = "PropertyPanel"

export { PropertyPanel }
