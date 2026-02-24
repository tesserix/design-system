import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Code } from "./code"

const meta = {
  title: "Feedback/Code",
  component: Code,
  tags: ["autodocs"],
} satisfies Meta<typeof Code>

export default meta
type Story = StoryObj<typeof meta>

export const Inline: Story = {
  render: () => (
    <p className="text-sm text-foreground">
      Install with <Code>npm install @tesseract-nexus/tesserix-ui</Code>
    </p>
  ),
}

export const Block: Story = {
  render: () => (
    <Code block>
      {`import { Button } from "@tesseract-nexus/tesserix-ui"\n\nexport function App() {\n  return <Button>Start</Button>\n}`}
    </Code>
  ),
}

export const SmokeTest: Story = {
  render: Inline.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
