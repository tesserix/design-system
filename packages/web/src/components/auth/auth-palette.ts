export type AuthSurfaceTheme = "light" | "dark"

export type AuthIntensity = "subtle" | "full" | "flat"

/**
 * Tenant-supplied surface colours. Each overrides the platform default for one
 * role; anything omitted keeps the platform surface. An unparseable value is
 * ignored rather than fatal — a bad colour must not cost a tenant their sign-in
 * page.
 */
export interface AuthBrandColors {
  /** Overrides the `brandColor` argument. */
  primary?: string
  /** The page canvas behind the washes. */
  background?: string
  /** Primary text on the card. */
  font?: string
  /** Destructive and error text. */
  warn?: string
}

export interface AuthPaletteOptions {
  mode?: AuthSurfaceTheme
  intensity?: AuthIntensity
  colors?: AuthBrandColors
}

export interface AuthPalette {
  mode: AuthSurfaceTheme
  intensity: AuthIntensity
  /** Brand colour lifted until it reads AA against the card it sits on. */
  accent: string
  /** Destructive/error text, lifted to AA against the card. */
  warn: string
  canvas: string
  cardBase: string
  cardBackground: string
  cardBorder: string
  cardShadow: string
  foreground: string
  mutedForeground: string
  labelForeground: string
  subtleForeground: string
  inputBackground: string
  inputBorder: string
  /** Hover fill for secondary and provider buttons sitting on the card. */
  surfaceHover: string
  gridline: string
  buttonBackground: string
  buttonForeground: string
  buttonShadow: string
  /** Radial washes, painted back to front. Empty at `flat` intensity. */
  washes: string[]
  /** Flat hexes behind the washes, for branding previews. */
  swatches: { primary: string; secondary: string; tertiary: string }
}

const AA_CONTRAST = 4.5

const SURFACE = {
  light: {
    canvas: "#F6F6FC",
    cardBase: "#FFFFFF",
    cardBackground: "rgba(255,255,255,.92)",
    cardShadow: "0 1px 2px rgba(16,24,40,.06),0 24px 48px -12px rgba(16,24,40,.18)",
    foreground: "#0F1729",
    mutedForeground: "#55606F",
    labelForeground: "#3D4657",
    subtleForeground: "#98A1AE",
    inputBackground: "#FFFFFF",
    inputBorderAlpha: 0.3,
    surfaceHover: "rgba(15,23,41,.05)",
    gridline: "rgba(15,23,41,.03)",
    borderAlpha: 0.22,
    buttonLift: 6,
    buttonForeground: "#FFFFFF",
    washAlpha: [0.28, 0.22, 0.3],
    washLift: [0, 6, 10],
  },
  dark: {
    canvas: "#0F0E2A",
    cardBase: "#19192E",
    cardBackground: "rgba(25,25,46,.62)",
    cardShadow: "0 24px 70px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.07)",
    foreground: "#F8FCF1",
    mutedForeground: "#A8ABD4",
    labelForeground: "#C6C8E4",
    subtleForeground: "#7A7FA5",
    inputBackground: "rgba(15,14,42,.6)",
    inputBorderAlpha: 0.34,
    surfaceHover: "rgba(255,255,255,.07)",
    gridline: "rgba(255,255,255,.045)",
    borderAlpha: 0.24,
    buttonLift: 10,
    buttonForeground: "#0F0E2A",
    washAlpha: [0.4, 0.26, 0.52],
    washLift: [0, -4, -26],
  },
} as const

const WASH_HUE_ROTATION = [0, 38, -42]
const WASH_STOP = [62, 64, 66]

const WARN_DEFAULT = { light: "#B3261E", dark: "#F2B8B5" } as const

/**
 * Parses an optional override, returning `undefined` for anything unusable so
 * the caller falls through to the platform surface.
 */
function optionalHex(input: string | undefined): string | undefined {
  if (!input) return undefined
  try {
    return normalizeHex(input)
  } catch {
    return undefined
  }
}

export function deriveAuthPalette(
  brandColor: string,
  { mode = "light", intensity = "full", colors = {} }: AuthPaletteOptions = {}
): AuthPalette {
  const brand = normalizeHex(colors.primary ?? brandColor)
  const surface = SURFACE[mode]
  const opacity = intensity === "flat" ? 0 : intensity === "subtle" ? 0.5 : 1

  const canvas = optionalHex(colors.background) ?? surface.canvas
  const font = optionalHex(colors.font)
  const foreground = font ?? surface.foreground
  const warn = ensureReadable(optionalHex(colors.warn) ?? WARN_DEFAULT[mode], surface.cardBase)
  // A tenant that recolours its text must not lose the muted/label/subtle ramp,
  // so those are mixed from the chosen font colour toward the card rather than
  // left on the platform greys.
  const ramp = font
    ? {
        muted: mix(font, surface.cardBase, 0.32),
        label: mix(font, surface.cardBase, 0.2),
        subtle: mix(font, surface.cardBase, 0.52),
      }
    : {
        muted: surface.mutedForeground,
        label: surface.labelForeground,
        subtle: surface.subtleForeground,
      }

  const swatchHexes = WASH_HUE_ROTATION.map((rotation, i) =>
    toHex(shift(brand, rotation, surface.washLift[i]))
  )

  return {
    mode,
    intensity,
    accent: ensureReadable(brand, surface.cardBase),
    warn,
    canvas,
    cardBase: surface.cardBase,
    cardBackground: surface.cardBackground,
    cardBorder: `1px solid ${rgba(brand, surface.borderAlpha)}`,
    cardShadow: surface.cardShadow,
    foreground,
    mutedForeground: ramp.muted,
    labelForeground: ramp.label,
    subtleForeground: ramp.subtle,
    inputBackground: surface.inputBackground,
    inputBorder: rgba(brand, surface.inputBorderAlpha),
    surfaceHover: surface.surfaceHover,
    gridline: surface.gridline,
    buttonBackground: `linear-gradient(180deg,${toHex(shift(brand, 0, surface.buttonLift))} 0%,${brand} 100%)`,
    buttonForeground: surface.buttonForeground,
    buttonShadow: `0 8px 22px ${rgba(brand, 0.3)}`,
    washes:
      intensity === "flat"
        ? []
        : swatchHexes.map(
            (hex, i) =>
              `radial-gradient(circle,${rgba(hex, surface.washAlpha[i] * opacity)} 0%,transparent ${WASH_STOP[i]}%)`
          ),
    swatches: { primary: brand, secondary: swatchHexes[1], tertiary: swatchHexes[2] },
  }
}

function normalizeHex(input: string): string {
  const raw = input.trim().replace(/^#/, "")
  const expanded =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    throw new TypeError(`deriveAuthPalette: "${input}" is not a 3- or 6-digit hex colour`)
  }
  return `#${expanded.toUpperCase()}`
}

type Rgb = [number, number, number]

function toRgb(hex: string): Rgb {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function toHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase()
}

function toHsl([r, g, b]: Rgb): [number, number, number] {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255]
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min
  const l = (max + min) / 2
  if (!delta) return [0, 0, l * 100]
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)
  const h =
    max === rn
      ? (gn - bn) / delta + (gn < bn ? 6 : 0)
      : max === gn
        ? (bn - rn) / delta + 2
        : (rn - gn) / delta + 4
  return [h * 60, s * 100, l * 100]
}

function fromHsl(h: number, s: number, l: number): Rgb {
  const hue = ((h % 360) + 360) % 360
  const sn = s / 100
  const ln = l / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = ln - c / 2
  const [r, g, b] =
    hue < 60
      ? [c, x, 0]
      : hue < 120
        ? [x, c, 0]
        : hue < 180
          ? [0, c, x]
          : hue < 240
            ? [0, x, c]
            : hue < 300
              ? [x, 0, c]
              : [c, 0, x]
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ]
}

/** Blends `hex` toward `toward` by `amount` (0 = untouched, 1 = fully `toward`). */
function mix(hex: string, toward: string, amount: number): string {
  const a = toRgb(hex)
  const b = toRgb(toward)
  const t = clamp(amount, 0, 1)
  // Channels must be integers: `round` here is the 3-decimal helper used for
  // HSL maths, and a fractional channel makes `toHex` emit garbage.
  return toHex([
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ])
}

function shift(hex: string, deltaHue: number, deltaLightness: number): Rgb {
  const [h, s, l] = toHsl(toRgb(hex))
  return fromHsl(h + deltaHue, s, clamp(l + deltaLightness, 6, 94))
}

function rgba(hex: string, alpha: number): string {
  return `rgba(${toRgb(hex).join(",")},${round(alpha)})`
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const channel = v / 255
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
  }) as Rgb
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(a: string, b: string): number {
  const [la, lb] = [relativeLuminance(a), relativeLuminance(b)]
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Tenants pick colours that vanish against their own card; walk lightness until AA holds. */
function ensureReadable(hex: string, against: string): string {
  const towardsDark = relativeLuminance(against) > 0.5
  let candidate = hex
  for (let step = 0; step < 40 && contrastRatio(candidate, against) < AA_CONTRAST; step++) {
    const [h, s, l] = toHsl(toRgb(candidate))
    candidate = toHex(fromHsl(h, s, clamp(towardsDark ? l - 3 : l + 3, 4, 96)))
  }
  return candidate
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}
