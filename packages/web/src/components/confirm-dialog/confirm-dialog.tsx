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
  /**
   * The id of an element describing the confirm button — typically an
   * `aria-live` status line in `children` explaining why it is disabled.
   *
   * Narrow on purpose. A general props spread would let a caller pass
   * `onClick`, `disabled` or `variant`, each of which this component already
   * controls, and the conflict would be silent.
   */
  confirmDescribedBy?: string
  /**
   * Whether clicking the overlay closes the dialog.
   *
   * Defaults to `false` for the `destructive` variant — which is also this
   * component's default variant. A stray click on the overlay should not
   * silently abandon a destructive flow, and afterwards the operator cannot
   * tell whether they cancelled or mis-clicked. Pass `true` to opt back in.
   */
  dismissOnOutsideClick?: boolean
  /** See `DialogContentProps.inertBackground`. Off by default. */
  inertBackground?: boolean
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
  confirmDescribedBy,
  dismissOnOutsideClick,
  inertBackground,
  children,
}: ConfirmDialogProps) {
  // Destructive confirmations are non-dismissable unless a caller says
  // otherwise; everything else keeps the Dialog default.
  const dismissable = dismissOnOutsideClick ?? variant !== "destructive"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        dismissOnOutsideClick={dismissable}
        inertBackground={inertBackground}
      >
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
            aria-describedby={confirmDescribedBy}
          >
            {loading ? "Please wait..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ConfirmDialog }
