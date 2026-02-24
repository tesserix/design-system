import * as React from "react"

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl"

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

/**
 * Hook that returns the current breakpoint
 */
export function useBreakpoint(): Breakpoint | null {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint | null>(null)

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth

      if (width >= breakpoints["2xl"]) {
        setBreakpoint("2xl")
      } else if (width >= breakpoints.xl) {
        setBreakpoint("xl")
      } else if (width >= breakpoints.lg) {
        setBreakpoint("lg")
      } else if (width >= breakpoints.md) {
        setBreakpoint("md")
      } else if (width >= breakpoints.sm) {
        setBreakpoint("sm")
      } else {
        setBreakpoint(null)
      }
    }

    updateBreakpoint()
    window.addEventListener("resize", updateBreakpoint)

    return () => window.removeEventListener("resize", updateBreakpoint)
  }, [])

  return breakpoint
}

/**
 * Hook that returns whether the viewport matches a media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    const updateMatch = () => setMatches(mediaQuery.matches)

    updateMatch()
    mediaQuery.addEventListener("change", updateMatch)

    return () => mediaQuery.removeEventListener("change", updateMatch)
  }, [query])

  return matches
}

export interface ShowProps {
  /**
   * Show content above this breakpoint
   */
  above?: Breakpoint
  /**
   * Show content below this breakpoint
   */
  below?: Breakpoint
  /**
   * The children to conditionally render
   */
  children: React.ReactNode
}

/**
 * Component that conditionally renders children based on breakpoint
 */
export function Show({ above, below, children }: ShowProps) {
  const currentBreakpoint = useBreakpoint()

  if (!currentBreakpoint) {
    // Mobile (below sm)
    if (above) return null
    if (below) return <>{children}</>
    return <>{children}</>
  }

  const breakpointOrder: Breakpoint[] = ["sm", "md", "lg", "xl", "2xl"]
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint)

  if (above) {
    const aboveIndex = breakpointOrder.indexOf(above)
    if (currentIndex < aboveIndex) return null
  }

  if (below) {
    const belowIndex = breakpointOrder.indexOf(below)
    if (currentIndex > belowIndex) return null
  }

  return <>{children}</>
}

export interface HideProps {
  /**
   * Hide content above this breakpoint
   */
  above?: Breakpoint
  /**
   * Hide content below this breakpoint
   */
  below?: Breakpoint
  /**
   * The children to conditionally render
   */
  children: React.ReactNode
}

/**
 * Component that conditionally hides children based on breakpoint
 */
export function Hide({ above, below, children }: HideProps) {
  const currentBreakpoint = useBreakpoint()

  if (!currentBreakpoint) {
    // Mobile (below sm)
    if (below) return null
    return <>{children}</>
  }

  const breakpointOrder: Breakpoint[] = ["sm", "md", "lg", "xl", "2xl"]
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint)

  if (above) {
    const aboveIndex = breakpointOrder.indexOf(above)
    if (currentIndex >= aboveIndex) return null
  }

  if (below) {
    const belowIndex = breakpointOrder.indexOf(below)
    if (currentIndex <= belowIndex) return null
  }

  return <>{children}</>
}
