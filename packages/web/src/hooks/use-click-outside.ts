import { useEffect, useRef, type RefObject } from "react"

type Handler = (event: MouseEvent | TouchEvent) => void

/**
 * Hook that triggers a callback when a click occurs outside of the target element
 * @param handler - Callback function to execute when click outside is detected
 * @returns Ref to attach to the target element
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: Handler
): RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current
      if (!el || el.contains(event.target as Node)) {
        return
      }

      handler(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [handler])

  return ref
}
