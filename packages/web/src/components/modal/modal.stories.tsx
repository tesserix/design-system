import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
} from "./modal"
import { Button } from "../button"
import { Input } from "../input"
import { Label } from "../label"

const meta = {
  title: "Overlay/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
          <ModalDescription>
            This is a modal dialog. It's a semantic alias for Dialog with the same functionality.
          </ModalDescription>
        </ModalHeader>
        <div className="py-4">
          <p className="text-sm">
            Use Modal if you prefer that terminology over Dialog. The functionality is identical.
          </p>
        </div>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Cancel</Button>
          </ModalClose>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}

export const ConfirmAction: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Are you absolutely sure?</ModalTitle>
          <ModalDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Cancel</Button>
          </ModalClose>
          <Button variant="destructive">Delete Account</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
}

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setOpen(false)
    }

    return (
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger asChild>
          <Button>Edit Profile</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit Profile</ModalTitle>
            <ModalDescription>
              Make changes to your profile here. Click save when you're done.
            </ModalDescription>
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
            </div>
            <ModalFooter>
              <ModalClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </ModalClose>
              <Button type="submit">Save Changes</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    )
  },
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <div className="space-y-4">
        <Modal open={open} onOpenChange={setOpen}>
          <ModalTrigger asChild>
            <Button>Open Controlled Modal</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Controlled Modal</ModalTitle>
              <ModalDescription>
                This modal's open state is controlled by React state.
              </ModalDescription>
            </ModalHeader>
            <div className="py-4">
              <p className="text-sm">
                You can control when the modal opens and closes programmatically.
              </p>
            </div>
            <ModalFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <div className="text-sm text-muted-foreground">
          Modal is {open ? "open" : "closed"}
        </div>
      </div>
    )
  },
}

export const LongContent: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Terms of Service</Button>
      </ModalTrigger>
      <ModalContent className="max-h-[80vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle>Terms of Service</ModalTitle>
          <ModalDescription>
            Please read our terms of service carefully.
          </ModalDescription>
        </ModalHeader>
        <div className="space-y-4 py-4 text-sm">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <h3 className="font-semibold">Section {i + 1}</h3>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          ))}
        </div>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Decline</Button>
          </ModalClose>
          <Button>Accept</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
}

export const CustomWidth: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open Wide Modal</Button>
      </ModalTrigger>
      <ModalContent className="sm:max-w-[800px]">
        <ModalHeader>
          <ModalTitle>Wide Modal</ModalTitle>
          <ModalDescription>
            This modal has a custom width set via className.
          </ModalDescription>
        </ModalHeader>
        <div className="py-4">
          <p className="text-sm">
            You can customize the modal width by passing className to ModalContent.
          </p>
        </div>
        <ModalFooter>
          <ModalClose asChild>
            <Button>Close</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
}
