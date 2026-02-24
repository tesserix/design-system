import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

import { WizardStepForm } from "./wizard-step-form"

const meta = {
  title: "Patterns/WizardStepForm",
  component: WizardStepForm,
  tags: ["autodocs"],
  args: {
    steps: [],
  },
} satisfies Meta<typeof WizardStepForm>

export default meta
type Story = StoryObj<typeof meta>

const Example = () => {
  const [name, setName] = React.useState("")

  return (
    <WizardStepForm
      steps={[
        {
          id: "account",
          title: "Account",
          content: (
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Company name"
              className="h-9 w-full rounded-md border px-2"
            />
          ),
        },
        { id: "team", title: "Team", content: <p>Invite your team members.</p> },
        { id: "review", title: "Review", content: <p>Confirm and submit.</p> },
      ]}
      canGoNext={(index) => (index === 0 ? name.trim().length > 0 : true)}
    />
  )
}

export const Default: Story = {
  render: () => <Example />,
}

export const SmokeTest: Story = {
  render: () => <Example />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByPlaceholderText("Company name"), "Tesserix")
    await userEvent.click(canvas.getByRole("button", { name: "Next" }))
    await expect(canvas.getByText("Invite your team members.")).toBeInTheDocument()
  },
}
