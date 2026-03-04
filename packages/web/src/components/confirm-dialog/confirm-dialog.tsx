import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../dialog"
import { Button } from "../button"

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "destructive"
  onConfirm: () => void
  loading?: boolean
  /** Disable the confirm button (e.g. when confirmation input doesn't match) */
  confirmDisabled?: boolean
  children?: React.ReactNode
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  variant = "destructive",
  onConfirm,
  loading,
  confirmDisabled,
  children,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={loading || confirmDisabled}
          >
            {loading ? "Please wait..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ConfirmDialog }
