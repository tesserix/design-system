import * as React from "react"

import { cn } from "../../lib/utils"

export interface ComponentPlaygroundProps extends React.HTMLAttributes<HTMLDivElement> {
  initialCode?: string
  title?: string
  preview: React.ReactNode
}

const ComponentPlayground = React.forwardRef<HTMLDivElement, ComponentPlaygroundProps>(
  ({ className, title = "Component Playground", initialCode = "", preview, ...props }, ref) => {
    const [code, setCode] = React.useState(initialCode)

    return (
      <div ref={ref} className={cn("grid gap-3 rounded-xl border p-4 md:grid-cols-2", className)} {...props}>
        <section>
          <h3 className="mb-2 text-sm font-semibold">{title}</h3>
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="min-h-56 w-full rounded-lg border bg-background p-3 font-mono text-xs"
          />
        </section>
        <section>
          <h3 className="mb-2 text-sm font-semibold">Preview</h3>
          <div className="rounded-lg border bg-card p-4">{preview}</div>
        </section>
      </div>
    )
  }
)
ComponentPlayground.displayName = "ComponentPlayground"

export { ComponentPlayground }
