import { useState, useRef, useEffect, type RefObject } from "react"

/**
 * Hook that tracks focus state for a target element.
 */
export function useFocus<T extends HTMLElement = HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => setIsFocused(false)

    node.addEventListener("focus", handleFocus)
    node.addEventListener("blur", handleBlur)

    return () => {
      node.removeEventListener("focus", handleFocus)
      node.removeEventListener("blur", handleBlur)
    }
  }, [])

  return [ref, isFocused]
}
