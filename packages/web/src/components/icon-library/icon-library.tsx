import * as React from "react"

import { cn } from "../../lib/utils"

const icons = {
  search: (
    <path d="M11 19a8 8 0 1 1 5.3-14l4.2 4.2-1.4 1.4-4.2-4.2A6 6 0 1 0 17 11c0 1.5-.6 2.9-1.6 4l3.8 3.8-1.4 1.4-3.8-3.8A7.96 7.96 0 0 1 11 19Z" />
  ),
  plus: <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4Z" />,
  check: <path d="m20 6-11 11-5-5 1.4-1.4 3.6 3.6 9.6-9.6L20 6Z" />,
  x: <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4 6.4 5Z" />,
  bell: <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6v-5a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z" />,
} as const

export type IconName = keyof typeof icons

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName
  size?: number
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(({ name, size = 16, className, ...props }, ref) => (
  <svg
    ref={ref}
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    aria-hidden="true"
    className={cn("inline-block", className)}
    {...props}
  >
    {icons[name]}
  </svg>
))
Icon.displayName = "Icon"

const IconLibrary = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
    {(Object.keys(icons) as IconName[]).map((name) => (
      <div key={name} className="flex items-center gap-2 rounded border p-2 text-sm">
        <Icon name={name} />
        <span>{name}</span>
      </div>
    ))}
  </div>
)

export { Icon, IconLibrary }
