import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { OTPInput } from './OTPInput'

describe('OTPInput', () => {
  it('renders correct number of inputs', () => {
    const { getAllByDisplayValue } = render(<OTPInput length={6} value="" />)
    const inputs = getAllByDisplayValue('')
    expect(inputs.length).toBeGreaterThanOrEqual(6)
  })

  it('calls onChange when input changes', () => {
    const onChange = jest.fn()
    const { getAllByDisplayValue } = render(
      <OTPInput length={4} value="" onChange={onChange} />
    )
    const inputs = getAllByDisplayValue('')
    fireEvent.changeText(inputs[0], '1')
    expect(onChange).toHaveBeenCalled()
  })

  it('calls onComplete when all digits entered', () => {
    const onComplete = jest.fn()
    const { rerender } = render(
      <OTPInput length={4} value="123" onComplete={onComplete} />
    )
    rerender(<OTPInput length={4} value="1234" onComplete={onComplete} />)
    expect(onComplete).toHaveBeenCalledWith('1234')
  })
})
