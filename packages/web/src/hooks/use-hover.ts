import { useState, useRef, useEffect, type RefObject } from "react"

/**
 * Hook that tracks hover state for a target element.
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)

    node.addEventListener("mouseenter", handleMouseEnter)
    node.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      node.removeEventListener("mouseenter", handleMouseEnter)
      node.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return [ref, isHovered]
}
