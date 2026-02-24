import { useEffect, useRef } from "react"

/**
 * Hook that runs a callback repeatedly with the provided delay.
 * Pass null to stop interval execution.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) {
      return
    }

    const id = window.setInterval(() => {
      savedCallback.current()
    }, delay)

    return () => {
      window.clearInterval(id)
    }
  }, [delay])
}
