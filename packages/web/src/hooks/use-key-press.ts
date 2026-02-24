import { useEffect, useState } from "react"

type KeyFilter = string | string[] | ((event: KeyboardEvent) => boolean)

interface UseKeyPressOptions {
  /**
   * Target element to listen on (defaults to window)
   */
  target?: HTMLElement | Window | null
  /**
   * Event type to listen for
   */
  event?: "keydown" | "keyup"
}

/**
 * Hook that detects when a specific key or keys are pressed
 * @param keyFilter - Key(s) to detect or predicate function
 * @param options - Configuration options
 * @returns Boolean indicating if the key is currently pressed
 */
export function useKeyPress(
  keyFilter: KeyFilter,
  options: UseKeyPressOptions = {}
): boolean {
  const { target = typeof window !== "undefined" ? window : null, event = "keydown" } = options
  const [keyPressed, setKeyPressed] = useState(false)

  useEffect(() => {
    if (!target) return

    const downHandler = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent

      if (typeof keyFilter === "function") {
        if (keyFilter(keyboardEvent)) {
          setKeyPressed(true)
        }
      } else if (Array.isArray(keyFilter)) {
        if (keyFilter.includes(keyboardEvent.key)) {
          setKeyPressed(true)
        }
      } else {
        if (keyboardEvent.key === keyFilter) {
          setKeyPressed(true)
        }
      }
    }

    const upHandler = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent

      if (typeof keyFilter === "function") {
        if (keyFilter(keyboardEvent)) {
          setKeyPressed(false)
        }
      } else if (Array.isArray(keyFilter)) {
        if (keyFilter.includes(keyboardEvent.key)) {
          setKeyPressed(false)
        }
      } else {
        if (keyboardEvent.key === keyFilter) {
          setKeyPressed(false)
        }
      }
    }

    if (event === "keydown") {
      target.addEventListener("keydown", downHandler)
      target.addEventListener("keyup", upHandler)
    } else {
      target.addEventListener("keyup", downHandler)
    }

    return () => {
      if (event === "keydown") {
        target.removeEventListener("keydown", downHandler)
        target.removeEventListener("keyup", upHandler)
      } else {
        target.removeEventListener("keyup", downHandler)
      }
    }
  }, [keyFilter, target, event])

  return keyPressed
}
