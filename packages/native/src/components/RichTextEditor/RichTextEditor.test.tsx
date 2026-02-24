import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { RichTextEditor } from './RichTextEditor'

describe('RichTextEditor', () => {
  it('renders editor', () => {
    const { getByLabelText } = render(<RichTextEditor />)
    expect(getByLabelText('Rich text editor')).toBeTruthy()
  })

  it('renders toolbar buttons', () => {
    const { getByLabelText } = render(<RichTextEditor />)
    expect(getByLabelText('Bold')).toBeTruthy()
    expect(getByLabelText('Italic')).toBeTruthy()
    expect(getByLabelText('Underline')).toBeTruthy()
  })

  it('calls onChange when text changes', () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(<RichTextEditor onChange={onChange} />)
    const editor = getByLabelText('Rich text editor')
    fireEvent.changeText(editor, 'Hello world')
    expect(onChange).toHaveBeenCalledWith('Hello world')
  })

  it('toggles format buttons', () => {
    const { getByLabelText } = render(<RichTextEditor />)
    const boldButton = getByLabelText('Bold')
    fireEvent.press(boldButton)
    // Bold state should be toggled
  })
})
