import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { TreeView, TreeNode } from './TreeView'

describe('TreeView', () => {
  const mockData: TreeNode[] = [
    {
      id: '1',
      label: 'Parent 1',
      children: [
        { id: '1-1', label: 'Child 1-1' },
        {
          id: '1-2',
          label: 'Child 1-2',
          children: [{ id: '1-2-1', label: 'Grandchild 1-2-1' }],
        },
      ],
    },
    {
      id: '2',
      label: 'Parent 2',
      icon: '📁',
      children: [{ id: '2-1', label: 'Child 2-1', icon: '📄' }],
    },
    {
      id: '3',
      label: 'Leaf Node',
    },
  ]

  it('renders correctly', () => {
    const { getByText } = render(<TreeView data={mockData} />)
    expect(getByText('Parent 1')).toBeTruthy()
    expect(getByText('Parent 2')).toBeTruthy()
    expect(getByText('Leaf Node')).toBeTruthy()
  })

  it('does not show children initially when not expanded', () => {
    const { queryByText } = render(<TreeView data={mockData} />)
    expect(queryByText('Child 1-1')).toBeNull()
    expect(queryByText('Child 1-2')).toBeNull()
  })

  it('shows children when expanded by default', () => {
    const { getByText } = render(<TreeView data={mockData} defaultExpandedIds={['1']} />)
    expect(getByText('Child 1-1')).toBeTruthy()
    expect(getByText('Child 1-2')).toBeTruthy()
  })

  it('toggles node expansion on press', () => {
    const { getByText, queryByText } = render(<TreeView data={mockData} />)

    // Initially collapsed
    expect(queryByText('Child 1-1')).toBeNull()

    // Click to expand
    fireEvent.press(getByText('Parent 1'))
    expect(getByText('Child 1-1')).toBeTruthy()

    // Click to collapse
    fireEvent.press(getByText('Parent 1'))
    expect(queryByText('Child 1-1')).toBeNull()
  })

  it('calls onNodePress when node is pressed', () => {
    const onNodePress = jest.fn()
    const { getByText } = render(<TreeView data={mockData} onNodePress={onNodePress} />)

    fireEvent.press(getByText('Parent 1'))
    expect(onNodePress).toHaveBeenCalledWith(expect.objectContaining({ id: '1', label: 'Parent 1' }))
  })

  it('calls onToggle when node is expanded/collapsed', () => {
    const onToggle = jest.fn()
    const { getByText } = render(<TreeView data={mockData} onToggle={onToggle} />)

    fireEvent.press(getByText('Parent 1'))
    expect(onToggle).toHaveBeenCalledWith('1', true)

    fireEvent.press(getByText('Parent 1'))
    expect(onToggle).toHaveBeenCalledWith('1', false)
  })

  it('renders node icons', () => {
    const { getByText } = render(<TreeView data={mockData} defaultExpandedIds={['2']} />)
    expect(getByText('📁')).toBeTruthy()
    expect(getByText('📄')).toBeTruthy()
  })

  it('renders nested children correctly', () => {
    const { getByText, queryByText } = render(
      <TreeView data={mockData} defaultExpandedIds={['1']} />
    )

    expect(getByText('Child 1-2')).toBeTruthy()
    expect(queryByText('Grandchild 1-2-1')).toBeNull()

    fireEvent.press(getByText('Child 1-2'))
    expect(getByText('Grandchild 1-2-1')).toBeTruthy()
  })

  it('renders with testID', () => {
    const { getByTestId } = render(<TreeView data={mockData} testID="tree-view" />)
    expect(getByTestId('tree-view')).toBeTruthy()
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <TreeView data={mockData} testID="tree-view" style={customStyle} />
    )
    const tree = getByTestId('tree-view')
    expect(tree.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
