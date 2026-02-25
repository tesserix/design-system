import { useCallback, useState } from "react"

export interface UseMapReturn<K, V> {
  map: Map<K, V>
  set: (key: K, value: V) => void
  remove: (key: K) => void
  clear: () => void
  reset: () => void
}

/**
 * Hook for managing Map state
 * @param initialValue - Initial Map value (default: new Map())
 * @returns Map state and helper methods
 */
export function useMap<K, V>(
  initialValue: Map<K, V> = new Map()
): UseMapReturn<K, V> {
  const [map, setMap] = useState<Map<K, V>>(new Map(initialValue))

  const set = useCallback((key: K, value: V) => {
    setMap((prev) => {
      const newMap = new Map(prev)
      newMap.set(key, value)
      return newMap
    })
  }, [])

  const remove = useCallback((key: K) => {
    setMap((prev) => {
      const newMap = new Map(prev)
      newMap.delete(key)
      return newMap
    })
  }, [])

  const clear = useCallback(() => {
    setMap(new Map())
  }, [])

  const reset = useCallback(() => {
    setMap(new Map(initialValue))
  }, [initialValue])

  return {
    map,
    set,
    remove,
    clear,
    reset,
  }
}
