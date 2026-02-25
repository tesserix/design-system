import React from 'react'
import { View, Text } from 'react-native'

export interface TestProps {
  text?: string
}

export const Test: React.FC<TestProps> = ({ text = 'Test Component' }) => {
  return (
    <View style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{text}</Text>
    </View>
  )
}
