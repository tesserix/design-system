import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AlertDialog } from './alert-dialog'

describe('AlertDialog', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <AlertDialog isOpen={false} onClose={vi.fn()} title="Test" message="Message" />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders when open', () => {
    render(
      <AlertDialog isOpen onClose={vi.fn()} title="Test Title" message="Test message" />
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <AlertDialog isOpen onClose={onClose} title="Test" message="Message" />
    )

    // Click the X button (last button with no text)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0]) // Close button
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onConfirm and onClose on confirm', async () => {
    const onConfirm = vi.fn()
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <AlertDialog isOpen onClose={onClose} onConfirm={onConfirm} title="Test" message="Msg" confirmLabel="OK" />
    )

    await user.click(screen.getByText('OK'))
    expect(onConfirm).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('shows cancel button for confirm type', () => {
    render(
      <AlertDialog isOpen onClose={vi.fn()} title="Confirm" message="Sure?" type="confirm" cancelLabel="No" />
    )
    expect(screen.getByText('No')).toBeInTheDocument()
  })

  it('calls onCancel for confirm type', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(
      <AlertDialog isOpen onClose={vi.fn()} onCancel={onCancel} title="Confirm" message="Sure?" type="confirm" cancelLabel="No" />
    )

    await user.click(screen.getByText('No'))
    expect(onCancel).toHaveBeenCalled()
  })

  it('renders different dialog types', () => {
    const types = ['success', 'error', 'warning', 'info'] as const
    types.forEach(type => {
      const { unmount } = render(
        <AlertDialog isOpen onClose={vi.fn()} title={`${type} dialog`} message="Test" type={type} />
      )
      expect(screen.getByText(`${type} dialog`)).toBeInTheDocument()
      unmount()
    })
  })
})
