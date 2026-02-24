import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

import { FadeIn, ScaleIn, SlideIn, useAnimatedValue } from "./animation"

describe("animation utilities", () => {
  it("renders fade, slide, and scale animations", async () => {
    vi.useFakeTimers()

    render(
      <div>
        <FadeIn delay={10} direction="up">
          <span>fade</span>
        </FadeIn>
        <SlideIn from="left" delay={10}>
          <span>slide</span>
        </SlideIn>
        <ScaleIn delay={10}>
          <span>scale</span>
        </ScaleIn>
      </div>
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(20)
    })

    expect(screen.getByText("fade")).toBeInTheDocument()
    expect(screen.getByText("slide")).toBeInTheDocument()
    expect(screen.getByText("scale")).toBeInTheDocument()
    vi.useRealTimers()
  })

  it("animates values with requestAnimationFrame", async () => {
    vi.useFakeTimers()
    const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb: FrameRequestCallback) => {
      return window.setTimeout(() => cb(performance.now()), 16) as unknown as number
    })

    const Harness = () => {
      const [target, setTarget] = React.useState(0)
      const value = useAnimatedValue(target, 50)
      React.useEffect(() => {
        setTarget(100)
      }, [])
      return <span>{Math.round(value)}</span>
    }

    render(<Harness />)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200)
    })

    expect(raf).toHaveBeenCalled()
    expect(Number(screen.getByText(/^\d+$/).textContent)).toBeGreaterThan(0)
    vi.useRealTimers()
  })
})
