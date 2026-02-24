import * as React from "react"

import { cn } from "../../lib/utils"

const Timeline = React.forwardRef<HTMLOListElement, React.OlHTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => (
    <ol ref={ref} className={cn("relative space-y-6", className)} {...props} />
  )
)
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("relative pl-10", className)} {...props} />
  )
)
TimelineItem.displayName = "TimelineItem"

export interface TimelineMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
}

const TimelineMarker = React.forwardRef<HTMLDivElement, TimelineMarkerProps>(
  ({ className, active = false, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "absolute left-0 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-background",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
TimelineMarker.displayName = "TimelineMarker"

const TimelineConnector = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn("absolute left-[9px] top-7 h-[calc(100%-1rem)] w-px bg-border", className)}
      {...props}
    />
  )
)
TimelineConnector.displayName = "TimelineConnector"

const TimelineTime = React.forwardRef<HTMLTimeElement, React.TimeHTMLAttributes<HTMLTimeElement>>(
  ({ className, ...props }, ref) => (
    <time ref={ref} className={cn("text-xs font-medium uppercase tracking-wide text-muted-foreground", className)} {...props} />
  )
)
TimelineTime.displayName = "TimelineTime"

const TimelineTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4 ref={ref} className={cn("mt-1 text-sm font-semibold text-card-foreground", className)} {...props} />
  )
)
TimelineTitle.displayName = "TimelineTitle"

const TimelineDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("mt-1 text-sm text-muted-foreground", className)} {...props} />
  )
)
TimelineDescription.displayName = "TimelineDescription"

export {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineConnector,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
}
