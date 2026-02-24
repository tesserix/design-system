import * as React from "react"

import { cn } from "../../lib/utils"

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8
}

const colMap: Record<NonNullable<GridProps["cols"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
}

const gapMap: Record<NonNullable<GridProps["gap"]>, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(({ className, cols = 3, gap = 4, ...props }, ref) => (
  <div ref={ref} className={cn("grid", colMap[cols], gapMap[gap], className)} {...props} />
))
Grid.displayName = "Grid"

export { Grid }
