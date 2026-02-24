import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, fireEvent, waitFor, within } from "storybook/test"

import { ImageCropper } from "./image-cropper"

const meta = {
  title: "Input/ImageCropper",
  component: ImageCropper,
  tags: ["autodocs"],
  args: {
    src: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80&auto=format&fit=crop",
  },
} satisfies Meta<typeof ImageCropper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [status, setStatus] = React.useState("Idle")
    return (
      <div className="space-y-2">
        <ImageCropper
          {...args}
          onCrop={() => {
            setStatus("Cropped")
          }}
        />
        <p className="text-xs text-muted-foreground">Status: {status}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const OriginalImage = globalThis.Image
    const originalGetContext = HTMLCanvasElement.prototype.getContext
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL

    class MockImage {
      width = 200
      height = 100
      onload: null | (() => void) = null
      set src(_: string) {
        this.onload?.()
      }
    }

    globalThis.Image = MockImage as unknown as typeof Image
    HTMLCanvasElement.prototype.getContext = ((() => ({
      clearRect: () => {},
      drawImage: () => {},
    })) as unknown) as typeof HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.toDataURL = (() => "data:image/png;base64,mock") as typeof HTMLCanvasElement.prototype.toDataURL

    const canvas = within(canvasElement)
    fireEvent.change(canvas.getByRole("slider"), { target: { value: "2" } })
    fireEvent.click(canvas.getByRole("button", { name: "Crop Image" }))

    await waitFor(() => {
      expect(canvas.getByText("Status: Cropped")).toBeInTheDocument()
    })

    globalThis.Image = OriginalImage
    HTMLCanvasElement.prototype.getContext = originalGetContext
    HTMLCanvasElement.prototype.toDataURL = originalToDataURL
  },
}

export const CustomSize: Story = {
  args: {
    size: 180,
  },
}

export const NoCanvasContext: Story = {
  render: (args) => {
    const [status, setStatus] = React.useState("Idle")
    return (
      <div className="space-y-2">
        <ImageCropper {...args} onCrop={() => setStatus("Cropped")} />
        <p className="text-xs text-muted-foreground">Status: {status}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext
    const canvas = within(canvasElement)
    fireEvent.click(canvas.getByRole("button", { name: "Crop Image" }))
    await expect(canvas.getByText("Status: Idle")).toBeInTheDocument()
    HTMLCanvasElement.prototype.getContext = originalGetContext
  },
}
