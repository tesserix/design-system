import { useEffect, useState } from "react"

interface WindowSize {
  width: number
  height: number
}

function getWindowSize(): WindowSize {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * Hook that tracks current browser window dimensions.
 */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>(getWindowSize)

  useEffect(() => {
    const handleResize = () => {
      setSize(getWindowSize())
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return size
}
