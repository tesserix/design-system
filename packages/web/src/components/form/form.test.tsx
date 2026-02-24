import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./form"

describe("Form", () => {
  it("wires accessibility attributes when field has an error", () => {
    render(
      <Form>
        <FormField name="email" error="Email is required">
          <FormItem>
            <FormLabel required>Email</FormLabel>
            <FormControl>
              <input type="email" />
            </FormControl>
            <FormDescription>Use your work email</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </Form>
    )

    const label = screen.getByText("Email")
    const input = screen.getByRole("textbox")
    const message = screen.getByText("Email is required")
    expect(label).toHaveClass("text-destructive")
    expect(screen.getByText("*")).toBeInTheDocument()
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAttribute("id")
    expect(input).toHaveAttribute("aria-describedby", message.getAttribute("id") ?? "")
    expect(screen.getByText("Use your work email")).toHaveClass("text-muted-foreground")
  })

  it("renders custom message content when there is no error", () => {
    render(
      <Form>
        <FormField name="username">
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <input />
            </FormControl>
            <FormMessage>Looks good</FormMessage>
          </FormItem>
        </FormField>
      </Form>
    )

    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("aria-invalid", "false")
    expect(input).not.toHaveAttribute("aria-describedby")
    expect(screen.getByText("Looks good")).toBeInTheDocument()
  })

  it("does not render an empty message container", () => {
    render(
      <Form>
        <FormField name="firstName">
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <input />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </Form>
    )

    expect(screen.queryByText("First Name-error")).not.toBeInTheDocument()
  })

  it("throws if useFormField is called outside FormField", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    const Consumer = () => {
      useFormField()
      return null
    }

    expect(() => render(<Consumer />)).toThrow("useFormField must be used within FormField")
    consoleError.mockRestore()
  })
})
