import React from 'react'
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface QRCodeProps {
  /** Data to encode in QR code */
  value: string
  /** QR code size */
  size?: number
  /** Background color */
  backgroundColor?: string
  /** Foreground color */
  color?: string
  /** Error correction level */
  ecl?: 'L' | 'M' | 'Q' | 'H'
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  backgroundColor = '#ffffff',
  color = '#000000',
  ecl = 'M',
  style,
}) => {
  // Note: In a real implementation, use react-native-qrcode-svg
  // This is a placeholder showing the interface

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={`QR code for ${value}`}
      accessibilityHint={`Error correction level ${ecl}`}
    >
      <View style={styles.qrPlaceholder}>
        {/* QR code pattern placeholder */}
        <View style={styles.qrPattern}>
          {[...Array(5)].map((_, row) => (
            <View key={row} style={styles.qrRow}>
              {[...Array(5)].map((_, col) => (
                <View
                  key={col}
                  style={[
                    styles.qrBlock,
                    (row + col) % 2 === 0 && { backgroundColor: color },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
        <Text style={[styles.qrText, { color }]}>QR</Text>
      </View>
    </View>
  )
}

QRCode.displayName = 'QRCode'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: semanticSpacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  qrPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  qrPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  qrRow: {
    flexDirection: 'row',
    flex: 1,
  },
  qrBlock: {
    flex: 1,
    margin: 1,
    backgroundColor: 'transparent',
  },
  qrText: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
  },
})
