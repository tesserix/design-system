import { useEffect, useState, useRef } from "react"

/**
 * Hook that throttles a value
 * @param value - Value to throttle
 * @param delay - Throttle delay in milliseconds
 * @returns Throttled value
 */
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRanRef = useRef(Date.now())

  useEffect(() => {
    const timeToWait = delay - (Date.now() - lastRanRef.current)

    if (timeToWait <= 0) {
      setThrottledValue(value)
      lastRanRef.current = Date.now()
      return
    }

    const handler = setTimeout(() => {
      setThrottledValue(value)
      lastRanRef.current = Date.now()
    }, timeToWait)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return throttledValue
}
