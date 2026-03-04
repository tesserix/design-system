import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "../button"

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
  onRetry?: () => void
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ className, message = "Something went wrong", onRetry, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-12 text-center",
          className
        )}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-destructive mb-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
        <p className="text-muted-foreground mb-4">{message}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    )
  }
)
ErrorState.displayName = "ErrorState"

export { ErrorState }
