import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Resizable, ResizableHandle, ResizablePanel } from "./resizable"

describe("Resizable", () => {
  it("renders panels with horizontal defaults and allows dragging", () => {
    render(
      <Resizable>
        <ResizablePanel defaultSize={40} minSize={20} maxSize={80}>
          Left
        </ResizablePanel>
        <ResizableHandle data-testid="h-handle" />
        <ResizablePanel defaultSize={60} minSize={20} maxSize={80}>
          Right
        </ResizablePanel>
      </Resizable>
    )

    const leftPanel = screen.getByText("Left").closest("div[data-size]") as HTMLDivElement
    const rightPanel = screen.getByText("Right").closest("div[data-size]") as HTMLDivElement
    const container = leftPanel.parentElement as HTMLDivElement
    const handle = screen.getByTestId("h-handle")

    container.getBoundingClientRect = () =>
      ({
        width: 200,
        height: 200,
        top: 0,
        left: 0,
        right: 200,
        bottom: 200,
      }) as DOMRect

    fireEvent.mouseDown(handle, { clientX: 100, clientY: 100 })
    fireEvent.mouseMove(document, { clientX: 130, clientY: 100 })
    fireEvent.mouseUp(document)

    expect(leftPanel.dataset.size).not.toBe("40")
    expect(rightPanel.dataset.size).not.toBe("60")
    expect(parseFloat(leftPanel.dataset.size ?? "0")).toBeGreaterThan(40)
    expect(parseFloat(rightPanel.dataset.size ?? "100")).toBeLessThan(60)
  })

  it("supports vertical direction and disabled handles", () => {
    render(
      <Resizable direction="vertical">
        <ResizablePanel defaultSize={30}>Top</ResizablePanel>
        <ResizableHandle data-testid="v-handle" disabled />
        <ResizablePanel defaultSize={70}>Bottom</ResizablePanel>
      </Resizable>
    )

    const topPanel = screen.getByText("Top").closest("div[data-size]") as HTMLDivElement
    const bottomPanel = screen.getByText("Bottom").closest("div[data-size]") as HTMLDivElement
    const wrapper = topPanel.parentElement as HTMLDivElement
    const handle = screen.getByTestId("v-handle")

    expect(wrapper.className).toContain("flex-col")
    expect(topPanel.style.height).toBe("30%")
    expect(bottomPanel.style.height).toBe("70%")

    fireEvent.mouseDown(handle, { clientY: 50 })
    fireEvent.mouseMove(document, { clientY: 90 })
    fireEvent.mouseUp(document)

    expect(topPanel.dataset.size).toBe("30")
    expect(bottomPanel.dataset.size).toBe("70")
  })

  it("applies panel constraints during drag", () => {
    render(
      <Resizable>
        <ResizablePanel defaultSize={10} minSize={30} maxSize={40}>
          A
        </ResizablePanel>
        <ResizableHandle data-testid="limit-handle" />
        <ResizablePanel defaultSize={90} minSize={60} maxSize={70}>
          B
        </ResizablePanel>
      </Resizable>
    )

    const panelA = screen.getByText("A").closest("div[data-size]") as HTMLDivElement
    const panelB = screen.getByText("B").closest("div[data-size]") as HTMLDivElement
    const container = panelA.parentElement as HTMLDivElement

    container.getBoundingClientRect = () =>
      ({ width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100 }) as DOMRect

    fireEvent.mouseDown(screen.getByTestId("limit-handle"), { clientX: 10 })
    fireEvent.mouseMove(document, { clientX: 90 })
    fireEvent.mouseUp(document)

    expect(parseFloat(panelA.dataset.size ?? "0")).toBeGreaterThanOrEqual(30)
    expect(parseFloat(panelB.dataset.size ?? "0")).toBeGreaterThanOrEqual(60)
  })

  it("normalizes panel sizes when constrained total is not 100", () => {
    render(
      <Resizable>
        <ResizablePanel defaultSize={10} minSize={80} maxSize={80}>
          Fixed A
        </ResizablePanel>
        <ResizableHandle data-testid="normalize-handle" />
        <ResizablePanel defaultSize={90} minSize={30} maxSize={30}>
          Fixed B
        </ResizablePanel>
      </Resizable>
    )

    const panelA = screen.getByText("Fixed A").closest("div[data-size]") as HTMLDivElement
    const panelB = screen.getByText("Fixed B").closest("div[data-size]") as HTMLDivElement
    const container = panelA.parentElement as HTMLDivElement

    container.getBoundingClientRect = () =>
      ({ width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100 }) as DOMRect

    fireEvent.mouseDown(screen.getByTestId("normalize-handle"), { clientX: 10 })
    fireEvent.mouseMove(document, { clientX: 90 })
    fireEvent.mouseUp(document)

    const sizeA = parseFloat(panelA.dataset.size ?? "0")
    const sizeB = parseFloat(panelB.dataset.size ?? "0")
    expect(sizeA + sizeB).toBeCloseTo(100, 5)
  })

  it("throws when panel/handle are used outside context", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => render(<ResizablePanel>Orphan panel</ResizablePanel>)).toThrow(
      "Resizable components must be used within Resizable"
    )
    expect(() => render(<ResizableHandle />)).toThrow("Resizable components must be used within Resizable")

    consoleError.mockRestore()
  })
})
