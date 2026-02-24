import * as React from "react"

import { cn } from "../../lib/utils"

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
  baseId: string
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, value: controlledValue, defaultValue, onValueChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")
    const baseId = React.useId()
    const value = controlledValue !== undefined ? controlledValue : internalValue

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (controlledValue === undefined) {
          setInternalValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [controlledValue, onValueChange]
    )

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange, baseId }}>
        <div ref={ref} className={cn("", className)} {...props} />
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      role="tablist"
      aria-orientation="horizontal"
      {...props}
    />
  )
)
TabsList.displayName = "TabsList"

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value: tabValue, onClick, onKeyDown, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    if (!context) {
      throw new Error("TabsTrigger must be used within Tabs")
    }

    const isActive = context.value === tabValue
    const triggerId = `${context.baseId}-trigger-${tabValue}`
    const panelId = `${context.baseId}-panel-${tabValue}`

    const moveFocus = (target: "next" | "prev" | "first" | "last", currentNode: HTMLButtonElement) => {
      const list = currentNode.closest('[role="tablist"]')
      if (!list) return

      const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'))
      if (tabs.length === 0) return

      const currentIndex = tabs.indexOf(currentNode)
      let targetNode: HTMLButtonElement | undefined

      if (target === "first") {
        targetNode = tabs[0]
      } else if (target === "last") {
        targetNode = tabs[tabs.length - 1]
      } else if (target === "next") {
        targetNode = tabs[(currentIndex + 1) % tabs.length]
      } else {
        targetNode = tabs[(currentIndex - 1 + tabs.length) % tabs.length]
      }

      if (!targetNode) return

      const nextValue = targetNode.dataset.value
      if (!nextValue) return

      context.onValueChange(nextValue)
      targetNode.focus()
    }

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={triggerId}
        data-value={tabValue}
        aria-selected={isActive}
        aria-controls={panelId}
        tabIndex={isActive ? 0 : -1}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive ? "bg-background text-foreground shadow-sm" : "text-foreground/80 hover:text-foreground",
          className
        )}
        onClick={(e) => {
          context.onValueChange(tabValue)
          onClick?.(e)
        }}
        onKeyDown={(e) => {
          const currentNode = e.currentTarget

          if (e.key === "ArrowRight") {
            e.preventDefault()
            moveFocus("next", currentNode)
          } else if (e.key === "ArrowLeft") {
            e.preventDefault()
            moveFocus("prev", currentNode)
          } else if (e.key === "Home") {
            e.preventDefault()
            moveFocus("first", currentNode)
          } else if (e.key === "End") {
            e.preventDefault()
            moveFocus("last", currentNode)
          }

          onKeyDown?.(e)
        }}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value: tabValue, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    if (!context) {
      throw new Error("TabsContent must be used within Tabs")
    }

    if (context.value !== tabValue) return null

    const panelId = `${context.baseId}-panel-${tabValue}`
    const triggerId = `${context.baseId}-trigger-${tabValue}`

    return (
      <div
        ref={ref}
        id={panelId}
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={triggerId}
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
