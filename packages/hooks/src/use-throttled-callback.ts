import { useCallback, useRef } from "react"

/**
 * Hook that returns a throttled callback
 * @param callback - The callback to throttle
 * @param delay - Throttle delay in milliseconds
 * @returns Throttled callback
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRan = useRef(Date.now())

  return useCallback(
    (...args: Parameters<T>) => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args)
        lastRan.current = Date.now()
      }
    },
    [callback, delay]
  )
}
