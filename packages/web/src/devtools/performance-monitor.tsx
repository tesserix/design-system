import * as React from "react"

import { cn } from "../lib/utils"

export interface PerformanceMonitorProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

const PerformanceMonitor = React.forwardRef<HTMLDivElement, PerformanceMonitorProps>(
  ({ className, label = "Render", ...props }, ref) => {
    const renderCount = React.useRef(0)
    const lastRenderMs = React.useRef(0)

    const start = performance.now()
    renderCount.current += 1
    lastRenderMs.current = Number((performance.now() - start).toFixed(2))

    return (
      <div ref={ref} className={cn("rounded-lg border p-3 text-xs", className)} {...props}>
        <p className="font-medium">{label} Monitor</p>
        <p className="mt-1 text-muted-foreground">Render Count: {renderCount.current}</p>
        <p className="text-muted-foreground">Last Render: {lastRenderMs.current}ms</p>
      </div>
    )
  }
)
PerformanceMonitor.displayName = "PerformanceMonitor"

export { PerformanceMonitor }
