import * as React from "react"

export interface UseToggleReturn {
  value: boolean
  toggle: () => void
  setTrue: () => void
  setFalse: () => void
  setValue: React.Dispatch<React.SetStateAction<boolean>>
}

const useToggle = (initialValue = false): UseToggleReturn => {
  const [value, setValue] = React.useState(initialValue)

  const toggle = React.useCallback(() => {
    setValue((current) => !current)
  }, [])

  const setTrue = React.useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = React.useCallback(() => {
    setValue(false)
  }, [])

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue,
  }
}

export { useToggle }
