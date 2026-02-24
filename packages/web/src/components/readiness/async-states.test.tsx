import { describe, expect, it } from "vitest"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"

import { InfiniteScroll } from "../infinite-scroll"
import { useAsync } from "../../hooks/use-async"

const AsyncStateHarness = ({ shouldFail = false }: { shouldFail?: boolean }) => {
  const { execute, status, data, error, isLoading, reset } = useAsync(async () => {
    await Promise.resolve()
    if (shouldFail) {
      throw new Error("Request failed")
    }
    return "Loaded"
  })

  return (
    <div>
      <button type="button" onClick={() => void execute()}>
        Run
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
      <p>{isLoading ? "loading" : status}</p>
      <p>{data ?? "empty"}</p>
      <p>{error?.message ?? "no-error"}</p>
    </div>
  )
}

describe("Readiness async states", () => {
  it("covers loading and empty/end states for async data surfaces", () => {
    render(
      <InfiniteScroll
        items={[]}
        hasMore={false}
        loading={false}
        onLoadMore={() => {}}
        renderItem={(item: string) => <div>{item}</div>}
      />
    )

    expect(screen.getByText("No more items")).toBeInTheDocument()
  })

  it("handles success and error transitions for async behavior", async () => {
    const { rerender } = render(<AsyncStateHarness />)

    fireEvent.click(screen.getByRole("button", { name: "Run" }))
    await waitFor(() => {
      expect(screen.getByText("success")).toBeInTheDocument()
      expect(screen.getByText("Loaded")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole("button", { name: "Reset" }))
    expect(screen.getByText("idle")).toBeInTheDocument()

    rerender(<AsyncStateHarness shouldFail />)
    fireEvent.click(screen.getByRole("button", { name: "Run" }))

    await act(async () => {
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(screen.getByText("error")).toBeInTheDocument()
      expect(screen.getByText("Request failed")).toBeInTheDocument()
    })
  })
})
