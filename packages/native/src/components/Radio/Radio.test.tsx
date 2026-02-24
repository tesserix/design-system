import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Radio } from './Radio'
import { RadioGroup } from './RadioGroup'

describe('Radio', () => {
  it('renders correctly', () => {
    const { getByRole } = render(<Radio />)
    expect(getByRole('radio')).toBeTruthy()
  })

  it('handles checked state', () => {
    const { getByRole } = render(<Radio checked />)
    const radio = getByRole('radio')
    expect(radio.props.accessibilityState.checked).toBe(true)
  })

  it('calls onChange when pressed', () => {
    const onChange = jest.fn()
    const { getByRole } = render(<Radio onChange={onChange} />)
    fireEvent.press(getByRole('radio'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn()
    const { getByRole } = render(<Radio disabled onChange={onChange} />)
    fireEvent.press(getByRole('radio'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('applies different sizes', () => {
    const { rerender, getByRole } = render(<Radio size="sm" />)
    expect(getByRole('radio')).toBeTruthy()

    rerender(<Radio size="md" />)
    expect(getByRole('radio')).toBeTruthy()

    rerender(<Radio size="lg" />)
    expect(getByRole('radio')).toBeTruthy()
  })
})

describe('RadioGroup', () => {
  it('renders children', () => {
    const { getAllByRole } = render(
      <RadioGroup>
        <Radio value="1" />
        <Radio value="2" />
        <Radio value="3" />
      </RadioGroup>
    )
    expect(getAllByRole('radio')).toHaveLength(3)
  })

  it('handles value changes', () => {
    const onChange = jest.fn()
    const { getAllByRole } = render(
      <RadioGroup value="1" onChange={onChange}>
        <Radio value="1" />
        <Radio value="2" />
        <Radio value="3" />
      </RadioGroup>
    )

    fireEvent.press(getAllByRole('radio')[1])
    expect(onChange).toHaveBeenCalledWith('2')
  })

  it('applies checked state based on value', () => {
    const { getAllByRole } = render(
      <RadioGroup value="2">
        <Radio value="1" />
        <Radio value="2" />
        <Radio value="3" />
      </RadioGroup>
    )

    const radios = getAllByRole('radio')
    expect(radios[0].props.accessibilityState.checked).toBe(false)
    expect(radios[1].props.accessibilityState.checked).toBe(true)
    expect(radios[2].props.accessibilityState.checked).toBe(false)
  })

  it('applies disabled state to all children', () => {
    const { getAllByRole } = render(
      <RadioGroup disabled>
        <Radio value="1" />
        <Radio value="2" />
      </RadioGroup>
    )

    const radios = getAllByRole('radio')
    expect(radios[0].props.accessibilityState.disabled).toBe(true)
    expect(radios[1].props.accessibilityState.disabled).toBe(true)
  })
})
