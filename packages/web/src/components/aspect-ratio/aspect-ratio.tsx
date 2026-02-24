import * as React from "react"

import { cn } from "../../lib/utils"

export interface AspectRatioProps extends React.ComponentPropsWithoutRef<"div"> {
  ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = 1, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      style={{ paddingBottom: `${100 / ratio}%` }}
      {...props}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  )
)
AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
