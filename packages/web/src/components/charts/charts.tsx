import * as React from "react"

import { cn } from "../../lib/utils"

export interface ChartPoint {
  label: string
  value: number
}

export interface BaseChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ChartPoint[]
  height?: number
}

const BarChart = React.forwardRef<HTMLDivElement, BaseChartProps>(
  ({ className, data, height = 220, ...props }, ref) => {
    const max = Math.max(...data.map((point) => point.value), 1)

    return (
      <div ref={ref} className={cn("rounded-xl border p-4", className)} {...props}>
        <div className="flex items-end gap-3" style={{ height }}>
          {data.map((point) => {
            const barHeight = (point.value / max) * (height - 20)

            return (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-primary/80"
                  style={{ height: `${Math.max(barHeight, 4)}px` }}
                  title={`${point.label}: ${point.value}`}
                />
                <span className="text-xs text-muted-foreground">{point.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
BarChart.displayName = "BarChart"

const LineChart = React.forwardRef<HTMLDivElement, BaseChartProps>(
  ({ className, data, height = 220, ...props }, ref) => {
    const width = 520
    const max = Math.max(...data.map((point) => point.value), 1)

    const points = data
      .map((point, index) => {
        const x = (index / Math.max(data.length - 1, 1)) * width
        const y = height - (point.value / max) * (height - 20)
        return `${x},${y}`
      })
      .join(" ")

    return (
      <div ref={ref} className={cn("rounded-xl border p-4", className)} {...props}>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
          <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} className="text-primary" />
        </svg>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          {data.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      </div>
    )
  }
)
LineChart.displayName = "LineChart"

export { BarChart, LineChart }
