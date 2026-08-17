"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import {
  deriveAuthPalette,
  type AuthBrandColors,
  type AuthIntensity,
  type AuthSurfaceTheme,
  type AuthPalette,
} from "./auth-palette"
import { brandingColors, type AuthBranding } from "./auth-policy"

const AuthPaletteContext = React.createContext<AuthPalette | null>(null)

/** Under `auto` this is the light palette; style against `var(--auth-*)` to follow the theme. */
export function useAuthPalette(): AuthPalette {
  const palette = React.useContext(AuthPaletteContext)
  if (!palette) {
    throw new Error("useAuthPalette must be used inside an AuthPanel")
  }
  return palette
}

/** `auto` defers the choice to the host's `.dark` class instead of resolving it in JS. */
export type AuthSurfaceMode = AuthSurfaceTheme | "auto"

const WASH_POSITION = [
  "h-[85vmax] w-[85vmax] -top-[28vmax] -left-[20vmax]",
  "h-[76vmax] w-[76vmax] -bottom-[30vmax] -right-[16vmax]",
  "h-[60vmax] w-[60vmax] top-[42%] left-[52%]",
]

/**
 * Which colour roles the caller pinned explicitly. A pinned role is painted
 * literally; everything else defers to the host's design tokens and only then
 * to the platform default.
 */
export interface AuthSuppliedRoles {
  brand?: boolean
  background?: boolean
  font?: boolean
  warn?: boolean
}

/**
 * Resolution order for every surface role:
 *   1. an explicit value (tenant branding, or the `brandColor` prop)
 *   2. the host's design token, if the product defines one
 *   3. the platform default, as the `var()` fallback
 *
 * Step 3 is why this stays backward compatible: a standalone login page that
 * never loads the design system's tokens falls through to exactly the colours
 * this component painted before.
 */
function tokenBacked(token: string, fallback: string, supplied?: boolean): string {
  return supplied ? fallback : `var(${token}, ${fallback})`
}

/** Non-colour design values, overridable by CSS without needing a prop. */
export interface AuthMetrics {
  /** Card corner radius. Defaults to `var(--radius)`, then `1.25rem`. */
  radius?: string
  /** Font stack for the whole surface. */
  fontFamily?: string
  /** Maximum width of the auth card. */
  cardWidth?: string
  /** Backdrop blur behind the card. */
  cardBlur?: string
  /** Grid cell size on the background. */
  gridSize?: string
}

function authVariables(
  palette: AuthPalette,
  supplied: AuthSuppliedRoles = {},
  metrics: AuthMetrics = {}
): Record<string, string> {
  return {
    "--auth-accent": tokenBacked("--primary", palette.accent, supplied.brand),
    "--auth-warn": tokenBacked("--destructive", palette.warn, supplied.warn),
    "--auth-canvas": tokenBacked("--background", palette.canvas, supplied.background),
    "--auth-card": tokenBacked("--card", palette.cardBackground, supplied.background),
    "--auth-card-shadow": palette.cardShadow,
    "--auth-border": palette.cardBorder,
    "--auth-input": tokenBacked("--background", palette.inputBackground, supplied.background),
    "--auth-input-border": tokenBacked("--input", palette.inputBorder, supplied.brand),
    "--auth-hover": palette.surfaceHover,
    "--auth-foreground": tokenBacked("--foreground", palette.foreground, supplied.font),
    "--auth-muted": tokenBacked("--muted-foreground", palette.mutedForeground, supplied.font),
    "--auth-label": tokenBacked("--foreground", palette.labelForeground, supplied.font),
    "--auth-subtle": tokenBacked("--muted-foreground", palette.subtleForeground, supplied.font),
    "--auth-gridline": palette.gridline,
    "--auth-button": palette.buttonBackground,
    "--auth-button-foreground": palette.buttonForeground,
    "--auth-button-shadow": palette.buttonShadow,
    "--auth-wash-0": palette.washes[0] ?? "none",
    "--auth-wash-1": palette.washes[1] ?? "none",
    "--auth-wash-2": palette.washes[2] ?? "none",
    "--auth-radius": metrics.radius ?? "var(--radius, 1.25rem)",
    "--auth-font": metrics.fontFamily ?? "inherit",
    "--auth-card-width": metrics.cardWidth ?? "404px",
    "--auth-card-blur": metrics.cardBlur ?? "28px",
    "--auth-grid-size": metrics.gridSize ?? "52px",
  }
}

function declarations(
  palette: AuthPalette,
  supplied: AuthSuppliedRoles,
  metrics: AuthMetrics
): string {
  return Object.entries(authVariables(palette, supplied, metrics))
    .map(([name, value]) => `${name}:${value}`)
    .join(";")
}

/**
 * Brand colour used when a tenant's own is missing or unusable. A sign-in screen
 * must render something; it must never white-screen over a palette value.
 */
export const AUTH_FALLBACK_BRAND = "#5B5FD6"

/**
 * `deriveAuthPalette` rejects anything that is not a hex colour, which is the
 * right contract for a pure utility and the wrong outcome for a login page —
 * a tenant's brand colour is routinely empty until someone sets one.
 */
function safeDerivePalette(
  brandColor: string,
  options: { mode: AuthSurfaceTheme; intensity: AuthIntensity; colors?: AuthBrandColors }
) {
  try {
    return deriveAuthPalette(brandColor, options)
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `AuthPanel: brandColor ${JSON.stringify(brandColor)} is not a hex colour; ` +
          `falling back to ${AUTH_FALLBACK_BRAND}.`
      )
    }
    return deriveAuthPalette(AUTH_FALLBACK_BRAND, options)
  }
}

/**
 * Resolves the surface a component paints. `auto` returns the light palette for
 * measurement and a stylesheet that hands the dark one to `.dark` descendants.
 */
function useAuthSurface(
  brandColor: string,
  mode: AuthSurfaceMode,
  intensity: AuthIntensity,
  branding?: AuthBranding,
  colors?: AuthBrandColors,
  metrics?: AuthMetrics
) {
  const scope = React.useId()
  const brandingKey = branding ? JSON.stringify(branding) : ""
  const colorKey = colors ? JSON.stringify(colors) : ""
  const metricKey = metrics ? JSON.stringify(metrics) : ""

  return React.useMemo(() => {
    const resolvedMetrics = metrics ?? {}
    /** Explicit props beat the policy; the policy beats the design tokens. */
    const forMode = (surfaceMode: AuthSurfaceTheme): AuthBrandColors => ({
      ...brandingColors(branding, surfaceMode),
      ...Object.fromEntries(Object.entries(colors ?? {}).filter(([, value]) => value !== undefined)),
    })

    const build = (surfaceMode: AuthSurfaceTheme) => {
      const roleColors = forMode(surfaceMode)
      const supplied: AuthSuppliedRoles = {
        brand: Boolean(roleColors.primary) || Boolean(brandColor),
        background: Boolean(roleColors.background),
        font: Boolean(roleColors.font),
        warn: Boolean(roleColors.warn),
      }
      const palette = safeDerivePalette(brandColor, {
        mode: surfaceMode,
        intensity,
        colors: roleColors,
      })
      return { palette, supplied }
    }

    const light = build(mode === "auto" ? "light" : mode)

    if (mode !== "auto") {
      return {
        palette: light.palette,
        scope,
        style: authVariables(light.palette, light.supplied, resolvedMetrics),
        css: null,
      }
    }

    const dark = build("dark")
    const selector = `[data-auth-scope="${scope}"]`
    return {
      palette: light.palette,
      scope,
      style: {} as Record<string, string>,
      css:
        `${selector}{${declarations(light.palette, light.supplied, resolvedMetrics)}}` +
        `.dark ${selector}{${declarations(dark.palette, dark.supplied, resolvedMetrics)}}`,
    }
    // Serialised keys keep the memo stable across the object literals a caller
    // almost always re-creates inline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandColor, mode, intensity, scope, brandingKey, colorKey, metricKey])
}

/** Canvas, washes and grid, painted entirely from the custom properties above. */
function AuthSurface({ washCount }: { washCount: number }) {
  return (
    <>
      {Array.from({ length: washCount }, (_, i) => (
        <span
          key={i}
          data-auth-wash=""
          className={cn("absolute block rounded-full", WASH_POSITION[i])}
          style={{ background: `var(--auth-wash-${i})` }}
        />
      ))}
      <div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_45%,#000_25%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_at_50%_45%,#000_25%,transparent_78%)]"
        style={{
          backgroundSize: "var(--auth-grid-size, 52px) var(--auth-grid-size, 52px)",
          backgroundImage:
            "linear-gradient(var(--auth-gridline) 1px,transparent 1px),linear-gradient(90deg,var(--auth-gridline) 1px,transparent 1px)",
        }}
      />
    </>
  )
}

export interface AuthBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tenant primary colour; the whole wash palette is derived from it. */
  brandColor: string
  mode?: AuthSurfaceMode
  intensity?: AuthIntensity
  /** Tenant branding; supplies every colour role the tenant configured. */
  branding?: AuthBranding
  /** Per-role overrides. Beat `branding`, which beats the host's design tokens. */
  colors?: AuthBrandColors
  /** Non-colour design values (radius, font, card width, blur, grid). */
  metrics?: AuthMetrics
}

const AuthBackground = React.forwardRef<HTMLDivElement, AuthBackgroundProps>(
  (
    { brandColor, mode = "light", intensity = "full", branding, colors, metrics, className, style, ...props },
    ref
  ) => {
    const surface = useAuthSurface(brandColor, mode, intensity, branding, colors, metrics)

    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-auth-scope={surface.scope}
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
        style={
          {
            background: "var(--auth-canvas)",
            ...surface.style,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {surface.css ? <style>{surface.css}</style> : null}
        <AuthSurface washCount={surface.palette.washes.length} />
      </div>
    )
  }
)
AuthBackground.displayName = "AuthBackground"

export interface AuthPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Tenant primary colour; the whole wash palette is derived from it. */
  brandColor: string
  /** `auto` follows the host's `.dark` class; a fixed mode is pinned inline. */
  mode?: AuthSurfaceMode
  intensity?: AuthIntensity
  /** Omit when the host app supplies its own heading inside `children`. */
  title?: React.ReactNode
  tagline?: React.ReactNode
  /** Tenant wordmark. Use `useAuthPalette()` inside it to colour an inline SVG. */
  logo?: React.ReactNode
  footer?: React.ReactNode
  /** Tenants without `disableWatermark` keep the platform mark. */
  watermark?: boolean
  watermarkLabel?: string
  /**
   * Tenant branding. Supplies every colour role the tenant configured and, when
   * `mode` is `auto`, the dark variants too. Map a provider's own policy onto
   * this with an adapter such as `zitadelBranding`.
   */
  branding?: AuthBranding
  /** Per-role colour overrides. Beat `branding`, which beats the design tokens. */
  colors?: AuthBrandColors
  /** Radius, font stack, card width, blur and grid size. */
  metrics?: AuthMetrics
}

const AuthPanel = React.forwardRef<HTMLDivElement, AuthPanelProps>(
  (
    {
      brandColor,
      mode = "light",
      intensity = "full",
      title,
      tagline,
      logo,
      footer,
      watermark = false,
      watermarkLabel = "Secured by Tesserix",
      branding,
      colors,
      metrics,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const surface = useAuthSurface(brandColor, mode, intensity, branding, colors, metrics)
    // `disableWatermark` is the tenant's decision; the prop is the host's default.
    const showWatermark = branding?.hideWatermark ? false : watermark

    return (
      <AuthPaletteContext.Provider value={surface.palette}>
        <div
          ref={ref}
          data-auth-scope={surface.scope}
          className={cn(
            "relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-4 py-8 sm:py-12",
            className
          )}
          style={
            {
              color: "var(--auth-foreground)",
              fontFamily: "var(--auth-font)",
              ...surface.style,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {surface.css ? <style>{surface.css}</style> : null}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ background: "var(--auth-canvas)" }}
          >
            <AuthSurface washCount={surface.palette.washes.length} />
          </div>
          <div
            className="relative w-full p-6 text-center sm:p-9"
            style={{
              maxWidth: "var(--auth-card-width, 404px)",
              borderRadius: "var(--auth-radius, 1.25rem)",
              backdropFilter: "blur(var(--auth-card-blur, 28px))",
              WebkitBackdropFilter: "blur(var(--auth-card-blur, 28px))",
              background: "var(--auth-card)",
              border: "var(--auth-border)",
              boxShadow: "var(--auth-card-shadow)",
            }}
          >
            {logo ? (
              <div className="mb-6 flex h-[34px] items-center justify-center [&_img]:max-h-[34px] [&_img]:w-auto [&_svg]:max-h-[34px]">
                {logo}
              </div>
            ) : null}
            {title ? (
              <h1 className="mb-1.5 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
            ) : null}
            {tagline ? (
              <p className="mb-7 text-[0.9375rem]" style={{ color: "var(--auth-muted)" }}>
                {tagline}
              </p>
            ) : null}
            <div className="text-left">{children}</div>
            {footer ? (
              <p className="mt-7 text-xs" style={{ color: "var(--auth-subtle)" }}>
                {footer}
              </p>
            ) : null}
          </div>
          {showWatermark ? (
            <p
              className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px]"
              style={{ color: "var(--auth-subtle)" }}
            >
              {watermarkLabel}
            </p>
          ) : null}
        </div>
      </AuthPaletteContext.Provider>
    )
  }
)
AuthPanel.displayName = "AuthPanel"

export { AuthPanel, AuthBackground }
