import { useEffect } from "react"

/**
 * Hook that runs a callback once when the component mounts.
 */
export function useOnMount(callback: () => void): void {
  useEffect(() => {
    callback()
  }, [callback])
}
