import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./form"
import { Input } from "../input"
import { Textarea } from "../textarea"
import { Button } from "../button"
import { Checkbox } from "../checkbox"
import { Select } from "../select"

const meta = {
  title: "Layout/Form",
  component: Form,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({ email: "", message: "" })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const newErrors: Record<string, string> = {}

      if (!formData.email) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid"
      }

      if (!formData.message) {
        newErrors.message = "Message is required"
      }

      setErrors(newErrors)

      if (Object.keys(newErrors).length === 0) {
        alert("Form submitted successfully!")
      }
    }

    return (
      <div className="w-96">
        <Form onSubmit={handleSubmit}>
          <FormField name="email" error={errors.email}>
            <FormItem>
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </FormControl>
              <FormDescription>Enter your email address</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="message" error={errors.message}>
            <FormItem>
              <FormLabel required>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </FormControl>
              <FormDescription>Write your message here</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit">Submit</Button>
        </Form>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}

export const WithValidation: Story = {
  render: () => {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const newErrors: Record<string, string> = {}

      if (!username) {
        newErrors.username = "Username is required"
      } else if (username.length < 3) {
        newErrors.username = "Username must be at least 3 characters"
      }

      if (!password) {
        newErrors.password = "Password is required"
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      }

      setErrors(newErrors)
    }

    return (
      <div className="w-96">
        <Form onSubmit={handleSubmit}>
          <FormField name="username" error={errors.username}>
            <FormItem>
              <FormLabel required>Username</FormLabel>
              <FormControl>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="password" error={errors.password}>
            <FormItem>
              <FormLabel required>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit">Sign In</Button>
        </Form>
      </div>
    )
  },
}

export const ComplexForm: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      name: "",
      email: "",
      role: "",
      bio: "",
      terms: false,
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      alert(JSON.stringify(formData, null, 2))
    }

    return (
      <div className="w-96">
        <Form onSubmit={handleSubmit}>
          <FormField name="name">
            <FormItem>
              <FormLabel required>Name</FormLabel>
              <FormControl>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="email">
            <FormItem>
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="role">
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="">Select a role</option>
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="manager">Manager</option>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="bio">
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                />
              </FormControl>
              <FormDescription>Tell us about yourself</FormDescription>
            </FormItem>
          </FormField>

          <FormField name="terms">
            <FormItem>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.terms}
                  onChange={(e) =>
                    setFormData({ ...formData, terms: e.target.checked })
                  }
                />
                <FormLabel className="!mt-0">
                  I agree to the terms and conditions
                </FormLabel>
              </div>
            </FormItem>
          </FormField>

          <Button type="submit">Submit</Button>
        </Form>
      </div>
    )
  },
}
