import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select'
import { Label } from '../label'

const meta = {
  title: 'Forms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Dropdown Selection</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Select Showcase</h2>
          <p className="text-sm text-muted-foreground">Rich dropdown menus powered by Radix UI.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select defaultValue="us">
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>North America</SelectLabel>
                  <SelectItem value="est">Eastern Time</SelectItem>
                  <SelectItem value="cst">Central Time</SelectItem>
                  <SelectItem value="mst">Mountain Time</SelectItem>
                  <SelectItem value="pst">Pacific Time</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Europe</SelectLabel>
                  <SelectItem value="gmt">GMT</SelectItem>
                  <SelectItem value="cet">Central European Time</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-3 text-sm font-semibold">Disabled State</h3>
            <div className="space-y-2">
              <Label>Disabled Select</Label>
              <Select defaultValue="option1" disabled>
                <SelectTrigger className="w-[280px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Choose an option</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
          <SelectItem value="3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Citrus</SelectLabel>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="lemon">Lemon</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Berries</SelectLabel>
          <SelectItem value="strawberry">Strawberry</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}
