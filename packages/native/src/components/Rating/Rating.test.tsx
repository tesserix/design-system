import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Rating } from './Rating'

describe('Rating', () => {
  it('renders correct number of stars', () => {
    const { getAllByText } = render(<Rating max={5} />)
    expect(getAllByText('★')).toHaveLength(5)
  })

  it('calls onChange when star is pressed', () => {
    const onChange = jest.fn()
    const { getAllByText } = render(<Rating onChange={onChange} />)
    fireEvent.press(getAllByText('★')[2])
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('does not call onChange when readOnly', () => {
    const onChange = jest.fn()
    const { getAllByText } = render(<Rating onChange={onChange} readOnly />)
    fireEvent.press(getAllByText('★')[0])
    expect(onChange).not.toHaveBeenCalled()
  })
})
