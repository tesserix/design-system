import * as React from "react"

import { cn } from "../../lib/utils"

export interface JsonEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  value: object | string
  onChange?: (value: unknown) => void
  onValidationError?: (error: string | null) => void
  validateOnChange?: boolean
}

const toPrettyJson = (value: object | string): string => {
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      return value
    }
  }
  return JSON.stringify(value, null, 2)
}

const JsonEditor = React.forwardRef<HTMLDivElement, JsonEditorProps>(
  ({ className, value, onChange, onValidationError, validateOnChange = true, ...props }, ref) => {
    const [text, setText] = React.useState(() => toPrettyJson(value))
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
      setText(toPrettyJson(value))
    }, [value])

    const validate = (raw: string) => {
      try {
        const parsed = JSON.parse(raw)
        setError(null)
        onValidationError?.(null)
        onChange?.(parsed)
      } catch (validationError) {
        const message = validationError instanceof Error ? validationError.message : "Invalid JSON"
        setError(message)
        onValidationError?.(message)
      }
    }

    return (
      <div ref={ref} className={cn("space-y-2 rounded-xl border p-3", className)} {...props}>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border px-2 py-1 text-xs"
            onClick={() => {
              try {
                const pretty = JSON.stringify(JSON.parse(text), null, 2)
                setText(pretty)
                validate(pretty)
              } catch {
                validate(text)
              }
            }}
          >
            Format
          </button>
          <button
            type="button"
            className="rounded-md border px-2 py-1 text-xs"
            onClick={() => {
              try {
                const minified = JSON.stringify(JSON.parse(text))
                setText(minified)
                validate(minified)
              } catch {
                validate(text)
              }
            }}
          >
            Minify
          </button>
        </div>

        <textarea
          value={text}
          onChange={(event) => {
            const next = event.target.value
            setText(next)
            if (validateOnChange) {
              validate(next)
            }
          }}
          className="min-h-52 w-full rounded-md border border-input bg-background p-3 font-mono text-xs"
          spellCheck={false}
          aria-label="JSON editor"
        />

        <p className={cn("text-xs", error ? "text-destructive" : "text-primary")}>{error ?? "Valid JSON"}</p>
      </div>
    )
  }
)
JsonEditor.displayName = "JsonEditor"

export { JsonEditor }
