import { useEffect, type EffectCallback } from "react"

/**
 * Hook that runs an effect only once on mount
 * @param effect - The effect callback to run
 */
export function useEffectOnce(effect: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
