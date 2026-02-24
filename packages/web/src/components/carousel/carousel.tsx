import * as React from "react"

import { cn } from "../../lib/utils"

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[]
  autoplay?: boolean
  interval?: number
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, items, autoplay = false, interval = 4000, ...props }, ref) => {
    const [index, setIndex] = React.useState(0)

    const next = React.useCallback(() => {
      setIndex((current) => (current + 1) % Math.max(items.length, 1))
    }, [items.length])

    const prev = () => {
      setIndex((current) => (current - 1 + items.length) % Math.max(items.length, 1))
    }

    React.useEffect(() => {
      if (!autoplay || items.length <= 1) return
      const id = window.setInterval(next, interval)
      return () => window.clearInterval(id)
    }, [autoplay, interval, items.length, next])

    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        <div className="relative overflow-hidden rounded-xl border">
          <div className="min-h-48">{items[index]}</div>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <button type="button" className="rounded-lg border px-3 py-1.5 text-sm" onClick={prev}>
            Previous
          </button>
          <div className="flex items-center justify-center gap-2 px-2">
            {items.map((_, dot) => (
              <button
                key={dot}
                type="button"
                aria-label={`Go to slide ${dot + 1}`}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors",
                  dot === index ? "bg-primary" : "bg-muted"
                )}
                onClick={() => setIndex(dot)}
              />
            ))}
          </div>
          <button type="button" className="rounded-lg border px-3 py-1.5 text-sm" onClick={next}>
            Next
          </button>
        </div>
      </div>
    )
  }
)
Carousel.displayName = "Carousel"

export { Carousel }
