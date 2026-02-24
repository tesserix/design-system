import React, { useState, useEffect } from 'react'
import {
  Modal,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: string
  keywords?: string[]
  onSelect: () => void
}

export interface CommandPaletteProps {
  /** Whether the palette is visible */
  visible: boolean
  /** Callback to close the palette */
  onClose: () => void
  /** Available commands */
  commands: CommandItem[]
  /** Placeholder text for search input */
  placeholder?: string
  /** Test ID for testing */
  testID?: string
}

/**
 * CommandPalette component - Quick action search modal (CMD+K style)
 *
 * @example
 * ```tsx
 * <CommandPalette
 *   visible={isPaletteOpen}
 *   onClose={() => setIsPaletteOpen(false)}
 *   commands={[
 *     {
 *       id: 'new-file',
 *       label: 'New File',
 *       icon: '📄',
 *       onSelect: () => createNewFile()
 *     }
 *   ]}
 * />
 * ```
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  visible,
  onClose,
  commands,
  placeholder = 'Type a command or search...',
  testID,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCommands, setFilteredCommands] = useState(commands)

  useEffect(() => {
    if (!searchQuery) {
      setFilteredCommands(commands)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = commands.filter((cmd) => {
      const labelMatch = cmd.label.toLowerCase().includes(query)
      const descMatch = cmd.description?.toLowerCase().includes(query)
      const keywordsMatch = cmd.keywords?.some((kw) => kw.toLowerCase().includes(query))
      return labelMatch || descMatch || keywordsMatch
    })

    setFilteredCommands(filtered)
  }, [searchQuery, commands])

  useEffect(() => {
    if (!visible) {
      setSearchQuery('')
    }
  }, [visible])

  const handleSelect = (command: CommandItem) => {
    command.onSelect()
    onClose()
  }

  const overlayStyle: ViewStyle = {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 100,
    paddingHorizontal: spacing[4],
  }

  const containerStyle: ViewStyle = {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: 500,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  }

  const searchContainerStyle: ViewStyle = {
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  }

  const inputStyle: TextStyle = {
    fontSize: fontSize.base,
    color: '#111827',
    padding: spacing[2],
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  }

  const listStyle: ViewStyle = {
    maxHeight: 400,
  }

  const itemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  }

  const iconStyle: TextStyle = {
    fontSize: fontSize.xl,
    marginRight: spacing[3],
  }

  const labelStyle: TextStyle = {
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
    color: '#111827',
    marginBottom: spacing[1],
  }

  const descriptionStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
  }

  const emptyStyle: ViewStyle = {
    padding: spacing[6],
    alignItems: 'center',
  }

  const emptyTextStyle: TextStyle = {
    fontSize: fontSize.base,
    color: '#9ca3af',
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID={testID}
    >
      <TouchableOpacity style={overlayStyle} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={containerStyle}>
            <View style={searchContainerStyle}>
              <TextInput
                style={inputStyle}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                autoFocus
                accessible
                accessibilityRole="search"
                accessibilityLabel="Search commands"
              />
            </View>

            <FlatList
              style={listStyle}
              data={filteredCommands}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={itemStyle}
                  onPress={() => handleSelect(item)}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  accessibilityHint={item.description}
                >
                  {item.icon && <Text style={iconStyle}>{item.icon}</Text>}
                  <View style={{ flex: 1 }}>
                    <Text style={labelStyle}>{item.label}</Text>
                    {item.description && <Text style={descriptionStyle}>{item.description}</Text>}
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={emptyStyle}>
                  <Text style={emptyTextStyle}>No commands found</Text>
                </View>
              }
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}

CommandPalette.displayName = 'CommandPalette'
