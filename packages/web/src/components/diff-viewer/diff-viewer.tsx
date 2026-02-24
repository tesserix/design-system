import * as React from "react"

import { cn } from "../../lib/utils"

interface DiffLine {
  left?: string
  right?: string
  type: "added" | "removed" | "modified" | "unchanged"
}

export interface DiffViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  oldValue: string
  newValue: string
  view?: "split" | "unified"
  showLineNumbers?: boolean
}

const getDiffLines = (oldValue: string, newValue: string): DiffLine[] => {
  const leftLines = oldValue.split("\n")
  const rightLines = newValue.split("\n")
  const length = Math.max(leftLines.length, rightLines.length)
  const lines: DiffLine[] = []

  for (let index = 0; index < length; index += 1) {
    const left = leftLines[index]
    const right = rightLines[index]

    if (left === undefined) {
      lines.push({ right, type: "added" })
    } else if (right === undefined) {
      lines.push({ left, type: "removed" })
    } else if (left === right) {
      lines.push({ left, right, type: "unchanged" })
    } else {
      lines.push({ left, right, type: "modified" })
    }
  }

  return lines
}

const lineClassName = (type: DiffLine["type"]) => {
  if (type === "added") return "bg-primary/10"
  if (type === "removed") return "bg-destructive/10"
  if (type === "modified") return "bg-accent"
  return ""
}

const DiffViewer = React.forwardRef<HTMLDivElement, DiffViewerProps>(
  ({ className, oldValue, newValue, view = "split", showLineNumbers = true, ...props }, ref) => {
    const lines = React.useMemo(() => getDiffLines(oldValue, newValue), [oldValue, newValue])

    return (
      <div ref={ref} className={cn("overflow-hidden rounded-lg border", className)} {...props}>
        <div className="grid grid-cols-1 bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground md:grid-cols-2">
          <span>Old</span>
          {view === "split" ? <span>New</span> : null}
        </div>

        {view === "split" ? (
          <div className="divide-y">
            {lines.map((line, index) => (
              <div key={index} className={cn("grid grid-cols-1 md:grid-cols-2", lineClassName(line.type))}>
                <pre className="overflow-x-auto border-r px-3 py-1.5 text-xs">
                  {showLineNumbers ? `${index + 1} ` : ""}
                  {line.type === "added" ? "" : line.left ?? ""}
                </pre>
                <pre className="overflow-x-auto px-3 py-1.5 text-xs">
                  {showLineNumbers ? `${index + 1} ` : ""}
                  {line.type === "removed" ? "" : line.right ?? ""}
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {lines.map((line, index) => (
              <pre key={index} className={cn("overflow-x-auto px-3 py-1.5 text-xs", lineClassName(line.type))}>
                {showLineNumbers ? `${index + 1} ` : ""}
                {line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  "}
                {line.right ?? line.left ?? ""}
              </pre>
            ))}
          </div>
        )}
      </div>
    )
  }
)
DiffViewer.displayName = "DiffViewer"

export { DiffViewer }
