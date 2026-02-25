import { useEffect, useRef } from "react"

/**
 * Hook that returns whether the component is currently mounted
 * @returns Whether the component is mounted
 */
export function useMounted(): () => boolean {
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return () => mountedRef.current
}
