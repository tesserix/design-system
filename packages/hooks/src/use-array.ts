import { useCallback, useState } from "react"

export interface UseArrayReturn<T> {
  array: T[]
  set: (newArray: T[]) => void
  push: (element: T) => void
  filter: (callback: (value: T, index: number, array: T[]) => boolean) => void
  update: (index: number, element: T) => void
  remove: (index: number) => void
  clear: () => void
}

/**
 * Hook for managing array state with helper methods
 * @param initialValue - Initial array value (default: [])
 * @returns Array state and helper methods
 */
export function useArray<T = unknown>(initialValue: T[] = []): UseArrayReturn<T> {
  const [array, setArray] = useState<T[]>(initialValue)

  const push = useCallback((element: T) => {
    setArray((prev) => [...prev, element])
  }, [])

  const filter = useCallback(
    (callback: (value: T, index: number, array: T[]) => boolean) => {
      setArray((prev) => prev.filter(callback))
    },
    []
  )

  const update = useCallback((index: number, element: T) => {
    setArray((prev) => {
      const newArray = [...prev]
      newArray[index] = element
      return newArray
    })
  }, [])

  const remove = useCallback((index: number) => {
    setArray((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clear = useCallback(() => {
    setArray([])
  }, [])

  const set = useCallback((newArray: T[]) => {
    setArray(newArray)
  }, [])

  return {
    array,
    set,
    push,
    filter,
    update,
    remove,
    clear,
  }
}
