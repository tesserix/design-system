import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { PermissionsMatrix } from "./permissions-matrix"

describe("PermissionsMatrix", () => {
  const roles = ["Admin", "Editor"]
  const permissions = [
    { id: "users.read", label: "Read users" },
    { id: "users.write", label: "Write users" },
  ]

  it("renders permission rows", () => {
    render(<PermissionsMatrix roles={roles} permissions={permissions} />)
    expect(screen.getByText("Read users")).toBeInTheDocument()
  })

  it("toggles a permission cell", () => {
    const onValueChange = vi.fn()
    render(
      <PermissionsMatrix
        roles={roles}
        permissions={permissions}
        value={{ Admin: ["users.read"], Editor: [] }}
        onValueChange={onValueChange}
      />
    )

    fireEvent.click(screen.getByLabelText("Editor Write users"))

    expect(onValueChange).toHaveBeenCalledWith({
      Admin: ["users.read"],
      Editor: ["users.write"],
    })
  })

  it("toggles all role permissions", () => {
    const onValueChange = vi.fn()
    render(
      <PermissionsMatrix
        roles={roles}
        permissions={permissions}
        value={{ Admin: [], Editor: [] }}
        onValueChange={onValueChange}
      />
    )

    fireEvent.click(screen.getAllByRole("button", { name: "Toggle all" })[0])

    expect(onValueChange).toHaveBeenCalledWith({
      Admin: ["users.read", "users.write"],
      Editor: [],
    })
  })
})
