import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const headingVariants = cva(
  "font-bold tracking-tight text-foreground",
  {
    variants: {
      size: {
        h1: "text-4xl md:text-5xl lg:text-6xl",
        h2: "text-3xl md:text-4xl lg:text-5xl",
        h3: "text-2xl md:text-3xl lg:text-4xl",
        h4: "text-xl md:text-2xl lg:text-3xl",
        h5: "text-lg md:text-xl",
        h6: "text-base md:text-lg",
      },
    },
    defaultVariants: {
      size: "h1",
    },
  }
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const headingElements = ["h1", "h2", "h3", "h4", "h5", "h6"] as const
type HeadingElement = (typeof headingElements)[number]

const isHeadingElement = (value: unknown): value is HeadingElement =>
  typeof value === "string" && (headingElements as readonly string[]).includes(value)

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, as, ...props }, ref) => {
    const derivedTag = isHeadingElement(size) ? size : undefined
    const Comp = as || derivedTag || "h1"
    const variantSize: HeadingElement = size ?? as ?? "h1"

    return (
      <Comp
        className={cn(headingVariants({ size: variantSize }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

export { Heading, headingVariants }
