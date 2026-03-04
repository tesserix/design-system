import * as React from "react"

import { cn } from "../../lib/utils"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./sidebar"

export interface TwoRailNavItem {
  id: string
  label: string
  icon?: React.ReactNode
  isActive?: boolean
  disabled?: boolean
}

export interface TwoRailSection {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  items: TwoRailNavItem[]
}

export interface TwoRailSidebarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  sections: TwoRailSection[]
  activeSectionId?: string
  defaultActiveSectionId?: string
  onActiveSectionChange?: (sectionId: string) => void
  onItemSelect?: (sectionId: string, item: TwoRailNavItem) => void
  brand?: React.ReactNode
  railFooter?: React.ReactNode
  panelFooter?: React.ReactNode
  panelTitle?: (section: TwoRailSection) => React.ReactNode
  railClassName?: string
  panelClassName?: string
}

const TwoRailSidebar = React.forwardRef<HTMLDivElement, TwoRailSidebarProps>(
  (
    {
      sections,
      activeSectionId,
      defaultActiveSectionId,
      onActiveSectionChange,
      onItemSelect,
      brand,
      railFooter,
      panelFooter,
      panelTitle,
      className,
      railClassName,
      panelClassName,
      ...props
    },
    ref
  ) => {
    const fallbackSection = sections[0]
    const [internalActive, setInternalActive] = React.useState(defaultActiveSectionId ?? fallbackSection?.id ?? "")
    const selectedSectionId = activeSectionId ?? internalActive

    const activeSection = React.useMemo(
      () => sections.find((section) => section.id === selectedSectionId) ?? fallbackSection,
      [sections, selectedSectionId, fallbackSection]
    )

    const setActiveSection = (sectionId: string) => {
      if (activeSectionId === undefined) {
        setInternalActive(sectionId)
      }
      onActiveSectionChange?.(sectionId)
    }

    if (!activeSection) return null

    return (
      <div ref={ref} className={cn("flex h-full", className)} {...props}>
        <div className={cn("flex w-14 flex-col items-center gap-2 border-r bg-sidebar py-4", railClassName)}>
          {brand ? <div className="flex items-center justify-center">{brand}</div> : null}
          <div className="my-2 h-px w-8 bg-sidebar-border" />
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex size-10 items-center justify-center rounded-lg transition-colors",
                selectedSectionId === section.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
              title={section.label}
            >
              <section.icon className="h-4 w-4" />
            </button>
          ))}
          {railFooter ? <div className="mt-auto">{railFooter}</div> : null}
        </div>

        <Sidebar collapsible="none" className={panelClassName}>
          <SidebarHeader>
            <h2 className="px-2 text-lg font-semibold">{panelTitle ? panelTitle(activeSection) : activeSection.label}</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {activeSection.items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    disabled={item.disabled}
                    onClick={() => onItemSelect?.(activeSection.id, item)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          {panelFooter ? <SidebarFooter>{panelFooter}</SidebarFooter> : null}
        </Sidebar>
      </div>
    )
  }
)

TwoRailSidebar.displayName = "TwoRailSidebar"

export { TwoRailSidebar }
