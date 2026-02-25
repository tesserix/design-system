import { useCallback, useState } from "react"

export interface UseSetReturn<T> {
  set: Set<T>
  add: (value: T) => void
  remove: (value: T) => void
  toggle: (value: T) => void
  clear: () => void
  reset: () => void
  has: (value: T) => boolean
}

/**
 * Hook for managing Set state
 * @param initialValue - Initial Set value (default: new Set())
 * @returns Set state and helper methods
 */
export function useSet<T>(initialValue: Set<T> = new Set()): UseSetReturn<T> {
  const [set, setSet] = useState<Set<T>>(new Set(initialValue))

  const add = useCallback((value: T) => {
    setSet((prev) => {
      const newSet = new Set(prev)
      newSet.add(value)
      return newSet
    })
  }, [])

  const remove = useCallback((value: T) => {
    setSet((prev) => {
      const newSet = new Set(prev)
      newSet.delete(value)
      return newSet
    })
  }, [])

  const toggle = useCallback((value: T) => {
    setSet((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(value)) {
        newSet.delete(value)
      } else {
        newSet.add(value)
      }
      return newSet
    })
  }, [])

  const clear = useCallback(() => {
    setSet(new Set())
  }, [])

  const reset = useCallback(() => {
    setSet(new Set(initialValue))
  }, [initialValue])

  const has = useCallback(
    (value: T) => {
      return set.has(value)
    },
    [set]
  )

  return {
    set,
    add,
    remove,
    toggle,
    clear,
    reset,
    has,
  }
}
