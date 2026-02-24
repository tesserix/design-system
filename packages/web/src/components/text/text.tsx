import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const textVariants = cva(
  "text-foreground",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
        destructive: "text-destructive",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      size: "base",
      variant: "default",
      weight: "normal",
    },
  }
)

type TextElement = "p" | "span" | "div" | "label"

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "as">,
    VariantProps<typeof textVariants> {
  as?: TextElement
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, size, variant, weight, as: Comp = "p", ...props }, ref) => {
    return (
      <Comp
        className={cn(textVariants({ size, variant, weight }), className)}
        ref={ref as never}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

export { Text, textVariants }
