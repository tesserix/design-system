import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<Textarea placeholder="Enter text" />)
    expect(getByPlaceholderText('Enter text')).toBeTruthy()
  })

  it('handles text input', () => {
    const onChangeText = jest.fn()
    const { getByPlaceholderText } = render(
      <Textarea placeholder="Enter text" onChangeText={onChangeText} />
    )
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'Hello World')
    expect(onChangeText).toHaveBeenCalledWith('Hello World')
  })

  it('applies disabled state', () => {
    const { getByPlaceholderText } = render(
      <Textarea placeholder="Enter text" disabled />
    )
    const textarea = getByPlaceholderText('Enter text')
    expect(textarea.props.editable).toBe(false)
  })

  it('applies error styling', () => {
    const { getByPlaceholderText } = render(
      <Textarea placeholder="Enter text" error />
    )
    const textarea = getByPlaceholderText('Enter text')
    expect(textarea.props.style).toBeTruthy()
  })

  it('applies different sizes', () => {
    const { rerender, getByPlaceholderText } = render(
      <Textarea placeholder="Enter text" size="sm" />
    )
    expect(getByPlaceholderText('Enter text')).toBeTruthy()

    rerender(<Textarea placeholder="Enter text" size="md" />)
    expect(getByPlaceholderText('Enter text')).toBeTruthy()

    rerender(<Textarea placeholder="Enter text" size="lg" />)
    expect(getByPlaceholderText('Enter text')).toBeTruthy()
  })
})
