'use client';

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { cn } from "../../lib/utils"

type AlertDialogType = 'success' | 'error' | 'warning' | 'info' | 'confirm'

interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: AlertDialogType
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
}

const iconPaths: Record<AlertDialogType, string> = {
  success: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01l-3-3',
  error: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M15 9l-6 6 M9 9l6 6',
  warning: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3 M12 9v4 M12 17h.01',
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 16v-4 M12 8h.01',
  confirm: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3 M12 9v4 M12 17h.01',
}

const iconStyles: Record<AlertDialogType, { color: string; bgColor: string }> = {
  success: { color: 'text-success', bgColor: 'bg-success-muted' },
  error: { color: 'text-destructive', bgColor: 'bg-destructive/10' },
  warning: { color: 'text-warning', bgColor: 'bg-warning-muted' },
  info: { color: 'text-primary', bgColor: 'bg-primary/20' },
  confirm: { color: 'text-destructive', bgColor: 'bg-destructive/10' },
}

const buttonColors: Record<AlertDialogType, string> = {
  success: 'bg-success hover:bg-success/90',
  error: 'bg-destructive hover:bg-destructive/90',
  warning: 'bg-warning hover:bg-warning/90',
  info: 'bg-primary hover:bg-primary/90',
  // A confirm dialog is overwhelmingly used to confirm a REMOVAL. Amber
  // reads as "be careful"; the button that actually deletes something
  // should read as destructive.
  confirm: 'bg-destructive hover:bg-destructive/90',
}

function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: AlertDialogProps) {
  // document.body does not exist during SSR, and calling createPortal
  // against it would crash the render. Mount-gated so the server emits
  // nothing and the client portals on the first effect.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  const isConfirmDialog = type === 'confirm'
  const { color, bgColor } = iconStyles[type]

  const body = (
    <>
      <div
        data-alert-dialog-overlay=""
        className="fixed inset-0 bg-foreground/40 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          role="alertdialog"
          aria-modal="true"
          className="bg-card rounded-md shadow-xl max-w-md w-full pointer-events-auto animate-in zoom-in-95 fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-center gap-4">
              <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', bgColor)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('w-6 h-6', color)} aria-hidden="true">
                  {iconPaths[type].split(' M').map((d, i) => (
                    <path key={i} d={i === 0 ? d : `M${d}`} />
                  ))}
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-muted transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div className="px-6 pb-6">
            <p className="text-muted-foreground leading-relaxed">{message}</p>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
            {isConfirmDialog && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-semibold text-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors"
              >
                {cancelLabel}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={cn(
                'px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all shadow-lg',
                buttonColors[type]
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )

  // Portalled to <body> so no ancestor can capture the fixed overlay.
  // `position: fixed` resolves against the viewport ONLY while nothing
  // above it has a transform/filter/contain/will-change; an ancestor that
  // does becomes the containing block and `inset-0` then covers that box
  // instead. mark8ly's admin animates each page with animation-fill-mode
  // `both`, leaving an identity transform in place permanently, and the
  // scrim rendered as a grey rectangle over the content column while the
  // sidebar and header stayed bright. Portalling makes it immune rather
  // than asking every caller to avoid animating their pages.
  return mounted ? createPortal(body, document.body) : null
}

export { AlertDialog }
export type { AlertDialogProps, AlertDialogType }
