import * as React from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

interface ThemeProviderContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: ResolvedTheme
}

const ThemeProviderContext = React.createContext<ThemeProviderContextValue | undefined>(undefined)

type MaybeDocumentElement = {
  classList: { remove: (...tokens: string[]) => void; add: (...tokens: string[]) => void }
  removeAttribute: (name: string) => void
  setAttribute: (name: string, value: string) => void
}

type MaybeMediaQueryList = {
  matches: boolean
  addEventListener?: (type: "change", listener: () => void) => void
  removeEventListener?: (type: "change", listener: () => void) => void
  addListener?: (listener: () => void) => void
  removeListener?: (listener: () => void) => void
}

const getRootElement = (): MaybeDocumentElement | null => {
  const withDocument = globalThis as { document?: { documentElement?: MaybeDocumentElement } }
  return withDocument.document?.documentElement ?? null
}

const getMediaQueryList = (): MaybeMediaQueryList | null => {
  const withMatchMedia = globalThis as {
    matchMedia?: (query: string) => MaybeMediaQueryList
  }
  return withMatchMedia.matchMedia?.("(prefers-color-scheme: dark)") ?? null
}

const getStoredTheme = (storageKey: string): Theme | null => {
  const withStorage = globalThis as {
    localStorage?: { getItem: (key: string) => string | null }
  }

  try {
    const value = withStorage.localStorage?.getItem(storageKey)
    return value === "light" || value === "dark" || value === "system" ? value : null
  } catch {
    return null
  }
}

const setStoredTheme = (storageKey: string, theme: Theme): void => {
  const withStorage = globalThis as {
    localStorage?: { setItem: (key: string, value: string) => void }
  }

  try {
    withStorage.localStorage?.setItem(storageKey, theme)
  } catch {
    // Ignore storage errors.
  }
}

export interface ThemeProviderProps {
  children: React.ReactNode
  /**
   * Default theme
   */
  defaultTheme?: Theme
  /**
   * Storage key for theme persistence
   */
  storageKey?: string
  /**
   * Whether to enable theme persistence
   */
  enableSystem?: boolean
  /**
   * Attribute to set on root element
   */
  attribute?: "class" | "data-theme"
  /**
   * Value for light theme
   */
  lightValue?: string
  /**
   * Value for dark theme
   */
  darkValue?: string
}

/**
 * Provider for runtime theme switching.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  enableSystem = true,
  attribute = "class",
  lightValue = "light",
  darkValue = "dark",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    return getStoredTheme(storageKey) ?? defaultTheme
  })

  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>("light")

  React.useEffect(() => {
    const root = getRootElement()
    if (!root) {
      return
    }

    root.classList.remove(lightValue, darkValue)
    if (attribute === "data-theme") {
      root.removeAttribute("data-theme")
    }

    let resolved: ResolvedTheme = "light"
    if (theme === "system" && enableSystem) {
      resolved = getMediaQueryList()?.matches ? "dark" : "light"
    } else {
      resolved = theme === "dark" ? "dark" : "light"
    }

    setResolvedTheme(resolved)

    if (attribute === "class") {
      root.classList.add(resolved === "dark" ? darkValue : lightValue)
    } else {
      root.setAttribute("data-theme", resolved === "dark" ? darkValue : lightValue)
    }
  }, [theme, enableSystem, attribute, lightValue, darkValue])

  React.useEffect(() => {
    if (!enableSystem || theme !== "system") {
      return
    }

    const mediaQuery = getMediaQueryList()
    if (!mediaQuery) {
      return
    }

    const handleChange = () => {
      const systemTheme: ResolvedTheme = mediaQuery.matches ? "dark" : "light"
      setResolvedTheme(systemTheme)

      const root = getRootElement()
      if (!root) {
        return
      }

      root.classList.remove(lightValue, darkValue)
      if (attribute === "class") {
        root.classList.add(systemTheme === "dark" ? darkValue : lightValue)
      } else {
        root.setAttribute("data-theme", systemTheme === "dark" ? darkValue : lightValue)
      }
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener?.("change", handleChange)
    }

    mediaQuery.addListener?.(handleChange)
    return () => mediaQuery.removeListener?.(handleChange)
  }, [theme, enableSystem, attribute, lightValue, darkValue])

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      setStoredTheme(storageKey, newTheme)
      setThemeState(newTheme)
    },
    [storageKey]
  )

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, setTheme, resolvedTheme]
  )

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

/**
 * Hook to access theme context.
 */
export function useTheme() {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
