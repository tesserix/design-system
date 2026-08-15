"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import {
  deriveAuroraPalette,
  type AuroraIntensity,
  type AuroraMode,
  type AuroraPalette,
} from "./aurora-palette"

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
  "h-[780px] w-[780px] -top-[260px] -left-[180px]",
  "h-[700px] w-[700px] -bottom-[280px] -right-[140px]",
  "h-[560px] w-[560px] top-[42%] left-[52%]",
]

function auroraVariables(palette: AuroraPalette): Record<string, string> {
  return {
    "--aurora-accent": palette.accent,
    "--aurora-canvas": palette.canvas,
    "--aurora-card": palette.cardBackground,
    "--aurora-card-shadow": palette.cardShadow,
    "--aurora-border": palette.cardBorder,
    "--aurora-input": palette.inputBackground,
    "--aurora-foreground": palette.foreground,
    "--aurora-muted": palette.mutedForeground,
    "--aurora-label": palette.labelForeground,
    "--aurora-subtle": palette.subtleForeground,
    "--aurora-gridline": palette.gridline,
    "--aurora-button": palette.buttonBackground,
    "--aurora-button-foreground": palette.buttonForeground,
    "--aurora-button-shadow": palette.buttonShadow,
    "--aurora-wash-0": palette.washes[0] ?? "none",
    "--aurora-wash-1": palette.washes[1] ?? "none",
    "--aurora-wash-2": palette.washes[2] ?? "none",
  }
}

function declarations(palette: AuroraPalette): string {
  return Object.entries(auroraVariables(palette))
    .map(([name, value]) => `${name}:${value}`)
    .join(";")
}

/**
 * Resolves the surface a component paints. `auto` returns the light palette for
 * measurement and a stylesheet that hands the dark one to `.dark` descendants.
 */
function useAuroraSurface(brandColor: string, mode: AuroraSurfaceMode, intensity: AuroraIntensity) {
  const scope = React.useId()
  return React.useMemo(() => {
    const palette = deriveAuroraPalette(brandColor, {
      mode: mode === "auto" ? "light" : mode,
      intensity,
    })
    if (mode !== "auto") {
      return { palette, scope, style: auroraVariables(palette), css: null }
    }
    const dark = deriveAuroraPalette(brandColor, { mode: "dark", intensity })
    const selector = `[data-aurora-scope="${scope}"]`
    return {
      palette,
      scope,
      style: {} as Record<string, string>,
      css: `${selector}{${declarations(palette)}}.dark ${selector}{${declarations(dark)}}`,
    }
  }, [brandColor, mode, intensity, scope])
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
          backgroundSize: "52px 52px",
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
}

const AuroraBackground = React.forwardRef<HTMLDivElement, AuroraBackgroundProps>(
  ({ brandColor, mode = "light", intensity = "full", className, style, ...props }, ref) => {
    const surface = useAuroraSurface(brandColor, mode, intensity)

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
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const surface = useAuroraSurface(brandColor, mode, intensity)

    return (
      <AuroraPaletteContext.Provider value={surface.palette}>
        <div
          ref={ref}
          data-aurora-scope={surface.scope}
          className={cn(
            "relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12",
            className
          )}
          style={
            {
              color: "var(--aurora-foreground)",
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
            className="relative w-full max-w-[404px] rounded-[1.25rem] p-8 text-center backdrop-blur-[28px] sm:p-10"
            style={{
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
            {title ? <h1 className="mb-1.5 text-2xl font-semibold tracking-tight">{title}</h1> : null}
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
          {watermark ? (
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
