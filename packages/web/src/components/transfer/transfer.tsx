import * as React from "react"

import { cn } from "../../lib/utils"

export interface TransferItem {
  id: string
  label: string
}

export interface TransferProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  sourceItems: TransferItem[]
  targetItems?: TransferItem[]
  onItemsChange?: (payload: { sourceItems: TransferItem[]; targetItems: TransferItem[] }) => void
}

const Transfer = React.forwardRef<HTMLDivElement, TransferProps>(
  ({ className, sourceItems, targetItems = [], onItemsChange, ...props }, ref) => {
    const [leftItems, setLeftItems] = React.useState(sourceItems)
    const [rightItems, setRightItems] = React.useState(targetItems)
    const [selectedLeft, setSelectedLeft] = React.useState<string[]>([])
    const [selectedRight, setSelectedRight] = React.useState<string[]>([])

    const emitChange = (nextLeft: TransferItem[], nextRight: TransferItem[]) => {
      onItemsChange?.({ sourceItems: nextLeft, targetItems: nextRight })
    }

    const moveRight = () => {
      const moving = leftItems.filter((item) => selectedLeft.includes(item.id))
      const nextLeft = leftItems.filter((item) => !selectedLeft.includes(item.id))
      const nextRight = [...rightItems, ...moving]
      setLeftItems(nextLeft)
      setRightItems(nextRight)
      setSelectedLeft([])
      emitChange(nextLeft, nextRight)
    }

    const moveLeft = () => {
      const moving = rightItems.filter((item) => selectedRight.includes(item.id))
      const nextRight = rightItems.filter((item) => !selectedRight.includes(item.id))
      const nextLeft = [...leftItems, ...moving]
      setRightItems(nextRight)
      setLeftItems(nextLeft)
      setSelectedRight([])
      emitChange(nextLeft, nextRight)
    }

    const toggle = (selected: string[], setSelected: (ids: string[]) => void, id: string) => {
      setSelected(selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id])
    }

    return (
      <div ref={ref} className={cn("grid grid-cols-[1fr_auto_1fr] items-center gap-4", className)} {...props}>
        <div className="min-h-56 rounded-xl border p-3">
          {leftItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                "mb-1 w-full rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-accent",
                selectedLeft.includes(item.id) && "bg-accent"
              )}
              onClick={() => toggle(selectedLeft, setSelectedLeft, item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <button type="button" className="rounded-lg border px-3 py-1.5 text-sm" onClick={moveRight}>
            {">"}
          </button>
          <button type="button" className="rounded-lg border px-3 py-1.5 text-sm" onClick={moveLeft}>
            {"<"}
          </button>
        </div>

        <div className="min-h-56 rounded-xl border p-3">
          {rightItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                "mb-1 w-full rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-accent",
                selectedRight.includes(item.id) && "bg-accent"
              )}
              onClick={() => toggle(selectedRight, setSelectedRight, item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    )
  }
)
Transfer.displayName = "Transfer"

export { Transfer }
