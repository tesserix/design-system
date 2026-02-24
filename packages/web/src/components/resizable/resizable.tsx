import * as React from "react"

import { cn } from "../../lib/utils"

interface ResizableContextValue {
  direction: "horizontal" | "vertical"
}

const ResizableContext = React.createContext<ResizableContextValue | undefined>(undefined)

const useResizable = () => {
  const context = React.useContext(ResizableContext)
  if (!context) {
    throw new Error("Resizable components must be used within Resizable")
  }
  return context
}

export interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical"
}

const Resizable = React.forwardRef<HTMLDivElement, ResizableProps>(
  ({ className, direction = "horizontal", children, ...props }, ref) => {
    return (
      <ResizableContext.Provider value={{ direction }}>
        <div
          ref={ref}
          className={cn(
            "flex w-full",
            direction === "horizontal" ? "flex-row" : "flex-col",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ResizableContext.Provider>
    )
  }
)
Resizable.displayName = "Resizable"

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number
  minSize?: number
  maxSize?: number
}

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      className,
      defaultSize = 50,
      minSize = 10,
      maxSize = 90,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const { direction } = useResizable()
    const [size] = React.useState(defaultSize)

    return (
      <div
        ref={ref}
        className={cn("relative overflow-auto", className)}
        style={{
          ...style,
          [direction === "horizontal" ? "width" : "height"]: `${size}%`,
          flexShrink: 0,
        }}
        data-size={size}
        data-min-size={minSize}
        data-max-size={maxSize}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ResizablePanel.displayName = "ResizablePanel"

export interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean
}

const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ className, disabled = false, ...props }, ref) => {
    const { direction } = useResizable()
    const handleRef = React.useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = React.useState(false)

    React.useImperativeHandle(ref, () => handleRef.current!)

    const handleMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        if (disabled) return

        e.preventDefault()
        setIsDragging(true)

        const handle = handleRef.current
        if (!handle) return

        const container = handle.parentElement
        if (!container) return

        const previousPanel = handle.previousElementSibling as HTMLDivElement
        const nextPanel = handle.nextElementSibling as HTMLDivElement

        if (!previousPanel || !nextPanel) return

        const containerRect = container.getBoundingClientRect()
        const previousMinSize = parseFloat(previousPanel.dataset.minSize || "10")
        const previousMaxSize = parseFloat(previousPanel.dataset.maxSize || "90")
        const nextMinSize = parseFloat(nextPanel.dataset.minSize || "10")
        const nextMaxSize = parseFloat(nextPanel.dataset.maxSize || "90")

        const startPos = direction === "horizontal" ? e.clientX : e.clientY
        const containerSize =
          direction === "horizontal" ? containerRect.width : containerRect.height
        const previousSize = parseFloat(previousPanel.dataset.size || "50")
        const nextSize = parseFloat(nextPanel.dataset.size || "50")

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const currentPos =
            direction === "horizontal" ? moveEvent.clientX : moveEvent.clientY
          const delta = ((currentPos - startPos) / containerSize) * 100

          let newPreviousSize = previousSize + delta
          let newNextSize = nextSize - delta

          // Apply constraints
          newPreviousSize = Math.max(previousMinSize, Math.min(previousMaxSize, newPreviousSize))
          newNextSize = Math.max(nextMinSize, Math.min(nextMaxSize, newNextSize))

          // Ensure total is 100%
          const total = newPreviousSize + newNextSize
          if (total !== 100) {
            const scale = 100 / total
            newPreviousSize *= scale
            newNextSize *= scale
          }

          previousPanel.style[direction === "horizontal" ? "width" : "height"] = `${newPreviousSize}%`
          nextPanel.style[direction === "horizontal" ? "width" : "height"] = `${newNextSize}%`
          previousPanel.dataset.size = String(newPreviousSize)
          nextPanel.dataset.size = String(newNextSize)
        }

        const handleMouseUp = () => {
          setIsDragging(false)
          document.removeEventListener("mousemove", handleMouseMove)
          document.removeEventListener("mouseup", handleMouseUp)
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
      },
      [direction, disabled]
    )

    return (
      <div
        ref={handleRef}
        className={cn(
          "group relative flex items-center justify-center bg-border",
          direction === "horizontal"
            ? "w-px cursor-col-resize hover:w-1"
            : "h-px cursor-row-resize hover:h-1",
          disabled && "cursor-not-allowed opacity-50",
          isDragging && direction === "horizontal" && "w-1",
          isDragging && direction === "vertical" && "h-1",
          className
        )}
        onMouseDown={handleMouseDown}
        {...props}
      >
        <div
          className={cn(
            "absolute z-10 flex items-center justify-center rounded bg-border transition-all",
            direction === "horizontal"
              ? "h-8 w-1 group-hover:w-1.5"
              : "h-1 w-8 group-hover:h-1.5",
            isDragging && direction === "horizontal" && "w-1.5",
            isDragging && direction === "vertical" && "h-1.5"
          )}
        >
          <div
            className={cn(
              "rounded-full bg-background",
              direction === "horizontal" ? "h-3 w-0.5" : "h-0.5 w-3"
            )}
          />
        </div>
      </div>
    )
  }
)
ResizableHandle.displayName = "ResizableHandle"

export { Resizable, ResizablePanel, ResizableHandle }
