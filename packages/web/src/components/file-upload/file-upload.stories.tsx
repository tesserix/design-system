import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor } from "storybook/test"

import { FileUpload } from "./file-upload"

const FileUploadDemo = () => {
  const [files, setFiles] = React.useState<File[]>([])
  return (
    <div className="space-y-3">
      <FileUpload value={files} onValueChange={setFiles} accept=".png,.jpg,.pdf" />
      <p className="text-sm text-muted-foreground">Selected files: {files.length}</p>
    </div>
  )
}

const meta = {
  title: "Forms/FileUpload",
  component: FileUpload,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "FileUpload supports drag-and-drop, keyboard trigger, validation limits, and controlled/uncontrolled file lists.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FileUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Forms</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">File Upload Showcase</h2>
          <p className="text-sm text-muted-foreground">Drag-and-drop upload area with file list management.</p>
        </div>
        <FileUploadDemo />
      </div>
    </div>
  ),
}

export const SelectAndRemove: Story = {
  render: () => <FileUploadDemo />,
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText(/upload files/i, { selector: "input" })
    const file = new File(["hello"], "hello.txt", { type: "text/plain" })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(canvas.getByText(/selected files: 1/i)).toBeInTheDocument()
    })
    const removeButton = await waitFor(() =>
      canvas.getByRole("button", { name: /remove hello\.txt/i })
    )
    fireEvent.click(removeButton)
    await waitFor(() => {
      expect(canvas.getByText(/selected files: 0/i)).toBeInTheDocument()
    })
  },
}

const FileUploadValidationDemo = () => {
  const [files, setFiles] = React.useState<File[]>([])
  return (
    <div className="space-y-3">
      <FileUpload value={files} onValueChange={setFiles} maxFiles={2} maxSizeBytes={5} />
      <p className="text-sm text-muted-foreground" data-testid="selected-files-count">
        Selected files: {files.length}
      </p>
    </div>
  )
}

export const ValidationAndLimits: Story = {
  render: () => <FileUploadValidationDemo />,
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText(/upload files/i, { selector: "input" })

    const duplicate = new File(["abc"], "duplicate.txt", { type: "text/plain", lastModified: 1 })
    fireEvent.change(input, { target: { files: [duplicate, duplicate] } })
    await waitFor(() => {
      expect(canvas.getByTestId("selected-files-count")).toHaveTextContent(/selected files: 1/i)
    })

    const tooLarge = new File(["123456"], "big.txt", { type: "text/plain" })
    fireEvent.change(input, { target: { files: [tooLarge] } })
    await waitFor(() => {
      expect(canvas.getByText(/exceeds/i)).toBeInTheDocument()
    })

    const one = new File(["1"], "one.txt", { type: "text/plain" })
    const two = new File(["2"], "two.txt", { type: "text/plain" })
    const three = new File(["3"], "three.txt", { type: "text/plain" })
    fireEvent.change(input, { target: { files: [one, two, three] } })
    await waitFor(() => {
      expect(canvas.getByText(/only 2 files are allowed\./i)).toBeInTheDocument()
      expect(canvas.getByTestId("selected-files-count")).toHaveTextContent(/selected files: 2/i)
    })
  },
}

const UncontrolledFileUploadDemo = () => (
  <div className="space-y-3">
    <FileUpload helperText="Use keyboard or drag and drop." maxFiles={3} />
  </div>
)

const dispatchDrop = (target: HTMLElement, files: File[]) => {
  const dropEvent = new Event("drop", { bubbles: true, cancelable: true })
  Object.defineProperty(dropEvent, "dataTransfer", {
    value: { files },
  })
  fireEvent(target, dropEvent)
}

export const DragAndKeyboardUpload: Story = {
  render: () => <UncontrolledFileUploadDemo />,
  play: async ({ canvas }) => {
    const dropzone = canvas.getByRole("button")
    const input = canvas.getByLabelText(/upload files/i, { selector: "input" })

    fireEvent.keyDown(dropzone, { key: " " })
    fireEvent.keyDown(dropzone, { key: "Enter" })
    fireEvent.dragOver(dropzone)
    fireEvent.dragLeave(dropzone)

    const dragFile = new File(["alpha"], "drag.txt", { type: "text/plain" })
    dispatchDrop(dropzone, [dragFile])
    await waitFor(() => {
      expect(canvas.getByRole("button", { name: /remove drag\.txt/i })).toBeInTheDocument()
    })

    const pickedFile = new File(["beta"], "pick.txt", { type: "text/plain" })
    fireEvent.change(input, { target: { files: [pickedFile] } })
    await waitFor(() => {
      expect(canvas.getByRole("button", { name: /remove pick\.txt/i })).toBeInTheDocument()
    })
  },
}

export const DisabledDropzone: Story = {
  render: () => (
    <div className="space-y-3">
      <FileUpload disabled helperText="Disabled uploader" />
    </div>
  ),
  play: async ({ canvas }) => {
    const dropzone = canvas.getByRole("button")
    const disabledFile = new File(["x"], "disabled.txt", { type: "text/plain" })
    fireEvent.dragOver(dropzone)
    dispatchDrop(dropzone, [disabledFile])

    await expect(dropzone).toHaveAttribute("aria-disabled", "true")
    await expect(canvas.queryByRole("button", { name: /remove disabled\.txt/i })).not.toBeInTheDocument()
  },
}

export const StateMatrix: Story = {
  render: () => (
    <div className="grid w-[900px] gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Default</p>
        <FileUpload helperText="Drop files or click to browse." />
      </div>
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Validation Limits</p>
        <FileUpload maxFiles={2} maxSizeBytes={1024} helperText="Max 2 files, 1KB each." />
      </div>
      <div className="rounded-xl border bg-card p-4 md:col-span-2">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Disabled</p>
        <FileUpload disabled helperText="Uploader disabled" />
      </div>
    </div>
  ),
}
