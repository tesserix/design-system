import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const calloutVariants = cva("rounded-lg border p-4", {
  variants: {
    variant: {
      default: "border-border bg-card text-card-foreground",
      info: "border-primary/30 bg-primary/10 text-primary",
      success: "border-primary/30 bg-primary/10 text-primary",
      warning: "border-accent bg-accent text-accent-foreground",
      destructive: "border-destructive/40 bg-destructive/10 text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} role="status" className={cn(calloutVariants({ variant }), className)} {...props} />
  )
)
Callout.displayName = "Callout"

const CalloutTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
  )
)
CalloutTitle.displayName = "CalloutTitle"

const CalloutDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("mt-1 text-sm opacity-90", className)} {...props} />
))
CalloutDescription.displayName = "CalloutDescription"

export { Callout, CalloutTitle, CalloutDescription, calloutVariants }
