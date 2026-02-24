import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const bentoGridItemVariants = cva("rounded-2xl border bg-card text-card-foreground p-4 shadow-sm transition-shadow hover:shadow-md", {
  variants: {
    size: {
      sm: "md:col-span-1 md:row-span-1",
      md: "md:col-span-2 md:row-span-1",
      lg: "md:col-span-2 md:row-span-2",
      wide: "md:col-span-3 md:row-span-1",
      tall: "md:col-span-1 md:row-span-2",
      hero: "md:col-span-3 md:row-span-2",
    },
  },
  defaultVariants: {
    size: "sm",
  },
})

const BentoGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid grid-cols-1 gap-4 md:auto-rows-[140px] md:grid-cols-3", className)}
      {...props}
    />
  )
)
BentoGrid.displayName = "BentoGrid"

interface BentoGridItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoGridItemVariants> {}

const BentoGridItem = React.forwardRef<HTMLDivElement, BentoGridItemProps>(
  ({ className, size, ...props }, ref) => (
    <article ref={ref} className={cn(bentoGridItemVariants({ size }), className)} {...props} />
  )
)
BentoGridItem.displayName = "BentoGridItem"

const BentoGridItemTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-sm font-semibold tracking-tight", className)} {...props} />
  )
)
BentoGridItemTitle.displayName = "BentoGridItemTitle"

const BentoGridItemValue = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("mt-2 text-2xl font-semibold tracking-tight", className)} {...props} />
  )
)
BentoGridItemValue.displayName = "BentoGridItemValue"

const BentoGridItemMeta = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("mt-1 text-xs text-muted-foreground", className)} {...props} />
  )
)
BentoGridItemMeta.displayName = "BentoGridItemMeta"

export {
  BentoGrid,
  BentoGridItem,
  BentoGridItemTitle,
  BentoGridItemValue,
  BentoGridItemMeta,
  bentoGridItemVariants,
}
