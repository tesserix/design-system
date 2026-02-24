import * as React from "react"

import { cn } from "../../lib/utils"

export interface RichTextEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
}

const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ className, value: controlledValue, defaultValue = "", onValueChange, placeholder = "Write...", ...props }, ref) => {
    const editorRef = React.useRef<HTMLDivElement>(null)
    const [internalValue, setInternalValue] = React.useState(defaultValue)

    React.useImperativeHandle(ref, () => editorRef.current as HTMLDivElement)

    const value = controlledValue ?? internalValue

    React.useEffect(() => {
      if (!editorRef.current) return
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value
      }
    }, [value])

    const setValue = (nextValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(nextValue)
      }
      onValueChange?.(nextValue)
    }

    const runCommand = (command: "bold" | "italic" | "underline") => {
      document.execCommand(command)
      setValue(editorRef.current?.innerHTML ?? "")
      editorRef.current?.focus()
    }

    return (
      <div ref={ref} className={cn("rounded-xl border", className)} {...props}>
        <div className="flex items-center gap-2 border-b p-2">
          <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => runCommand("bold")}>B</button>
          <button type="button" className="rounded border px-2 py-1 text-xs italic" onClick={() => runCommand("italic")}>I</button>
          <button type="button" className="rounded border px-2 py-1 text-xs underline" onClick={() => runCommand("underline")}>U</button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          data-placeholder={placeholder}
          className="min-h-40 p-3 text-sm outline-none empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
          onInput={(event) => setValue((event.target as HTMLDivElement).innerHTML)}
          suppressContentEditableWarning
        />
      </div>
    )
  }
)
RichTextEditor.displayName = "RichTextEditor"

export { RichTextEditor }
