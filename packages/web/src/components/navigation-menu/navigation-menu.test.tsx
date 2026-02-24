import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu"

describe("NavigationMenu", () => {
  it("renders full primitive composition", async () => {
    const user = userEvent.setup()

    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>Catalog</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuIndicator />
      </NavigationMenu>
    )

    expect(screen.getByText("Products")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Products" }))
    expect(screen.getByText("Catalog")).toBeInTheDocument()
    expect(screen.getByRole("navigation")).toBeInTheDocument()
  })

  it("exposes trigger style utility with expected classes", () => {
    const classes = navigationMenuTriggerStyle()
    expect(classes).toContain("inline-flex")
    expect(classes).toContain("data-[state=open]:bg-accent/50")
  })
})
