import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { CronBuilder, toCronExpression } from "./cron-builder"

describe("CronBuilder", () => {
  it("builds hourly cron expressions", () => {
    expect(
      toCronExpression({
        frequency: "hourly",
        interval: 2,
        minute: 15,
        hour: 0,
        days: ["MON"],
      })
    ).toBe("15 */2 * * *")
  })

  it("builds weekly cron expressions", () => {
    expect(
      toCronExpression({
        frequency: "weekly",
        interval: 1,
        minute: 30,
        hour: 9,
        days: ["MON", "FRI"],
      })
    ).toBe("30 9 * * 1,5")
  })

  it("emits value changes", () => {
    const onValueChange = vi.fn()
    render(<CronBuilder onValueChange={onValueChange} />)

    fireEvent.change(screen.getByLabelText("Frequency"), { target: { value: "weekly" } })
    expect(onValueChange).toHaveBeenCalled()
  })
})
