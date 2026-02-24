import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { VirtualList } from "./virtual-list"

describe("VirtualList", () => {
  it("renders visible rows", () => {
    render(
      <VirtualList
        items={["Row 1", "Row 2"]}
        itemHeight={30}
        height={60}
        renderItem={(item) => <div>{item}</div>}
      />
    )
    expect(screen.getByText("Row 1")).toBeInTheDocument()
  })

  it("updates rendered rows on scroll", () => {
    const { container } = render(
      <VirtualList
        items={Array.from({ length: 50 }, (_, i) => `Row ${i + 1}`)}
        itemHeight={20}
        height={40}
        renderItem={(item) => <div>{item}</div>}
      />
    )

    const scroller = container.firstChild as HTMLDivElement
    fireEvent.scroll(scroller, { target: { scrollTop: 120 } })
    expect(screen.getByText("Row 7")).toBeInTheDocument()
  })
})
