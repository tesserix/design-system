import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Tabs } from './Tabs'

const mockTabs = [
  { label: 'Tab 1', value: '1' },
  { label: 'Tab 2', value: '2' },
  { label: 'Tab 3', value: '3' },
]

describe('Tabs', () => {
  it('renders all tabs', () => {
    const { getByText } = render(<Tabs tabs={mockTabs} />)
    expect(getByText('Tab 1')).toBeTruthy()
    expect(getByText('Tab 2')).toBeTruthy()
    expect(getByText('Tab 3')).toBeTruthy()
  })

  it('calls onChange when tab is pressed', () => {
    const onChange = jest.fn()
    const { getByText } = render(<Tabs tabs={mockTabs} onChange={onChange} />)
    fireEvent.press(getByText('Tab 2'))
    expect(onChange).toHaveBeenCalledWith('2')
  })

  it('respects disabled state', () => {
    const onChange = jest.fn()
    const disabledTabs = [{ label: 'Disabled', value: '1', disabled: true }]
    const { getByText } = render(<Tabs tabs={disabledTabs} onChange={onChange} />)
    fireEvent.press(getByText('Disabled'))
    expect(onChange).not.toHaveBeenCalled()
  })
})
