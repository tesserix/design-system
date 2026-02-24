import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { SortableList, SortableItem } from './SortableList'

describe('SortableList', () => {
  const mockItems: SortableItem[] = [
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ]

  it('renders correctly', () => {
    const { getByText } = render(<SortableList items={mockItems} />)
    expect(getByText('Item 1')).toBeTruthy()
    expect(getByText('Item 2')).toBeTruthy()
    expect(getByText('Item 3')).toBeTruthy()
  })

  it('moves item up when up button is pressed', () => {
    const onReorder = jest.fn()
    const { getAllByLabelText } = render(<SortableList items={mockItems} onReorder={onReorder} />)

    const upButtons = getAllByLabelText('Move up')
    fireEvent.press(upButtons[1]) // Move second item up

    expect(onReorder).toHaveBeenCalledWith([
      { id: '2', label: 'Item 2' },
      { id: '1', label: 'Item 1' },
      { id: '3', label: 'Item 3' },
    ])
  })

  it('moves item down when down button is pressed', () => {
    const onReorder = jest.fn()
    const { getAllByLabelText } = render(<SortableList items={mockItems} onReorder={onReorder} />)

    const downButtons = getAllByLabelText('Move down')
    fireEvent.press(downButtons[0]) // Move first item down

    expect(onReorder).toHaveBeenCalledWith([
      { id: '2', label: 'Item 2' },
      { id: '1', label: 'Item 1' },
      { id: '3', label: 'Item 3' },
    ])
  })

  it('does not move first item up', () => {
    const onReorder = jest.fn()
    const { getAllByLabelText } = render(<SortableList items={mockItems} onReorder={onReorder} />)

    const upButtons = getAllByLabelText('Move up')
    fireEvent.press(upButtons[0]) // Try to move first item up

    expect(onReorder).not.toHaveBeenCalled()
  })

  it('does not move last item down', () => {
    const onReorder = jest.fn()
    const { getAllByLabelText } = render(<SortableList items={mockItems} onReorder={onReorder} />)

    const downButtons = getAllByLabelText('Move down')
    fireEvent.press(downButtons[2]) // Try to move last item down

    expect(onReorder).not.toHaveBeenCalled()
  })

  it('renders custom item renderer', () => {
    const renderItem = (item: SortableItem) => <Text>Custom: {item.label}</Text>

    const { getByText } = render(<SortableList items={mockItems} renderItem={renderItem} />)

    expect(getByText('Custom: Item 1')).toBeTruthy()
    expect(getByText('Custom: Item 2')).toBeTruthy()
    expect(getByText('Custom: Item 3')).toBeTruthy()
  })

  it('renders with testID', () => {
    const { getByTestId } = render(<SortableList items={mockItems} testID="sortable-list" />)
    expect(getByTestId('sortable-list')).toBeTruthy()
  })

  it('exposes proper accessibility properties', () => {
    const { getByTestId } = render(<SortableList items={mockItems} testID="sortable-list" />)
    const list = getByTestId('sortable-list')
    expect(list.props.accessibilityRole).toBe('list')
    expect(list.props.accessibilityLabel).toBe('Sortable list')
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <SortableList items={mockItems} testID="sortable-list" style={customStyle} />
    )
    const list = getByTestId('sortable-list')
    expect(list.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
