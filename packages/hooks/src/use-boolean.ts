import { useCallback, useState } from "react"

export interface UseBooleanReturn {
  value: boolean
  setValue: React.Dispatch<React.SetStateAction<boolean>>
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}

/**
 * Hook for managing boolean state with semantic helpers
 * @param initialValue - Initial boolean value (default: false)
 * @returns Boolean state and helper methods
 */
export function useBoolean(initialValue = false): UseBooleanReturn {
  const [value, setValue] = useState(initialValue)

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  return {
    value,
    setValue,
    setTrue,
    setFalse,
    toggle,
  }
}
