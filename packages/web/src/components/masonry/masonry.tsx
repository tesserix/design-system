import * as React from "react"

import { cn } from "../../lib/utils"

export interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[]
  columns?: 2 | 3 | 4 | 5
  gap?: number
}

const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  ({ className, items, columns = 3, gap = 16, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        style={{ columnCount: columns, columnGap: `${gap}px` }}
        {...props}
      >
        {items.map((item, index) => (
          <div key={index} className="mb-4 break-inside-avoid">
            {item}
          </div>
        ))}
      </div>
    )
  }
)
Masonry.displayName = "Masonry"

export { Masonry }
