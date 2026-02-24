import { useEffect, useState, useRef, type RefObject } from "react"

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * If true, the observer will be frozen and not update
   */
  freezeOnceVisible?: boolean
}

/**
 * Hook that tracks whether an element is visible in the viewport using IntersectionObserver
 * @param options - IntersectionObserver options
 * @returns Tuple of [ref to attach, entry, isIntersecting boolean]
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, IntersectionObserverEntry | undefined, boolean] {
  const { freezeOnceVisible = false, threshold = 0, root = null, rootMargin = "0px" } = options

  const ref = useRef<T>(null)
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const frozen = useRef(false)

  const isIntersecting = entry?.isIntersecting ?? false

  useEffect(() => {
    const node = ref.current
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen.current || !node) {
      return
    }

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry)

      if (entry.isIntersecting && freezeOnceVisible) {
        frozen.current = true
        observer.disconnect()
      }
    }, observerParams)

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, freezeOnceVisible])

  return [ref, entry, isIntersecting]
}
