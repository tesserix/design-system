import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor, within } from "storybook/test"

import { Resizable, ResizablePanel, ResizableHandle } from "./resizable"

const meta = {
  title: "Layout/Resizable",
  component: Resizable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Resizable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Resizable className="h-96 w-full rounded-lg border">
      <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="text-sm font-medium">Left Panel</span>
        </div>
      </ResizablePanel>
      <ResizableHandle data-testid="resizable-handle" />
      <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="text-sm font-medium">Right Panel</span>
        </div>
      </ResizablePanel>
    </Resizable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const leftPanel = canvas.getByText("Left Panel").closest("div[data-size]") as HTMLDivElement
    const rightPanel = canvas.getByText("Right Panel").closest("div[data-size]") as HTMLDivElement
    const container = leftPanel.parentElement as HTMLDivElement
    const handle = canvas.getByTestId("resizable-handle")

    container.getBoundingClientRect = () =>
      ({ width: 200, height: 200, top: 0, left: 0, right: 200, bottom: 200 }) as DOMRect

    fireEvent.mouseDown(handle, { clientX: 100, clientY: 100 })
    fireEvent.mouseMove(document, { clientX: 140, clientY: 100 })
    fireEvent.mouseUp(document)

    await waitFor(() => {
      expect(leftPanel.dataset.size).not.toBe("50")
      expect(rightPanel.dataset.size).not.toBe("50")
    })
  },
}

export const Vertical: Story = {
  render: () => (
    <Resizable direction="vertical" className="h-96 w-full rounded-lg border">
      <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="text-sm font-medium">Top Panel</span>
        </div>
      </ResizablePanel>
      <ResizableHandle data-testid="vertical-handle" />
      <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="text-sm font-medium">Bottom Panel</span>
        </div>
      </ResizablePanel>
    </Resizable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const topPanel = canvas.getByText("Top Panel").closest("div[data-size]") as HTMLDivElement
    const container = topPanel.parentElement as HTMLDivElement
    container.getBoundingClientRect = () =>
      ({ width: 200, height: 200, top: 0, left: 0, right: 200, bottom: 200 }) as DOMRect
    const handle = canvas.getByTestId("vertical-handle")
    fireEvent.mouseDown(handle, { clientY: 100 })
    fireEvent.mouseMove(document, { clientY: 140 })
    fireEvent.mouseUp(document)
    await waitFor(() => expect(topPanel.dataset.size).not.toBe("50"))
  },
}

export const ThreePanels: Story = {
  render: () => (
    <Resizable className="h-96 w-full rounded-lg border">
      <ResizablePanel defaultSize={25} minSize={15} maxSize={50}>
        <div className="flex h-full items-center justify-center p-6 bg-muted/20"><span className="text-sm font-medium">Sidebar</span></div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
        <div className="flex h-full items-center justify-center p-6"><span className="text-sm font-medium">Main Content</span></div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} minSize={15} maxSize={50}>
        <div className="flex h-full items-center justify-center p-6 bg-muted/20"><span className="text-sm font-medium">Info Panel</span></div>
      </ResizablePanel>
    </Resizable>
  ),
}

export const Nested: Story = {
  render: () => (
    <Resizable className="h-96 w-full rounded-lg border">
      <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
        <Resizable direction="vertical" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
            <div className="flex h-full items-center justify-center p-6 bg-blue-50 dark:bg-blue-950/20"><span className="text-sm font-medium">Top Left</span></div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
            <div className="flex h-full items-center justify-center p-6 bg-green-50 dark:bg-green-950/20"><span className="text-sm font-medium">Bottom Left</span></div>
          </ResizablePanel>
        </Resizable>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
        <div className="flex h-full items-center justify-center p-6 bg-purple-50 dark:bg-purple-950/20"><span className="text-sm font-medium">Right Panel</span></div>
      </ResizablePanel>
    </Resizable>
  ),
}

export const CodeEditor: Story = {
  render: () => (
    <Resizable className="h-96 w-full rounded-lg border">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <div className="flex h-full flex-col bg-muted/30 p-4"><h3 className="text-sm font-semibold mb-2">File Explorer</h3></div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={55} minSize={40} maxSize={70}>
        <Resizable direction="vertical" className="h-full">
          <ResizablePanel defaultSize={70} minSize={50} maxSize={90}><div className="flex h-full flex-col p-4"><h3 className="text-sm font-semibold mb-2">Editor</h3></div></ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30} minSize={10} maxSize={50}><div className="flex h-full flex-col bg-muted/30 p-4"><h3 className="text-sm font-semibold mb-2">Terminal</h3></div></ResizablePanel>
        </Resizable>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} minSize={15} maxSize={35}><div className="flex h-full flex-col bg-muted/30 p-4"><h3 className="text-sm font-semibold mb-2">Preview</h3></div></ResizablePanel>
    </Resizable>
  ),
}

export const DisabledHandle: Story = {
  render: () => (
    <Resizable className="h-96 w-full rounded-lg border">
      <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center p-6"><span className="text-sm font-medium">Left Panel (Fixed)</span></div></ResizablePanel>
      <ResizableHandle data-testid="disabled-handle" disabled />
      <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center p-6"><span className="text-sm font-medium">Right Panel (Fixed)</span></div></ResizablePanel>
    </Resizable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const leftPanel = canvas.getByText("Left Panel (Fixed)").closest("div[data-size]") as HTMLDivElement
    const handle = canvas.getByTestId("disabled-handle")
    fireEvent.mouseDown(handle, { clientX: 20 })
    fireEvent.mouseMove(document, { clientX: 140 })
    fireEvent.mouseUp(document)
    await expect(leftPanel.dataset.size).toBe("50")
  },
}

export const FallbackDatasetValues: Story = {
  render: () => (
    <Resizable className="h-40 w-full rounded-lg border">
      <div
        data-testid="fallback-prev"
        style={{ width: "50%", flexShrink: 0 }}
        className="flex items-center justify-center"
      >
        Prev
      </div>
      <ResizableHandle data-testid="fallback-handle" />
      <div
        data-testid="fallback-next"
        style={{ width: "50%", flexShrink: 0 }}
        className="flex items-center justify-center"
      >
        Next
      </div>
    </Resizable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const prev = canvas.getByTestId("fallback-prev") as HTMLDivElement
    const next = canvas.getByTestId("fallback-next") as HTMLDivElement
    const container = prev.parentElement as HTMLDivElement

    container.getBoundingClientRect = () =>
      ({ width: 200, height: 80, top: 0, left: 0, right: 200, bottom: 80 }) as DOMRect

    fireEvent.mouseDown(canvas.getByTestId("fallback-handle"), { clientX: 100 })
    fireEvent.mouseMove(document, { clientX: 130 })
    fireEvent.mouseUp(document)

    await waitFor(() => {
      expect(prev.style.width).toMatch(/%/)
      expect(next.style.width).toMatch(/%/)
    })
  },
}

export const NormalizeSizes: Story = {
  render: () => (
    <Resizable className="h-40 w-full rounded-lg border">
      <ResizablePanel defaultSize={10} minSize={80} maxSize={80}>
        <div className="flex h-full items-center justify-center p-4">Fixed A</div>
      </ResizablePanel>
      <ResizableHandle data-testid="normalize-handle" />
      <ResizablePanel defaultSize={90} minSize={30} maxSize={30}>
        <div className="flex h-full items-center justify-center p-4">Fixed B</div>
      </ResizablePanel>
    </Resizable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const panelA = canvas.getByText("Fixed A").closest("div[data-size]") as HTMLDivElement
    const panelB = canvas.getByText("Fixed B").closest("div[data-size]") as HTMLDivElement
    const container = panelA.parentElement as HTMLDivElement

    container.getBoundingClientRect = () =>
      ({ width: 100, height: 80, top: 0, left: 0, right: 100, bottom: 80 }) as DOMRect

    fireEvent.mouseDown(canvas.getByTestId("normalize-handle"), { clientX: 10 })
    fireEvent.mouseMove(document, { clientX: 90 })
    fireEvent.mouseUp(document)

    await waitFor(() => {
      const sizeA = parseFloat(panelA.dataset.size ?? "0")
      const sizeB = parseFloat(panelB.dataset.size ?? "0")
      expect(sizeA + sizeB).toBeCloseTo(100, 5)
    })
  },
}

export const ImperativeRefHandle: Story = {
  render: () => {
    const handleRef = React.useRef<HTMLDivElement | null>(null)
    const [status, setStatus] = React.useState("pending")

    return (
      <div className="space-y-2">
        <button type="button" onClick={() => setStatus(handleRef.current ? "attached" : "missing")}>
          Check handle ref
        </button>
        <p>{status}</p>
        <Resizable className="h-32 w-full rounded-lg border">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-4">A</div>
          </ResizablePanel>
          <ResizableHandle ref={handleRef} data-testid="ref-handle" />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-4">B</div>
          </ResizablePanel>
        </Resizable>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByTestId("ref-handle")).toBeInTheDocument())
    fireEvent.click(canvas.getByRole("button", { name: "Check handle ref" }))
    await waitFor(() => expect(canvas.getByText("attached")).toBeInTheDocument())
  },
}

export const MissingAdjacentPanels: Story = {
  render: () => (
    <Resizable className="h-32 w-full rounded-lg border">
      <ResizablePanel defaultSize={100}>
        <div className="flex h-full items-center justify-center p-4">Only Panel</div>
      </ResizablePanel>
      <ResizableHandle data-testid="orphan-handle" />
    </Resizable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    fireEvent.mouseDown(canvas.getByTestId("orphan-handle"), { clientX: 50 })
    fireEvent.mouseMove(document, { clientX: 80 })
    fireEvent.mouseUp(document)
    await expect(canvas.getByText("Only Panel")).toBeInTheDocument()
  },
}
