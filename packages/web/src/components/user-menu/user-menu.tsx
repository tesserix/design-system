import * as React from "react"

import { Avatar, AvatarImage, AvatarFallback } from "../avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu"

export interface UserMenuAction {
  label: string
  icon?: React.ReactNode
  onSelect?: () => void
  variant?: "default" | "destructive"
  separator?: boolean
}

export interface UserMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  name: string
  email?: string
  avatarSrc?: string
  actions?: UserMenuAction[]
}

const UserMenu = React.forwardRef<HTMLDivElement, UserMenuProps>(
  ({ name, email, avatarSrc, actions = [], ...props }, ref) => (
    <div ref={ref} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="h-8 w-8">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>
            <div className="space-y-0.5">
              <p className="text-sm font-medium leading-none">{name}</p>
              {email ? <p className="text-xs leading-none text-muted-foreground">{email}</p> : null}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actions.map((action) => (
            <React.Fragment key={action.label}>
              {action.separator && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={action.onSelect}
                className={action.variant === "destructive" ? "text-destructive focus:text-destructive" : undefined}
              >
                {action.icon && <span className="mr-2 h-4 w-4 flex-shrink-0">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
)
UserMenu.displayName = "UserMenu"

export { UserMenu }
