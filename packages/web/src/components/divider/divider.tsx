import * as React from "react"

import { cn } from "../../lib/utils"
import { Separator, type SeparatorProps } from "../separator"

export interface DividerProps extends SeparatorProps {}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(({ className, ...props }, ref) => (
  <Separator ref={ref} className={cn(className)} {...props} />
))
Divider.displayName = "Divider"

export { Divider }
