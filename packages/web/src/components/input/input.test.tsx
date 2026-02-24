import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './input'

describe('Input', () => {
  it('renders input correctly', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('applies default input styles', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('flex', 'h-11', 'w-full', 'rounded-lg', 'border-2')
  })

  it('accepts text input', async () => {
    const user = userEvent.setup()
    render(<Input data-testid="input" />)

    const input = screen.getByTestId('input') as HTMLInputElement
    await user.type(input, 'Hello World')

    expect(input.value).toBe('Hello World')
  })

  it('handles onChange event', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Input onChange={handleChange} data-testid="input" />)
    const input = screen.getByTestId('input')

    await user.type(input, 'test')

    expect(handleChange).toHaveBeenCalled()
  })

  it('renders with type="email"', () => {
    render(<Input type="email" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('renders with type="password"', () => {
    render(<Input type="password" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('renders with type="number"', () => {
    render(<Input type="number" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('renders as disabled when disabled prop is true', () => {
    render(<Input disabled data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toBeDisabled()
  })

  it('does not accept input when disabled', async () => {
    const user = userEvent.setup()
    render(<Input disabled data-testid="input" />)

    const input = screen.getByTestId('input') as HTMLInputElement
    await user.type(input, 'test')

    expect(input.value).toBe('')
  })

  it('renders with default value', () => {
    render(<Input defaultValue="default text" data-testid="input" />)
    const input = screen.getByTestId('input') as HTMLInputElement
    expect(input.value).toBe('default text')
  })

  it('renders with controlled value', () => {
    const { rerender } = render(<Input value="initial" onChange={() => {}} data-testid="input" />)
    const input = screen.getByTestId('input') as HTMLInputElement
    expect(input.value).toBe('initial')

    rerender(<Input value="updated" onChange={() => {}} data-testid="input" />)
    expect(input.value).toBe('updated')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('custom-input')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('accepts placeholder text', () => {
    render(<Input placeholder="Search here..." />)
    expect(screen.getByPlaceholderText('Search here...')).toBeInTheDocument()
  })

  it('handles focus and blur events', async () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    const user = userEvent.setup()

    render(<Input onFocus={handleFocus} onBlur={handleBlur} data-testid="input" />)
    const input = screen.getByTestId('input')

    await user.click(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)

    await user.tab()
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('renders as read-only when readOnly prop is true', () => {
    render(<Input readOnly data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('readOnly')
  })

  it('does not allow editing when readOnly', async () => {
    const user = userEvent.setup()
    render(<Input readOnly defaultValue="read only" data-testid="input" />)

    const input = screen.getByTestId('input') as HTMLInputElement
    await user.type(input, 'test')

    expect(input.value).toBe('read only')
  })
})
