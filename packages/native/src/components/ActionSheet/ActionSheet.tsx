import React from 'react'
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  ViewStyle,
} from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface ActionSheetOption {
  id?: string
  label: string
  onPress: () => void
  destructive?: boolean
  disabled?: boolean
}

export interface ActionSheetProps {
  /** Whether action sheet is visible */
  isOpen: boolean
  /** Callback when action sheet should close */
  onClose: () => void
  /** Action sheet options */
  options: ActionSheetOption[]
  /** Cancel button label */
  cancelLabel?: string
  /** Title of action sheet */
  title?: string
  /** Whether clicking overlay closes action sheet */
  closeOnOverlayClick?: boolean
  /** Accessibility label for sheet content */
  accessibilityLabel?: string
  /** Custom container style */
  style?: ViewStyle
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  onClose,
  options,
  cancelLabel = 'Cancel',
  title,
  closeOnOverlayClick = true,
  accessibilityLabel = 'Action sheet',
  style,
}) => {
  const handleOptionPress = (option: ActionSheetOption) => {
    if (!option.disabled) {
      option.onPress()
      onClose()
    }
  }

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          activeOpacity={1}
          onPress={closeOnOverlayClick ? onClose : undefined}
        />
        <View
          style={[
            {
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: spacing[6],
            },
            style,
          ]}
          accessible
          accessibilityLabel={accessibilityLabel}
        >
          {title && (
            <View
              style={{
                paddingTop: spacing[6],
                paddingHorizontal: spacing[6],
                paddingBottom: spacing[2],
                borderBottomWidth: 1,
                borderBottomColor: '#e5e7eb',
              }}
            >
              <Text
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: '600',
                  color: '#1f2937',
                  textAlign: 'center',
                }}
              >
                {title}
              </Text>
            </View>
          )}
          <FlatList
            data={options}
            keyExtractor={(item, index) => item.id ?? `${item.label}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleOptionPress(item)}
                disabled={item.disabled}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityState={{ disabled: item.disabled }}
                style={{
                  paddingVertical: spacing[4],
                  paddingHorizontal: spacing[6],
                  borderBottomWidth: 1,
                  borderBottomColor: '#e5e7eb',
                  opacity: item.disabled ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSize.base,
                    color: item.destructive ? '#ef4444' : '#1f2937',
                    textAlign: 'center',
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
            style={{
              paddingVertical: spacing[4],
              paddingHorizontal: spacing[6],
              marginTop: spacing[2],
            }}
          >
            <Text
              style={{
                fontSize: fontSize.base,
                fontWeight: '600',
                color: '#3b82f6',
                textAlign: 'center',
              }}
            >
              {cancelLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

ActionSheet.displayName = 'ActionSheet'
