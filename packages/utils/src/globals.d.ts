/**
 * Global types for cross-platform compatibility
 * Works in both browser and React Native environments
 */

// Browser-specific globals (may not exist in React Native)
declare const window:
  | {
      document: {
        documentElement: {
          classList: {
            add: (...tokens: string[]) => void
            remove: (...tokens: string[]) => void
          }
          setAttribute: (name: string, value: string) => void
          removeAttribute: (name: string) => void
        }
      }
      matchMedia: (query: string) => {
        matches: boolean
        addEventListener: (type: string, listener: () => void) => void
        removeEventListener: (type: string, listener: () => void) => void
      }
    }
  | undefined

declare const localStorage:
  | {
      getItem: (key: string) => string | null
      setItem: (key: string, value: string) => void
      removeItem: (key: string) => void
    }
  | undefined
