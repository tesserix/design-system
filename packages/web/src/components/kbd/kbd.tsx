import * as React from "react"

import { cn } from "../../lib/utils"

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => (
  <kbd
    ref={ref}
    className={cn(
      "inline-flex min-h-5 items-center rounded border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground",
      className
    )}
    {...props}
  />
))
Kbd.displayName = "Kbd"

export { Kbd }
