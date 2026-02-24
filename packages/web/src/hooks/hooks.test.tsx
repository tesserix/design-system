import * as React from "react"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { useAsync } from "./use-async"
import { useClickOutside } from "./use-click-outside"
import { useCopyToClipboard } from "./use-copy-to-clipboard"
import { useDebounce } from "./use-debounce"
import { useFocus } from "./use-focus"
import { useForm } from "./use-form"
import { useHover } from "./use-hover"
import { useIntersectionObserver } from "./use-intersection-observer"
import { useInterval } from "./use-interval"
import { useKeyPress } from "./use-key-press"
import { useLocalStorage } from "./use-local-storage"
import { useMediaQuery } from "./use-media-query"
import { useOnMount } from "./use-on-mount"
import { useOnUnmount } from "./use-on-unmount"
import { usePrevious } from "./use-previous"
import { useScrollPosition } from "./use-scroll-position"
import { useTimeout } from "./use-timeout"
import { useToggle } from "./use-toggle"
import { useWindowSize } from "./use-window-size"

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe("hooks", () => {
  it("covers async, previous, mount and unmount hooks", async () => {
    const fn = vi.fn(async () => "ok")
    const onMount = vi.fn()
    const onUnmount = vi.fn()

    const Harness = () => {
      const { execute, status } = useAsync(fn, true)
      const prev = usePrevious(status)
      useOnMount(onMount)
      useOnUnmount(onUnmount)
      return (
        <button type="button" onClick={() => void execute()}>
          {status}-{String(prev)}
        </button>
      )
    }

    const view = render(<Harness />)
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(onMount).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalled()
    view.unmount()
    expect(onUnmount).toHaveBeenCalledTimes(1)
  })

  it("covers click-outside and key press hooks", () => {
    const onOutside = vi.fn()
    const Harness = () => {
      const ref = useClickOutside<HTMLDivElement>(() => onOutside())
      const pressed = useKeyPress(["Enter", " "])
      return (
        <div>
          <div ref={ref}>inside</div>
          <span>{pressed ? "pressed" : "idle"}</span>
        </div>
      )
    }

    render(<Harness />)
    fireEvent.mouseDown(document.body)
    expect(onOutside).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(window, { key: "Enter" })
    expect(screen.getByText("pressed")).toBeInTheDocument()
    fireEvent.keyUp(window, { key: "Enter" })
    expect(screen.getByText("idle")).toBeInTheDocument()
  })

  it("covers copy, debounce, interval and timeout hooks", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })

    const Harness = () => {
      const [value, setValue] = React.useState("a")
      const debounced = useDebounce(value, 100)
      const { copy, copied } = useCopyToClipboard()
      const [ticks, setTicks] = React.useState(0)
      const [done, setDone] = React.useState(false)

      useInterval(() => setTicks((x) => x + 1), 50)
      useTimeout(() => setDone(true), 120)

      return (
        <div>
          <button type="button" onClick={() => setValue("b")}>
            set
          </button>
          <button type="button" onClick={() => void copy("hello")}>
            copy
          </button>
          <span>{debounced}</span>
          <span>{copied ? "copied" : "not-copied"}</span>
          <span>{ticks}</span>
          <span>{done ? "done" : "pending"}</span>
        </div>
      )
    }

    render(<Harness />)
    fireEvent.click(screen.getByRole("button", { name: "set" }))
    expect(screen.getByText("a")).toBeInTheDocument()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(150)
    })
    expect(screen.getByText("b")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "copy" }))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(250)
    })
    expect(writeText).toHaveBeenCalledWith("hello")
    expect(screen.getByText("done")).toBeInTheDocument()
  })

  it("covers focus and hover hooks", () => {
    const Harness = () => {
      const [focusRef, focused] = useFocus<HTMLInputElement>()
      const [hoverRef, hovered] = useHover<HTMLDivElement>()
      return (
        <div>
          <input ref={focusRef} aria-label="f" />
          <div ref={hoverRef}>h</div>
          <span>{focused ? "f-1" : "f-0"}</span>
          <span>{hovered ? "h-1" : "h-0"}</span>
        </div>
      )
    }

    render(<Harness />)
    const input = screen.getByLabelText("f")
    const hover = screen.getByText("h")
    fireEvent.focus(input)
    expect(screen.getByText("f-1")).toBeInTheDocument()
    fireEvent.blur(input)
    expect(screen.getByText("f-0")).toBeInTheDocument()
    fireEvent.mouseEnter(hover)
    expect(screen.getByText("h-1")).toBeInTheDocument()
    fireEvent.mouseLeave(hover)
    expect(screen.getByText("h-0")).toBeInTheDocument()
  })

  it("covers form and toggle hooks", async () => {
    const onSubmit = vi.fn(async () => {})
    const Harness = () => {
      const form = useForm({
        initialValues: { name: "" },
        validate: (v) => (v.name ? {} : { name: "required" }),
      })
      const { value, toggle, setTrue, setFalse } = useToggle(false)

      return (
        <div>
          <button type="button" onClick={() => form.setValue("name", "john")}>
            set
          </button>
          <button type="button" onClick={() => void form.handleSubmit(onSubmit)()}>
            submit
          </button>
          <button type="button" onClick={toggle}>
            toggle
          </button>
          <button type="button" onClick={setTrue}>
            true
          </button>
          <button type="button" onClick={setFalse}>
            false
          </button>
          <span>{form.values.name}</span>
          <span>{value ? "on" : "off"}</span>
        </div>
      )
    }

    render(<Harness />)
    fireEvent.click(screen.getByRole("button", { name: "submit" }))
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: "set" }))
    fireEvent.click(screen.getByRole("button", { name: "submit" }))
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(onSubmit).toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: "toggle" }))
    expect(screen.getByText("on")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "false" }))
    expect(screen.getByText("off")).toBeInTheDocument()
  })

  it("covers window, scroll, local storage, media and intersection hooks", async () => {
    const listeners = new Map<string, (event: MediaQueryListEvent) => void>()
    const mql = {
      matches: false,
      addEventListener: vi.fn((_: string, cb: (event: MediaQueryListEvent) => void) => {
        listeners.set("change", cb)
      }),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal("matchMedia", vi.fn(() => mql))

    class IO {
      observe = vi.fn()
      disconnect = vi.fn()
      constructor(cb: IntersectionObserverCallback) {
        setTimeout(() => {
          cb([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
        }, 0)
      }
    }
    vi.stubGlobal("IntersectionObserver", IO as unknown as typeof IntersectionObserver)

    const Harness = () => {
      const [stored, setStored] = useLocalStorage("k", "v1")
      const media = useMediaQuery("(min-width: 640px)")
      const size = useWindowSize()
      const scroll = useScrollPosition()
      const [ref, , seen] = useIntersectionObserver<HTMLDivElement>({ freezeOnceVisible: true })
      return (
        <div>
          <button type="button" onClick={() => setStored("v2")}>
            set
          </button>
          <div ref={ref}>target</div>
          <span>{stored}</span>
          <span>{media ? "m1" : "m0"}</span>
          <span>{size.width}</span>
          <span>{scroll.y}</span>
          <span>{seen ? "seen" : "not-seen"}</span>
        </div>
      )
    }

    render(<Harness />)
    fireEvent.click(screen.getByRole("button", { name: "set" }))
    expect(screen.getByText("v2")).toBeInTheDocument()

    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1200 })
    fireEvent(window, new Event("resize"))
    Object.defineProperty(window, "scrollY", { configurable: true, value: 64 })
    fireEvent(window, new Event("scroll"))
    act(() => {
      listeners.get("change")?.({ matches: true } as MediaQueryListEvent)
    })
    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(screen.getByText("1200")).toBeInTheDocument()
    expect(screen.getByText("64")).toBeInTheDocument()
    expect(screen.getByText("seen")).toBeInTheDocument()
  })
})
