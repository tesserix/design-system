import * as React from "react"

import { cn } from "../../lib/utils"

export interface SettingsSection {
  id: string
  title: string
  description?: string
  content: React.ReactNode
}

export interface SettingsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  sections: SettingsSection[]
}

const SettingsPanel = React.forwardRef<HTMLDivElement, SettingsPanelProps>(
  ({ className, title = "Settings", sections, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4 rounded-xl border p-4", className)} {...props}>
      <h2 className="text-base font-semibold">{title}</h2>
      {sections.map((section) => (
        <section key={section.id} className="rounded-lg border p-3">
          <h3 className="text-sm font-semibold">{section.title}</h3>
          {section.description ? <p className="mt-1 text-xs text-muted-foreground">{section.description}</p> : null}
          <div className="mt-3">{section.content}</div>
        </section>
      ))}
    </div>
  )
)
SettingsPanel.displayName = "SettingsPanel"

export { SettingsPanel }
