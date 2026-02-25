import { useEffect, useState } from "react"

/**
 * Hook that debounces a value
 * @param value - Value to debounce
 * @param delay - Debounce delay in milliseconds (default: 300)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [value, delay])

  return debouncedValue
}
