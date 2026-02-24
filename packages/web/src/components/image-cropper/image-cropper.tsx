import * as React from "react"

import { cn } from "../../lib/utils"

export interface ImageCropperProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
  size?: number
  onCrop?: (dataUrl: string) => void
}

const ImageCropper = React.forwardRef<HTMLDivElement, ImageCropperProps>(
  ({ className, src, size = 220, onCrop, ...props }, ref) => {
    const [zoom, setZoom] = React.useState(1)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    const crop = () => {
      const canvas = canvasRef.current as HTMLCanvasElement
      const context = canvas.getContext("2d")
      if (!context) return

      const image = new Image()
      image.onload = () => {
        canvas.width = size
        canvas.height = size

        const sourceSize = Math.min(image.width, image.height)
        const cropSize = sourceSize / zoom
        const sx = (image.width - cropSize) / 2
        const sy = (image.height - cropSize) / 2

        context.clearRect(0, 0, size, size)
        context.drawImage(image, sx, sy, cropSize, cropSize, 0, 0, size, size)
        onCrop?.(canvas.toDataURL("image/png"))
      }
      image.src = src
    }

    return (
      <div ref={ref} className={cn("space-y-3 rounded-xl border p-4", className)} {...props}>
        <div className="overflow-hidden rounded-xl border" style={{ width: size, height: size }}>
          <img src={src} alt="Crop source" className="h-full w-full object-cover" style={{ transform: `scale(${zoom})` }} />
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
          className="w-full"
        />
        <button type="button" className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground" onClick={crop}>
          Crop Image
        </button>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    )
  }
)
ImageCropper.displayName = "ImageCropper"

export { ImageCropper }
