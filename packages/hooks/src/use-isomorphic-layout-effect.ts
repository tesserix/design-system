import { useEffect, useLayoutEffect } from "react"

/**
 * useLayoutEffect that works on the server (SSR-safe)
 * Uses useLayoutEffect on the client and useEffect on the server
 */
export const useIsomorphicLayoutEffect =
  typeof globalThis !== "undefined" && "document" in globalThis ? useLayoutEffect : useEffect
