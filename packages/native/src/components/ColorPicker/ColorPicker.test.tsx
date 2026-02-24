import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ColorPicker } from './ColorPicker'

describe('ColorPicker', () => {
  it('renders with default color', () => {
    const { getByText } = render(<ColorPicker value="#3b82f6" />)
    expect(getByText('#3B82F6')).toBeTruthy()
  })

  it('renders label', () => {
    const { getByText } = render(<ColorPicker label="Choose color" />)
    expect(getByText('Choose color')).toBeTruthy()
  })

  it('opens modal on press', () => {
    const { getByRole, getByText } = render(<ColorPicker label="Color" />)
    const trigger = getByRole('button')
    fireEvent.press(trigger)
    expect(getByText('Done')).toBeTruthy()
  })

  it('calls onChange when color is selected', () => {
    const onChange = jest.fn()
    const { getByRole, getAllByRole } = render(
      <ColorPicker onChange={onChange} />
    )
    const trigger = getByRole('button')
    fireEvent.press(trigger)

    const colorOptions = getAllByRole('radio')
    fireEvent.press(colorOptions[0])

    const doneButton = getByRole('button', { name: /done/i })
    fireEvent.press(doneButton)

    expect(onChange).toHaveBeenCalled()
  })
})
