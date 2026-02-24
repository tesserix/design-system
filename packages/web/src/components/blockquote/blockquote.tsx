import * as React from "react"

import { cn } from "../../lib/utils"

export interface BlockquoteProps extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {}

const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn(
        "border-l-2 border-primary/40 pl-4 italic text-muted-foreground [&_cite]:mt-2 [&_cite]:block [&_cite]:text-sm [&_cite]:not-italic",
        className
      )}
      {...props}
    />
  )
)
Blockquote.displayName = "Blockquote"

export { Blockquote }
