import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { InfiniteScroll } from "./infinite-scroll"

class MockIntersectionObserver {
  public observe = vi.fn()
  public disconnect = vi.fn()
  static callback: ((entries: IntersectionObserverEntry[]) => void) | null = null

  constructor(cb: (entries: IntersectionObserverEntry[]) => void) {
    MockIntersectionObserver.callback = cb
  }
}

describe("InfiniteScroll", () => {
  it("renders items", () => {
    render(
      <InfiniteScroll items={["A"]} hasMore={false} onLoadMore={() => {}} renderItem={(item) => <div>{item}</div>} />
    )
    expect(screen.getByText("A")).toBeInTheDocument()
  })

  it("renders end message when hasMore is false", () => {
    render(
      <InfiniteScroll items={[]} hasMore={false} onLoadMore={() => {}} renderItem={() => null} />
    )
    expect(screen.getByText("No more items")).toBeInTheDocument()
  })

  it("uses custom loader while loading", () => {
    render(
      <InfiniteScroll
        items={["A"]}
        hasMore
        loading
        loader={<div>Loading custom</div>}
        onLoadMore={() => {}}
        renderItem={(item) => <div>{item}</div>}
      />
    )

    expect(screen.getByText("Loading custom")).toBeInTheDocument()
  })

  it("triggers onLoadMore when sentinel intersects", () => {
    const originalObserver = globalThis.IntersectionObserver
    const onLoadMore = vi.fn()
    globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver

    render(
      <InfiniteScroll
        items={["A"]}
        hasMore
        onLoadMore={onLoadMore}
        renderItem={(item) => <div>{item}</div>}
      />
    )

    expect(onLoadMore).not.toHaveBeenCalled()
    MockIntersectionObserver.callback?.([{ isIntersecting: true } as IntersectionObserverEntry])
    expect(onLoadMore).toHaveBeenCalledTimes(1)

    globalThis.IntersectionObserver = originalObserver
  })
})
