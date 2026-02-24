import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { FileUpload } from './FileUpload'

describe('FileUpload', () => {
  it('renders upload area', () => {
    const { getByText } = render(<FileUpload />)
    expect(getByText('Tap to select file')).toBeTruthy()
  })

  it('renders label', () => {
    const { getByText } = render(<FileUpload label="Upload document" />)
    expect(getByText('Upload document')).toBeTruthy()
  })

  it('shows max size hint', () => {
    const { getByText } = render(<FileUpload maxSize={1024 * 100} />)
    expect(getByText('Max size: 100KB')).toBeTruthy()
  })

  it('displays files', () => {
    const files = [
      { uri: 'file://test.jpg', name: 'test.jpg', type: 'image/jpeg', size: 1024 },
    ]
    const { getByText } = render(<FileUpload files={files} />)
    expect(getByText('test.jpg')).toBeTruthy()
    expect(getByText('1KB')).toBeTruthy()
  })

  it('calls onRemove when remove button is pressed', () => {
    const onRemove = jest.fn()
    const files = [{ uri: 'file://test.jpg', name: 'test.jpg' }]
    const { getByLabelText } = render(
      <FileUpload files={files} onRemove={onRemove} />
    )
    const removeButton = getByLabelText('Remove file')
    fireEvent.press(removeButton)
    expect(onRemove).toHaveBeenCalledWith(0)
  })

  it('shows error message', () => {
    const { getByText } = render(<FileUpload error="File too large" />)
    expect(getByText('File too large')).toBeTruthy()
  })
})
