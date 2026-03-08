import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "storybook/test"

import { PhoneInput } from "./phone-input"

const meta = {
  title: "Forms/PhoneInput",
  component: PhoneInput,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { onChange: fn() },
  argTypes: {
    disabled: { control: "boolean" },
    autoDetectCountry: { control: "boolean" },
  },
} satisfies Meta<typeof PhoneInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { value: "" },
}

export const WithValue: Story = {
  args: { value: "+61-412345678" },
}

export const Disabled: Story = {
  args: { value: "+1-5551234567", disabled: true },
}

export const USDefault: Story = {
  args: { value: "", countryCode: "US" },
}
