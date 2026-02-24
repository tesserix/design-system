import * as React from "react"

import { cn } from "../../lib/utils"

export interface KanbanCard {
  id: string
  title: string
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
}

export interface KanbanProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: KanbanColumn[]
  onColumnsChange?: (columns: KanbanColumn[]) => void
}

const Kanban = React.forwardRef<HTMLDivElement, KanbanProps>(
  ({ className, columns, onColumnsChange, ...props }, ref) => {
    const [state, setState] = React.useState(columns)

    const moveCard = (columnIndex: number, cardIndex: number, direction: -1 | 1) => {
      const targetIndex = columnIndex + direction
      if (targetIndex < 0 || targetIndex >= state.length) return

      const next = state.map((column) => ({ ...column, cards: [...column.cards] }))
      const card = next[columnIndex].cards.splice(cardIndex, 1)[0] as KanbanCard
      next[targetIndex].cards.push(card)
      setState(next)
      onColumnsChange?.(next)
    }

    return (
      <div ref={ref} className={cn("grid gap-4 md:grid-cols-3", className)} {...props}>
        {state.map((column, columnIndex) => (
          <section key={column.id} className="rounded-xl border bg-card p-3">
            <h3 className="mb-3 text-sm font-semibold">{column.title}</h3>
            <div className="space-y-2">
              {column.cards.map((card, cardIndex) => (
                <article key={card.id} className="rounded-lg border bg-background p-3 text-sm">
                  <p>{card.title}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className="rounded border px-2 py-1 text-xs"
                      onClick={() => moveCard(columnIndex, cardIndex, -1)}
                    >
                      Left
                    </button>
                    <button
                      type="button"
                      className="rounded border px-2 py-1 text-xs"
                      onClick={() => moveCard(columnIndex, cardIndex, 1)}
                    >
                      Right
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    )
  }
)
Kanban.displayName = "Kanban"

export { Kanban }
