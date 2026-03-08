'use client';

import * as React from "react"
import { cn } from "../../lib/utils"
import { Button } from "../button"

type ErrorType =
  | 'access_denied'
  | 'not_found'
  | 'forbidden'
  | 'server_error'
  | 'permission_denied'
  | 'network_error'
  | 'timeout'
  | 'requires_auth'
  | 'custom'

interface ErrorStateConfig {
  iconPath: string
  iconBgColor: string
  iconColor: string
  title: string
  description: string
  suggestions?: string[]
}

const ERROR_CONFIGS: Record<Exclude<ErrorType, 'custom'>, ErrorStateConfig> = {
  access_denied: {
    iconPath: 'M3 3l18 18M10.5 10.677a2 2 0 0 0 2.823 2.823M7.362 7.561A10 10 0 0 0 12 20c7 0 10-7 10-7a18.6 18.6 0 0 0-3.362-4.561M9.88 9.88a3 3 0 1 0 4.24 4.24M1 1l22 22',
    iconBgColor: 'bg-error-muted',
    iconColor: 'text-error',
    title: 'Access Denied',
    description: "You don't have permission to access this resource.",
    suggestions: [
      "Verify you're logged in with the correct account",
      'Contact your administrator to request access',
      'Check if your session has expired',
    ],
  },
  permission_denied: {
    iconPath: 'M16.5 9.4 7.55 4.24M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    iconBgColor: 'bg-warning-muted',
    iconColor: 'text-warning',
    title: 'Permission Required',
    description: 'You need additional permissions to view this content.',
    suggestions: [
      'Ask your administrator to grant you access',
      'You may need a higher role to view this area',
    ],
  },
  not_found: {
    iconPath: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z M14 2v4a2 2 0 0 0 2 2h4 M9.5 12.5l5 5 M14.5 12.5l-5 5',
    iconBgColor: 'bg-muted',
    iconColor: 'text-muted-foreground',
    title: 'Not Found',
    description: "The resource you're looking for doesn't exist or has been moved.",
    suggestions: [
      'Check the URL for typos',
      'The item may have been deleted',
      'Try searching for it',
    ],
  },
  forbidden: {
    iconPath: 'M16.5 9.4 7.55 4.24M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    iconBgColor: 'bg-error-muted',
    iconColor: 'text-error',
    title: 'Forbidden',
    description: 'You are not authorized to access this area.',
    suggestions: [
      'This area is restricted to specific roles',
      'Contact your administrator for access',
    ],
  },
  server_error: {
    iconPath: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z',
    iconBgColor: 'bg-primary/10',
    iconColor: 'text-primary',
    title: 'Something Went Wrong',
    description: 'We encountered an unexpected error while processing your request.',
    suggestions: [
      'Try refreshing the page',
      'Wait a moment and try again',
      'If the problem persists, contact support',
    ],
  },
  network_error: {
    iconPath: 'M2 8.82a15 15 0 0 1 20 0M5 12.859a10 10 0 0 1 14 0M8.5 16.429a5 5 0 0 1 7 0M12 20h.01 M2 2l20 20',
    iconBgColor: 'bg-warning-muted',
    iconColor: 'text-warning',
    title: 'Connection Problem',
    description: 'Unable to connect to the server. Please check your internet connection.',
    suggestions: [
      'Check your internet connection',
      "Try disabling VPN if you're using one",
      'The server may be temporarily unavailable',
    ],
  },
  timeout: {
    iconPath: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2',
    iconBgColor: 'bg-warning-muted',
    iconColor: 'text-warning',
    title: 'Request Timed Out',
    description: 'The server took too long to respond.',
    suggestions: [
      'Try again in a few moments',
      'The server may be experiencing high load',
      'Check your network connection',
    ],
  },
  requires_auth: {
    iconPath: 'M16.5 9.4 7.55 4.24M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    iconBgColor: 'bg-primary/10',
    iconColor: 'text-primary',
    title: 'Authentication Required',
    description: 'You need to be logged in to access this area.',
    suggestions: [
      'Please log in to continue',
      'Your session may have expired',
    ],
  },
}

interface ErrorStateAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'outline' | 'ghost'
}

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: ErrorType
  title?: string
  description?: string
  message?: string
  actions?: ErrorStateAction[]
  showHomeButton?: boolean
  showRetryButton?: boolean
  onRetry?: () => void
  onGoHome?: () => void
  compact?: boolean
  code?: string
  details?: string
  suggestions?: string[]
  showSuggestions?: boolean
}

function detectErrorType(error: string | Error | unknown): ErrorType {
  const message = error instanceof Error ? error.message : String(error || '')
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('failed to fetch')) {
    return 'network_error'
  }
  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return 'timeout'
  }
  if (lowerMessage.includes('401') || lowerMessage.includes('unauthorized') || lowerMessage.includes('not authenticated')) {
    return 'requires_auth'
  }
  if (lowerMessage.includes('403') || lowerMessage.includes('forbidden') || lowerMessage.includes('access denied')) {
    return 'access_denied'
  }
  if (lowerMessage.includes('404') || lowerMessage.includes('not found')) {
    return 'not_found'
  }
  if (lowerMessage.includes('permission')) {
    return 'permission_denied'
  }
  return 'server_error'
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      className,
      type = 'server_error',
      title,
      description,
      message,
      actions = [],
      showHomeButton = false,
      showRetryButton = false,
      onRetry,
      onGoHome,
      compact = false,
      code,
      details,
      suggestions,
      showSuggestions = true,
      ...props
    },
    ref
  ) => {
    const [showDetails, setShowDetails] = React.useState(false)
    const [copied, setCopied] = React.useState(false)

    const config = type !== 'custom' ? ERROR_CONFIGS[type] : null

    const finalTitle = title || config?.title || 'Error'
    const finalDescription = description || message || config?.description || 'An error occurred.'
    const finalIconBgColor = config?.iconBgColor || 'bg-muted'
    const finalIconColor = config?.iconColor || 'text-muted-foreground'
    const finalSuggestions = suggestions || (showSuggestions ? config?.suggestions : undefined)

    const handleGoHome = () => {
      if (onGoHome) {
        onGoHome()
      } else if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }

    const handleRetry = () => {
      if (onRetry) {
        onRetry()
      } else if (typeof window !== 'undefined') {
        window.location.reload()
      }
    }

    const handleCopyDetails = async () => {
      const detailsText = [
        `Error: ${finalTitle}`,
        `Message: ${finalDescription}`,
        code ? `Code: ${code}` : null,
        details ? `Details: ${details}` : null,
        `Timestamp: ${new Date().toISOString()}`,
        typeof window !== 'undefined' ? `URL: ${window.location.href}` : null,
      ].filter(Boolean).join('\n')

      try {
        await navigator.clipboard.writeText(detailsText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // Fallback for older browsers
      }
    }

    // Simple warning triangle SVG
    const WarningIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
        <path d="M12 9v4"/>
        <path d="M12 17h.01"/>
      </svg>
    )

    if (compact) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex flex-col items-center justify-center py-12 px-6',
            className
          )}
          {...props}
        >
          <div className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center mb-4',
            finalIconBgColor
          )}>
            <span className={cn('h-7 w-7', finalIconColor)}><WarningIcon /></span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1.5">{finalTitle}</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs">{finalDescription}</p>
          {code && (
            <p className="mt-2 text-xs text-muted-foreground/60 font-mono">
              Error code: {code}
            </p>
          )}
          {(actions.length > 0 || showRetryButton || showHomeButton) && (
            <div className="flex items-center gap-2 mt-4">
              {showRetryButton && (
                <Button size="sm" variant="outline" onClick={handleRetry}>
                  Retry
                </Button>
              )}
              {showHomeButton && (
                <Button size="sm" variant="ghost" onClick={handleGoHome}>
                  Home
                </Button>
              )}
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'min-h-[60vh] flex items-center justify-center p-8',
          className
        )}
        {...props}
      >
        <div className="max-w-lg w-full">
          <div className="bg-card rounded-2xl shadow-xl border border-border p-8 text-center">
            <div className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6',
              finalIconBgColor
            )}>
              <span className={cn('h-10 w-10', finalIconColor)}><WarningIcon /></span>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-3">{finalTitle}</h2>
            <p className="text-muted-foreground mb-2">{finalDescription}</p>

            {code && (
              <p className="text-xs text-muted-foreground/60 font-mono mt-2">
                Error code: {code}
              </p>
            )}

            {finalSuggestions && finalSuggestions.length > 0 && (
              <div className="mt-6 bg-muted/50 rounded-lg p-4 text-left">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  What you can try
                </div>
                <ul className="space-y-1.5">
                  {finalSuggestions.map((suggestion, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">&#8226;</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(actions.length > 0 || showRetryButton || showHomeButton) && (
              <div className="space-y-3 mt-6">
                {showRetryButton && (
                  <Button
                    className="w-full h-12"
                    onClick={handleRetry}
                  >
                    Try Again
                  </Button>
                )}
                {showHomeButton && (
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    onClick={handleGoHome}
                  >
                    Go to Dashboard
                  </Button>
                )}
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'outline'}
                    className="w-full h-12"
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}

            {details && (
              <div className="mt-6">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
                >
                  {showDetails ? 'Hide' : 'Show'} technical details
                </button>
                {showDetails && (
                  <div className="mt-3 bg-muted rounded-lg p-3 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">Error Details</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={handleCopyDetails}
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                    <pre className="text-[10px] text-muted-foreground font-mono whitespace-pre-wrap break-all overflow-auto max-h-32">
                      {details}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)
ErrorState.displayName = "ErrorState"

export { ErrorState, detectErrorType }
export type { ErrorType, ErrorStateAction }
