import React from 'react'
import { View, Modal, ActivityIndicator, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface LoadingOverlayProps {
  /** Whether overlay is visible */
  visible: boolean
  /** Loading message */
  message?: string
  /** Loading color */
  color?: string
  /** Test ID */
  testID?: string
  /** Custom container style */
  style?: ViewStyle
  /** Custom text style */
  textStyle?: TextStyle
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
  color = '#3b82f6',
  testID,
  style,
  textStyle,
}) => {
  if (!visible) return null

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        testID={testID}
        style={[
          {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}
      >
        <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: spacing[6],
            alignItems: 'center',
            minWidth: 120,
          }}
        >
          <ActivityIndicator size="large" color={color} />
          {message && (
            <Text
              style={[
                {
                  marginTop: spacing[4],
                  fontSize: fontSize.base,
                  color: '#1f2937',
                },
                textStyle,
              ]}
            >
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  )
}

LoadingOverlay.displayName = 'LoadingOverlay'
