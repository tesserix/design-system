import * as React from "react"

type Theme = "light" | "dark" | "system"

interface ThemeProviderContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeProviderContext = React.createContext<ThemeProviderContextValue | undefined>(undefined)

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
 * Provider for runtime theme switching
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
    if (typeof window === "undefined") return defaultTheme

    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme
    } catch {
      return defaultTheme
    }
  })

  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    const root = window.document.documentElement

    // Remove previous theme
    root.classList.remove(lightValue, darkValue)
    if (attribute === "data-theme") {
      root.removeAttribute("data-theme")
    }

    let resolved: "light" | "dark" = "light"

    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      resolved = systemTheme
    } else {
      resolved = theme === "dark" ? "dark" : "light"
    }

    setResolvedTheme(resolved)

    // Apply theme
    if (attribute === "class") {
      root.classList.add(resolved === "dark" ? darkValue : lightValue)
    } else {
      root.setAttribute("data-theme", resolved === "dark" ? darkValue : lightValue)
    }
  }, [theme, enableSystem, attribute, lightValue, darkValue])

  React.useEffect(() => {
    if (!enableSystem || theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      const systemTheme = mediaQuery.matches ? "dark" : "light"
      setResolvedTheme(systemTheme)

      const root = window.document.documentElement
      root.classList.remove(lightValue, darkValue)

      if (attribute === "class") {
        root.classList.add(systemTheme === "dark" ? darkValue : lightValue)
      } else {
        root.setAttribute("data-theme", systemTheme === "dark" ? darkValue : lightValue)
      }
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, enableSystem, attribute, lightValue, darkValue])

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme)
      } catch {
        // Ignore localStorage errors
      }
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
 * Hook to access theme context
 */
export function useTheme() {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
