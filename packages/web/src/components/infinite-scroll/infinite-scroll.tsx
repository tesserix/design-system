import * as React from "react"

import { cn } from "../../lib/utils"

export interface InfiniteScrollProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  hasMore: boolean
  onLoadMore: () => void
  loading?: boolean
  loader?: React.ReactNode
  endMessage?: React.ReactNode
}

function InfiniteScrollInner<T>(
  {
    className,
    items,
    renderItem,
    hasMore,
    onLoadMore,
    loading = false,
    loader = <p className="py-2 text-sm text-muted-foreground">Loading...</p>,
    endMessage = <p className="py-2 text-sm text-muted-foreground">No more items</p>,
    ...props
  }: InfiniteScrollProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!hasMore || loading || !sentinelRef.current || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry?.isIntersecting) {
        onLoadMore()
      }
    })

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore])

  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {items.map((item, index) => (
        <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
      ))}
      <div ref={sentinelRef} />
      {loading ? loader : hasMore ? null : endMessage}
    </div>
  )
}

const InfiniteScroll = React.forwardRef(InfiniteScrollInner) as <T>(
  props: InfiniteScrollProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof InfiniteScrollInner>

export { InfiniteScroll }
