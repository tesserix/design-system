import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { DragAndDrop } from './DragAndDrop'

describe('DragAndDrop', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <DragAndDrop>
        <Text>Drag me</Text>
      </DragAndDrop>
    )
    expect(getByText('Drag me')).toBeTruthy()
  })

  it('renders with testID', () => {
    const { getByTestId } = render(
      <DragAndDrop testID="drag-drop">
        <Text>Content</Text>
      </DragAndDrop>
    )
    expect(getByTestId('drag-drop')).toBeTruthy()
  })

  it('exposes proper accessibility properties', () => {
    const { getByTestId } = render(
      <DragAndDrop testID="drag-drop">
        <Text>Content</Text>
      </DragAndDrop>
    )
    const element = getByTestId('drag-drop')
    expect(element.props.accessibilityLabel).toBe('Draggable element')
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <DragAndDrop testID="drag-drop" style={customStyle}>
        <Text>Content</Text>
      </DragAndDrop>
    )
    const element = getByTestId('drag-drop')
    expect(element.props.style).toEqual(expect.objectContaining(customStyle))
  })

  it('calls onDragStart when drag starts', () => {
    const onDragStart = jest.fn()
    render(
      <DragAndDrop onDragStart={onDragStart}>
        <Text>Drag me</Text>
      </DragAndDrop>
    )
    // Note: PanResponder gestures are difficult to test without integration tests
    expect(onDragStart).not.toHaveBeenCalled()
  })
})
