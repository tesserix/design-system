import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent } from "storybook/test"

import { Avatar } from "../avatar"
import { Badge } from "../badge"
import { Button } from "../button"
import { TopNav, TopNavActions, TopNavBrand, TopNavContainer, TopNavLink, TopNavLinks } from "./top-nav"

const meta = {
  title: "Navigation/TopNav",
  component: TopNav,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TopNav>

export default meta
type Story = StoryObj<typeof meta>

export const AppNavigation: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    chromatic: {
      viewports: [768, 1200],
    },
  },
  render: () => (
    <div className="min-h-screen bg-background">
      <TopNav>
        <TopNavContainer>
          <TopNavBrand>
            <span>Tesserix</span>
            <Badge variant="outline">Console</Badge>
          </TopNavBrand>
          <TopNavLinks>
            <li>
              <TopNavLink href="#" active>
                Overview
              </TopNavLink>
            </li>
            <li>
              <TopNavLink href="#">Analytics</TopNavLink>
            </li>
            <li>
              <TopNavLink href="#">Billing</TopNavLink>
            </li>
          </TopNavLinks>
          <TopNavActions>
            <Button variant="outline" size="sm">
              Invite
            </Button>
            <Avatar className="h-8 w-8" fallback="MS" />
          </TopNavActions>
        </TopNavContainer>
      </TopNav>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("banner")).toBeInTheDocument()
    await expect(canvas.getByText(/tesserix/i)).toBeInTheDocument()
    await expect(canvas.getByRole("link", { name: /overview/i })).toBeInTheDocument()
  },
}

export const MinimalTopNav: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      <TopNav>
        <TopNavContainer>
          <TopNavBrand>
            <span>Tesserix</span>
          </TopNavBrand>
          <TopNavActions>
            <Button variant="outline" size="sm">
              Help
            </Button>
          </TopNavActions>
        </TopNavContainer>
      </TopNav>
    </div>
  ),
  play: async ({ canvas }) => {
    const help = canvas.getByRole("button", { name: /help/i })
    await expect(canvas.getByRole("banner")).toBeInTheDocument()
    fireEvent.click(help)
    await expect(help).toBeInTheDocument()
  },
}
