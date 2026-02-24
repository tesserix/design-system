import * as React from "react"

import { cn } from "../../lib/utils"

export interface ColorPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string
  onChange?: (color: string) => void
  disabled?: boolean
  showInput?: boolean
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 0 }

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (h < 60) {
    r = c
    g = x
    b = 0
  } else if (h < 120) {
    r = x
    g = c
    b = 0
  } else if (h < 180) {
    r = 0
    g = c
    b = x
  } else if (h < 240) {
    r = 0
    g = x
    b = c
  } else if (h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ className, value = "#000000", onChange, disabled = false, showInput = true, ...props }, ref) => {
    const [hexInput, setHexInput] = React.useState(value)
    const hsl = React.useMemo(() => hexToHSL(value), [value])
    const [h, setH] = React.useState(hsl.h)
    const [s, setS] = React.useState(hsl.s)
    const [l, setL] = React.useState(hsl.l)

    React.useEffect(() => {
      const newHsl = hexToHSL(value)
      setH(newHsl.h)
      setS(newHsl.s)
      setL(newHsl.l)
      setHexInput(value)
    }, [value])

    const updateColor = (newH: number, newS: number, newL: number) => {
      const hex = hslToHex(newH, newS, newL)
      setHexInput(hex)
      onChange?.(hex)
    }

    const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newH = parseInt(e.target.value)
      setH(newH)
      updateColor(newH, s, l)
    }

    const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newS = parseInt(e.target.value)
      setS(newS)
      updateColor(h, newS, l)
    }

    const handleLightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newL = parseInt(e.target.value)
      setL(newL)
      updateColor(h, s, newL)
    }

    const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value
      setHexInput(input)

      if (/^#[0-9A-F]{6}$/i.test(input)) {
        const newHsl = hexToHSL(input)
        setH(newHsl.h)
        setS(newHsl.s)
        setL(newHsl.l)
        onChange?.(input)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex flex-col gap-4 rounded-lg border bg-card p-4",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-md border-2 border-border shadow-sm"
            style={{ backgroundColor: value }}
            aria-label="Color preview"
          />
          {showInput && (
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInputChange}
              disabled={disabled}
              className={cn(
                "flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              )}
              placeholder="#000000"
              maxLength={7}
            />
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Hue</label>
              <span className="text-sm text-muted-foreground">{h}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={h}
              onChange={handleHueChange}
              disabled={disabled}
              className="w-full"
              style={{
                background: `linear-gradient(to right,
                  hsl(0, 100%, 50%),
                  hsl(60, 100%, 50%),
                  hsl(120, 100%, 50%),
                  hsl(180, 100%, 50%),
                  hsl(240, 100%, 50%),
                  hsl(300, 100%, 50%),
                  hsl(360, 100%, 50%))`,
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Saturation</label>
              <span className="text-sm text-muted-foreground">{s}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={s}
              onChange={handleSaturationChange}
              disabled={disabled}
              className="w-full"
              style={{
                background: `linear-gradient(to right, hsl(${h}, 0%, ${l}%), hsl(${h}, 100%, ${l}%))`,
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Lightness</label>
              <span className="text-sm text-muted-foreground">{l}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={l}
              onChange={handleLightnessChange}
              disabled={disabled}
              className="w-full"
              style={{
                background: `linear-gradient(to right, hsl(${h}, ${s}%, 0%), hsl(${h}, ${s}%, 50%), hsl(${h}, ${s}%, 100%))`,
              }}
            />
          </div>
        </div>
      </div>
    )
  }
)
ColorPicker.displayName = "ColorPicker"

export { ColorPicker }
