import { useEffect, useRef } from "react"

/**
 * Hook that runs a callback once after the provided delay.
 * Pass null to disable scheduling.
 */
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) {
      return
    }

    const id = window.setTimeout(() => {
      savedCallback.current()
    }, delay)

    return () => {
      window.clearTimeout(id)
    }
  }, [delay])
}
