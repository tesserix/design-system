import * as React from "react"

import { cn } from "../../lib/utils"

export interface MarkdownEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
}

const renderMarkdown = (text: string) => {
  return text
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br />")
}

const MarkdownEditor = React.forwardRef<HTMLDivElement, MarkdownEditorProps>(
  ({ className, value: controlledValue, defaultValue = "", onValueChange, placeholder = "# Title", ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const value = controlledValue ?? internalValue

    const setValue = (nextValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(nextValue)
      }
      onValueChange?.(nextValue)
    }

    return (
      <div ref={ref} className={cn("grid gap-3 md:grid-cols-2", className)} {...props}>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="min-h-56 rounded-xl border-2 border-input bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
        />
        <div className="min-h-56 rounded-xl border bg-card p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Preview</p>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />
        </div>
      </div>
    )
  }
)
MarkdownEditor.displayName = "MarkdownEditor"

export { MarkdownEditor }
