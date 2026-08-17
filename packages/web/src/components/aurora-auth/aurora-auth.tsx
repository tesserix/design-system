"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import {
  deriveAuroraPalette,
  zitadelLabelPolicyColors,
  type AuroraBrandColors,
  type AuroraIntensity,
  type AuroraMode,
  type AuroraPalette,
} from "./aurora-palette"
import type { ZitadelLabelPolicy } from "./zitadel-policy"

const AuroraPaletteContext = React.createContext<AuroraPalette | null>(null)

/** Under `auto` this is the light palette; style against `var(--aurora-*)` to follow the theme. */
export function useAuroraPalette(): AuroraPalette {
  const palette = React.useContext(AuroraPaletteContext)
  if (!palette) {
    throw new Error("useAuroraPalette must be used inside an AuroraAuthPanel")
  }
  return palette
}

/** `auto` defers the choice to the host's `.dark` class instead of resolving it in JS. */
export type AuroraSurfaceMode = AuroraMode | "auto"

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
export interface AuroraSuppliedRoles {
  brand?: boolean
  background?: boolean
  font?: boolean
  warn?: boolean
}

/**
 * Resolution order for every surface role:
 *   1. an explicit value (Zitadel `LabelPolicy`, or the `brandColor` prop)
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
export interface AuroraMetrics {
  /** Card corner radius. Defaults to `var(--radius)`, then `1.25rem`. */
  radius?: string
  /** Font stack for the whole surface. Zitadel exposes this as `LabelPolicy.fontURL`. */
  fontFamily?: string
  /** Maximum width of the auth card. */
  cardWidth?: string
  /** Backdrop blur behind the card. */
  cardBlur?: string
  /** Grid cell size on the background. */
  gridSize?: string
}

function auroraVariables(
  palette: AuroraPalette,
  supplied: AuroraSuppliedRoles = {},
  metrics: AuroraMetrics = {}
): Record<string, string> {
  return {
    "--aurora-accent": tokenBacked("--primary", palette.accent, supplied.brand),
    "--aurora-warn": tokenBacked("--destructive", palette.warn, supplied.warn),
    "--aurora-canvas": tokenBacked("--background", palette.canvas, supplied.background),
    "--aurora-card": tokenBacked("--card", palette.cardBackground, supplied.background),
    "--aurora-card-shadow": palette.cardShadow,
    "--aurora-border": palette.cardBorder,
    "--aurora-input": tokenBacked("--background", palette.inputBackground, supplied.background),
    "--aurora-input-border": tokenBacked("--input", palette.inputBorder, supplied.brand),
    "--aurora-hover": palette.surfaceHover,
    "--aurora-foreground": tokenBacked("--foreground", palette.foreground, supplied.font),
    "--aurora-muted": tokenBacked("--muted-foreground", palette.mutedForeground, supplied.font),
    "--aurora-label": tokenBacked("--foreground", palette.labelForeground, supplied.font),
    "--aurora-subtle": tokenBacked("--muted-foreground", palette.subtleForeground, supplied.font),
    "--aurora-gridline": palette.gridline,
    "--aurora-button": palette.buttonBackground,
    "--aurora-button-foreground": palette.buttonForeground,
    "--aurora-button-shadow": palette.buttonShadow,
    "--aurora-wash-0": palette.washes[0] ?? "none",
    "--aurora-wash-1": palette.washes[1] ?? "none",
    "--aurora-wash-2": palette.washes[2] ?? "none",
    "--aurora-radius": metrics.radius ?? "var(--radius, 1.25rem)",
    "--aurora-font": metrics.fontFamily ?? "inherit",
    "--aurora-card-width": metrics.cardWidth ?? "404px",
    "--aurora-card-blur": metrics.cardBlur ?? "28px",
    "--aurora-grid-size": metrics.gridSize ?? "52px",
  }
}

function declarations(
  palette: AuroraPalette,
  supplied: AuroraSuppliedRoles,
  metrics: AuroraMetrics
): string {
  return Object.entries(auroraVariables(palette, supplied, metrics))
    .map(([name, value]) => `${name}:${value}`)
    .join(";")
}

/**
 * Brand colour used when a tenant's own is missing or unusable. A sign-in screen
 * must render something; it must never white-screen over a palette value.
 */
export const AURORA_FALLBACK_BRAND = "#5B5FD6"

/**
 * `deriveAuroraPalette` rejects anything that is not a hex colour, which is the
 * right contract for a pure utility and the wrong outcome for a login page —
 * Zitadel leaves `LabelPolicy.primaryColor` empty until a tenant sets one.
 */
function safeDerivePalette(
  brandColor: string,
  options: { mode: AuroraMode; intensity: AuroraIntensity; colors?: AuroraBrandColors }
) {
  try {
    return deriveAuroraPalette(brandColor, options)
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `AuroraAuthPanel: brandColor ${JSON.stringify(brandColor)} is not a hex colour; ` +
          `falling back to ${AURORA_FALLBACK_BRAND}.`
      )
    }
    return deriveAuroraPalette(AURORA_FALLBACK_BRAND, options)
  }
}

/**
 * Resolves the surface a component paints. `auto` returns the light palette for
 * measurement and a stylesheet that hands the dark one to `.dark` descendants.
 */
function useAuroraSurface(
  brandColor: string,
  mode: AuroraSurfaceMode,
  intensity: AuroraIntensity,
  labelPolicy?: ZitadelLabelPolicy,
  colors?: AuroraBrandColors,
  metrics?: AuroraMetrics
) {
  const scope = React.useId()
  const policyKey = labelPolicy ? JSON.stringify(labelPolicy) : ""
  const colorKey = colors ? JSON.stringify(colors) : ""
  const metricKey = metrics ? JSON.stringify(metrics) : ""

  return React.useMemo(() => {
    const resolvedMetrics = metrics ?? {}
    /** Explicit props beat the policy; the policy beats the design tokens. */
    const forMode = (surfaceMode: AuroraMode): AuroraBrandColors => ({
      ...(labelPolicy ? zitadelLabelPolicyColors(labelPolicy, surfaceMode) : {}),
      ...Object.fromEntries(Object.entries(colors ?? {}).filter(([, value]) => value !== undefined)),
    })

    const build = (surfaceMode: AuroraMode) => {
      const roleColors = forMode(surfaceMode)
      const supplied: AuroraSuppliedRoles = {
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
        style: auroraVariables(light.palette, light.supplied, resolvedMetrics),
        css: null,
      }
    }

    const dark = build("dark")
    const selector = `[data-aurora-scope="${scope}"]`
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
  }, [brandColor, mode, intensity, scope, policyKey, colorKey, metricKey])
}

/** Canvas, washes and grid, painted entirely from the custom properties above. */
function AuroraSurface({ washCount }: { washCount: number }) {
  return (
    <>
      {Array.from({ length: washCount }, (_, i) => (
        <span
          key={i}
          data-aurora-wash=""
          className={cn("absolute block rounded-full", WASH_POSITION[i])}
          style={{ background: `var(--aurora-wash-${i})` }}
        />
      ))}
      <div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_45%,#000_25%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_at_50%_45%,#000_25%,transparent_78%)]"
        style={{
          backgroundSize: "var(--aurora-grid-size, 52px) var(--aurora-grid-size, 52px)",
          backgroundImage:
            "linear-gradient(var(--aurora-gridline) 1px,transparent 1px),linear-gradient(90deg,var(--aurora-gridline) 1px,transparent 1px)",
        }}
      />
    </>
  )
}

export interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tenant primary colour; the whole wash palette is derived from it. */
  brandColor: string
  mode?: AuroraSurfaceMode
  intensity?: AuroraIntensity
  /** Zitadel `LabelPolicy`; supplies every colour role the tenant configured. */
  labelPolicy?: ZitadelLabelPolicy
  /** Per-role overrides. Beat `labelPolicy`, which beats the host's design tokens. */
  colors?: AuroraBrandColors
  /** Non-colour design values (radius, font, card width, blur, grid). */
  metrics?: AuroraMetrics
}

const AuroraBackground = React.forwardRef<HTMLDivElement, AuroraBackgroundProps>(
  (
    { brandColor, mode = "light", intensity = "full", labelPolicy, colors, metrics, className, style, ...props },
    ref
  ) => {
    const surface = useAuroraSurface(brandColor, mode, intensity, labelPolicy, colors, metrics)

    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-aurora-scope={surface.scope}
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
        style={
          {
            background: "var(--aurora-canvas)",
            ...surface.style,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {surface.css ? <style>{surface.css}</style> : null}
        <AuroraSurface washCount={surface.palette.washes.length} />
      </div>
    )
  }
)
AuroraBackground.displayName = "AuroraBackground"

export interface AuroraAuthPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Tenant primary colour, e.g. Zitadel `LabelPolicy.primaryColor`. */
  brandColor: string
  /** `auto` follows the host's `.dark` class; a fixed mode is pinned inline. */
  mode?: AuroraSurfaceMode
  intensity?: AuroraIntensity
  /** Omit when the host app supplies its own heading inside `children`. */
  title?: React.ReactNode
  tagline?: React.ReactNode
  /** Tenant wordmark. Use `useAuroraPalette()` inside it to colour an inline SVG. */
  logo?: React.ReactNode
  footer?: React.ReactNode
  /** Tenants without `disableWatermark` keep the platform mark. */
  watermark?: boolean
  watermarkLabel?: string
  /**
   * Zitadel `LabelPolicy`. Supplies every colour role the tenant configured and,
   * when `mode` is `auto`, the dark variants too. `hideLoginNameSuffix` and
   * `disableWatermark` are read by the form components, not here.
   */
  labelPolicy?: ZitadelLabelPolicy
  /** Per-role colour overrides. Beat `labelPolicy`, which beats the design tokens. */
  colors?: AuroraBrandColors
  /** Radius, font stack, card width, blur and grid size. */
  metrics?: AuroraMetrics
}

const AuroraAuthPanel = React.forwardRef<HTMLDivElement, AuroraAuthPanelProps>(
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
      labelPolicy,
      colors,
      metrics,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const surface = useAuroraSurface(brandColor, mode, intensity, labelPolicy, colors, metrics)
    // `disableWatermark` is the tenant's decision; the prop is the host's default.
    const showWatermark = labelPolicy?.disableWatermark ? false : watermark

    return (
      <AuroraPaletteContext.Provider value={surface.palette}>
        <div
          ref={ref}
          data-aurora-scope={surface.scope}
          className={cn(
            "relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-4 py-8 sm:py-12",
            className
          )}
          style={
            {
              color: "var(--aurora-foreground)",
              fontFamily: "var(--aurora-font)",
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
            style={{ background: "var(--aurora-canvas)" }}
          >
            <AuroraSurface washCount={surface.palette.washes.length} />
          </div>
          <div
            className="relative w-full p-6 text-center sm:p-9"
            style={{
              maxWidth: "var(--aurora-card-width, 404px)",
              borderRadius: "var(--aurora-radius, 1.25rem)",
              backdropFilter: "blur(var(--aurora-card-blur, 28px))",
              WebkitBackdropFilter: "blur(var(--aurora-card-blur, 28px))",
              background: "var(--aurora-card)",
              border: "var(--aurora-border)",
              boxShadow: "var(--aurora-card-shadow)",
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
              <p className="mb-7 text-[0.9375rem]" style={{ color: "var(--aurora-muted)" }}>
                {tagline}
              </p>
            ) : null}
            <div className="text-left">{children}</div>
            {footer ? (
              <p className="mt-7 text-xs" style={{ color: "var(--aurora-subtle)" }}>
                {footer}
              </p>
            ) : null}
          </div>
          {showWatermark ? (
            <p
              className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px]"
              style={{ color: "var(--aurora-subtle)" }}
            >
              {watermarkLabel}
            </p>
          ) : null}
        </div>
      </AuroraPaletteContext.Provider>
    )
  }
)
AuroraAuthPanel.displayName = "AuroraAuthPanel"

export { AuroraAuthPanel, AuroraBackground }
