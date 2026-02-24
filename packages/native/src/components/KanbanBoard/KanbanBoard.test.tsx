import React from 'react'
import { render } from '@testing-library/react-native'
import { KanbanBoard, KanbanColumn } from './KanbanBoard'

describe('KanbanBoard', () => {
  const mockColumns: KanbanColumn[] = [
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        { id: '1', title: 'Task 1', description: 'Do something', tags: ['urgent', 'bug'] },
        { id: '2', title: 'Task 2' },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      cards: [{ id: '3', title: 'Task 3', description: 'In progress task' }],
      color: '#3b82f6',
    },
    {
      id: 'done',
      title: 'Done',
      cards: [],
    },
  ]

  it('renders correctly', () => {
    const { getByText } = render(<KanbanBoard columns={mockColumns} />)
    expect(getByText('To Do')).toBeTruthy()
    expect(getByText('In Progress')).toBeTruthy()
    expect(getByText('Done')).toBeTruthy()
  })

  it('renders all cards', () => {
    const { getByText } = render(<KanbanBoard columns={mockColumns} />)
    expect(getByText('Task 1')).toBeTruthy()
    expect(getByText('Task 2')).toBeTruthy()
    expect(getByText('Task 3')).toBeTruthy()
  })

  it('renders card descriptions', () => {
    const { getByText } = render(<KanbanBoard columns={mockColumns} />)
    expect(getByText('Do something')).toBeTruthy()
    expect(getByText('In progress task')).toBeTruthy()
  })

  it('renders card tags', () => {
    const { getByText } = render(<KanbanBoard columns={mockColumns} />)
    expect(getByText('urgent')).toBeTruthy()
    expect(getByText('bug')).toBeTruthy()
  })

  it('displays card count for each column', () => {
    const { getByText } = render(<KanbanBoard columns={mockColumns} />)
    expect(getByText('(2)')).toBeTruthy() // To Do has 2 cards
    expect(getByText('(1)')).toBeTruthy() // In Progress has 1 card
    expect(getByText('(0)')).toBeTruthy() // Done has 0 cards
  })

  it('renders with testID', () => {
    const { getByTestId } = render(<KanbanBoard columns={mockColumns} testID="kanban" />)
    expect(getByTestId('kanban')).toBeTruthy()
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <KanbanBoard columns={mockColumns} testID="kanban" style={customStyle} />
    )
    const board = getByTestId('kanban')
    expect(board.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
