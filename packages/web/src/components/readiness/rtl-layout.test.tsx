import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../navigation-menu"
import { Button } from "../button"
import { Input } from "../input"

describe("Readiness RTL layout", () => {
  it("keeps navigation and form primitives functional under RTL", async () => {
    const user = userEvent.setup()

    render(
      <div dir="rtl">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>المنتجات</NavigationMenuTrigger>
              <NavigationMenuContent>كتالوج</NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <form aria-label="rtl-form" className="mt-4 flex items-center gap-2">
          <Input aria-label="البريد" />
          <Button type="submit">إرسال</Button>
        </form>
      </div>
    )

    await user.click(screen.getByRole("button", { name: "المنتجات" }))
    expect(screen.getByText("كتالوج")).toBeInTheDocument()

    await user.type(screen.getByRole("textbox", { name: "البريد" }), "rtl@example.com")
    expect(screen.getByRole("textbox", { name: "البريد" })).toHaveValue("rtl@example.com")
  })
})
