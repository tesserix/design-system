import * as React from "react"
import { createPortal } from "react-dom"

export interface PortalProps {
  /**
   * The children to render in the portal
   */
  children: React.ReactNode
  /**
   * The container element to render into (defaults to document.body)
   */
  container?: HTMLElement | null
}

/**
 * Component that renders children into a different part of the DOM tree
 */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) {
    return null
  }

  return createPortal(children, container || document.body)
}
