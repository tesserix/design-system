import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Callout, CalloutTitle } from "./callout"

describe("Callout", () => {
  it("renders title", () => {
    render(
      <Callout>
        <CalloutTitle>Hello</CalloutTitle>
      </Callout>
    )

    expect(screen.getByText("Hello")).toBeInTheDocument()
  })
})
