import { useEffect, useRef } from "react"

/**
 * Hook that runs a callback once when the component unmounts.
 */
export function useOnUnmount(callback: () => void): void {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    return () => {
      callbackRef.current()
    }
  }, [])
}
