import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<SearchBar />)
    expect(getByPlaceholderText('Search...')).toBeTruthy()
  })

  it('handles text input', () => {
    const onChangeText = jest.fn()
    const { getByPlaceholderText } = render(<SearchBar onChangeText={onChangeText} />)
    fireEvent.changeText(getByPlaceholderText('Search...'), 'test')
    expect(onChangeText).toHaveBeenCalledWith('test')
  })

  it('shows clear button when value is present', () => {
    const { getByText } = render(<SearchBar value="test" showClear />)
    expect(getByText('✕')).toBeTruthy()
  })

  it('calls onClear when clear button is pressed', () => {
    const onClear = jest.fn()
    const onChangeText = jest.fn()
    const { getByText } = render(
      <SearchBar value="test" onClear={onClear} onChangeText={onChangeText} />
    )
    fireEvent.press(getByText('✕'))
    expect(onClear).toHaveBeenCalled()
    expect(onChangeText).toHaveBeenCalledWith('')
  })
})
