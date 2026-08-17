import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command"

function renderCommand(props: React.ComponentProps<typeof Command> = {}) {
  const utils = render(
    <Command {...props}>
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandEmpty>Nothing matching.</CommandEmpty>
        <CommandGroup>
          <CommandItem value="alpha">Alpha</CommandItem>
          <CommandItem value="beta">Beta</CommandItem>
          <CommandItem value="gamma">Gamma</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )

  return { ...utils, input: screen.getByPlaceholderText("Search…") }
}

const activeValueOf = () =>
  screen.queryAllByRole("option").find((option) => option.getAttribute("data-active") === "true")?.textContent

describe("Command keyboard navigation (#7)", () => {
  it("moves the highlight when arrowing from the input", () => {
    const { input } = renderCommand()

    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(activeValueOf()).toBe("Alpha")

    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(activeValueOf()).toBe("Beta")

    fireEvent.keyDown(input, { key: "ArrowUp" })
    expect(activeValueOf()).toBe("Alpha")
  })

  it("selects with Enter from the input", () => {
    const onValueChange = vi.fn()
    const { input } = renderCommand({ onValueChange })

    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(onValueChange).toHaveBeenCalledWith("alpha")
  })

  it("still supports arrowing from the list itself", () => {
    renderCommand()

    fireEvent.keyDown(screen.getByRole("listbox"), { key: "ArrowDown" })
    expect(activeValueOf()).toBe("Alpha")
  })

  it("skips disabled items when navigating", () => {
    render(
      <Command>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandItem value="alpha">Alpha</CommandItem>
          <CommandItem value="beta" disabled>
            Beta
          </CommandItem>
          <CommandItem value="gamma">Gamma</CommandItem>
        </CommandList>
      </Command>
    )

    const input = screen.getByPlaceholderText("Search…")
    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(activeValueOf()).toBe("Alpha")

    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(activeValueOf()).toBe("Gamma")
  })
})

describe("Command registry timing", () => {
  it("navigates on a keypress that lands before the registration effects flush", () => {
    // Mirrors a real palette: the key arrives in the same tick as the mount, so
    // a handler reading its render-time snapshot of the registry sees nothing.
    const { container } = render(
      <Command>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandItem value="alpha">Alpha</CommandItem>
          <CommandItem value="beta">Beta</CommandItem>
        </CommandList>
      </Command>
    )

    const input = container.querySelector("input") as HTMLInputElement
    fireEvent.keyDown(input, { key: "ArrowDown" })

    expect(activeValueOf()).toBe("Alpha")
  })
})

describe("CommandEmpty (#8)", () => {
  it("does not report empty while disabled matches are on screen", () => {
    render(
      <Command>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>Nothing matching.</CommandEmpty>
          <CommandGroup>
            <CommandItem value="alpha" disabled>
              Alpha
            </CommandItem>
            <CommandItem value="beta" disabled>
              Beta
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )

    expect(screen.getByText("Alpha")).toBeInTheDocument()
    expect(screen.queryByText("Nothing matching.")).not.toBeInTheDocument()
  })

  it("reports empty when nothing renders at all", () => {
    const { input } = renderCommand()

    fireEvent.change(input, { target: { value: "zzzz" } })

    expect(screen.queryAllByRole("option")).toHaveLength(0)
    expect(screen.getByText("Nothing matching.")).toBeInTheDocument()
  })
})

describe("Command combobox ARIA (#9)", () => {
  it("declares the combobox relationship on the input", () => {
    const { input } = renderCommand()
    const listbox = screen.getByRole("listbox")

    expect(input).toHaveAttribute("role", "combobox")
    expect(input).toHaveAttribute("aria-expanded", "true")
    expect(input).toHaveAttribute("aria-autocomplete", "list")
    expect(input).toHaveAttribute("aria-controls", listbox.id)
    expect(listbox.id).toBeTruthy()
  })

  it("points aria-activedescendant at the highlighted option", () => {
    const { input } = renderCommand()

    expect(input).not.toHaveAttribute("aria-activedescendant")

    fireEvent.keyDown(input, { key: "ArrowDown" })

    const active = screen.getAllByRole("option").find((o) => o.getAttribute("data-active") === "true")
    expect(active?.id).toBeTruthy()
    expect(input).toHaveAttribute("aria-activedescendant", active?.id)
  })
})

describe("Command stale selection (#11)", () => {
  it("does not fire Enter against an item hidden by the latest keystroke", () => {
    const onValueChange = vi.fn()
    const { input } = renderCommand({ onValueChange })

    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(activeValueOf()).toBe("Alpha")

    // Narrow to a disjoint match set, then Enter without arrowing first.
    fireEvent.change(input, { target: { value: "beta" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(onValueChange).not.toHaveBeenCalledWith("alpha")
  })

  it("does not fire Enter when the query matches only disabled items", () => {
    const onValueChange = vi.fn()
    render(
      <Command onValueChange={onValueChange}>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandItem value="alpha">Alpha</CommandItem>
          <CommandItem value="beta" disabled>
            Beta
          </CommandItem>
        </CommandList>
      </Command>
    )

    const input = screen.getByPlaceholderText("Search…")
    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.change(input, { target: { value: "beta" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("retargets the highlight to the new match set", () => {
    const { input } = renderCommand()

    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.change(input, { target: { value: "gam" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(screen.queryByText("Alpha")).not.toBeInTheDocument()
  })
})

describe("Command controlled query and shouldFilter (#10)", () => {
  it("reports query changes", () => {
    const onQueryChange = vi.fn()
    render(
      <Command onQueryChange={onQueryChange}>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandItem value="alpha">Alpha</CommandItem>
        </CommandList>
      </Command>
    )

    fireEvent.change(screen.getByPlaceholderText("Search…"), { target: { value: "al" } })
    expect(onQueryChange).toHaveBeenCalledWith("al")
  })

  it("renders every item when shouldFilter is false", () => {
    render(
      <Command shouldFilter={false} query="nothing-matches-this">
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandItem value="alpha">Alpha</CommandItem>
          <CommandItem value="beta">Beta</CommandItem>
        </CommandList>
      </Command>
    )

    expect(screen.getAllByRole("option")).toHaveLength(2)
  })
})
