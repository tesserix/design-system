import * as React from "react"

import { cn } from "../../lib/utils"

export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  disabled?: boolean
}

export interface TreeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  data: TreeNode[]
  defaultExpandedIds?: string[]
  selectedId?: string
  onSelect?: (id: string) => void
}

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  ({ className, data, defaultExpandedIds = [], selectedId, onSelect, ...props }, ref) => {
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set(defaultExpandedIds))

    const toggleExpanded = (id: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    }

    const renderNodes = (nodes: TreeNode[], level = 1) =>
      nodes.map((node) => {
        const hasChildren = (node.children?.length ?? 0) > 0
        const expanded = expandedIds.has(node.id)
        const selected = selectedId === node.id

        return (
          <div key={node.id} role="treeitem" aria-level={level} aria-expanded={hasChildren ? expanded : undefined}>
            <div className="flex items-center gap-1">
              {hasChildren ? (
                <button
                  type="button"
                  aria-label={expanded ? "Collapse" : "Expand"}
                  className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-accent"
                  onClick={() => toggleExpanded(node.id)}
                >
                  <span aria-hidden="true">{expanded ? "▾" : "▸"}</span>
                </button>
              ) : (
                <span className="inline-block w-6" />
              )}

              <button
                type="button"
                disabled={node.disabled}
                className={cn(
                  "w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent",
                  selected && "bg-accent text-accent-foreground",
                  node.disabled && "cursor-not-allowed opacity-50"
                )}
                onClick={() => onSelect?.(node.id)}
              >
                {node.label}
              </button>
            </div>

            {hasChildren && expanded ? (
              <div role="group" className="ml-5 border-l border-border pl-2">
                {renderNodes(node.children ?? [], level + 1)}
              </div>
            ) : null}
          </div>
        )
      })

    return (
      <div ref={ref} role="tree" className={cn("space-y-1", className)} {...props}>
        {renderNodes(data)}
      </div>
    )
  }
)
Tree.displayName = "Tree"

export { Tree }
