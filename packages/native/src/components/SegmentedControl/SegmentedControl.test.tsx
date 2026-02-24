import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { SegmentedControl } from './SegmentedControl'

const mockSegments = [
  { label: 'Segment 1', value: '1' },
  { label: 'Segment 2', value: '2' },
]

describe('SegmentedControl', () => {
  it('renders all segments', () => {
    const { getByText } = render(<SegmentedControl segments={mockSegments} />)
    expect(getByText('Segment 1')).toBeTruthy()
    expect(getByText('Segment 2')).toBeTruthy()
  })

  it('calls onChange when segment is pressed', () => {
    const onChange = jest.fn()
    const { getByText } = render(
      <SegmentedControl segments={mockSegments} onChange={onChange} />
    )
    fireEvent.press(getByText('Segment 2'))
    expect(onChange).toHaveBeenCalledWith('2')
  })

  it('updates active segment from controlled value changes', () => {
    const { getByText, rerender } = render(
      <SegmentedControl segments={mockSegments} value="1" />
    )
    expect(getByText('Segment 1')).toHaveStyle({ color: '#ffffff' })

    rerender(<SegmentedControl segments={mockSegments} value="2" />)
    expect(getByText('Segment 2')).toHaveStyle({ color: '#ffffff' })
  })
})
