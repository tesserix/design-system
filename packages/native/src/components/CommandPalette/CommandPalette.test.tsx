import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { CommandPalette, CommandItem } from './CommandPalette'

describe('CommandPalette', () => {
  const mockCommands: CommandItem[] = [
    {
      id: 'new-file',
      label: 'New File',
      description: 'Create a new file',
      icon: '📄',
      keywords: ['create', 'file'],
      onSelect: jest.fn(),
    },
    {
      id: 'open-settings',
      label: 'Open Settings',
      description: 'Open application settings',
      icon: '⚙️',
      keywords: ['preferences', 'config'],
      onSelect: jest.fn(),
    },
    {
      id: 'save',
      label: 'Save',
      onSelect: jest.fn(),
    },
  ]

  it('renders when visible', () => {
    const { getByText } = render(
      <CommandPalette visible={true} onClose={() => {}} commands={mockCommands} />
    )
    expect(getByText('New File')).toBeTruthy()
    expect(getByText('Open Settings')).toBeTruthy()
  })

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <CommandPalette visible={false} onClose={() => {}} commands={mockCommands} />
    )
    expect(queryByText('New File')).toBeNull()
  })

  it('displays all commands initially', () => {
    const { getByText } = render(
      <CommandPalette visible={true} onClose={() => {}} commands={mockCommands} />
    )
    expect(getByText('New File')).toBeTruthy()
    expect(getByText('Open Settings')).toBeTruthy()
    expect(getByText('Save')).toBeTruthy()
  })

  it('filters commands based on search query', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <CommandPalette visible={true} onClose={() => {}} commands={mockCommands} />
    )

    const input = getByPlaceholderText('Type a command or search...')
    fireEvent.changeText(input, 'file')

    expect(getByText('New File')).toBeTruthy()
    expect(queryByText('Open Settings')).toBeNull()
    expect(queryByText('Save')).toBeNull()
  })

  it('filters by description', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <CommandPalette visible={true} onClose={() => {}} commands={mockCommands} />
    )

    const input = getByPlaceholderText('Type a command or search...')
    fireEvent.changeText(input, 'settings')

    expect(getByText('Open Settings')).toBeTruthy()
    expect(queryByText('New File')).toBeNull()
  })

  it('filters by keywords', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <CommandPalette visible={true} onClose={() => {}} commands={mockCommands} />
    )

    const input = getByPlaceholderText('Type a command or search...')
    fireEvent.changeText(input, 'create')

    expect(getByText('New File')).toBeTruthy()
    expect(queryByText('Open Settings')).toBeNull()
  })

  it('shows empty state when no commands match', () => {
    const { getByPlaceholderText, getByText } = render(
      <CommandPalette visible={true} onClose={() => {}} commands={mockCommands} />
    )

    const input = getByPlaceholderText('Type a command or search...')
    fireEvent.changeText(input, 'nonexistent')

    expect(getByText('No commands found')).toBeTruthy()
  })

  it('calls onSelect and onClose when command is selected', () => {
    const onClose = jest.fn()
    const { getByText } = render(
      <CommandPalette visible={true} onClose={onClose} commands={mockCommands} />
    )

    fireEvent.press(getByText('New File'))

    expect(mockCommands[0].onSelect).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('displays command icons', () => {
    const { getByText } = render(
      <CommandPalette visible={true} onClose={() => {}} commands={mockCommands} />
    )
    expect(getByText('📄')).toBeTruthy()
    expect(getByText('⚙️')).toBeTruthy()
  })

  it('displays command descriptions', () => {
    const { getByText } = render(
      <CommandPalette visible={true} onClose={() => {}} commands={mockCommands} />
    )
    expect(getByText('Create a new file')).toBeTruthy()
    expect(getByText('Open application settings')).toBeTruthy()
  })

  it('uses custom placeholder', () => {
    const { getByPlaceholderText } = render(
      <CommandPalette
        visible={true}
        onClose={() => {}}
        commands={mockCommands}
        placeholder="Custom placeholder"
      />
    )
    expect(getByPlaceholderText('Custom placeholder')).toBeTruthy()
  })
})
