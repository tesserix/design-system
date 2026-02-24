import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const tooltipVariants = cva(
  "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-md animate-in fade-in-0 zoom-in-95 pointer-events-none",
  {
    variants: {
      side: {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
      },
    },
    defaultVariants: {
      side: "top",
    },
  }
)

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content" | "children">,
    VariantProps<typeof tooltipVariants> {
  content?: React.ReactNode
  children?: React.ReactNode
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, side, content, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const tooltipId = React.useId()

    return (
      <div className="relative inline-block" ref={ref} {...props}>
        <div
          aria-describedby={isVisible && content ? tooltipId : undefined}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          onFocus={() => setIsVisible(true)}
          onBlur={() => setIsVisible(false)}
        >
          {children}
        </div>
        {isVisible && (
          <div
            id={tooltipId}
            role="tooltip"
            className={cn(tooltipVariants({ side }), className)}
          >
            {content}
          </div>
        )}
      </div>
    )
  }
)
Tooltip.displayName = "Tooltip"

export { Tooltip, tooltipVariants }
