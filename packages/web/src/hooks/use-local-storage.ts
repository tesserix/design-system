import * as React from "react"

type InitialValue<T> = T | (() => T)

const resolveInitialValue = <T>(initialValue: InitialValue<T>): T =>
  typeof initialValue === "function" ? (initialValue as () => T)() : initialValue

const useLocalStorage = <T>(key: string, initialValue: InitialValue<T>) => {
  const readValue = React.useCallback((): T => {
    if (typeof window === "undefined") {
      return resolveInitialValue(initialValue)
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : resolveInitialValue(initialValue)
    } catch {
      return resolveInitialValue(initialValue)
    }
  }, [initialValue, key])

  const [storedValue, setStoredValue] = React.useState<T>(readValue)

  const setValue: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
    (value) => {
      setStoredValue((currentValue) => {
        const valueToStore = value instanceof Function ? value(currentValue) : value

        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
          } catch {
            // Ignore write errors so state updates still work in restricted environments.
          }
        }

        return valueToStore
      })
    },
    [key]
  )

  React.useEffect(() => {
    setStoredValue(readValue())
  }, [key, readValue])

  return [storedValue, setValue] as const
}

export { useLocalStorage }
