import { useEffect, useState } from "react"

interface ScrollPosition {
  x: number
  y: number
}

function getScrollPosition(): ScrollPosition {
  if (typeof window === "undefined") {
    return { x: 0, y: 0 }
  }

  return {
    x: window.scrollX,
    y: window.scrollY,
  }
}

/**
 * Hook that tracks current page scroll position.
 */
export function useScrollPosition(): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>(getScrollPosition)

  useEffect(() => {
    const handleScroll = () => {
      setPosition(getScrollPosition())
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return position
}
