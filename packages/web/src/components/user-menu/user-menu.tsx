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
  onSelect?: () => void
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
            <DropdownMenuItem key={action.label} onClick={action.onSelect}>
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
)
UserMenu.displayName = "UserMenu"

export { UserMenu }
