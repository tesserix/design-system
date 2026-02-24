import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "./modal"

describe("Modal", () => {
  it("renders children", () => {
    render(
      <Modal>
        <ModalTrigger>Open Modal</ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Title</ModalTitle>
            <ModalDescription>Description</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <button type="button">Close via alias</button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )

    fireEvent.click(screen.getByRole("button", { name: "Open Modal" }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Close via alias" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
