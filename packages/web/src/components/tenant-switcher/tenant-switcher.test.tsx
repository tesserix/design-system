import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TenantSwitcher } from "./tenant-switcher"

const items = [
  { id: "1", name: "Acme Corp", subtitle: "acme-corp", color: "#6366f1", isDefault: true },
  { id: "2", name: "Widget Co", subtitle: "widget-co", color: "#ec4899" },
  { id: "3", name: "Demo Store", subtitle: "demo-store", color: "#14b8a6" },
  { id: "4", name: "Test Inc", subtitle: "test-inc", color: "#f59e0b" },
]

describe("TenantSwitcher", () => {
  it("renders selected tenant name", () => {
    render(<TenantSwitcher items={items} selectedId="1" />)
    expect(screen.getByText("Acme Corp")).toBeInTheDocument()
  })

  it("shows placeholder when nothing selected", () => {
    render(<TenantSwitcher items={items} placeholder="Pick one" />)
    expect(screen.getByText("Pick one")).toBeInTheDocument()
  })

  it("opens dropdown on click", async () => {
    const user = userEvent.setup()
    render(<TenantSwitcher items={items} selectedId="1" />)

    await user.click(screen.getByText("Acme Corp"))
    expect(screen.getByText("Switch Workspace")).toBeInTheDocument()
  })

  it("calls onSelect when item clicked", async () => {
    const handleSelect = vi.fn()
    const user = userEvent.setup()
    render(<TenantSwitcher items={items} selectedId="1" onSelect={handleSelect} />)

    await user.click(screen.getByText("Acme Corp"))
    await user.click(screen.getByText("Widget Co"))

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "2", name: "Widget Co" })
    )
  })

  it("shows loading state", () => {
    const { container } = render(<TenantSwitcher items={[]} isLoading />)
    expect(container.querySelector(".animate-spin")).toBeInTheDocument()
  })

  it("shows create new button when callback provided", async () => {
    const user = userEvent.setup()
    const handleCreate = vi.fn()

    render(
      <TenantSwitcher
        items={items}
        selectedId="1"
        onCreateNew={handleCreate}
        createNewLabel="Add Workspace"
      />
    )

    await user.click(screen.getByText("Acme Corp"))
    expect(screen.getByText("Add Workspace")).toBeInTheDocument()
  })

  it("filters items by search", async () => {
    const user = userEvent.setup()
    render(<TenantSwitcher items={items} selectedId="1" />)

    await user.click(screen.getByText("Acme Corp"))
    const searchInput = screen.getByPlaceholderText("Search...")
    await user.type(searchInput, "widget")

    expect(screen.getByText("Widget Co")).toBeInTheDocument()
    expect(screen.queryByText("Demo Store")).not.toBeInTheDocument()
  })

  it("renders in compact variant", () => {
    render(<TenantSwitcher items={items} selectedId="1" variant="compact" />)
    expect(screen.getByText("Acme Corp")).toBeInTheDocument()
  })
})
