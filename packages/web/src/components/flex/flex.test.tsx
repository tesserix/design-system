import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Flex } from "./flex"

describe("Flex", () => {
  it("renders flex container", () => {
    const { container } = render(<Flex>content</Flex>)
    expect(container.firstChild).toHaveClass("flex")
  })
})
