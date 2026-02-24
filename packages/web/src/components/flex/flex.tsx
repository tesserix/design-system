import * as React from "react"

import { cn } from "../../lib/utils"

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col"
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8
  wrap?: boolean
}

const directionMap: Record<NonNullable<FlexProps["direction"]>, string> = {
  row: "flex-row",
  col: "flex-col",
}

const alignMap: Record<NonNullable<FlexProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
}

const justifyMap: Record<NonNullable<FlexProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
}

const gapMap: Record<NonNullable<FlexProps["gap"]>, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction = "row", align = "center", justify = "start", gap = 2, wrap = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex",
        directionMap[direction],
        alignMap[align],
        justifyMap[justify],
        gapMap[gap],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    />
  )
)
Flex.displayName = "Flex"

export { Flex }
