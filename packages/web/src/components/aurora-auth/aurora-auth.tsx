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

export function useAuroraPalette(): AuroraPalette {
  const palette = React.useContext(AuroraPaletteContext)
  if (!palette) {
    throw new Error("useAuroraPalette must be used inside an AuroraAuthPanel")
  }
  return palette
}

const WASH_POSITION = [
  "h-[780px] w-[780px] -top-[260px] -left-[180px]",
  "h-[700px] w-[700px] -bottom-[280px] -right-[140px]",
  "h-[560px] w-[560px] top-[42%] left-[52%]",
]

export interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tenant primary colour; the whole wash palette is derived from it. */
  brandColor: string
  mode?: AuroraMode
  intensity?: AuroraIntensity
}

const AuroraBackground = React.forwardRef<HTMLDivElement, AuroraBackgroundProps>(
  ({ brandColor, mode = "light", intensity = "full", className, style, ...props }, ref) => {
    const palette = React.useMemo(
      () => deriveAuroraPalette(brandColor, { mode, intensity }),
      [brandColor, mode, intensity]
    )

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
        style={{ background: palette.canvas, ...style }}
        {...props}
      >
        {palette.washes.map((wash, i) => (
          <span
            key={i}
            data-aurora-wash=""
            className={cn("absolute block rounded-full", WASH_POSITION[i])}
            style={{ background: wash }}
          />
        ))}
        <div
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_45%,#000_25%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_at_50%_45%,#000_25%,transparent_78%)]"
          style={{
            backgroundSize: "52px 52px",
            backgroundImage: `linear-gradient(${palette.gridline} 1px,transparent 1px),linear-gradient(90deg,${palette.gridline} 1px,transparent 1px)`,
          }}
        />
      </div>
    )
  }
)
AuroraBackground.displayName = "AuroraBackground"

export interface AuroraAuthPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Tenant primary colour, e.g. Zitadel `LabelPolicy.primaryColor`. */
  brandColor: string
  /** Resolve `auto` to a concrete mode before rendering; server and client must agree. */
  mode?: AuroraMode
  intensity?: AuroraIntensity
  title: React.ReactNode
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
    const palette = React.useMemo(
      () => deriveAuroraPalette(brandColor, { mode, intensity }),
      [brandColor, mode, intensity]
    )

    return (
      <AuroraPaletteContext.Provider value={palette}>
        <div
          ref={ref}
          className={cn(
            "relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12",
            className
          )}
          style={
            {
              color: palette.foreground,
              "--aurora-accent": palette.accent,
              "--aurora-canvas": palette.canvas,
              "--aurora-card": palette.cardBackground,
              "--aurora-border": palette.cardBorder,
              "--aurora-input": palette.inputBackground,
              "--aurora-foreground": palette.foreground,
              "--aurora-muted": palette.mutedForeground,
              "--aurora-label": palette.labelForeground,
              "--aurora-button": palette.buttonBackground,
              "--aurora-button-foreground": palette.buttonForeground,
              "--aurora-button-shadow": palette.buttonShadow,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          <AuroraBackground brandColor={brandColor} mode={mode} intensity={intensity} />
          <div
            className="relative w-full max-w-[404px] rounded-[1.25rem] p-8 text-center backdrop-blur-[28px] sm:p-10"
            style={{
              background: palette.cardBackground,
              border: palette.cardBorder,
              boxShadow: palette.cardShadow,
            }}
          >
            {logo ? (
              <div className="mb-6 flex h-[34px] items-center justify-center [&_img]:max-h-[34px] [&_img]:w-auto [&_svg]:max-h-[34px]">
                {logo}
              </div>
            ) : null}
            <h1 className="mb-1.5 text-2xl font-semibold tracking-tight">{title}</h1>
            {tagline ? (
              <p className="mb-7 text-[0.9375rem]" style={{ color: palette.mutedForeground }}>
                {tagline}
              </p>
            ) : null}
            <div className="text-left">{children}</div>
            {footer ? (
              <p className="mt-7 text-xs" style={{ color: palette.subtleForeground }}>
                {footer}
              </p>
            ) : null}
          </div>
          {watermark ? (
            <p
              className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px]"
              style={{ color: palette.subtleForeground }}
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
