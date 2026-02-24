import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { TaskCard } from './TaskCard'

describe('TaskCard', () => {
  it('renders correctly', () => {
    const { getByText } = render(<TaskCard title="Review pull request" />)
    expect(getByText('Review pull request')).toBeTruthy()
  })

  it('renders uncompleted task by default', () => {
    const { getByLabelText } = render(<TaskCard title="Task" />)
    const checkbox = getByLabelText('Mark as complete')
    expect(checkbox).toBeTruthy()
  })

  it('renders completed task', () => {
    const { getByLabelText, getByText } = render(<TaskCard title="Task" completed />)
    const checkbox = getByLabelText('Mark as incomplete')
    expect(checkbox).toBeTruthy()
    expect(getByText('✓')).toBeTruthy()
  })

  it('displays due date', () => {
    const { getByText } = render(<TaskCard title="Task" dueDate="2024-01-20" />)
    expect(getByText('2024-01-20')).toBeTruthy()
    expect(getByText('📅')).toBeTruthy()
  })

  it('displays assignee', () => {
    const { getByText } = render(<TaskCard title="Task" assignee="John Doe" />)
    expect(getByText('John Doe')).toBeTruthy()
    expect(getByText('👤')).toBeTruthy()
  })

  it('displays priority badge', () => {
    const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high']
    priorities.forEach((priority) => {
      const { getByText } = render(<TaskCard title="Task" priority={priority} />)
      expect(getByText(priority.toUpperCase())).toBeTruthy()
    })
  })

  it('calls onToggle when checkbox is pressed', () => {
    const onToggle = jest.fn()
    const { getByLabelText } = render(<TaskCard title="Task" onToggle={onToggle} />)

    fireEvent.press(getByLabelText('Mark as complete'))
    expect(onToggle).toHaveBeenCalledWith(true)
  })

  it('calls onToggle with false when completed task is toggled', () => {
    const onToggle = jest.fn()
    const { getByLabelText } = render(<TaskCard title="Task" completed onToggle={onToggle} />)

    fireEvent.press(getByLabelText('Mark as incomplete'))
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(<TaskCard title="Task" onPress={onPress} />)

    fireEvent.press(getByText('Task'))
    expect(onPress).toHaveBeenCalled()
  })

  it('does not make card pressable when onPress is not provided', () => {
    const { getByTestId } = render(<TaskCard title="Task" testID="task" />)
    const card = getByTestId('task')
    expect(card.props.accessibilityRole).toBe('summary')
  })

  it('makes card pressable when onPress is provided', () => {
    const { getByTestId } = render(<TaskCard title="Task" onPress={() => {}} testID="task" />)
    const card = getByTestId('task')
    expect(card.props.accessibilityRole).toBe('button')
  })

  it('applies strikethrough to completed task title', () => {
    const { getByText } = render(<TaskCard title="Completed Task" completed />)
    const title = getByText('Completed Task')
    expect(title.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ textDecorationLine: 'line-through' })])
    )
  })

  it('exposes proper accessibility properties', () => {
    const { getByTestId } = render(
      <TaskCard title="Review PR" priority="high" completed testID="task" />
    )
    const card = getByTestId('task')
    expect(card.props.accessibilityLabel).toContain('Review PR')
    expect(card.props.accessibilityLabel).toContain('completed')
    expect(card.props.accessibilityLabel).toContain('priority high')
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(<TaskCard title="Task" testID="task" style={customStyle} />)
    const card = getByTestId('task')
    expect(card.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
