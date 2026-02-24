import * as React from "react"
import { cn } from "../lib/utils"

export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Duration in milliseconds
   */
  duration?: number
  /**
   * Delay in milliseconds
   */
  delay?: number
  /**
   * Whether to fade in from a direction
   */
  direction?: "up" | "down" | "left" | "right"
}

/**
 * Component that fades in its children
 */
export const FadeIn = React.forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, className, duration = 300, delay = 0, direction, style, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    React.useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }, [delay])

    const directionClasses = {
      up: "translate-y-4",
      down: "-translate-y-4",
      left: "translate-x-4",
      right: "-translate-x-4",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "transition-all",
          !isVisible && "opacity-0",
          !isVisible && direction && directionClasses[direction],
          isVisible && "opacity-100 translate-x-0 translate-y-0",
          className
        )}
        style={{
          ...style,
          transitionDuration: `${duration}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
FadeIn.displayName = "FadeIn"

export interface SlideInProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Direction to slide from
   */
  from: "left" | "right" | "top" | "bottom"
  /**
   * Duration in milliseconds
   */
  duration?: number
  /**
   * Delay in milliseconds
   */
  delay?: number
}

/**
 * Component that slides in its children from a direction
 */
export const SlideIn = React.forwardRef<HTMLDivElement, SlideInProps>(
  ({ children, className, from, duration = 300, delay = 0, style, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    React.useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }, [delay])

    const initialTransform = {
      left: "-translate-x-full",
      right: "translate-x-full",
      top: "-translate-y-full",
      bottom: "translate-y-full",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "transition-transform",
          !isVisible && initialTransform[from],
          isVisible && "translate-x-0 translate-y-0",
          className
        )}
        style={{
          ...style,
          transitionDuration: `${duration}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SlideIn.displayName = "SlideIn"

export interface ScaleInProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Duration in milliseconds
   */
  duration?: number
  /**
   * Delay in milliseconds
   */
  delay?: number
}

/**
 * Component that scales in its children
 */
export const ScaleIn = React.forwardRef<HTMLDivElement, ScaleInProps>(
  ({ children, className, duration = 300, delay = 0, style, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    React.useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }, [delay])

    return (
      <div
        ref={ref}
        className={cn(
          "transition-all origin-center",
          !isVisible && "scale-0 opacity-0",
          isVisible && "scale-100 opacity-100",
          className
        )}
        style={{
          ...style,
          transitionDuration: `${duration}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ScaleIn.displayName = "ScaleIn"

/**
 * Hook for animating a value
 */
export function useAnimatedValue(
  targetValue: number,
  duration = 300
): number {
  const [value, setValue] = React.useState(targetValue)

  React.useEffect(() => {
    const startValue = value
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3)

      setValue(startValue + (targetValue - startValue) * eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [targetValue, duration])

  return value
}
