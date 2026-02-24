import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Alert, AlertDescription, AlertTitle } from "./alert"

describe("Alert", () => {
  it("renders an assertive live-region alert with title/description", () => {
    render(
      <Alert variant="warning">
        <AlertTitle>Low disk space</AlertTitle>
        <AlertDescription>Only 5% storage remains.</AlertDescription>
      </Alert>
    )

    const alert = screen.getByRole("alert")
    expect(alert).toHaveTextContent("Low disk space")
    expect(alert).toHaveTextContent("Only 5% storage remains.")
  })
})
