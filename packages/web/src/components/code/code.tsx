import * as React from "react"

import { cn } from "../../lib/utils"

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  block?: boolean
}

const Code = React.forwardRef<HTMLElement, CodeProps>(({ className, block = false, ...props }, ref) => {
  if (block) {
    return (
      <pre
        className={cn(
          "overflow-x-auto rounded-lg border bg-muted/60 p-4 font-mono text-sm text-foreground",
          className
        )}
      >
        <code ref={ref} {...props} />
      </pre>
    )
  }

  return (
    <code
      ref={ref}
      className={cn("rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground", className)}
      {...props}
    />
  )
})
Code.displayName = "Code"

export { Code }
