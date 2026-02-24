import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { ImageCropper } from "./image-cropper"

describe("ImageCropper", () => {
  it("renders crop button", () => {
    render(<ImageCropper src="https://example.com/image.jpg" />)
    expect(screen.getByRole("button", { name: "Crop Image" })).toBeInTheDocument()
  })

  it("crops image and triggers callback", () => {
    const onCrop = vi.fn()
    const drawImage = vi.fn()
    const clearRect = vi.fn()

    const imageMock = class {
      width = 200
      height = 100
      onload: null | (() => void) = null
      set src(_: string) {
        this.onload?.()
      }
    }
    vi.stubGlobal("Image", imageMock as unknown as typeof Image)
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({ drawImage, clearRect })) as unknown as typeof HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.toDataURL = vi.fn(() => "data:image/png;base64,mock")

    render(<ImageCropper src="https://example.com/image.jpg" onCrop={onCrop} />)
    fireEvent.change(screen.getByRole("slider"), { target: { value: "2" } })
    fireEvent.click(screen.getByRole("button", { name: "Crop Image" }))

    expect(clearRect).toHaveBeenCalled()
    expect(drawImage).toHaveBeenCalled()
    expect(onCrop).toHaveBeenCalledWith("data:image/png;base64,mock")
  })

  it("returns early when canvas context is unavailable", () => {
    const onCrop = vi.fn()
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext

    render(<ImageCropper src="https://example.com/image.jpg" onCrop={onCrop} />)
    fireEvent.click(screen.getByRole("button", { name: "Crop Image" }))

    expect(onCrop).not.toHaveBeenCalled()
  })

  it("applies custom size on crop viewport", () => {
    render(<ImageCropper src="https://example.com/image.jpg" size={180} />)

    const viewport = screen.getByAltText("Crop source").parentElement as HTMLDivElement
    expect(viewport.style.width).toBe("180px")
    expect(viewport.style.height).toBe("180px")
  })
})
