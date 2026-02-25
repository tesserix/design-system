import { useEffect, useRef, type DependencyList, type EffectCallback } from "react"

/**
 * Hook that runs an effect only on updates (skips first render)
 * @param effect - The effect callback to run
 * @param deps - Dependency list
 */
export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList): void {
  const isMountedRef = useRef(false)

  useEffect(() => {
    if (isMountedRef.current) {
      return effect()
    }
    isMountedRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
