import { useEffect, useRef } from "react"

/**
 * Hook that runs a callback once when the component mounts.
 */
export function useOnMount(callback: () => void): void {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    callbackRef.current()
  }, [])
}
