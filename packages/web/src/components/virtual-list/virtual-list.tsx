import * as React from "react"

import { cn } from "../../lib/utils"

export interface VirtualListProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: T[]
  itemHeight: number
  height: number
  overscan?: number
  renderItem: (item: T, index: number) => React.ReactNode
}

function VirtualListInner<T>(
  { className, items, itemHeight, height, overscan = 5, renderItem, ...props }: VirtualListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const [scrollTop, setScrollTop] = React.useState(0)

  const totalHeight = items.length * itemHeight
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleCount = Math.ceil(height / itemHeight) + overscan * 2
  const end = Math.min(items.length, start + visibleCount)
  const visibleItems = items.slice(start, end)

  return (
    <div
      ref={ref}
      className={cn("overflow-auto rounded-lg border", className)}
      style={{ height }}
      onScroll={(event) => setScrollTop((event.target as HTMLDivElement).scrollTop)}
      {...props}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${start * itemHeight}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={start + index} style={{ height: itemHeight }}>
              {renderItem(item, start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const VirtualList = React.forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof VirtualListInner>

export { VirtualList }
