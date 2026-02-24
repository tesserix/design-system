import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-secondary text-secondary-foreground",
        primary: "border-transparent bg-primary text-primary-foreground",
        success: "border-transparent bg-primary text-primary-foreground",
        warning: "border-transparent bg-accent text-accent-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "border-border bg-background text-foreground",
      },
      size: {
        sm: "h-5 px-2 text-[11px]",
        md: "h-6 px-2.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  onRemove?: () => void
  removeLabel?: string
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant, size, onRemove, removeLabel = "Remove tag", children, ...props }, ref) => (
    <div ref={ref} className={cn(tagVariants({ variant, size }), className)} {...props}>
      <span>{children}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="inline-flex h-4 w-4 items-center justify-center rounded-full text-current/80 transition-colors hover:bg-black/10 hover:text-current"
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  )
)
Tag.displayName = "Tag"

const Chip = Tag

export { Tag, Chip, tagVariants }
