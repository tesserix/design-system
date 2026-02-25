import { useEffect, useState } from 'react'

/**
 * In Storybook web, native components use inline RN styles.
 * Force a rerender when the root theme attributes change so color values recompute.
 */
export function useStorybookThemeVersion(): number {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
      return
    }

    const root = document.documentElement
    if (!root) {
      return
    }

    const observer = new MutationObserver((mutations) => {
      const shouldRefresh = mutations.some(
        (mutation) =>
          mutation.type === 'attributes' &&
          (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')
      )

      if (shouldRefresh) {
        setVersion((previous) => previous + 1)
      }
    })

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    })

    return () => observer.disconnect()
  }, [])

  return version
}
