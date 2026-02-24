import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Badge } from "../badge"
import { Button } from "../button"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
  PageHeaderTop,
} from "./page-header"

const meta = {
  title: "Layout/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <PageHeader>
        <PageHeaderTop>
          <span>Workspace / Growth</span>
          <Badge variant="success">Healthy</Badge>
        </PageHeaderTop>
        <PageHeaderContent>
          <PageHeaderHeading>
            <PageHeaderTitle>Revenue Operations</PageHeaderTitle>
            <PageHeaderDescription>
              Monitor conversion signals, activate experiments, and coordinate launch readiness from one surface.
            </PageHeaderDescription>
          </PageHeaderHeading>
          <PageHeaderActions>
            <Button variant="outline">Share</Button>
            <Button>Create Experiment</Button>
          </PageHeaderActions>
        </PageHeaderContent>
      </PageHeader>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: /revenue operations/i })).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /create experiment/i })).toBeInTheDocument()
  },
}

export const Minimal: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderHeading>
            <PageHeaderTitle>Team Settings</PageHeaderTitle>
            <PageHeaderDescription>Manage members, roles, and workspace defaults.</PageHeaderDescription>
          </PageHeaderHeading>
        </PageHeaderContent>
      </PageHeader>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: /team settings/i })).toBeInTheDocument()
    await expect(canvas.getByText(/manage members, roles/i)).toBeInTheDocument()
  },
}
