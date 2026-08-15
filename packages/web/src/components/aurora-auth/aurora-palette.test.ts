import { describe, it, expect } from "vitest"

import { deriveAuroraPalette } from "./aurora-palette"

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
