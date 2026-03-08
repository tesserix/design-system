import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SidebarSearch } from "./sidebar-search"

const items = [
  { id: "1", label: "Dashboard", href: "/" },
  { id: "2", label: "Products", href: "/products", breadcrumb: ["Catalog"] },
  { id: "3", label: "Categories", href: "/categories", breadcrumb: ["Catalog"] },
  { id: "4", label: "Settings", href: "/settings", keywords: ["config", "preferences"] },
  { id: "5", label: "Shipping", href: "/settings/shipping", breadcrumb: ["Settings"] },
]

describe("SidebarSearch", () => {
  it("renders search input", () => {
    render(<SidebarSearch items={items} />)
    expect(screen.getByPlaceholderText("Search menu...")).toBeInTheDocument()
  })

  it("shows results when typing", async () => {
    const user = userEvent.setup()
    render(<SidebarSearch items={items} />)

    await user.type(screen.getByPlaceholderText("Search menu..."), "prod")
    // Text is split by highlight marks, use option role
    expect(screen.getByRole("option")).toBeInTheDocument()
  })

  it("shows no results message", async () => {
    const user = userEvent.setup()
    render(<SidebarSearch items={items} />)

    await user.type(screen.getByPlaceholderText("Search menu..."), "zzzzz")
    expect(screen.getByText(/No results for/)).toBeInTheDocument()
  })

  it("calls onSelect when item clicked", async () => {
    const handleSelect = vi.fn()
    const user = userEvent.setup()
    render(<SidebarSearch items={items} onSelect={handleSelect} />)

    await user.type(screen.getByPlaceholderText("Search menu..."), "dash")
    const option = screen.getByRole("option")
    await user.click(option)

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1", label: "Dashboard" })
    )
  })

  it("clears query with X button", async () => {
    const user = userEvent.setup()
    render(<SidebarSearch items={items} />)

    const input = screen.getByPlaceholderText("Search menu...")
    await user.type(input, "prod")
    expect(screen.getByRole("listbox")).toBeInTheDocument()

    // Click the clear button
    const clearButtons = screen.getAllByRole("button")
    await user.click(clearButtons[0])
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
  })

  it("searches by keywords", async () => {
    const user = userEvent.setup()
    render(<SidebarSearch items={items} />)

    await user.type(screen.getByPlaceholderText("Search menu..."), "config")
    expect(screen.getByText("Settings")).toBeInTheDocument()
  })

  it("shows breadcrumb for items", async () => {
    const user = userEvent.setup()
    render(<SidebarSearch items={items} />)

    await user.type(screen.getByPlaceholderText("Search menu..."), "prod")
    expect(screen.getByText("Catalog")).toBeInTheDocument()
  })
})
