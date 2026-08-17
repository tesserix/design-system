import { describe, it, expect } from "vitest"

import { deriveAuroraPalette, zitadelLabelPolicyColors } from "./aurora-palette"

const TESSERIX = "#5B5FD6"

describe("deriveAuroraPalette", () => {
  it("keeps a brand colour that already passes AA against the light card", () => {
    expect(deriveAuroraPalette(TESSERIX).accent.toLowerCase()).toBe("#5b5fd6")
  })

  it("darkens a washed-out brand until it passes AA on the light card", () => {
    const { accent } = deriveAuroraPalette("#FFE066")
    expect(accent.toLowerCase()).not.toBe("#ffe066")
    expect(contrast(accent, "#FFFFFF")).toBeGreaterThanOrEqual(4.5)
  })

  it("lightens a near-black brand until it passes AA on the dark card", () => {
    const { accent } = deriveAuroraPalette("#0A0A0A", { mode: "dark" })
    expect(contrast(accent, "#19192E")).toBeGreaterThanOrEqual(4.5)
  })

  it("derives the second and third washes by rotating the brand hue", () => {
    const { swatches } = deriveAuroraPalette("#0E9F6E")
    expect(swatches.primary.toLowerCase()).toBe("#0e9f6e")
    expect(hue(swatches.secondary)).toBeCloseTo((hue("#0E9F6E") + 38) % 360, 0)
    expect(hue(swatches.tertiary)).toBeCloseTo((hue("#0E9F6E") - 42 + 360) % 360, 0)
  })

  it("uses a cool near-white canvas so the brand washes read as tint, not grime", () => {
    expect(deriveAuroraPalette(TESSERIX).canvas).toBe("#F6F6FC")
  })

  it("keeps the light card nearly opaque so it separates from the canvas", () => {
    const light = deriveAuroraPalette(TESSERIX)
    expect(light.cardBackground).toBe("rgba(255,255,255,.92)")
    expect(light.cardShadow).toContain("rgba(16,24,40,.18)")
  })

  it("fills light-mode fields solid so they do not vanish into the card", () => {
    expect(deriveAuroraPalette(TESSERIX).inputBackground).toBe("#FFFFFF")
  })

  it("exposes a hover wash for secondary buttons on both surfaces", () => {
    expect(deriveAuroraPalette(TESSERIX).surfaceHover).toBe("rgba(15,23,41,.05)")
    expect(deriveAuroraPalette(TESSERIX, { mode: "dark" }).surfaceHover).toBe("rgba(255,255,255,.07)")
  })

  it("keeps the light gridline faint enough to stay behind the card", () => {
    expect(deriveAuroraPalette(TESSERIX).gridline).toBe("rgba(15,23,41,.03)")
  })

  it("tints the input border with the brand so fields read on either surface", () => {
    expect(deriveAuroraPalette(TESSERIX).inputBorder).toBe("rgba(91,95,214,0.3)")
    expect(deriveAuroraPalette(TESSERIX, { mode: "dark" }).inputBorder).toBe("rgba(91,95,214,0.34)")
  })

  it("emits three radial washes at full intensity", () => {
    const { washes } = deriveAuroraPalette(TESSERIX)
    expect(washes).toHaveLength(3)
    washes.forEach((w) => expect(w).toMatch(/^radial-gradient\(circle,rgba\(/))
  })

  it("drops every wash at flat intensity", () => {
    expect(deriveAuroraPalette(TESSERIX, { intensity: "flat" }).washes).toEqual([])
  })

  it("halves wash opacity at subtle intensity", () => {
    const full = alphaOf(deriveAuroraPalette(TESSERIX).washes[0])
    const subtle = alphaOf(deriveAuroraPalette(TESSERIX, { intensity: "subtle" }).washes[0])
    expect(subtle).toBeCloseTo(full / 2, 3)
  })

  it("uses a dark canvas and translucent dark card in dark mode", () => {
    const dark = deriveAuroraPalette(TESSERIX, { mode: "dark" })
    expect(dark.canvas).toBe("#0F0E2A")
    expect(dark.cardBase).toBe("#19192E")
    expect(dark.cardBackground).toContain("rgba(25,25,46")
  })

  it("normalises shorthand hex and a missing leading hash", () => {
    expect(deriveAuroraPalette("#5b5fd6").accent).toBe(deriveAuroraPalette("5B5FD6").accent)
    expect(deriveAuroraPalette("#0F0").accent).toBe(deriveAuroraPalette("#00FF00").accent)
  })

  it("rejects a colour it cannot parse", () => {
    expect(() => deriveAuroraPalette("cornflowerblue")).toThrow(/hex colour/i)
  })
})

describe("deriveAuroraPalette theme colour overrides", () => {
  it("paints the canvas with the tenant's background colour", () => {
    const palette = deriveAuroraPalette(TESSERIX, { colors: { background: "#101820" } })
    expect(palette.canvas).toBe("#101820")
  })

  it("uses the tenant's font colour for foreground text", () => {
    const palette = deriveAuroraPalette(TESSERIX, { colors: { font: "#123456" } })
    expect(palette.foreground).toBe("#123456")
  })

  it("exposes the tenant's warn colour", () => {
    const palette = deriveAuroraPalette(TESSERIX, { colors: { warn: "#B3261E" } })
    expect(palette.warn).toBe("#B3261E")
  })

  it("falls back to the platform surface when a colour is not overridden", () => {
    const base = deriveAuroraPalette(TESSERIX)
    const partial = deriveAuroraPalette(TESSERIX, { colors: { warn: "#B3261E" } })
    expect(partial.canvas).toBe(base.canvas)
    expect(partial.foreground).toBe(base.foreground)
  })

  it("ignores an unparseable override rather than throwing", () => {
    const base = deriveAuroraPalette(TESSERIX)
    const palette = deriveAuroraPalette(TESSERIX, { colors: { background: "not-a-colour" } })
    expect(palette.canvas).toBe(base.canvas)
  })

  it("derives muted text from an overridden font colour so it stays legible", () => {
    const palette = deriveAuroraPalette(TESSERIX, { colors: { font: "#123456" } })
    expect(palette.mutedForeground).not.toBe(palette.foreground)
    expect(contrast(palette.mutedForeground, palette.cardBase)).toBeGreaterThanOrEqual(3)
  })
})

describe("zitadelLabelPolicyColors", () => {
  it("picks the light colours for a light surface", () => {
    expect(
      zitadelLabelPolicyColors(
        { primaryColor: "#111111", backgroundColor: "#222222", fontColor: "#333333", warnColor: "#444444" },
        "light"
      )
    ).toEqual({ primary: "#111111", background: "#222222", font: "#333333", warn: "#444444" })
  })

  it("picks the dark colours for a dark surface", () => {
    expect(
      zitadelLabelPolicyColors(
        {
          primaryColor: "#111111",
          primaryColorDark: "#AAAAAA",
          backgroundColorDark: "#BBBBBB",
          fontColorDark: "#CCCCCC",
          warnColorDark: "#DDDDDD",
        },
        "dark"
      )
    ).toEqual({ primary: "#AAAAAA", background: "#BBBBBB", font: "#CCCCCC", warn: "#DDDDDD" })
  })

  it("falls back to the light colour when a dark variant is unset", () => {
    expect(zitadelLabelPolicyColors({ primaryColor: "#111111" }, "dark").primary).toBe("#111111")
  })
})

function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function hue(hex: string): number {
  const [r, g, b] = rgb(hex).map((v) => v / 255) as [number, number, number]
  const max = Math.max(r, g, b)
  const delta = max - Math.min(r, g, b)
  if (!delta) return 0
  const h =
    max === r ? (g - b) / delta + (g < b ? 6 : 0) : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4
  return (h * 60 + 360) % 360
}

function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, b] = rgb(hex).map((v) => {
      const c = v / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    }) as [number, number, number]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const [l1, l2] = [lum(a), lum(b)]
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

function alphaOf(wash: string): number {
  return Number(wash.match(/rgba\([^)]*,([\d.]+)\)/)![1])
}
