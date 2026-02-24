import * as React from "react"

import { cn } from "../../lib/utils"

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number
  max?: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ className, value = 0, max = 5, onChange, readonly = false, size = "md", ...props }, ref) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null)

    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        role="img"
        aria-label={`Rating: ${value} out of ${max} stars`}
        {...props}
      >
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1
          const isFilled = hoverValue !== null ? starValue <= hoverValue : starValue <= value

          return (
            <button
              key={index}
              type="button"
              className={cn(
                "transition-colors",
                !readonly && "cursor-pointer hover:scale-110",
                readonly && "cursor-default"
              )}
              onClick={() => !readonly && onChange?.(starValue)}
              onMouseEnter={() => !readonly && setHoverValue(starValue)}
              onMouseLeave={() => !readonly && setHoverValue(null)}
              disabled={readonly}
              aria-label={`Rate ${starValue} star${starValue !== 1 ? "s" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isFilled ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  sizeClasses[size],
                  isFilled ? "text-primary" : "text-muted-foreground/50"
                )}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          )
        })}
      </div>
    )
  }
)
Rating.displayName = "Rating"

export { Rating }
